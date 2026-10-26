import { read, write } from '../utils/storage.js';
import { waitForIdle } from '../utils/idle.js';

const KEY = 'pustakaloka:bookmarks';

export const getBookmarks = async () => {
  await waitForIdle();
  return read(KEY, []);
};

export async function toggleBookmark(bookId) {
  const current = await getBookmarks();
  const next = current.includes(bookId)
    ? current.filter((id) => id !== bookId)
    : [...current, bookId];
  write(KEY, next);
  return { saved: next.includes(bookId), count: next.length };
}

export async function removeBookmark(bookId) {
  const next = (await getBookmarks()).filter((id) => id !== bookId);
  write(KEY, next);
  return next;
}

export async function clearBookmarks() {
  write(KEY, []);
}
