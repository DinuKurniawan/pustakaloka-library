import { escapeHTML as e } from '../utils/escape.js';

export const breadcrumb = (items, { dark = false } = {}) => {
  const linkClass = dark ? 'text-white hover:text-brand-200' : 'text-brand-700 hover:underline';
  const currentClass = dark ? 'text-white' : 'text-subtle';
  return `<nav class="mb-6" aria-label="Breadcrumb"><ol class="flex flex-wrap items-center gap-2 text-[13px]"><li><a class="${linkClass}" href="./index.html">Beranda</a></li>${items.map((item, index) => `<li class="flex items-center gap-2"${index === items.length - 1 ? ' aria-current="page"' : ''}><span aria-hidden="true">›</span>${item.href ? `<a class="${linkClass}" href="${e(item.href)}">${e(item.label)}</a>` : `<span class="${currentClass}">${e(item.label)}</span>`}</li>`).join('')}</ol></nav>`;
};
