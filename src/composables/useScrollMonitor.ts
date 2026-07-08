import type { SectionId } from '@/types'
import { ref, onMounted, onUnmounted, computed } from 'vue'

export const INITIAL_LOGO_WIDTH = 360
export const INITIAL_HEADER_HEIGHT = 600
export const TARGET_HEADER_HEIGHT = 86

// Expressed as multiples of viewport height (vh), not raw pixels.
// Keeps every section's scroll range proportional to the current viewport,
// so the final section's animations always finish right at the bottom of
// the page — no matter how tall or short the window is.
export const SCROLL_SECTION_BREAKS_VH = {
  a: { start: 0, end: 4 },
  b: { start: 3.5, end: 10 },
  c: { start: 9.5, end: 15 },
  d: { start: 14.5, end: 20 },
  e: { start: 18, end: 40 },
} as const

// Total scroll length of the page, in vh multiples. Keep this at exactly
// (last section's end) so max scrollY lines up with section e's end in px.
export const TOTAL_SCROLL_VH = SCROLL_SECTION_BREAKS_VH.e.end

export function getSectionProgress(scrollY: number, start: number, end: number): number {
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

export function useScrollMonitor() {
  const scrollY = ref<number>(0)
  const headerLocked = ref<boolean>(false)
  const viewportWidth = ref<number>(window.innerWidth)
  const viewportHeight = ref<number>(window.innerHeight)

  const setHeaderLocked = (bool: boolean) => {
    headerLocked.value = bool
  }

  const _throttle = <T extends unknown[]>(callback: (...args: T) => void, ms: number) => {
    let wait = false
    return function (...args: T) {
      if (!wait) {
        callback(...args)
        wait = true
        setTimeout(() => {
          wait = false
        }, ms)
      }
    }
  }

  const throttledScroll = _throttle((_e: Event) => {
    scrollY.value = window.scrollY
  }, 50)

  const throttledResize = _throttle(() => {
    viewportWidth.value = window.innerWidth
    viewportHeight.value = window.innerHeight
  }, 100)

  onMounted(() => {
    window.addEventListener('scroll', throttledScroll)
    window.addEventListener('resize', throttledResize)
  })
  onUnmounted(() => {
    window.removeEventListener('scroll', throttledScroll)
    window.removeEventListener('resize', throttledResize)
  })

  const headerHeight = computed(() => {
    const adjustedHeight = INITIAL_HEADER_HEIGHT - (scrollY.value ?? 0)
    return adjustedHeight <= TARGET_HEADER_HEIGHT ? TARGET_HEADER_HEIGHT : adjustedHeight
  })

  // Reactive pixel breakpoints, derived from the vh-multiple constants and
  // the current viewport height. Recomputes automatically on resize.
  const sectionBreaks = computed(() => {
    const vh = viewportHeight.value
    const result = {} as Record<SectionId, { start: number; end: number }>
    for (const key of Object.keys(SCROLL_SECTION_BREAKS_VH) as SectionId[]) {
      const { start, end } = SCROLL_SECTION_BREAKS_VH[key]
      result[key] = { start: start * vh, end: end * vh }
    }
    return result
  })

  const getProgress = (sectionId: SectionId) => {
    const { start, end } = sectionBreaks.value[sectionId]
    return getSectionProgress(scrollY.value, start, end)
  }

  const getProgressByVh = (sectionId: SectionId, screens = 1) => {
    const { start } = sectionBreaks.value[sectionId]
    const progress = (scrollY.value - start) / (viewportHeight.value * screens)
    return Math.min(Math.max(progress, 0), 1)
  }

  // Total document height in px, matching TOTAL_SCROLL_VH exactly so that
  // maxScrollY (docHeight - viewportHeight) lines up with section e's end.
  const totalScrollHeightVh = computed(() => `${(TOTAL_SCROLL_VH + 1) * 100}vh`)

  return {
    scrollY,
    headerLocked,
    setHeaderLocked,
    viewportWidth,
    viewportHeight,
    INITIAL_LOGO_WIDTH,
    INITIAL_HEADER_HEIGHT,
    TARGET_HEADER_HEIGHT,
    SCROLL_SECTION_BREAKS_VH,
    sectionBreaks,
    getProgress,
    getProgressByVh,
    totalScrollHeightVh,
    headerHeight,
  }
}
