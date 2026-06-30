import { FormalCard, FormalEmpty, FormalHeading, FormalImageFrame, FormalSection, formalIcons, sortedByOrder, text, type FormalSectionProps } from '../shared';

// Schema: title, description, imageUrl
export function FormalAboutOrganizationProfile(props: FormalSectionProps) {
  const c = props.section.content || {};
  const bp = props.payload.businessProfile || {};
  return (
    <FormalSection>
      <div className="grid items-center gap-12 md:grid-cols-[1.05fr_.95fr]">
        <div>
          <FormalHeading
            eyebrow="Profil Organisasi"
            title={text(c.title, bp.name || 'Organisasi yang Terstruktur dan Terpercaya')}
            description={text(c.description, bp.description || 'Gunakan bagian ini untuk menjelaskan identitas, latar belakang, dan fokus utama bisnis.')}
          />
        </div>
        <FormalImageFrame
          imageUrl={text(c.imageUrl) || bp.logoUrl || null}
          alt={text(c.title, 'Profil organisasi')}
          label="Organization"
        />
      </div>
    </FormalSection>
  );
}

// Schema: title, description
// Data: section.data.timelines (dari CRUD BusinessTimeline)
export function FormalAboutHistoryTimeline(props: FormalSectionProps) {
  const c = props.section.content || {};
  const { CalendarDays } = formalIcons;
  const timelines = sortedByOrder(props.section.data?.timelines || []);
  return (
    <FormalSection muted>
      <FormalHeading
        eyebrow="Perjalanan"
        title={text(c.title, 'Perjalanan Bisnis yang Terukur')}
        description={text(c.description, 'Ringkasan perkembangan penting yang membantu calon klien memahami pengalaman organisasi.')}
      />
      {timelines.length ? (
        <div className="mt-10 space-y-5">
          {timelines.map((item: any) => (
            <div key={item.id} className="grid gap-4 md:grid-cols-[140px_1fr]">
              <div className="flex items-center gap-2 text-3xl font-semibold text-[#649FF6]">
                <CalendarDays className="h-6 w-6 flex-none" />
                {item.year}
              </div>
              <FormalCard className="p-6">
                <h3 className="text-xl font-semibold text-slate-950">{item.title}</h3>
                {item.description && <p className="mt-2 leading-7 text-slate-600">{item.description}</p>}
              </FormalCard>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-8">
          <FormalEmpty
            title="Perjalanan bisnis belum diisi"
            description="Tambahkan milestone di menu Konten → Perjalanan Bisnis agar bagian ini tampil."
          />
        </div>
      )}
    </FormalSection>
  );
}

// Schema: visionTitle, vision, missionTitle, mission
export function FormalAboutVisionMission(props: FormalSectionProps) {
  const c = props.section.content || {};
  const { Target, CheckCircle2 } = formalIcons;
  return (
    <FormalSection>
      <div className="grid gap-6 md:grid-cols-2">
        <FormalCard className="p-7">
          <Target className="h-9 w-9 text-[#649FF6]" />
          <h3 className="mt-5 text-2xl font-semibold text-slate-950">{text(c.visionTitle, 'Visi')}</h3>
          <p className="mt-3 leading-8 text-slate-600">
            {text(c.vision, 'Menjadi mitra terpercaya yang membantu bisnis tampil lebih profesional dan mudah ditemukan calon klien.')}
          </p>
        </FormalCard>
        <FormalCard className="p-7">
          <CheckCircle2 className="h-9 w-9 text-[#649FF6]" />
          <h3 className="mt-5 text-2xl font-semibold text-slate-950">{text(c.missionTitle, 'Misi')}</h3>
          <p className="mt-5 leading-8 text-slate-600">
            {text(c.mission, 'Memberikan layanan yang jelas, menjaga komunikasi yang baik, dan terus meningkatkan kualitas hasil kerja.')}
          </p>
        </FormalCard>
      </div>
    </FormalSection>
  );
}

// Schema: title, description, valueOne, valueTwo, valueThree
export function FormalAboutValueStatement(props: FormalSectionProps) {
  const c = props.section.content || {};
  const { ShieldCheck, Scale, Handshake } = formalIcons;
  const values = [
    { icon: ShieldCheck, description: text(c.valueOne, 'Bekerja dengan prinsip yang jelas dan dapat dipercaya.') },
    { icon: Scale,       description: text(c.valueTwo, 'Memperhatikan detail agar setiap informasi tersampaikan dengan benar.') },
    { icon: Handshake,   description: text(c.valueThree, 'Mengutamakan relasi profesional yang saling mendukung.') },
  ];
  return (
    <FormalSection muted>
      <FormalHeading
        eyebrow="Nilai Kerja"
        title={text(c.title, 'Prinsip yang Menjaga Kualitas Layanan')}
        description={text(c.description, 'Nilai inti membantu calon klien memahami cara bisnis Anda bekerja.')}
      />
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {values.map(({ icon: Icon, description }, index) => (
          <FormalCard key={index} className="p-6">
            <Icon className="h-9 w-9 text-[#649FF6]" />
            <p className="mt-5 leading-7 text-slate-600">{description}</p>
          </FormalCard>
        ))}
      </div>
    </FormalSection>
  );
}

// Schema: title, description, imageUrl
// Data: section.data.teamMembers (dari CRUD TeamMember)
export function FormalAboutTeamHighlight(props: FormalSectionProps) {
  const c = props.section.content || {};
  const { Users } = formalIcons;
  const teamMembers = sortedByOrder(props.section.data?.teamMembers || []);
  return (
    <FormalSection>
      <FormalHeading
        eyebrow="Tim"
        title={text(c.title, 'Tim yang Menjaga Standar Profesional')}
        description={text(c.description, 'Perkenalkan tim inti agar calon klien merasa lebih dekat dan percaya.')}
      />
      {text(c.imageUrl) ? (
        <div className="mt-10">
          <FormalImageFrame imageUrl={text(c.imageUrl)} alt={text(c.title, 'Tim kami')} label="Team" />
        </div>
      ) : teamMembers.length ? (
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {teamMembers.map((person: any) => (
            <FormalCard key={person.id} className="p-6">
              {person.imageUrl ? (
                <img src={person.imageUrl} alt={person.name} className="h-16 w-16 rounded-2xl object-cover bg-slate-100" />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-[#649FF6]">
                  <Users className="h-8 w-8" />
                </div>
              )}
              <h3 className="mt-5 text-xl font-semibold text-slate-950">{person.name}</h3>
              {person.role && <p className="mt-1 text-sm font-bold uppercase tracking-wide text-[#649FF6]">{person.role}</p>}
              {person.bio && <p className="mt-3 leading-7 text-slate-600">{person.bio}</p>}
            </FormalCard>
          ))}
        </div>
      ) : (
        <div className="mt-8">
          <FormalEmpty
            title="Anggota tim belum diisi"
            description="Tambahkan anggota tim di menu Konten → Anggota Tim agar bagian ini tampil."
          />
        </div>
      )}
    </FormalSection>
  );
}
