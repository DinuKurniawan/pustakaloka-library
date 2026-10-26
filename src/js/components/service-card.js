import { icon } from '../utils/icons.js';
import { escapeHTML as e } from '../utils/escape.js';

export const serviceCard = (service) =>
  `<a href="./src/pages/layanan.html#${e(service.id)}" class="group block bg-white px-5 py-8 text-center shadow-card transition duration-300 hover:-translate-y-1 hover:bg-brand-700 hover:shadow-card-hover focus-visible:-translate-y-1"><span class="mx-auto mb-5 grid size-16 place-items-center rounded-2xl border-[1.5px] border-brand-500 text-brand-700 transition group-hover:border-brand-700 group-hover:bg-white group-hover:text-brand-700">${icon(service.icon, { class: 'size-7' })}</span><h3 class="text-base font-semibold text-ink-900 group-hover:text-white">${e(service.name)}</h3><p class="mt-2 text-[13px] leading-6 text-body group-hover:text-white/90">${e(service.summary)}</p></a>`;
