import { librarianCard } from '../../components/librarian-card.js';
import { getLibrarians } from '../../services/content-service.js';
import { renderPageShell } from './shell.js';

export async function render() {
  const librarians = await getLibrarians();
  renderPageShell(
    'Pustakawan kami',
    'Kenali tim yang membantu Anda menemukan sumber, ruang, dan cara belajar yang tepat.',
    `<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">${librarians.map(librarianCard).join('')}</div>`,
  );
}
