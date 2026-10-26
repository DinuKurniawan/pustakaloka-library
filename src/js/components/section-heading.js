import { icon } from '../utils/icons.js';
import { escapeHTML as e } from '../utils/escape.js';

export const sectionHeading = ({ title, subtitle = '' }) => `
  <div class="mb-12 text-center md:mb-14">
    <h2 class="text-[1.75rem] font-bold uppercase tracking-wide text-ink-900 md:text-[2rem]">${e(title)}</h2>
    ${subtitle ? `<p class="mx-auto mt-2 max-w-xl text-sm text-body">${e(subtitle)}</p>` : ''}
    <div class="mt-4 flex items-center justify-center gap-3" aria-hidden="true">
      <span class="h-px w-16 bg-line"></span>${icon('book-open', { class: 'size-5 text-brand-500' })}<span class="h-px w-16 bg-line"></span>
    </div>
  </div>`;
