import { accordion } from '../../components/accordion.js';
import { showToast } from '../../components/toast.js';
import { getFaqs, getSite } from '../../services/content-service.js';
import { escapeHTML as e } from '../../utils/escape.js';
import { validators } from '../../utils/validate.js';
import { icon } from '../../utils/icons.js';
import { main, renderPageShell } from './shell.js';

export async function render() {
  const [faqs, site] = await Promise.all([getFaqs(), getSite()]);
  renderPageShell(
    'Kontak & FAQ',
    'Punya pertanyaan? Temukan jawaban singkat atau kirim pesan kepada tim kami.',
    `<div class="grid gap-6 md:grid-cols-3"><a class="bg-brand-50 p-6" href="tel:${e(site.phone.replaceAll(' ', ''))}">${icon('phone', { class: 'size-7 text-brand-700' })}<h2 class="mt-4 text-lg">Telepon</h2><p class="mt-1 text-sm">${e(site.phone)}</p></a><a class="bg-brand-50 p-6" href="mailto:${e(site.email)}">${icon('mail', { class: 'size-7 text-brand-700' })}<h2 class="mt-4 text-lg">Email</h2><p class="mt-1 text-sm">${e(site.email)}</p></a><div class="bg-brand-50 p-6">${icon('pin', { class: 'size-7 text-brand-700' })}<h2 class="mt-4 text-lg">Alamat</h2><p class="mt-1 text-sm">${e(site.address)}</p></div></div><div class="mt-16 grid gap-12 lg:grid-cols-2"><div class="bg-white p-6 shadow-card"><h2 class="text-2xl">Kirim pesan</h2><form class="mt-6 grid gap-4" data-contact-form novalidate><div><label class="mb-1 block text-[13px] font-medium" for="contact-name">Nama</label><input class="field" id="contact-name" name="name" required /><p class="mt-1 text-[13px] text-danger-700" data-contact-error="name"></p></div><div><label class="mb-1 block text-[13px] font-medium" for="contact-email">Email</label><input class="field" id="contact-email" name="email" type="email" required /><p class="mt-1 text-[13px] text-danger-700" data-contact-error="email"></p></div><div><label class="mb-1 block text-[13px] font-medium" for="contact-subject">Subjek</label><input class="field" id="contact-subject" name="subject" required /></div><div><label class="mb-1 block text-[13px] font-medium" for="contact-message">Pesan</label><textarea class="field min-h-32 py-3" id="contact-message" name="message" rows="4" required></textarea></div><button class="btn-primary" type="submit">Kirim pesan</button></form></div><div><h2 class="text-2xl">Pertanyaan umum</h2><div class="mt-5">${accordion(faqs)}</div></div></div>`,
  );
  main()
    .querySelector('[data-contact-form]')
    .addEventListener('submit', (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const data = new FormData(form);
      const errors = {
        name: validators.name(data.get('name')?.toString() ?? ''),
        email: validators.email(data.get('email')?.toString() ?? ''),
      };
      let invalid = false;
      Object.entries(errors).forEach(([field, message]) => {
        const input = form.elements.namedItem(field);
        const output = form.querySelector(`[data-contact-error="${field}"]`);
        input?.setAttribute('aria-invalid', String(Boolean(message)));
        if (output) output.textContent = message;
        if (message && !invalid) {
          input.focus();
          invalid = true;
        }
      });
      if (invalid) return;
      form.reset();
      showToast('Pesan Anda sudah dicatat. Terima kasih.');
    });
}
