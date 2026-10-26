import { icon } from '../utils/icons.js';
import { escapeHTML as e } from '../utils/escape.js';

let timer;
export function showToast(message, type = 'success') {
  let container = document.querySelector('[data-toast]');
  if (!container) {
    container = document.createElement('div');
    container.dataset.toast = '';
    container.className = 'fixed bottom-4 right-4 z-[60] w-[min(90vw,380px)]';
    document.body.append(container);
  }
  container.innerHTML = `<div class="flex items-start gap-3 rounded bg-ink-900 p-4 text-sm text-white shadow-card-hover" role="status" aria-live="polite">${icon(type === 'success' ? 'check' : 'info', { class: 'size-5 shrink-0 text-brand-300' })}<span>${e(message)}</span><button type="button" class="ml-auto" data-action="close-toast" aria-label="Tutup">${icon('x', { class: 'size-5' })}</button></div>`;
  clearTimeout(timer);
  timer = setTimeout(() => container.replaceChildren(), 4000);
}
