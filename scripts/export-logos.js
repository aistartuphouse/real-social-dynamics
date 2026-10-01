// Writes standalone SVG logo files for every catalog program (navy and white variants) to public/img/logos/.
import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { ROOT, loadCatalog } from '../src/lib/config.js';
import { EMBLEMS, logoSvgFile } from '../src/views/logos.js';

const dir = path.join(ROOT, 'public/img/logos');
mkdirSync(dir, { recursive: true });
let n = 0;
for (const p of loadCatalog().programs.filter((x) => EMBLEMS[x.slug])) {
  writeFileSync(path.join(dir, `${p.slug}.svg`), logoSvgFile(p));
  writeFileSync(path.join(dir, `${p.slug}-light.svg`), logoSvgFile(p, { fg: '#0B1F3A', bg: '#FFFFFF' }));
  n++;
}
console.log(`Wrote ${n * 2} logo files to public/img/logos/`);
