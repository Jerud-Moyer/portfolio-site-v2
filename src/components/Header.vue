<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { computed, inject, watch, ref } from 'vue'
import Logo from './Logo.vue'
import type { ScrollMonitor } from '@/types'
import IconResume from './icons/IconResume.vue'
import IconGithub from './icons/IconGithub.vue'
import IconLinkedin from './icons/IconLinkedin.vue'

const scrollMonitor = inject<ScrollMonitor>('scroll-monitor')

const helloSeen = ref<boolean>(false)

const headerHeight = scrollMonitor?.headerHeight

const initialLogoWidth = scrollMonitor?.INITIAL_LOGO_WIDTH ?? 0
const targetHeaderHeight = scrollMonitor?.TARGET_HEADER_HEIGHT ?? 0

const headerCollapsed = computed<boolean>(() => headerHeight?.value === targetHeaderHeight)

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

const headerIcons = [
  { name: 'resume', component: IconResume, class: 'text-muted-teal', url: '/Jerud-Moyer.pdf' },
  {
    name: 'github',
    component: IconGithub,
    class: 'text-jungle-teal',
    url: 'https://github.com/Jerud-Moyer',
  },
  {
    name: 'linkedin',
    component: IconLinkedin,
    class: 'text-cinnamon',
    url: 'https://www.linkedin.com/in/jerud-moyer/',
  },
]

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
    class="w-full h-200 flex items-end px-4 sm:px-24 py-2 z-10"
    :class="backgroundColor"
    :style="{
      height: headerHeight + 'px',
      transition: 'height 100ms, background-color 400ms',
    }"
  >
    <div class="relative flex flex-row justify-between items-center w-full">
      <Logo
        outline-color="#3c3c3b"
        fill-color="#B07156"
        back-fill-color="#558B6E"
        :width="logoWidth"
        class="animate-drop-bounce"
      />
      <TransitionGroup
        tag="div"
        class="flex flex-row gap-6"
        enter-active-class="transition-opacity duration-300 ease-in"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-300 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-for="(icon, i) in headerIcons"
          v-show="headerCollapsed"
          :key="icon.name"
          :style="{ transitionDelay: `${i * 250}ms` }"
        >
          <a :href="icon.url" target="_blank">
            <component :is="icon.component" :class="icon.class" />
          </a>
        </div>
      </TransitionGroup>
      <!-- <p
        v-if="headerStillLarge && !helloSeen"
        class="animate-say-hello text-8xl font-crimson-text-semi-bold text-jungle-teal text-shadow-sm text-shadow-gunmetal absolute bottom-12 -right-[50%]"
      >
        Hello!
      </p> -->
    </div>
  </div>
</template>
