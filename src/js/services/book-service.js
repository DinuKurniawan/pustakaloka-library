import { books } from '../data/books.js';
import { normalize } from '../utils/format.js';

export async function searchBooks({
  q = '',
  categories: categoryIds = [],
  language = '',
  onlyAvailable = false,
  sort = 'newest',
  page = 1,
  perPage = 12,
} = {}) {
  const needle = normalize(q);
  let list = books.filter((book) => {
    const haystack = normalize([book.title, book.author, book.isbn, ...book.tags].join(' '));
    return (
      (!needle || haystack.includes(needle)) &&
      (!categoryIds.length || categoryIds.includes(book.categoryId)) &&
      (!language || book.language === language) &&
      (!onlyAvailable || book.stock.available > 0)
    );
  });
  const sorters = {
    newest: (a, b) => b.addedAt.localeCompare(a.addedAt),
    az: (a, b) => a.title.localeCompare(b.title, 'id'),
    za: (a, b) => b.title.localeCompare(a.title, 'id'),
    popular: (a, b) => b.popularity - a.popularity,
  };
  list = [...list].sort(sorters[sort] ?? sorters.newest);
  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const currentPage = Math.min(Math.max(1, Number(page) || 1), totalPages);
  return {
    items: list.slice((currentPage - 1) * perPage, currentPage * perPage),
    total,
    page: currentPage,
    totalPages,
  };
}

export const getBookById = async (id) => books.find((book) => book.id === id) ?? null;

export const getRelatedBooks = async (book, limit = 4) =>
  books
    .filter((item) => item.categoryId === book.categoryId && item.id !== book.id)
    .slice(0, limit);
