import type { ComputedRef, Ref } from 'vue'

export type ScrollMonitor = {
  scrollY: Ref<number>
  headerHeight: Ref<number>
  INITIAL_LOGO_WIDTH: number
  INITIAL_HEADER_HEIGHT: number
  TARGET_HEADER_HEIGHT: number
  viewportHeight: Ref<number>
  viewportWidth: Ref<number>
  scrollProgress: ComputedRef<number>
}
