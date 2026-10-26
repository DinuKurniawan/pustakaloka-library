import { getServices } from '../../services/content-service.js';
import { icon } from '../../utils/icons.js';
import { escapeHTML as e } from '../../utils/escape.js';
import { renderPageShell } from './shell.js';

export async function render() {
  const services = await getServices();
  const rules = [
    ['Masa pinjam', '7 hari'],
    ['Maksimal pinjam', '3 buku umum · 5 buku mahasiswa/guru'],
    ['Perpanjangan', '1 kali jika tidak dipesan'],
    ['Denda contoh', 'Rp500/hari/buku'],
  ];
  renderPageShell(
    'Layanan perpustakaan',
    'Informasi singkat dan jelas untuk membantu Anda memilih layanan yang tepat.',
    `<div class="grid gap-6 md:grid-cols-2">${services.map((service) => `<article id="${e(service.id)}" class="scroll-mt-28 bg-white p-6 shadow-card"><div class="flex items-start gap-4"><span class="grid size-14 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-700">${icon(service.icon, { class: 'size-7' })}</span><div><h2 class="text-xl">${e(service.name)}</h2><p class="mt-2 text-sm leading-7">${e(service.summary)}</p></div></div><ul class="mt-5 space-y-2 text-sm">${service.details.map((detail) => `<li class="flex gap-2">${icon('check', { class: 'mt-1 size-4 shrink-0 text-brand-700' })}${e(detail)}</li>`).join('')}</ul><p class="mt-5 text-xs text-subtle">Syarat: ${e(service.requirements.join(' · '))}<br />Jam: ${e(service.hours)}</p>${service.reservable ? `<a class="btn-primary mt-5" href="./src/pages/reservasi.html?layanan=${encodeURIComponent(service.id)}">Reservasi layanan</a>` : ''}</article>`).join('')}</div><div class="mt-16"><h2 class="text-2xl">Aturan peminjaman ringkas</h2><div class="mt-5 overflow-x-auto"><table class="w-full min-w-[520px] border-collapse text-left text-sm"><thead><tr class="bg-brand-50"><th class="p-4">Aturan</th><th class="p-4">Ketentuan</th></tr></thead><tbody>${rules.map(([rule, value]) => `<tr class="border-b border-line"><td class="p-4 font-semibold">${e(rule)}</td><td class="p-4">${e(value)}</td></tr>`).join('')}</tbody></table></div></div>`,
  );
}
