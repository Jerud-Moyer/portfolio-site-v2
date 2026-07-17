import { ref, onMounted, onUnmounted } from 'vue'

export function useRevealOnIntersect(rootMargin = '0px 0px 0px 0px') {
  const elementRefs = ref<(HTMLElement | null)[]>([])
  const revealed = ref<boolean[]>([])
  let observer: IntersectionObserver | null = null

  const setRef = (el: Element | null, index: number) => {
    elementRefs.value[index] = el as HTMLElement | null
  }

  onMounted(() => {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const index = elementRefs.value.indexOf(entry.target as HTMLElement)
          if (index === -1) continue
          // flips both directions: true when entering, false when leaving
          revealed.value[index] = entry.isIntersecting
        }
      },
      { root: null, threshold: 0.15, rootMargin },
    )

    elementRefs.value.forEach((el) => {
      if (el) observer!.observe(el)
    })
  })

  onUnmounted(() => {
    observer?.disconnect()
  })

  return { setRef, revealed }
}
