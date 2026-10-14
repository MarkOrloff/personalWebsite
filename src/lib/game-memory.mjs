// Game answers last for the browser tab's session, so moving around a page or reloading it keeps them.
// Storage can be unavailable (private windows, blocked site data); the games then simply start fresh.
const prefix = 'game:';
export function recall(key, valid) {
  try {
    const value = JSON.parse(sessionStorage.getItem(prefix + key) ?? 'null');
    return value !== null && valid(value) ? value : null;
  } catch { return null; }
}
export function remember(key, value) {
  try { sessionStorage.setItem(prefix + key, JSON.stringify(value)); } catch {}
}
