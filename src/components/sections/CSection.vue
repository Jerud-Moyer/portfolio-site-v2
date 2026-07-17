<script setup lang="ts">
import { lerp, smoothstep } from '@/composables/useScrollMonitor'
import { useScrollCrossProgress } from '@/composables/useScrollCrossProgress'
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
  const progress = scrollMonitor?.getProgressByVh('c', 4) ?? 0
  return `${lerp(100, -200, progress)}vw`
})

const opacity = computed<number>(() => {
  const progress = scrollMonitor?.getProgress('c') ?? 0
  if (progress <= 0.7) return smoothstep(progress * 4)
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
        transition: 'transform 200ms',
        transform: `translate(${projectsTranslateX}, -50%)`,
      }"
    >
      <p class="text-5xl text-cinnamon font-inconsolata pl-8" :style="{ opacity }">some websites</p>
      <div class="flex flex-row gap-8">
        <!-- outer wrapper: NO transform, so getBoundingClientRect on it is always accurate -->
        <div
          v-for="(project, index) in projects"
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

<style scoped>

</style>
