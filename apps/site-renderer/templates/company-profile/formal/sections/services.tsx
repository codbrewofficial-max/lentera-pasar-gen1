import { FormalBadge, FormalButtonGroup, FormalCard, FormalEmpty, FormalHeading, FormalImageFrame, FormalSection, contentImageOf, descriptionOf, formalIcons, pickFaqs, sortedByOrder, text, titleOf, type FormalSectionProps } from '../shared';

// Schema: title, description
export function FormalServicesHero(props: FormalSectionProps) {
  const c = props.section.content || {};
  return (
    <FormalSection muted>
      <div className="grid items-center gap-12 md:grid-cols-[1fr_.9fr]">
        <div>
          <FormalHeading
            eyebrow="Layanan"
            title={text(c.title, 'Layanan Profesional untuk Kebutuhan Bisnis')}
            description={text(c.description, 'Tampilkan daftar layanan yang membantu calon klien memahami solusi yang tersedia.')}
          />
          <FormalButtonGroup {...props} />
        </div>
        <FormalImageFrame imageUrl={null} alt={text(c.title, 'Layanan')} label="Services" />
      </div>
    </FormalSection>
  );
}

// Schema: title, description
export function FormalServicesGrid(props: FormalSectionProps) {
  const c = props.section.content || {};
  const items = sortedByOrder(props.section.data?.services || []);
  const { BriefcaseBusiness } = formalIcons;
  return (
    <FormalSection>
      <FormalHeading
        eyebrow="Daftar Layanan"
        title={text(c.title, 'Pilihan Layanan yang Tersusun Rapi')}
        description={text(c.description, 'Setiap layanan aktif dari dashboard akan tampil di bagian ini.')}
      />
      {items.length ? (
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <FormalCard key={item.id || index} className="p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-50 text-[#649FF6]">
                  <BriefcaseBusiness className="h-6 w-6" />
                </div>
                {item.isFeatured && <FormalBadge tone="rose">Unggulan</FormalBadge>}
              </div>
              <h3 className="mt-5 text-xl font-semibold text-slate-950">{titleOf(item)}</h3>
              <p className="mt-3 leading-7 text-slate-600">{descriptionOf(item)}</p>
            </FormalCard>
          ))}
        </div>
      ) : (
        <div className="mt-8">
          <FormalEmpty title="Layanan belum tersedia" description="Tambahkan layanan aktif dari dashboard agar daftar layanan tampil di halaman publik." />
        </div>
      )}
    </FormalSection>
  );
}

// Schema: title, description, stepOne, stepTwo, stepThree
export function FormalServicesProcess(props: FormalSectionProps) {
  const c = props.section.content || {};
  const steps = [
    text(c.stepOne, 'Konsultasi kebutuhan'),
    text(c.stepTwo, 'Penawaran dan penyesuaian'),
    text(c.stepThree, 'Pengerjaan dan evaluasi'),
  ];
  return (
    <FormalSection muted>
      <FormalHeading
        eyebrow="Proses"
        title={text(c.title, 'Alur Kerja yang Mudah Dipahami')}
        description={text(c.description, 'Calon klien dapat melihat bagaimana proses layanan berjalan dari awal sampai tindak lanjut.')}
      />
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {steps.map((step, index) => (
          <FormalCard key={index} className="p-6">
            <div className="text-4xl font-semibold text-[#649FF6]">{String(index + 1).padStart(2, '0')}</div>
            <p className="mt-5 leading-7 text-slate-600">{step}</p>
          </FormalCard>
        ))}
      </div>
    </FormalSection>
  );
}

// Schema: title, description, benefitOne, benefitTwo, benefitThree
export function FormalServicesBenefits(props: FormalSectionProps) {
  const c = props.section.content || {};
  const { CheckCircle2 } = formalIcons;
  const benefits = [
    text(c.benefitOne, 'Informasi layanan lebih jelas untuk calon klien.'),
    text(c.benefitTwo, 'Membantu mempercepat keputusan untuk menghubungi bisnis.'),
    text(c.benefitThree, 'Meningkatkan kesan profesional dan kredibilitas.'),
  ].filter(Boolean);
  return (
    <FormalSection>
      <div className="grid items-center gap-12 md:grid-cols-[.9fr_1.1fr]">
        <FormalImageFrame imageUrl={null} alt={text(c.title, 'Manfaat layanan')} label="Benefits" />
        <div>
          <FormalHeading
            eyebrow="Manfaat"
            title={text(c.title, 'Manfaat yang Dirasakan Klien')}
            description={text(c.description, 'Bagian ini menjelaskan dampak praktis dari layanan yang Anda tawarkan.')}
          />
          <div className="mt-8 space-y-4">
            {benefits.map((item, index) => (
              <div key={index} className="flex gap-3">
                <CheckCircle2 className="mt-1 h-5 w-5 flex-none text-[#649FF6]" />
                <p className="leading-7 text-slate-600">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </FormalSection>
  );
}

// Schema: title, description
export function FormalServicesFaq(props: FormalSectionProps) {
  const c = props.section.content || {};
  const faqs = pickFaqs(props.section.data?.faqs || [], 'services', 10);
  return (
    <FormalSection muted>
      <FormalHeading
        eyebrow="FAQ Layanan"
        title={text(c.title, 'Pertanyaan Umum Seputar Layanan')}
        description={text(c.description, 'Maksimal 10 FAQ aktif akan tampil untuk membantu calon klien memahami layanan.')}
      />
      {faqs.length ? (
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {faqs.map((faq, index) => (
            <FormalCard key={faq.id || index} className="p-6">
              <h3 className="text-lg font-semibold text-slate-950">{faq.question || faq.title}</h3>
              <p className="mt-3 leading-7 text-slate-600">{faq.answer || faq.description}</p>
            </FormalCard>
          ))}
        </div>
      ) : (
        <div className="mt-8">
          <FormalEmpty title="FAQ layanan belum tersedia" description="Tambahkan FAQ aktif untuk halaman layanan agar pengunjung mendapat jawaban cepat." />
        </div>
      )}
    </FormalSection>
  );
}
