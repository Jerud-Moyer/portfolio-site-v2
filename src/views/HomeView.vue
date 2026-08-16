<script setup lang="ts">
import Dots from '@/components/Dots.vue'
import Header from '@/components/Header.vue'
import ASection from '@/components/sections/ASection.vue'
import BSection from '@/components/sections/BSection.vue'
import CSection from '@/components/sections/CSection.vue'
import DSection from '@/components/sections/DSection.vue'
import ESection from '@/components/sections/ESection.vue'
import SectionContainer from '@/components/sections/SectionContainer.vue'
import type { ScrollMonitor } from '@/types'
import { computed, inject } from 'vue'

const scrollMonitor = inject<ScrollMonitor>('scroll-monitor')
const headerProgress = scrollMonitor?.headerProgress
const totalScrollHeight = scrollMonitor?.totalScrollHeight
const inSection = scrollMonitor?.inSection

const backgroundColor = computed<string>(() => {
  if (inZoneC.value) return 'bg-graphite'
  if (inZoneB.value) return 'bg-gunmetal'
  if ((headerProgress?.value ?? 0) >= 0.8) return 'bg-graphite'
  if ((headerProgress?.value ?? 0) >= 0.2) return 'bg-carbon'
  return 'bg-md-grey'
})

const inZoneA = computed(() => (headerProgress?.value ?? 0) >= 0.8 && !!inSection?.('a'))
const inZoneB = computed(() => !!inSection?.('b'))
const inZoneC = computed(() => !!inSection?.('c'))
const inZoneD = computed(() => !!inSection?.('d'))
const inZoneE = computed(() => !!inSection?.('e'))

const showDots = computed(() => {
  const breaks = scrollMonitor?.sectionBreaks.value
  const y = scrollMonitor?.scrollY.value ?? 0
  return !!breaks && y > breaks.b.start && y < breaks.d.end
})
</script>

<template>
  <main
    class="flex flex-col justify-center-safe p-4 w-full transition-colors duration-500"
    :class="backgroundColor"
    :style="{ minHeight: totalScrollHeight }"
  >
    <Header class="fixed top-0 left-0" />

    <transition
      enter-active-class="transition-opacity duration-300 ease-in"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-show="showDots" class="duration-300 ease-in">
        <Dots />
      </div>
    </transition>

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

    <SectionContainer :in-scroll-zone="inZoneE">
      <ESection />
    </SectionContainer>
  </main>
</template>
