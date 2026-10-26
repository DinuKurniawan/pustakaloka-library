import { breadcrumb } from '../components/breadcrumb.js';
import { bookCard } from '../components/book-card.js';
import { icon } from '../utils/icons.js';
import { mountLayout } from '../components/layout.js';
import { showToast } from '../components/toast.js';
import { categories } from '../data/categories.js';
import { getBookmarks, toggleBookmark } from '../services/bookmark-service.js';
import { getBookById, getRelatedBooks } from '../services/book-service.js';
import { escapeHTML as e } from '../utils/escape.js';
import { getParams } from '../utils/url.js';

const main = () => document.querySelector('#main');

function categoryName(id) {
  return (
    categories.find((category) => category.id === id)?.name ?? (id === 'umum' ? 'Katalog umum' : id)
  );
}

function pageBanner(title) {
  return `<section class="page-banner"><div class="container-page">${breadcrumb([{ label: title }], { dark: true })}<h1 class="text-3xl font-bold text-white md:text-5xl">${e(title)}</h1></div></section>`;
}

function errorMarkup() {
  return `<div class="mx-auto max-w-xl bg-danger-50 p-8 text-center"><h2 class="text-2xl font-bold text-ink-900">Detail buku belum dapat dimuat</h2><p class="mt-3 text-sm text-body">Periksa koneksi internet Anda lalu coba lagi.</p><button class="btn-primary mt-6" type="button" data-action="reload-page">Coba lagi</button></div>`;
}

function notFoundMarkup() {
  return `<div class="mx-auto max-w-xl bg-surface p-8 text-center"><div class="mx-auto grid size-20 place-items-center rounded-full bg-brand-50 text-brand-300">${icon('book-open', { class: 'size-10' })}</div><h2 class="mt-6 text-2xl">Buku tidak ditemukan</h2><p class="mt-3 text-sm">Tautan buku mungkin sudah berubah. Cari buku lain dari katalog.</p><a class="btn-primary mt-6" href="./src/pages/katalog.html">Buka katalog</a></div>`;
}

function valueOrFallback(value, fallback = 'Tidak tersedia') {
  return value === 0 || value ? value : fallback;
}

async function renderBookDetail() {
  const id = getParams().get('id');
  main().innerHTML = `${pageBanner('Detail buku')}<section class="section"><div class="container-page"><p class="text-center text-body">Memuat detail buku dari Open Library…</p></div></section>`;

  const book = await getBookById(id);
  if (!book) {
    main().innerHTML = `${pageBanner('Buku tidak ditemukan')}<section class="section"><div class="container-page">${notFoundMarkup()}</div></section>`;
    return;
  }

  const [savedIds, related] = await Promise.all([getBookmarks(), getRelatedBooks(book)]);
  const saved = savedIds.includes(book.id);
  const rating = book.rating > 0 ? book.rating.toFixed(1) : 'Belum ada';
  const stockLabel = book.stock.known
    ? book.stock.available > 0
      ? `${book.stock.available} dari ${book.stock.total} tersedia`
      : 'Sedang dipinjam'
    : 'Perlu dikonfirmasi';
  const pages = book.pages ? `${book.pages} halaman` : 'Tidak tersedia';

  document.title = `${book.title} — Pustakaloka`;
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute(
      'content',
      `${book.title} oleh ${book.author}. Lihat metadata buku dari Open Library.`,
    );
  main().innerHTML = `${pageBanner(book.title)}<section class="section"><div class="container-page">${breadcrumb([{ label: 'Katalog', href: './src/pages/katalog.html' }, { label: book.title }])}<div class="grid gap-10 lg:grid-cols-[minmax(260px,4fr)_minmax(0,8fr)]"><div><img src="${e(book.cover)}" alt="Sampul buku ${e(book.title)}" width="400" height="600" class="mx-auto w-full max-w-sm bg-surface object-cover shadow-card" /></div><div><p class="text-sm font-semibold uppercase tracking-wider text-brand-700">${e(categoryName(book.categoryId))}</p><h2 class="mt-2 text-3xl md:text-4xl">${e(book.title)}</h2><p class="mt-2 text-lg text-subtle">${e(book.author)}</p><div class="mt-5 flex flex-wrap gap-3"><span class="rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-900">${e(stockLabel)}</span><span class="rounded-full bg-brand-50 px-3 py-1 text-sm text-brand-900">Rating ${e(rating)}</span></div><div class="mt-8 grid gap-3 border-y border-line py-5 text-sm sm:grid-cols-2"><div><span class="text-subtle">ISBN</span><strong class="block">${e(book.isbn)}</strong></div><div><span class="text-subtle">Penerbit</span><strong class="block">${e(book.publisher)}</strong></div><div><span class="text-subtle">Tahun</span><strong class="block">${e(valueOrFallback(book.year))}</strong></div><div><span class="text-subtle">Halaman</span><strong class="block">${e(pages)}</strong></div><div><span class="text-subtle">Bahasa</span><strong class="block">${e(book.language === 'id' ? 'Indonesia' : book.language === 'en' ? 'Inggris' : book.language)}</strong></div><div><span class="text-subtle">Sumber</span><strong class="block">Open Library</strong></div></div><div class="mt-7 flex flex-wrap gap-3"><a class="btn-primary" href="./src/pages/reservasi.html?buku=${encodeURIComponent(book.id)}">Reservasi buku</a><button class="btn-outline" type="button" data-action="bookmark" data-id="${e(book.id)}" aria-pressed="${saved}">${icon(saved ? 'bookmark-filled' : 'bookmark', { class: 'size-5' })}${saved ? 'Hapus dari simpanan' : 'Simpan buku'}</button></div><div class="mt-8"><h3 class="text-xl">Sinopsis</h3><p class="mt-3 whitespace-pre-line leading-7">${e(book.synopsis)}</p></div><a class="mt-6 inline-flex text-sm text-brand-700 hover:underline" href="${e(book.sourceUrl)}" target="_blank" rel="noopener noreferrer">Lihat sumber di Open Library ${icon('arrow', { class: 'ml-1 size-4' })}</a></div></div>${related.length ? `<section class="mt-16" aria-labelledby="related-heading"><h2 id="related-heading" class="text-2xl">Buku terkait</h2><div class="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">${related.map((item) => bookCard({ ...item, categoryName: categoryName(item.categoryId) }, { saved: savedIds.includes(item.id) })).join('')}</div></section>` : ''}</div></section>`;
}

mountLayout();
main().addEventListener('click', async (event) => {
  const control = event.target.closest('[data-action="bookmark"]');
  if (!control) return;
  const result = await toggleBookmark(control.dataset.id);
  control.setAttribute('aria-pressed', String(result.saved));
  control.innerHTML = `${icon(result.saved ? 'bookmark-filled' : 'bookmark', { class: 'size-5' })}${result.saved ? 'Hapus dari simpanan' : 'Simpan buku'}`;
  showToast(result.saved ? 'Buku disimpan.' : 'Buku dihapus dari simpanan.');
  window.dispatchEvent(new Event('bookmarks-changed'));
});

renderBookDetail().catch(() => {
  main().innerHTML = `${pageBanner('Detail buku')}<section class="section"><div class="container-page">${errorMarkup()}</div></section>`;
  main()
    .querySelector('[data-action="reload-page"]')
    ?.addEventListener('click', () => {
      window.location.reload();
    });
});
