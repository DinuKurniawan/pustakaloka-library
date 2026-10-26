import { icon } from '../utils/icons.js';
import { escapeHTML as e } from '../utils/escape.js';

export const accordion = (items) =>
  `<div class="divide-y divide-line border-y border-line">${items.map((item, index) => `<div><h3><button type="button" class="flex min-h-14 w-full items-center justify-between gap-4 py-4 text-left font-semibold" data-action="accordion" aria-expanded="${index === 0}" aria-controls="faq-panel-${index}">${e(item.question)}<span data-icon>${icon(index === 0 ? 'x' : 'plus', { class: 'size-5 shrink-0 text-brand-700' })}</span></button></h3><div id="faq-panel-${index}" class="pb-4 pr-10 text-sm leading-7 text-body ${index === 0 ? '' : 'hidden'}">${e(item.answer)}</div></div>`).join('')}</div>`;
