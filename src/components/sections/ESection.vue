<script setup lang="ts">
import { computed, inject } from 'vue'
import CircleDeco from '../CircleDeco.vue'
import { smoothstep } from '@/composables/useScrollMonitor.ts'
import type { ScrollMonitor } from '@/types.ts'
import ContactForm from '../ContactForm.vue'

const circleDelays = {
  1: 0,
  2: 50,
  3: 100,
  4: 150,
  5: 200,
  6: 250,
}

const scrollMonitor = inject<ScrollMonitor>('scroll-monitor')

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
</script>

<template>
  <div>
    <CircleDeco
      fill-color="#417b5a"
      class="fixed left-1/2 dis-one-here"
      :width="800"
      :style="{
        top: halfPlusHeader,
        transform: `translate(-50%, -50%) scale(${circle1Scale}) `,
        transition: 'transform 200ms',
      }"
    />
    <CircleDeco
      fill-color="#5b8e7d"
      class="fixed left-1/2"
      :width="700"
      :style="{
        top: halfPlusHeader,
        transform: `translate(-50%, -50%) scale(${circle2Scale}) `,
        transition: 'transform 200ms',
      }"
    />
    <CircleDeco
      fill-color="#a3bda8"
      class="fixed left-1/2"
      :width="575"
      :style="{
        top: halfPlusHeader,
        transform: `translate(-50%, -50%) scale(${circle3Scale}) `,
        transition: 'transform 200ms',
      }"
    />
    <CircleDeco
      fill-color="#e1e1b7"
      class="fixed left-1/2"
      :width="450"
      :style="{
        top: halfPlusHeader,
        transform: `translate(-50%, -50%) scale(${circle4Scale}) `,
        transition: 'transform 200ms',
      }"
    />
    <CircleDeco
      fill-color="#677e8a"
      class="fixed left-1/2"
      :width="325"
      :style="{
        top: halfPlusHeader,
        transform: `translate(-50%, -50%) scale(${circle5Scale}) `,
        transition: 'transform 200ms',
      }"
    />
    <CircleDeco
      fill-color="#b7c7cd"
      class="fixed left-1/2"
      :width="200"
      :style="{
        top: halfPlusHeader,
        transform: `translate(-50%, -50%) scale(${circle6Scale}) `,
        transition: 'transform 200ms',
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


<!-- <script setup lang="ts">
import { computed, inject } from 'vue'
import CircleDeco from '../CircleDeco.vue'
import { getSectionProgress, smoothstep } from '@/composables/useScrollMonitor.ts'
import type { ScrollMonitor } from '@/types.ts'
import ContactForm from '../ContactForm.vue'

const circleDelays = {
  1: 0,
  2: 50,
  3: 100,
  4: 150,
  5: 200,
  6: 250,
}

const scrollMonitor = inject<ScrollMonitor>('scroll-monitor')
const scrollY = scrollMonitor?.scrollY

const headerHeight = computed(() => scrollMonitor?.headerHeight.value)
const halfPlusHeader = computed<string>(
  () => `calc((100% - ${headerHeight.value}px) / 2 + ${headerHeight.value}px)`,
)

const progress = computed(() => getSectionProgress(scrollY?.value ?? 0, 'e'))
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

// const circleTop = computed(() => `${scrollMonitor?.headerHeight ?? 86}px`)

const showForm = computed(() => circle6Scale.value == 1)
</script>

<template>
  <div>
    <CircleDeco
      fill-color="#417b5a"
      class="fixed left-1/2 dis-one-here"
      :width="800"
      :style="{
        top: halfPlusHeader,
        transform: `translate(-50%, -50%) scale(${circle1Scale}) `,
        transition: 'transform 200ms',
      }"
    />
    <CircleDeco
      fill-color="#5b8e7d"
      class="fixed left-1/2"
      :width="700"
      :style="{
        top: halfPlusHeader,
        transform: `translate(-50%, -50%) scale(${circle2Scale}) `,
        transition: 'transform 200ms',
      }"
    />
    <CircleDeco
      fill-color="#a3bda8"
      class="fixed left-1/2"
      :width="575"
      :style="{
        top: halfPlusHeader,
        transform: `translate(-50%, -50%) scale(${circle3Scale}) `,
        transition: 'transform 200ms',
      }"
    />
    <CircleDeco
      fill-color="#e1e1b7"
      class="fixed left-1/2"
      :width="450"
      :style="{
        top: halfPlusHeader,
        transform: `translate(-50%, -50%) scale(${circle4Scale}) `,
        transition: 'transform 200ms',
      }"
    />
    <CircleDeco
      fill-color="#677e8a"
      class="fixed left-1/2"
      :width="325"
      :style="{
        top: halfPlusHeader,
        transform: `translate(-50%, -50%) scale(${circle5Scale}) `,
        transition: 'transform 200ms',
      }"
    />
    <CircleDeco
      fill-color="#b7c7cd"
      class="fixed left-1/2"
      :width="200"
      :style="{
        top: halfPlusHeader,
        transform: `translate(-50%, -50%) scale(${circle6Scale}) `,
        transition: 'transform 200ms',
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
</template> -->
