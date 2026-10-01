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

  // Catalog filter.
  const form = document.querySelector('[data-filter]');
  if (form) {
    const cards = [...document.querySelectorAll('.pcard')];
    const sections = [...document.querySelectorAll('[data-section]')];
    const count = form.querySelector('[data-count]');
    const apply = () => {
      const q = form.q.value.trim().toLowerCase();
      const ins = form.instructor.value, col = form.collection.value;
      let n = 0;
      cards.forEach((c) => {
        const ok = (!q || c.dataset.search.includes(q)) && (!ins || c.dataset.instructor === ins) && (!col || c.dataset.collection === col);
        c.hidden = !ok; if (ok) n++;
      });
      sections.forEach((s) => { s.hidden = !s.querySelector('.pcard:not([hidden])'); });
      count.textContent = n;
    };
    form.addEventListener('input', apply);
    form.addEventListener('submit', (e) => { e.preventDefault(); apply(); });
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
