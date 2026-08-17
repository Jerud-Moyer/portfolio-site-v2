# Composables

Four composables drive the scroll experience.

| Composable | Answers | Granularity |
| --- | --- | --- |
| `useScrollMonitor` | "Where are we in the page timeline?" | Continuous, page-wide |
| `useScrollCrossProgress` | "How far has this element crossed the viewport?" | Continuous, per element |
| `useRevealOnIntersect` | "Is this element on screen?" | Boolean, per element |
| `useElementRefs` | Collects `v-for` template refs | Shared internal helper |

---

## ⚠️ Read this before touching element refs

**`useElementRefs.elements` is a plain, non-reactive array. Do not make it a `ref` or `shallowRef`.**

`setRef` is a template ref callback, so Vue calls it *during patch*. If it writes to reactive state, that mutation lands mid-render — and Vue stops flushing render effects for **sibling components later in the tree**. Those siblings freeze at their first render: their reactive values keep updating, but the DOM never repaints, so they appear stuck at initial styles forever.

The symptom is remote from the cause and there is no console error. A reactive `elements` inside a project row broke every section *after* it in the page. If you find yourself "improving" this to a `shallowRef`, don't.

Corollary: nothing may `watch(elements)`. Anything that needs to react to registration does it inside `setRef` itself — see `useRevealOnIntersect`.

---

## `useScrollMonitor`

Single source of truth for scroll position, viewport size, and the section timeline. Called once in `App.vue`, provided as `'scroll-monitor'`, consumed via `inject`. It is also a module-level singleton, so a stray second call is harmless.

### Timeline model

Sections are declared as **duration + overlap**, in multiples of viewport height (vh), and starts are derived by accumulation:

```
start = max(0, previousEnd - overlap)
end   = start + duration
```

Chain order comes from `SECTION_IDS` in `@/types`, not from key order in the timeline table. Retuning one section automatically shifts everything after it.

Three profiles — `mobile` (≤640px), `tablet` (≤1024px), `desktop` — each with its own timeline and header dimensions. Switching profiles rebuilds every breakpoint reactively.

### Viewport height is deliberately stable

`viewportHeight` is measured with a `100svh` probe element, **not** `window.innerHeight`. The small-viewport unit does not change when a mobile URL bar shows or hides, which keeps section boundaries from shifting mid-scroll. Anything that must line up with the scroll math should use `svh` in CSS — never `vh` or `100%`.

`totalScrollHeight` is returned in **pixels** for the same reason: CSS `vh` resolves against the large viewport on mobile and would desync `maxScrollY` from the last section's end.

### API

| Export | Type | Notes |
| --- | --- | --- |
| `scrollY` | `Ref<number>` | rAF-coalesced, one write per frame |
| `viewportWidth` / `viewportHeight` | `Ref<number>` | Height is svh-based (see above) |
| `profile` | `ComputedRef<ViewportProfile>` | `'mobile' \| 'tablet' \| 'desktop'` |
| `isPortrait` | `ComputedRef<boolean>` | Height > width |
| `sectionBreaks` | `ComputedRef<Record<SectionId, SectionRange>>` | Absolute pixel ranges |
| `sectionBreaksVh` | `ComputedRef<Record<SectionId, SectionRange>>` | Pre-pixel vh multiples; debugging |
| `getProgress(id)` | `number` | 0–1 across a section's full range |
| `getPhaseProgress(id, from?, to?)` | `number` | 0–1 across a sub-range, as fractions of the section's duration |
| `inSection(id)` | `boolean` | Strictly inside the range |
| `headerProgress` | `ComputedRef<number>` | 0 = expanded, 1 = collapsed |
| `headerHeight` / `logoWidth` | `ComputedRef<number>` | Both lerped from `headerProgress` |
| `totalScrollHeight` | `ComputedRef<string>` | Px string for the page's `min-height` |
| `headerLocked` / `setHeaderLocked` | `Ref<boolean>` / fn | Manual override flag |

Helpers exported standalone: `getSectionProgress`, `lerp`, `smoothstep`.

### Choosing a progress function

Use **`getPhaseProgress`** by default — it is proportional to the section's duration, so an animation occupies the same fraction of its section in every profile.

`getProgressByVh` was removed. It measured absolute viewport-heights from a section's start, so the same call finished at a different point in each profile (e.g. `('a', 1)` ended at 25% of desktop's section but 40% of mobile's). Any threshold still expressed as a raw vh multiple has the same bug.

### Gotchas

- Scroll-driven properties must **not** carry a CSS `transition`. JS updates every frame; a transition restarts each frame and produces lag and stutter. Transitions belong only on discrete state flips.
- Import as `@/composables/useScrollMonitor` — never with a `.ts` extension. Vite treats `./x` and `./x.ts` as separate modules, which would produce two singletons with independent scroll state.

---

## `useElementRefs`

Collects `v-for` template refs into an index-keyed array plus a reverse `Map` for callbacks that receive an element and need its index.

```ts
const { setRef, elements, indexOf } = useElementRefs()
```

- `elements` — plain `(HTMLElement | null)[]`, **not reactive** (see the warning above)
- `indexOf` — `Map<Element, number>`, O(1) reverse lookup
- `setRef(el, index)` — bind as `:ref="(el) => setRef(el as Element | null, index)"`

Removed elements leave stale entries at their index. Neither current consumer shrinks its list.

---

## `useScrollCrossProgress`

Per-element horizontal crossing progress: `0` = outside the viewport, `1` = fully inside. Computed as the smaller of the two edge distances, so it rises as an element enters from **either** side and falls as it exits the other — one value serving both left- and right-travelling rows.

```ts
const { setRef, progress } = useScrollCrossProgress(
  scrollMonitor.viewportWidth,        // measured against
  [scrollMonitor.scrollY, rowWidth],  // anything that moves the elements
  props.sectionId,                    // optional debug label
)

const cardRotateY = (i: number) => lerp(-90, 0, smoothstep(progress.value[i] ?? 0))
```

```html
<div v-for="(item, i) in items" :ref="(el) => setRef(el as Element | null, i)">
  <!-- inner element carries the transform; the ref'd wrapper must not -->
  <div :style="{ transform: `rotateY(${cardRotateY(i)}deg)` }">…</div>
</div>
```

### Gotchas

- **The ref'd element must not be transformed.** `getBoundingClientRect` reports the post-transform box, so measuring a rotating element feeds its own animation back into itself. Ref an untransformed wrapper; transform a child.
- **Measurement is dependency-driven, not continuous.** Anything that moves the elements must be in `deps`, or progress goes stale until the next scroll. A late-loading image resizing a card is the realistic case.
- `progress[i]` is `undefined` before the first measurement — always `?? 0` at the call site.
- Elements measuring zero width are skipped, leaving the previous value in place.
- `elements` has no `.value`. It is a plain array.

---

## `useRevealOnIntersect`

Boolean per-element visibility via `IntersectionObserver`, for fade/slide-ins that do not need continuous progress.

```ts
const { setRef, revealed } = useRevealOnIntersect('0px 0px -10% 0px', 0.15)
```

```html
<div
  v-for="(item, i) in items"
  :ref="(el) => setRef(el as Element | null, i)"
  :class="revealed[i] ? 'opacity-100' : 'opacity-0'"
  class="transition-opacity duration-500"
>…</div>
```

Flips in both directions — `true` on enter, `false` on leave — so effects replay on scroll back.

Elements are observed from inside `setRef`, with a catch-up pass in `onMounted` for refs registered before the observer existed (ref callbacks run during patch, ahead of `onMounted`). A `WeakSet` prevents double-observing. This is what replaces watching `elements`.

Unlike `useScrollCrossProgress`, this is passive — the browser notifies on change rather than polling — so it costs nothing per frame, and a CSS `transition` **is** appropriate here.

---

## Layout constraints these depend on

- `SectionContainer` hides with `opacity-0 invisible`, not `v-if` or `v-show`. The subtree must stay in layout so `ResizeObserver` and `getBoundingClientRect` return real numbers before a section scrolls into view.
- `ProjectRowSection` measures its card row with `ResizeObserver` and parks the row offscreen until `rowWidth > 0`, because the travel range depends on the row's own width. `100vw` is not a substitute — a card row is several viewports wide on mobile.
