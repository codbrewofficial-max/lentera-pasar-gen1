import { ContactForm } from '@/components/sections/ContactForm';
import { FormalButtonGroup, FormalCard, FormalEmpty, FormalHeading, FormalSection, boolValue, formalIcons, pickFaqs, text, type FormalSectionProps } from '../shared';

// Schema: title, description
export function FormalContactHero(props: FormalSectionProps) {
  const c = props.section.content || {};
  return (
    <FormalSection muted>
      <div className="max-w-3xl">
        <FormalHeading
          eyebrow="Kontak"
          title={text(c.title, 'Hubungi Tim Kami')}
          description={text(c.description, 'Kirim kebutuhan Anda melalui form atau gunakan informasi kontak resmi yang tersedia.')}
        />
        <FormalButtonGroup {...props} secondary={false} />
      </div>
    </FormalSection>
  );
}

// Schema: title, description, showWhatsapp, showEmail, showAddress
export function FormalContactInformation(props: FormalSectionProps) {
  const c = props.section.content || {};
  const bp = props.payload.businessProfile || {};
  const { MapPin, Mail, Phone } = formalIcons;

  const showWhatsapp = boolValue(c.showWhatsapp, true);
  const showEmail    = boolValue(c.showEmail, true);
  const showAddress  = boolValue(c.showAddress, true);

  const email = bp.contactEmail || bp.email;

  const items = [
    showWhatsapp && (bp.whatsapp || bp.phone) && { icon: Phone, label: 'WhatsApp / Telepon', value: bp.whatsapp || bp.phone },
    showEmail    && email                      && { icon: Mail,  label: 'Email',               value: email },
    showAddress  && bp.address                 && { icon: MapPin, label: 'Alamat',             value: bp.address },
  ].filter(Boolean) as { icon: any; label: string; value: string }[];

  return (
    <FormalSection>
      <FormalHeading
        eyebrow="Informasi Kontak"
        title={text(c.title, 'Kanal Komunikasi Resmi')}
        description={text(c.description, 'Hubungi kami melalui saluran berikut untuk pertanyaan, penawaran, atau diskusi awal.')}
      />
      {items.length ? (
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {items.map(({ icon: Icon, label, value }) => (
            <FormalCard key={label} className="p-6">
              <Icon className="h-8 w-8 text-[#649FF6]" />
              <p className="mt-5 text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
              <p className="mt-2 break-words text-lg font-semibold leading-8 text-slate-950">{value}</p>
            </FormalCard>
          ))}
        </div>
      ) : (
        <div className="mt-8">
          <FormalEmpty
            title="Informasi kontak belum lengkap"
            description="Lengkapi WhatsApp, email, atau alamat di Profil Bisnis, lalu aktifkan field yang ingin ditampilkan."
          />
        </div>
      )}
    </FormalSection>
  );
}

// Schema: title, description, mapEmbedUrl
export function FormalMapsLocation(props: FormalSectionProps) {
  const c = props.section.content || {};
  return (
    <FormalSection muted>
      <FormalHeading
        eyebrow="Lokasi"
        title={text(c.title, 'Lokasi dan Area Layanan')}
        description={text(c.description, 'Tambahkan embed Google Maps agar pengunjung dapat melihat lokasi atau area layanan bisnis.')}
      />
      {c.mapEmbedUrl ? (
        <iframe
          src={c.mapEmbedUrl}
          className="mt-10 h-[360px] w-full rounded-3xl border border-slate-200 bg-white"
          loading="lazy"
          title={text(c.title, 'Peta lokasi')}
        />
      ) : (
        <div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
          Embed Google Maps belum diisi.
        </div>
      )}
    </FormalSection>
  );
}

// Schema: title, description
export function FormalContactFaq(props: FormalSectionProps) {
  const c = props.section.content || {};
  const faqs = pickFaqs(props.section.data?.faqs || [], 'contact', 10);
  return (
    <FormalSection>
      <div className="grid gap-10 lg:grid-cols-[.95fr_1.05fr]">
        <div>
          <FormalHeading
            eyebrow="FAQ Kontak"
            title={text(c.title, 'Pertanyaan Sebelum Menghubungi Kami')}
            description={text(c.description, 'FAQ kontak tampil maksimal 10 item. Form kontak hanya muncul di section ini.')}
          />
          <div className="mt-8 space-y-4">
            {faqs.length ? (
              faqs.map((faq, index) => (
                <FormalCard key={faq.id || index} className="p-5">
                  <h3 className="font-semibold text-slate-950">{faq.question || faq.title}</h3>
                  <p className="mt-2 leading-7 text-slate-600">{faq.answer || faq.description}</p>
                </FormalCard>
              ))
            ) : (
              <FormalEmpty title="FAQ kontak belum tersedia" description="Tambahkan FAQ aktif untuk halaman kontak agar pengunjung mendapat jawaban awal." />
            )}
          </div>
        </div>
        <div>
          <ContactForm siteSlug={props.siteSlug} pageKey={props.payload.page.pageKey} slotKey={props.section.slotKey} />
        </div>
      </div>
    </FormalSection>
  );
}

// Schema: title, description, ctaLabel, ctaUrl
export function FormalContactCta(props: FormalSectionProps) {
  const c = props.section.content || {};
  return (
    <FormalSection compact>
      <div className="rounded-3xl bg-[#649FF6] p-8 text-white md:p-12">
        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <FormalHeading
            inverse
            eyebrow="Konsultasi Awal"
            title={text(c.title, 'Siap Menghubungi Kami?')}
            description={text(c.description, 'Sampaikan kebutuhan Anda dan tim kami akan membantu menindaklanjuti dengan jelas.')}
          />
          <FormalButtonGroup {...props} secondary={false} />
        </div>
      </div>
    </FormalSection>
  );
}
