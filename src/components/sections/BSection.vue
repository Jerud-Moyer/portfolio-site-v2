<script setup lang="ts">
import { getSectionProgress, getSectionProgressByVh, lerp } from '@/composables/useScrollMonitor'
import type { ScrollMonitor } from '@/types'
import { computed, inject } from 'vue'
import CircleDeco from '../CircleDeco.vue'

const scrollMonitor = inject<ScrollMonitor>('scroll-monitor')
const scrollY = scrollMonitor?.scrollY
const vh = scrollMonitor?.viewportHeight

const subHeadingTranslateY = computed(() => {
  // this is not working?!
  //   return `${(scrollY?.value ?? 0) * 0.005}vh`
  const progress = getSectionProgress(scrollY?.value ?? 0, 'b')
  return `${lerp(0, -120, progress)}vh`
})

const circleTranslateX = computed(() => {
  const progress = getSectionProgressByVh(scrollY?.value ?? 0, 'b', vh?.value ?? 0, 3)
  return `${lerp(-20, 120, progress)}vw`
})

const circleTranslateY = computed(() => {
  const progress = getSectionProgressByVh(scrollY?.value ?? 0, 'b', vh?.value ?? 0, 4)
  return `${lerp(-20, 120, progress)}vh`
})

const headingTranslateX = computed(() => {
  const progress = getSectionProgress((scrollY?.value ?? 0) * 1.8, 'b')
  return `${lerp(-30, 35, progress)}vw`
})
</script>

<template>
  <div>
    <div
      class="fixed left-[6vw] top-[100vh] p-12 font-inconsolata text-lt-grey text-4xl"
      :style="{
        transition: 'transform 100ms',
        transform: `translateY(${subHeadingTranslateY})`,
      }"
    >
      <p>websites</p>
      <p>apps</p>
      <p>whatever...</p>
    </div>
    <CircleDeco
      :width="300"
      fill-color="#7c7c79"
      class="fixed top-[24vh] left-0"
      :style="{
        transition: 'transform 100ms',
        transform: `translate(${circleTranslateX}, ${circleTranslateY})`,
      }"
    />
    <p
      class="text-6xl font-inconsolata fixed top-[30vh] -left-[20vw] text-muted-teal text-shadow-sm text-shadow-carbon"
      :style="{
        transition: 'transform 100ms',
        transform: `translateX(${headingTranslateX})`,
      }"
    >
      software developer
    </p>
    <div class="flex flex-row"></div>
  </div>
</template>

<style scoped></style>
