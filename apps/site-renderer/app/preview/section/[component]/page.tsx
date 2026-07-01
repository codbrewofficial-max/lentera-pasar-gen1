'use client';

import { useParams } from 'next/navigation';
import { useMemo } from 'react';

// Import the full registry so we can look up any component by name
import { resolveSectionComponent } from '@/components/sections/SectionRegistry';

// ---- Mock data: dummy PublicPagePayload for preview ----
const MOCK_PAYLOAD = {
  website: { id: 'preview', name: 'Contoh Bisnis Anda', slug: 'preview', websiteType: 'company_profile', websiteTypeLabel: 'Company Profile', status: 'draft', trackingKey: 'preview' },
  businessProfile: {
    name: 'Contoh Bisnis Anda',
    tagline: 'Solusi Profesional untuk Bisnis Anda',
    description: 'Deskripsi bisnis akan ditampilkan di sini setelah Anda mengisi Profil Bisnis di dashboard.',
    logoUrl: '',
    address: 'Jl. Contoh No. 1, Jakarta',
    email: 'info@contohbisnis.id',
    phone: '+62 812-3456-7890',
    whatsapp: '628123456789',
    workingHours: 'Senin - Jumat: 08.00 - 17.00 WIB',
    vision: 'Menjadi pilihan utama pelanggan yang menginginkan layanan berkualitas tinggi.',
    mission: 'Memberikan pelayanan terbaik dengan standar profesional.'
  },
  navigation: {
    navbar: {
      items: [
        { pageKey: 'home', label: 'Beranda', slug: '', path: '/' },
        { pageKey: 'about', label: 'Tentang', slug: 'about', path: '/about' },
        { pageKey: 'services', label: 'Layanan', slug: 'services', path: '/services' },
        { pageKey: 'contact', label: 'Kontak', slug: 'contact', path: '/contact' },
      ]
    }
  },
  page: {
    pageKey: 'home',
    title: 'Beranda',
    sections: []
  }
};

// ---- Mock section data for common slots ----
function buildMockSection(component: string) {
  const slotKey = component
    .replace(/^(Formal|Casual|Premium|Abstract)/, '')
    .replace(/([A-Z])/g, (m, p1, offset) => (offset > 0 ? '.' : '') + p1.toLowerCase())
    .replace(/^\./, '');

  // Build content with descriptive default values
  const content: Record<string, string> = {
    eyebrow: 'Layanan Premium',
    title: 'Judul Section Akan Tampil di Sini',
    subtitle: 'Deskripsi singkat yang menjelaskan section ini akan tampil di sini setelah diisi owner.',
    description: 'Deskripsi singkat yang menjelaskan section ini akan tampil di sini setelah diisi owner.',
    ctaLabel: 'Lihat Selengkapnya',
    ctaUrl: '/contact',
    secondaryCtaLabel: 'Pelajari Lebih Lanjut',
    secondaryCtaUrl: '/about',
    imageUrl: 'https://picsum.photos/seed/preview-section/800/500',
    badge: 'Label Kecil',
    visionTitle: 'Visi',
    vision: 'Visi bisnis akan tampil di sini.',
    missionTitle: 'Misi',
    mission: 'Misi bisnis akan tampil di sini.',
    valueOne: 'Nilai Pertama',
    valueTwo: 'Nilai Kedua',
    valueThree: 'Nilai Ketiga',
    valueFour: 'Nilai Keempat',
    stepOne: 'Langkah Pertama',
    stepTwo: 'Langkah Kedua',
    stepThree: 'Langkah Ketiga',
    stepFour: 'Langkah Keempat',
    benefitOne: 'Manfaat Pertama',
    benefitTwo: 'Manfaat Kedua',
    benefitThree: 'Manfaat Ketiga',
    benefitFour: 'Manfaat Keempat',
    showWhatsapp: 'true',
    showEmail: 'true',
    showAddress: 'true',
    showPublishedDate: 'true',
    showCoverImage: 'false',
    showShareHint: 'false',
    mapEmbedUrl: '',
    metricOneLabel: 'Klien Puas',
    metricOneValue: '100+',
    metricTwoLabel: 'Proyek Selesai',
    metricTwoValue: '250+',
    metricThreeLabel: 'Tahun Pengalaman',
    metricThreeValue: '10+',
  };

  // Mock CRUD data for sections that need it
  const mockServices = Array.from({ length: 3 }, (_, i) => ({
    id: `s${i}`, slug: `service-${i}`, title: `Layanan ${i + 1}`, description: 'Deskripsi layanan akan tampil di sini.', isActive: true, sortOrder: i
  }));
  const mockPortfolios = Array.from({ length: 3 }, (_, i) => ({
    id: `p${i}`, slug: `project-${i}`, title: `Proyek ${i + 1}`, description: 'Deskripsi proyek.', imageUrl: `https://picsum.photos/seed/portfolio-${i}/800/600`, isActive: true, sortOrder: i, isFeatured: i === 0
  }));
  const mockTestimonials = Array.from({ length: 3 }, (_, i) => ({
    id: `t${i}`, name: `Klien ${i + 1}`, quote: 'Layanan yang sangat memuaskan dan profesional.', role: 'Direktur', company: 'PT Contoh', isActive: true, sortOrder: i, isFeatured: true
  }));
  const mockArticles = Array.from({ length: 3 }, (_, i) => ({
    id: `a${i}`, slug: `artikel-${i}`, title: `Judul Artikel ${i + 1}`, excerpt: 'Ringkasan artikel akan tampil di sini.', coverImageUrl: `https://picsum.photos/seed/article-${i}/1200/600`, isActive: true, isPublished: true, isFeatured: i === 0, sortOrder: i
  }));
  const mockTeamMembers = Array.from({ length: 4 }, (_, i) => ({
    id: `tm${i}`, name: `Anggota Tim ${i + 1}`, role: 'Tim Profesional', bio: 'Profil singkat anggota tim.', imageUrl: `https://picsum.photos/seed/team-${i}/400/400`, isActive: true, sortOrder: i
  }));
  const mockTimelines = Array.from({ length: 3 }, (_, i) => ({
    id: `tl${i}`, year: String(2020 + i), title: `Milestone ${i + 1}`, description: 'Pencapaian penting dalam perjalanan bisnis.', isActive: true, sortOrder: i
  }));
  const mockFaqs = Array.from({ length: 3 }, (_, i) => ({
    id: `f${i}`, question: `Pertanyaan Umum ${i + 1}?`, answer: 'Jawaban akan ditampilkan di sini.', pageKey: 'general', isActive: true, sortOrder: i
  }));

  return {
    id: `preview-${component}`,
    slotKey,
    sectionKey: `company_profile.${slotKey}`,
    templateKey: 'company_profile_formal',
    templateTheme: component.startsWith('Formal') ? 'formal' : component.startsWith('Casual') ? 'casual' : component.startsWith('Premium') ? 'premium' : 'abstract',
    component,
    variant: 'formal',
    content,
    data: {
      services: mockServices,
      portfolios: mockPortfolios,
      testimonials: mockTestimonials,
      articles: mockArticles,
      teamMembers: mockTeamMembers,
      timelines: mockTimelines,
      faqs: mockFaqs,
      portfolioCategories: [
        { id: 'cat1', name: 'Kategori A', slug: 'kategori-a', sortOrder: 0 },
        { id: 'cat2', name: 'Kategori B', slug: 'kategori-b', sortOrder: 1 },
      ],
      brands: [],
    }
  };
}

export default function SectionPreviewPage() {
  const params = useParams();
  const componentName = decodeURIComponent(params?.component as string || '');

  const SectionComponent = useMemo(() => {
    if (!componentName) return null;
    return resolveSectionComponent(componentName);
  }, [componentName]);

  const mockSection = useMemo(() => buildMockSection(componentName), [componentName]);

  if (!componentName) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <p className="text-sm text-slate-400 font-mono">No component specified</p>
      </div>
    );
  }

  if (!SectionComponent) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center space-y-2">
          <p className="text-sm font-semibold text-slate-500">Komponen tidak ditemukan</p>
          <p className="text-xs text-slate-400 font-mono">{componentName}</p>
          <p className="text-xs text-slate-300">Preview belum tersedia untuk tema ini.</p>
        </div>
      </div>
    );
  }

  // Extract siteSlug from the component name for routing context
  const siteSlug = 'preview';

  return (
    <div className="overflow-hidden w-full">
      <SectionComponent
        siteSlug={siteSlug}
        payload={MOCK_PAYLOAD as any}
        section={mockSection as any}
      />
    </div>
  );
}
