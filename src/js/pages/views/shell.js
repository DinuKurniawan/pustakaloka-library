import { breadcrumb } from '../../components/breadcrumb.js';
import { bookCard } from '../../components/book-card.js';
import { categories } from '../../data/categories.js';
import { icon } from '../../utils/icons.js';
import { escapeHTML as e } from '../../utils/escape.js';

export const main = () => document.querySelector('#main');

export const categoryName = (id) =>
  categories.find((category) => category.id === id)?.name ?? (id === 'umum' ? 'Katalog umum' : id);

export const pageBanner = (title) =>
  `<section class="page-banner"><div class="container-page">${breadcrumb([{ label: title }], { dark: true })}<h1 class="text-3xl font-bold text-white md:text-5xl">${e(title)}</h1></div></section>`;

export function renderPageShell(title, subtitle, content, className = 'section') {
  main().innerHTML = `${pageBanner(title)}<section class="${className}"><div class="container-page">${subtitle ? `<p class="mx-auto mb-10 max-w-2xl text-center text-body">${e(subtitle)}</p>` : ''}${content}</div></section>`;
}

export const emptyState = (
  title,
  text,
  href = './src/pages/katalog.html',
  label = 'Lihat katalog',
) =>
  `<div class="col-span-full py-16 text-center"><div class="mx-auto grid size-20 place-items-center rounded-full bg-brand-50 text-brand-300">${icon('book-open', { class: 'size-10' })}</div><h2 class="mt-6 text-2xl">${e(title)}</h2><p class="mx-auto mt-2 max-w-md text-sm">${e(text)}</p><a class="btn-primary mt-6" href="${e(href)}">${e(label)}</a></div>`;

export function renderBookGrid(items, savedIds = [], options = {}) {
  return items.length
    ? items
        .map((book) =>
          bookCard(
            { ...book, categoryName: categoryName(book.categoryId) },
            { saved: savedIds.includes(book.id), ...options },
          ),
        )
        .join('')
    : emptyState('Belum ada buku yang cocok', 'Coba kata kunci lain atau reset filter.');
}

export function collectionPanel(category) {
  return `<div class="overflow-hidden bg-white shadow-card"><img src="${e(category.banner)}" srcset="${e(category.banner.replace(/\.webp$/, '-768.webp'))} 768w, ${e(category.banner)} 1200w" sizes="(min-width: 768px) 683px, calc(100vw - 32px)" alt="Foto koleksi ${e(category.name)}" width="1200" height="800" loading="lazy" decoding="async" class="h-[260px] w-full object-cover md:h-[360px]" /><div class="p-6 md:p-8"><p class="text-sm font-semibold uppercase tracking-wider text-brand-700">Tentang koleksi</p><h3 class="mt-2 text-2xl">${e(category.name)}</h3><p class="mt-3 max-w-2xl leading-7">${e(category.description)}</p><ul class="mt-5 grid gap-2 sm:grid-cols-2">${category.highlights.map((item) => `<li class="flex items-start gap-2 text-sm">${icon('check', { class: 'mt-1 size-4 shrink-0 text-brand-700' })}<span>${e(item)}</span></li>`).join('')}</ul><a class="btn-primary mt-6" href="./src/pages/katalog.html?kategori=${encodeURIComponent(category.id)}">Lihat di katalog</a></div></div>`;
}
