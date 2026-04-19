<script setup lang="ts">
import Logo from '@/components/Logo.vue';


</script>

<template>
  <main>
    <Logo 
      outlineColor="#FFFFFF"
      fillColor="transparent"
    />
    <Logo
      :gradient-fill="true"
      
    />
    <Logo
      :gradient-fill="true"
      gradient-color-one="#3c3c3b"
      gradient-color-two="#5B8E7D" 
      outline-color="#B07156"   
    />
    <Logo
      outline-color="#000"
      fill-color="#B07156"
      back-fill-color="#558B6E"
    />
  </main>
</template>
