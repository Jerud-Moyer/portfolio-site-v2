<script setup lang="ts">
import { computed, inject } from 'vue'
import CircleDeco from '../CircleDeco.vue'
import type { ScrollMonitor } from '@/types'
import { lerp } from '@/composables/useScrollMonitor'

const scrollMonitor = inject<ScrollMonitor>('scroll-monitor')

const groupScrollUp = computed(() => {
  const progress = scrollMonitor?.getPhaseProgress('a', 0.625, 0.925) ?? 0
  return lerp(0, -120, progress)
})

// was a hardcoded 1780px, then vh * 1.78 — now a fraction of section 'a'
const pastColorThreshold = computed(() => (scrollMonitor?.getProgress('a') ?? 0) >= 0.445)

const textTranslateY = computed(() => `calc(40vh + ${groupScrollUp.value}vh)`)
const circleOneTranslateY = computed(() => `calc(-80px + ${groupScrollUp.value}vh)`)
const circleTwoTranslateY = computed(() => `calc(350px + ${groupScrollUp.value}vh)`)

const circleOneTranslateX = computed(() => {
  const progress = scrollMonitor?.getPhaseProgress('a', 0, 0.25) ?? 0
  return `${lerp(30, -64, progress)}vw`
})

const circleTwoTranslateX = computed(() => {
  const progress = scrollMonitor?.getPhaseProgress('a', 0, 0.5) ?? 0
  return `${lerp(40, -75, progress)}vw`
})
</script>

<template>
  <div>
    <p
      class="z-1 fixed left-[50vw] text-9xl font-crimson-text-bold text-shadow-md text-shadow-carbon"
      :class="pastColorThreshold ? 'text-lt-grey' : 'text-cinnamon'"
      :style="{
        top: '0',
        transition: 'color 300ms 100ms',
        transform: `translateX(-50%) translateY(${textTranslateY})`,
      }"
    >
      Jerud Moyer
    </p>

    <CircleDeco
      id="circle_a"
      :width="600"
      fillColor="#417b5a"
      class="fixed -right-[30vw]"
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
      class="fixed top-[72vh] -right-[40vw]"
      :style="{
        top: '34vh',
        transform: `translateX(${circleTwoTranslateX}) translateY(${circleTwoTranslateY})`,
      }"
    />
  </div>
</template>
