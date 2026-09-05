import { useState, useCallback } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Hero } from '@/components/sections/Hero'
import { TrustBar } from '@/components/sections/TrustBar'
import { Features } from '@/components/sections/Features'
import { About } from '@/components/sections/About'
import Process from '@/components/sections/Process'
import Testimonials from '@/components/sections/Testimonials'
import PricingPackages from '@/components/sections/PricingPackages'
import type { PricingPackage } from '@/components/sections/PricingPackages'
import FinalCTA from '@/components/sections/FinalCTA'
import CalculatorForm from '@/components/calculator/CalculatorForm'
import SubmissionInfoModal from '@/components/calculator/SubmissionInfoModal'
import LegalModal, { LegalType } from '@/components/ui/LegalModal'
import BlogDetailModal from '@/components/modal/BlogDetailModal'
import PartnerLoginModal from '@/components/modal/PartnerLoginModal'
import PackageInquiryModal from '@/components/modal/PackageInquiryModal'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { BLOG_POSTS } from '@/data/blogData'

export default function App() {
  useScrollReveal()

  const [submissionInfo, setSubmissionInfo] = useState<{
    open: boolean
    email: string | null
  }>({ open: false, email: null })

  const [formResetKey, setFormResetKey] = useState<number>(0)

  const [legalModal, setLegalModal] = useState<{
    open: boolean
    type: LegalType
  }>({ open: false, type: 'terms' })

  const [blogModal, setBlogModal] = useState<{
    open: boolean
    selectedSlug: string | null
  }>({ open: false, selectedSlug: null })

  const [partnerLoginOpen, setPartnerLoginOpen] = useState<boolean>(false)

  const [pricingInquiry, setPricingInquiry] = useState<{
    open: boolean
    selectedPackage: PricingPackage | null
  }>({ open: false, selectedPackage: null })

  const handleCalculatorSubmit = useCallback((email: string) => {
    setSubmissionInfo({ open: true, email: email || null })
  }, [])

  const handleCloseSubmissionInfo = useCallback(() => {
    setSubmissionInfo({ open: false, email: null })
    setFormResetKey((k) => k + 1)
  }, [])

  const handleLegalClick = (type: LegalType) => {
    setLegalModal({ open: true, type })
  }

  const handleOpenBlog = useCallback((slug: string) => {
    setBlogModal({ open: true, selectedSlug: slug })
  }, [])

  const handleNextBlog = useCallback(() => {
    setBlogModal((prev) => {
      if (!prev.selectedSlug || BLOG_POSTS.length === 0) return prev
      const idx = BLOG_POSTS.findIndex((p) => p.slug === prev.selectedSlug)
      if (idx < 0) return prev
      const next = (idx + 1) % BLOG_POSTS.length
      return { open: true, selectedSlug: BLOG_POSTS[next].slug }
    })
  }, [])

  const handleOpenPartnerLogin = useCallback(() => setPartnerLoginOpen(true), [])
  const handleClosePartnerLogin = useCallback(() => setPartnerLoginOpen(false), [])

  const handleSelectPricingPackage = useCallback((pkg: PricingPackage) => {
    setPricingInquiry({ open: true, selectedPackage: pkg })
  }, [])

  const handleClosePricingInquiry = useCallback(() => {
    setPricingInquiry({ open: false, selectedPackage: null })
  }, [])

  return (
    <div className="relative min-h-screen">
      <Navbar onPartnerClick={handleOpenPartnerLogin} />

      <main>
        <Hero />
        <TrustBar />
        <Features />
        <About onOpenBlog={handleOpenBlog} />
        <Process />
        <CalculatorForm key={formResetKey} onResult={handleCalculatorSubmit} />
        <Testimonials />
        <PricingPackages onSelectPackage={handleSelectPricingPackage} />
        <FinalCTA />
        <Footer onLegalClick={handleLegalClick} />
      </main>

      <SubmissionInfoModal
        open={submissionInfo.open}
        onClose={handleCloseSubmissionInfo}
        userEmail={submissionInfo.email}
      />

      <LegalModal
        open={legalModal.open}
        onClose={() => setLegalModal((p) => ({ ...p, open: false }))}
        type={legalModal.type}
      />

      <BlogDetailModal
        open={blogModal.open}
        selectedSlug={blogModal.selectedSlug}
        onClose={() => setBlogModal((p) => ({ ...p, open: false }))}
        onNext={handleNextBlog}
      />

      <PartnerLoginModal
        open={partnerLoginOpen}
        onClose={handleClosePartnerLogin}
      />

      <PackageInquiryModal
        open={pricingInquiry.open}
        onClose={handleClosePricingInquiry}
        selectedPackage={pricingInquiry.selectedPackage}
      />
    </div>
  )
}
