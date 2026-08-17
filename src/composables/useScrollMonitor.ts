import { SECTION_IDS, type SectionId, type SectionRange, type ViewportProfile } from '@/types'
import { ref, onMounted, onUnmounted, computed } from 'vue'

/**
 * Each section declares how long it runs (in viewport-heights of scroll)
 * and how far it starts *before* the previous section ends. Starts are
 * derived by accumulation, so retuning one section shifts everything after
 * it automatically instead of requiring hand-edited absolute values.
 *
 * Chain order comes from SECTION_IDS, not from the key order here.
 */
export type SectionTiming = { duration: number; overlap: number }

export const SECTION_TIMELINES: Record<ViewportProfile, Record<SectionId, SectionTiming>> = {
  // Reproduces the original absolute table exactly:
  // a 0→4, b 3.5→10, c 9.5→19.5, d 14→24, e 20→41.
  desktop: {
    a: { duration: 4, overlap: 0 },
    b: { duration: 6.5, overlap: 0.5 },
    c: { duration: 10, overlap: 0.5 },
    d: { duration: 10, overlap: 5.5 },
    e: { duration: 21, overlap: 4 },
  },
  tablet: {
    a: { duration: 3.5, overlap: 0 },
    b: { duration: 5.5, overlap: 0.5 },
    c: { duration: 8, overlap: 0.5 },
    d: { duration: 8, overlap: 4 },
    e: { duration: 16, overlap: 3 },
  },
  // Starting point only — shorter durations (a phone screen of scroll is
  // ~2 thumb swipes) and reduced overlap (two sections sharing a narrow
  // screen reads as clutter, not crossfade).
  mobile: {
    a: { duration: 2.5, overlap: 0 },
    b: { duration: 4, overlap: 0.4 },
    c: { duration: 6.5, overlap: 0.4 },
    d: { duration: 6.5, overlap: 2 },
    e: { duration: 11, overlap: 1.5 },
  },
}

export const HEADER_PROFILES: Record<
  ViewportProfile,
  {
    logoWidth: number
    logoTargetWidth: number
    initialHeight: number
    targetHeight: number
    collapseVh: number
  }
> = {
  // Targets are the start width scaled by targetHeight/initialHeight, which
  // reproduces a logo that shrank proportionally with the header.
  desktop: {
    logoWidth: 360,
    logoTargetWidth: 84,
    initialHeight: 600,
    targetHeight: 86,
    collapseVh: 0.5,
  },
  tablet: {
    logoWidth: 300,
    logoTargetWidth: 48,
    initialHeight: 480,
    targetHeight: 76,
    collapseVh: 0.5,
  },
  mobile: {
    logoWidth: 200,
    logoTargetWidth: 42,
    initialHeight: 300,
    targetHeight: 64,
    collapseVh: 0.45,
  },
}

export const MOBILE_MAX_WIDTH = 640
export const TABLET_MAX_WIDTH = 1024

export function getSectionProgress(scrollY: number, start: number, end: number): number {
  if (end <= start) return scrollY >= end ? 1 : 0
  const progress = (scrollY - start) / (end - start)
  return Math.min(Math.max(progress, 0), 1)
}

export function lerp(start: number, end: number, progress: number): number {
  // linear interpolation
  return start + progress * (end - start)
}

export const smoothstep = (t: number) => {
  t = Math.max(0, Math.min(1, t))
  return t * t * (3 - 2 * t)
}

/** Accumulate duration/overlap pairs into absolute vh-multiple ranges. */
function buildTimeline(timing: Record<SectionId, SectionTiming>) {
  const breaks = {} as Record<SectionId, SectionRange>
  let cursor = 0
  for (const id of SECTION_IDS) {
    const { duration, overlap } = timing[id]
    const start = Math.max(0, cursor - overlap)
    const end = start + duration
    breaks[id] = { start, end }
    cursor = end
  }
  return { breaks, total: cursor }
}

/**
 * Measures 100svh via a throwaway probe element. Unlike window.innerHeight,
 * the small-viewport unit does NOT change when the mobile URL bar shows or
 * hides — which is what keeps the timeline from shifting mid-scroll.
 */
function measureStableViewportHeight(): number {
  if (typeof CSS !== 'undefined' && CSS.supports?.('height', '100svh')) {
    const probe = document.createElement('div')
    probe.style.cssText =
      'position:fixed;top:0;left:0;width:0;height:100svh;visibility:hidden;pointer-events:none'
    document.body.appendChild(probe)
    const height = probe.getBoundingClientRect().height
    probe.remove()
    if (height > 0) return height
  }
  return window.innerHeight
}

let instance: ReturnType<typeof createScrollMonitor> | null = null

function createScrollMonitor() {
  const scrollY = ref<number>(0)
  const viewportWidth = ref<number>(window.innerWidth)
  const viewportHeight = ref<number>(window.innerHeight)

  // rAF-coalesced: never stale, never more than one write per frame.
  let scrollQueued = false
  const onScroll = () => {
    if (scrollQueued) return
    scrollQueued = true
    requestAnimationFrame(() => {
      scrollY.value = window.scrollY
      scrollQueued = false
    })
  }

  let resizeQueued = false
  const onResize = () => {
    if (resizeQueued) return
    resizeQueued = true
    requestAnimationFrame(() => {
      resizeQueued = false
      const nextWidth = window.innerWidth
      const nextHeight = measureStableViewportHeight()
      // svh is URL-bar-stable, so any change here is a genuine resize
      // or orientation change and should rebuild the timeline.
      if (nextWidth !== viewportWidth.value) viewportWidth.value = nextWidth
      if (Math.abs(nextHeight - viewportHeight.value) > 1) viewportHeight.value = nextHeight
    })
  }

  onMounted(() => {
    viewportHeight.value = measureStableViewportHeight()
    scrollY.value = window.scrollY
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onResize)
    window.removeEventListener('orientationchange', onResize)
  })

  const profile = computed<ViewportProfile>(() => {
    if (viewportWidth.value <= MOBILE_MAX_WIDTH) return 'mobile'
    if (viewportWidth.value <= TABLET_MAX_WIDTH) return 'tablet'
    return 'desktop'
  })

  const timeline = computed(() => buildTimeline(SECTION_TIMELINES[profile.value]))

  /** vh-multiple ranges, before pixel conversion. Useful for debugging. */
  const sectionBreaksVh = computed(() => timeline.value.breaks)

  const sectionBreaks = computed<Record<SectionId, SectionRange>>(() => {
    const vh = viewportHeight.value
    const source = timeline.value.breaks
    const result = {} as Record<SectionId, SectionRange>
    for (const id of SECTION_IDS) {
      result[id] = { start: source[id].start * vh, end: source[id].end * vh }
    }
    return result
  })

  const getProgress = (sectionId: SectionId) => {
    const { start, end } = sectionBreaks.value[sectionId]
    return getSectionProgress(scrollY.value, start, end)
  }

  /**
   * Progress across a sub-range of a section, expressed as fractions of that
   * section's duration. Stays proportional across profiles
   */
  const getPhaseProgress = (sectionId: SectionId, from = 0, to = 1) => {
    const p = getProgress(sectionId)
    if (to <= from) return p >= to ? 1 : 0
    return Math.min(Math.max((p - from) / (to - from), 0), 1)
  }

  const inSection = (sectionId: SectionId) => {
    const { start, end } = sectionBreaks.value[sectionId]
    return scrollY.value > start && scrollY.value < end
  }

  const headerConfig = computed(() => HEADER_PROFILES[profile.value])
  const targetHeaderHeight = computed(() => headerConfig.value.targetHeight)

  /** 0 = fully expanded, 1 = fully collapsed. Viewport-independent. */
  const headerProgress = computed(() =>
    getSectionProgress(scrollY.value, 0, headerConfig.value.collapseVh * viewportHeight.value),
  )

  const headerHeight = computed(() =>
    lerp(headerConfig.value.initialHeight, headerConfig.value.targetHeight, headerProgress.value),
  )

  const logoWidth = computed(() =>
    lerp(
      headerConfig.value.logoWidth,
      headerConfig.value.logoTargetWidth,
      smoothstep(headerProgress.value),
    ),
  )

  /**
   * Document height in PIXELS, derived from the same viewportHeight the JS
   * math uses. Must not be a vh string — CSS vh resolves against the large
   * viewport on mobile and would desync maxScrollY from the last section's end.
   */
  const totalScrollHeight = computed(() => `${(timeline.value.total + 1) * viewportHeight.value}px`)

  return {
    scrollY,
    viewportWidth,
    viewportHeight,
    profile,
    logoWidth,
    targetHeaderHeight,
    headerProgress,
    headerHeight,
    sectionBreaksVh,
    sectionBreaks,
    getProgress,
    getPhaseProgress,
    inSection,
    totalScrollHeight,
  }
}

export function useScrollMonitor() {
  if (!instance) instance = createScrollMonitor()
  return instance
}
