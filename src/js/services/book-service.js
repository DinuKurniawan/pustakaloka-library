const SEARCH_URL = 'https://openlibrary.org/search.json';
const OPEN_LIBRARY_URL = 'https://openlibrary.org';
const COVER_URL = 'https://covers.openlibrary.org/b/id';
const FALLBACK_COVER = './assets/img/buku/cover.svg';
const MAX_SEARCH_PAGE = 1000;
const DEFAULT_BROWSE_QUERY = 'book';
const SEARCH_FIELDS = [
  'key',
  'title',
  'author_name',
  'cover_i',
  'first_publish_year',
  'ratings_average',
  'ratings_count',
].join(',');

const CATEGORY_SUBJECTS = {
  fiksi: 'fiction',
  sains: 'science',
  teknologi: 'technology',
  sejarah: 'history',
  anak: 'children',
  bisnis: 'business',
  seni: 'art',
};

const LANGUAGE_CODES = {
  id: 'ind',
  en: 'eng',
  fr: 'fre',
  de: 'ger',
  es: 'spa',
};

const bookCache = new Map();
const authorCache = new Map();

function asArray(value) {
  if (Array.isArray(value)) return value;
  return value ? [value] : [];
}

function firstValue(value, fallback = '') {
  const values = asArray(value);
  return values[0] ?? fallback;
}

function cleanId(value) {
  return String(value ?? '')
    .split('/')
    .filter(Boolean)
    .pop();
}

function resourcePath(id) {
  return id.endsWith('M') ? `books/${id}` : `works/${id}`;
}

function coverFromId(coverId) {
  return coverId ? `${COVER_URL}/${encodeURIComponent(coverId)}-M.jpg` : FALLBACK_COVER;
}

function normalizeLanguage(value) {
  const raw = firstValue(value);
  const code = cleanId(typeof raw === 'string' ? raw : (raw?.key ?? raw?.language ?? ''));
  const languageMap = { ind: 'id', eng: 'en', fre: 'fr', ger: 'de', spa: 'es' };
  return languageMap[code] ?? (code || 'unknown');
}

function yearFrom(value) {
  const match = String(value ?? '').match(/\d{4}/);
  return match ? Number(match[0]) : 0;
}

function descriptionFrom(value, fallback) {
  if (typeof value === 'string') return value;
  if (value && typeof value.value === 'string') return value.value;
  return fallback;
}

function normalizeSubjects(value) {
  return asArray(value)
    .map((subject) => (typeof subject === 'string' ? subject : (subject?.name ?? '')))
    .filter(Boolean);
}

function inferCategory(subjects = []) {
  const haystack = subjects.join(' ').toLowerCase();
  const entry = Object.entries(CATEGORY_SUBJECTS).find(([, subject]) => haystack.includes(subject));
  return entry?.[0] ?? 'umum';
}

function publisherName(value) {
  const publisher = firstValue(value, 'Tidak tersedia');
  return typeof publisher === 'string' ? publisher : (publisher?.name ?? 'Tidak tersedia');
}

function authorKey(value) {
  if (typeof value === 'string') return value;
  return value?.author?.key ?? value?.key ?? '';
}

async function fetchJSON(url) {
  const response = await globalThis.fetch(url);
  if (!response.ok) {
    const error = new Error(`Open Library merespons HTTP ${response.status}.`);
    error.status = response.status;
    throw error;
  }
  return response.json();
}

function toBook({
  id,
  title,
  authors,
  cover,
  isbn,
  categoryId,
  publisher,
  year,
  pages,
  language,
  synopsis,
  subjects,
  rating,
  popularity,
  editionId,
}) {
  const book = {
    id,
    title: title || 'Tanpa judul',
    author: authors.length ? authors.join(', ') : 'Penulis tidak diketahui',
    isbn: isbn || 'Tidak tersedia',
    categoryId: categoryId || inferCategory(subjects),
    publisher: publisher || 'Tidak tersedia',
    year: year || 'Tidak tersedia',
    pages: pages || 0,
    language: language || 'unknown',
    edition: editionId || 'Open Library',
    synopsis: synopsis || 'Deskripsi buku belum tersedia dari Open Library.',
    tags: subjects.slice(0, 8),
    subjects,
    cover: cover || FALLBACK_COVER,
    stock: { total: 0, available: 0, known: false },
    shelf: 'Ketersediaan perlu dikonfirmasi',
    rating: Number(rating) || 0,
    popularity: Number(popularity) || 0,
    addedAt: year ? `${year}-01-01` : '1970-01-01',
    source: 'Open Library',
    sourceUrl: `${OPEN_LIBRARY_URL}/${resourcePath(id)}`,
  };

  bookCache.set(id, book);
  return book;
}

function normalizeSearchDoc(doc, requestedCategory = '') {
  const id = cleanId(doc.key || firstValue(doc.edition_key));
  if (!id) return null;

  const subjects = asArray(doc.subject).filter(Boolean);
  const requestedLanguage = normalizeLanguage(doc.language);
  return toBook({
    id,
    title: doc.title,
    authors: asArray(doc.author_name),
    cover: coverFromId(doc.cover_i),
    isbn: firstValue(doc.isbn),
    categoryId: requestedCategory || inferCategory(subjects),
    publisher: publisherName(doc.publisher),
    year: Number(doc.first_publish_year) || 0,
    pages: Number(doc.number_of_pages_median) || 0,
    language: requestedLanguage,
    synopsis: firstValue(doc.first_sentence, doc.subtitle ?? ''),
    subjects,
    rating: doc.ratings_average,
    popularity: doc.ratings_count,
    editionId: firstValue(doc.edition_key),
  });
}

function buildQuery(query, categoryIds, language) {
  const parts = [];
  const keyword = String(query ?? '').trim();

  // Wildcard `title:*` memaksa Open Library memindai katalog besar sebelum mengurutkan hasil.
  // Query biasa jauh lebih ringan dan tetap mencari judul, penulis, serta ISBN.
  if (keyword) parts.push(keyword);

  const category = categoryIds.map((id) => CATEGORY_SUBJECTS[id] ?? id).find(Boolean);
  if (category) parts.push(`subject:${category}`);

  const languageCode = LANGUAGE_CODES[language] ?? language;
  if (languageCode) parts.push(`language:${languageCode}`);

  // Search API membutuhkan query untuk mode jelajah tanpa filter; gunakan istilah umum,
  // bukan wildcard, agar beranda dan katalog awal tidak menunggu query global.
  return parts.join(' ') || DEFAULT_BROWSE_QUERY;
}

/**
 * Mencari buku dari Open Library lalu mengubah hasilnya ke skema Pustakaloka.
 * @param {{q?: string, categories?: string[], language?: string, onlyAvailable?: boolean, sort?: string, page?: number, perPage?: number}} params
 * @returns {Promise<{items: object[], total: number, page: number, totalPages: number}>}
 */
export async function searchBooks({
  q = '',
  categories = [],
  language = '',
  onlyAvailable = false,
  sort = 'newest',
  page = 1,
  perPage = 12,
} = {}) {
  const currentPage = Math.min(MAX_SEARCH_PAGE, Math.max(1, Number(page) || 1));
  const limit = Math.min(100, Math.max(1, Number(perPage) || 12));
  const sortValue = { newest: 'new', az: 'title', za: 'title', popular: 'rating' }[sort] ?? 'new';
  const categoryId = categories[0] ?? '';
  const params = new URLSearchParams({
    q: buildQuery(q, categories, language),
    page: String(currentPage),
    limit: String(limit),
    sort: sortValue,
    fields: SEARCH_FIELDS,
  });

  // Open Library tidak menyediakan stok perpustakaan lokal.
  void onlyAvailable;
  let data = await fetchJSON(`${SEARCH_URL}?${params.toString()}`);
  const total = Number(data.numFound) || 0;
  const totalPages = Math.min(MAX_SEARCH_PAGE, Math.max(1, Math.ceil(total / limit)));
  const effectivePage = Math.min(currentPage, totalPages);

  if (effectivePage !== currentPage) {
    params.set('page', String(effectivePage));
    data = await fetchJSON(`${SEARCH_URL}?${params.toString()}`);
  }

  let items = asArray(data.docs)
    .map((doc) => normalizeSearchDoc(doc, categoryId))
    .filter(Boolean);

  if (sort === 'za') items = items.reverse();

  return {
    items,
    total,
    page: effectivePage,
    totalPages,
  };
}

async function getAuthorName(key) {
  const id = cleanId(key);
  if (!id) return '';
  if (authorCache.has(id)) return authorCache.get(id);

  const data = await fetchJSON(`${OPEN_LIBRARY_URL}/authors/${id}.json`);
  const name = data.name ?? '';
  authorCache.set(id, name);
  return name;
}

async function getAuthorNames(authors) {
  const keys = asArray(authors).map(authorKey).filter(Boolean).slice(0, 4);
  const names = await Promise.all(keys.map((key) => getAuthorName(key).catch(() => '')));
  return names.filter(Boolean);
}

function editionFromResponse(data) {
  return firstValue(data?.entries, {}) || {};
}

async function normalizeWork(id, work) {
  const editionResponse = await fetchJSON(
    `${OPEN_LIBRARY_URL}/works/${id}/editions.json?limit=1`,
  ).catch(() => null);
  const edition = editionFromResponse(editionResponse);
  const authors = await getAuthorNames(work.authors ?? edition.authors ?? []);
  const subjects = normalizeSubjects(work.subjects ?? edition.subjects);
  const coverId = firstValue(work.covers, firstValue(edition.covers));
  const publishDate = work.first_publish_date ?? edition.publish_date;

  return toBook({
    id,
    title: work.title ?? edition.title,
    authors,
    cover: coverFromId(coverId),
    isbn: firstValue(edition.isbn_13, firstValue(edition.isbn_10)),
    categoryId: inferCategory(subjects),
    publisher: publisherName(edition.publishers),
    year: yearFrom(publishDate),
    pages: Number(edition.number_of_pages) || 0,
    language: normalizeLanguage(edition.languages),
    synopsis: descriptionFrom(work.description, descriptionFrom(edition.description, '')),
    subjects,
    rating: 0,
    popularity: 0,
    editionId: cleanId(edition.key),
  });
}

async function normalizeEdition(id, edition) {
  const authors = await getAuthorNames(edition.authors ?? []);
  const subjects = normalizeSubjects(edition.subjects);
  return toBook({
    id,
    title: edition.title,
    authors,
    cover: coverFromId(firstValue(edition.covers)),
    isbn: firstValue(edition.isbn_13, firstValue(edition.isbn_10)),
    categoryId: inferCategory(subjects),
    publisher: publisherName(edition.publishers),
    year: yearFrom(edition.publish_date),
    pages: Number(edition.number_of_pages) || 0,
    language: normalizeLanguage(edition.languages),
    synopsis: descriptionFrom(edition.description, ''),
    subjects,
    rating: 0,
    popularity: 0,
    editionId: id,
  });
}

export async function getBookById(id) {
  const cleanBookId = cleanId(id);
  if (!cleanBookId) return null;
  if (bookCache.has(cleanBookId)) return bookCache.get(cleanBookId);

  let data;
  try {
    data = await fetchJSON(`${OPEN_LIBRARY_URL}/${resourcePath(cleanBookId)}.json`);
  } catch (error) {
    if (error.status === 404) return null;
    throw error;
  }
  const book = cleanBookId.endsWith('M')
    ? await normalizeEdition(cleanBookId, data)
    : await normalizeWork(cleanBookId, data);
  return bookCache.set(cleanBookId, book).get(cleanBookId);
}

export async function getRelatedBooks(book, limit = 4) {
  const category = book.categoryId === 'umum' ? [] : [book.categoryId];
  const result = await searchBooks({
    q: book.subjects?.[0] ?? '',
    categories: category,
    sort: 'popular',
    perPage: limit + 1,
  });
  return result.items.filter((item) => item.id !== book.id).slice(0, limit);
}
