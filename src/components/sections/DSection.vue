<script setup lang="ts">
import { lerp, smoothstep } from '@/composables/useScrollMonitor'
import type { ScrollMonitor } from '@/types'
import { computed, ref, inject, onMounted, onUnmounted } from 'vue'
import ProjectCard from '../ProjectCard.vue'
import { projects } from '@/assets/data/projects.js'
import { useScrollCrossProgress } from '@/composables/useScrollCrossProgress.ts'

const scrollMonitor = inject<ScrollMonitor>('scroll-monitor')
const headerHeight = computed(() => scrollMonitor?.headerHeight.value)
const halfPlusHeader = computed<string>(
  () => `calc((100% - ${headerHeight.value}px) / 2 + ${headerHeight.value}px)`,
)

const rowEl = ref<HTMLElement | null>(null)
const rowWidth = ref(0)

onMounted(() => {
  if (!rowEl.value) return
  const ro = new ResizeObserver(([entry]) => {
    rowWidth.value = entry?.contentRect.width ?? 0
  })
  ro.observe(rowEl.value)
  onUnmounted(() => ro.disconnect())
})

const projectsTranslateX = computed(() => {
  const vw = scrollMonitor?.viewportWidth.value ?? 0
  const progress = scrollMonitor?.getPhaseProgress('d', 0, 0.4) ?? 0
  // start: fully clear of the left edge. end: fully clear of the right edge.
  return `${lerp(-vw, rowWidth.value, progress)}px`
})

const opacity = computed<number>(() => {
  const progress = scrollMonitor?.getProgress('d') ?? 0
  // 0→0.7: fade in (0 to 1), 0.7→1: fade out (1 to 0)
  if (progress <= 0.3) return smoothstep(progress * 5)
  return smoothstep((1 - progress) * 2)
})

const { setRef, progress: cardProgress } = useScrollCrossProgress(scrollMonitor!.viewportWidth)

const cardRotateY = (index: number) => {
  const p = smoothstep(cardProgress.value[index] ?? 0)
  return lerp(-90, 0, p)
}

const cardOpacity = (index: number) => {
  return smoothstep(cardProgress.value[index] ?? 0)
}
</script>

<template>
  <div>
    <div
      class="flex flex-col gap-8 fixed right-0"
      :style="{
        top: halfPlusHeader,
        transform: `translate(${projectsTranslateX}, -50%)`,
      }"
    >
      <p class="text-5xl text-cinnamon text-right font-inconsolata pr-8" :style="{ opacity }">
        some fun projects
      </p>
      <div class="flex flex-row gap-8 items-stretch" ref="rowEl">
        <div
          v-for="(project, index) in projects.fun"
          :key="project.title"
          :ref="(el) => setRef(el as Element | null, index)"
        >
          <!-- inner div: carries the actual flip transform/opacity -->
          <div
            class="transform-3d"
            :style="{
              transform: `perspective(1000px) rotateY(${cardRotateY(index)}deg)`,
              opacity: cardOpacity(index),
            }"
          >
            <ProjectCard
              :title="project.title"
              :description="project.description"
              :technologies="project.technologies"
              :projectUrl="project.projectUrl"
              :gitUrl="project.gitUrl"
              :imgFileName="`/images/${project.imgFileName}`"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
