<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import CircleDeco from './CircleDeco.vue'

type Operator = '-' | '+'

const COLORS = [
  '#b07156', // cinnamon
  '#a3bda8', // muted-teal
  '#e1e1b7', // lemon-chiffon
  '#417b5a', // dark-jungle-teal
] as const

const NEUTRAL = '#b7c7cd' // pale-slate

interface Dot {
  width: number // px
  color: (typeof COLORS)[number] | typeof NEUTRAL
  xStart: number // vw
  yStart: number // vh
  xTranslate: number // vw
  yTranslate: number // vh
  xOperator: Operator
  yOperator: Operator
}

const NUMBER_OF_DOTS = 24

const dots = ref<Dot[]>([])

const timeOutRef = ref<ReturnType<typeof setInterval> | null>(null)

// Random-but-spaced: divide the range into `count` segments and
// jitter within each, so values feel arbitrary but cover the screen.
const spacedRandom = (count: number, min = 5, max = 95): number[] => {
  const segment = (max - min) / count
  return Array.from({ length: count }, (_, i) =>
    Math.round(min + i * segment + Math.random() * segment),
  )
}

const startingXPositions = spacedRandom(NUMBER_OF_DOTS) // vw values
const startingYPositions = spacedRandom(NUMBER_OF_DOTS) // vh values

// readonly here is the fix for your original error —
// `as const` arrays can't be passed to a mutable unknown[]
const _randomIndex = (array: readonly unknown[]) => Math.floor(Math.random() * array.length)
const _randomTransVal = () => Math.floor(Math.random() * 10) + 1
const _randomOperator = (): Operator => (Math.random() > 0.5 ? '-' : '+')
const _randomOneToOneHundred = () => Math.floor(Math.random() * 15) + 1

const dotify = (dot: Dot | null = null): Dot => {
  const isEvenDot = dots.value.length % 2 === 0

  const motion = {
    xTranslate: _randomTransVal(),
    yTranslate: _randomTransVal(),
    xOperator: _randomOperator(),
    yOperator: _randomOperator(),
  }

  // Existing dot: keep its identity, re-roll its motion
  if (dot) {
    return { ...dot, ...motion }
  }

  // New dot: full random identity + motion
  return {
    ...motion,
    width: _randomOneToOneHundred(),
    color: isEvenDot ? NEUTRAL : (COLORS[_randomIndex(COLORS)] ?? NEUTRAL),
    xStart: startingXPositions[_randomIndex(startingXPositions)] ?? 0,
    yStart: startingYPositions[_randomIndex(startingYPositions)] ?? 0,
  }
}

onMounted(() => {
  let limit = NUMBER_OF_DOTS
  while (limit > 0) {
    dots.value.push(dotify())
    limit--
  }

  timeOutRef.value = setInterval(() => {
    const rando = _randomIndex(dots.value)
    dots.value[rando] = dotify(dots.value[rando])
  }, 400)
})

onUnmounted(() => {
    if(timeOutRef.value) {
        clearInterval(timeOutRef.value)
        timeOutRef.value = null
    }
})

// const dots = reactive<Dot[]>(Array.from({ length: NUMBER_OF_DOTS }, () => dotify()))
</script>

<template>
  <div
    v-for="(dot, i) in dots"
    :key="`dot-${i}`"
    class="fixed"
    :style="{
      top: `${dot.xStart}vh`,
      left: `${dot.yStart}vw`,
      transition: 'transform 4.5s ease 1s',
      transform: `translate(${dot.xOperator}${dot.xTranslate}vh, ${dot.yOperator}${dot.yTranslate}vw)`,
    }"
  >
    <CircleDeco :dot="dot" :width="dot.width" :fill-color="dot.color" />
  </div>
</template>
