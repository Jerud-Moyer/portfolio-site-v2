import { ref, watch, onMounted, nextTick, type Ref, type WatchSource } from 'vue'
import { useElementRefs } from './useElementRefs'

/**
 * Per-element horizontal crossing progress: 0 = outside the viewport,
 * 1 = fully inside. Measures only when a dependency changes, not every
 * frame — pass anything that moves the elements (scrollY, row width).
 */

export function useScrollCrossProgress(
  viewportWidth: Ref<number>,
  deps: WatchSource<unknown>[] = [],
  label?: string,
) {
  const { setRef, elements } = useElementRefs()
  const progress = ref<number[]>([])

  const measure = () => {
    const vw = viewportWidth.value
    elements.forEach((el, index) => {
      if (!el) return
      const rect = el.getBoundingClientRect()
      if (rect.width === 0) {
        if (label === 'd') console.log('MEASURE d => zero width, bailing', index)
        return
      }
      const fromRight = (vw - rect.left) / rect.width
      const fromLeft = rect.right / rect.width
      const next = Math.round(Math.min(Math.max(Math.min(fromRight, fromLeft), 0), 1) * 1000) / 1000
      if (label === 'd') {
        console.log('MEASURE d =>', index, {
          left: Math.round(rect.left),
          width: Math.round(rect.width),
          next: next.toFixed(3),
        })
      }
      if (progress.value[index] !== next) progress.value[index] = next
    })
  }

  let queued = false
  const scheduleMeasure = () => {
    if (queued) return
    queued = true
    requestAnimationFrame(() => {
      queued = false
      measure()
    })
  }

  watch([viewportWidth, ...deps], scheduleMeasure, { flush: 'post' })
  onMounted(() => nextTick(scheduleMeasure))

  return { setRef, progress }
}
