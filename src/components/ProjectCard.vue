<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  technologies: {
    type: Array,
    default() {
      return []
    },
  },
  projectUrl: {
    type: String,
    default: '',
  },
  gitUrl: {
    type: String,
    default: '',
  },
  imgFileName: {
    type: String,
    default: '',
  },
})

const technologiesString = computed<string>(() => {
  const allTechs = props.technologies
  let string = ''
  allTechs.forEach((tech, i) => {
    if (i === allTechs.length - 1) string = `${string} ${tech}`
    else string = `${string} ${tech} - `
  })
  return string
})
</script>

<template>
  <div
    class="aspect-square min-h-fit grow flex flex-col border-2 border-jungle-teal rounded-lg bg-carbon w-[90vw] sm:w-[40vw] max-w-[80vw] sm:max-w-[60vh]"
  >
    <img
      class="w-full rounded-t-lg object-cover h-[45%] sm:h-[55%] shrink-0"
      :src="props.imgFileName"
    />
    <div class="p-3 flex grow border-t border-jungle-teal flex-col justify-between">
      <p class="text-2xl sm:text-4xl font-inconsolata text-jungle-teal">
        {{ props.title }}
      </p>
      <p class="text-sm sm:text-md font-montserrat text-muted-teal p-2">
        {{ props.description }}
      </p>
      <p class="text-md sm:text-lg font-montserrat text-jungle-teal">{{ technologiesString }}</p>
      <div class="flex justify-between p-2">
        <a :href="props.projectUrl" target="_blank">{{ props.title }}</a>
        <a :href="props.gitUrl" target="_blank">view the code</a>
      </div>
    </div>
  </div>
</template>
