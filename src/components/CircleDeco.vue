<script setup lang="ts">
const props = defineProps({
  outlineColor: {
    type: String,
    default: 'transparent',
  },
  fillColor: {
    type: String,
    default: '#000000',
  },
  width: {
    type: Number,
    default: 300,
  },
})
</script>

<template>
  <div :style="{ width: width + 'px' }">
    <svg
      viewBox="-2 -2 104 104"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
      :fill="props.fillColor"
    >
      <circle cx="50" cy="50" r="50" :stroke="props.outlineColor" stroke-width="2" />
    </svg>
  </div>
</template>
