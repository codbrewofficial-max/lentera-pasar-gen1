import { FormalButtonGroup, FormalCard, FormalHeading, FormalImageFrame, FormalSection, contentImageOf, formalIcons, text, type FormalSectionProps } from '../shared';

export function FormalAboutOrganizationProfile(props: FormalSectionProps) {
  const c = props.section.content || {};
  const bp = props.payload.businessProfile || {};
  return (
    <FormalSection>
      <div className="grid items-center gap-12 md:grid-cols-[1.05fr_.95fr]">
        <div>
          <FormalHeading eyebrow="Profil Organisasi" title={text(c.title, bp.name || 'Organisasi yang Terstruktur dan Terpercaya')} description={text(c.description, bp.description || 'Gunakan bagian ini untuk menjelaskan identitas, latar belakang, dan fokus utama bisnis.')} />
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <FormalCard className="p-5"><p className="text-xs font-bold uppercase tracking-wide text-slate-400">Didirikan</p><p className="mt-2 text-xl font-semibold text-slate-950">{text(c.establishedYear, bp.establishedYear || '-')}</p></FormalCard>
            <FormalCard className="p-5"><p className="text-xs font-bold uppercase tracking-wide text-slate-400">Fokus</p><p className="mt-2 text-xl font-semibold text-slate-950">{text(c.focusArea, bp.websiteTypeLabel || 'Company Profile')}</p></FormalCard>
          </div>
        </div>
        <FormalImageFrame imageUrl={contentImageOf(c) || bp.logoUrl || null} alt={text(c.imageAlt, 'Profil organisasi')} label="Organization" />
      </div>
    </FormalSection>
  );
}

export function FormalAboutHistoryTimeline(props: FormalSectionProps) {
  const c = props.section.content || {};
  const rows = [
    { year: text(c.yearOne, '2021'), title: text(c.titleOne, 'Fondasi Awal'), description: text(c.descriptionOne, 'Bisnis mulai membangun layanan inti dan proses kerja yang lebih terarah.') },
    { year: text(c.yearTwo, '2023'), title: text(c.titleTwo, 'Penguatan Layanan'), description: text(c.descriptionTwo, 'Layanan diperluas untuk menjawab kebutuhan klien yang semakin beragam.') },
    { year: text(c.yearThree, '2026'), title: text(c.titleThree, 'Transformasi Digital'), description: text(c.descriptionThree, 'Profil dan pengalaman bisnis mulai ditampilkan secara lebih profesional melalui website.') }
  ];
  return (
    <FormalSection muted>
      <FormalHeading eyebrow="Perjalanan" title={text(c.title, 'Perjalanan Bisnis yang Terukur')} description={text(c.description, 'Ringkasan perkembangan penting yang membantu calon klien memahami pengalaman organisasi.')} />
      <div className="mt-10 space-y-5">
        {rows.map((item, index) => (
          <div key={item.year} className="grid gap-4 md:grid-cols-[140px_1fr]">
            <div className="text-3xl font-semibold text-[#649FF6]">{item.year}</div>
            <FormalCard className="p-6">
              <h3 className="text-xl font-semibold text-slate-950">{item.title}</h3>
              <p className="mt-2 leading-7 text-slate-600">{item.description}</p>
            </FormalCard>
          </div>
        ))}
      </div>
    </FormalSection>
  );
}

export function FormalAboutVisionMission(props: FormalSectionProps) {
  const c = props.section.content || {};
  const { Target, CheckCircle2 } = formalIcons;
  const missions = [text(c.missionOne, 'Memberikan layanan yang jelas, terukur, dan mudah dipahami.'), text(c.missionTwo, 'Menjaga proses kerja yang profesional dan dapat dipertanggungjawabkan.'), text(c.missionThree, 'Membangun hubungan jangka panjang dengan klien dan mitra.')].filter(Boolean);
  return (
    <FormalSection>
      <div className="grid gap-6 md:grid-cols-2">
        <FormalCard className="p-7">
          <Target className="h-9 w-9 text-[#649FF6]" />
          <h3 className="mt-5 text-2xl font-semibold text-slate-950">{text(c.visionTitle, 'Visi')}</h3>
          <p className="mt-3 leading-8 text-slate-600">{text(c.vision, 'Menjadi mitra terpercaya yang membantu bisnis tampil lebih profesional dan mudah ditemukan calon klien.')}</p>
        </FormalCard>
        <FormalCard className="p-7">
          <h3 className="text-2xl font-semibold text-slate-950">{text(c.missionTitle, 'Misi')}</h3>
          <div className="mt-5 space-y-4">
            {missions.map((item, index) => <div key={index} className="flex gap-3"><CheckCircle2 className="mt-1 h-5 w-5 flex-none text-[#649FF6]" /><p className="leading-7 text-slate-600">{item}</p></div>)}
          </div>
        </FormalCard>
      </div>
    </FormalSection>
  );
}

export function FormalAboutValueStatement(props: FormalSectionProps) {
  const c = props.section.content || {};
  const { ShieldCheck, Scale, Handshake } = formalIcons;
  const values = [
    { icon: ShieldCheck, title: text(c.valueOneTitle, 'Integritas'), description: text(c.valueOne, 'Bekerja dengan prinsip yang jelas dan dapat dipercaya.') },
    { icon: Scale, title: text(c.valueTwoTitle, 'Ketelitian'), description: text(c.valueTwo, 'Memperhatikan detail agar setiap informasi tersampaikan dengan benar.') },
    { icon: Handshake, title: text(c.valueThreeTitle, 'Kemitraan'), description: text(c.valueThree, 'Mengutamakan relasi profesional yang saling mendukung.') }
  ];
  return (
    <FormalSection muted>
      <FormalHeading eyebrow="Nilai Kerja" title={text(c.title, 'Prinsip yang Menjaga Kualitas Layanan')} description={text(c.description, 'Nilai inti membantu calon klien memahami cara bisnis Anda bekerja.')} />
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {values.map(({ icon: Icon, title, description }) => (
          <FormalCard key={title} className="p-6">
            <Icon className="h-9 w-9 text-[#649FF6]" />
            <h3 className="mt-5 text-xl font-semibold text-slate-950">{title}</h3>
            <p className="mt-3 leading-7 text-slate-600">{description}</p>
          </FormalCard>
        ))}
      </div>
    </FormalSection>
  );
}

export function FormalAboutTeamHighlight(props: FormalSectionProps) {
  const c = props.section.content || {};
  const { Users } = formalIcons;
  const people = [
    { name: text(c.memberOneName, 'Tim Profesional'), role: text(c.memberOneRole, 'Lead Consultant'), bio: text(c.memberOneBio, 'Berpengalaman membantu klien memahami prioritas bisnis dan kebutuhan layanan.') },
    { name: text(c.memberTwoName, 'Tim Operasional'), role: text(c.memberTwoRole, 'Operation Specialist'), bio: text(c.memberTwoBio, 'Mendukung proses kerja agar komunikasi dan eksekusi berjalan rapi.') },
    { name: text(c.memberThreeName, 'Tim Client Success'), role: text(c.memberThreeRole, 'Client Success'), bio: text(c.memberThreeBio, 'Membantu menjaga hubungan dan tindak lanjut kebutuhan klien.') }
  ];
  return (
    <FormalSection>
      <FormalHeading eyebrow="Tim" title={text(c.title, 'Tim yang Menjaga Standar Profesional')} description={text(c.description, 'Perkenalkan tim inti agar calon klien merasa lebih dekat dan percaya.')} />
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {people.map((person) => (
          <FormalCard key={person.name} className="p-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-[#649FF6]"><Users className="h-7 w-7" /></div>
            <h3 className="mt-5 text-xl font-semibold text-slate-950">{person.name}</h3>
            <p className="mt-1 text-sm font-bold uppercase tracking-wide text-[#649FF6]">{person.role}</p>
            <p className="mt-3 leading-7 text-slate-600">{person.bio}</p>
          </FormalCard>
        ))}
      </div>
    </FormalSection>
  );
}
