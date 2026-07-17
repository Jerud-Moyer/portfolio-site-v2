import { ref, onMounted, onUnmounted, type Ref } from 'vue'

/**
 * Tracks each registered element's horizontal "cross progress" into the
 * viewport from the right edge: 0 = not yet entered, 1 = fully entered.
 * Measures continuously via requestAnimationFrame while mounted, so it
 * stays accurate even while an ancestor's transform is mid-CSS-transition.
 */
export function useScrollCrossProgress(viewportWidth: Ref<number>) {
  const elementRefs = ref<(HTMLElement | null)[]>([])
  const progress = ref<number[]>([])
  let rafId: number | null = null

  const setRef = (el: Element | null, index: number) => {
    elementRefs.value[index] = el as HTMLElement | null
  }

  const measure = () => {
    const vw = viewportWidth.value
    elementRefs.value.forEach((el, index) => {
      if (!el) return
      const rect = el.getBoundingClientRect()
      if (rect.width === 0) return // now only true before first layout, not due to rotation
      const rightEdgeProgress = (vw - rect.left) / rect.width // low near right edge, rising as it clears
      const leftEdgeProgress = rect.right / rect.width // low near/past left edge, rising as it clears
      const raw = Math.min(rightEdgeProgress, leftEdgeProgress)
      progress.value[index] = Math.min(Math.max(raw, 0), 1)
    })
    rafId = requestAnimationFrame(measure)
  }

  onMounted(() => {
    rafId = requestAnimationFrame(measure)
  })

  onUnmounted(() => {
    if (rafId !== null) cancelAnimationFrame(rafId)
  })

  return { setRef, progress }
}
