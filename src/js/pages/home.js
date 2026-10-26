import { librarianCard } from '../components/librarian-card.js';
import { postCard } from '../components/post-card.js';
import { showReservationOverlay } from '../components/reservation-overlay.js';
import { sectionHeading } from '../components/section-heading.js';
import { serviceCard } from '../components/service-card.js';
import { showToast } from '../components/toast.js';
import { mountLayout } from '../components/layout.js';
import {
  getCategories,
  getLibrarians,
  getPosts,
  getServices,
  getSite,
} from '../services/content-service.js';
import { saveReservation } from '../services/reservation-service.js';
import { datePlusDays, todayISO } from '../utils/format.js';
import { icon } from '../utils/icons.js';
import { escapeHTML as e } from '../utils/escape.js';
import { validateDate, validators } from '../utils/validate.js';

const main = () => document.querySelector('#main');
let homeCategories = [];

const skeleton = (className = 'h-5') =>
  `<span class="block animate-pulse rounded bg-field ${className}" aria-hidden="true"></span>`;

function reservationFormMarkup() {
  return `<form class="grid gap-4 sm:grid-cols-2" data-home-reservation-form novalidate><div><label class="mb-1 block text-[13px] font-medium text-ink-700" for="home-reservation-name">Nama lengkap *</label><input class="field" id="home-reservation-name" name="name" autocomplete="name" required /><p class="mt-1 text-[13px] text-danger-700" data-error="name"></p></div><div><label class="mb-1 block text-[13px] font-medium text-ink-700" for="home-reservation-phone">Telepon / WhatsApp *</label><input class="field" id="home-reservation-phone" name="phone" type="tel" autocomplete="tel" required /><p class="mt-1 text-[13px] text-danger-700" data-error="phone"></p></div><div><label class="mb-1 block text-[13px] font-medium text-ink-700" for="home-reservation-email">Email *</label><input class="field" id="home-reservation-email" name="email" type="email" autocomplete="email" required /><p class="mt-1 text-[13px] text-danger-700" data-error="email"></p></div><div><label class="mb-1 block text-[13px] font-medium text-ink-700" for="home-reservation-date">Tanggal *</label><input class="field" id="home-reservation-date" name="date" type="date" min="${todayISO()}" max="${datePlusDays(30)}" required /><p class="mt-1 text-[13px] text-danger-700" data-error="date"></p></div><div><label class="mb-1 block text-[13px] font-medium text-ink-700" for="home-reservation-service">Layanan *</label><select class="field" id="home-reservation-service" name="serviceId" required><option value="">Pilih layanan</option></select><p class="mt-1 text-[13px] text-danger-700" data-error="serviceId"></p></div><div><label class="mb-1 block text-[13px] font-medium text-ink-700" for="home-reservation-librarian">Pustakawan</label><select class="field" id="home-reservation-librarian" name="librarianId"><option value="">Pilih jika perlu konsultasi</option></select></div><div class="sm:col-span-2"><label class="mb-1 block text-[13px] font-medium text-ink-700" for="home-reservation-note">Catatan</label><textarea class="field min-h-24 py-3" id="home-reservation-note" name="note" rows="3" placeholder="Ceritakan kebutuhan Anda (opsional)"></textarea></div><div class="sm:col-span-2"><p class="rounded bg-brand-50 p-3 text-xs text-brand-900">Data reservasi hanya tersimpan di perangkat ini dalam mode demo.</p><button class="btn-primary mt-2 w-full" type="submit">Buat reservasi</button></div></form>`;
}

function renderInitialHomeSkeleton() {
  main().innerHTML = `<section class="relative z-10 min-h-[520px] overflow-visible bg-charcoal-900 text-white lg:min-h-[620px]"><img src="/assets/img/hero/library-interior-mobile.webp" srcset="/assets/img/hero/library-interior-mobile.webp 900w, /assets/img/hero/library-interior-optimized.webp 1280w" sizes="100vw" alt="Interior perpustakaan dengan rak buku" width="1280" height="751" fetchpriority="high" decoding="async" class="absolute inset-0 h-full w-full object-cover opacity-80" /><div class="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent"></div><div class="container-page relative flex min-h-[520px] items-center pb-20 pt-20 lg:min-h-[620px]"><div class="max-w-xl"><p class="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-brand-300">Ruang tumbuh untuk rasa ingin tahu</p><h1 class="text-[clamp(2rem,5vw,3.5rem)] font-bold uppercase leading-[1.1] tracking-wide"><span class="text-white">Jelajahi dunia</span><br /><span class="text-brand-300">lewat buku.</span></h1><p class="mt-5 max-w-lg text-base leading-7 text-white/90">Temukan bacaan yang membuat Anda bertanya, memahami, dan melihat kemungkinan baru.</p><div class="mt-8 flex flex-wrap gap-3"><a class="btn-light" href="./src/pages/tentang.html">Tentang kami</a><a class="btn-primary" href="./src/pages/kontak.html">Hubungi kami</a></div></div></div><div class="container-page absolute inset-x-0 bottom-0 z-20 translate-y-1/2"><form class="grid gap-3 bg-charcoal-600/95 p-4 shadow-card-hover md:grid-cols-[1fr_220px_auto] md:p-5" data-home-search><div><label class="sr-only" for="home-query">Kata kunci</label><input class="field bg-charcoal-700 text-white placeholder:text-white/70" id="home-query" name="q" placeholder="Cari judul, penulis, atau ISBN" /></div><div><label class="sr-only" for="home-category">Kategori</label><select class="field bg-charcoal-700 text-white" id="home-category" name="kategori"><option value="">Semua kategori</option></select></div><button class="btn-primary" type="submit">Cari ${icon('search', { class: 'size-4' })}</button></form></div></section><section class="section" data-home-below-fold><div class="container-page">${sectionHeading({ title: 'Koleksi kami', subtitle: 'Jelajahi rak berdasarkan minat, kebutuhan, dan momen membaca Anda.' })}<div class="min-h-[580px]" data-home-collection>${skeleton('h-[32rem]')}</div></div></section><section class="section bg-surface" data-home-below-fold><div class="container-page">${sectionHeading({ title: 'Layanan kami', subtitle: 'Bantuan sederhana untuk membuat pengalaman belajar terasa lebih dekat.' })}<div class="grid min-h-[420px] gap-5 sm:grid-cols-2 lg:grid-cols-4" data-home-services>${Array.from({ length: 8 }, () => `<div class="bg-white p-5">${skeleton('mx-auto h-16 w-16 rounded-2xl')}${skeleton('mx-auto mt-5 h-5 w-32')}${skeleton('mx-auto mt-3 h-12 w-full')}</div>`).join('')}</div></div></section><section class="section" data-home-below-fold><div class="container-page">${sectionHeading({ title: 'Buku terbaru', subtitle: 'Temukan judul baru untuk dibaca dan dibawa pulang.' })}<div class="min-h-[480px]" data-home-latest><div class="mx-auto max-w-md text-center">${skeleton('mx-auto h-16 w-16 rounded-full')}<p class="mt-5 text-sm text-subtle">Buku terbaru akan dimuat saat bagian ini terlihat.</p></div></div><div class="mt-8 text-center"><a class="btn-outline" href="./src/pages/katalog.html">Lihat semua buku ${icon('arrow', { class: 'size-4' })}</a></div></div></section><section class="section relative overflow-hidden bg-brand-50" data-home-below-fold><div class="absolute inset-y-0 right-0 hidden w-2/5 lg:block"><img src="/assets/img/staf/librarian.svg" alt="Ilustrasi pustakawan" width="480" height="640" loading="lazy" decoding="async" class="h-full w-full object-cover opacity-40" /></div><div class="container-page relative"><div class="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(260px,5fr)]"><div class="bg-white p-6 shadow-card md:p-8"><p class="text-sm font-semibold uppercase tracking-wider text-brand-700">Reservasi</p><h2 class="mt-2 text-2xl md:text-3xl">Rencanakan kunjungan Anda</h2><p class="mt-3 mb-8 max-w-xl text-sm leading-7">Pilih layanan dan waktu yang sesuai. Tim kami siap membantu kebutuhan membaca dan belajar Anda.</p>${reservationFormMarkup()}</div><aside class="h-fit bg-white/80 p-6" data-home-reservation-details><h2 class="text-xl">Sebelum datang</h2><p class="mt-3 text-sm leading-7">Jam buka dan alamat perpustakaan akan ditampilkan di sini.</p></aside></div></div></section><section class="section" data-home-below-fold><div class="container-page">${sectionHeading({ title: 'Pustakawan kami', subtitle: 'Kenali tim yang membantu Anda menemukan sumber dan cara belajar yang tepat.' })}<div class="grid min-h-[480px] gap-6 sm:grid-cols-2 lg:grid-cols-3" data-home-librarians>${Array.from({ length: 3 }, () => `<div class="bg-white p-5">${skeleton('aspect-[3/4] w-full')}${skeleton('mt-5 h-5 w-40')}${skeleton('mt-3 h-4 w-56')}</div>`).join('')}</div></div></section><section class="section bg-surface" data-home-below-fold><div class="container-page">${sectionHeading({ title: 'Berita & artikel', subtitle: 'Catatan dari kegiatan, koleksi, dan percakapan yang hidup di Pustakaloka.' })}<div class="grid min-h-[420px] gap-8 lg:grid-cols-2" data-home-posts>${Array.from({ length: 2 }, () => `<div class="bg-white p-5">${skeleton('h-48 w-full')}${skeleton('mt-5 h-5 w-40')}${skeleton('mt-3 h-12 w-full')}</div>`).join('')}</div></div></section>`;
}

function renderInitialHome() {
  renderInitialHomeSkeleton();
  decorateReservationSection();
}

function decorateReservationSection() {
  const details = document.querySelector('[data-home-reservation-details]');
  const section = details?.closest('section');
  const background = section?.querySelector('div.absolute img');
  if (!section || !background) return;

  section.classList.remove('bg-brand-50');
  section.classList.add('bg-charcoal-900', 'text-white');
  background.src = '/assets/img/staf/librarian.webp';
  background.alt = 'Pustakawan melayani pengunjung di perpustakaan';
  background.width = 1200;
  background.height = 800;
  background.className = 'absolute inset-0 h-full w-full object-cover';
  background.parentElement.className = 'absolute inset-0';

  const overlay = document.createElement('div');
  overlay.className = 'absolute inset-0 bg-charcoal-900/75';
  section.insertBefore(overlay, section.querySelector('.container-page'));

  details.classList.remove('bg-white/80');
  details.classList.add('bg-white', 'text-ink-900', 'shadow-card');
  details.previousElementSibling?.classList.add('text-ink-900');
}

function collectionPanel(category) {
  return `<div class="overflow-hidden bg-white shadow-card"><img src="${e(category.banner)}" srcset="${e(category.banner.replace(/\.webp$/, '-768.webp'))} 768w, ${e(category.banner)} 1200w" sizes="(min-width: 768px) 683px, calc(100vw - 32px)" alt="Foto koleksi ${e(category.name)}" width="1200" height="800" loading="lazy" decoding="async" class="h-[260px] w-full object-cover md:h-[360px]" /><div class="p-6 md:p-8"><p class="text-sm font-semibold uppercase tracking-wider text-brand-700">Tentang koleksi</p><h3 class="mt-2 text-2xl">${e(category.name)}</h3><p class="mt-3 max-w-2xl leading-7">${e(category.description)}</p><ul class="mt-5 grid gap-2 sm:grid-cols-2">${category.highlights.map((item) => `<li class="flex items-start gap-2 text-sm">${icon('check', { class: 'mt-1 size-4 shrink-0 text-brand-700' })}<span>${e(item)}</span></li>`).join('')}</ul><a class="btn-primary mt-6" href="./src/pages/katalog.html?kategori=${encodeURIComponent(category.id)}">Lihat di katalog</a></div></div>`;
}

function renderCollection() {
  const selected = homeCategories[0];
  document.querySelector('[data-home-collection]').innerHTML =
    `<div class="grid gap-6 lg:grid-cols-[240px_1fr]"><div class="flex gap-2 overflow-x-auto bg-surface p-2 lg:block lg:overflow-visible" role="tablist" aria-label="Kategori koleksi">${homeCategories.map((category, index) => `<button class="relative flex min-w-max items-center gap-3 px-4 py-3 text-left text-[13px] font-semibold uppercase tracking-wide ${index === 0 ? 'bg-brand-700 text-white tab-arrow' : 'text-ink-700 hover:bg-brand-50'}" type="button" role="tab" aria-selected="${index === 0}" aria-controls="home-collection-panel" data-tab="${e(category.id)}">${icon(category.icon, { class: 'size-5' })}${e(category.name)}</button>`).join('')}</div><div id="home-collection-panel">${collectionPanel(selected)}</div></div>`;
}

function activateCollectionTab(id) {
  const selected = homeCategories.find((category) => category.id === id) ?? homeCategories[0];
  document.querySelectorAll('[data-tab]').forEach((button) => {
    const active = button.dataset.tab === selected.id;
    button.setAttribute('aria-selected', String(active));
    button.classList.toggle('bg-brand-700', active);
    button.classList.toggle('text-white', active);
    button.classList.toggle('tab-arrow', active);
  });
  const panel = document.querySelector('#home-collection-panel');
  if (panel) panel.innerHTML = collectionPanel(selected);
}

function renderServices(services) {
  document.querySelector('[data-home-services]').innerHTML = services.map(serviceCard).join('');
}

function renderLibrarians(librarians) {
  document.querySelector('[data-home-librarians]').innerHTML = librarians
    .slice(0, 3)
    .map(librarianCard)
    .join('');
}

function renderPosts(posts) {
  document.querySelector('[data-home-posts]').innerHTML = posts.items.map(postCard).join('');
}

function updateCategoryOptions(categories) {
  const select = document.querySelector('#home-category');
  if (!select) return;
  select.innerHTML = `<option value="">Semua kategori</option>${categories.map((category) => `<option value="${e(category.id)}">${e(category.name)}</option>`).join('')}`;
}

function updateReservationOptions(services, librarians) {
  const form = document.querySelector('[data-home-reservation-form]');
  if (!form) return;
  form.elements.namedItem('serviceId').innerHTML =
    `<option value="">Pilih layanan</option>${services
      .filter((service) => service.reservable)
      .map((service) => `<option value="${e(service.id)}">${e(service.name)}</option>`)
      .join('')}`;
  form.elements.namedItem('librarianId').innerHTML =
    `<option value="">Pilih jika perlu konsultasi</option>${librarians.map((person) => `<option value="${e(person.id)}">${e(person.name)} — ${e(person.field)}</option>`).join('')}`;
}

function updateReservationDetails(site) {
  const target = document.querySelector('[data-home-reservation-details]');
  if (!target) return;
  target.innerHTML = `<h2 class="text-xl">Sebelum datang</h2><ul class="mt-5 space-y-4 text-sm"><li class="flex gap-3">${icon('clock', { class: 'mt-1 size-5 shrink-0 text-brand-700' })}<span>${e(site.hours[0].days)} ${e(site.hours[0].time)}<br />${e(site.hours[1].days)} ${e(site.hours[1].time)}</span></li><li class="flex gap-3">${icon('info', { class: 'mt-1 size-5 shrink-0 text-brand-700' })}<span>Reservasi maksimal 30 hari ke depan. Minggu adalah hari tutup.</span></li><li class="flex gap-3">${icon('pin', { class: 'mt-1 size-5 shrink-0 text-brand-700' })}<span>${e(site.address)}</span></li></ul><a class="btn-outline mt-6 w-full" href="./src/pages/kontak.html">Butuh bantuan?</a>`;
}

async function loadLatestBooks(target) {
  if (target.dataset.loaded) return;
  target.dataset.loaded = 'loading';
  try {
    const [{ searchBooks }, { bookCard }, { getBookmarks }] = await Promise.all([
      import('../services/book-service.js'),
      import('../components/book-card.js'),
      import('../services/bookmark-service.js'),
    ]);
    const [{ items }, saved] = await Promise.all([searchBooks({ perPage: 4 }), getBookmarks()]);
    target.innerHTML = `<div class="grid grid-cols-2 gap-4 sm:grid-cols-4">${items.map((book) => bookCard({ ...book, categoryName: homeCategories.find((category) => category.id === book.categoryId)?.name ?? book.categoryId }, { saved: saved.includes(book.id) })).join('')}</div>`;
    target.dataset.loaded = 'true';
  } catch {
    target.innerHTML =
      '<p class="col-span-full rounded bg-danger-50 p-6 text-center text-sm text-danger-700">Buku terbaru belum dapat dimuat. Silakan buka katalog untuk mencoba lagi.</p>';
    target.dataset.loaded = 'error';
  }
}

function observeLatestBooks() {
  const target = document.querySelector('[data-home-latest]');
  if (!target || !('IntersectionObserver' in window)) {
    if (target) void loadLatestBooks(target);
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries[0].isIntersecting) return;
      observer.disconnect();
      void loadLatestBooks(target);
    },
    { rootMargin: '400px 0px' },
  );
  observer.observe(target);
}

async function handleHomeClick(event) {
  const tab = event.target.closest('[data-tab]');
  if (tab) {
    activateCollectionTab(tab.dataset.tab);
    return;
  }
  const control = event.target.closest('[data-action]');
  if (!control) return;
  if (control.dataset.action === 'bookmark') {
    const { toggleBookmark } = await import('../services/bookmark-service.js');
    const result = await toggleBookmark(control.dataset.id);
    control.setAttribute('aria-pressed', String(result.saved));
    control.setAttribute('aria-label', `${result.saved ? 'Hapus' : 'Simpan'} buku dari simpanan`);
    control.innerHTML = icon(result.saved ? 'bookmark-filled' : 'bookmark', { class: 'size-5' });
    showToast(result.saved ? 'Buku disimpan.' : 'Buku dihapus dari simpanan.');
    window.dispatchEvent(new Event('bookmarks-changed'));
  }
  if (control.dataset.action === 'new-reservation') window.location.reload();
}

function bindHomeSearch() {
  document.querySelector('[data-home-search]')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const query = data.get('q')?.toString().trim();
    const category = data.get('kategori')?.toString();
    const params = new URLSearchParams({
      ...(query ? { q: query } : {}),
      ...(category ? { kategori: category } : {}),
    });
    window.location.href = `./src/pages/katalog.html${params.toString() ? `?${params}` : ''}`;
  });
}

async function bindReservationForm() {
  const form = document.querySelector('[data-home-reservation-form]');
  if (!form) return;
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
    const reservation = await saveReservation(values);
    const parent = form.parentElement;
    form.outerHTML = `<div class="rounded bg-brand-50 p-6 text-center" data-reservation-success><div class="mx-auto grid size-14 place-items-center rounded-full bg-white text-success-700">${icon('check', { class: 'size-8' })}</div><h3 class="mt-4 text-xl">Reservasi berhasil</h3><p class="mt-2 text-sm">Simpan kode reservasi Anda:</p><strong class="mt-2 block text-2xl tracking-wider text-brand-700">${e(reservation.code)}</strong><button class="btn-outline mt-6" type="button" data-action="new-reservation">Buat reservasi lain</button></div>`;
    const newReservationButton = parent?.querySelector('[data-action="new-reservation"]');
    showReservationOverlay(reservation, newReservationButton);
  });
}

async function startHome() {
  mountLayout();
  renderInitialHome();
  main().addEventListener('click', handleHomeClick);
  bindHomeSearch();
  void bindReservationForm();
  const [site, categories, services, librarians, posts] = await Promise.all([
    getSite(),
    getCategories(),
    getServices(),
    getLibrarians(),
    getPosts({ perPage: 2 }),
  ]);
  homeCategories = categories;
  updateCategoryOptions(categories);
  renderCollection();
  renderServices(services);
  updateReservationOptions(services, librarians);
  updateReservationDetails(site);
  renderLibrarians(librarians);
  renderPosts(posts);
  observeLatestBooks();
}

void startHome();
