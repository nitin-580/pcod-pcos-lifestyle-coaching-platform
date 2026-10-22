import type { Metadata } from 'next';
import AiNavbar from '@/components/ai/AiNavbar';
import AiHero from '@/components/ai/AiHero';
import UltrasoundIntelligence from '@/components/ai/UltrasoundIntelligence';
import WombCareBuddy from '@/components/ai/WombCareBuddy';
import AiCapabilities from '@/components/ai/AiCapabilities';
import AiPricing from '@/components/ai/AiPricing';
import AiClinicalTrust from '@/components/ai/AiClinicalTrust';
import AiFooter from '@/components/ai/AiFooter';

export const metadata: Metadata = {
  title: 'WombCare AI — Precision Ultrasound Intelligence & 24/7 Maternal Companion',
  description:
    'Experience intelligent maternal care with computer vision ultrasound insights, multi-marker biometric screening, and WombCare Buddy — your 24/7 intelligent maternal wellness companion.',
  keywords: [
    'WombCare AI',
    'ultrasound AI',
    'maternal health intelligence',
    'fetal growth mapping',
    'computer vision ultrasound',
    'WombCare Buddy',
    'pregnancy triage AI',
    'maternal biometrics',
    'obstetric decision support'
  ],
  openGraph: {
    title: 'WombCare AI — Precision Maternal & Ultrasound Intelligence',
    description:
      'Computer vision ultrasound biometrics, fetal growth mapping, and 24/7 conversational maternal support with WombCare Buddy.',
    url: 'https://wombcare.in/ai',
    siteName: 'WombCare AI',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WombCare AI — Precision Maternal Healthcare',
    description:
      'Intelligent ultrasound analytics and 24/7 maternal wellness companion.',
  },
};

export default function WombCareAiPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'WombCare AI',
    applicationCategory: 'HealthApplication',
    operatingSystem: 'Web, Mobile Web',
    description:
      'Precision computer vision ultrasound analysis, multi-marker biometric screening, and 24/7 conversational companion for maternal wellness.',
    offers: {
      '@type': 'Offer',
      price: '29999',
      priceCurrency: 'INR',
      priceValidUntil: '2027-12-31',
      description: 'Annual Premium Maternal Wellness & Ultrasound Intelligence',
    },
    publisher: {
      '@type': 'Organization',
      name: 'WombCare Health Technologies',
      url: 'https://wombcare.in',
    },
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 antialiased flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Dedicated AI Dark Navbar */}
      <AiNavbar />

      {/* Main Content Sections */}
      <main className="flex-1">
        <AiHero />
        <UltrasoundIntelligence />
        <WombCareBuddy />
        <AiCapabilities />
        <AiPricing />
        <AiClinicalTrust />
      </main>

      {/* Dedicated AI Dark Footer */}
      <AiFooter />
    </div>
  );
}
