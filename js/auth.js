(function(){
  // Frontend demo auth only. DO NOT use as secure production authentication.
  // Real implementation must connect to a backend with proper authentication,
  // password hashing, sessions/JWTs, CSRF protection, and role-based authorization.
  const DEMO_USERS = {
    parent: { email: 'parent@littleroots.demo', password: 'Parent@123', role: 'parent', name: 'Aarav\'s Parent' },
    admin: { email: 'admin@littleroots.demo', password: 'Admin@123', role: 'admin', name: 'School Admin' }
  };
  const SESSION_KEY = 'lr-session';

  function makeSession(user, demo){
    return { role: user.role, name: user.name, email: user.email, ts: Date.now(), demo: !!demo };
  }

  function getStoredSession(){
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const s = JSON.parse(raw);
      if (!s || typeof s !== 'object' || !s.role) return null;
      return s;
    } catch(e){ return null; }
  }

  function setSession(user, remember, demo){
    const session = makeSession(user, demo);
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    if (remember) localStorage.setItem('lr-remember', '1'); else localStorage.removeItem('lr-remember');
    return session;
  }

  window.LRAuth = {
    demoUsers: DEMO_USERS,
    getSession: getStoredSession,
    logout: () => { localStorage.removeItem(SESSION_KEY); },
    // Demo site: dashboards are linked publicly from the navbar, so a missing
    // (or mismatched) session must not bounce the visitor back to login.
    // Instead, open the requested dashboard with the matching demo account.
    // A real backend must replace this with a server-side auth check.
    requireRole: (role) => {
      const expectedRole = DEMO_USERS[role] ? role : 'parent';
      const session = getStoredSession();
      if (session && session.role === expectedRole) return session;
      return setSession(DEMO_USERS[expectedRole], false, true);
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    if (!form) return;
    const alertBox = document.getElementById('login-alert');
    const email = document.getElementById('login-email');
    const pass = document.getElementById('login-password');
    const roleSel = document.getElementById('role');
    const toggle = document.getElementById('toggle-password');
    const forgot = document.getElementById('forgot-btn');
    const remember = document.getElementById('remember');

    // Prefill from the current (or remembered) role/preference
    if (localStorage.getItem('lr-remember')) remember.checked = true;
    const existing = getStoredSession();
    if (existing && DEMO_USERS[existing.role]) roleSel.value = existing.role;

    toggle.addEventListener('click', () => {
      const show = pass.type === 'password';
      pass.type = show ? 'text' : 'password';
      toggle.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
      toggle.innerHTML = `<i data-lucide="${show ? 'eye-off':'eye'}" class="h-5 w-5"></i>`;
      if (window.lucide) window.lucide.createIcons();
    });

    roleSel.addEventListener('change', () => {
      const u = DEMO_USERS[roleSel.value];
      email.value = u.email; pass.value = u.password;
    });
    // init default from the selected role
    email.value = DEMO_USERS[roleSel.value].email;
    pass.value = DEMO_USERS[roleSel.value].password;

    forgot.addEventListener('click', () => {
      alertBox.className = 'rounded-xl p-3 text-sm bg-blue-50 text-blue-800 dark:bg-blue-500/15 dark:text-blue-200';
      alertBox.textContent = 'Demo: Password reset is not configured. In production, connect this to a secure backend reset flow.';
      alertBox.classList.remove('hidden');
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const u = DEMO_USERS[roleSel.value];
      if (email.value.trim().toLowerCase() === u.email && pass.value === u.password) {
        setSession(u, remember.checked, false);
        const next = new URLSearchParams(window.location.search).get('next');
        const fallback = u.role === 'admin' ? 'dashboard/admin-dashboard.html' : 'dashboard/parent-dashboard.html';
        // Only follow same-site dashboard targets to avoid open redirects.
        const target = next && /^dashboard\/[a-z-]+\.html$/i.test(next) ? next : fallback;
        window.location.href = target;
      } else {
        alertBox.className = 'rounded-xl p-3 text-sm bg-red-50 text-red-800 dark:bg-red-500/15 dark:text-red-200';
        alertBox.textContent = 'Invalid credentials for the selected role. Please use the demo credentials shown below.';
        alertBox.classList.remove('hidden');
      }
    });
  });
})();
