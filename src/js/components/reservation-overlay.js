import { icon } from '../utils/icons.js';
import { escapeHTML as e } from '../utils/escape.js';

let returnFocus;

function focusableElements(dialog) {
  return [
    ...dialog.querySelectorAll(
      'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])',
    ),
  ].filter((element) => !element.disabled);
}

function closeReservationOverlay({ restoreFocus = true } = {}) {
  const overlay = document.querySelector('[data-reservation-overlay]');
  if (!overlay) return;

  overlay.remove();
  document.body.classList.remove('overflow-hidden');
  document.removeEventListener('keydown', handleKeydown);
  if (restoreFocus && returnFocus?.isConnected) returnFocus.focus();
  returnFocus = null;
}

function handleKeydown(event) {
  const dialog = document.querySelector('[data-reservation-overlay] [role="dialog"]');
  if (!dialog) return;
  if (event.key === 'Escape') {
    closeReservationOverlay();
    return;
  }
  if (event.key !== 'Tab') return;

  const elements = focusableElements(dialog);
  if (!elements.length) return;
  const first = elements[0];
  const last = elements.at(-1);
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

export function showReservationOverlay(reservation, focusTarget) {
  closeReservationOverlay({ restoreFocus: false });
  returnFocus = focusTarget;

  const overlay = document.createElement('div');
  overlay.dataset.reservationOverlay = '';
  overlay.className = 'fixed inset-0 z-50 flex items-center justify-center bg-ink-900/70 p-4';
  overlay.innerHTML = `<div class="relative w-full max-w-md rounded-sm bg-white p-6 shadow-card-hover sm:p-8" role="dialog" aria-modal="true" aria-labelledby="reservation-overlay-title" aria-describedby="reservation-overlay-description"><button class="absolute right-4 top-4 grid size-11 place-items-center rounded-full text-subtle hover:bg-brand-50 hover:text-brand-700" type="button" data-reservation-overlay-close aria-label="Tutup konfirmasi">${icon('x', { class: 'size-5' })}</button><div class="mx-auto grid size-16 place-items-center rounded-full bg-success-50 text-success-700">${icon('check', { class: 'size-8' })}</div><h2 id="reservation-overlay-title" class="mt-5 text-center text-2xl">Reservasi berhasil dibuat</h2><p id="reservation-overlay-description" class="mt-2 text-center text-sm">Simpan kode reservasi berikut untuk ditunjukkan saat kunjungan.</p><div class="mt-5 rounded bg-brand-50 p-4 text-center"><span class="block text-xs font-semibold uppercase tracking-wider text-brand-900">Kode reservasi</span><strong class="mt-1 block text-2xl tracking-wider text-brand-700">${e(reservation.code)}</strong></div><p class="mt-4 text-center text-xs text-subtle">Reservasi tersimpan di perangkat ini dalam mode demo.</p><button class="btn-primary mt-6 w-full" type="button" data-reservation-overlay-close>Tutup</button></div>`;
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay || event.target.closest('[data-reservation-overlay-close]')) {
      closeReservationOverlay();
    }
  });
  document.body.append(overlay);
  document.body.classList.add('overflow-hidden');
  document.addEventListener('keydown', handleKeydown);
  overlay.querySelector('[data-reservation-overlay-close]')?.focus();
}
