export type Sektor =
  | 'demir-celik'
  | 'aluminyum'
  | 'gubre'
  | 'elektrik'
  | 'cimento'
  | 'hidrojen'
  | 'amonyak'
  | 'seramik'
  | 'cam'
  | 'kauctuk-plastik'
  | 'kagit-karton'
  | 'diger'

export type IhracatAraligi =
  | 'under_1m'
  | '1m_5m'
  | '5m_20m'
  | '20m_50m'
  | 'over_50m'

export type CalisanAraligi =
  | '1_50'
  | '51_100'
  | '101_250'
  | '251_500'
  | '501_1000'
  | '1000_plus'

export type ElektrikAraligi =
  | 'under_1k'
  | '1k_5k'
  | '5k_25k'
  | '25k_100k'
  | '100k_250k'
  | '250k_1m'
  | '1m_plus'

export type YakitTipi =
  | 'dogalgaz'
  | 'dizel'
  | 'benzin'
  | 'lpg'
  | 'fueloil'
  | 'komur'
  | 'yok'

export type TuketimAraligi =
  | 'under_1k'
  | '1k_5k'
  | '5k_25k'
  | '25k_100k'
  | '100k_250k'
  | '250k_1m'
  | '1m_plus'

export type RiskLevel = 'low' | 'medium' | 'high'

export interface FormData {
  firmaAdi: string
  email: string
  sektor: Sektor | ''
  calisanAraligi: CalisanAraligi | ''
  elektrikAraligi: ElektrikAraligi | ''
  yakitTipi: YakitTipi | ''
  tuketimAraligi: TuketimAraligi | ''
  ihracatAraligi?: IhracatAraligi | ''
  telefon?: string
}

const YUKSEK_RISKLI_SEKTORLER: Sektor[] = ['demir-celik', 'aluminyum']
const ORTA_RISKLI_SEKTORLER: Sektor[] = ['gubre', 'cimento', 'hidrojen']
const YUKSEK_IHRCAT_ARALIKLARI: IhracatAraligi[] = ['20m_50m', 'over_50m']
const ORTA_IHRCAT_ARALIKLARI: IhracatAraligi[] = ['1m_5m', '5m_20m']

export function calculateCbamRisk(
  sektor: Sektor | '',
  ihracatAraligi: IhracatAraligi | '',
): RiskLevel {
  if (!sektor || !ihracatAraligi) return 'low'

  if (YUKSEK_RISKLI_SEKTORLER.includes(sektor as Sektor) && YUKSEK_IHRCAT_ARALIKLARI.includes(ihracatAraligi as IhracatAraligi)) {
    return 'high'
  }

  if (YUKSEK_RISKLI_SEKTORLER.includes(sektor as Sektor) && ORTA_IHRCAT_ARALIKLARI.includes(ihracatAraligi as IhracatAraligi)) {
    return 'medium'
  }

  if (ORTA_RISKLI_SEKTORLER.includes(sektor as Sektor) && (ORTA_IHRCAT_ARALIKLARI.includes(ihracatAraligi as IhracatAraligi) || YUKSEK_IHRCAT_ARALIKLARI.includes(ihracatAraligi as IhracatAraligi))) {
    return 'medium'
  }

  return 'low'
}

export function formatRiskLabel(level: RiskLevel): string {
  switch (level) {
    case 'high':
      return 'Yüksek CBAM Riski'
    case 'medium':
      return 'Orta Seviye CBAM Riski'
    case 'low':
      return 'Düşük CBAM Riski'
  }
}

export const RISK_LABELS: Record<RiskLevel, string> = {
  high: 'Yüksek CBAM Riski',
  medium: 'Orta Seviye CBAM Riski',
  low: 'Düşük CBAM Riski',
}

export const SEKTOR_LABELS: Record<Sektor, string> = {
  'demir-celik': 'Demir ve Çelik',
  'aluminyum': 'Alüminyum',
  'gubre': 'Gübre',
  'elektrik': 'Elektrik (Üretim / Dağıtım)',
  'cimento': 'Çimento',
  'hidrojen': 'Hidrojen',
  'amonyak': 'Amonyak',
  'seramik': 'Seramik',
  'cam': 'Cam',
  'kauctuk-plastik': 'Kauçuk ve Plastik',
  'kagit-karton': 'Kağıt ve Karton',
  'diger': 'Diğer CBAM Kapsamlı Sektörler',
}

export const IHRCAT_ARALIK_LABELS: Record<IhracatAraligi, string> = {
  'under_1m': '1 Milyon €\'dan az',
  '1m_5m': '1 - 5 Milyon €',
  '5m_20m': '5 - 20 Milyon €',
  '20m_50m': '20 - 50 Milyon €',
  'over_50m': '50 Milyon €\'dan fazla',
}

export const CALISAN_ARALIK_LABELS: Record<CalisanAraligi, string> = {
  '1_50': '1 - 50 Çalışan',
  '51_100': '51 - 100 Çalışan',
  '101_250': '101 - 250 Çalışan',
  '251_500': '251 - 500 Çalışan',
  '501_1000': '501 - 1.000 Çalışan',
  '1000_plus': '1.000+ Çalışan',
}

export const ELEKTRIK_ARALIK_LABELS: Record<ElektrikAraligi, string> = {
  'under_1k': '1.000 kWh\'den az',
  '1k_5k': '1.000 - 5.000 kWh',
  '5k_25k': '5.000 - 25.000 kWh',
  '25k_100k': '25.000 - 100.000 kWh',
  '100k_250k': '100.000 - 250.000 kWh',
  '250k_1m': '250.000 - 1.000.000 kWh',
  '1m_plus': '1.000.000 kWh+',
}

export const YAKIT_TIPI_LABELS: Record<YakitTipi, string> = {
  'dogalgaz': 'Doğalgaz',
  'dizel': 'Dizel',
  'benzin': 'Benzin',
  'lpg': 'LPG',
  'fueloil': 'Fuel Oil',
  'komur': 'Kömür',
  'yok': 'Yakıt Kullanmıyorum',
}

export const TUKETIM_ARALIK_LABELS: Record<TuketimAraligi, string> = {
  'under_1k': '1.000 m³ & 1.000 L\'den az',
  '1k_5k': '1.000 - 5.000 m³ & L',
  '5k_25k': '5.000 - 25.000 m³ & L',
  '25k_100k': '25.000 - 100.000 m³ & L',
  '100k_250k': '100.000 - 250.000 m³ & L',
  '250k_1m': '250.000 - 1.000.000 m³ & L',
  '1m_plus': '1.000.000 m³ & L+',
}
