import { mountLayout } from '../components/layout.js';
import { accordion } from '../components/accordion.js';
import { breadcrumb } from '../components/breadcrumb.js';
import { bookCard } from '../components/book-card.js';
import { librarianCard } from '../components/librarian-card.js';
import { pagination } from '../components/pagination.js';
import { postCard } from '../components/post-card.js';
import { showReservationOverlay } from '../components/reservation-overlay.js';
import { sectionHeading } from '../components/section-heading.js';
import { serviceCard } from '../components/service-card.js';
import { showToast } from '../components/toast.js';
import { categories } from '../data/categories.js';
import { site } from '../data/site.js';
import { getBookById, getRelatedBooks, searchBooks } from '../services/book-service.js';
import { getBookmarks, removeBookmark, toggleBookmark } from '../services/bookmark-service.js';
import {
  getCategoryById,
  getFaqs,
  getLibrarians,
  getPostById,
  getPosts,
  getServices,
} from '../services/content-service.js';
import { registerMember } from '../services/member-service.js';
import {
  cancelReservation,
  getReservations,
  saveReservation,
} from '../services/reservation-service.js';
import { datePlusDays, formatDate, todayISO } from '../utils/format.js';
import { icon } from '../utils/icons.js';
import { getParams, setParams } from '../utils/url.js';
import { escapeHTML as e } from '../utils/escape.js';
import { validateDate, validators } from '../utils/validate.js';

const main = () => document.querySelector('#main');
const categoryName = (id) => categories.find((category) => category.id === id)?.name ?? id;

const pageBanner = (title, trail = []) =>
  `<section class="page-banner"><div class="container-page">${breadcrumb(trail, { dark: true })}<h1 class="text-3xl font-bold text-white md:text-5xl">${e(title)}</h1></div></section>`;

const emptyState = (title, text, href = './src/pages/katalog.html', label = 'Lihat katalog') =>
  `<div class="col-span-full py-16 text-center"><div class="mx-auto grid size-20 place-items-center rounded-full bg-brand-50 text-brand-300">${icon('book-open', { class: 'size-10' })}</div><h2 class="mt-6 text-2xl">${e(title)}</h2><p class="mx-auto mt-2 max-w-md text-sm">${e(text)}</p><a class="btn-primary mt-6" href="${e(href)}">${e(label)}</a></div>`;

function renderPageShell(title, subtitle, content, className = 'section') {
  main().innerHTML = `${pageBanner(title, [{ label: title }])}<section class="${className}"><div class="container-page">${subtitle ? `<p class="mx-auto mb-10 max-w-2xl text-center text-body">${e(subtitle)}</p>` : ''}${content}</div></section>`;
}

function renderBookGrid(items, savedIds = [], options = {}) {
  const enriched = items.map((book) => ({ ...book, categoryName: categoryName(book.categoryId) }));
  return enriched.length
    ? enriched
        .map((book) => bookCard(book, { saved: savedIds.includes(book.id), ...options }))
        .join('')
    : emptyState('Belum ada buku yang cocok', 'Coba kata kunci lain atau reset filter.');
}

async function handleCommonAction(event) {
  const control = event.target.closest('[data-action]');
  if (!control) return;
  if (control.dataset.action === 'bookmark') {
    const result = await toggleBookmark(control.dataset.id);
    control.setAttribute('aria-pressed', String(result.saved));
    control.setAttribute('aria-label', `${result.saved ? 'Hapus' : 'Simpan'} buku dari simpanan`);
    control.innerHTML = icon(result.saved ? 'bookmark-filled' : 'bookmark', { class: 'size-5' });
    showToast(result.saved ? 'Buku disimpan.' : 'Buku dihapus dari simpanan.');
    window.dispatchEvent(new Event('bookmarks-changed'));
  }
  if (control.dataset.action === 'remove-bookmark') {
    await removeBookmark(control.dataset.id);
    control.closest('article')?.remove();
    showToast('Buku dihapus dari simpanan.');
    window.dispatchEvent(new Event('bookmarks-changed'));
    if (!document.querySelector('[data-saved-card]')) {
      const grid = document.querySelector('[data-saved-grid]');
      if (grid)
        grid.innerHTML = emptyState(
          'Belum ada simpanan',
          'Tekan ikon bookmark pada buku yang ingin Anda baca nanti.',
        );
    }
  }
  if (control.dataset.action === 'accordion') {
    const panel = document.getElementById(control.getAttribute('aria-controls'));
    const expanded = control.getAttribute('aria-expanded') === 'true';
    control.setAttribute('aria-expanded', String(!expanded));
    panel?.classList.toggle('hidden', expanded);
    const iconTarget = control.querySelector('[data-icon]');
    if (iconTarget)
      iconTarget.innerHTML = icon(expanded ? 'plus' : 'x', {
        class: 'size-5 shrink-0 text-brand-700',
      });
  }
}

function addBackToTop() {
  const button = document.createElement('button');
  button.type = 'button';
  button.className =
    'fixed bottom-4 left-4 z-30 hidden size-11 place-items-center rounded-full bg-brand-700 text-white shadow-card hover:bg-brand-800';
  button.dataset.backTop = '';
  button.setAttribute('aria-label', 'Kembali ke atas');
  button.innerHTML = icon('arrow', { class: 'size-5 -rotate-90' });
  button.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  document.body.append(button);
  window.addEventListener('scroll', () => button.classList.toggle('hidden', window.scrollY < 400));
}

async function reservationFormMarkup({ compact = false } = {}) {
  return `<form class="grid gap-4 ${compact ? 'sm:grid-cols-2' : ''}" data-reservation-form novalidate><div><label class="mb-1 block text-[13px] font-medium text-ink-700" for="reservation-name">Nama lengkap *</label><input class="field" id="reservation-name" name="name" autocomplete="name" required /><p class="mt-1 text-[13px] text-danger-700" data-error="name"></p></div><div><label class="mb-1 block text-[13px] font-medium text-ink-700" for="reservation-phone">Telepon / WhatsApp *</label><input class="field" id="reservation-phone" name="phone" type="tel" autocomplete="tel" required /><p class="mt-1 text-[13px] text-danger-700" data-error="phone"></p></div><div><label class="mb-1 block text-[13px] font-medium text-ink-700" for="reservation-email">Email *</label><input class="field" id="reservation-email" name="email" type="email" autocomplete="email" required /><p class="mt-1 text-[13px] text-danger-700" data-error="email"></p></div><div><label class="mb-1 block text-[13px] font-medium text-ink-700" for="reservation-date">Tanggal *</label><input class="field" id="reservation-date" name="date" type="date" min="${todayISO()}" max="${datePlusDays(30)}" required /><p class="mt-1 text-[13px] text-danger-700" data-error="date"></p></div><div><label class="mb-1 block text-[13px] font-medium text-ink-700" for="reservation-service">Layanan *</label><select class="field" id="reservation-service" name="serviceId" required><option value="">Pilih layanan</option>${(
    await getServices()
  )
    .filter((service) => service.reservable)
    .map((service) => `<option value="${e(service.id)}">${e(service.name)}</option>`)
    .join(
      '',
    )}</select><p class="mt-1 text-[13px] text-danger-700" data-error="serviceId"></p></div><div><label class="mb-1 block text-[13px] font-medium text-ink-700" for="reservation-librarian">Pustakawan</label><select class="field" id="reservation-librarian" name="librarianId"><option value="">Pilih jika perlu konsultasi</option>${(await getLibrarians()).map((person) => `<option value="${e(person.id)}">${e(person.name)} — ${e(person.field)}</option>`).join('')}</select></div><div class="sm:col-span-2"><label class="mb-1 block text-[13px] font-medium text-ink-700" for="reservation-note">Catatan</label><textarea class="field min-h-24 py-3" id="reservation-note" name="note" rows="3" placeholder="Ceritakan kebutuhan Anda (opsional)"></textarea></div><div class="sm:col-span-2"><p class="rounded bg-brand-50 p-3 text-xs text-brand-900">Data reservasi hanya tersimpan di perangkat ini dalam mode demo.</p><button class="btn-primary mt-2 w-full" type="submit">Buat reservasi</button></div></form>`;
}

async function renderHome() {
  const services = await getServices();
  const latest = (await searchBooks({ perPage: 4 })).items;
  const librarians = (await getLibrarians()).slice(0, 3);
  const posts = (await getPosts({ perPage: 2 })).items;
  const reservationForm = await reservationFormMarkup({ compact: true });
  main().innerHTML = `<section class="relative z-10 min-h-[520px] overflow-visible bg-charcoal-900 text-white lg:min-h-[620px]"><img src="${e(site.images.hero)}" alt="Interior perpustakaan dengan rak buku" width="1600" height="900" fetchpriority="high" class="absolute inset-0 h-full w-full object-cover opacity-80" /><div class="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent"></div><div class="container-page relative flex min-h-[520px] items-center pb-20 pt-20 lg:min-h-[620px]"><div class="max-w-xl"><p class="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-brand-300">Ruang tumbuh untuk rasa ingin tahu</p><h1 class="text-[clamp(2rem,5vw,3.5rem)] font-bold uppercase leading-[1.1] tracking-wide"><span class="text-white">Jelajahi dunia</span><br /><span class="text-brand-300">lewat buku.</span></h1><p class="mt-5 max-w-lg text-base leading-7 text-white/90">Temukan bacaan yang membuat Anda bertanya, memahami, dan melihat kemungkinan baru.</p><div class="mt-8 flex flex-wrap gap-3"><a class="btn-light" href="./src/pages/tentang.html">Tentang kami</a><a class="btn-primary" href="./src/pages/kontak.html">Hubungi kami</a></div></div></div><div class="container-page absolute inset-x-0 bottom-0 z-20 translate-y-1/2"><form class="grid gap-3 bg-charcoal-600/95 p-4 shadow-card-hover md:grid-cols-[1fr_220px_auto] md:p-5" data-home-search><div><label class="sr-only" for="home-query">Kata kunci</label><input class="field bg-charcoal-700 text-white placeholder:text-white/70" id="home-query" name="q" placeholder="Cari judul, penulis, atau ISBN" /></div><div><label class="sr-only" for="home-category">Kategori</label><select class="field bg-charcoal-700 text-white" id="home-category" name="kategori"><option value="">Semua kategori</option>${categories.map((category) => `<option value="${e(category.id)}">${e(category.name)}</option>`).join('')}</select></div><button class="btn-primary" type="submit">Cari ${icon('search', { class: 'size-4' })}</button></form></div></section><section class="relative z-0 section pt-28 md:pt-36"><div class="container-page">${sectionHeading({ title: 'Koleksi kami', subtitle: 'Pilih jalur bacaan yang paling dekat dengan rasa ingin tahu Anda.' })}<div class="grid gap-6 lg:grid-cols-[240px_1fr]"><div class="flex gap-2 overflow-x-auto bg-surface p-2 lg:block lg:overflow-visible" role="tablist" aria-orientation="vertical" data-collection-tabs>${categories.map((category, index) => `<button type="button" class="relative flex min-w-max items-center gap-3 px-4 py-3 text-left text-[13px] font-semibold uppercase tracking-wide ${index === 0 ? 'bg-brand-700 text-white tab-arrow' : 'text-ink-700 hover:bg-brand-50'}" data-tab="${e(category.id)}" role="tab" aria-selected="${index === 0}" aria-controls="collection-panel">${icon(category.icon, { class: 'size-5' })}${e(category.name)}</button>`).join('')}</div><div id="collection-panel" role="tabpanel" tabindex="0">${collectionPanel(categories[0])}</div></div></div></section><section class="section bg-surface"><div class="container-page">${sectionHeading({ title: 'Layanan kami', subtitle: 'Bantuan praktis agar pengalaman belajar Anda terasa lebih ringan.' })}<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">${services.map(serviceCard).join('')}</div></div></section><section class="section"><div class="container-page">${sectionHeading({ title: 'Buku terbaru', subtitle: 'Beberapa judul yang baru saja mendapat tempat di rak kami.' })}<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4" data-home-books>${renderBookGrid(latest)}</div><div class="mt-10 text-center"><a class="btn-outline" href="./src/pages/katalog.html">Lihat semua buku</a></div></div></section><section class="section bg-brand-50"><div class="container-page grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-center"><div><p class="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">Rencanakan kunjungan</p><h2 class="mt-3 text-3xl md:text-4xl">Temukan ruang yang cocok untuk belajar bersama.</h2><p class="mt-4 max-w-lg leading-7">Reservasi ruang baca, ruang diskusi, atau konsultasi pustakawan tanpa perlu membuat akun.</p><div class="mt-6 flex flex-wrap gap-3"><a class="btn-primary" href="./src/pages/reservasi.html">Mulai reservasi</a><a class="btn-outline" href="./src/pages/layanan.html">Lihat layanan</a></div></div><div class="bg-white p-6 shadow-card">${sectionHeading({ title: 'Reservasi', subtitle: 'Isi singkat, kami siapkan tempatnya.' })}${reservationForm}</div></div></section><section class="section"><div class="container-page">${sectionHeading({ title: 'Pustakawan kami', subtitle: 'Orang-orang yang siap membantu Anda menemukan jalan masuk ke sebuah topik.' })}<div class="grid gap-6 md:grid-cols-3">${librarians.map(librarianCard).join('')}</div><div class="mt-10 text-center"><a class="btn-outline" href="./pustakawan.html">Semua pustakawan</a></div></div></section><section class="section bg-surface"><div class="container-page">${sectionHeading({ title: 'Berita & artikel terbaru', subtitle: 'Catatan kecil dari kegiatan dan percakapan di perpustakaan.' })}<div class="grid gap-8 lg:grid-cols-2">${posts.map(postCard).join('')}</div><div class="mt-10 text-center"><a class="btn-outline" href="./src/pages/berita.html">Baca semua berita</a></div></div></section>`;
  main()
    .querySelector('[data-home-search]')
    .addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const query = data.get('q')?.toString().trim();
      const category = data.get('kategori')?.toString();
      window.location.href = `./src/pages/katalog.html?${new URLSearchParams({ ...(query ? { q: query } : {}), ...(category ? { kategori: category } : {}) }).toString()}`;
    });
  main()
    .querySelector('[data-collection-tabs]')
    .addEventListener('click', (event) => {
      const button = event.target.closest('[data-tab]');
      if (!button) return;
      activateCollectionTab(button.dataset.tab);
    });
  main()
    .querySelector('[data-collection-tabs]')
    .addEventListener('keydown', (event) => {
      const buttons = [...event.currentTarget.querySelectorAll('[data-tab]')];
      const current = buttons.indexOf(document.activeElement);
      const next =
        event.key === 'ArrowDown' || event.key === 'ArrowRight'
          ? (current + 1) % buttons.length
          : event.key === 'ArrowUp' || event.key === 'ArrowLeft'
            ? (current - 1 + buttons.length) % buttons.length
            : event.key === 'Home'
              ? 0
              : event.key === 'End'
                ? buttons.length - 1
                : -1;
      if (next >= 0) {
        event.preventDefault();
        buttons[next].focus();
        activateCollectionTab(buttons[next].dataset.tab);
      }
    });
  await bindReservationForms();
}

function collectionPanel(category) {
  return `<div class="overflow-hidden bg-white shadow-card"><img src="${e(category.banner)}" alt="Ilustrasi koleksi ${e(category.name)}" width="1100" height="360" loading="lazy" class="h-[260px] w-full object-cover md:h-[360px]" /><div class="p-6 md:p-8"><p class="text-sm font-semibold uppercase tracking-wider text-brand-700">Tentang koleksi</p><h3 class="mt-2 text-2xl">${e(category.name)}</h3><p class="mt-3 max-w-2xl leading-7">${e(category.description)}</p><ul class="mt-5 grid gap-2 sm:grid-cols-2">${category.highlights.map((item) => `<li class="flex items-start gap-2 text-sm">${icon('check', { class: 'mt-1 size-4 shrink-0 text-brand-700' })}<span>${e(item)}</span></li>`).join('')}</ul><a class="btn-primary mt-6" href="./src/pages/katalog.html?kategori=${encodeURIComponent(category.id)}">Lihat di katalog</a></div></div>`;
}

function activateCollectionTab(id) {
  const selected = categories.find((category) => category.id === id) ?? categories[0];
  document.querySelectorAll('[data-tab]').forEach((button) => {
    const active = button.dataset.tab === selected.id;
    button.setAttribute('aria-selected', String(active));
    button.classList.toggle('bg-brand-700', active);
    button.classList.toggle('text-white', active);
    button.classList.toggle('tab-arrow', active);
  });
  const panel = document.querySelector('#collection-panel');
  if (panel) panel.innerHTML = collectionPanel(selected);
}

async function renderCatalog() {
  const params = getParams();
  const q = params.get('q') ?? '';
  const kategori = params.get('kategori') ?? '';
  const bahasa = params.get('bahasa') ?? '';
  const tersedia = params.get('tersedia') === '1';
  const urut = ['newest', 'az', 'za', 'popular'].includes(params.get('urut'))
    ? params.get('urut')
    : 'newest';
  const page = Math.max(1, Number(params.get('hal')) || 1);
  const result = await searchBooks({
    q,
    categories: kategori ? [kategori] : [],
    language: bahasa,
    onlyAvailable: tersedia,
    sort: urut,
    page,
  });
  const saved = await getBookmarks();
  renderPageShell(
    'Katalog buku',
    'Cari judul, penulis, atau topik yang ingin Anda bawa pulang.',
    `<div class="grid gap-8 lg:grid-cols-[240px_1fr]"><aside class="h-fit bg-surface p-5"><form class="grid gap-4" data-catalog-filter><div><label class="mb-1 block text-[13px] font-medium" for="catalog-q">Kata kunci</label><input class="field" id="catalog-q" name="q" value="${e(q)}" placeholder="Judul atau penulis" /></div><div><label class="mb-1 block text-[13px] font-medium" for="catalog-category">Kategori</label><select class="field" id="catalog-category" name="kategori"><option value="">Semua kategori</option>${categories.map((category) => `<option value="${e(category.id)}" ${category.id === kategori ? 'selected' : ''}>${e(category.name)}</option>`).join('')}</select></div><div><label class="mb-1 block text-[13px] font-medium" for="catalog-language">Bahasa</label><select class="field" id="catalog-language" name="bahasa"><option value="">Semua bahasa</option><option value="id" ${bahasa === 'id' ? 'selected' : ''}>Bahasa Indonesia</option></select></div><label class="flex items-center gap-2 text-sm"><input class="size-5 accent-brand-700" type="checkbox" name="tersedia" ${tersedia ? 'checked' : ''} />Hanya yang tersedia</label><button class="btn-primary w-full" type="submit">Terapkan filter</button><a class="btn-outline w-full" href="./src/pages/katalog.html">Reset filter</a></form></aside><div><div class="mb-6 flex flex-col justify-between gap-3 border-b border-line pb-4 sm:flex-row sm:items-center"><p class="text-sm" aria-live="polite">Menampilkan <strong>${result.items.length}</strong> dari <strong>${result.total}</strong> buku</p><label class="flex items-center gap-2 text-sm" for="catalog-sort">Urutkan<select class="field min-h-10 w-auto py-2" id="catalog-sort" data-sort><option value="newest" ${urut === 'newest' ? 'selected' : ''}>Terbaru</option><option value="az" ${urut === 'az' ? 'selected' : ''}>Judul A–Z</option><option value="za" ${urut === 'za' ? 'selected' : ''}>Judul Z–A</option><option value="popular" ${urut === 'popular' ? 'selected' : ''}>Terpopuler</option></select></label></div><div class="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4" data-catalog-grid>${renderBookGrid(result.items, saved)}</div>${pagination({ page: result.page, totalPages: result.totalPages, baseParams: { ...(q ? { q } : {}), ...(kategori ? { kategori } : {}), ...(bahasa ? { bahasa } : {}), ...(tersedia ? { tersedia: '1' } : {}), ...(urut !== 'newest' ? { urut } : {}) } })}</div></div>`,
  );
  const form = main().querySelector('[data-catalog-filter]');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const values = {
      q: data.get('q')?.toString().trim() ?? '',
      kategori: data.get('kategori')?.toString() ?? '',
      bahasa: data.get('bahasa')?.toString() ?? '',
      tersedia: data.has('tersedia') ? '1' : '',
    };
    setParams(values, { replace: false });
    renderCatalog();
  });
  main()
    .querySelector('[data-sort]')
    .addEventListener('change', (event) => {
      setParams({ urut: event.target.value, hal: '' }, { replace: false });
      renderCatalog();
    });
}

async function renderBookDetail() {
  const book = await getBookById(getParams().get('id'));
  if (!book) {
    renderPageShell(
      'Buku tidak ditemukan',
      'Tautan buku yang Anda buka mungkin sudah berubah.',
      `<div class="mx-auto max-w-xl text-center">${emptyState('Buku tidak ditemukan', 'Kembali ke katalog untuk menemukan bacaan lain.')}</div>`,
    );
    return;
  }
  const saved = (await getBookmarks()).includes(book.id);
  const related = await getRelatedBooks(book);
  document.title = `${book.title} — ${site.name}`;
  document.querySelector('meta[name="description"]')?.setAttribute('content', book.synopsis);
  renderPageShell(
    book.title,
    '',
    `${breadcrumb([{ label: 'Katalog', href: './src/pages/katalog.html' }, { label: book.title }])}<div class="grid gap-10 lg:grid-cols-[minmax(260px,4fr)_minmax(0,8fr)]"><div><img src="${e(book.cover)}" alt="Sampul buku ${e(book.title)}" width="400" height="600" class="mx-auto w-full max-w-sm bg-surface object-cover shadow-card" /></div><div><p class="text-sm font-semibold uppercase tracking-wider text-brand-700">${e(categoryName(book.categoryId))}</p><h2 class="mt-2 text-3xl md:text-4xl">${e(book.title)}</h2><p class="mt-2 text-lg text-subtle">${e(book.author)}</p><div class="mt-5 flex flex-wrap gap-3"><span class="rounded-full ${book.stock.available ? 'bg-success-50 text-success-700' : 'bg-warning-50 text-warning-700'} px-3 py-1 text-sm font-semibold">${book.stock.available ? `${book.stock.available} dari ${book.stock.total} tersedia` : 'Sedang dipinjam'}</span><span class="rounded-full bg-brand-50 px-3 py-1 text-sm text-brand-900">Rating ${book.rating.toFixed(1)}</span></div><div class="mt-8 grid gap-3 border-y border-line py-5 text-sm sm:grid-cols-2"><div><span class="text-subtle">ISBN</span><strong class="block">${e(book.isbn)}</strong></div><div><span class="text-subtle">Penerbit</span><strong class="block">${e(book.publisher)}</strong></div><div><span class="text-subtle">Tahun</span><strong class="block">${e(book.year)}</strong></div><div><span class="text-subtle">Halaman</span><strong class="block">${e(book.pages)}</strong></div><div><span class="text-subtle">Bahasa</span><strong class="block">${e(book.language === 'id' ? 'Indonesia' : book.language)}</strong></div><div><span class="text-subtle">Lokasi rak</span><strong class="block">${e(book.shelf)}</strong></div></div><div class="mt-7 flex flex-wrap gap-3"><a class="btn-primary" href="./src/pages/reservasi.html?buku=${encodeURIComponent(book.id)}">Reservasi buku</a><button class="btn-outline" type="button" data-action="bookmark" data-id="${e(book.id)}" aria-pressed="${saved}">${icon(saved ? 'bookmark-filled' : 'bookmark', { class: 'size-5' })}${saved ? 'Hapus simpanan' : 'Simpan buku'}</button><button class="btn-outline" type="button" data-action="copy-link">${icon('share', { class: 'size-5' })}Salin tautan</button></div></div></div><div class="mt-14 max-w-3xl"><h2 class="text-2xl">Sinopsis</h2><p class="mt-4 leading-8">${e(book.synopsis)}</p><div class="mt-6 flex flex-wrap gap-2">${book.tags.map((tag) => `<a class="rounded-full bg-brand-50 px-3 py-1 text-sm text-brand-900 hover:bg-brand-100" href="./src/pages/katalog.html?q=${encodeURIComponent(tag)}">#${e(tag)}</a>`).join('')}</div></div>${related.length ? `<div class="mt-16">${sectionHeading({ title: 'Buku terkait' })}<div class="grid grid-cols-2 gap-4 md:grid-cols-4">${renderBookGrid(related, await getBookmarks())}</div></div>` : ''}`,
  );
  main()
    .querySelector('[data-action="copy-link"]')
    ?.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast('Tautan buku disalin.');
      } catch {
        showToast('Tautan siap disalin dari bilah alamat.', 'info');
      }
    });
}

async function bindReservationForms() {
  document.querySelectorAll('[data-reservation-form]').forEach((form) => {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const values = Object.fromEntries(data.entries());
      const errors = {
        name: validators.name(values.name ?? ''),
        phone: validators.phone(values.phone ?? ''),
        email: validators.email(values.email ?? ''),
        date: validateDate(values.date ?? ''),
        serviceId: validators.required(values.serviceId ?? '', 'Pilih salah satu layanan.'),
      };
      let firstError;
      Object.entries(errors).forEach(([field, message]) => {
        const input = form.elements.namedItem(field);
        const output = form.querySelector(`[data-error="${field}"]`);
        input?.setAttribute('aria-invalid', String(Boolean(message)));
        if (message && !firstError) firstError = input;
        if (output) output.textContent = message;
      });
      if (firstError) {
        firstError.focus();
        showToast('Mohon lengkapi kolom yang bertanda merah.', 'info');
        return;
      }
      const submit = form.querySelector('button[type="submit"]');
      submit.disabled = true;
      submit.textContent = 'Memproses…';
      await new Promise((resolve) => setTimeout(resolve, 600));
      const reservation = await saveReservation(values);
      const formParent = form.parentElement;
      form.outerHTML = `<div class="rounded bg-brand-50 p-6 text-center" data-reservation-success><div class="mx-auto grid size-14 place-items-center rounded-full bg-white text-success-700">${icon('check', { class: 'size-8' })}</div><h3 class="mt-4 text-xl">Reservasi berhasil</h3><p class="mt-2 text-sm">Simpan kode reservasi Anda:</p><strong class="mt-2 block text-2xl tracking-wider text-brand-700">${e(reservation.code)}</strong><button class="btn-outline mt-6" type="button" data-action="new-reservation">Buat reservasi lain</button></div>`;
      const newReservationButton = formParent?.querySelector('[data-action="new-reservation"]');
      newReservationButton?.addEventListener('click', () => window.location.reload());
      showReservationOverlay(reservation, newReservationButton);
    });
  });
}

async function renderCollections() {
  const selected = await getCategoryById(getParams().get('kategori'));
  const booksResult = await searchBooks({ categories: [selected.id], perPage: 4, sort: 'popular' });
  renderPageShell(
    'Koleksi kami',
    'Jelajahi rak berdasarkan minat, kebutuhan, dan momen membaca Anda.',
    `<div class="grid gap-6 lg:grid-cols-[240px_1fr]"><div class="flex gap-2 overflow-x-auto bg-surface p-2 lg:block lg:overflow-visible" role="tablist" data-full-tabs>${categories.map((category) => `<a class="relative flex min-w-max items-center gap-3 px-4 py-3 text-[13px] font-semibold uppercase tracking-wide ${category.id === selected.id ? 'bg-brand-700 text-white tab-arrow' : 'text-ink-700 hover:bg-brand-50'}" role="tab" aria-selected="${category.id === selected.id}" href="./src/pages/koleksi.html?kategori=${encodeURIComponent(category.id)}">${icon(category.icon, { class: 'size-5' })}${e(category.name)}</a>`).join('')}</div><div>${collectionPanel(selected)}<div class="mt-10 flex items-end justify-between gap-4"><div><p class="text-sm text-subtle">Pilihan dari rak</p><h2 class="text-2xl">${e(selected.name)}</h2></div><span class="text-sm text-subtle">${booksResult.total} judul</span></div><div class="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">${renderBookGrid(booksResult.items, await getBookmarks())}</div></div></div>`,
  );
}

async function renderServices() {
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

async function renderReservation() {
  const params = getParams();
  const form = await reservationFormMarkup();
  renderPageShell(
    'Reservasi',
    'Pilih layanan, tanggal, dan kebutuhan Anda. Prosesnya singkat dan data hanya tersimpan di perangkat ini.',
    `<div class="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(260px,5fr)]"><div class="bg-white p-6 shadow-card md:p-8">${form}</div><aside class="h-fit bg-brand-50 p-6"><h2 class="text-xl">Sebelum datang</h2><ul class="mt-5 space-y-4 text-sm"><li class="flex gap-3">${icon('clock', { class: 'mt-1 size-5 shrink-0 text-brand-700' })}<span>${e(site.hours[0].days)} ${e(site.hours[0].time)}<br />${e(site.hours[1].days)} ${e(site.hours[1].time)}</span></li><li class="flex gap-3">${icon('info', { class: 'mt-1 size-5 shrink-0 text-brand-700' })}<span>Reservasi maksimal 30 hari ke depan. Minggu adalah hari tutup.</span></li><li class="flex gap-3">${icon('pin', { class: 'mt-1 size-5 shrink-0 text-brand-700' })}<span>${e(site.address)}</span></li></ul><a class="btn-outline mt-6 w-full" href="./src/pages/kontak.html">Butuh bantuan?</a></aside></div><div class="mt-16">${await reservationsMarkup()}</div>`,
  );
  const service = params.get('layanan');
  const librarian = params.get('pustakawan');
  const book = params.get('buku');
  if (service) {
    const control = main().querySelector('[name="serviceId"]');
    if (control) control.value = service;
  }
  if (librarian) {
    const control = main().querySelector('[name="librarianId"]');
    if (control) control.value = librarian;
  }
  if (book) {
    const note = main().querySelector('[name="note"]');
    if (note) note.value = `Reservasi buku: ${book}`;
  }
  await bindReservationForms();
  main()
    .querySelectorAll('[data-cancel-reservation]')
    .forEach((button) =>
      button.addEventListener('click', async () => {
        await cancelReservation(button.dataset.cancelReservation);
        showToast('Reservasi dibatalkan.');
        renderReservation();
      }),
    );
}

async function reservationsMarkup() {
  const reservations = await getReservations();
  if (!reservations.length) return '';
  return `<section><h2 class="text-2xl">Reservasi saya</h2><div class="mt-5 grid gap-3">${reservations.map((reservation) => `<article class="flex flex-col justify-between gap-4 border border-line bg-white p-4 sm:flex-row sm:items-center"><div><strong class="text-brand-700">${e(reservation.code)}</strong><p class="text-sm">${e(reservation.date)} · ${e(reservation.serviceId)}</p></div><button class="btn-outline min-h-10 px-4" type="button" data-cancel-reservation="${e(reservation.code)}">Batalkan</button></article>`).join('')}</div></section>`;
}

async function renderLibrarians() {
  const librarians = await getLibrarians();
  renderPageShell(
    'Pustakawan kami',
    'Kenali tim yang membantu Anda menemukan sumber, ruang, dan cara belajar yang tepat.',
    `<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">${librarians.map(librarianCard).join('')}</div>`,
  );
}

async function renderNews() {
  const params = getParams();
  const category = params.get('kategori') ?? '';
  const result = await getPosts({ category, page: Math.max(1, Number(params.get('hal')) || 1) });
  renderPageShell(
    'Berita & artikel',
    'Catatan dari kegiatan, koleksi, dan percakapan yang hidup di Pustakaloka.',
    `<div class="mb-8 flex flex-wrap gap-2"><a class="rounded-full px-4 py-2 text-sm ${!category ? 'bg-brand-700 text-white' : 'bg-brand-50 text-brand-900'}" href="./src/pages/berita.html">Semua</a>${['kegiatan', 'literasi', 'pengumuman'].map((value) => `<a class="rounded-full px-4 py-2 text-sm ${category === value ? 'bg-brand-700 text-white' : 'bg-brand-50 text-brand-900'}" href="./src/pages/berita.html?kategori=${value}">${value[0].toUpperCase() + value.slice(1)}</a>`).join('')}</div><div class="grid gap-8 lg:grid-cols-2">${result.items.length ? result.items.map(postCard).join('') : emptyState('Belum ada berita', 'Coba kategori lainnya.')}</div>${pagination({ page: result.page, totalPages: result.totalPages, baseParams: category ? { kategori: category } : {} })}`,
  );
}

async function renderNewsDetail() {
  const post = await getPostById(getParams().get('id'));
  if (!post) {
    renderPageShell(
      'Berita tidak ditemukan',
      'Kembali ke daftar berita untuk membaca catatan lainnya.',
      emptyState(
        'Berita tidak ditemukan',
        'Artikel yang Anda cari tidak tersedia.',
        './src/pages/berita.html',
        'Lihat berita',
      ),
    );
    return;
  }
  document.title = `${post.title} — ${site.name}`;
  renderPageShell(
    post.title,
    '',
    `${breadcrumb([{ label: 'Berita', href: './src/pages/berita.html' }, { label: post.title }])}<article class="mx-auto max-w-3xl"><img src="${e(post.image)}" alt="" width="960" height="640" class="w-full bg-surface object-cover" /><div class="mt-6 flex flex-wrap gap-3 text-sm text-subtle"><span>${e(post.author)}</span><span>${formatDate(post.date)}</span><span class="text-brand-700">${e(post.category)}</span></div><div class="prose-library mt-8 text-body">${post.body.map((block) => (block.type === 'h2' ? `<h2>${e(block.text)}</h2>` : block.type === 'quote' ? `<blockquote class="my-8 border-l-4 border-brand-500 bg-brand-50 p-5 text-lg italic text-brand-900">${e(block.text)}</blockquote>` : `<p>${e(block.text)}</p>`)).join('')}</div><div class="mt-8 flex flex-wrap gap-2">${post.tags.map((tag) => `<span class="rounded-full bg-brand-50 px-3 py-1 text-sm text-brand-900">#${e(tag)}</span>`).join('')}</div><button class="btn-outline mt-8" type="button" data-action="copy-link">${icon('share', { class: 'size-5' })}Salin tautan</button></article>`,
  );
  main()
    .querySelector('[data-action="copy-link"]')
    ?.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast('Tautan artikel disalin.');
      } catch {
        showToast('Tautan siap disalin dari bilah alamat.', 'info');
      }
    });
}

async function renderAbout() {
  renderPageShell(
    'Tentang Pustakaloka',
    'Perpustakaan publik yang percaya bahwa pengetahuan tumbuh lebih baik ketika dibagikan.',
    `<div class="grid gap-10 lg:grid-cols-2 lg:items-center"><div><p class="text-sm font-semibold uppercase tracking-wider text-brand-700">Cerita kami</p><h2 class="mt-3 text-3xl md:text-4xl">Satu ruang, banyak kemungkinan.</h2><p class="mt-5 leading-8">Pustakaloka hadir sebagai ruang yang ramah untuk membaca, belajar, dan bertemu gagasan. Kami merawat koleksi sekaligus membuat akses terhadap pengetahuan terasa lebih dekat.</p><p class="mt-4 leading-8">Kami bekerja bersama sekolah, komunitas, dan keluarga untuk menumbuhkan kebiasaan membaca yang relevan dengan kehidupan sehari-hari.</p></div><img src="${e(site.images.hero)}" alt="Interior perpustakaan dengan rak buku" width="800" height="600" class="w-full bg-brand-50 p-6" /></div><div class="mt-16 grid gap-6 md:grid-cols-2"><article class="bg-brand-50 p-6"><h2 class="text-2xl">Visi</h2><p class="mt-3 leading-7">Menjadi ruang publik yang membuat setiap orang merasa punya tempat untuk belajar.</p></article><article class="bg-surface p-6"><h2 class="text-2xl">Misi</h2><p class="mt-3 leading-7">Menyediakan koleksi yang berguna, layanan yang manusiawi, dan program yang menghidupkan rasa ingin tahu.</p></article></div><div class="mt-16 grid grid-cols-2 gap-5 md:grid-cols-4">${[
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

async function renderContact() {
  const faqs = await getFaqs();
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

async function renderMembership() {
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
        if (input) input.setAttribute('aria-invalid', String(Boolean(message)));
        if (output) output.textContent = message;
        if (message && !first) first = input;
      });
      if (first) {
        first.focus();
        return;
      }
      const member = await registerMember(Object.fromEntries(data.entries()));
      form.innerHTML = `<div class="text-center"><div class="mx-auto grid size-14 place-items-center rounded-full bg-brand-50 text-success-700">${icon('check', { class: 'size-8' })}</div><h2 class="mt-4 text-2xl">Pendaftaran berhasil</h2><p class="mt-2 text-sm">Nomor anggota sementara Anda:</p><strong class="mt-2 block text-2xl text-brand-700">${e(member.memberNo)}</strong><p class="mt-4 text-sm">Simpan nomor ini dan tunjukkan saat kunjungan pertama.</p></div>`;
    });
}

async function renderSaved() {
  const ids = await getBookmarks();
  const items = (await Promise.all(ids.map((id) => getBookById(id)))).filter(Boolean);
  const cards = items
    .map((book) =>
      bookCard(
        { ...book, categoryName: categoryName(book.categoryId) },
        { saved: true, removable: true },
      ).replace('data-action="bookmark"', 'data-action="remove-bookmark" data-saved-card'),
    )
    .join('');
  renderPageShell(
    'Simpanan saya',
    'Kumpulan buku yang ingin Anda temukan kembali.',
    `<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4" data-saved-grid>${items.length ? cards : emptyState('Belum ada simpanan', 'Tekan ikon bookmark pada buku yang ingin Anda baca nanti.')}</div>`,
  );
}

async function renderNotFound() {
  renderPageShell(
    'Halaman tidak ditemukan',
    'Alamat yang Anda buka mungkin salah atau sudah dipindahkan.',
    `<div class="mx-auto max-w-xl text-center"><div class="text-8xl font-bold text-brand-700">404</div><p class="mt-4 text-lg">Mari kembali menemukan sesuatu yang menarik.</p><form class="mt-8 flex gap-2" data-not-found-search><label class="sr-only" for="not-found-query">Cari buku</label><input class="field" id="not-found-query" name="q" placeholder="Cari di katalog" /><button class="btn-primary shrink-0" type="submit">Cari</button></form><div class="mt-5 flex justify-center gap-3"><a class="btn-outline" href="./index.html">Beranda</a><a class="btn-outline" href="./src/pages/katalog.html">Katalog</a></div></div>`,
  );
  main()
    .querySelector('[data-not-found-search]')
    .addEventListener('submit', (event) => {
      event.preventDefault();
      const query = new FormData(event.currentTarget).get('q')?.toString().trim();
      window.location.href = `./src/pages/katalog.html${query ? `?q=${encodeURIComponent(query)}` : ''}`;
    });
}

export async function startPage(page) {
  mountLayout();
  document.addEventListener('click', handleCommonAction);
  addBackToTop();
  const renderers = {
    home: renderHome,
    catalog: renderCatalog,
    book: renderBookDetail,
    collections: renderCollections,
    services: renderServices,
    reservation: renderReservation,
    librarians: renderLibrarians,
    news: renderNews,
    'news-detail': renderNewsDetail,
    about: renderAbout,
    contact: renderContact,
    membership: renderMembership,
    saved: renderSaved,
    'not-found': renderNotFound,
  };
  await (renderers[page] ?? renderNotFound)();
}
