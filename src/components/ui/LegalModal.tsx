import { useEffect } from 'react'
import { X, ShieldCheck, FileText, Cookie, HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export type LegalType = 'terms' | 'privacy' | 'cookies' | 'faq'

type LegalModalProps = {
  open: boolean
  onClose: () => void
  type: LegalType
}

const KALIBRE_INFO = [
  'KarbonKontrol, Kalibre Sistem markası altında sunulan bir alt uygulamasıdır.',
  'Veri Sorumlusu Unvanı: Kalibre Sistem',
  'İletişim (DPO / KVKK): kvkk@kalibresistem.com',
  'Kayıtlı Adres: Bahçeli Evler Mah. Gazi Paşa Cad. No:135/17, Merkez / YALOVA',
  'reCAPTCHA v3 kullanımı: Formlar aracılığıyla gönderilen isteklerin güvenliği, otomatik bot saldırılarına karşı Google reCAPTCHA v3 tarafından denetlenmektedir. reCAPTCHA, IP adresiniz ve gerektiğinde diğer bilgileri Google ile paylaşabilir; bu kapsamda Google Gizlilik Politikası ve Kullanım Şartları geçerlidir.',
]

const PRIVACY_BODY_KVKK = [
  {
    title: '8. KVKK (6698 Sayılı Kanun) Kapsamında Aydınlatma',
    paragraphs: [
      '6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, kişisel verileriniz veri sorumlusu sıfatıyla Kalibre Sistem tarafından, aşağıda belirtilen amaçlarla sınırlı olmak üzere işlenmektedir.',
      'Kişisel verileriniz; hizmet sunumu, sözleşmenin ifası, yasal yükümlülüklerin yerine getirilmesi, meşru menfaatler ve açık rıza hallerinde Kanun’un 5. maddesinde sayılan sebeplerle işlenir. İşlenen veriler arasında ad soyad, telefon, e-posta, şirket bilgileri, ürün ve ihracat bilgileri, IP adresi, analitik kullanım verileri bulunabilir.',
    ],
  },
  {
    title: '9. KVKK Haklarınız',
    paragraphs: [
      'KVKK m.11 uyarınca sahip olduğunuz başlıca haklarınız şunlardır: (i) Verilerinizin işlenip işlenmediğini öğrenme, (ii) İşlenen kişisel verilerinizin kendinize ifa edilmesini isteme, (iii) Eksik veya yanlış işlenmiş verilerin düzeltilmesini isteme, (iv) Verilerinizin silinmesini veya yok edilmesini isteme, (v) Verilerinizin 3. kişilere aktarılması halinde, bu kişilere de işlemlerin bildirilmesini isteme, (vi) Verilerinizin ancak kanunda sayılan amaçlarla sınırlı olarak işlenmesi için itiraz etme, (vii) Veri analizi gibi otomatik sistemlerle karar verilmesi halinde sonuca itiraz etme, (viii) Haksız işleme nedeniyle ortaya çıkan zararınızın tazmin edilmesini isteme.',
      'Bu haklarınızı kullanmak için DPO (Veri Sorumlusuna Yardımcı) adresimiz olan kvkk@kalibresistem.com üzerinden veya Kayıtlı Adresimizden yazılı olarak başvuruda bulunabilirsiniz. Talepleriniz, kanunda öngörülen süreler içinde (en geç 30 gün) ve ücretsiz olarak cevaplandırılır.',
    ],
  },
  {
    title: '10. Yasal Bilgi – Kalibre Sistem',
    paragraphs: [...KALIBRE_INFO, 'Uyuşmazlıkların Çözümü: İşbu Gizlilik Politikası ve KVKK kapsamında doğacak uyuşmazlıklarda öncelikle dostane çözüm yolu izlenir. Anlaşamama halinde Yalova Mahkemeleri yetkilidir.'],
  },
]

const privacyContent: { title: string; paragraphs: string[] }[] = [
  {
    title: '1. Genel Hükümler',
    paragraphs: [
      'KarbonKontrol web sitesini ("Site") ziyaretçilerinin ("Kullanıcı") gizliliğini korumak, işbu Gizlilik Politikası ile KVKK Aydınlatma Metni\'nin temel amacıdır. Bu politika, Kalibre Sistem ("Veri Sorumlusu") tarafından işletilen Site üzerinden toplanan, işlenen ve saklanan kişisel verilerin nasıl ele alındığını açıklamaktadır. KarbonKontrol, Kalibre Sistem tarafından sunulan bir alt uygulamasıdır.',
      'Siteyi kullanarak, işbu Gizlilik Politikası\'nda belirtilen uygulamaları kabul etmiş sayılırsınız. Eğer bu koşulları kabul etmiyorsanız, Siteyi kullanmamanız tavsiye edilir. Şirket, bu politikayı dilediği zaman güncelleme hakkını saklı tutar; güncellemeler Site üzerinde yayınlandığı tarihte yürürlüğe girer.',
    ],
  },
  {
    title: '2. Toplanan Kişisel Veriler',
    paragraphs: [
      'Site üzerinden, kullanıcılarımızdan talep ettiğimiz kişisel veriler arasında ad soyad, e-posta adresi, telefon numarası, şirket adı, sektör, ihracat bilgileri, ürün bilgileri ve iletişim tercihleriniz bulunmaktadır. CBAM hesaplayıcı aracılığıyla girdiğiniz ürün/sektör/emisyon bilgileri, anonimleştirilmiş olarak istatistiksel ve ürün geliştirme amaçlarıyla kullanılabilir.',
      'Ayrıca, tarayıcınızın otomatik olarak gönderdiği IP adresi, tarayıcı türü, referans sayfaları, ziyaret süreleri, cihaz bilgileri ve tıklama davranışları gibi teknik veriler de analiz, güvenlik ve kullanıcı deneyimi iyileştirme amacıyla toplanabilmektedir. Bu teknik veriler Google Analytics (anonimleştirilmiş IP) ve benzeri araçlarla toplanabilir.',
    ],
  },
  {
    title: '3. Verilerin Kullanım Amacı (KVKK m.5)',
    paragraphs: [
      'Toplanan kişisel veriler; size özel hizmet sunmak, CBAM mevzuatına uyum konularında bilgilendirme yapmak, anket, kampanya ve duyuruları (açık rızanız halinde) iletmek, hizmetlerimizi geliştirmek, güvenlik tedbirlerini almak, sözleşme yükümlülüklerini yerine getirmek ve yasal yükümlülükleri yerine getirmek amacıyla işlenmektedir.',
      'Açık rızanız olmadıkça kişisel verileriniz üçüncü şahıslarla paylaşılmaz, satılmaz veya kiraya verilmez. Hizmet sağlayıcılarımız (barındırma, e-posta, analiz) ile paylaştığımız veriler, yalnızca sözleşme kapsamında, yeterli gizlilik sözleşmeleri çerçevesinde ve asgari düzeyde tutulmaktadır.',
    ],
  },
  {
    title: '4. Veri Saklama Süresi',
    paragraphs: [
      'Kişisel verileriniz, işleme amaçlarının gerektirdiği süre boyunca ve 6698 sayılı KVKK, TCK, Vergi Usul Kanunu ve ilgili mevzuatta öngörülen saklama yükümlülükleri süresince saklanır. Bu süreler dolduğunda veya gerekçenin ortadan kalkması halinde verileriniz silinir, yok edilir veya anonimleştirilir.',
      'Güvenlik, finansal ve analitik kayıtlar, mevzuatta öngörülen azami süreler boyunca saklanır (genellikle 3-10 yıl arası).',
    ],
  },
  {
    title: '5. Verilerin Aktarımı',
    paragraphs: [
      'Kişisel verileriniz, yasal bir dayanak olmadıkça yurt dışına aktarılmaz. Gerektiğinde KVKK m.9 kapsamında yeterli koruma sağlanan ülkelerdeki hizmet sağlayıcılarımızla, KVKK Kurulu kararları ve standart sözleşme maddeleri çerçevesinde aktarım yapılabilir.',
      'Form gönderimlerinde güvenlik için kullanılan reCAPTCHA v3 kapsamında, Google tarafından sunulan hizmet için gerekli olan bilgiler Google sunucularına aktarılabilir (bilgi için: policies.google.com/privacy).',
    ],
  },
  {
    title: '6. Veri Güvenliği',
    paragraphs: [
      'Kişisel verilerinizin güvenliği için endüstri standartlarında teknik ve idari güvenlik önlemleri alınmaktadır. HTTPS şifrelemesi, erişim kontrolü, düzenli güvenlik denetimleri, güvenli sunucu mimarisi ve personel eğitimi ile verilerinizin yetkisiz erişim, değişim veya ifşaya karşı korunması sağlanmaktadır.',
      'Ancak internet üzerinden hiçbir veri iletiminin veya elektronik depolamanın %100 güvenli olmadığını unutmayınız. Şirket, güvenliğini sağlamak için ticari olarak makul tüm çabayı göstermektedir.',
    ],
  },
  {
    title: '7. Çerezler ve Analitik',
    paragraphs: [
      'Site, kullanıcı deneyimini iyileştirmek, analitik ölçüm yapmak ve güvenli form gönderimleri (reCAPTCHA v3) için çerezler kullanmaktadır. Detaylı bilgi için "Çerez Politikası"nı inceleyiniz.',
    ],
  },
  ...PRIVACY_BODY_KVKK,
]

const termsContent: { title: string; paragraphs: string[] }[] = [
  {
    title: '1. Sözleşmenin Konusu',
    paragraphs: [
      'İşbu Şartlar ve Koşullar, KarbonKontrol web sitesi ("Site") ve sunulan hizmetlerin kullanımına ilişkin şartları ve koşulları düzenler. Site, Kalibre Sistem ("Şirket") tarafından işletilmektedir. KarbonKontrol, Kalibre Sistem alt uygulaması olarak hizmet verir.',
      'Siteyi kullanarak işbu şartları tamamen kabul etmiş sayılırsınız. 18 yaşından küçükyseniz ebeveyn veya vasi gözetiminde kullanmanız gerekmektedir.',
    ],
  },
  {
    title: '2. Hizmet Kapsamı',
    paragraphs: [
      'Site üzerinden kullanıcılarımıza CBAM (Sınırda Karbon Düzenleme Mekanizması) mevzuatı hakkında bilgilendirme, karbon emisyonu ve CBAM risk hesaplama aracı, sürdürülebilirlik danışmanlık hizmetleri hakkında tanıtım içerikleri ve Yeşil Yaprak rozeti hakkında bilgilendirme sunulmaktadır.',
      'CBAM hesaplayıcı aracı yalnızca bilgilendirme ve tahmin amaçlıdır ve kesin, bağlayıcı sonuçlar vermez. Gerçek ticari, gümrük ve mevzuata dayalı kararlar için Kalibre Sistem uzman desteği almanız önerilir.',
    ],
  },
  {
    title: '3. Kullanıcı Yükümlülükleri',
    paragraphs: [
      'Kullanıcı, Siteyi mevcut yasalara, 5651 sayılı İnternet Kanunu\'na, 6698 sayılı KVKK\'ya, ahlak kurallarına ve işbu şartlara uygun olarak kullanmayı taahhüt eder. Site güvenliğini tehlikeye atacak, sistemlere müdahale edecek, izinsiz veri erişimi sağlayacak veya bot zararlı yazılım kullanacak davranışlarda bulunamaz.',
      'Site üzerinden yanlış, yanıltıcı, hukuka aykırı, üçüncü kişilerin haklarını ihlal eden içerikler paylaşılamaz. Bu tür davranışlar sonucu oluşabilecek tüm zararlardan kullanıcı sorumludur; Şirket, gerekli yasal işlemleri yapma hakkını saklı tutar.',
    ],
  },
  {
    title: '4. Fikri Mülkiyet Hakları',
    paragraphs: [
      'Site üzerindeki tüm metin, görsel, logo, yazılım, tasarım, Yeşil Yaprak Rozeti tasarımları, hesaplama algoritmaları ve diğer tüm içeriklerin fikri mülkiyet hakları Şirkete veya lisans verenlerine aittir. Önceden yazılı izin alınmadan kopyalanamaz, çoğaltılamaz, dağıtılamaz, türev eser üretilemez veya ticari amaçla kullanılamaz.',
      'KarbonKontrol ismi, Yeşil Yaprak markası ve logoları Şirketin tescilli veya tescile başvurulmuş markalarıdır. İzinsiz kullanımı yasal sorumluluk doğurur.',
    ],
  },
  {
    title: '5. Sorumluluğun Sınırlandırılması',
    paragraphs: [
      'Site üzerinde sunulan bilgilerin doğruluğu için özen gösterilmekle birlikte, hiçbir hata veya eksiklik olmadığına dair kesin garanti verilmemektedir. Site kullanımından kaynaklanan doğrudan veya dolaylı zararlarda Şirket sorumluluğu, kanunen zorunlu olmadıkça, son 12 ay içinde kullanıcıdan alınan toplam ücret ile sınırlı tutulmaktadır.',
      'Site üzerindeki üçüncü taraf web sitelerine verilen bağlantılar yalnızca kolaylık sağlaması amaçlıdır. Bağlantı verilen sitelerin içeriği Şirket kontrolünde değildir ve sorumluluk kabul edilmemektedir.',
    ],
  },
  {
    title: '6. Değişiklik Hakkı',
    paragraphs: [
      'Şirket, işbu Şartlar ve Koşullar\'ı dilediği zaman değiştirme hakkına sahiptir. Yapılan değişiklikler Site üzerinde yayınlandığı tarihten itibaren geçerli olacaktır. Değişikliklerden sonra Siteyi kullanmaya devam etmeniz, yeni şartları kabul ettiğiniz anlamına gelir.',
    ],
  },
  {
    title: '7. Uyuşmazlıkların Çözümü ve Yetkili Mahkeme',
    paragraphs: [
      'İşbu şartlardan kaynaklanan uyuşmazlıklarda Türk hukuku uygulanır. Uyuşmazlıkların çözümünde öncelikle dostane yöntemler uygulanmaya çalışılacaktır. Anlaşamama halinde YALOVA Mahkemeleri ve İcra Daireleri yetkilidir.',
      'Herhangi bir uyuşmazlık durumunda info@karbonkontrol.com.tr adresinden veya kvkk@kalibresistem.com adresinden iletişime geçerek sorunu dostane çözmek için çaba göstermemiz rica olunur.',
    ],
  },
  {
    title: '8. Şirket / Uygulama Bilgisi',
    paragraphs: KALIBRE_INFO,
  },
]

const cookiesContent: { title: string; paragraphs: string[] }[] = [
  {
    title: '1. Çerez (Cookie) Nedir?',
    paragraphs: [
      'Çerezler, ziyaret ettiğiniz web siteleri tarafından tarayıcınız aracılığıyla cihazınıza (bilgisayar, telefon, tablet) kaydedilen küçük metin dosyalarıdır. Çerezler, siteyi tekrar ziyaret ettiğinizde sizi tanımaya, tercihlerinizi hatırlamaya ve daha iyi bir kullanıcı deneyimi sunmaya yardımcı olur.',
      'KarbonKontrol sitesi ("Site"), Kalibre Sistem tarafından işletilmektedir ve aşağıda açıklanan çerezleri kullanmaktadır.',
    ],
  },
  {
    title: '2. Kullanılan Çerez Türleri',
    paragraphs: [
      '• Zorunlu (Gerekli) Çerezler: Sitenin çalışması için kesin olarak gerekli olan çerezlerdir (oturum, güvenlik, form CSRF vb.). Bu çerezler genellikle tarayıcı kapatıldıktan sonra silinir.',
      '• Performans ve Analitik Çerezler: Ziyaretçi davranışlarını anlamak, sitenin performansını ölçmek ve hataları tespit etmek için kullanılır (örn: Google Analytics ile anonimleştirilmiş IP kullanıcı bilgileri).',
      '• Güvenlik Çerezleri: Bot ve kötü amaçlı form gönderimlerini önlemek için reCAPTCHA v3 kullanılır. Bu çerezi Google sunmaktadır; kapsamı için policies.google.com/privacy adresini inceleyebilirsiniz.',
      '• Tercih Çerezleri: Dil, tema vb. kullanıcı tercihlerinizi hatırlamak için kullanılır.',
    ],
  },
  {
    title: '3. Çerez Kontrolü',
    paragraphs: [
      'Tarayıcınızın ayarlarını değiştirerek çerezleri reddetme veya çerez olduğunda uyarı alma seçeneğine sahipsiniz. Ancak zorunlu çerezleri devre dışı bırakmanız durumunda sitenin bazı özellikleri tam olarak çalışmayabilir.',
      'Google Analytics opt-out: https://tools.google.com/dlpage/gaoptout adresinden tarayıcı eklentisini indirerek Google Analytics ölçümünü kapatabilirsiniz.',
    ],
  },
  {
    title: '4. Çerez Süreleri',
    paragraphs: [
      '• Oturum Çerezleri: Tarayıcı kapatılınca otomatik olarak silinir.',
      '• Kalıcı Çerezler: Belirlenen süre sonunda (3 ay – 2 yıl) ya da siz silmedikçe cihazınızda saklanır.',
      '• reCAPTCHA çerezleri: Google tarafından belirlenen süre kadar saklanır, tipik olarak 6 ay ile 2 yıl arasındadır.',
    ],
  },
  {
    title: '5. Üçüncü Taraf Çerezleri',
    paragraphs: [
      'Site, Google LLC (Analytics / reCAPTCHA v3) tarafından sağlanan hizmetleri kullanmaktadır. Bu üçüncü taraflar kendi çerezlerini kullanabilir ve verileri kendi sunucularına aktarabilir. Üçüncü taraf çerezleri, ilgili hizmet sağlayıcının kendi gizlilik politikalarına tabidir.',
    ],
  },
  {
    title: '6. Yasal Bilgi',
    paragraphs: KALIBRE_INFO,
  },
]

const faqContent: { title: string; paragraphs: string[] }[] = [
  {
    title: '1. KarbonKontrol hangi şirketin ürünüdür?',
    paragraphs: [
      'KarbonKontrol, Kalibre Sistem markası altında sunulan bir alt uygulamasıdır. Karbon yönetimi, CBAM uyumu ve Yeşil Yaprak rozeti süreçlerinde Kalibre Sistem uzmanlığını dijital ürünlere dönüştüren platformumuzdur. Tüm yasal ve operasyonel sorumluluk Kalibre Sistem’e aittir.',
    ],
  },
  {
    title: '2. CBAM hesaplayıcı ne işe yarar? Sonuçlar kesin midir?',
    paragraphs: [
      'CBAM Hesaplayıcı, ihracatçınızın Avrupa Birliği pazarına sunacağı ürünler için ön tahmini CBAM risk seviyesini (yüksek / orta / düşük) size 5 adet basit soru ile dakikalar içinde gösterir. Amaç, kurumun CBAM mevzuatına hazırlık seviyesini görselleştirmektir.',
      'Hesaplayıcı sonuçları tahmin amaçlıdır, bağlayıcı değildir ve resmi beyanname yerine geçmez. Kesin hesaplama, belgeli süreç ve denetimli raporlama için Kalibre Sistem uzman ekibi ile iletişime geçebilirsiniz.',
    ],
  },
  {
    title: '3. Yeşil Yaprak Rozeti nedir, nasıl alınır?',
    paragraphs: [
      'Yeşil Yaprak Rozeti, KarbonKontrol metodolojisi ile ölçülen, doğrulanan ve sektör referans değerlerinin altında emisyon ayak izi olan şirketlerin markalarına ekleyebildiği bağımsız bir sürdürülebilirlik rozetidir. Kurumunuz bu rozet ile ürün ve iletişimlerinde çevresel taahhüdünü belgeleyebilir.',
      'Başvuru süreci: (a) Veri alımı, (b) Emisyon envanteri & hesaplama, (c) Kalibrasyon ve kontrol, (d) Raporlama, (e) Rozet teslim. Süreç hakkında detaylı bilgi için "Ekibimizle görüşün" CTA formunu doldurabilirsiniz.',
    ],
  },
  {
    title: '4. Ücretli mi? Demo randevusu nasıl alırım?',
    paragraphs: [
      'Web sitesinde yer alan CBAM hesaplayıcı, içerikler ve blog materyalleri ücretsizdir. Yeşil Yaprak Rozeti ve özel danışmanlık hizmetleri, kurumunuza özel kapsamına göre ücretlendirilir.',
      'Demo isteği için Navbar\'daki "Demo İste" butonunu veya formu kullanabilirsiniz; uzman ekibimiz en geç 1 iş günü içinde sizinle iletişime geçecektir.',
    ],
  },
  {
    title: '5. Kişisel verilerim nasıl korunuyor? KVKK haklarımı nasıl kullanırım?',
    paragraphs: [
      'Kişisel verileriniz, Kalibre Sistem (Veri Sorumlusu) tarafından 6698 sayılı KVKK ve ilgili mevzuat çerçevesinde, kanuni dayanaklara uygun olarak ve amacın ötesine geçmeden işlenir. Teknik ve idari güvenlik önlemleri ile korunur.',
      'KVKK m.11 kapsamındaki tüm haklarınızı (bilgi, düzeltme, silme, itiraz, tazminat vb.) kullanmak için DPO adresimiz olan kvkk@kalibresistem.com e-postasından veya Kayıtlı Adresimizden yazılı başvuru yapabilirsiniz. Detaylı bilgi için Gizlilik Politikası ve KVKK Aydınlatma Metni\'ni inceleyebilirsiniz.',
    ],
  },
  {
    title: '6. Site neden güvenli? Formlarda bot koruması var mı?',
    paragraphs: [
      'Sitemiz HTTPS ile şifrelenmiş iletişim sunar. Tüm form gönderimlerinde Google reCAPTCHA v3 kullanılır; bu sayede bot ve kötü amaçlı otomatik gönderimler önlenir. reCAPTCHA v3, kullanıcı deneyimini etkilemeden (resim çöz vs. yok) arka planda güvenlik puanı üreterek çalışır.',
    ],
  },
  {
    title: '7. İletişim ve Uyuşmazlık',
    paragraphs: [
      ['Hizmetlerimiz hakkında destek, bilgi ve iş birliği için: info@karbonkontrol.com.tr',
        'KVKK / Gizlilik / DPO başvuruları için: kvkk@kalibresistem.com',
        'Kayıtlı Adres: Bahçeli Evler Mah. Gazi Paşa Cad. No:135/17, Merkez / YALOVA',
        'Uyuşmazlık halinde Yalova Mahkemeleri yetkilidir.'].join('\n'),
    ],
  },
]

const TERMS_META = { title: 'Şartlar ve Koşullar', Icon: FileText }
const PRIVACY_META = { title: 'Gizlilik Politikası ve KVKK Aydınlatma Metni', Icon: ShieldCheck }
const COOKIES_META = { title: 'Çerez Politikası', Icon: Cookie }
const FAQ_META = { title: 'Sıkça Sorulan Sorular (SSS)', Icon: HelpCircle }

function metaFor(type: LegalType) {
  switch (type) {
    case 'terms': return TERMS_META
    case 'privacy': return PRIVACY_META
    case 'cookies': return COOKIES_META
    case 'faq': return FAQ_META
  }
}

function sectionsFor(type: LegalType) {
  switch (type) {
    case 'terms': return termsContent
    case 'privacy': return privacyContent
    case 'cookies': return cookiesContent
    case 'faq': return faqContent
  }
}

export default function LegalModal({ open, onClose, type }: LegalModalProps) {
  const meta = metaFor(type)
  const sections = sectionsFor(type)
  const HeaderIcon = meta.Icon
  const title = meta.title
  const lastUpdated = 'Son Güncelleme: 03.09.2026'

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose()
      }
    }

    if (open) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return (
    <div
      aria-hidden={!open}
      className={cn(
        'fixed inset-0 z-50 transition-opacity duration-300',
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      )}
    >
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose}
      />

      <div className="fixed inset-0 flex items-end md:items-center justify-center p-0 md:p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="legal-modal-title"
          className={cn(
            'w-full md:max-w-3xl bg-white md:rounded-3xl md:shadow-card-hover md:border md:border-slate-200/60',
            'rounded-t-3xl border-t border-slate-200/60',
            'flex flex-col',
            'h-[88vh] md:h-auto md:max-h-[90vh]',
            'transition-all duration-300 ease-out',
            open
              ? 'translate-y-0 md:translate-y-0 md:scale-100 opacity-100'
              : 'translate-y-full md:translate-y-8 md:scale-95 opacity-0'
          )}
        >
          <div className="flex justify-center pt-3 pb-1 md:hidden">
            <div className="w-12 h-1.5 rounded-full bg-slate-200" />
          </div>

          <div className="flex items-start justify-between gap-4 px-5 sm:px-8 pt-5 sm:pt-6 pb-4 border-b border-slate-200/60">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-brand-50 border border-brand-200/60 text-brand-600">
                <HeaderIcon className="w-5 h-5" />
              </div>
              <div>
                <h2
                  id="legal-modal-title"
                  className="text-base sm:text-xl font-bold"
                  style={{ color:'#2c3135' }}
                >
                  {title}
                </h2>
                <p className="text-xs mt-0.5" style={{ color:'#2c3135', opacity:0.65 }}>{lastUpdated}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Kapat"
              className={cn(
                'flex items-center justify-center w-10 h-10 rounded-xl',
                'transition-all duration-200 active:scale-95',
              )}
              style={{ color:'#2c3135', opacity:0.75 }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F1F5F9')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-6 sm:py-8 max-h-[72vh]">
            <div className="space-y-8">
              {sections.map((section) => (
                <section key={section.title} className="space-y-4">
                  <h3 className="text-base sm:text-lg font-bold" style={{ color:'#2c3135' }}>
                    {section.title}
                  </h3>
                  <div className="space-y-3">
                    {section.paragraphs.map((paragraph, idx) => (
                      <p
                        key={idx}
                        className="text-sm leading-relaxed whitespace-pre-line"
                        style={{ color:'#2c3135', opacity:0.86 }}
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>

          <div className="px-5 sm:px-8 py-4 sm:py-5 border-t border-slate-200/60 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className={cn(
                'inline-flex items-center justify-center gap-2 rounded-xl',
                'bg-brand-600 px-6 py-3 text-sm font-semibold text-white',
                'shadow-lg shadow-brand-600/20',
                'transition-all duration-300',
                'hover:bg-brand-700 hover:shadow-xl hover:shadow-brand-600/30 hover:scale-[1.02]',
                'active:scale-[0.98]',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2'
              )}
            >
              Anladım
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
