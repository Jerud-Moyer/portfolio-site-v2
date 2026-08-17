import type { ComputedRef, Ref } from 'vue'

export const SECTION_IDS = ['a', 'b', 'c', 'd', 'e'] as const
export type SectionId = (typeof SECTION_IDS)[number]
export type SectionRange = { start: number; end: number }
export type ViewportProfile = 'mobile' | 'tablet' | 'desktop'

export interface ScrollMonitor {
  scrollY: Ref<number>
  viewportWidth: Ref<number>
  viewportHeight: Ref<number>
  profile: ComputedRef<ViewportProfile>
  targetHeaderHeight: ComputedRef<number>
  headerProgress: ComputedRef<number>
  headerHeight: ComputedRef<number>
  logoWidth: ComputedRef<number>
  sectionBreaksVh: ComputedRef<Record<SectionId, SectionRange>>
  sectionBreaks: ComputedRef<Record<SectionId, SectionRange>>
  getProgress: (sectionId: SectionId) => number
  getPhaseProgress: (sectionId: SectionId, from?: number, to?: number) => number
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
