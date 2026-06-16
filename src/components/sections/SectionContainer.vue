<script setup lang="ts">
const props = defineProps({
    inScrollZone: {
        type: Boolean,
        required: true
    }
})
</script>

<template>
    <div v-if="props.inScrollZone">
        <slot></slot>
    </div>
</template>