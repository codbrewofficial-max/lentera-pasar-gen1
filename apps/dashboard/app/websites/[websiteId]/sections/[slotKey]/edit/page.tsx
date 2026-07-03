"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { apiCall } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import BooleanRadio from "@/components/ui/BooleanRadio";
import EnhancedTextarea from "@/components/ui/EnhancedTextarea";
import MediaPickerInput from "@/components/ui/MediaPickerInput";
import {
  Edit3,
  Save,
  AlertCircle,
  Link as LinkIcon,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Plus,
  Trash2,
  GripVertical
} from "lucide-react";

interface RepeaterItemField {
  key: string;
  label: string;
  type?: "text" | "textarea";
  placeholder?: string | null;
}

interface SchemaField {
  key: string;
  label: string;
  type: "text" | "textarea" | "image_url" | "url" | "repeater";
  required?: boolean;
  placeholder?: string | null;
  helpText?: string | null;
  defaultValue?: string;
  itemFields?: RepeaterItemField[];
  itemLabel?: string;
}

interface SectionDetail {
  slotLabel: string;
  slotDescription: string;
  isAutoManaged?: boolean;
  autoManagedSource?: string | null;
  autoManagedFields?: string[];
  templateSection: {
    id: string;
    name: string;
    schema: SchemaField[];
  } | null;
  effectiveContent: Record<string, any> | null;
}

type NavigationTarget = {
  type: "page" | "whatsapp" | "custom" | string;
  pageKey?: string;
  label: string;
  path?: string | null;
  value?: string | null;
};

type NavigationContract = {
  availableTargets: NavigationTarget[];
};

const isCtaUrlField = (key: string) => /(cta|button|link).*url/i.test(key);
const DEFAULT_REPEATER_ITEM_FIELDS: RepeaterItemField[] = [
  { key: "title", label: "Judul", type: "text" },
  { key: "value", label: "Nilai / Isi", type: "text" }
];
const repeaterItemFields = (field: SchemaField) =>
  field.itemFields && field.itemFields.length ? field.itemFields : DEFAULT_REPEATER_ITEM_FIELDS;
const emptyRepeaterItem = (field: SchemaField) =>
  Object.fromEntries(repeaterItemFields(field).map((f) => [f.key, ""]));
const isBooleanLikeField = (field: SchemaField, value: unknown) => {
  const key = field.key || "";
  const rawValue = String(value ?? field.defaultValue ?? "").toLowerCase();
  return (
    /^(show|hide|enable|disable|is|has|use|display)/i.test(key) ||
    rawValue === "true" ||
    rawValue === "false"
  );
};
const toBooleanValue = (value: unknown) => String(value ?? "").toLowerCase() === "true";
const fromBooleanValue = (value: boolean) => (value ? "true" : "false");
const targetPrefix = (key: string) => key.replace(/Url$/i, "");
const targetTypeKey = (key: string) => `${targetPrefix(key)}TargetType`;
const targetPageKey = (key: string) => `${targetPrefix(key)}TargetPageKey`;
const targetCustomUrlKey = (key: string) => `${targetPrefix(key)}CustomUrl`;

const isEffectivelyEmptyHtml = (html: string) => {
  const value = (html || "").trim();
  return !value || value === "<p></p>" || value === "<p><br></p>";
};

// Sanitasi dasar untuk preview di dashboard: buang tag berbahaya (script, iframe, dst) dan
// atribut event handler on*, sebelum dirender sebagai HTML lewat dangerouslySetInnerHTML.
// Konten ini berasal dari RichTextEditor (TipTap) yang diisi owner sendiri di Profil Bisnis,
// jadi risikonya rendah, tapi sanitasi tetap dijaga sebagai lapisan pertahanan tambahan.
const sanitizeHtmlPreview = (html: string) =>
  String(html || "")
    .replace(/<(script|style|iframe|object|embed|form|link|meta)[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/<(script|style|iframe|object|embed|form|link|meta)[^>]*\/?>(?!<\/\1>)/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .replace(/href\s*=\s*["']\s*javascript:[^"']*["']/gi, "");

function AutoManagedHtmlPreview({ html }: { html: string }) {
  if (isEffectivelyEmptyHtml(html)) {
    return <p className="text-sm text-slate-400 italic">Belum diisi di Profil Bisnis.</p>;
  }
  return (
    <div
      className="prose prose-sm max-w-none text-slate-600 leading-relaxed prose-p:my-2 prose-ul:my-2 prose-li:my-1"
      dangerouslySetInnerHTML={{ __html: sanitizeHtmlPreview(html) }}
    />
  );
}

export default function EditSectionContentPage() {
  const router = useRouter();
  const params = useParams();
  const websiteId = params?.websiteId as string;
  const slotKey = params?.slotKey as string;

  const [section, setSection] = useState<SectionDetail | null>(null);
  const [navigationTargets, setNavigationTargets] = useState<NavigationTarget[]>([]);
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
      const [sectionRes, navigationRes] = await Promise.all([
        apiCall<SectionDetail>("GET", `websites/${websiteId}/sections/${slotKey}`),
        apiCall<NavigationContract>("GET", `websites/${websiteId}/navigation-contract`).catch(() => ({ data: { availableTargets: [] } }))
      ]);

      const data = sectionRes.data;
      setSection(data);
      setNavigationTargets(navigationRes.data.availableTargets || []);

      const initialForm: Record<string, any> = {};
      if (data.templateSection?.schema) {
        data.templateSection.schema.forEach((field) => {
          const fKey = field.key;
          if (!fKey) return;

          if (field.type === "repeater") {
            const existing = data.effectiveContent?.[fKey];
            initialForm[fKey] = Array.isArray(existing) ? existing : [];
            return;
          }

          initialForm[fKey] = data.effectiveContent?.[fKey] ?? field.defaultValue ?? "";

          if (field.type === "url" && isCtaUrlField(fKey)) {
            const typeKey = targetTypeKey(fKey);
            const pageKeyName = targetPageKey(fKey);
            const customKey = targetCustomUrlKey(fKey);
            const currentValue = String(data.effectiveContent?.[fKey] || "");
            const matchedPage = (navigationRes.data.availableTargets || []).find((target) => target.type === "page" && target.path === currentValue);
            initialForm[typeKey] = data.effectiveContent?.[typeKey] || (matchedPage ? "page" : currentValue ? "custom" : "page");
            initialForm[pageKeyName] = data.effectiveContent?.[pageKeyName] || matchedPage?.pageKey || "contact";
            initialForm[customKey] = data.effectiveContent?.[customKey] || (matchedPage ? "" : currentValue);
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
    if (websiteId && slotKey) fetchSectionDetail();
  }, [websiteId, slotKey]);

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleRepeaterAdd = (field: SchemaField) => {
    setFormData((prev) => {
      const items = Array.isArray(prev[field.key]) ? prev[field.key] : [];
      return { ...prev, [field.key]: [...items, emptyRepeaterItem(field)] };
    });
  };

  const handleRepeaterRemove = (field: SchemaField, index: number) => {
    setFormData((prev) => {
      const items = Array.isArray(prev[field.key]) ? prev[field.key] : [];
      return { ...prev, [field.key]: items.filter((_: unknown, i: number) => i !== index) };
    });
  };

  const handleRepeaterItemChange = (field: SchemaField, index: number, itemKey: string, value: string) => {
    setFormData((prev) => {
      const items = Array.isArray(prev[field.key]) ? [...prev[field.key]] : [];
      items[index] = { ...items[index], [itemKey]: value };
      return { ...prev, [field.key]: items };
    });
  };

  const resolveTargetUrl = (fieldKey: string, nextData: Record<string, any>) => {
    const type = nextData[targetTypeKey(fieldKey)] || "page";
    if (type === "page") {
      const pageKey = nextData[targetPageKey(fieldKey)] || "contact";
      const target = navigationTargets.find((item) => item.type === "page" && item.pageKey === pageKey);
      return target?.path || "/contact";
    }
    if (type === "whatsapp") {
      const target = navigationTargets.find((item) => item.type === "whatsapp");
      return target?.path || "";
    }
    return nextData[targetCustomUrlKey(fieldKey)] || "";
  };

  const handleTargetChange = (fieldKey: string, patch: Record<string, string>) => {
    setFormData((prev) => {
      const next = { ...prev, ...patch };
      next[fieldKey] = resolveTargetUrl(fieldKey, next);
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const contentJson = { ...formData };
      autoManagedFieldSet.forEach((key) => {
        delete contentJson[key as string];
      });
      section?.templateSection?.schema.forEach((field) => {
        if (field.type === "url" && isCtaUrlField(field.key)) {
          contentJson[field.key] = resolveTargetUrl(field.key, contentJson);
        }
      });

      await apiCall<any>("PATCH", `websites/${websiteId}/sections/${slotKey}/content`, { contentJson });
      setSuccessMsg("Konten bagian website berhasil disimpan!");
      setTimeout(() => router.push(`/websites/${websiteId}/pages/${currentPageKey}`), 800);
    } catch (err: any) {
      console.error("Save content error:", err);
      setErrorMsg(err.error?.message || "Gagal menyimpan konten.");
    } finally {
      setSaving(false);
    }
  };

  const renderUrlField = (field: SchemaField, fieldId: string) => {
    const fKey = field.key;
    if (!isCtaUrlField(fKey)) {
      return (
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <LinkIcon className="h-4 w-4" />
          </span>
          <input
            id={fieldId}
            type="url"
            required={field.required === true}
            placeholder={field.placeholder || "https://..."}
            value={formData[fKey] || ""}
            onChange={(e) => handleInputChange(fKey, e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6] transition-colors text-sm font-mono text-xs"
          />
        </div>
      );
    }

    const typeKey = targetTypeKey(fKey);
    const pageKeyName = targetPageKey(fKey);
    const customKey = targetCustomUrlKey(fKey);
    const targetType = formData[typeKey] || "page";
    const pageTargets = navigationTargets.filter((target) => target.type === "page");

    return (
      <div className="space-y-3 rounded-2xl border border-[#649FF6]/20 bg-[#649FF6]/10 p-4">
        <div className="grid gap-3 md:grid-cols-2">
          <label className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Jenis Tujuan</span>
            <select
              value={targetType}
              onChange={(e) => handleTargetChange(fKey, { [typeKey]: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-[#649FF6] focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20"
            >
              <option value="page">Halaman Website</option>
              <option value="whatsapp">WhatsApp Bisnis</option>
              <option value="custom">Link Custom</option>
            </select>
          </label>

          {targetType === "page" && (
            <label className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Pilih Halaman</span>
              <select
                value={formData[pageKeyName] || "contact"}
                onChange={(e) => handleTargetChange(fKey, { [pageKeyName]: e.target.value, [typeKey]: "page" })}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-[#649FF6] focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20"
              >
                {pageTargets.map((target) => (
                  <option key={target.pageKey} value={target.pageKey}>{target.label}</option>
                ))}
              </select>
            </label>
          )}

          {targetType === "custom" && (
            <label className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">URL Custom</span>
              <input
                type="url"
                value={formData[customKey] || ""}
                onChange={(e) => handleTargetChange(fKey, { [customKey]: e.target.value, [typeKey]: "custom" })}
                placeholder="https://contoh.com"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-mono focus:border-[#649FF6] focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20"
              />
            </label>
          )}
        </div>
        <p className="text-[11px] leading-relaxed text-slate-500">
          Owner cukup memilih tujuan tombol. Sistem akan menyimpan target terstruktur dan fallback URL: <code className="rounded bg-white px-1 font-mono">{resolveTargetUrl(fKey, formData) || "belum tersedia"}</code>
        </p>
      </div>
    );
  };

  if (loading) {
    return (
      <DashboardLayout title="Memuat Form..." showBackButton backUrl={`/websites/${websiteId}/pages/${currentPageKey}`}>
        <div className="flex h-64 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
        </div>
      </DashboardLayout>
    );
  }

  if (!section || !section.templateSection) {
    return (
      <DashboardLayout title="Tampilan Belum Dipilih" showBackButton backUrl={`/websites/${websiteId}/pages/${currentPageKey}`}>
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-4 max-w-md mx-auto">
          <AlertCircle className="h-12 w-12 text-amber-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">Tampilan Belum Dipilih</h3>
          <p className="text-sm text-slate-500">Anda harus memilih tampilan template terlebih dahulu sebelum dapat mengisi konten.</p>
          <button onClick={() => router.push(`/websites/${websiteId}/sections/${slotKey}/choose`)} className="px-5 py-2.5 bg-[#649FF6] hover:bg-[#4f8be6] text-white text-xs font-semibold rounded-xl">
            Pilih Tampilan Sekarang
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const autoManagedFieldSet = new Set(section?.autoManagedFields || []);

  return (
    <DashboardLayout
      title="Isi Konten Website"
      subtitle={`Bagian: ${section.slotLabel} | Tampilan: ${section.templateSection.name}`}
      showBackButton
      backUrl={`/websites/${websiteId}/pages/${currentPageKey}`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="edit-content-layout">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex items-center space-x-2 text-slate-800">
            <Edit3 className="h-5 w-5 text-[#649FF6]" />
            <span className="font-bold text-sm uppercase tracking-wide text-slate-400">Isi Form Konten</span>
          </div>

          {errorMsg && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start space-x-3 text-rose-800 text-sm">
              <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-sm">{successMsg}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            {section.templateSection.schema.map((field) => {
              const fKey = field.key;
              if (!fKey) return null;
              const fieldId = `field-input-${fKey}`;
              const isFieldRequired = field.required === true;

              // Field yang datanya diambil otomatis dari Business Profile (mis. vision/
              // mission, alamat, email, WhatsApp, embed maps) tidak bisa diedit di sini —
              // tampilkan pratinjau saja + link ke Profil Bisnis, field lain di section yang
              // sama (title/badge/subtitle/cta/dst) tetap bisa diisi normal.
              if (autoManagedFieldSet.has(fKey)) {
                const rawValue = String(formData[fKey] ?? "");
                const looksLikeHtml = /<[a-z][\s\S]*>/i.test(rawValue);
                return (
                  <div key={fKey} className="space-y-1.5" id={`form-group-${fKey}`}>
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      {field.label}
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-[#649FF6] bg-[#649FF6]/10 px-2 py-0.5 rounded-full">
                        <Sparkles className="h-3 w-3" /> Dari Profil Bisnis
                      </span>
                    </label>
                    <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-2">
                      {looksLikeHtml ? (
                        <AutoManagedHtmlPreview html={rawValue} />
                      ) : (
                        <p className={`text-sm ${rawValue ? "text-slate-700" : "text-slate-400 italic"}`}>
                          {rawValue || "Belum diisi di Profil Bisnis."}
                        </p>
                      )}
                      <button
                        type="button"
                        onClick={() => router.push(`/websites/${websiteId}/profile`)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#649FF6] hover:underline"
                      >
                        Kelola di Profil Bisnis
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div key={fKey} className="space-y-1.5" id={`form-group-${fKey}`}>
                  <label htmlFor={fieldId} className="block text-sm font-semibold text-slate-700">
                    {field.label} {isFieldRequired && <span className="text-rose-500">*</span>}
                  </label>

                  {field.type === "textarea" ? (
                    <EnhancedTextarea
                      id={fieldId}
                      required={isFieldRequired}
                      minRows={4}
                      placeholder={field.placeholder || `Masukkan isian ${field.label}...`}
                      value={formData[fKey] || ""}
                      onChange={(value) => handleInputChange(fKey, value)}
                      helperText={field.helpText || "Tulis dengan bahasa yang mudah dipahami calon pelanggan."}
                    />
                  ) : field.type === "image_url" ? (
                    <MediaPickerInput
                      id={fieldId}
                      required={isFieldRequired}
                      value={formData[fKey] || ""}
                      onChange={(url) => handleInputChange(fKey, url)}
                      picsumSeedPrefix={fKey}
                      helperText={field.helpText || undefined}
                    />
                  ) : field.type === "repeater" ? (
                    <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                      {(Array.isArray(formData[fKey]) ? formData[fKey] : []).length === 0 && (
                        <p className="text-xs text-slate-400 italic">Belum ada item. Klik &quot;Tambah Item&quot; untuk mulai menambahkan.</p>
                      )}
                      {(Array.isArray(formData[fKey]) ? formData[fKey] : []).map((item: Record<string, string>, index: number) => (
                        <div key={index} className="rounded-xl border border-slate-200 bg-white p-4 space-y-3 relative">
                          <div className="flex items-center justify-between">
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                              <GripVertical className="h-3.5 w-3.5" />
                              {field.itemLabel || "Item"} {index + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRepeaterRemove(field, index)}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-500 hover:text-rose-600 hover:bg-rose-50 px-2 py-1 rounded-lg transition"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Hapus
                            </button>
                          </div>
                          {repeaterItemFields(field).map((subField) => (
                            <div key={subField.key} className="space-y-1">
                              <label className="block text-[11px] font-semibold text-slate-600">{subField.label}</label>
                              {subField.type === "textarea" ? (
                                <EnhancedTextarea
                                  id={`${fieldId}-${index}-${subField.key}`}
                                  minRows={2}
                                  placeholder={subField.placeholder || `Masukkan ${subField.label}...`}
                                  value={item?.[subField.key] || ""}
                                  onChange={(value) => handleRepeaterItemChange(field, index, subField.key, value)}
                                />
                              ) : (
                                <input
                                  type="text"
                                  placeholder={subField.placeholder || `Masukkan ${subField.label}...`}
                                  value={item?.[subField.key] || ""}
                                  onChange={(e) => handleRepeaterItemChange(field, index, subField.key, e.target.value)}
                                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6] transition-colors text-sm"
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => handleRepeaterAdd(field)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#649FF6]/10 hover:bg-[#649FF6]/20 text-[#649FF6] text-xs font-bold rounded-xl transition"
                      >
                        <Plus className="h-4 w-4" />
                        Tambah {field.itemLabel || "Item"}
                      </button>
                    </div>
                  ) : field.type === "url" ? (
                    renderUrlField(field, fieldId)
                  ) : isBooleanLikeField(field, formData[fKey]) ? (
                    <BooleanRadio
                      id={fieldId}
                      value={toBooleanValue(formData[fKey])}
                      onChange={(value) => handleInputChange(fKey, fromBooleanValue(value))}
                      description="Pilih Ya atau Tidak agar owner tidak perlu mengetik true/false."
                    />
                  ) : (
                    <input
                      id={fieldId}
                      type="text"
                      required={isFieldRequired}
                      placeholder={field.placeholder || `Masukkan isian ${field.label}...`}
                      value={formData[fKey] || ""}
                      onChange={(e) => handleInputChange(fKey, e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20 focus:border-[#649FF6] transition-colors text-sm"
                    />
                  )}

                  {field.helpText && field.type !== "image_url" && <p className="text-[11px] text-slate-400 mt-1 pl-1">{field.helpText}</p>}
                </div>
              );
            })}

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
              <button type="button" onClick={() => router.push(`/websites/${websiteId}/pages/${currentPageKey}`)} className="px-5 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition">
                Kembali
              </button>
              <button type="submit" disabled={saving} className="inline-flex items-center justify-center space-x-2 px-6 py-2.5 bg-[#649FF6] hover:bg-[#4f8be6] disabled:bg-[#8bb8fb] text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/10 hover:shadow-emerald-700/20 transition active:translate-y-[1px]" id="btn-save-content">
                {saving ? <><div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /><span>Sedang Menyimpan...</span></> : <><Save className="h-4 w-4" /><span>Simpan Konten Section</span></>}
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-sm">
            <h3 className="font-bold text-base mb-3">Tentang Bagian Ini</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">{section.slotDescription}</p>
            <div className="border-t border-slate-800 pt-3 space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">ID Slot Teknis</span>
              <span className="font-mono text-xs text-[#B283AF] bg-slate-850 px-2 py-1 rounded block w-max select-all border border-slate-800">{slotKey}</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3.5 shadow-sm">
            <div className="flex items-center space-x-2 text-amber-600">
              <HelpCircle className="h-5 w-5" />
              <span className="font-bold text-xs uppercase tracking-wide">Panduan Tombol, Gambar & Link</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              <strong>Tujuan Tombol:</strong> pilih halaman website, WhatsApp bisnis, atau link custom. Owner tidak perlu mengetik link teknis seperti <code className="font-mono text-[10px] bg-slate-100 p-1 rounded font-semibold">/contact</code> jika hanya ingin mengarahkan tombol ke halaman tertentu.<br/><br/>
              <strong>Gambar:</strong> gunakan URL gambar yang ramah internet dengan ekstensi .jpg, .png, atau .webp.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
