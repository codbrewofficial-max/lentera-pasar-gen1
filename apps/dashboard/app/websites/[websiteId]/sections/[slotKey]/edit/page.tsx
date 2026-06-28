"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { apiCall } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  Edit3, 
  Save, 
  AlertCircle, 
  CheckCircle,
  Image as ImageIcon,
  Link as LinkIcon,
  HelpCircle,
  ChevronRight
} from "lucide-react";

interface SchemaField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'image_url' | 'url';
  required?: boolean;
  placeholder?: string | null;
  helpText?: string | null;
  defaultValue?: string;
}

interface SectionDetail {
  slotLabel: string;
  slotDescription: string;
  templateSection: {
    id: string;
    name: string;
    schema: SchemaField[];
  } | null;
  effectiveContent: Record<string, any> | null;
}

export default function EditSectionContentPage() {
  const router = useRouter();
  const params = useParams();
  const websiteId = params?.websiteId as string;
  const slotKey = params?.slotKey as string;

  const [section, setSection] = useState<SectionDetail | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const currentPageKey = slotKey.includes(".") ? slotKey.split(".")[0] : "home";

  const fetchSectionDetail = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await apiCall<SectionDetail>("GET", `websites/${websiteId}/sections/${slotKey}`);
      const data = res.data;
      setSection(data);

      // Pre-populate formData from effectiveContent or default values
      const initialForm: Record<string, any> = {};
      if (data.templateSection?.schema) {
        data.templateSection.schema.forEach((field) => {
          const fKey = field.key;
          if (fKey) {
            initialForm[fKey] = 
              data.effectiveContent?.[fKey] ?? 
              field.defaultValue ?? 
              "";
          }
        });
      }
      setFormData(initialForm);
    } catch (err: any) {
      console.error("Fetch section error:", err);
      setErrorMsg(err.error?.message || "Gagal memuat detail bagian website.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (websiteId && slotKey) {
      Promise.resolve().then(() => {
        fetchSectionDetail();
      });
    }
  }, [websiteId, slotKey]);



  const handleInputChange = (fieldName: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await apiCall<any>("PATCH", `websites/${websiteId}/sections/${slotKey}/content`, {
        contentJson: formData
      });

      setSuccessMsg("Konten bagian website berhasil disimpan!");
      setTimeout(() => {
        router.push(`/websites/${websiteId}/pages/${currentPageKey}`);
      }, 800);
    } catch (err: any) {
      console.error("Save content error:", err);
      setErrorMsg(err.error?.message || "Gagal menyimpan konten.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Memuat Form..." showBackButton={true} backUrl={`/websites/${websiteId}/pages/${currentPageKey}`}>
        <div className="flex h-64 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
        </div>
      </DashboardLayout>
    );
  }

  if (!section || !section.templateSection) {
    return (
      <DashboardLayout title="Tampilan Belum Dipilih" showBackButton={true} backUrl={`/websites/${websiteId}/pages/${currentPageKey}`}>
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-4 max-w-md mx-auto">
          <AlertCircle className="h-12 w-12 text-amber-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">Tampilan Belum Dipilih</h3>
          <p className="text-sm text-slate-500">Anda harus memilih tampilan template terlebih dahulu sebelum dapat mengisi konten.</p>
          <button 
            onClick={() => router.push(`/websites/${websiteId}/sections/${slotKey}/choose`)} 
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl"
          >
            Pilih Tampilan Sekarang
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title="Isi Konten Website" 
      subtitle={`Bagian: ${section.slotLabel} | Tampilan: ${section.templateSection.name}`}
      showBackButton={true}
      backUrl={`/websites/${websiteId}/pages/${currentPageKey}`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="edit-content-layout">
        {/* Form Column */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex items-center space-x-2 text-slate-800">
            <Edit3 className="h-5 w-5 text-emerald-600" />
            <span className="font-bold text-sm uppercase tracking-wide text-slate-400">Isi Form Konten</span>
          </div>

          {errorMsg && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start space-x-3 text-rose-800 text-sm animate-fadeIn">
              <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-sm animate-fadeIn">
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {section.templateSection.schema.map((field) => {
              const fKey = field.key;
              if (!fKey) return null;
              const fieldId = `field-input-${fKey}`;
              const isFieldRequired = field.required === true;
              return (
                <div key={fKey} className="space-y-1.5" id={`form-group-${fKey}`}>
                  <label htmlFor={fieldId} className="block text-sm font-semibold text-slate-700">
                    {field.label} {isFieldRequired && <span className="text-rose-500">*</span>}
                  </label>

                  {/* Textarea field type */}
                  {field.type === "textarea" ? (
                    <textarea
                      id={fieldId}
                      required={isFieldRequired}
                      rows={4}
                      placeholder={field.placeholder || `Masukkan isian ${field.label}...`}
                      value={formData[fKey] || ""}
                      onChange={(e) => handleInputChange(fKey, e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors text-sm"
                    />
                  ) : field.type === "image_url" ? (
                    /* Image URL field type */
                    <div className="space-y-2">
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                          <ImageIcon className="h-4 w-4" />
                        </span>
                        <input
                          id={fieldId}
                          type="url"
                          required={isFieldRequired}
                          placeholder={field.placeholder || "https://picsum.photos/seed/.../800/600"}
                          value={formData[fKey] || ""}
                          onChange={(e) => handleInputChange(fKey, e.target.value)}
                          className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors text-sm font-mono text-xs"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleInputChange(fKey, `https://picsum.photos/seed/${fKey + Date.now()}/800/600`)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-[10px] font-bold text-slate-600 transition"
                        >
                          Gunakan Gambar Contoh
                        </button>
                      </div>
                    </div>
                  ) : field.type === "url" ? (
                    /* General URL field type */
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <LinkIcon className="h-4 w-4" />
                      </span>
                      <input
                        id={fieldId}
                        type="url"
                        required={isFieldRequired}
                        placeholder={field.placeholder || "https://wa.me/... atau link halaman"}
                        value={formData[fKey] || ""}
                        onChange={(e) => handleInputChange(fKey, e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors text-sm font-mono text-xs"
                      />
                    </div>
                  ) : (
                    /* Standard text field type */
                    <input
                      id={fieldId}
                      type="text"
                      required={isFieldRequired}
                      placeholder={field.placeholder || `Masukkan isian ${field.label}...`}
                      value={formData[fKey] || ""}
                      onChange={(e) => handleInputChange(fKey, e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors text-sm"
                    />
                  )}

                  {field.helpText && (
                    <p className="text-[11px] text-slate-400 mt-1 pl-1">
                      {field.helpText}
                    </p>
                  )}
                </div>
              );
            })}

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => router.push(`/websites/${websiteId}/pages/${currentPageKey}`)}
                className="px-5 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition"
              >
                Kembali
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center space-x-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/10 hover:shadow-emerald-700/20 transition active:translate-y-[1px]"
                id="btn-save-content"
              >
                {saving ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Sedang Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Simpan Konten Section</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Info Column */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-sm">
            <h3 className="font-bold text-base mb-3">Tentang Bagian Ini</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              {section.slotDescription}
            </p>
            <div className="border-t border-slate-800 pt-3 space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">ID Slot Teknis</span>
              <span className="font-mono text-xs text-emerald-400 bg-slate-850 px-2 py-1 rounded block w-max select-all border border-slate-800">
                {slotKey}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3.5 shadow-sm">
            <div className="flex items-center space-x-2 text-amber-600">
              <HelpCircle className="h-5 w-5" />
              <span className="font-bold text-xs uppercase tracking-wide">Panduan Gambar & Link</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              <strong>Gambar:</strong> Untuk performa terbaik, gunakan link URL gambar yang ramah internet dengan ekstensi .jpg atau .png. Anda juga dapat menggunakan contoh gambar cepat dari Unsplash / Picsum dengan menekan tombol <em>Gunakan Gambar Contoh</em>.<br/><br/>
              <strong>Link WhatsApp:</strong> Jika ingin membuat link WhatsApp langsung untuk tombol aksi, gunakan format: <code className="font-mono text-[10px] bg-slate-100 p-1 rounded font-semibold">https://wa.me/62812xxxxxx</code>
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
