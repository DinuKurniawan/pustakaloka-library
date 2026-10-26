import { breadcrumb } from '../components/breadcrumb.js';
import { bookCard } from '../components/book-card.js';
import { pagination } from '../components/pagination.js';
import { icon } from '../utils/icons.js';
import { mountLayout } from '../components/layout.js';
import { showToast } from '../components/toast.js';
import { categories } from '../data/categories.js';
import { getBookmarks, toggleBookmark } from '../services/bookmark-service.js';
import { searchBooks } from '../services/book-service.js';
import { escapeHTML as e } from '../utils/escape.js';
import { getParams, setParams } from '../utils/url.js';

const main = () => document.querySelector('#main');

function pageBanner(title) {
  return `<section class="page-banner"><div class="container-page">${breadcrumb([{ label: title }], { dark: true })}<h1 class="text-3xl font-bold text-white md:text-5xl">${e(title)}</h1></div></section>`;
}

function errorMarkup() {
  return `<div class="mx-auto max-w-xl bg-danger-50 p-8 text-center"><h2 class="text-2xl font-bold text-ink-900">Katalog belum dapat dimuat</h2><p class="mt-3 text-sm text-body">Periksa koneksi internet Anda lalu coba lagi.</p><button class="btn-primary mt-6" type="button" data-action="reload-page">Coba lagi</button></div>`;
}

function renderCatalogError() {
  main().innerHTML = `${pageBanner('Katalog buku')}<section class="section"><div class="container-page">${errorMarkup()}</div></section>`;
  main()
    .querySelector('[data-action="reload-page"]')
    ?.addEventListener('click', () => {
      window.location.reload();
    });
}

function renderCards(items, savedIds) {
  if (!items.length) {
    return `<div class="col-span-full py-16 text-center"><div class="mx-auto grid size-20 place-items-center rounded-full bg-brand-50 text-brand-300">${icon('book-open', { class: 'size-10' })}</div><h2 class="mt-6 text-2xl">Buku tidak ditemukan</h2><p class="mx-auto mt-2 max-w-md text-sm">Coba kata kunci, kategori, atau bahasa lain.</p><a class="btn-primary mt-6" href="./src/pages/katalog.html">Reset filter</a></div>`;
  }

  return items.map((book) => bookCard(book, { saved: savedIds.includes(book.id) })).join('');
}

async function renderCatalog() {
  const params = getParams();
  const q = params.get('q') ?? '';
  const kategori = params.get('kategori') ?? '';
  const bahasa = params.get('bahasa') ?? '';
  const urut = ['newest', 'az', 'za', 'popular'].includes(params.get('urut'))
    ? params.get('urut')
    : 'newest';
  const page = Math.max(1, Number(params.get('hal')) || 1);

  main().innerHTML = `${pageBanner('Katalog buku')}<section class="section"><div class="container-page"><p class="mb-10 text-center text-body">Memuat data buku dari Open Library…</p></div></section>`;

  const [result, saved] = await Promise.all([
    searchBooks({
      q,
      categories: kategori ? [kategori] : [],
      language: bahasa,
      sort: urut,
      page,
    }),
    getBookmarks(),
  ]);

  const baseParams = {
    ...(q ? { q } : {}),
    ...(kategori ? { kategori } : {}),
    ...(bahasa ? { bahasa } : {}),
    ...(urut !== 'newest' ? { urut } : {}),
  };

  main().innerHTML = `${pageBanner('Katalog buku')}<section class="section"><div class="container-page"><div class="mb-8 rounded bg-brand-50 p-4 text-sm text-brand-900">Data bibliografi diambil langsung dari Open Library. Informasi stok fisik dan status peminjaman perlu dikonfirmasi kepada perpustakaan.</div><div class="grid gap-8 lg:grid-cols-[240px_1fr]"><aside class="h-fit bg-surface p-5"><form class="grid gap-4" data-catalog-filter><div><label class="mb-1 block text-[13px] font-medium" for="catalog-q">Kata kunci</label><input class="field" id="catalog-q" name="q" value="${e(q)}" placeholder="Judul atau penulis" /></div><div><label class="mb-1 block text-[13px] font-medium" for="catalog-category">Kategori</label><select class="field" id="catalog-category" name="kategori"><option value="">Semua kategori</option>${categories.map((category) => `<option value="${e(category.id)}" ${category.id === kategori ? 'selected' : ''}>${e(category.name)}</option>`).join('')}</select></div><div><label class="mb-1 block text-[13px] font-medium" for="catalog-language">Bahasa</label><select class="field" id="catalog-language" name="bahasa"><option value="">Semua bahasa</option><option value="id" ${bahasa === 'id' ? 'selected' : ''}>Bahasa Indonesia</option><option value="en" ${bahasa === 'en' ? 'selected' : ''}>Bahasa Inggris</option></select></div><button class="btn-primary w-full" type="submit">Terapkan filter</button><a class="btn-outline w-full" href="./src/pages/katalog.html">Reset filter</a></form></aside><div><div class="mb-6 flex flex-col justify-between gap-3 border-b border-line pb-4 sm:flex-row sm:items-center"><p class="text-sm" aria-live="polite">Menampilkan <strong>${result.items.length}</strong> dari <strong>${result.total}</strong> buku</p><label class="flex items-center gap-2 text-sm" for="catalog-sort">Urutkan<select class="field min-h-10 w-auto py-2" id="catalog-sort" data-sort><option value="newest" ${urut === 'newest' ? 'selected' : ''}>Terbaru</option><option value="az" ${urut === 'az' ? 'selected' : ''}>Judul A–Z</option><option value="za" ${urut === 'za' ? 'selected' : ''}>Judul Z–A</option><option value="popular" ${urut === 'popular' ? 'selected' : ''}>Terpopuler</option></select></label></div><div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">${renderCards(result.items, saved)}</div>${pagination({ page: result.page, totalPages: result.totalPages, baseParams })}</div></div></div></section>`;

  main()
    .querySelector('[data-catalog-filter]')
    .addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      setParams(
        {
          q: data.get('q')?.toString().trim() ?? '',
          kategori: data.get('kategori')?.toString() ?? '',
          bahasa: data.get('bahasa')?.toString() ?? '',
          hal: '',
        },
        { replace: false },
      );
      renderCatalog().catch(renderCatalogError);
    });

  main()
    .querySelector('[data-sort]')
    .addEventListener('change', (event) => {
      setParams({ urut: event.target.value, hal: '' }, { replace: false });
      renderCatalog().catch(renderCatalogError);
    });
}

mountLayout();
main().addEventListener('click', async (event) => {
  const control = event.target.closest('[data-action="bookmark"]');
  if (!control) return;
  const result = await toggleBookmark(control.dataset.id);
  control.setAttribute('aria-pressed', String(result.saved));
  control.innerHTML = icon(result.saved ? 'bookmark-filled' : 'bookmark', { class: 'size-5' });
  showToast(result.saved ? 'Buku disimpan.' : 'Buku dihapus dari simpanan.');
  window.dispatchEvent(new Event('bookmarks-changed'));
});

window.addEventListener('popstate', () => {
  renderCatalog().catch(renderCatalogError);
});

renderCatalog().catch(renderCatalogError);
