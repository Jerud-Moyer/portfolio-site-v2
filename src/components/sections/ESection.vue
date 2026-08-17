<script setup lang="ts">
import { computed, inject, watchEffect } from 'vue'
import CircleDeco from '../CircleDeco.vue'
import { smoothstep } from '@/composables/useScrollMonitor'
import type { ScrollMonitor } from '@/types'
import ContactForm from '../ContactForm.vue'

const circleDelays = {
  1: 0,
  2: 50,
  3: 100,
  4: 150,
  5: 200,
  6: 250,
}

// const scrollMonitor = inject<ScrollMonitor>('scroll-monitor')
import { useScrollMonitor } from '@/composables/useScrollMonitor'
const scrollMonitor = useScrollMonitor()

const injected = inject<ScrollMonitor>('scroll-monitor')
// const direct = useScrollMonitor()
console.log(
  'E same instance?',
  injected === scrollMonitor,
  injected?.scrollY.value,
  scrollMonitor.scrollY.value,
)

const headerHeight = computed(() => scrollMonitor?.headerHeight.value)
const halfPlusHeader = computed<string>(
  () => `calc((100% - ${headerHeight.value}px) / 2 + ${headerHeight.value}px)`,
)

const progress = computed(() => scrollMonitor?.getProgress('e') ?? 0)
const comparisonProgress = computed(() => Math.floor(progress.value * 1000))

const circle1Scale = computed<number>(() => {
  return smoothstep(progress.value * 2.5)
})

const circle2Scale = computed<number>(() => {
  if (comparisonProgress.value <= circleDelays[2]) return 0
  else return smoothstep((progress.value - circleDelays[2] / 1000) * 2.5)
})

const circle3Scale = computed<number>(() => {
  if (comparisonProgress.value <= circleDelays[3]) return 0
  else return smoothstep((progress.value - circleDelays[3] / 1000) * 2.25)
})

const circle4Scale = computed<number>(() => {
  if (comparisonProgress.value <= circleDelays[4]) return 0
  else return smoothstep((progress.value - circleDelays[4] / 1000) * 2)
})

const circle5Scale = computed<number>(() => {
  if (comparisonProgress.value <= circleDelays[5]) return 0
  else return smoothstep((progress.value - circleDelays[5] / 1000) * 1.75)
})

const circle6Scale = computed<number>(() => {
  if (comparisonProgress.value <= circleDelays[6]) return 0
  else return smoothstep((progress.value - circleDelays[6] / 1000) * 1.85)
})

const showForm = computed(() => circle6Scale.value == 1)

// watchEffect(() => console.log('E', progress.value, circle1Scale.value, headerHeight.value))
watchEffect(() =>
  console.log('E', Date.now() % 100000, progress.value, circle1Scale.value, headerHeight.value),
)
</script>

<template>
  <div>
    <div class="fixed top-0 left-0 z-50 text-white bg-black p-2">
      E {{ progress.toFixed(3) }} / {{ headerHeight }}
    </div>
    <CircleDeco
      fill-color="#417b5a"
      class="fixed left-1/2 dis-one-here"
      :width="800"
      :style="{
        top: halfPlusHeader,
        transform: `translate(-50%, -50%) scale(${circle1Scale}) `,
      }"
    />
    <CircleDeco
      fill-color="#5b8e7d"
      class="fixed left-1/2"
      :width="700"
      :style="{
        top: halfPlusHeader,
        transform: `translate(-50%, -50%) scale(${circle2Scale}) `,
      }"
    />
    <CircleDeco
      fill-color="#a3bda8"
      class="fixed left-1/2"
      :width="575"
      :style="{
        top: halfPlusHeader,
        transform: `translate(-50%, -50%) scale(${circle3Scale}) `,
      }"
    />
    <CircleDeco
      fill-color="#e1e1b7"
      class="fixed left-1/2"
      :width="450"
      :style="{
        top: halfPlusHeader,
        transform: `translate(-50%, -50%) scale(${circle4Scale}) `,
      }"
    />
    <CircleDeco
      fill-color="#677e8a"
      class="fixed left-1/2"
      :width="325"
      :style="{
        top: halfPlusHeader,
        transform: `translate(-50%, -50%) scale(${circle5Scale}) `,
      }"
    />
    <CircleDeco
      fill-color="#b7c7cd"
      class="fixed left-1/2"
      :width="200"
      :style="{
        top: halfPlusHeader,
        transform: `translate(-50%, -50%) scale(${circle6Scale}) `,
      }"
    />
    <div
      class="fixed left-1/2"
      :style="{
        top: halfPlusHeader,
        transform: `translate(-50%, -50%)`,
        transition: 'opacity 600ms',
      }"
    >
      <ContactForm :form-revealed="showForm" />
    </div>
  </div>
</template>
