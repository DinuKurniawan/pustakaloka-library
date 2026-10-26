import { site } from '../data/site.js';
import { icon } from '../utils/icons.js';
import { escapeHTML as e } from '../utils/escape.js';

const links = [
  ['home', 'Beranda', 'index.html'],
  ['about', 'Tentang', 'src/pages/tentang.html'],
  ['collections', 'Koleksi', 'src/pages/koleksi.html'],
  ['services', 'Layanan', 'src/pages/layanan.html'],
  ['news', 'Berita', 'src/pages/berita.html'],
  ['contact', 'Kontak', 'src/pages/kontak.html'],
];

const moreLinks = [
  ['catalog', 'Katalog Buku', 'src/pages/katalog.html'],
  ['librarians', 'Pustakawan', 'src/pages/pustakawan.html'],
  ['membership', 'Daftar Anggota', 'src/pages/daftar-anggota.html'],
  ['saved', 'Simpanan Saya', 'src/pages/simpanan.html'],
];

const linkMarkup = (items, current) =>
  items
    .map(
      ([page, label, href]) =>
        `<a class="inline-flex min-h-11 items-center px-4 py-5 text-[13px] font-semibold tracking-wider uppercase transition hover:bg-brand-800 ${current === page ? 'border-b-2 border-white' : ''}" href="./${href}"${current === page ? ' aria-current="page"' : ''}>${label}</a>`,
    )
    .join('');

export function headerMarkup(current) {
  return `<div class="border-b border-line bg-white"><div class="container-page flex min-h-10 items-center justify-between gap-4 text-[12px] text-body"><div class="hidden items-center gap-3 md:flex"><a class="grid min-h-11 min-w-11 place-items-center" href="${e(site.social.facebook)}" target="_blank" rel="noopener noreferrer" aria-label="Facebook">f</a><a class="grid min-h-11 min-w-11 place-items-center" href="${e(site.social.x)}" target="_blank" rel="noopener noreferrer" aria-label="X">x</a><a class="grid min-h-11 min-w-11 place-items-center" href="${e(site.social.instagram)}" target="_blank" rel="noopener noreferrer" aria-label="Instagram">◎</a></div><div class="flex items-center gap-4"><a class="inline-flex min-h-11 items-center gap-1" href="tel:${e(site.phone.replaceAll(' ', ''))}">${icon('phone', { class: 'size-3.5' })}${e(site.phone)}</a><a class="hidden min-h-11 items-center gap-1 md:inline-flex" href="mailto:${e(site.email)}">${icon('mail', { class: 'size-3.5' })}${e(site.email)}</a></div><a href="./src/pages/reservasi.html" class="btn-primary min-h-11 px-4 py-1 text-[11px]">Reservasi</a></div></div><header class="sticky top-0 z-40 bg-white shadow-sm"><div class="container-page relative flex h-16 items-center justify-between lg:h-[68px]"><a href="./index.html" class="inline-flex min-h-11 items-center text-xl font-bold tracking-wide text-brand-700">PUSTAKALOKA</a><div class="absolute right-0 top-0 hidden h-full w-[70%] bg-brand-700 lg:block nav-slant"></div><nav aria-label="Navigasi utama" class="relative z-10 ml-auto hidden items-center text-white lg:flex">${linkMarkup(links, current)}<div class="relative"><button type="button" class="flex min-h-11 items-center gap-1 px-4 py-5 text-[13px] font-semibold uppercase tracking-wider hover:bg-brand-800" data-action="more-menu" aria-expanded="false" aria-controls="more-menu">Lainnya ${icon('chevron', { class: 'size-4' })}</button><div id="more-menu" class="absolute right-0 top-full hidden min-w-52 bg-white py-2 text-ink-700 shadow-card">${moreLinks.map(([page, label, href]) => `<a class="flex min-h-11 items-center px-4 py-3 text-sm hover:bg-brand-50 ${current === page ? 'font-semibold text-brand-700' : ''}" href="./${href}"${current === page ? ' aria-current="page"' : ''}>${label}</a>`).join('')}</div></div><button type="button" class="grid size-11 place-items-center hover:bg-brand-800" data-action="open-search" aria-label="Buka pencarian">${icon('search', { class: 'size-5' })}</button><a class="relative grid size-11 place-items-center hover:bg-brand-800" href="./src/pages/simpanan.html" aria-label="Buka simpanan">${icon('bookmark', { class: 'size-5' })}<span data-bookmark-count class="absolute right-1 top-2 hidden min-w-4 rounded-full bg-brand-300 px-1 text-center text-[10px] font-bold text-brand-900"></span></a></nav><button type="button" class="grid size-11 place-items-center text-brand-700 lg:hidden" data-action="open-mobile" aria-label="Buka menu" aria-expanded="false" aria-controls="mobile-menu">${icon('menu', { class: 'size-6' })}</button></div></header><div id="search-overlay" class="fixed inset-0 z-50 hidden bg-charcoal-900/90 p-4"><div class="mx-auto mt-20 max-w-2xl"><div class="flex items-center justify-between text-white"><p class="text-lg font-semibold">Cari di katalog</p><button type="button" data-action="close-search" aria-label="Tutup pencarian">${icon('x', { class: 'size-6' })}</button></div><form class="mt-6 flex gap-2" data-search-form><label class="sr-only" for="global-search">Kata kunci</label><input id="global-search" class="field bg-white" name="q" placeholder="Cari judul, penulis, atau ISBN" autocomplete="off" /><button class="btn-primary shrink-0" type="submit">Cari</button></form></div></div><div id="mobile-menu" class="fixed inset-0 z-50 hidden bg-black/50" data-mobile-root><aside class="ml-auto flex h-full w-[min(85vw,340px)] flex-col bg-white p-6" data-mobile-panel><div class="flex items-center justify-between"><span class="text-lg font-bold text-brand-700">Menu</span><button type="button" data-action="close-mobile" aria-label="Tutup menu">${icon('x', { class: 'size-6' })}</button></div><nav class="mt-8 flex flex-col">${linkMarkup(links, current)}${moreLinks.map(([, label, href]) => `<a class="border-b border-line py-3 text-sm font-semibold text-ink-700" href="./${href}">${label}</a>`).join('')}</nav><a class="btn-primary mt-auto" href="./src/pages/reservasi.html">Buat reservasi</a></aside></div>`;
}

export async function updateBookmarkCount() {
  const { getBookmarks } = await import('../services/bookmark-service.js');
  const count = (await getBookmarks()).length;
  document.querySelectorAll('[data-bookmark-count]').forEach((badge) => {
    badge.textContent = count ? String(count) : '';
    badge.classList.toggle('hidden', count === 0);
  });
}

export function scheduleBookmarkCount() {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => void updateBookmarkCount(), { timeout: 1000 });
  } else {
    window.setTimeout(() => void updateBookmarkCount(), 0);
  }
}
