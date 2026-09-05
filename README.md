# KarbonKontrol

CBAM (Karbon Sınırda Düzenleme Mekanizması) risk hesaplama, karbon ayak izi ve sürdürülebilirlik danışmanlığı için hazırlanmış React tabanlı landing page uygulaması.

## Özellikler

- CBAM risk hesaplama formu
- Form doğrulama ve reCAPTCHA Enterprise entegrasyonu
- n8n webhook ile form gönderimi
- Hizmetler, süreç, referanslar ve fiyat paketleri bölümleri
- Blog listesi ve blog detay modalı
- Partner giriş modalı
- Paket başvuru modalı
- Gizlilik politikası ve kullanım şartları modalları
- Responsive mobil menü ve scroll reveal animasyonları
- SEO meta etiketleri ve sosyal paylaşım bilgileri

## Teknolojiler

- React 18
- TypeScript
- Vite
- Tailwind CSS
- GSAP
- Lucide React
- n8n webhook entegrasyonu

## Gereksinimler

- Node.js 18 veya üzeri
- npm 9 veya üzeri

## Kurulum

```bash
npm install
```

Ortam değişkenlerini oluşturmak için örnek dosyayı kopyalayın:

```bash
copy .env.example .env
```

PowerShell kullanıyorsanız:

```powershell
Copy-Item .env.example .env
```

`.env` dosyasındaki webhook adresini projenizin n8n endpoint’i ile güncelleyin:

```env
VITE_N8N_WEBHOOK_URL=https://example.com/webhook/cbam-form-submit
VITE_N8N_API_KEY=
```

> `VITE_` ile başlayan değişkenler tarayıcı JavaScript bundle’ına dahil edilir. Bu nedenle `VITE_N8N_API_KEY` içine yüksek gizlilik gerektiren bir anahtar koymayın. Güvenli kullanım için webhook doğrulamasını backend veya server-side proxy üzerinden yapın.

## Geliştirme

Geliştirme sunucusunu başlatın:

```bash
npm run dev
```

Varsayılan adres:

```text
http://localhost:5173
```

## Üretim derlemesi

TypeScript kontrolü ve Vite üretim derlemesi:

```bash
npm run build
```

Üretim derlemesini yerel olarak önizlemek için:

```bash
npm run preview
```

Derleme çıktısı `dist/` klasöründe oluşturulur.

## Proje yapısı

```text
src/
├── components/
│   ├── calculator/     CBAM hesaplama formu ve gönderim modalı
│   ├── layout/         Navbar ve Footer
│   ├── modal/          Blog, partner ve paket modalları
│   ├── sections/       Sayfa bölümleri
│   └── ui/             Ortak arayüz bileşenleri
├── data/               Blog içerikleri
├── hooks/              Scroll reveal hook’ları
├── lib/                Risk hesaplama ve n8n entegrasyonu
├── assets/             Görseller ve asset tanımları
├── App.tsx             Ana uygulama bileşeni
└── index.css           Global stiller
```

## Dağıtım notları

- `node_modules/`, `dist/`, `.env` ve `.trae/` Git ile izlenmez.
- Üretim ortamında `npm run build` çalıştırılmalıdır.
- Webhook endpoint’i CORS isteklerine izin vermelidir.
- reCAPTCHA Enterprise site key ve ilgili domain ayarları üretim domain’i için yapılandırılmalıdır.
- Form gönderimlerinin güvenilirliği için n8n webhook yanıtları ve sunucu logları ayrıca izlenmelidir.

## Lisans

Bu proje KarbonKontrol / Kalibre Sistem için hazırlanmıştır. Kullanım ve dağıtım koşulları proje sahibinin iznine tabidir.
