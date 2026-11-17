document.addEventListener('DOMContentLoaded', () => {
  // FAQ toggles (used on contact page)
  document.querySelectorAll('.faq-q').forEach((btn) => {
    btn.addEventListener('click', () => {
      const ans = btn.parentElement.querySelector('.faq-a');
      if (!ans) return;
      const open = !ans.classList.contains('hidden');
      ans.classList.toggle('hidden', open);
      const icon = btn.querySelector('[data-lucide]');
      if (icon) icon.setAttribute('data-lucide', open ? 'chevron-down' : 'chevron-up');
      if (window.lucide) window.lucide.createIcons();
    });
  });

  // Enquiry form (contact page)
  const form = document.getElementById('enquiry-form');
  if (form) {
    const alertBox = document.getElementById('form-alert');
    const showAlert = (msg, ok) => {
      alertBox.textContent = msg;
      alertBox.className = `rounded-xl p-3 text-sm ${ok ? 'bg-green-50 text-green-800 dark:bg-green-500/15 dark:text-green-200' : 'bg-red-50 text-red-800 dark:bg-red-500/15 dark:text-red-200'}`;
      alertBox.classList.remove('hidden');
    };
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      const required = ['parentName','email','phone','childName','childAge','program','visitDate','message'];
      for (const k of required) {
        if (!String(data[k] || '').trim()) return showAlert('Please fill in all required fields.', false);
      }
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
      if (!emailOk) return showAlert('Please enter a valid email address.', false);
      const phoneOk = /^[0-9+()\-\s]{7,20}$/.test(data.phone);
      if (!phoneOk) return showAlert('Please enter a valid phone number.', false);
      const list = JSON.parse(localStorage.getItem('lr-enquiries') || '[]');
      list.unshift({ ...data, id: 'ENQ-' + Date.now(), createdAt: new Date().toISOString(), status: 'New' });
      localStorage.setItem('lr-enquiries', JSON.stringify(list));
      form.reset();
      showAlert('Thank you! Your enquiry has been saved in this demo (LocalStorage). Our team will contact you soon. No email was sent.', true);
    });
  }
});
