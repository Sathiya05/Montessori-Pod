(function(){
  const SESSION = window.LRAuth && window.LRAuth.getSession();
  function seed() {
    if (!localStorage.getItem('lr-logs')) {
      const logs = [
        { id: 1, date: '2026-03-20', title: 'Pouring Water Activity', area: 'Practical Life', notes: 'Practiced careful pouring between pitchers with focus.', participation: 'High', status: 'Completed' },
        { id: 2, date: '2026-03-20', title: 'Color Tablet Matching', area: 'Sensorial', notes: 'Matched primary and secondary colors confidently.', participation: 'High', status: 'Completed' },
        { id: 3, date: '2026-03-19', title: 'Sandpaper Letters: m, s, t', area: 'Language', notes: 'Traced letters and associated sounds with enthusiasm.', participation: 'Medium', status: 'In Progress' },
        { id: 4, date: '2026-03-18', title: 'Number Rods 1–5', area: 'Mathematics', notes: 'Counted and sequenced rods accurately with light guidance.', participation: 'High', status: 'Completed' },
        { id: 5, date: '2026-03-17', title: 'Garden Nature Walk', area: 'Outdoor Activities', notes: 'Observed leaves and insects, shared observations with peers.', participation: 'High', status: 'Completed' },
        { id: 6, date: '2026-03-16', title: 'Button Frame Practice', area: 'Practical Life', notes: 'Developing fine motor control and independence.', participation: 'Medium', status: 'In Progress' }
      ];
      localStorage.setItem('lr-logs', JSON.stringify(logs));
    }
    if (!localStorage.getItem('lr-reports')) {
      const reports = [
        { id: 1, date: '2026-03-15', teacher: 'Ms. Elena Morris', period: 'March 1 – March 15, 2026', progress: 'Aarav is showing strong concentration during the morning work cycle and chooses practical life activities independently.', strengths: 'Independence, fine motor skills, kindness toward peers', encourage: 'Building confidence in group language activities', feedback: 'Aarav is thriving in the prepared environment. Encourage him to share stories at home to further develop expressive language.' },
        { id: 2, date: '2026-02-28', teacher: 'Ms. Elena Morris', period: 'February 2026', progress: 'Steady growth in number recognition and sensorial discrimination. Shows curiosity during cultural lessons.', strengths: 'Curiosity, number sense, careful work habits', encourage: 'Phonetic sound blending and early writing', feedback: 'Continue reading together daily. Aarav enjoys counting objects in everyday routines, which beautifully supports his classroom learning.' }
      ];
      localStorage.setItem('lr-reports', JSON.stringify(reports));
    }
    if (!localStorage.getItem('lr-payments')) {
      const payments = [
        { month: 'March 2026', amount: 450, due: '2026-03-25', status: 'Pending', paidOn: '-' },
        { month: 'February 2026', amount: 450, due: '2026-02-25', status: 'Paid', paidOn: '2026-02-22' },
        { month: 'January 2026', amount: 450, due: '2026-01-25', status: 'Paid', paidOn: '2026-01-23' }
      ];
      localStorage.setItem('lr-payments', JSON.stringify(payments));
    }
    if (!localStorage.getItem('lr-notifications')) {
      const notifs = [
        { id: 1, type: 'Announcement', title: 'Spring Nature Walk', text: 'We will have a guided nature walk on March 24. Please send a hat and water bottle.', time: 'Today', read: false },
        { id: 2, type: 'Tuition', title: 'Tuition Reminder', text: 'March tuition is due on March 25. You can review details in Tuition & Payments.', time: 'Yesterday', read: false },
        { id: 3, type: 'Teacher', title: 'New Learning Log Added', text: 'Ms. Elena added a new practical life activity log for Aarav.', time: 'Mar 20', read: true },
        { id: 4, type: 'Event', title: 'Parent-Teacher Conferences', text: 'Conference sign-ups open next week. Watch for available time slots.', time: 'Mar 18', read: true }
      ];
      localStorage.setItem('lr-notifications', JSON.stringify(notifs));
    }
  }

  function get(k){ try { return JSON.parse(localStorage.getItem(k)) || []; } catch(e){ return []; } }
  function set(k,v){ localStorage.setItem(k, JSON.stringify(v)); }

  function renderLogs(){
    const list = document.getElementById('logs-list'); if (!list) return;
    const date = document.getElementById('log-date').value;
    const area = document.getElementById('log-area').value;
    let logs = get('lr-logs');
    if (date) logs = logs.filter(l => l.date === date);
    if (area) logs = logs.filter(l => l.area === area);
    if (!logs.length) { list.innerHTML = `<div class="card p-6 text-sm md:col-span-2">No learning logs match your filters.</div>`; return; }
    list.innerHTML = logs.map(l => `
      <article class="card p-5">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <span class="text-xs font-semibold text-primary">${l.area}</span>
          <span class="text-xs text-body/70 dark:text-dark-muted">${l.date}</span>
        </div>
        <h3 class="mt-2 font-semibold text-heading dark:text-dark-text">${l.title}</h3>
        <p class="mt-2 text-sm">${l.notes}</p>
        <div class="mt-3 flex flex-wrap gap-2 text-xs">
          <span class="rounded-full bg-surface px-2.5 py-1 dark:bg-dark-surface">Participation: <strong>${l.participation}</strong></span>
          <span class="rounded-full ${l.status==='Completed'?'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-200':'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-200'} px-2.5 py-1 font-semibold">${l.status}</span>
        </div>
      </article>`).join('');
  }

  function renderReports(){
    const list = document.getElementById('reports-list'); if (!list) return;
    const reports = get('lr-reports');
    list.innerHTML = reports.map(r => `
      <article class="card p-5">
        <div class="flex items-start justify-between gap-3"><div><div class="text-xs text-primary font-semibold">${r.date}</div><h3 class="mt-1 font-semibold text-heading dark:text-dark-text">${r.period}</h3><p class="text-sm">Teacher: ${r.teacher}</p></div><i data-lucide="file-badge" class="h-5 w-5 text-secondary"></i></div>
        <p class="mt-3 text-sm">${r.progress}</p>
        <button class="mt-4 btn-secondary view-report" data-id="${r.id}">View Report</button>
      </article>`).join('');
    if (window.lucide) window.lucide.createIcons();
    list.querySelectorAll('.view-report').forEach(btn => btn.addEventListener('click', () => openReport(Number(btn.dataset.id))));
  }

  function openReport(id){
    const r = get('lr-reports').find(x => x.id === id); if (!r) return;
    document.getElementById('modal-title').textContent = 'Teacher Report';
    document.getElementById('modal-meta').textContent = `${r.period} · ${r.teacher}`;
    document.getElementById('modal-body').innerHTML = `
      <div><span class="font-semibold text-heading dark:text-dark-text">Learning Progress:</span> <p class="mt-1">${r.progress}</p></div>
      <div><span class="font-semibold text-heading dark:text-dark-text">Strengths:</span> <p class="mt-1">${r.strengths}</p></div>
      <div><span class="font-semibold text-heading dark:text-dark-text">Areas to Encourage:</span> <p class="mt-1">${r.encourage}</p></div>
      <div><span class="font-semibold text-heading dark:text-dark-text">Teacher Feedback:</span> <p class="mt-1">${r.feedback}</p></div>`;
    const modal = document.getElementById('report-modal');
    modal.classList.remove('hidden'); modal.classList.add('flex');
  }

  function renderPayments(){
    const payments = get('lr-payments');
    const pending = payments.filter(p => p.status === 'Pending').reduce((s,p)=>s+p.amount,0);
    const paid = payments.filter(p => p.status === 'Paid').reduce((s,p)=>s+p.amount,0);
    const due = (payments.find(p=>p.status==='Pending')||{}).due || '-';
    document.getElementById('tuition-stats').innerHTML = `
      <div class="card p-5"><div class="text-sm">Monthly Tuition</div><div class="mt-1 font-heading text-2xl text-heading dark:text-dark-text">$450</div></div>
      <div class="card p-5"><div class="text-sm">Payment Due Date</div><div class="mt-1 font-heading text-2xl text-heading dark:text-dark-text">${due}</div></div>
      <div class="card p-5"><div class="text-sm">Paid Amount</div><div class="mt-1 font-heading text-2xl text-primary">$${paid}</div></div>
      <div class="card p-5"><div class="text-sm">Pending Amount</div><div class="mt-1 font-heading text-2xl text-secondary">$${pending}</div></div>`;
    document.getElementById('payment-history').innerHTML = payments.map(p => `
      <tr><td class="py-2">${p.month}</td><td class="py-2">$${p.amount}</td><td class="py-2">${p.due}</td>
      <td class="py-2"><span class="rounded-full px-2 py-0.5 text-xs font-semibold ${p.status==='Paid'?'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-200':'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-200'}">${p.status}</span></td>
      <td class="py-2">${p.paidOn}</td></tr>`).join('');
    const pendingCount = payments.some(p=>p.status==='Pending');
    const btn = document.getElementById('pay-btn');
    btn.textContent = pendingCount ? 'Pay Tuition (Demo)' : 'All Paid (Demo)';
    btn.disabled = !pendingCount;
    btn.classList.toggle('opacity-60', !pendingCount);
    document.getElementById('stat-tuition').textContent = `$${pending}`;
  }

  function renderNotifications(){
    const notifs = get('lr-notifications');
    const unread = notifs.filter(n=>!n.read).length;
    document.getElementById('stat-notifs').textContent = unread;
    const html = notifs.map(n => `
      <div class="card p-4 flex items-start justify-between gap-3 ${n.read?'opacity-80':''}">
        <div><div class="flex items-center gap-2 text-xs"><span class="rounded-full bg-primary/10 px-2 py-0.5 font-semibold text-primary">${n.type}</span><span class="text-body/70 dark:text-dark-muted">${n.time}</span>${n.read?'':'<span class="h-2 w-2 rounded-full bg-secondary inline-block"></span>'}</div>
        <h3 class="mt-1 font-semibold text-heading dark:text-dark-text">${n.title}</h3><p class="text-sm mt-1">${n.text}</p></div>
        <button class="btn-secondary text-xs mark-read" data-id="${n.id}" ${n.read?'disabled':''}>${n.read?'Read':'Mark read'}</button>
      </div>`).join('');
    document.getElementById('notifications-list').innerHTML = html;
    document.getElementById('overview-notifs').innerHTML = notifs.slice(0,3).map(n=>`<li class="flex gap-2"><span class="mt-1 h-2 w-2 rounded-full ${n.read?'bg-border':'bg-secondary'}"></span><span><span class="font-medium text-heading dark:text-dark-text">${n.title}</span><span class="block text-xs">${n.time}</span></span></li>`).join('');
    document.querySelectorAll('.mark-read').forEach(b => b.addEventListener('click', () => {
      const arr = get('lr-notifications'); const item = arr.find(x=>x.id===Number(b.dataset.id)); if(item){item.read=true; set('lr-notifications',arr); renderNotifications();}
    }));
  }

  function initDashboard(){
    if (!window.LRAuth || !window.LRAuth.requireRole('parent')) return;
    seed();
    const s = window.LRAuth.getSession();
    document.getElementById('session-name').textContent = s.name || 'Parent';
    document.getElementById('welcome-name').textContent = (s.name||'Parent').split("'")[0] || 'Parent';
    document.getElementById('settings-email').textContent = s.email || '';
    document.getElementById('today-label').textContent = new Date().toLocaleDateString(undefined,{weekday:'long', year:'numeric', month:'long', day:'numeric'});

    renderLogs(); renderReports(); renderPayments(); renderNotifications();
    document.getElementById('stat-activities').textContent = get('lr-logs').filter(l=>l.status==='Completed').length;

    document.getElementById('log-date').addEventListener('change', renderLogs);
    document.getElementById('log-area').addEventListener('change', renderLogs);
    document.getElementById('log-reset').addEventListener('click', ()=>{document.getElementById('log-date').value='';document.getElementById('log-area').value='';renderLogs();});

    document.getElementById('pay-btn').addEventListener('click', () => {
      const arr = get('lr-payments');
      const pending = arr.find(p => p.status === 'Pending');
      if (pending) { pending.status = 'Paid'; pending.paidOn = new Date().toISOString().slice(0,10); set('lr-payments', arr); renderPayments(); }
    });

    document.getElementById('mark-all-read').addEventListener('click', () => {
      const arr = get('lr-notifications').map(n=>({...n, read:true})); set('lr-notifications', arr); renderNotifications();
    });

    // modal
    const modal = document.getElementById('report-modal');
    const close = () => { modal.classList.add('hidden'); modal.classList.remove('flex'); };
    document.getElementById('modal-close').addEventListener('click', close);
    modal.addEventListener('click', (e)=>{ if(e.target===modal) close(); });

    // Sidebar, section switching, and logout are handled by js/dashboard-shell.js
    document.getElementById('settings-theme').addEventListener('click', ()=>window.LRTheme.toggle());
    document.getElementById('settings-rtl').addEventListener('click', ()=>window.LRDir.toggle());
    if (window.lucide) window.lucide.createIcons();
  }
  document.addEventListener('DOMContentLoaded', initDashboard);
})();
