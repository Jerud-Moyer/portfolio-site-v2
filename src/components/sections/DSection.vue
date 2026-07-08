<script setup lang="ts">
import { lerp, smoothstep } from '@/composables/useScrollMonitor'
import type { ScrollMonitor } from '@/types'
import { computed, inject } from 'vue'
import ProjectCard from '../ProjectCard.vue'
import { projects } from '@/assets/data/projects.js'

const scrollMonitor = inject<ScrollMonitor>('scroll-monitor')
const headerHeight = computed(() => scrollMonitor?.headerHeight.value)
const halfPlusHeader = computed<string>(
  () => `calc((100% - ${headerHeight.value}px) / 2 + ${headerHeight.value}px)`,
)

const projectsTranslateX = computed(() => {
  const progress = scrollMonitor?.getProgressByVh('d', 4) ?? 0
  return `${lerp(-100, 200, progress)}vw` // starts at 100vw (off right), ends at -20vw (off left)
})

const opacity = computed<number>(() => {
  const progress = scrollMonitor?.getProgress('d') ?? 0
  // 0→0.7: fade in (0 to 1), 0.7→1: fade out (1 to 0)
  if (progress <= 0.5) return smoothstep(progress * 2)
  return smoothstep((1 - progress) * 2)
})
</script>

<template>
  <div>
    <div
      class="flex flex-col gap-8 fixed right-0"
      :style="{
        top: halfPlusHeader,
        transition: 'transform 200ms',
        transform: `translate(${projectsTranslateX}, -50%)`,
      }"
    >
      <p class="text-5xl text-cinnamon font-inconsolata pl-8" :style="{ opacity }">
        some fun projects
      </p>
      <div class="flex flex-row gap-8">
        <ProjectCard
          v-for="project in projects"
          :key="project.title"
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
</template>
