<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  formRevealed: {
    type: Boolean,
    required: true,
  },
})

const formOpacity = computed(() => (props.formRevealed ? '1' : '0'))
</script>

<template>
  <div
    class="glass relative w-[50vw] h-[50vh] rounded-4xl bg-white/5 backdrop-blur-lg backdrop-brightness-85 p-4"
    :style="{
      opacity: formOpacity,
      transition: 'opacity 300ms ease',
    }"
  >
    <div class="inner-glass flex flex-col text-pale-slate relative rounded-4xl w-full h-full">
      <p class="text-4xl p-4 w-full font-inconsolata font-bold text-shadow-sm text-shadow-graphite">
        Contact Me
      </p>
      <div class="flex flex-col grow justify-around">
        <div class="flex flex-row justify-between w-full gap-8 p-8">
          <FloatLabel variant="on" class="w-1/2 shadow-md shadow-gunmetal">
            <label>Your Name</label>
            <InputText class="w-full" />
          </FloatLabel>
          <FloatLabel variant="on" class="w-1/2 shadow-md shadow-gunmetal">
            <label>Your Email</label>
            <InputText class="w-full" />
          </FloatLabel>
        </div>
        <div class="flex w-full px-8">
          <FloatLabel variant="on" class="w-full">
            <label>Your Message</label>
            <TextArea :rows="7" class="w-full shadow-md shadow-gunmetal" />
          </FloatLabel>
        </div>
        <div class="p-8 flex justify-end">
          <Button
            label="Submit"
            variant="outlined"
            severity="primary"
            class="shadow-md shadow-gunmetal"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.glass {
  box-shadow:
    inset 1px 1px 0 rgba(255, 255, 255, 0.25),
    inset -3px -3px 0 rgba(0, 0, 0, 0.25);
}

.inner-glass::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px; /* border thickness */
  background: linear-gradient(
    315deg,
    rgba(255, 255, 255, 0.2) 0%,
    rgba(255, 255, 255, 0.2) 5%,
    transparent 15%,
    transparent 15%
  );
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}
</style>
