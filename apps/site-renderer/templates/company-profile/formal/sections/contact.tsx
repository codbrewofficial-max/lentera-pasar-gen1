import { ContactForm } from '@/components/sections/ContactForm';
import { FormalButtonGroup, FormalCard, FormalEmpty, FormalHeading, FormalImageFrame, FormalSection, contentImageOf, formalIcons, pickFaqs, text, type FormalSectionProps } from '../shared';

export function FormalContactHero(props: FormalSectionProps) {
  const c = props.section.content || {};
  return (
    <FormalSection muted>
      <div className="grid items-center gap-12 md:grid-cols-[1fr_.9fr]">
        <div>
          <FormalHeading eyebrow="Kontak" title={text(c.title, 'Hubungi Tim Kami')} description={text(c.description, 'Kirim kebutuhan Anda melalui form atau gunakan informasi kontak resmi yang tersedia.')} />
          <FormalButtonGroup {...props} secondary={false} />
        </div>
        <FormalImageFrame imageUrl={contentImageOf(c)} alt={text(c.imageAlt || c.title, 'Kontak')} label="Contact" />
      </div>
    </FormalSection>
  );
}

export function FormalContactInformation(props: FormalSectionProps) {
  const c = props.section.content || {};
  const bp = props.payload.businessProfile || {};
  const { MapPin, Mail, Phone, Clock } = formalIcons;
  const email = bp.contactEmail || bp.email;
  const items = [
    { icon: Phone, label: 'WhatsApp / Telepon', value: bp.whatsapp || bp.phone || bp.contactPhone },
    { icon: Mail, label: 'Email', value: email },
    { icon: MapPin, label: 'Alamat', value: bp.address },
    { icon: Clock, label: 'Jam Operasional', value: c.workingHours || bp.workingHours }
  ].filter((item) => item.value);
  return (
    <FormalSection>
      <FormalHeading eyebrow="Informasi Kontak" title={text(c.title, 'Kanal Komunikasi Resmi')} description={text(c.description, 'Bagian ini hanya menampilkan informasi kontak, tanpa form, agar struktur halaman tetap rapi.')} />
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
      ) : <div className="mt-8"><FormalEmpty title="Informasi kontak belum lengkap" description="Lengkapi WhatsApp, email, alamat, atau jam operasional di Profil Bisnis." /></div>}
    </FormalSection>
  );
}

export function FormalMapsLocation(props: FormalSectionProps) {
  const c = props.section.content || {};
  return (
    <FormalSection muted>
      <FormalHeading eyebrow="Lokasi" title={text(c.title, 'Lokasi dan Area Layanan')} description={text(c.description, 'Tambahkan embed Google Maps agar pengunjung dapat melihat lokasi atau area layanan bisnis.')} />
      {c.mapEmbedUrl ? (
        <iframe src={c.mapEmbedUrl} className="mt-10 h-[360px] w-full rounded-3xl border border-slate-200 bg-white" loading="lazy" title={text(c.title, 'Peta lokasi')} />
      ) : (
        <div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">Embed Google Maps belum diisi.</div>
      )}
    </FormalSection>
  );
}

export function FormalContactFaq(props: FormalSectionProps) {
  const c = props.section.content || {};
  const faqs = pickFaqs(props.section.data?.faqs || [], 'contact', 10);
  return (
    <FormalSection>
      <div className="grid gap-10 lg:grid-cols-[.95fr_1.05fr]">
        <div>
          <FormalHeading eyebrow="FAQ Kontak" title={text(c.title, 'Pertanyaan Sebelum Menghubungi Kami')} description={text(c.description, 'FAQ kontak tampil maksimal 10 item. Form kontak hanya muncul di section ini.')} />
          <div className="mt-8 space-y-4">
            {faqs.length ? faqs.map((faq, index) => (
              <FormalCard key={faq.id || index} className="p-5">
                <h3 className="font-semibold text-slate-950">{faq.question || faq.title}</h3>
                <p className="mt-2 leading-7 text-slate-600">{faq.answer || faq.description}</p>
              </FormalCard>
            )) : <FormalEmpty title="FAQ kontak belum tersedia" description="Tambahkan FAQ aktif untuk halaman kontak agar pengunjung mendapat jawaban awal." />}
          </div>
        </div>
        <div>
          <ContactForm siteSlug={props.siteSlug} pageKey={props.payload.page.pageKey} slotKey={props.section.slotKey} />
        </div>
      </div>
    </FormalSection>
  );
}

export function FormalContactCta(props: FormalSectionProps) {
  const c = props.section.content || {};
  return (
    <FormalSection compact>
      <div className="rounded-3xl bg-[#649FF6] p-8 text-white md:p-12">
        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <FormalHeading inverse eyebrow="Konsultasi Awal" title={text(c.title, 'Siap Menghubungi Kami?')} description={text(c.description, 'Sampaikan kebutuhan Anda dan tim kami akan membantu menindaklanjuti dengan jelas.')} />
          <FormalButtonGroup {...props} secondary={false} />
        </div>
      </div>
    </FormalSection>
  );
}
