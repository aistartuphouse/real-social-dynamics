// Progressive enhancement only. The page works without JS.
(() => {
  // Shared deadline countdown. Reads the server-rendered deadline; never per-visitor, never resets.
  const fmt = (ms) => {
    const s = Math.max(0, Math.floor(ms / 1000));
    const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60);
    return d > 0 ? `${d}d ${h}h ${m}m left` : `${h}h ${m}m left`;
  };
  const counters = [...document.querySelectorAll('.countdown[data-ends]')];
  const tick = () => counters.forEach((el) => { el.textContent = fmt(new Date(el.dataset.ends) - Date.now()); });
  if (counters.length) { tick(); setInterval(tick, 30000); }

  // Countdown clocks: tick every second toward the shared deadline.
  const clocks = [...document.querySelectorAll('[data-clock]')];
  const tickClocks = () => clocks.forEach((c) => {
    const ms = Math.max(0, new Date(c.dataset.clock) - Date.now());
    const v = { days: Math.floor(ms / 86400000), hours: Math.floor(ms / 3600000) % 24, minutes: Math.floor(ms / 60000) % 60, seconds: Math.floor(ms / 1000) % 60 };
    c.querySelectorAll('[data-unit]').forEach((n) => { n.textContent = String(v[n.dataset.unit]).padStart(2, '0'); });
    if (ms === 0) c.classList.add('clock-ended');
  });
  if (clocks.length) { tickClocks(); setInterval(tickClocks, 1000); }

  // Hero name rotator: cycles instructor names; static for reduced-motion users.
  const rot = document.querySelector('.rotator[data-names]');
  if (rot && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let names = []; try { names = JSON.parse(rot.dataset.names); } catch {}
    let i = 0;
    if (names.length > 1) setInterval(() => {
      rot.classList.add('out');
      setTimeout(() => { i = (i + 1) % names.length; rot.textContent = names[i]; rot.classList.remove('out'); }, 250);
    }, 2600);
  }

  // Catalog filter: search text, instructor and collection filter both the program cards and the
  // instructor sections. Supports deep links like /legacy?q=alex or /legacy?instructor=alex.
  const form = document.querySelector('[data-filter]');
  if (form) {
    const cards = [...document.querySelectorAll('.pcard')];
    const sections = [...document.querySelectorAll('[data-section]')];
    const insBlocks = [...document.querySelectorAll('.ins[data-instructor]')];
    const insSection = document.querySelector('[data-ins-section]');
    const count = form.querySelector('[data-count]');
    const clear = form.querySelector('[data-clear]');
    const params = new URLSearchParams(location.search);
    if (params.get('q')) form.q.value = params.get('q');
    if (params.get('instructor')) form.instructor.value = params.get('instructor');
    if (params.get('collection')) form.collection.value = params.get('collection');
    const apply = () => {
      const q = form.q.value.trim().toLowerCase();
      const ins = form.instructor.value, col = form.collection.value;
      const words = q.split(/\s+/).filter(Boolean);
      const matches = (text) => words.every((w) => text.includes(w));
      let n = 0;
      const shownInstructors = new Set();
      cards.forEach((c) => {
        const ok = matches(c.dataset.search) && (!ins || c.dataset.instructor === ins) && (!col || c.dataset.collection === col);
        c.hidden = !ok;
        if (ok) { n++; shownInstructors.add(c.dataset.instructor); }
      });
      sections.forEach((s) => { s.hidden = !s.querySelector('.pcard:not([hidden])'); });
      const filtering = Boolean(words.length || ins || col);
      insBlocks.forEach((b) => { b.hidden = filtering && !shownInstructors.has(b.dataset.instructor); });
      if (insSection) insSection.hidden = !insBlocks.some((b) => !b.hidden);
      count.textContent = n;
      if (clear) clear.hidden = !filtering;
      const url = new URL(location.href);
      ['q', 'instructor', 'collection'].forEach((k) => url.searchParams.delete(k));
      if (words.length) url.searchParams.set('q', form.q.value.trim());
      if (ins) url.searchParams.set('instructor', ins);
      if (col) url.searchParams.set('collection', col);
      history.replaceState(null, '', url);
    };
    form.addEventListener('input', apply);
    form.addEventListener('change', apply);
    form.addEventListener('submit', (e) => { e.preventDefault(); apply(); });
    if (clear) clear.addEventListener('click', () => { form.reset(); form.q.value = ''; apply(); form.q.focus(); });
    apply();
  }

  // Mobile sticky CTA: appears after the hero, hides near the package, dismissible for the session.
  const sticky = document.querySelector('[data-sticky]');
  const pkg = document.getElementById('package');
  if (sticky && pkg) {
    let dismissed = false;
    try { dismissed = sessionStorage.getItem('rsd-sticky') === '0'; } catch {}
    const update = () => {
      if (dismissed) { sticky.hidden = true; return; }
      const r = pkg.getBoundingClientRect();
      const nearPkg = r.top < window.innerHeight && r.bottom > 0;
      sticky.hidden = window.scrollY < 600 || nearPkg;
    };
    sticky.querySelector('.sticky-close').addEventListener('click', () => {
      dismissed = true; sticky.hidden = true;
      try { sessionStorage.setItem('rsd-sticky', '0'); } catch {}
    });
    window.addEventListener('scroll', update, { passive: true });
    update();
  }
})();
