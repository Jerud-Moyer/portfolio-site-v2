<script setup lang="ts">
import CircleDeco from '@/components/CircleDeco.vue'
import Header from '@/components/Header.vue'
import type { ScrollMonitor } from '@/types'
import { computed, inject } from 'vue'

const scrollMonitor = inject<ScrollMonitor>('scroll-monitor')
const headerHeight = scrollMonitor?.headerHeight
const targetHeaderHeight = scrollMonitor?.TARGET_HEADER_HEIGHT ?? 0
const scrollY = scrollMonitor?.scrollY
const scrollProgress = scrollMonitor?.scrollProgress
const vw = scrollMonitor?.viewportWidth
const vh = scrollMonitor?.viewportHeight

const backgroundColor = computed<string>(() => {
  if (headerHeight?.value && headerHeight?.value <= targetHeaderHeight + 100) return 'bg-graphite'
  if (headerHeight?.value && headerHeight?.value <= targetHeaderHeight + 500) return 'bg-carbon'
  return 'bg-md-grey'
})

const inTitleZone = computed<boolean>(() => {
  return (headerHeight?.value ?? 0) <= targetHeaderHeight + 100 && (scrollY?.value ?? 0) < 5000
})

const groupScrollUp = computed(() => {
  // starts moving after some scroll threshold, in vh units
  const threshold = vh?.value ? vh.value * 2.5 : 1600
  const progress = Math.max(0, (scrollY?.value ?? 0) - threshold)
  const moveVh = -(progress / (vh?.value ?? 800)) * 100 // converts px scrolled to vh
  return Math.max(moveVh, -120) // clamp — -120vh sends them fully off screen
})

const textTranslateY = computed(() => {
  // initial position in vh + scroll-up exit
  const initialVh = 40
  return `calc(${initialVh}vh + ${groupScrollUp.value}vh)`
})

const circleOneTranslateY = computed(() => `calc(-80px + ${groupScrollUp.value}vh)`)
const circleTwoTranslateY = computed(() => `calc(350px + ${groupScrollUp.value}vh)`)

// circle A-1: slides in from right, travels ~30vw over the first screen
const circleOneTranslateX = computed(() => {
  const start = 30 // vw offset at scroll 0
  const end = -30 // vw offset after one full viewport scroll
  const raw = start + (scrollProgress?.value ?? 0) * (end - start)
  return `${Math.max(raw, -64)}vw` // clamp
})

// circle A-2: faster, deeper travel — 2 screens worth
const circleTwoTranslateX = computed(() => {
  const progress = (scrollY?.value ?? 0) / ((vh?.value ?? 800) * 2)
  const start = 40 // vw, starts off-right
  const end = -75 // vw, final position
  const raw = start + Math.min(progress, 1) * (end - start)
  return `${Math.max(raw, -200)}vw` // clamp matches end
})
</script>

<template>
  <main
    class="flex flex-col justify-center-safe p-4 w-full min-h-[1000vh] transition-colors duration-500"
    :class="backgroundColor"
  >
    <Header class="fixed top-0 left-0" />
    <p
      v-if="inTitleZone"
      class="z-1 fixed left-[50vw] text-9xl font-crimson-text-bold text-shadow-md text-shadow-carbon"
      :class="scrollY && scrollY >= 1780 ? 'text-lt-grey' : 'text-cinnamon'"
      :style="{
        top: '0',
        transition: 'color 300ms, transform 100ms',
        transform: `translateX(-50%) translateY(${textTranslateY})`,
      }"
    >
      Jerud Moyer
    </p>

    <CircleDeco
      id="circle_a"
      :width="600"
      fillColor="#417b5a"
      class="fixed -right-[30vw] transition-all duration-100"
      :style="{
        top: '35vh',
        transform: `translateX(${circleOneTranslateX}) translateY(${circleOneTranslateY})`,
      }"
    />
    <CircleDeco
      id="circle_b"
      :width="150"
      fillColor="#b07156"
      outlineColor="#3c3c3b"
      class="fixed top-[72vh] -right-[40vw] transition-all duration-100"
      :style="{
        top: '34vh',
        transform: `translateX(${circleTwoTranslateX}) translateY(${circleTwoTranslateY})`,
      }"
    />
    <!-- <div class="container flex flex-col gap-12 pt-12">
      <div class="bg-gunmetal p-6">
        <p class="text-4xl text-beige">Some Logo Examples!</p>
        <Button variant="outlined" label="Button" />
      </div>
      <div class="flex flex-row bg-gunmetal p-6">
        <Logo outlineColor="#FFFFFF" fillColor="transparent" :width="200" />
        <Logo :gradient-fill="true" />
      </div>
      <div class="flex flex-row bg-gunmetal p-6">
        <Logo
          :gradient-fill="true"
          gradient-color-one="#3c3c3b"
          gradient-color-two="#5B8E7D"
          outline-color="#B07156"
        />
        <Logo outline-color="#3c3c3b" fill-color="#B07156" back-fill-color="#558B6E" :width="360" />
      </div>
    </div>
    <div class="container flex flex-col gap-12 pt-12">
      <div class="bg-gunmetal p-6">
        <p class="text-4xl text-beige">Some Logo Examples!</p>
        <Button variant="outlined" label="Button" />
      </div>
      <div class="flex flex-row bg-gunmetal p-6">
        <Logo outlineColor="#FFFFFF" fillColor="transparent" :width="200" />
        <Logo :gradient-fill="true" />
      </div>
      <div class="flex flex-row bg-gunmetal p-6">
        <Logo
          :gradient-fill="true"
          gradient-color-one="#3c3c3b"
          gradient-color-two="#5B8E7D"
          outline-color="#B07156"
        />
        <Logo outline-color="#3c3c3b" fill-color="#B07156" back-fill-color="#558B6E" :width="360" />
      </div>
    </div> -->
  </main>
</template>
