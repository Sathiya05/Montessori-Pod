(function () {
  const STORAGE_KEY = 'lr-dir';
  function applyDir(dir) {
    const isRtl = dir === 'rtl';
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = isRtl ? 'ar' : 'en';
    document.querySelectorAll('[data-dir-icon]').forEach((el) => {
      el.setAttribute('data-lucide', 'arrow-left-right');
    });
    if (window.lucide) window.lucide.createIcons();
  }
  function getPreferred() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'rtl' ? 'rtl' : 'ltr';
  }
  function setDir(dir) {
    localStorage.setItem(STORAGE_KEY, dir);
    applyDir(dir);
  }
  function toggleDir() {
    const next = document.documentElement.dir === 'rtl' ? 'ltr' : 'rtl';
    setDir(next);
  }
  window.LRDir = { init: () => applyDir(getPreferred()), toggle: toggleDir, apply: applyDir };
  applyDir(getPreferred());
})();
