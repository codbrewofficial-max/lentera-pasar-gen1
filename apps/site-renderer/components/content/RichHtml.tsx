import parse, { type HTMLReactParserOptions } from 'html-react-parser';
import { Element } from 'domhandler';

/**
 * RichHtml — dipakai untuk merender field yang diisi lewat RichTextEditor di dashboard
 * (Article.content dan Portfolio.description, keduanya HTML dari TipTap), supaya format
 * (bold, list, heading, link, dst) tampil dengan benar di halaman publik, bukan cuma teks
 * mentah atau di-split manual per paragraf.
 *
 * Semua tag/atribut berbahaya (script, style, iframe, event handler on*) disaring lewat
 * `replace` di bawah sebagai lapisan keamanan tambahan, di luar sanitasi yang idealnya
 * juga dilakukan saat konten disimpan di backend.
 */

const DANGEROUS_TAGS = new Set(['script', 'style', 'iframe', 'object', 'embed', 'form', 'link', 'meta']);

const parserOptions: HTMLReactParserOptions = {
  replace: (domNode) => {
    if (!(domNode instanceof Element)) return undefined;

    if (DANGEROUS_TAGS.has(domNode.name)) return <></>;

    if (domNode.attribs) {
      for (const attr of Object.keys(domNode.attribs)) {
        if (attr.toLowerCase().startsWith('on')) delete domNode.attribs[attr];
      }
      if (domNode.attribs.href && /^\s*javascript:/i.test(domNode.attribs.href)) {
        delete domNode.attribs.href;
      }
      if (domNode.name === 'a' && domNode.attribs.href) {
        domNode.attribs.target = '_blank';
        domNode.attribs.rel = 'noopener noreferrer';
      }
    }

    return undefined;
  }
};

export function RichHtml({
  html,
  className = '',
  emptyFallback = null
}: {
  html?: string | null;
  className?: string;
  emptyFallback?: React.ReactNode;
}) {
  const value = (html || '').trim();
  const isEffectivelyEmpty = !value || value === '<p></p>' || value === '<p><br></p>';

  if (isEffectivelyEmpty) {
    return emptyFallback ? <div className={className}>{emptyFallback}</div> : null;
  }

  return <div className={className}>{parse(value, parserOptions)}</div>;
}

// Dipakai untuk kartu preview (excerpt pendek) yang tidak boleh menampilkan markup HTML
// mentah (mis. "<p>Lorem</p>" tampil sebagai teks). Menghapus semua tag, sisakan teks polos.
export function stripHtmlToText(html?: string | null, maxLength?: number) {
  const raw = (html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  if (!maxLength || raw.length <= maxLength) return raw;
  return `${raw.slice(0, maxLength).trimEnd()}…`;
}
