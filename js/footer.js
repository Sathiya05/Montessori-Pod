(function () {
  function basePath() { return window.location.pathname.includes('/dashboard/') ? '../' : ''; }
  function injectFooter() {
    const mount = document.getElementById('footer');
    if (!mount) return;
    const b = basePath();
    const year = new Date().getFullYear();
    mount.innerHTML = `
<footer class="mt-16 border-t border-border bg-surface/60 dark:border-white/10 dark:bg-dark-surface/40">
  <div class="container-wrap grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
    <div>
      <div class="flex items-center gap-3">
        <img src="${b}images/logo/logo.svg" alt="Little Roots Montessori logo" class="h-10 w-10 rounded-xl"/>
        <div>
          <div class="font-heading text-xl text-heading dark:text-dark-text">Montessori Pod</div>
          <div class="text-xs text-body dark:text-dark-muted">Growing Curious Minds</div>
        </div>
      </div>
      <p class="mt-4 text-sm leading-relaxed text-body dark:text-dark-muted">We nurture independence, curiosity, and confidence through hands-on learning, respectful guidance, and a calm, prepared environment for every child.</p>
      <div class="mt-4 flex gap-3 text-heading dark:text-dark-text">
        <a href="#" aria-label="Facebook" class="rounded-full border border-border p-2 hover:bg-white dark:border-white/10 dark:hover:bg-dark-card"><i data-lucide="facebook" class="h-4 w-4"></i></a>
        <a href="#" aria-label="Instagram" class="rounded-full border border-border p-2 hover:bg-white dark:border-white/10 dark:hover:bg-dark-card"><i data-lucide="instagram" class="h-4 w-4"></i></a>
        <a href="#" aria-label="Youtube" class="rounded-full border border-border p-2 hover:bg-white dark:border-white/10 dark:hover:bg-dark-card"><i data-lucide="youtube" class="h-4 w-4"></i></a>
      </div>
    </div>
    <div>
      <h3 class="font-heading text-lg text-heading dark:text-dark-text">Explore</h3>
      <ul class="mt-4 space-y-2 text-sm text-body dark:text-dark-muted">
        <li><a href="${b}index.html" class="hover:text-primary">Home</a></li>
        <li><a href="${b}about.html" class="hover:text-primary">About</a></li>
        <li><a href="${b}programs.html" class="hover:text-primary">Programs</a></li>
        <li><a href="${b}curriculum.html" class="hover:text-primary">Curriculum</a></li>
      </ul>
    </div>
    <div>
      <h3 class="font-heading text-lg text-heading dark:text-dark-text">Parent Resources</h3>
      <ul class="mt-4 space-y-2 text-sm text-body dark:text-dark-muted">
        <li><a href="${b}dashboard/parent-dashboard.html" class="hover:text-primary">Parent Dashboard</a></li>
        <li><a href="${b}dashboard/parent-dashboard.html#logs" class="hover:text-primary">Learning Logs</a></li>
        <li><a href="${b}dashboard/parent-dashboard.html#reports" class="hover:text-primary">Teacher Reports</a></li>
        <li><a href="${b}programs.html#tuition-info" class="hover:text-primary">Tuition Information</a></li>
      </ul>
    </div>
    <div>
      <h3 class="font-heading text-lg text-heading dark:text-dark-text">Contact</h3>
      <ul class="mt-4 space-y-3 text-sm text-body dark:text-dark-muted">
        <li class="flex gap-2"><i data-lucide="map-pin" class="mt-0.5 h-4 w-4 text-primary"></i><span>24 Willow Lane, Greenfield Community, Sample City 560001</span></li>
        <li class="flex gap-2"><i data-lucide="phone" class="mt-0.5 h-4 w-4 text-primary"></i><span>+1 (555) 012-3456</span></li>
        <li class="flex gap-2"><i data-lucide="mail" class="mt-0.5 h-4 w-4 text-primary"></i><span>hello@littleroots.example</span></li>
        <li class="flex gap-2"><i data-lucide="clock-3" class="mt-0.5 h-4 w-4 text-primary"></i><span>Mon–Fri: 8:00 AM – 4:30 PM</span></li>
      </ul>
    </div>
  </div>
  <div class="border-t border-border/70 dark:border-white/10">
    <div class="container-wrap flex flex-col items-center justify-between gap-3 py-5 text-sm text-body dark:text-dark-muted md:flex-row">
      <p>© ${year} Little Roots Montessori. All rights reserved.</p>
      <div class="flex flex-wrap items-center justify-center gap-4">
        <a href="#" class="hover:text-primary">Privacy Policy</a>
        <a href="#" class="hover:text-primary">Terms and Conditions</a>
        <span class="text-primary">Designed with care</span>
      </div>
    </div>
  </div>
</footer>`;
    if (window.lucide) window.lucide.createIcons();
  }
  document.addEventListener('DOMContentLoaded', injectFooter);
})();
