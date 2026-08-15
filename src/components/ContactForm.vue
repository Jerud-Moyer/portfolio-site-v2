<script setup lang="ts">
import { useEmailService, type Email } from '@/composables/useEmailService'
import { ref, computed } from 'vue'

const props = defineProps({
  formRevealed: {
    type: Boolean,
    required: true,
  },
})

const emailService = useEmailService()

const formOpacity = computed(() => (props.formRevealed ? '1' : '0'))

const name = ref<string>('')
const email = ref<string>('')
const message = ref<string>('')
const feedBack = ref<string>('')
const showFeedback = ref<boolean>(false)
const encounteredError = ref<boolean>(false)

const userInput = computed<Partial<Email>>(() => ({
  name: name.value,
  senderEmail: email.value,
  message: message.value,
}))

const clearForm = () => {
  name.value = ''
  email.value = ''
  message.value = ''
}

const canSubmit = computed(
  () =>
    name.value.trim().length > 0 &&
    email.value.trim().length > 0 &&
    message.value.trim().length > 0,
)

const handleSendEmail = async () => {
  showFeedback.value = false
  encounteredError.value = false

  if (!canSubmit.value) {
    feedBack.value = 'please fill out all fields'
    showFeedback.value = true
    encounteredError.value = true
    return
  }

  try {
    const res = await emailService.sendMessage(userInput.value)
    if (res.status && res.status === 'success') {
      clearForm()
      feedBack.value = 'Thank you!'
    }
  } catch (err) {
    console.error(err)
    encounteredError.value = true
    feedBack.value = 'There was a problem sending your message, please try again.'
  } finally {
    showFeedback.value = true
  }
}
</script>

<template>
  <div
    class="glass relative w-[90vw] sm:w-[50vw] rounded-4xl bg-white/5 backdrop-blur-lg backdrop-brightness-85 p-4"
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
        <div class="flex flex-col md:flex-row justify-between w-full gap-8 p-8">
          <FloatLabel variant="on" class="md:w-1/2 shadow-md shadow-gunmetal">
            <label>Your Name</label>
            <InputText class="w-full" v-model="name" />
          </FloatLabel>
          <FloatLabel variant="on" class="md:w-1/2 shadow-md shadow-gunmetal">
            <label>Your Email</label>
            <InputText class="w-full" v-model="email" />
          </FloatLabel>
        </div>
        <div class="flex w-full px-8">
          <FloatLabel variant="on" class="w-full">
            <label>Your Message</label>
            <TextArea :rows="7" class="w-full shadow-md shadow-gunmetal" v-model="message" />
          </FloatLabel>
        </div>
        <div class="p-8 flex justify-end">
          <Button
            label="Submit"
            variant="outlined"
            severity="secondary"
            class="shadow-md shadow-gunmetal"
            @click="handleSendEmail()"
          />
        </div>
      </div>
    </div>
    <p
      class="absolute animate-fade-in bottom-8 left-1/2 -translate-x-1/2 text-4xl font-montserrat font-bold text-center text-shadow-sm text-shadow-lemon-chiffon"
      :class="encounteredError ? 'text-red-800' : 'text-graphite'"
      v-if="showFeedback"
    >
      {{ feedBack }}
    </p>
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
