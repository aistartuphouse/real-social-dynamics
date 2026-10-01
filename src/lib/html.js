// Minimal auto-escaping template tag. Interpolated strings are escaped unless wrapped with raw().
const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const escape = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ESC[c]);

class Raw { constructor(v) { this.v = v; } toString() { return this.v; } }
export const raw = (v) => new Raw(String(v ?? ''));

function flatten(v) {
  if (v instanceof Raw) return v.v;
  if (Array.isArray(v)) return v.map(flatten).join('');
  if (v === false || v === null || v === undefined) return '';
  return escape(v);
}

export function html(strings, ...values) {
  let out = '';
  strings.forEach((s, i) => { out += s; if (i < values.length) out += flatten(values[i]); });
  return new Raw(out);
}
