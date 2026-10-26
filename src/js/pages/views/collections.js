import { getCategoryById } from '../../services/content-service.js';
import { getBookmarks } from '../../services/bookmark-service.js';
import { searchBooks } from '../../services/book-service.js';
import { categories } from '../../data/categories.js';
import { icon } from '../../utils/icons.js';
import { escapeHTML as e } from '../../utils/escape.js';
import { getParams } from '../../utils/url.js';
import { collectionPanel, renderBookGrid, renderPageShell } from './shell.js';

export async function render() {
  const selected = await getCategoryById(getParams().get('kategori'));
  const booksResult = await searchBooks({ categories: [selected.id], perPage: 4, sort: 'popular' });
  renderPageShell(
    'Koleksi kami',
    'Jelajahi rak berdasarkan minat, kebutuhan, dan momen membaca Anda.',
    `<div class="grid gap-6 lg:grid-cols-[240px_1fr]"><div class="flex gap-2 overflow-x-auto bg-surface p-2 lg:block lg:overflow-visible" role="tablist" data-full-tabs>${categories.map((category) => `<a class="relative flex min-w-max items-center gap-3 px-4 py-3 text-[13px] font-semibold uppercase tracking-wide ${category.id === selected.id ? 'bg-brand-700 text-white tab-arrow' : 'text-ink-700 hover:bg-brand-50'}" role="tab" aria-selected="${category.id === selected.id}" href="./src/pages/koleksi.html?kategori=${encodeURIComponent(category.id)}">${icon(category.icon, { class: 'size-5' })}${e(category.name)}</a>`).join('')}</div><div>${collectionPanel(selected)}<div class="mt-10 flex items-end justify-between gap-4"><div><p class="text-sm text-subtle">Pilihan dari rak</p><h2 class="text-2xl">${e(selected.name)}</h2></div><span class="text-sm text-subtle">${booksResult.total} judul</span></div><div class="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">${renderBookGrid(booksResult.items, await getBookmarks())}</div></div></div>`,
  );
}
