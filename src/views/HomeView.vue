<script setup lang="ts">
import Logo from '@/components/Logo.vue'
</script>

<template>
  <main class="flex flex-row justify-center-safe">
    <div class="container flex flex-col gap-12 pt-12">
      <div class="bg-gunmetal p-6">
        <p class="text-4xl text-beige">Some Logo Examples!</p>
        <Button variant="outlined" label="Button" />
      </div>
      <div class="flex flex-row bg-gunmetal p-6">
        <Logo outlineColor="#FFFFFF" fillColor="transparent" :width="200" />
        <Logo :gradient-fill="true" />
      </div>
      <div class="flex flex-row bg-gunmetal p-6">
        <Logo
          :gradient-fill="true"
          gradient-color-one="#3c3c3b"
          gradient-color-two="#5B8E7D"
          outline-color="#B07156"
        />
        <Logo outline-color="#3c3c3b" fill-color="#B07156" back-fill-color="#558B6E" :width="360" />
      </div>
    </div>
  </main>
</template>
