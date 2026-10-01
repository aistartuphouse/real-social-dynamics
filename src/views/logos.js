import { html, raw } from '../lib/html.js';

// Original product logo emblems (new 2026 marks, not historical artwork). Drawn in a 100×100 box,
// stroked with currentColor so each cover's palette applies. Keep geometry simple and legible at 48px.
const S = 'fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"';
const F = 'fill="currentColor"';

export const EMBLEMS = {
  foundations: `<rect x="18" y="64" width="64" height="16" ${F}/><rect x="28" y="44" width="44" height="16" ${F} opacity=".8"/><rect x="38" y="24" width="24" height="16" ${F} opacity=".6"/>`,
  transformations: `<circle cx="50" cy="50" r="10" ${F}/><path d="M50 12v18M50 70v18M12 50h18M70 50h18M23 23l12 12M65 65l12 12M77 23L65 35M35 65L23 77" ${S}/>`,
  'the-blueprint-decoded': `<path d="M14 14h72v72H14zM14 38h72M14 62h72M38 14v72M62 14v72" ${S} stroke-width="3" opacity=".55"/><path d="M20 80L44 50l14 12 22-36" ${S}/>`,
  'hot-seat-at-home': `<path d="M30 20v40h40M30 60v22M70 60v22M30 40h34" ${S}/><path d="M76 16v20M86 16v20" ${S} stroke-width="5"/>`,
  pimp: `<path d="M16 72l10-42 24 22 24-22 10 42z" ${S}/><path d="M16 84h68" ${S}/>`,
  shift: `<path d="M14 78h24V56h24V34h24" ${S}/><path d="M74 22l12 12-12 12" ${S}/>`,
  tengame: `<circle cx="50" cy="50" r="36" ${S}/><path d="M34 38l6-4v32" ${S}/><ellipse cx="62" cy="50" rx="9" ry="16" ${S}/>`,
  'transformation-mastery': `<path d="M50 14L86 80H14z" ${S}/><path d="M32 60h36M41 44h18" ${S}/>`,
  'the-jeffy-show': `<rect x="38" y="14" width="24" height="40" rx="12" ${S}/><path d="M26 46c0 14 11 24 24 24s24-10 24-24M50 70v14M36 86h28" ${S}/>`,
  resonator: `<path d="M14 50h8M30 34v32M42 22v56M54 30v40M66 40v20M78 46v8" ${S}/>`,
  'execute-the-program': `<path d="M16 22h56v38H40l-14 12V60H16z" ${S}/><path d="M60 66l12 18 4-10 10-4z" ${F}/>`,
  'flawless-natural': `<path d="M50 86C22 70 18 40 50 14c32 26 28 56 0 72z" ${S}/><path d="M50 86V40" ${S}/>`,
  'no-reason-youre-not-enough': `<circle cx="50" cy="50" r="36" ${S}/><circle cx="50" cy="50" r="20" ${S} opacity=".6"/><circle cx="50" cy="50" r="6" ${F}/>`,
  'social-encrypted': `<rect x="24" y="44" width="52" height="40" rx="6" ${S}/><path d="M34 44V32a16 16 0 0132 0v12" ${S}/><path d="M56 58a8 8 0 11-8-8 6 6 0 008 8z" ${F}/>`,
  evolutions: `<path d="M18 82V64M40 82V48M62 82V32M84 82V16" ${S} stroke-width="10"/>`,
  'lifestyle-academy': `<circle cx="50" cy="50" r="36" ${S}/><path d="M50 22l10 28-10 28-10-28z" ${F}/>`,
  'ten-commandments-of-game': `<path d="M18 84V30a14 14 0 0128 0v54zM54 84V30a14 14 0 0128 0v54z" ${S}/><path d="M26 46h12M26 58h12M62 46h12M62 58h12" ${S} stroke-width="4"/>`,
  'social-circle-blueprint': `<circle cx="50" cy="22" r="8" ${F}/><circle cx="22" cy="72" r="8" ${F}/><circle cx="78" cy="72" r="8" ${F}/><circle cx="50" cy="56" r="6" ${F}/><path d="M50 22L22 72h56zM50 22v34M22 72l28-16 28 16" ${S} stroke-width="3"/>`,
  boss: `<path d="M50 12l32 12v24c0 20-14 34-32 40-18-6-32-20-32-40V24z" ${S}/><path d="M38 50l9 9 17-19" ${S}/>`,
  'energy-awareness': `<path d="M10 50c10-30 20-30 30 0s20 30 30 0 15-24 20-10" ${S}/><circle cx="50" cy="50" r="4" ${F}/>`,
  '3-girls-a-day': `<circle cx="24" cy="50" r="12" ${S}/><circle cx="50" cy="50" r="12" ${S}/><circle cx="76" cy="50" r="12" ${S}/>`,
  'daygame-by-todd': `<circle cx="50" cy="50" r="16" ${F}/><path d="M50 14v10M50 76v10M14 50h10M76 50h10M25 25l7 7M68 68l7 7M75 25l-7 7M32 68l-7 7" ${S}/>`,
  'text-and-dates-machine': `<path d="M12 18h46v30H30l-10 9v-9h-8z" ${S}/><rect x="44" y="50" width="44" height="36" rx="4" ${S}/><path d="M44 62h44M56 44v12M76 44v12" ${S} stroke-width="5"/>`,
  'get-your-ten': `<circle cx="50" cy="50" r="36" ${S}/><path d="M30 50h12M36 44v12" ${S} stroke-width="5"/><path d="M52 38l6-4v32M74 34a9 14 0 110 32 9 14 0 010-32" ${S} stroke-width="5"/>`,
  'owens-last-game-program': `<path d="M20 80V20h44l16 16v44z" ${S}/><path d="M64 20v16h16M34 50h32M34 64h20" ${S} stroke-width="5"/>`,
  'social-circle-hacking': `<circle cx="50" cy="50" r="30" ${S} stroke-dasharray="10 8"/><circle cx="50" cy="20" r="7" ${F}/><circle cx="76" cy="65" r="7" ${F}/><circle cx="24" cy="65" r="7" ${F}/><path d="M44 50h12M50 44v12" ${S} stroke-width="5"/>`,
  'influence-mastery-program': `<circle cx="50" cy="50" r="8" ${F}/><circle cx="50" cy="50" r="22" ${S} opacity=".75"/><circle cx="50" cy="50" r="38" ${S} opacity=".45"/>`,
  'valentine-university': `<path d="M14 26c14-6 26-6 36 2 10-8 22-8 36-2v54c-14-6-26-6-36 2-10-8-22-8-36-2z" ${S}/><path d="M50 28v52" ${S}/>`,
  women: `<path d="M18 70a32 32 0 0164 0" ${S}/><path d="M50 70L66 42" ${S}/><circle cx="50" cy="70" r="5" ${F}/><path d="M18 70h8M74 70h8M50 38v-8" ${S} stroke-width="4"/>`,
};

const clean = (t) => t.replace(/\s*\(.*\)$/, '');

// Inline SVG logo: emblem + wordmark. Inline so it uses the page's display font.
export function programLogo(p, { label = true } = {}) {
  const emblem = EMBLEMS[p.slug];
  return html`<span class="logo">
    ${emblem ? html`<svg class="logo-mark" viewBox="0 0 100 100" aria-hidden="true" focusable="false">${raw(emblem)}</svg>` : ''}
    ${label ? html`<span class="logo-word">${clean(p.title)}</span>` : ''}
  </span>`;
}

// Standalone SVG file (system-font fallback) for use outside the site: emails, decks, social.
export function logoSvgFile(p, { fg = '#FFFFFF', bg = '#0B1F3A' } = {}) {
  const title = clean(p.title).toUpperCase().replace(/&/g, '&amp;');
  const size = title.length > 16 ? 26 : title.length > 10 ? 32 : 40;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300" role="img" aria-label="${title} logo">
<rect width="300" height="300" fill="${bg}"/>
<g transform="translate(100 46)" color="${fg}"><svg viewBox="0 0 100 100" width="100" height="100">${EMBLEMS[p.slug] || ''}</svg></g>
<text x="150" y="200" fill="${fg}" font-family="Archivo, 'Helvetica Neue', Arial, sans-serif" font-weight="900" font-size="${size}" text-anchor="middle" letter-spacing="1">${title}</text>
<text x="150" y="240" fill="${fg}" opacity=".7" font-family="Archivo, 'Helvetica Neue', Arial, sans-serif" font-weight="700" font-size="12" text-anchor="middle" letter-spacing="4">RSD LEGACY ARCHIVE</text>
</svg>`;
}
