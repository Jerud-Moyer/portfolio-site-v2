import { ref, onMounted, onUnmounted } from 'vue'
import { useElementRefs } from './useElementRefs'

export function useRevealOnIntersect(rootMargin = '0px 0px 0px 0px', threshold = 0.15) {
  const { setRef: registerRef, indexOf } = useElementRefs()
  const revealed = ref<boolean[]>([])
  let observer: IntersectionObserver | null = null
  const observed = new WeakSet<Element>()

  const setRef = (el: Element | null, index: number) => {
    registerRef(el, index)
    if (el && observer && !observed.has(el)) {
      observer.observe(el)
      observed.add(el)
    }
  }

  onMounted(() => {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const index = indexOf.get(entry.target)
          // flips both directions: true when entering, false when leaving
          if (index !== undefined) revealed.value[index] = entry.isIntersecting
        }
      },
      { root: null, threshold, rootMargin },
    )
    // Refs registered before mount missed the observe above — catch them up.
    for (const [el] of indexOf) {
      if (!observed.has(el)) {
        observer.observe(el)
        observed.add(el)
      }
    }
  })

  onUnmounted(() => observer?.disconnect())

  return { setRef, revealed }
}
