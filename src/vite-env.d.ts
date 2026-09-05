/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_N8N_WEBHOOK_URL?: string
  readonly VITE_N8N_API_KEY?: string
  readonly VITE_RECAPTCHA_SITEKEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

type RecaptchaEnterpriseExecute = (
  siteKey: string,
  options: { action: string },
) => Promise<string>

type RecaptchaEnterpriseModule = {
  execute: RecaptchaEnterpriseExecute
  ready?: (callback: () => void) => Promise<void> | void
}

type GrecaptchaEnterpriseGlobal = {
  enterprise: RecaptchaEnterpriseModule
}

declare global {
  interface Window {
    grecaptcha?: GrecaptchaEnterpriseGlobal
  }
}

export {}
