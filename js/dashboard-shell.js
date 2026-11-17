(function () {
  let sidebar = null;
  let overlay = null;
  let openButtons = [];
  let closeButtons = [];

  function currentRole() {
    const m = window.location.pathname.match(/\/dashboard\/(parent|admin)-dashboard\.html$/i);
    return m ? m[1].toLowerCase() : 'parent';
  }

  function currentSession() {
    const s = window.LRAuth ? window.LRAuth.getSession() : null;
    if (s) return s;
    const users = window.LRAuth ? window.LRAuth.demoUsers : null;
    if (users && users[currentRole()]) return users[currentRole()];
    return { role: currentRole(), name: 'Demo User', email: 'demo@littleroots.demo' };
  }

  function initials(name) {
    const parts = String(name || '')
      .replace(/'s\b/gi, '')
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2);
    return parts.map((w) => w.charAt(0).toUpperCase()).join('') || 'LR';
  }

  function openDrawer() {
    if (!sidebar || !overlay) return;
    sidebar.classList.remove('-translate-x-full', 'rtl:translate-x-full');
    sidebar.classList.add('translate-x-0');
    overlay.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
    openButtons.forEach((b) => b.setAttribute('aria-expanded', 'true'));
  }

  function closeDrawer() {
    if (!sidebar || !overlay) return;
    sidebar.classList.add('-translate-x-full', 'rtl:translate-x-full');
    sidebar.classList.remove('translate-x-0');
    overlay.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
    openButtons.forEach((b) => b.setAttribute('aria-expanded', 'false'));
  }

  function initSidebar() {
    sidebar = document.querySelector('[data-dash-sidebar]');
    overlay = document.querySelector('[data-dash-overlay]');
    openButtons = Array.from(document.querySelectorAll('[data-dash-open]'));
    closeButtons = Array.from(document.querySelectorAll('[data-dash-close]'));
    if (!sidebar || !overlay) return;

    openButtons.forEach((b) => {
      b.addEventListener('click', (e) => {
        e.preventDefault();
        openDrawer();
      });
    });
    closeButtons.forEach((b) => b.addEventListener('click', closeDrawer));
    overlay.addEventListener('click', closeDrawer);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeDrawer();
    });
  }

  function initProfile() {
    const session = currentSession();
    const name = session.name || 'Demo User';
    const email = session.email || '';
    const roleLabel = session.role === 'admin' ? 'Administrator' : 'Parent';

    document.querySelectorAll('[data-profile-name]').forEach((el) => { el.textContent = name; });
    document.querySelectorAll('[data-profile-email]').forEach((el) => { el.textContent = email; });
    document.querySelectorAll('[data-profile-role]').forEach((el) => { el.textContent = roleLabel; });
    document.querySelectorAll('[data-profile-initials]').forEach((el) => { el.textContent = initials(name); });

    const toggle = document.querySelector('[data-profile-toggle]');
    const panel = document.querySelector('[data-profile-panel]');
    if (!toggle || !panel) return;

    const hide = () => {
      panel.classList.add('hidden');
      toggle.setAttribute('aria-expanded', 'false');
    };

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = panel.classList.contains('hidden');
      panel.classList.toggle('hidden', !isHidden);
      toggle.setAttribute('aria-expanded', String(isHidden));
    });
    document.addEventListener('click', (e) => {
      if (!panel.contains(e.target) && !toggle.contains(e.target)) hide();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') hide();
    });
    panel.querySelectorAll('a, button').forEach((el) => el.addEventListener('click', hide));
  }

  function initPreferences() {
    document.querySelectorAll('[data-dash-theme]').forEach((btn) => {
      btn.addEventListener('click', () => { if (window.LRTheme) window.LRTheme.toggle(); });
    });
    document.querySelectorAll('[data-dash-rtl]').forEach((btn) => {
      btn.addEventListener('click', () => { if (window.LRDir) window.LRDir.toggle(); });
    });
    document.querySelectorAll('[data-dash-logout]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (window.LRAuth) window.LRAuth.logout();
        window.location.href = '../login.html';
      });
    });
    document.querySelectorAll('[data-dash-reset]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (!window.confirm('Reset all demo data? Theme and direction preferences will be kept.')) return;
        Object.keys(localStorage)
          .filter((k) => k.indexOf('lr-') === 0 && k !== 'lr-theme' && k !== 'lr-dir')
          .forEach((k) => localStorage.removeItem(k));
        window.location.reload();
      });
    });
  }

  function initSections() {
    const sections = Array.from(document.querySelectorAll('.dash-section'));
    if (!sections.length) return;

    const links = Array.from(document.querySelectorAll('.dash-link'));
    const gotoLinks = Array.from(document.querySelectorAll('[data-dash-goto]'));
    const ids = sections.map((s) => s.id);
    let current = null;

    function setActive(id, updateHash) {
      if (ids.indexOf(id) === -1) id = sections[0].id;
      const changed = current !== id;
      current = id;

      sections.forEach((sec) => sec.classList.toggle('hidden', sec.id !== id));

      links.forEach((link) => {
        const isActive = link.getAttribute('href') === '#' + id;
        link.classList.toggle('bg-primary/10', isActive);
        link.classList.toggle('text-primary', isActive);
        link.classList.toggle('font-semibold', isActive);
        if (isActive) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
      });

      if (updateHash && window.location.hash !== '#' + id) {
        try { window.history.replaceState(null, '', '#' + id); }
        catch (e) { window.location.hash = id; }
      }
      closeDrawer();
      if (changed) window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function handleClick(e) {
      const target = this.getAttribute('href') || this.getAttribute('data-dash-goto') || '';
      if (target.charAt(0) !== '#') return;
      e.preventDefault();
      setActive(target.slice(1), true);
    }

    links.forEach((link) => link.addEventListener('click', handleClick));
    gotoLinks.forEach((link) => link.addEventListener('click', handleClick));

    window.addEventListener('hashchange', () => {
      setActive((window.location.hash || '').replace('#', '') || sections[0].id, false);
    });

    const start = (window.location.hash || '').replace('#', '');
    setActive(ids.indexOf(start) !== -1 ? start : sections[0].id, false);
  }

  function initResponsiveTables() {
    if (!window.MutationObserver) return;
    document.querySelectorAll('table.responsive-table').forEach((table) => {
      const applyLabels = () => {
        const headers = Array.from(table.querySelectorAll('thead th'))
          .map((th) => th.textContent.replace(/\s+/g, ' ').trim());
        table.querySelectorAll('tbody tr').forEach((row) => {
          Array.from(row.children).forEach((cell, index) => {
            if (headers[index]) cell.setAttribute('data-label', headers[index]);
          });
        });
      };
      applyLabels();
      new MutationObserver(applyLabels).observe(table, { childList: true, subtree: true });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initSidebar();
    initProfile();
    initPreferences();
    initSections();
    initResponsiveTables();
    if (window.lucide) window.lucide.createIcons();
  });
})();
