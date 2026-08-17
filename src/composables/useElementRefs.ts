export function useElementRefs() {
  const elements: (HTMLElement | null)[] = []
  const indexOf = new Map<Element, number>()

  const setRef = (el: Element | null, index: number) => {
    const previous = elements[index]
    if (previous) indexOf.delete(previous)
    elements[index] = el as HTMLElement | null
    if (el) indexOf.set(el, index)
  }

  return { setRef, elements, indexOf }
}
