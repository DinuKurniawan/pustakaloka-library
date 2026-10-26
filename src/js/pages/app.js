import { mountLayout } from '../components/layout.js';
import { showToast } from '../components/toast.js';
import { icon } from '../utils/icons.js';

const main = () => document.querySelector('#main');

const viewLoaders = {
  about: () => import('./views/about.js'),
  collections: () => import('./views/collections.js'),
  contact: () => import('./views/contact.js'),
  librarians: () => import('./views/librarians.js'),
  membership: () => import('./views/membership.js'),
  news: () => import('./views/news.js'),
  'news-detail': () => import('./views/news-detail.js'),
  'not-found': () => import('./views/not-found.js'),
  reservation: () => import('./views/reservation.js'),
  saved: () => import('./views/saved.js'),
  services: () => import('./views/services.js'),
};

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

function addBackToTop() {
  const button = document.createElement('button');
  button.type = 'button';
  button.className =
    'fixed bottom-4 left-4 z-30 hidden size-11 place-items-center rounded-full bg-brand-700 text-white shadow-card hover:bg-brand-800';
  button.dataset.backTop = '';
  button.setAttribute('aria-label', 'Kembali ke atas');
  button.innerHTML = icon('arrow', { class: 'size-5 -rotate-90' });
  button.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  document.body.append(button);
  window.addEventListener('scroll', () => button.classList.toggle('hidden', window.scrollY < 400));
}

async function handleCommonAction(event) {
  const control = event.target.closest('[data-action]');
  if (!control) return;
  if (control.dataset.action === 'bookmark') {
    const { toggleBookmark } = await import('../services/bookmark-service.js');
    const result = await toggleBookmark(control.dataset.id);
    control.setAttribute('aria-pressed', String(result.saved));
    control.setAttribute('aria-label', `${result.saved ? 'Hapus' : 'Simpan'} buku dari simpanan`);
    control.innerHTML = icon(result.saved ? 'bookmark-filled' : 'bookmark', { class: 'size-5' });
    showToast(result.saved ? 'Buku disimpan.' : 'Buku dihapus dari simpanan.');
    window.dispatchEvent(new Event('bookmarks-changed'));
  }
  if (control.dataset.action === 'remove-bookmark') {
    const { removeBookmark } = await import('../services/bookmark-service.js');
    await removeBookmark(control.dataset.id);
    control.closest('article')?.remove();
    showToast('Buku dihapus dari simpanan.');
    window.dispatchEvent(new Event('bookmarks-changed'));
    if (!document.querySelector('[data-saved-card]')) {
      const grid = document.querySelector('[data-saved-grid]');
      if (grid)
        grid.innerHTML = `<div class="col-span-full py-16 text-center"><h2 class="text-2xl">Belum ada simpanan</h2><p class="mx-auto mt-2 max-w-md text-sm">Tekan ikon bookmark pada buku yang ingin Anda baca nanti.</p><a class="btn-primary mt-6" href="./src/pages/katalog.html">Lihat katalog</a></div>`;
    }
  }
  if (control.dataset.action === 'accordion') {
    const panel = document.getElementById(control.getAttribute('aria-controls'));
    const expanded = control.getAttribute('aria-expanded') === 'true';
    control.setAttribute('aria-expanded', String(!expanded));
    panel?.classList.toggle('hidden', expanded);
    const iconTarget = control.querySelector('[data-icon]');
    if (iconTarget)
      iconTarget.innerHTML = icon(expanded ? 'plus' : 'x', {
        class: 'size-5 shrink-0 text-brand-700',
      });
  }
}

function bindShellActions() {
  document.addEventListener('click', (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'open-mobile') {
      document.querySelector('[data-mobile-root]')?.classList.remove('hidden');
      event.target.closest('button')?.setAttribute('aria-expanded', 'true');
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
      const open = menu?.classList.toggle('hidden');
      button?.setAttribute('aria-expanded', String(!open));
    }
    if (
      action !== 'more-menu' &&
      !event.target.closest('#more-menu') &&
      !event.target.closest('[data-action="more-menu"]')
    )
      closeMoreMenu();
    if (action === 'close-toast') event.target.closest('[data-toast]')?.replaceChildren();
    if (action === 'toast-demo') showToast('Aksi berhasil diproses.');
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
}

function renderError() {
  main().innerHTML = `<section class="section"><div class="container-page"><div class="mx-auto max-w-xl bg-danger-50 p-8 text-center"><h1 class="text-2xl font-bold text-ink-900">Halaman belum dapat dimuat</h1><p class="mt-3 text-sm text-body">Periksa koneksi Anda lalu coba muat ulang halaman.</p><button class="btn-primary mt-6" type="button" data-action="reload-page">Coba lagi</button></div></div></section>`;
  main()
    .querySelector('[data-action="reload-page"]')
    ?.addEventListener('click', () => window.location.reload());
}

export async function startPage(page) {
  mountLayout();
  bindShellActions();
  document.addEventListener('click', handleCommonAction);
  addBackToTop();
  try {
    const loader = viewLoaders[page] ?? viewLoaders['not-found'];
    await (await loader()).render();
  } catch (error) {
    console.error(error);
    renderError();
  }
}
