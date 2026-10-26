import { bookCard } from '../../components/book-card.js';
import { getBookById } from '../../services/book-service.js';
import { getBookmarks } from '../../services/bookmark-service.js';
import { categoryName, renderPageShell, emptyState } from './shell.js';

export async function render() {
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
