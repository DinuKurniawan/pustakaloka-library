import { icon } from '../utils/icons.js';
import { escapeHTML as e } from '../utils/escape.js';

export function bookCard(book, { saved = false, removable = false } = {}) {
  const availabilityKnown = book.stock?.known !== false;
  const available = availabilityKnown && book.stock.available > 0;
  const availabilityLabel = availabilityKnown
    ? available
      ? 'Tersedia'
      : 'Dipinjam'
    : 'Info katalog';
  const availabilityClass = availabilityKnown
    ? available
      ? 'bg-success-50 text-success-700'
      : 'bg-warning-50 text-warning-700'
    : 'bg-brand-50 text-brand-900';
  return `<article class="group relative flex flex-col bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-card-hover">
    <a href="./src/pages/buku.html?id=${encodeURIComponent(book.id)}" class="block overflow-hidden bg-surface"><img src="${e(book.cover)}" alt="Sampul buku ${e(book.title)}" width="400" height="600" loading="lazy" decoding="async" class="aspect-[2/3] w-full object-cover transition duration-300 group-hover:scale-[1.03]" /></a>
    <span class="absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${availabilityClass}">${availabilityLabel}</span>
    <button type="button" data-action="bookmark" data-id="${e(book.id)}" aria-pressed="${saved}" aria-label="${saved ? 'Hapus' : 'Simpan'} ${e(book.title)}${removable ? ' dari simpanan' : ''}" class="absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-white/90 text-brand-700 hover:bg-white">${icon(saved ? 'bookmark-filled' : 'bookmark', { class: 'size-5' })}</button>
    <div class="flex flex-1 flex-col gap-1 p-4"><h3 class="line-clamp-2 text-base font-semibold text-ink-900">${e(book.title)}</h3><p class="text-[13px] text-subtle">${e(book.author)}</p><p class="mt-auto pt-2 text-xs font-medium text-brand-700">${e(book.categoryName ?? book.categoryId)}</p></div>
  </article>`;
}
