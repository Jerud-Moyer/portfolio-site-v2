<script setup lang="ts">
const props = defineProps({
  inScrollZone: {
    type: Boolean,
    required: true,
  },
})
</script>

<template>
  <div
    class="fixed inset-0 transition-opacity duration-300"
    :class="props.inScrollZone ? 'opacity-100' : 'opacity-0 invisible'"
    :aria-hidden="!props.inScrollZone"
  >
    <slot></slot>
  </div>
</template>
