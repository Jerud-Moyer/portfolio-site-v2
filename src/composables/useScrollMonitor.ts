import { ref, onMounted, onUnmounted, computed } from 'vue'

export const INITIAL_LOGO_WIDTH = 360
export const INITIAL_HEADER_HEIGHT = 600
export const TARGET_HEADER_HEIGHT = 86
export const SCROLL_SECTION_BREAKS = {
  a: { start: 0, end: 4000 },
  b: { start: 3500, end: 10000 },
}

export type SectionId = keyof typeof SCROLL_SECTION_BREAKS

export function getSectionProgress(scrollY: number, sectionId: SectionId): number {
  const { start, end } = SCROLL_SECTION_BREAKS[sectionId]
  const progress = (scrollY - start) / (end - start)
  return Math.min(Math.max(progress, 0), 1)
}

export function getSectionProgressByVh(
  scrollY: number,
  sectionId: SectionId,
  vh: number,
  screens = 1,
): number {
  const { start } = SCROLL_SECTION_BREAKS[sectionId]
  const progress = (scrollY - start) / (vh * screens)
  return Math.min(Math.max(progress, 0), 1)
}

export function lerp(start: number, end: number, progress: number): number {
  //  linear interpolation
  return start + progress * (end - start)
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

  return {
    scrollY,
    headerLocked,
    setHeaderLocked,
    viewportWidth,
    viewportHeight,
    INITIAL_LOGO_WIDTH,
    INITIAL_HEADER_HEIGHT,
    TARGET_HEADER_HEIGHT,
    SCROLL_SECTION_BREAKS,
    headerHeight,
  }
}
