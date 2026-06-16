<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { computed, inject, watch, ref } from 'vue'
import Logo from './Logo.vue'
import type { ScrollMonitor } from '@/types'

const scrollMonitor = inject<ScrollMonitor>('scroll-monitor')

const helloSeen = ref<boolean>(false)

const headerHeight = scrollMonitor?.headerHeight
const intialHeaderHeight = scrollMonitor?.INITIAL_HEADER_HEIGHT ?? 0

const initialLogoWidth = scrollMonitor?.INITIAL_LOGO_WIDTH ?? 0
const targetHeaderHeight = scrollMonitor?.TARGET_HEADER_HEIGHT ?? 0

const headerStillLarge = computed<boolean>(
  () => (headerHeight?.value ?? 0) >= intialHeaderHeight - 200,
)

const logoWidth = computed(() => {
  const adjustedWidth = initialLogoWidth - (scrollMonitor?.scrollY.value ?? 0) / 2
  if (adjustedWidth <= 85) return 85
  return adjustedWidth
})

const backgroundColor = computed(() => {
  if (headerHeight?.value) {
    if (headerHeight?.value <= targetHeaderHeight + 100) {
      return 'bg-carbon'
    }
    if (headerHeight?.value <= targetHeaderHeight + 200) {
      return 'bg-gunmetal'
    }
    if (headerHeight?.value <= targetHeaderHeight + 300) {
      return 'bg-md-grey'
    }
    if (headerHeight?.value <= targetHeaderHeight + 500) {
      return 'bg-lt-grey'
    }
  }
  return 'bg-beige'
})

watch(
  () => headerHeight?.value,
  (newVal) => {
    console.log('IN HEADER => ', newVal)
    if (newVal && newVal < 400) {
      helloSeen.value = true
    }
  },
)
</script>

<template>
  <div
    class="w-full h-200 flex items-end px-24 py-2 z-10"
    :class="backgroundColor"
    :style="{
      height: headerHeight + 'px',
      transition: 'height 100ms, background-color 400ms',
    }"
  >
    <div class="relative flex flex-row w-full">
      <Logo
        outline-color="#3c3c3b"
        fill-color="#B07156"
        back-fill-color="#558B6E"
        :width="logoWidth"
        class="animate-drop-bounce"
      />
      <p
        v-if="headerStillLarge && !helloSeen"
        class="animate-say-hello text-8xl font-crimson-text-semi-bold text-jungle-teal text-shadow-sm text-shadow-gunmetal absolute bottom-12 -right-[50%]"
      >
        Hello!
      </p>
    </div>
  </div>
</template>
