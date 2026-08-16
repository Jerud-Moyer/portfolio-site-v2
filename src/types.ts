import type { ComputedRef, Ref } from 'vue'
// import type { SCROLL_SECTION_BREAKS_VH } from './composables/useScrollMonitor'

// export type SectionId = keyof typeof SCROLL_SECTION_BREAKS_VH

export const SECTION_IDS = ['a', 'b', 'c', 'd', 'e'] as const
export type SectionId = (typeof SECTION_IDS)[number]
export type SectionRange = { start: number; end: number }
export type ViewportProfile = 'mobile' | 'tablet' | 'desktop'

export interface ScrollMonitor {
  scrollY: Ref<number>
  headerLocked: Ref<boolean>
  setHeaderLocked: (bool: boolean) => void
  viewportWidth: Ref<number>
  viewportHeight: Ref<number>
  profile: ComputedRef<ViewportProfile>
  isPortrait: ComputedRef<boolean>
  initialLogoWidth: ComputedRef<number>
  initialHeaderHeight: ComputedRef<number>
  targetHeaderHeight: ComputedRef<number>
  headerProgress: ComputedRef<number>
  headerHeight: ComputedRef<number>
  logoWidth: ComputedRef<number>
  sectionBreaksVh: ComputedRef<Record<SectionId, SectionRange>>
  sectionBreaks: ComputedRef<Record<SectionId, SectionRange>>
  getProgress: (sectionId: SectionId) => number
  getPhaseProgress: (sectionId: SectionId, from?: number, to?: number) => number
  getProgressByVh: (sectionId: SectionId, screens?: number) => number
  inSection: (sectionId: SectionId) => boolean
  totalScrollHeight: ComputedRef<string>
}

export type Project = {
  title: string
  description: string
  technologies: string[]
  projectUrl: string
  gitUrl: string
  imgFileName: string
}
