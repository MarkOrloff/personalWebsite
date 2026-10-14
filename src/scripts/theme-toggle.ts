// The site follows the system color setting until a visitor picks light or dark with the nav toggle.
const toggle = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
if (toggle) {
  const systemDark = matchMedia('(prefers-color-scheme: dark)');
  const current = () => document.documentElement.dataset.theme || (systemDark.matches ? 'dark' : 'light');
  const label = () => { toggle.setAttribute('aria-label', current() === 'dark' ? toggle.dataset.toLight! : toggle.dataset.toDark!); };
  toggle.addEventListener('click', () => {
    const next = current() === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch {}
    label();
    document.dispatchEvent(new CustomEvent('theme-change', { detail: { theme: next } }));
  });
  systemDark.addEventListener('change', () => { label(); document.dispatchEvent(new CustomEvent('theme-change', { detail: { theme: current() } })); });
  label();
}
