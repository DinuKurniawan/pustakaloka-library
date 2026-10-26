import { getSite } from '../../services/content-service.js';
import { escapeHTML as e } from '../../utils/escape.js';
import { renderPageShell } from './shell.js';

export async function render() {
  const site = await getSite();
  renderPageShell(
    'Tentang Pustakaloka',
    'Perpustakaan publik yang percaya bahwa pengetahuan tumbuh lebih baik ketika dibagikan.',
    `<div class="grid gap-10 lg:grid-cols-2 lg:items-center"><div><p class="text-sm font-semibold uppercase tracking-wider text-brand-700">Cerita kami</p><h2 class="mt-3 text-3xl md:text-4xl">Satu ruang, banyak kemungkinan.</h2><p class="mt-5 leading-8">Pustakaloka hadir sebagai ruang yang ramah untuk membaca, belajar, dan bertemu gagasan. Kami merawat koleksi sekaligus membuat akses terhadap pengetahuan terasa lebih dekat.</p><p class="mt-4 leading-8">Kami bekerja bersama sekolah, komunitas, dan keluarga untuk menumbuhkan kebiasaan membaca yang relevan dengan kehidupan sehari-hari.</p></div><img src="${e(site.images.hero)}" alt="Interior perpustakaan dengan rak buku" width="800" height="600" loading="lazy" decoding="async" class="w-full bg-brand-50 p-6" /></div><div class="mt-16 grid gap-6 md:grid-cols-2"><article class="bg-brand-50 p-6"><h2 class="text-2xl">Visi</h2><p class="mt-3 leading-7">Menjadi ruang publik yang membuat setiap orang merasa punya tempat untuk belajar.</p></article><article class="bg-surface p-6"><h2 class="text-2xl">Misi</h2><p class="mt-3 leading-7">Menyediakan koleksi yang berguna, layanan yang manusiawi, dan program yang menghidupkan rasa ingin tahu.</p></article></div><div class="mt-16 grid grid-cols-2 gap-5 md:grid-cols-4">${[
      ['24+', 'judul pilihan'],
      ['8', 'layanan utama'],
      ['4', 'pustakawan'],
      ['7', 'kategori koleksi'],
    ]
      .map(
        ([value, label]) =>
          `<div class="border-l-4 border-brand-500 p-4"><strong class="text-3xl text-brand-700">${value}</strong><p class="mt-1 text-sm">${label}</p></div>`,
      )
      .join(
        '',
      )}</div><div class="mt-16 grid gap-10 lg:grid-cols-2"><div><h2 class="text-2xl">Jam operasional</h2><div class="mt-5 divide-y divide-line border-y border-line">${site.hours.map((hour) => `<div class="flex justify-between gap-4 py-4 text-sm"><span>${e(hour.days)}</span><strong>${e(hour.time)}</strong></div>`).join('')}</div></div><div class="bg-brand-700 p-8 text-white"><h2 class="text-2xl text-white">Mari berkunjung</h2><p class="mt-3 leading-7 text-white/90">Datang untuk membaca, bertanya, atau sekadar menemukan sudut yang tenang.</p><a class="btn-light mt-6" href="./src/pages/kontak.html">Lihat kontak</a></div></div>`,
  );
}
