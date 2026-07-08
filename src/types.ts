import type { ComputedRef, Ref } from 'vue'
import type { SCROLL_SECTION_BREAKS_VH } from './composables/useScrollMonitor'

export type SectionId = keyof typeof SCROLL_SECTION_BREAKS_VH

export interface ScrollMonitor {
  scrollY: Ref<number>
  headerLocked: Ref<boolean>
  setHeaderLocked: (bool: boolean) => void
  viewportWidth: Ref<number>
  viewportHeight: Ref<number>
  INITIAL_LOGO_WIDTH: number
  INITIAL_HEADER_HEIGHT: number
  TARGET_HEADER_HEIGHT: number
  SCROLL_SECTION_BREAKS_VH: typeof SCROLL_SECTION_BREAKS_VH
  sectionBreaks: ComputedRef<Record<SectionId, { start: number; end: number }>>
  getProgress: (sectionId: SectionId) => number
  getProgressByVh: (sectionId: SectionId, screens?: number) => number
  totalScrollHeightVh: ComputedRef<string>
  headerHeight: ComputedRef<number>
}

export type Project = {
  title: string
  description: string
  technologies: string[]
  projectUrl: string
  gitUrl: string
  imgFileName: string
}
