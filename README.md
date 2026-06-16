# portfolio-site-v2

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

### Some examples of Logo element usage

```html
<div class="flex flex-row bg-gunmetal p-6">
  <Logo outlineColor="#FFFFFF" fillColor="transparent" :width="200" />
  <Logo :gradient-fill="true" />
</div>
<div class="flex flex-row bg-gunmetal p-6">
  <Logo
    :gradient-fill="true"
    gradient-color-one="#3c3c3b"
    gradient-color-two="#5B8E7D"
    outline-color="#B07156"
  />
  <Logo outline-color="#3c3c3b" fill-color="#B07156" back-fill-color="#558B6E" :width="360" />
</div>
<div class="flex flex-row bg-gunmetal p-6">
  <Logo outlineColor="#FFFFFF" fillColor="transparent" :width="200" />
  <Logo :gradient-fill="true" />
</div>
<div class="flex flex-row bg-gunmetal p-6">
  <Logo
    :gradient-fill="true"
    gradient-color-one="#3c3c3b"
    gradient-color-two="#5B8E7D"
    outline-color="#B07156"
  />
  <Logo outline-color="#3c3c3b" fill-color="#B07156" back-fill-color="#558B6E" :width="360" />
</div>
```
