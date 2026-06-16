<script setup lang="ts">
import { computed, inject } from 'vue'
import CircleDeco from '../CircleDeco.vue'
import type { ScrollMonitor } from '@/types.ts'
import { getSectionProgressByVh, lerp } from '@/composables/useScrollMonitor'

const scrollMonitor = inject<ScrollMonitor>('scroll-monitor')
const scrollY = scrollMonitor?.scrollY
const vh = scrollMonitor?.viewportHeight

const groupScrollUp = computed(() => {
  const threshold = vh?.value ? vh.value * 2.5 : 1600
  const progress = Math.max(0, (scrollY?.value ?? 0) - threshold)
  const moveVh = -(progress / (vh?.value ?? 800)) * 100
  return Math.max(moveVh, -120)
})

const textTranslateY = computed(() => `calc(40vh + ${groupScrollUp.value}vh)`)
const circleOneTranslateY = computed(() => `calc(-80px + ${groupScrollUp.value}vh)`)
const circleTwoTranslateY = computed(() => `calc(350px + ${groupScrollUp.value}vh)`)

const circleOneTranslateX = computed(() => {
  const progress = getSectionProgressByVh(scrollY?.value ?? 0, 'a', vh?.value ?? 800, 1)
  return `${lerp(30, -64, progress)}vw`
})

const circleTwoTranslateX = computed(() => {
  const progress = getSectionProgressByVh(scrollY?.value ?? 0, 'a', vh?.value ?? 800, 2)
  return `${lerp(40, -75, progress)}vw`
})
</script>

<template>
  <div>
    <p
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
  </div>
</template>
