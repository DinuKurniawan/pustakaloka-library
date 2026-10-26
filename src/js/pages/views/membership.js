import { showToast } from '../../components/toast.js';
import { registerMember } from '../../services/member-service.js';
import { escapeHTML as e } from '../../utils/escape.js';
import { icon } from '../../utils/icons.js';
import { validators } from '../../utils/validate.js';
import { main, renderPageShell } from './shell.js';

export function render() {
  renderPageShell(
    'Daftar anggota',
    'Keanggotaan gratis untuk membuat kegiatan membaca dan belajar terasa lebih dekat.',
    `<div class="mx-auto grid max-w-4xl gap-10 lg:grid-cols-[1fr_1.2fr]"><div><h2 class="text-2xl">Manfaat anggota</h2><ul class="mt-5 space-y-3 text-sm">${['Meminjam koleksi sesuai ketentuan', 'Mendapat bantuan pencarian referensi', 'Mengikuti program literasi', 'Memesan ruang diskusi'].map((item) => `<li class="flex gap-2">${icon('check', { class: 'mt-1 size-4 shrink-0 text-brand-700' })}${item}</li>`).join('')}</ul></div><div class="bg-white p-6 shadow-card"><form class="grid gap-4" data-member-form novalidate><div><label class="mb-1 block text-[13px] font-medium" for="member-name">Nama lengkap *</label><input class="field" id="member-name" name="name" required /><p class="mt-1 text-[13px] text-danger-700" data-member-error="name"></p></div><div><label class="mb-1 block text-[13px] font-medium" for="member-email">Email *</label><input class="field" id="member-email" name="email" type="email" required /><p class="mt-1 text-[13px] text-danger-700" data-member-error="email"></p></div><div><label class="mb-1 block text-[13px] font-medium" for="member-phone">Telepon *</label><input class="field" id="member-phone" name="phone" type="tel" required /><p class="mt-1 text-[13px] text-danger-700" data-member-error="phone"></p></div><div><label class="mb-1 block text-[13px] font-medium" for="member-type">Jenis anggota *</label><select class="field" id="member-type" name="type"><option>Pelajar</option><option>Mahasiswa</option><option>Umum</option></select></div><div><label class="mb-1 block text-[13px] font-medium" for="member-address">Alamat singkat</label><textarea class="field min-h-24 py-3" id="member-address" name="address" rows="3"></textarea></div><label class="flex gap-2 text-sm"><input class="mt-1 size-5 accent-brand-700" type="checkbox" name="agreement" required />Saya menyetujui syarat keanggotaan.</label><p class="text-[13px] text-danger-700" data-member-error="agreement"></p><button class="btn-primary" type="submit">Daftar sekarang</button></form></div></div>`,
  );
  main()
    .querySelector('[data-member-form]')
    .addEventListener('submit', async (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const data = new FormData(form);
      const errors = {
        name: validators.name(data.get('name')?.toString() ?? ''),
        email: validators.email(data.get('email')?.toString() ?? ''),
        phone: validators.phone(data.get('phone')?.toString() ?? ''),
        agreement: data.has('agreement') ? '' : 'Anda perlu menyetujui syarat keanggotaan.',
      };
      let first;
      Object.entries(errors).forEach(([field, message]) => {
        const input = form.elements.namedItem(field);
        const output = form.querySelector(`[data-member-error="${field}"]`);
        input?.setAttribute('aria-invalid', String(Boolean(message)));
        if (output) output.textContent = message;
        if (message && !first) first = input;
      });
      if (first) {
        first.focus();
        return;
      }
      const member = await registerMember(Object.fromEntries(data.entries()));
      form.innerHTML = `<div class="text-center"><div class="mx-auto grid size-14 place-items-center rounded-full bg-brand-50 text-success-700">${icon('check', { class: 'size-8' })}</div><h2 class="mt-4 text-2xl">Pendaftaran berhasil</h2><p class="mt-2 text-sm">Nomor anggota sementara Anda:</p><strong class="mt-2 block text-2xl text-brand-700">${e(member.memberNo)}</strong><p class="mt-4 text-sm">Simpan nomor ini dan tunjukkan saat kunjungan pertama.</p></div>`;
      showToast('Pendaftaran anggota berhasil.');
    });
}
