<script setup lang="ts">
import Header from '@/components/Header.vue'
import ASection from '@/components/sections/ASection.vue'
import CSection from '@/components/sections/CSection.vue'
import DSection from '@/components/sections/DSection.vue'
import SectionContainer from '@/components/sections/SectionContainer.vue'
import { SCROLL_SECTION_BREAKS } from '@/composables/useScrollMonitor'
import type { ScrollMonitor } from '@/types'
import { computed, inject } from 'vue'

const scrollMonitor = inject<ScrollMonitor>('scroll-monitor')
const headerHeight = scrollMonitor?.headerHeight
const targetHeaderHeight = scrollMonitor?.TARGET_HEADER_HEIGHT ?? 0
const scrollY = scrollMonitor?.scrollY

const backgroundColor = computed<string>(() => {
  if (inZoneC.value) return 'bg-graphite'
  if (inZoneB.value) return 'bg-gunmetal'

  if (headerHeight?.value && headerHeight?.value <= targetHeaderHeight + 100) return 'bg-graphite'
  if (headerHeight?.value && headerHeight?.value <= targetHeaderHeight + 500) return 'bg-carbon'
  return 'bg-md-grey'
})

const inZoneA = computed<boolean>(() => {
  return (
    (headerHeight?.value ?? 0) <= targetHeaderHeight + 100 &&
    (scrollY?.value ?? 0) < (SCROLL_SECTION_BREAKS['a'].end ?? 0)
  )
})

const inZoneB = computed<boolean>(() => {
  return (
    (scrollY?.value ?? 0) > (SCROLL_SECTION_BREAKS['b'].start ?? 0) &&
    (scrollY?.value ?? 0) < (SCROLL_SECTION_BREAKS['b'].end ?? 0)
  )
})

const inZoneC = computed<boolean>(() => {
  return (
    (scrollY?.value ?? 0) > (SCROLL_SECTION_BREAKS['c'].start ?? 0) &&
    (scrollY?.value ?? 0) < (SCROLL_SECTION_BREAKS['c'].end ?? 0)
  )
})

const inZoneD = computed<boolean>(() => {
  return (
    (scrollY?.value ?? 0) > (SCROLL_SECTION_BREAKS['d'].start ?? 0) &&
    (scrollY?.value ?? 0) < (SCROLL_SECTION_BREAKS['d'].end ?? 0)
  )
})
</script>

<template>
  <main
    class="flex flex-col justify-center-safe p-4 w-full min-h-[2000vh] transition-colors duration-500"
    :class="backgroundColor"
  >
    <Header class="fixed top-0 left-0" />

    <SectionContainer :in-scroll-zone="inZoneA">
      <ASection />
    </SectionContainer>

    <SectionContainer :in-scroll-zone="inZoneB">
      <BSection />
    </SectionContainer>

    <SectionContainer :in-scroll-zone="inZoneC">
      <CSection />
    </SectionContainer>

    <SectionContainer :in-scroll-zone="inZoneD">
      <DSection />
    </SectionContainer>
  </main>
</template>
