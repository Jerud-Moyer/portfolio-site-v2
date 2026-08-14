interface ImportMetaEnv {
  readonly VITE_EMAIL_URL: string
  readonly VITE_EMAIL_RECEIVER: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
