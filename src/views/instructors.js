import { html } from '../lib/html.js';
import { loadInstructors } from '../lib/config.js';

// Instructor-by-instructor benefit blocks. Only instructors with at least one public program render.
export function instructorBlocks(cfg, programs) {
  return loadInstructors().map((ins) => {
    const own = programs.filter((p) => p.instructorKey === ins.key);
    if (!own.length) return '';
    return html`<article class="ins" id="instructor-${ins.key}">
      <p class="ins-name">${ins.name}</p>
      <h3 class="ins-head">${ins.headline}</h3>
      <p class="ins-programs">${own.map((p, i) => html`${i ? ' · ' : ''}<a href="/programs/${p.slug}">${p.title}</a>`)}</p>
      <ul class="ins-bullets">${ins.bullets.map((b) => html`<li>${b}</li>`)}</ul>
      ${cfg.isStaging && ins.key === 'julien' && !cfg.julienSequenceApproved ? html`<span class="staging-flag">STAGING · Julien wording needs approved titles</span>` : ''}
    </article>`;
  });
}
