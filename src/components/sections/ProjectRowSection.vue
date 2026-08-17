<script setup lang="ts">
import { lerp, smoothstep } from '@/composables/useScrollMonitor'
import { useScrollCrossProgress } from '@/composables/useScrollCrossProgress'
import type { ScrollMonitor, SectionId, Project } from '@/types'
import { computed, ref, inject, onMounted, onUnmounted, watch } from 'vue'
import ProjectCard from '../ProjectCard.vue'

const props = withDefaults(
  defineProps<{
    sectionId: SectionId
    heading: string
    /** 'rtl' enters from the right and exits left; 'ltr' is the reverse. */
    direction: 'rtl' | 'ltr'
    projects: Project[]
    /** Fraction of the section's duration the row takes to cross. */
    travelPhase?: number
  }>(),
  { travelPhase: 0.4 },
)

const scrollMonitor = inject<ScrollMonitor>('scroll-monitor')!

const headerHeight = computed(() => scrollMonitor.headerHeight.value)
const halfPlusHeader = computed<string>(
  () => `calc((100svh - ${headerHeight.value}px) / 2 + ${headerHeight.value}px)`,
)

const rowEl = ref<HTMLElement | null>(null)
const rowWidth = ref(0)
let ro: ResizeObserver | null = null

onMounted(() => {
  ro = new ResizeObserver(([entry]) => {
    const width = entry?.contentRect.width ?? 0
    if (width > 0) rowWidth.value = width // ignore zero-width reports while hidden
  })
  watch(
    rowEl,
    (el, _old, onCleanup) => {
      if (!el) return
      ro!.observe(el)
      onCleanup(() => ro!.unobserve(el))
    },
    { immediate: true, flush: 'post' },
  )
})

onUnmounted(() => ro?.disconnect())

const projectsTranslateX = computed(() => {
  const vw = scrollMonitor.viewportWidth.value
  const clearRight = rowWidth.value
  const clearLeft = -vw

  if (rowWidth.value === 0) {
    return props.direction === 'rtl' ? `${clearRight}px` : `${clearLeft}px`
  }
  const progress = scrollMonitor.getPhaseProgress(props.sectionId, 0, props.travelPhase)
  return props.direction === 'rtl'
    ? `${lerp(clearRight, clearLeft, progress)}px`
    : `${lerp(clearLeft, clearRight, progress)}px`
})

// Fades in over the first 20%, holds, fades out over the last 50%.
const opacity = computed<number>(() => {
  const progress = scrollMonitor.getProgress(props.sectionId)
  if (progress <= 0.3) return smoothstep(progress / 0.2)
  return smoothstep((1 - progress) / 0.5)
})

const { setRef, progress: cardProgress } = useScrollCrossProgress(scrollMonitor.viewportWidth, [
  scrollMonitor.scrollY,
  rowWidth,
])

const cardRotateY = (index: number) => lerp(-90, 0, smoothstep(cardProgress.value[index] ?? 0))
const cardOpacity = (index: number) => smoothstep(cardProgress.value[index] ?? 0)
</script>

<template>
  <div>
    <div
      class="flex flex-col gap-8 fixed right-0"
      :style="{ top: halfPlusHeader, transform: `translate(${projectsTranslateX}, -50%)` }"
    >
      <p
        class="text-5xl text-cinnamon font-inconsolata"
        :class="direction === 'rtl' ? 'text-left pl-8' : 'text-right pr-8'"
        :style="{ opacity }"
      >
        {{ heading }}
      </p>

      <div class="flex flex-row gap-8 items-stretch" ref="rowEl">
        <div
          v-for="(project, index) in projects"
          :key="project.title"
          :ref="(el) => setRef(el as Element | null, index)"
          class="flex flex-col"
        >
          <div
            class="transform-3d grow flex flex-col"
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
