<script setup lang="ts">
import { provide } from 'vue'
import { RouterView } from 'vue-router'
import { useScrollMonitor } from './composables/useScrollMonitor'

const scrollMonitor = useScrollMonitor()
provide('scroll-monitor', scrollMonitor)
</script>

<template>
  <div>
    <RouterView />
  </div>
</template>

<style scoped></style>
