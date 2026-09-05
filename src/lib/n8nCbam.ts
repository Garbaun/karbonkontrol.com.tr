import type { FormData, RiskLevel, IhracatAraligi, ElektrikAraligi, YakitTipi } from './cbamRisk'
import {
  SEKTOR_LABELS,
  CALISAN_ARALIK_LABELS,
  ELEKTRIK_ARALIK_LABELS,
  YAKIT_TIPI_LABELS,
  TUKETIM_ARALIK_LABELS,
  IHRCAT_ARALIK_LABELS,
  RISK_LABELS,
} from './cbamRisk'
import type { PricingTierKey as PricingTierKeyRef, PricingPackage as PricingPackageRef } from '@/components/sections/PricingPackages'

export type PricingTierKey = PricingTierKeyRef
export type PricingPackage = PricingPackageRef

export type PricingInquiryForm = {
  companyName: string
  email: string
  phone: string
  elektrikAraligi: ElektrikAraligi | ''
  yakitTipi: YakitTipi | ''
}

export type CbamSubmissionPayload = {
  source: 'karbonkontrol-cbam-calculator'
  submittedAt: string
  calculatedRisk: RiskLevel
  calculatedRiskLabel: string
  recaptchaToken?: string
  form: FormData & {
    ihracatAraligi: IhracatAraligi
  }
  labels: {
    sektor?: string
    calisanAraligi?: string
    elektrikAraligi?: string
    yakitTipi?: string
    tuketimAraligi?: string
    ihracatAraligi?: string
  }
  meta: {
    userAgent: string
    locale: string
    timezone: string
    referrer: string
    screen: {
      width: number
      height: number
      pixelRatio: number
    }
  }
}

export const RECAPTCHA_SITEKEY =
  (import.meta.env.VITE_RECAPTCHA_SITEKEY as string | undefined) ||
  '6Lc3HqUtAAAAAIp5xqXH_hzDWPOofp6IyaHsdDPd'

const DEFAULT_WEBHOOK_URL = 'https://n8n.kalibresistem.com/webhook/cbam-form-submit'
const DEFAULT_PRICING_WEBHOOK_URL = 'https://n8n.kalibresistem.com/webhook/pricing-inquiry'
const N8N_WEBHOOK_URL = (import.meta.env.VITE_N8N_WEBHOOK_URL as string | undefined) || DEFAULT_WEBHOOK_URL
const N8N_PRICING_WEBHOOK_URL =
  (import.meta.env.VITE_N8N_WEBHOOK_URL_PRICING as string | undefined) || DEFAULT_PRICING_WEBHOOK_URL
const N8N_API_KEY = import.meta.env.VITE_N8N_API_KEY as string | undefined
const REQUEST_TIMEOUT_MS = 12000

export const ELEKTRIK_ARALIKLARI: Array<{ value: ElektrikAraligi | ''; label: string }> = [
  { value: '', label: 'Seçiniz' },
  ...(Object.entries(ELEKTRIK_ARALIK_LABELS) as Array<[ElektrikAraligi, string]>).map(([value, label]) => ({
    value,
    label,
  })),
]

export const YAKIT_TURLERI: Array<{ value: YakitTipi | ''; label: string }> = [
  { value: '', label: 'Seçiniz' },
  ...(Object.entries(YAKIT_TIPI_LABELS) as Array<[YakitTipi, string]>).map(([value, label]) => ({
    value,
    label,
  })),
]

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`n8n webhook timeout after ${ms}ms`)), ms),
    ),
  ])
}

function getIhracat(form: FormData): IhracatAraligi {
  const raw = form.ihracatAraligi
  const valid: IhracatAraligi[] = ['under_1m', '1m_5m', '5m_20m', '20m_50m', 'over_50m']
  if (typeof raw === 'string' && valid.includes(raw as IhracatAraligi)) {
    return raw as IhracatAraligi
  }
  return 'under_1m'
}

function resolveLabels(form: FormData) {
  const ihracatAraligi = getIhracat(form)
  return {
    sektor: form.sektor ? SEKTOR_LABELS[form.sektor] : undefined,
    calisanAraligi: form.calisanAraligi ? CALISAN_ARALIK_LABELS[form.calisanAraligi] : undefined,
    elektrikAraligi: form.elektrikAraligi ? ELEKTRIK_ARALIK_LABELS[form.elektrikAraligi] : undefined,
    yakitTipi: form.yakitTipi ? YAKIT_TIPI_LABELS[form.yakitTipi] : undefined,
    tuketimAraligi: form.tuketimAraligi ? TUKETIM_ARALIK_LABELS[form.tuketimAraligi] : undefined,
    ihracatAraligi: IHRCAT_ARALIK_LABELS[ihracatAraligi],
  }
}

export async function sendCbamSubmission(
  formData: FormData,
  calculatedRisk: RiskLevel,
  options?: { debug?: boolean; recaptchaToken?: string },
): Promise<{ ok: boolean; skipped?: boolean; status?: number; statusText?: string; url?: string }> {
  if (!N8N_WEBHOOK_URL) {
    if (options?.debug) {
      console.warn('[n8n] Webhook URL ayarlanmamış. Webhook çağrısı atlandı.')
    }
    return { ok: true, skipped: true }
  }
  if (options?.debug) {
    console.log(
      '[n8n] Webhook çağrısı:',
      N8N_WEBHOOK_URL,
      N8N_WEBHOOK_URL === DEFAULT_WEBHOOK_URL ? '(default fallback)' : '(env override)',
    )
  }

  const ihracatAraligi = getIhracat(formData)
  const payload: CbamSubmissionPayload = {
    source: 'karbonkontrol-cbam-calculator',
    submittedAt: new Date().toISOString(),
    calculatedRisk,
    calculatedRiskLabel: RISK_LABELS[calculatedRisk] || calculatedRisk,
    recaptchaToken: options?.recaptchaToken || undefined,
    form: {
      ...formData,
      ihracatAraligi,
    },
    labels: resolveLabels(formData),
    meta: {
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      locale: typeof navigator !== 'undefined' ? navigator.language || 'tr-TR' : 'tr-TR',
      timezone:
        typeof Intl !== 'undefined' && 'DateTimeFormat' in Intl
          ? Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
          : 'UTC',
      referrer: typeof document !== 'undefined' ? document.referrer || window.location.href : '',
      screen:
        typeof window !== 'undefined' && window.screen
          ? {
              width: window.screen.width || 0,
              height: window.screen.height || 0,
              pixelRatio: window.devicePixelRatio || 1,
            }
          : { width: 0, height: 0, pixelRatio: 1 },
    },
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Client': 'karbonkontrol-landing',
    'X-Source': 'cbam-calculator',
  }
  if (N8N_API_KEY) {
    headers['X-N8N-API-KEY'] = N8N_API_KEY
    headers.Authorization = `Bearer ${N8N_API_KEY}`
  }

  try {
    const res = await withTimeout(
      fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        mode: 'cors',
        credentials: 'omit',
        keepalive: true,
        headers,
        body: JSON.stringify(payload),
      }),
      REQUEST_TIMEOUT_MS,
    )
    if (!res.ok) {
      const msg = await res.text().catch(() => '')
      if (options?.debug) {
        console.error('[n8n] Webhook hatası:', res.status, res.statusText, msg)
      }
      return { ok: false, status: res.status, statusText: res.statusText }
    }
    if (options?.debug) {
      console.log('[n8n] Webhook başarıyla gönderildi.')
    }
    return { ok: true, status: res.status, statusText: res.statusText }
  } catch (err) {
    if (options?.debug) {
      console.error('[n8n] Webhook gönderilemedi:', err)
    }
    return { ok: false }
  }
}

export type PricingInquiryPayload = {
  source: 'karbonkontrol-pricing-inquiry'
  submittedAt: string
  packageKey: PricingTierKey
  packageTitle: string
  packageBadge?: string | null
  packageEyebrow?: string | null
  packageHeadline?: string | null
  packageFeatured?: boolean
  recaptchaToken?: string
  form: PricingInquiryForm
  labels: {
    elektrikAraligi?: string
    yakitTipi?: string
  }
  meta: {
    userAgent: string
    locale: string
    timezone: string
    referrer: string
    screen: { width: number; height: number; pixelRatio: number }
  }
}

export async function sendPricingInquiry(
  formData: PricingInquiryForm,
  pkg: PricingPackage,
  options?: { debug?: boolean; recaptchaToken?: string },
): Promise<{ ok: boolean; skipped?: boolean; status?: number; statusText?: string }> {
  if (!N8N_PRICING_WEBHOOK_URL) {
    if (options?.debug) {
      console.warn('[n8n pricing] Webhook URL ayarlanmamış. Çağrı atlandı.')
    }
    return { ok: true, skipped: true }
  }
  if (options?.debug) {
    console.log(
      '[n8n pricing] Webhook çağrısı:',
      N8N_PRICING_WEBHOOK_URL,
      N8N_PRICING_WEBHOOK_URL === DEFAULT_PRICING_WEBHOOK_URL ? '(default fallback)' : '(env override)',
      'Paket:',
      pkg.key,
    )
  }

  const elektrikValue = (formData.elektrikAraligi || '') as ElektrikAraligi | ''
  const yakitValue = (formData.yakitTipi || '') as YakitTipi | ''

  const payload: PricingInquiryPayload = {
    source: 'karbonkontrol-pricing-inquiry',
    submittedAt: new Date().toISOString(),
    packageKey: pkg.key,
    packageTitle: pkg.title,
    packageBadge: pkg.badge ?? null,
    packageEyebrow: pkg.eyebrow ?? null,
    packageHeadline: pkg.headline ?? null,
    packageFeatured: !!pkg.featured,
    recaptchaToken: options?.recaptchaToken,
    form: formData,
    labels: {
      elektrikAraligi: elektrikValue ? ELEKTRIK_ARALIK_LABELS[elektrikValue] : undefined,
      yakitTipi: yakitValue ? YAKIT_TIPI_LABELS[yakitValue] : undefined,
    },
    meta: {
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      locale: typeof navigator !== 'undefined' ? navigator.language || 'tr-TR' : 'tr-TR',
      timezone:
        typeof Intl !== 'undefined' && 'DateTimeFormat' in Intl
          ? Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
          : 'UTC',
      referrer: typeof document !== 'undefined' ? document.referrer || window.location.href : '',
      screen:
        typeof window !== 'undefined' && window.screen
          ? {
              width: window.screen.width || 0,
              height: window.screen.height || 0,
              pixelRatio: window.devicePixelRatio || 1,
            }
          : { width: 0, height: 0, pixelRatio: 1 },
    },
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Client': 'karbonkontrol-landing',
    'X-Source': 'pricing-inquiry',
  }
  if (N8N_API_KEY) {
    headers['X-N8N-API-KEY'] = N8N_API_KEY
    headers.Authorization = `Bearer ${N8N_API_KEY}`
  }

  try {
    const res = await withTimeout(
      fetch(N8N_PRICING_WEBHOOK_URL, {
        method: 'POST',
        mode: 'cors',
        credentials: 'omit',
        keepalive: true,
        headers,
        body: JSON.stringify(payload),
      }),
      REQUEST_TIMEOUT_MS,
    )
    if (!res.ok) {
      const msg = await res.text().catch(() => '')
      if (options?.debug) {
        console.error('[n8n pricing] Webhook hatası:', res.status, res.statusText, msg)
      }
      return { ok: false, status: res.status, statusText: res.statusText }
    }
    if (options?.debug) {
      console.log('[n8n pricing] Webhook başarıyla gönderildi.')
    }
    return { ok: true, status: res.status, statusText: res.statusText }
  } catch (err) {
    if (options?.debug) {
      console.error('[n8n pricing] Webhook gönderilemedi:', err)
    }
    return { ok: false }
  }
}
