(function () {
  function basePath() {
    return window.location.pathname.includes('/dashboard/') ? '../' : '';
  }
  const ACTIVE_NAV = 'bg-primary/10 font-semibold text-primary dark:bg-white/10 dark:text-dark-accent';
  const IDLE_NAV = 'text-heading/80 hover:bg-surface hover:text-primary dark:text-dark-text/90 dark:hover:bg-dark-surface dark:hover:text-dark-accent';
  const ACTIVE_SUB = 'bg-primary/10 font-semibold text-primary dark:bg-white/10 dark:text-dark-accent';
  const IDLE_SUB = 'text-heading hover:bg-surface dark:text-dark-text dark:hover:bg-dark-surface';
  const ACTIVE_MOBILE = 'border-primary/40 bg-primary/10 font-semibold text-primary dark:border-white/20 dark:bg-white/10 dark:text-dark-accent';
  const IDLE_MOBILE = 'border-border text-heading hover:bg-surface dark:border-white/10 dark:text-dark-text dark:hover:bg-dark-surface';

  function currentFile() {
    const parts = window.location.pathname.split('/').filter(Boolean);
    return (parts[parts.length - 1] || 'index.html').toLowerCase();
  }
  function isActive(href) {
    const file = String(href).split('#')[0].split('/').pop().toLowerCase();
    return currentFile() === file;
  }
  function isHomePage() { return ['index.html', 'home2.html'].indexOf(currentFile()) !== -1; }
  function isDashboardPage() { return /\/dashboard\/(parent|admin)-dashboard\.html$/i.test(window.location.pathname); }
  function currentAttr(active) { return active ? ' aria-current="page"' : ''; }
  function navItem(link, label) {
    const active = isActive(link);
    return `<a href="${basePath()}${link}" class="nav-link rounded-lg px-3 py-2 transition ${active ? ACTIVE_NAV : IDLE_NAV}"${currentAttr(active)}>${label}</a>`;
  }
  function subLink(link, label, active) {
    return `<a href="${basePath()}${link}" class="mobile-link block rounded-lg px-3 py-2 transition ${active ? ACTIVE_SUB : IDLE_SUB}"${currentAttr(active)}>${label}</a>`;
  }
  function mobileLink(link, label, active) {
    return `<a href="${basePath()}${link}" class="mobile-link block rounded-xl border px-4 py-3 transition ${active ? ACTIVE_MOBILE : IDLE_MOBILE}"${currentAttr(active)}>${label}</a>`;
  }
  function desktopDropdownBtn(key, label, active) {
    return `<button class="inline-flex items-center gap-1 rounded-lg px-3 py-2 transition ${active ? ACTIVE_NAV : IDLE_NAV}" data-desktop-dropdown="${key}" aria-expanded="false" aria-haspopup="true">${label} <i data-lucide="chevron-down" class="h-4 w-4"></i></button>`;
  }
  function mobileDropdownBtn(key, label, active) {
    return `<button class="flex w-full items-center justify-between rounded-lg px-2 py-2 font-medium transition ${active ? 'bg-primary/10 text-primary dark:bg-white/10 dark:text-dark-accent' : 'text-heading dark:text-dark-text'}" data-mobile-dropdown="${key}">${label} <i data-lucide="chevron-down" class="h-4 w-4"></i></button>`;
  }
  function injectNavbar() {
    const mount = document.getElementById('navbar');
    if (!mount) return;
    const b = basePath();
    const pathMatch = window.location.pathname.match(/\/dashboard\/(parent|admin)-dashboard\.html$/i);
    const pathRole = pathMatch ? pathMatch[1].toLowerCase() : null;
    let session = window.LRAuth ? window.LRAuth.getSession() : null;
    // On a dashboard page the demo session is created by the dashboard script;
    // infer the role here so the navbar label is correct on first visit.
    if (!session && pathRole) session = { role: pathRole };
    const activeRole = pathRole || (session ? session.role : null);
    const dashboardHref = session
      ? `${b}dashboard/${activeRole === 'admin' ? 'admin' : 'parent'}-dashboard.html`
      : `${b}login.html`;
    const accountAction = session
      ? `<a href="${dashboardHref}" class="btn-secondary"><i data-lucide="layout-dashboard" class="h-4 w-4"></i> My Dashboard</a>`
      : `<a href="${b}login.html" class="btn-secondary"> Login</a>`;
    mount.classList.add('sticky', 'top-0', 'z-50', 'w-full');
    mount.innerHTML = `
<header class="w-full border-b border-border/70 bg-bg/95 backdrop-blur supports-[backdrop-filter]:bg-bg/80 dark:border-white/10 dark:bg-dark-bg/95">
  <nav class="container-wrap flex h-20 items-center justify-between gap-4" aria-label="Primary">
    <a href="${b}index.html" class="flex shrink-0 items-center gap-2">
      <img src="${b}images/logo/logo.svg" alt="Little Roots Montessori logo" class="h-10 w-10 rounded-xl"/>
      <div class="leading-tight">
        <div class="whitespace-nowrap font-heading text-xl text-heading dark:text-dark-text">Montessori Pod</div>
        <div class="whitespace-nowrap text-xs text-body dark:text-dark-muted">Growing Curious Minds</div>
      </div>
    </a>

    <div class="hidden items-center gap-4 xl:flex" id="desktop-nav">
      <div class="relative" data-desktop-wrap="home">
        ${desktopDropdownBtn('home', 'Home', isHomePage())}
        <div class="invisible absolute start-0 mt-3 w-44 rounded-xl border border-border bg-white p-2 opacity-0 shadow-soft transition dark:border-white/10 dark:bg-dark-card" data-dropdown-panel="home">
          ${subLink('index.html', 'Home 1', isActive('index.html'))}
          ${subLink('home2.html', 'Home 2', isActive('home2.html'))}
        </div>
      </div>
      ${navItem('about.html','About')}
      ${navItem('programs.html','Programs')}
      ${navItem('curriculum.html','Curriculum')}
      <div class="relative" data-desktop-wrap="dashboard">
        ${desktopDropdownBtn('dashboard', 'Dashboard', isDashboardPage())}
        <div class="invisible absolute start-0 mt-3 w-56 rounded-xl border border-border bg-white p-2 opacity-0 shadow-soft transition dark:border-white/10 dark:bg-dark-card" data-dropdown-panel="dashboard">
          ${subLink('dashboard/parent-dashboard.html', 'User Dashboard (Parent)', isActive('parent-dashboard.html'))}
          ${subLink('dashboard/admin-dashboard.html', 'Admin Dashboard', isActive('admin-dashboard.html'))}
        </div>
      </div>
      ${navItem('contact.html','Contact')}
    </div>

    <div class="hidden items-center gap-2 xl:flex" id="desktop-actions">
      <button id="theme-toggle" class="rounded-full border border-border p-2 text-heading hover:bg-surface dark:border-white/10 dark:text-dark-text dark:hover:bg-dark-surface" aria-label="Toggle theme"><i data-theme-icon data-lucide="sun" class="h-5 w-5"></i></button>
      <button id="rtl-toggle" class="rounded-full border border-border p-2 text-heading hover:bg-surface dark:border-white/10 dark:text-dark-text dark:hover:bg-dark-surface" aria-label="Toggle direction"><i data-dir-icon data-lucide="arrow-left-right" class="h-5 w-5"></i></button>
      ${accountAction}
      <a href="${b}contact.html#visit" class="btn-primary">Schedule a Visit</a>
    </div>

    <button id="menu-toggle" class="inline-flex items-center justify-center rounded-xl border border-border p-2 text-heading xl:hidden dark:border-white/10 dark:text-dark-text" aria-expanded="false" aria-controls="mobile-menu" aria-label="Open menu">
      <i data-lucide="menu" class="h-6 w-6"></i>
    </button>
  </nav>

  <div id="mobile-menu" class="hidden border-t border-border bg-bg/98 xl:hidden dark:border-white/10 dark:bg-dark-bg">
    <div class="container-wrap space-y-3 py-4 text-heading dark:text-dark-text">
      <div class="rounded-xl border border-border p-2 dark:border-white/10">
        ${mobileDropdownBtn('home', 'Home', isHomePage())}
        <div class="hidden space-y-1 ps-3 pb-1" data-mobile-panel="home">
          ${subLink('index.html', 'Home 1', isActive('index.html'))}
          ${subLink('home2.html', 'Home 2', isActive('home2.html'))}
        </div>
      </div>
      ${mobileLink('about.html', 'About', isActive('about.html'))}
      ${mobileLink('programs.html', 'Programs', isActive('programs.html'))}
      ${mobileLink('curriculum.html', 'Curriculum', isActive('curriculum.html'))}
      <div class="rounded-xl border border-border p-2 dark:border-white/10">
        ${mobileDropdownBtn('dashboard', 'Dashboard', isDashboardPage())}
        <div class="hidden space-y-1 ps-3 pb-1" data-mobile-panel="dashboard">
          ${subLink('dashboard/parent-dashboard.html', 'User Dashboard (Parent)', isActive('parent-dashboard.html'))}
          ${subLink('dashboard/admin-dashboard.html', 'Admin Dashboard', isActive('admin-dashboard.html'))}
        </div>
      </div>
      ${mobileLink('contact.html', 'Contact', isActive('contact.html'))}
      <div class="flex gap-2 pt-1">
        <button id="theme-toggle-mobile" class="flex-1 rounded-xl border border-border px-4 py-3 text-start text-heading dark:border-white/10 dark:text-dark-text"><span class="inline-flex items-center gap-2"><i data-theme-icon data-lucide="sun" class="h-5 w-5"></i>Theme</span></button>
        <button id="rtl-toggle-mobile" class="flex-1 rounded-xl border border-border px-4 py-3 text-start text-heading dark:border-white/10 dark:text-dark-text"><span class="inline-flex items-center gap-2"><i data-dir-icon data-lucide="arrow-left-right" class="h-5 w-5"></i>Direction</span></button>
      </div>
      ${accountAction.replace('btn-secondary', 'mobile-link btn-secondary w-full')}
      <a href="${b}contact.html#visit" class="mobile-link btn-primary w-full">Schedule a Visit</a>
    </div>
  </div>
</header>`;

    if (window.lucide) window.lucide.createIcons();

    // Reveal the group containing the current page so its active item is visible.
    const activeGroup = isHomePage() ? 'home' : (isDashboardPage() ? 'dashboard' : null);
    if (activeGroup) {
      const panel = document.querySelector(`[data-mobile-panel="${activeGroup}"]`);
      if (panel) panel.classList.remove('hidden');
    }

    const menuBtn = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    function closeMenu() {
      mobileMenu.classList.add('hidden');
      menuBtn.setAttribute('aria-expanded', 'false');
    }

    // Desktop dropdowns (click-toggle, stable; no sudden close)
    const desktopToggles = document.querySelectorAll('[data-desktop-dropdown]');
    function setDesktopDropdown(key, open) {
      const btn = document.querySelector(`[data-desktop-dropdown="${key}"]`);
      const panel = document.querySelector(`[data-dropdown-panel="${key}"]`);
      if (!btn || !panel) return;
      btn.setAttribute('aria-expanded', String(open));
      panel.classList.toggle('invisible', !open);
      panel.classList.toggle('opacity-0', !open);
      panel.classList.toggle('visible', open);
      panel.classList.toggle('opacity-100', open);
    }
    function closeDesktopDropdowns(exceptKey = null) {
      desktopToggles.forEach((btn) => {
        const key = btn.getAttribute('data-desktop-dropdown');
        if (key !== exceptKey) setDesktopDropdown(key, false);
      });
    }
    desktopToggles.forEach((btn) => {
      const key = btn.getAttribute('data-desktop-dropdown');
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = btn.getAttribute('aria-expanded') === 'true';
        closeDesktopDropdowns(key);
        setDesktopDropdown(key, !isOpen);
      });
    });
    document.querySelectorAll('[data-dropdown-panel] a').forEach((link) => {
      link.addEventListener('click', () => closeDesktopDropdowns());
    });

    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeDesktopDropdowns();
      const open = mobileMenu.classList.contains('hidden');
      mobileMenu.classList.toggle('hidden', !open);
      menuBtn.setAttribute('aria-expanded', String(open));
    });
    document.querySelectorAll('[data-mobile-dropdown]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const key = btn.getAttribute('data-mobile-dropdown');
        const panel = document.querySelector(`[data-mobile-panel="${key}"]`);
        if (panel) panel.classList.toggle('hidden');
      });
    });
    document.addEventListener('click', (e) => {
      if (!mobileMenu.classList.contains('hidden') && !mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) closeMenu();
      if (!e.target.closest('[data-desktop-wrap]')) closeDesktopDropdowns();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { closeMenu(); closeDesktopDropdowns(); }
    });
    document.querySelectorAll('.mobile-link').forEach((el) => el.addEventListener('click', closeMenu));

    ['theme-toggle','theme-toggle-mobile'].forEach(id => {
      const el = document.getElementById(id); if (el) el.addEventListener('click', () => window.LRTheme && window.LRTheme.toggle());
    });
    ['rtl-toggle','rtl-toggle-mobile'].forEach(id => {
      const el = document.getElementById(id); if (el) el.addEventListener('click', () => window.LRDir && window.LRDir.toggle());
    });
  }
  document.addEventListener('DOMContentLoaded', injectNavbar);
})();
