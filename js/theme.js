(function () {
  const STORAGE_KEY = 'lr-theme';
  function applyTheme(theme) {
    const isDark = theme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
    document.querySelectorAll('[data-theme-icon]').forEach((el) => {
      el.setAttribute('data-lucide', isDark ? 'moon' : 'sun');
    });
    if (window.lucide) window.lucide.createIcons();
  }
  function getPreferred() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function setTheme(theme) {
    localStorage.setItem(STORAGE_KEY, theme);
    applyTheme(theme);
  }
  function toggleTheme() {
    const next = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
    setTheme(next);
  }
  window.LRTheme = { init: () => applyTheme(getPreferred()), toggle: toggleTheme, apply: applyTheme };
  // Apply early
  applyTheme(getPreferred());
})();
