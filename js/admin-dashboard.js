(function(){
  function get(k, fb){ try { const v = JSON.parse(localStorage.getItem(k)); return v ?? fb; } catch(e){ return fb; } }
  function set(k,v){ localStorage.setItem(k, JSON.stringify(v)); }
  function uid(){ return Date.now() + Math.floor(Math.random()*1000); }

  function seed(){
    if (!localStorage.getItem('lr-students')) set('lr-students', [
      { id:1, name:'Aarav Mehta', parent:'Riya Mehta', age:4, program:'Primary Program', status:'Active' },
      { id:2, name:'Mia Chen', parent:'Lina Chen', age:2, program:'Toddler Program', status:'Active' },
      { id:3, name:'Noah Williams', parent:'Emma Williams', age:5, program:'Kindergarten Program', status:'Active' },
      { id:4, name:'Zara Khan', parent:'Omar Khan', age:3, program:'Primary Program', status:'Waitlist' }
    ]);
    if (!localStorage.getItem('lr-teachers')) set('lr-teachers', [
      { id:1, name:'Ms. Elena Morris', email:'elena@littleroots.demo', program:'Primary Program', students:12, status:'Active' },
      { id:2, name:'Ms. Priya Nair', email:'priya@littleroots.demo', program:'Toddler Program', students:8, status:'Active' },
      { id:3, name:'Mr. Daniel Lee', email:'daniel@littleroots.demo', program:'Kindergarten Program', students:10, status:'Active' }
    ]);
    if (!localStorage.getItem('lr-tuition-admin')) set('lr-tuition-admin', [
      { id:1, student:'Aarav Mehta', parent:'Riya Mehta', amount:450, due:'2026-03-25', status:'Pending' },
      { id:2, student:'Mia Chen', parent:'Lina Chen', amount:380, due:'2026-03-25', status:'Paid' },
      { id:3, student:'Noah Williams', parent:'Emma Williams', amount:480, due:'2026-03-25', status:'Pending' },
      { id:4, student:'Zara Khan', parent:'Omar Khan', amount:450, due:'2026-04-05', status:'Upcoming' }
    ]);
    if (!localStorage.getItem('lr-logs')) set('lr-logs', [
      { id: 1, date: '2026-03-20', title: 'Pouring Water Activity', area: 'Practical Life', notes: 'Practiced careful pouring between pitchers with focus.', participation: 'High', status: 'Completed', student:'Aarav Mehta' }
    ]);
    if (!localStorage.getItem('lr-reports')) set('lr-reports', [
      { id: 1, date: '2026-03-15', teacher: 'Ms. Elena Morris', period: 'March 1 – March 15, 2026', progress: 'Strong concentration during work cycle.', strengths: 'Independence, fine motor skills', encourage: 'Group language activities', feedback: 'Thriving in the prepared environment.', student:'Aarav Mehta', social:'Cooperative and kind with peers' }
    ]);
    if (!localStorage.getItem('lr-enquiries')) set('lr-enquiries', []);
  }

  function badge(status){
    const map = { Active:'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-200', Paid:'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-200', New:'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-200', Pending:'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-200', Waitlist:'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-200', Contacted:'bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-200', Scheduled:'bg-teal-100 text-teal-800 dark:bg-teal-500/20 dark:text-teal-200', Closed:'bg-gray-200 text-gray-800 dark:bg-white/10 dark:text-dark-text', Upcoming:'bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-200' };
    return `<span class="rounded-full px-2 py-0.5 text-xs font-semibold ${map[status]||'bg-surface'}">${status}</span>`;
  }

  function renderStats(){
    const students = get('lr-students',[]), teachers = get('lr-teachers',[]), enquiries = get('lr-enquiries',[]), tuition = get('lr-tuition-admin',[]);
    const pending = tuition.filter(t=>t.status==='Pending').reduce((s,t)=>s+t.amount,0);
    const cards = [
      ['Total Students', students.length, 'graduation-cap'], ['Total Parents', students.length, 'users'], ['Total Teachers', teachers.length, 'user-check'],
      ['Active Programs', 3, 'shapes'], ['Pending Tuition', `$${pending}`, 'wallet'], ['New Enquiries', enquiries.filter(e=>e.status==='New').length, 'mail']
    ];
    document.getElementById('admin-stats').innerHTML = cards.map(c=>`<div class="card p-5"><div class="flex items-center justify-between"><div class="text-sm">${c[0]}</div><i data-lucide="${c[2]}" class="h-5 w-5 text-primary"></i></div><div class="mt-2 font-heading text-3xl text-heading dark:text-dark-text">${c[1]}</div></div>`).join('');
    // simple charts
    const counts = { 'Toddler Program':0,'Primary Program':0,'Kindergarten Program':0 };
    students.forEach(s=>{ if(counts[s.program]!==undefined) counts[s.program]++; });
    const max = Math.max(1,...Object.values(counts));
    document.getElementById('program-chart').innerHTML = Object.entries(counts).map(([k,v])=>`<div><div class="mb-1 flex justify-between"><span>${k}</span><span>${v}</span></div><div class="h-2 rounded-full bg-surface dark:bg-dark-surface"><div class="h-2 rounded-full bg-primary" style="width:${(v/max)*100}%"></div></div></div>`).join('');
    const paid = tuition.filter(t=>t.status==='Paid').length, pend = tuition.filter(t=>t.status==='Pending').length, up = tuition.filter(t=>t.status==='Upcoming').length, tot = Math.max(1, tuition.length);
    document.getElementById('tuition-chart').innerHTML = [
      ['Paid', paid, 'bg-primary'], ['Pending', pend, 'bg-secondary'], ['Upcoming', up, 'bg-accent']
    ].map(r=>`<div><div class="mb-1 flex justify-between"><span>${r[0]}</span><span>${r[1]}</span></div><div class="h-2 rounded-full bg-surface dark:bg-dark-surface"><div class="h-2 rounded-full ${r[2]}" style="width:${(r[1]/tot)*100}%"></div></div></div>`).join('');
  }

  function renderParents(){
    const students = get('lr-students',[]);
    document.getElementById('parents-table').innerHTML = students.map(s=>`<tr><td class="py-2">${s.parent}</td><td class="py-2">${s.parent.toLowerCase().replace(/[^a-z]/g,'.')}@example.com</td><td class="py-2">+1 (555) 010-${String(100+s.id)}</td><td class="py-2">${s.name}</td><td class="py-2">${badge(s.status==='Waitlist'?'Pending': 'Active')}</td></tr>`).join('');
  }

  function renderStudents(){
    const q = (document.getElementById('student-search').value||'').toLowerCase();
    const f = document.getElementById('student-filter').value;
    let list = get('lr-students',[]);
    if (q) list = list.filter(s => (s.name+s.parent).toLowerCase().includes(q));
    if (f) list = list.filter(s => s.program === f);
    const tbody = document.getElementById('students-table');
    tbody.innerHTML = list.map(s=>`<tr><td class="py-2 font-medium">${s.name}</td><td class="py-2">${s.parent}</td><td class="py-2">${s.age}</td><td class="py-2">${s.program}</td><td class="py-2">${badge(s.status)}</td><td class="py-2"><div class="flex gap-2"><button class="text-primary edit-student" data-id="${s.id}">Edit</button><button class="text-red-600 del-student" data-id="${s.id}">Delete</button></div></td></tr>`).join('') || `<tr><td class="py-4" colspan="6">No students found.</td></tr>`;
    tbody.querySelectorAll('.edit-student').forEach(b=>b.addEventListener('click',()=>openStudentModal(Number(b.dataset.id))));
    tbody.querySelectorAll('.del-student').forEach(b=>b.addEventListener('click',()=>deleteStudent(Number(b.dataset.id))));
  }

  function openStudentModal(id){
    const list = get('lr-students',[]);
    const s = list.find(x=>x.id===id) || {name:'',parent:'',age:'',program:'Toddler Program',status:'Active'};
    showModal(id?'Edit Student':'Add Student', `
      <form id="student-form" class="space-y-3">
        <input class="w-full rounded-xl border border-border bg-bg px-3 py-2 dark:border-white/10 dark:bg-dark-bg" name="name" placeholder="Student name" value="${s.name}" required />
        <input class="w-full rounded-xl border border-border bg-bg px-3 py-2 dark:border-white/10 dark:bg-dark-bg" name="parent" placeholder="Parent name" value="${s.parent}" required />
        <input class="w-full rounded-xl border border-border bg-bg px-3 py-2 dark:border-white/10 dark:bg-dark-bg" name="age" type="number" min="1" max="6" placeholder="Age" value="${s.age}" required />
        <select class="w-full rounded-xl border border-border bg-bg px-3 py-2 dark:border-white/10 dark:bg-dark-bg" name="program"><option ${s.program==='Toddler Program'?'selected':''}>Toddler Program</option><option ${s.program==='Primary Program'?'selected':''}>Primary Program</option><option ${s.program==='Kindergarten Program'?'selected':''}>Kindergarten Program</option></select>
        <select class="w-full rounded-xl border border-border bg-bg px-3 py-2 dark:border-white/10 dark:bg-dark-bg" name="status"><option ${s.status==='Active'?'selected':''}>Active</option><option ${s.status==='Waitlist'?'selected':''}>Waitlist</option><option ${s.status==='Inactive'?'selected':''}>Inactive</option></select>
        <button class="btn-primary w-full" type="submit">Save Student</button>
      </form>`);
    document.getElementById('student-form').addEventListener('submit',(e)=>{
      e.preventDefault();
      const fd = Object.fromEntries(new FormData(e.target).entries());
      let arr = get('lr-students',[]);
      if (id) arr = arr.map(x=>x.id===id?{...x,...fd,age:Number(fd.age)}:x); else arr.unshift({id:uid(),...fd,age:Number(fd.age)});
      set('lr-students',arr); closeModal(); renderStudents(); renderStats(); renderParents(); renderAttendance(); populateStudentSelects(); renderProgramCards();
    });
  }
  function deleteStudent(id){
    if(!confirm('Delete this student? This action cannot be undone in the demo.')) return;
    set('lr-students', get('lr-students',[]).filter(s=>s.id!==id));
    renderStudents(); renderStats(); renderParents(); renderAttendance(); populateStudentSelects(); renderProgramCards();
  }

  function renderTeachers(){
    const tbody = document.getElementById('teachers-table');
    const list = get('lr-teachers',[]);
    tbody.innerHTML = list.map(t=>`<tr><td class="py-2 font-medium">${t.name}</td><td class="py-2">${t.email}</td><td class="py-2">${t.program}</td><td class="py-2">${t.students}</td><td class="py-2">${badge(t.status)}</td><td class="py-2"><div class="flex gap-2"><button class="text-primary edit-teacher" data-id="${t.id}">Edit</button><button class="text-red-600 del-teacher" data-id="${t.id}">Delete</button></div></td></tr>`).join('');
    tbody.querySelectorAll('.edit-teacher').forEach(b=>b.addEventListener('click',()=>openTeacherModal(Number(b.dataset.id))));
    tbody.querySelectorAll('.del-teacher').forEach(b=>b.addEventListener('click',()=>deleteTeacher(Number(b.dataset.id))));
  }
  function openTeacherModal(id){
    const list = get('lr-teachers',[]);
    const t = list.find(x=>x.id===id) || {name:'',email:'',program:'Primary Program',students:0,status:'Active'};
    showModal(id?'Edit Teacher':'Add Teacher', `
      <form id="teacher-form" class="space-y-3">
        <input class="w-full rounded-xl border border-border bg-bg px-3 py-2 dark:border-white/10 dark:bg-dark-bg" name="name" placeholder="Teacher name" value="${t.name}" required />
        <input class="w-full rounded-xl border border-border bg-bg px-3 py-2 dark:border-white/10 dark:bg-dark-bg" name="email" type="email" placeholder="Email" value="${t.email}" required />
        <select class="w-full rounded-xl border border-border bg-bg px-3 py-2 dark:border-white/10 dark:bg-dark-bg" name="program"><option ${t.program==='Toddler Program'?'selected':''}>Toddler Program</option><option ${t.program==='Primary Program'?'selected':''}>Primary Program</option><option ${t.program==='Kindergarten Program'?'selected':''}>Kindergarten Program</option></select>
        <input class="w-full rounded-xl border border-border bg-bg px-3 py-2 dark:border-white/10 dark:bg-dark-bg" name="students" type="number" min="0" placeholder="Number of students" value="${t.students}" required />
        <select class="w-full rounded-xl border border-border bg-bg px-3 py-2 dark:border-white/10 dark:bg-dark-bg" name="status"><option ${t.status==='Active'?'selected':''}>Active</option><option ${t.status==='On Leave'?'selected':''}>On Leave</option></select>
        <button class="btn-primary w-full" type="submit">Save Teacher</button>
      </form>`);
    document.getElementById('teacher-form').addEventListener('submit',(e)=>{
      e.preventDefault();
      const fd = Object.fromEntries(new FormData(e.target).entries()); fd.students = Number(fd.students);
      let arr = get('lr-teachers',[]);
      if (id) arr = arr.map(x=>x.id===id?{...x,...fd}:x); else arr.unshift({id:uid(),...fd});
      set('lr-teachers',arr); closeModal(); renderTeachers(); renderStats();
    });
  }
  function deleteTeacher(id){
    if(!confirm('Delete this teacher?')) return;
    set('lr-teachers', get('lr-teachers',[]).filter(t=>t.id!==id));
    renderTeachers(); renderStats();
  }

  function renderProgramCards(){
    const students = get('lr-students',[]);
    const defs = [
      {name:'Toddler Program', age:'18 months – 3 years'},
      {name:'Primary Program', age:'3 – 6 years'},
      {name:'Kindergarten Program', age:'5 – 6 years'}
    ];
    document.getElementById('program-cards').innerHTML = defs.map(d=>`<div class="card p-5"><h3 class="font-heading text-xl text-heading dark:text-dark-text">${d.name}</h3><p class="text-sm text-primary font-semibold">${d.age}</p><p class="mt-2 text-sm">Enrolled students: <strong>${students.filter(s=>s.program===d.name).length}</strong></p><p class="mt-1 text-sm text-body/80 dark:text-dark-muted">Status: Active</p></div>`).join('');
  }

  function populateStudentSelects(){
    const students = get('lr-students',[]);
    const opts = students.map(s=>`<option value="${s.name}">${s.name} (${s.program})</option>`).join('') || '<option value="Aarav Mehta">Aarav Mehta</option>';
    ['log-student','report-student'].forEach(id=>{ const el=document.getElementById(id); if(el) el.innerHTML = opts; });
  }

  function renderLogs(){
    const logs = get('lr-logs',[]);
    const el = document.getElementById('admin-logs-list');
    if(!logs.length){ el.innerHTML = '<p>No logs yet.</p>'; return; }
    el.innerHTML = logs.slice(0,6).map(l=>`<div class="rounded-xl border border-border p-3 dark:border-white/10"><div class="flex justify-between text-xs text-body/70 dark:text-dark-muted"><span>${l.date}</span><span>${l.area}</span></div><div class="font-medium text-heading dark:text-dark-text mt-1">${l.title}</div><div class="text-xs mt-1">Student: ${l.student||'Aarav Mehta'}</div><p class="mt-1">${l.notes}</p></div>`).join('');
  }

  function renderReports(){
    const reports = get('lr-reports',[]);
    const el = document.getElementById('admin-reports-list');
    if(!reports.length){ el.innerHTML='<p>No reports yet.</p>'; return; }
    el.innerHTML = reports.slice(0,6).map(r=>`<div class="rounded-xl border border-border p-3 dark:border-white/10"><div class="flex justify-between text-xs text-body/70 dark:text-dark-muted"><span>${r.date||''}</span><span>${r.teacher||'Teacher'}</span></div><div class="font-medium text-heading dark:text-dark-text mt-1">${r.period}</div><div class="text-xs mt-1">Student: ${r.student||'Aarav Mehta'}</div><p class="mt-1">${r.strengths}</p></div>`).join('');
  }

  function renderAttendance(){
    const students = get('lr-students',[]);
    document.getElementById('attendance-table').innerHTML = students.map((s,i)=>{
      const present = 45 + (i%5), absent = 2 + (i%2), rate = Math.round((present/(present+absent))*100);
      return `<tr><td class="py-2">${s.name}</td><td class="py-2">${s.program}</td><td class="py-2">${present}</td><td class="py-2">${absent}</td><td class="py-2 font-medium">${rate}%</td></tr>`;
    }).join('') || '<tr><td colspan="5" class="py-4">No students.</td></tr>';
  }

  function renderTuition(){
    const q = (document.getElementById('tuition-search').value||'').toLowerCase();
    let list = get('lr-tuition-admin',[]);
    if (q) list = list.filter(t => (t.student+t.parent).toLowerCase().includes(q));
    document.getElementById('tuition-table').innerHTML = list.map(t=>`<tr><td class="py-2">${t.student}</td><td class="py-2">${t.parent}</td><td class="py-2">$${t.amount}</td><td class="py-2">${t.due}</td><td class="py-2">${badge(t.status)}</td><td class="py-2"><button class="text-primary toggle-tuition" data-id="${t.id}">${t.status==='Paid'?'Mark Pending':'Mark Paid'}</button></td></tr>`).join('') || '<tr><td colspan="6" class="py-4">No records found.</td></tr>';
    document.querySelectorAll('.toggle-tuition').forEach(b=>b.addEventListener('click',()=>{
      const arr = get('lr-tuition-admin',[]); const item = arr.find(x=>x.id===Number(b.dataset.id)); if(item){ item.status = item.status==='Paid'?'Pending':'Paid'; set('lr-tuition-admin',arr); renderTuition(); renderStats(); }
    }));
  }

  function renderEnquiries(){
    const q = (document.getElementById('enquiry-search').value||'').toLowerCase();
    const f = document.getElementById('enquiry-filter').value;
    let list = get('lr-enquiries',[]);
    if (q) list = list.filter(e => (e.parentName+e.childName+e.email).toLowerCase().includes(q));
    if (f) list = list.filter(e => e.status === f);
    document.getElementById('enquiries-table').innerHTML = list.map(e=>`<tr><td class="py-2">${e.parentName}<div class="text-xs text-body/70">${e.email}</div></td><td class="py-2">${e.childName} (${e.childAge})</td><td class="py-2">${e.program}</td><td class="py-2">${e.visitDate}</td><td class="py-2">${badge(e.status||'New')}</td><td class="py-2"><button class="text-primary view-enq" data-id="${e.id}">View</button></td><td class="py-2"><select class="rounded-lg border border-border bg-bg px-2 py-1 text-xs dark:border-white/10 dark:bg-dark-bg enq-status" data-id="${e.id}">${['New','Contacted','Scheduled','Closed'].map(s=>`<option ${s===(e.status||'New')?'selected':''}>${s}</option>`).join('')}</select></td></tr>`).join('') || '<tr><td colspan="7" class="py-4">No enquiries yet. Submit the contact form to see demo data here.</td></tr>';
    document.querySelectorAll('.view-enq').forEach(b=>b.addEventListener('click',()=>{
      const e = get('lr-enquiries',[]).find(x=>String(x.id)===String(b.dataset.id)); if(!e) return;
      showModal('Enquiry Details', `<div class="space-y-2 text-sm"><p><strong>Parent:</strong> ${e.parentName}</p><p><strong>Email:</strong> ${e.email}</p><p><strong>Phone:</strong> ${e.phone}</p><p><strong>Child:</strong> ${e.childName} (${e.childAge})</p><p><strong>Program:</strong> ${e.program}</p><p><strong>Preferred Visit:</strong> ${e.visitDate}</p><p><strong>Message:</strong> ${e.message}</p></div>`);
    }));
    document.querySelectorAll('.enq-status').forEach(sel=>sel.addEventListener('change',()=>{
      const arr = get('lr-enquiries',[]); const item = arr.find(x=>String(x.id)===String(sel.dataset.id)); if(item){ item.status = sel.value; set('lr-enquiries',arr); renderEnquiries(); renderStats(); }
    }));
  }

  function showModal(title, bodyHtml){
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML = bodyHtml;
    const m = document.getElementById('admin-modal'); m.classList.remove('hidden'); m.classList.add('flex');
    if (window.lucide) window.lucide.createIcons();
  }
  function closeModal(){ const m = document.getElementById('admin-modal'); m.classList.add('hidden'); m.classList.remove('flex'); }

  function init(){
    if (!window.LRAuth || !window.LRAuth.requireRole('admin')) return;
    seed();
    const s = window.LRAuth.getSession();
    document.getElementById('session-name').textContent = s.name || 'Admin';
    renderStats(); renderParents(); renderStudents(); renderTeachers(); renderProgramCards(); populateStudentSelects(); renderLogs(); renderReports(); renderAttendance(); renderTuition(); renderEnquiries();

    document.getElementById('student-search').addEventListener('input', renderStudents);
    document.getElementById('student-filter').addEventListener('change', renderStudents);
    document.getElementById('add-student-btn').addEventListener('click', ()=>openStudentModal(null));
    document.getElementById('add-teacher-btn').addEventListener('click', ()=>openTeacherModal(null));

    document.getElementById('log-form').addEventListener('submit',(e)=>{
      e.preventDefault();
      const entry = { id:uid(), student: document.getElementById('log-student').value, date: document.getElementById('log-date').value, area: document.getElementById('log-area').value, title: document.getElementById('log-title').value, notes: document.getElementById('log-notes').value, participation:'High', status:'Completed' };
      const logs = get('lr-logs',[]); logs.unshift(entry); set('lr-logs', logs);
      e.target.reset(); const msg=document.getElementById('log-msg'); msg.textContent='Learning log saved.'; msg.className='text-sm text-green-700 dark:text-green-300'; msg.classList.remove('hidden'); renderLogs();
    });
    document.getElementById('report-form').addEventListener('submit',(e)=>{
      e.preventDefault();
      const rep = { id:uid(), student: document.getElementById('report-student').value, period: document.getElementById('report-period').value, strengths: document.getElementById('report-strengths').value, encourage: document.getElementById('report-improve').value, social: document.getElementById('report-social').value, feedback: document.getElementById('report-comments').value, progress: 'Progress report prepared by admin/teacher (demo).', teacher: 'Demo Teacher', date: new Date().toISOString().slice(0,10) };
      const reports = get('lr-reports',[]); reports.unshift(rep); set('lr-reports', reports);
      e.target.reset(); const msg=document.getElementById('report-msg'); msg.textContent='Report saved.'; msg.className='text-sm text-green-700 dark:text-green-300'; msg.classList.remove('hidden'); renderReports();
    });

    document.getElementById('tuition-search').addEventListener('input', renderTuition);
    document.getElementById('enquiry-search').addEventListener('input', renderEnquiries);
    document.getElementById('enquiry-filter').addEventListener('change', renderEnquiries);

    // Modal close and sidebar are handled by js/dashboard-shell.js
    document.getElementById('modal-close').addEventListener('click', closeModal);
    document.getElementById('admin-modal').addEventListener('click', (e)=>{ if(e.target.id==='admin-modal') closeModal(); });

    document.getElementById('settings-theme').addEventListener('click', ()=>window.LRTheme.toggle());
    document.getElementById('settings-rtl').addEventListener('click', ()=>window.LRDir.toggle());
    if (window.lucide) window.lucide.createIcons();
  }
  document.addEventListener('DOMContentLoaded', init);
})();
