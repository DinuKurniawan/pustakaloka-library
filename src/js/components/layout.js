import { headerMarkup, updateBookmarkCount } from './header.js';
import { footerMarkup } from './footer.js';
import { showToast } from './toast.js';

function closeMobile() {
  const root = document.querySelector('[data-mobile-root]');
  const trigger = document.querySelector('[data-action="open-mobile"]');
  root?.classList.add('hidden');
  trigger?.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('overflow-hidden');
}

function closeMoreMenu() {
  document.querySelector('#more-menu')?.classList.add('hidden');
  document.querySelector('[data-action="more-menu"]')?.setAttribute('aria-expanded', 'false');
}

export function mountLayout() {
  const current = document.body.dataset.page;
  document.querySelector('#site-header').innerHTML = headerMarkup(current);
  document.querySelector('#site-footer').innerHTML = footerMarkup();
  document.querySelectorAll('[data-year]').forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });
  updateBookmarkCount();
  window.addEventListener('bookmarks-changed', updateBookmarkCount);
  document.addEventListener('click', (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'open-mobile') {
      document.querySelector('[data-mobile-root]')?.classList.remove('hidden');
      event.target.closest('button').setAttribute('aria-expanded', 'true');
      document.body.classList.add('overflow-hidden');
      document.querySelector('[data-mobile-panel] button')?.focus();
    }
    if (
      action === 'close-mobile' ||
      (action === undefined && event.target.matches('[data-mobile-root]'))
    )
      closeMobile();
    if (action === 'open-search') {
      document.querySelector('#search-overlay')?.classList.remove('hidden');
      document.querySelector('#global-search')?.focus();
    }
    if (action === 'close-search')
      document.querySelector('#search-overlay')?.classList.add('hidden');
    if (action === 'more-menu') {
      const button = event.target.closest('button');
      const menu = document.querySelector('#more-menu');
      const open = menu.classList.toggle('hidden');
      button.setAttribute('aria-expanded', String(!open));
    }
    if (
      action !== 'more-menu' &&
      !event.target.closest('#more-menu') &&
      !event.target.closest('[data-action="more-menu"]')
    )
      closeMoreMenu();
    if (action === 'close-toast') event.target.closest('[data-toast]')?.replaceChildren();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMobile();
      document.querySelector('#search-overlay')?.classList.add('hidden');
      closeMoreMenu();
    }
  });
  document.querySelector('[data-search-form]')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const query = new FormData(event.currentTarget).get('q')?.toString().trim() ?? '';
    window.location.href = `./src/pages/katalog.html${query ? `?q=${encodeURIComponent(query)}` : ''}`;
  });
  document.querySelector('#site-footer')?.addEventListener('click', (event) => {
    if (event.target.closest('[href^="https://www."]')) return;
  });
  document.addEventListener('click', (event) => {
    if (event.target.closest('[data-action="toast-demo"]')) showToast('Aksi berhasil diproses.');
  });
}
