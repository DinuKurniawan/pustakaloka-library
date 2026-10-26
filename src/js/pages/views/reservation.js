import { getLibrarians, getServices, getSite } from '../../services/content-service.js';
import {
  cancelReservation,
  getReservations,
  saveReservation,
} from '../../services/reservation-service.js';
import { showToast } from '../../components/toast.js';
import { datePlusDays, todayISO } from '../../utils/format.js';
import { escapeHTML as e } from '../../utils/escape.js';
import { getParams } from '../../utils/url.js';
import { icon } from '../../utils/icons.js';
import { validateDate, validators } from '../../utils/validate.js';
import { main, renderPageShell } from './shell.js';

async function reservationFormMarkup() {
  const [services, librarians] = await Promise.all([getServices(), getLibrarians()]);
  return `<form class="grid gap-4" data-reservation-form novalidate><div><label class="mb-1 block text-[13px] font-medium text-ink-700" for="reservation-name">Nama lengkap *</label><input class="field" id="reservation-name" name="name" autocomplete="name" required /><p class="mt-1 text-[13px] text-danger-700" data-error="name"></p></div><div><label class="mb-1 block text-[13px] font-medium text-ink-700" for="reservation-phone">Telepon / WhatsApp *</label><input class="field" id="reservation-phone" name="phone" type="tel" autocomplete="tel" required /><p class="mt-1 text-[13px] text-danger-700" data-error="phone"></p></div><div><label class="mb-1 block text-[13px] font-medium text-ink-700" for="reservation-email">Email *</label><input class="field" id="reservation-email" name="email" type="email" autocomplete="email" required /><p class="mt-1 text-[13px] text-danger-700" data-error="email"></p></div><div><label class="mb-1 block text-[13px] font-medium text-ink-700" for="reservation-date">Tanggal *</label><input class="field" id="reservation-date" name="date" type="date" min="${todayISO()}" max="${datePlusDays(30)}" required /><p class="mt-1 text-[13px] text-danger-700" data-error="date"></p></div><div><label class="mb-1 block text-[13px] font-medium text-ink-700" for="reservation-service">Layanan *</label><select class="field" id="reservation-service" name="serviceId" required><option value="">Pilih layanan</option>${services
    .filter((service) => service.reservable)
    .map((service) => `<option value="${e(service.id)}">${e(service.name)}</option>`)
    .join(
      '',
    )}</select><p class="mt-1 text-[13px] text-danger-700" data-error="serviceId"></p></div><div><label class="mb-1 block text-[13px] font-medium text-ink-700" for="reservation-librarian">Pustakawan</label><select class="field" id="reservation-librarian" name="librarianId"><option value="">Pilih jika perlu konsultasi</option>${librarians.map((person) => `<option value="${e(person.id)}">${e(person.name)} — ${e(person.field)}</option>`).join('')}</select></div><div class="sm:col-span-2"><label class="mb-1 block text-[13px] font-medium text-ink-700" for="reservation-note">Catatan</label><textarea class="field min-h-24 py-3" id="reservation-note" name="note" rows="3" placeholder="Ceritakan kebutuhan Anda (opsional)"></textarea></div><div class="sm:col-span-2"><p class="rounded bg-brand-50 p-3 text-xs text-brand-900">Data reservasi hanya tersimpan di perangkat ini dalam mode demo.</p><button class="btn-primary mt-2 w-full" type="submit">Buat reservasi</button></div></form>`;
}

async function reservationsMarkup() {
  const reservations = await getReservations();
  if (!reservations.length) return '';
  return `<section><h2 class="text-2xl">Reservasi saya</h2><div class="mt-5 grid gap-3">${reservations.map((reservation) => `<article class="flex flex-col justify-between gap-4 border border-line bg-white p-4 sm:flex-row sm:items-center"><div><strong class="text-brand-700">${e(reservation.code)}</strong><p class="text-sm">${e(reservation.date)} · ${e(reservation.serviceId)}</p></div><button class="btn-outline min-h-10 px-4" type="button" data-cancel-reservation="${e(reservation.code)}">Batalkan</button></article>`).join('')}</div></section>`;
}

function bindReservationForm() {
  const form = main().querySelector('[data-reservation-form]');
  if (!form) return;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(form).entries());
    const errors = {
      name: validators.name(values.name ?? ''),
      phone: validators.phone(values.phone ?? ''),
      email: validators.email(values.email ?? ''),
      date: validateDate(values.date ?? ''),
      serviceId: validators.required(values.serviceId ?? '', 'Pilih salah satu layanan.'),
    };
    let firstError;
    Object.entries(errors).forEach(([field, message]) => {
      const input = form.elements.namedItem(field);
      const output = form.querySelector(`[data-error="${field}"]`);
      input?.setAttribute('aria-invalid', String(Boolean(message)));
      if (message && !firstError) firstError = input;
      if (output) output.textContent = message;
    });
    if (firstError) {
      firstError.focus();
      showToast('Mohon lengkapi kolom yang bertanda merah.', 'info');
      return;
    }
    const submit = form.querySelector('button[type="submit"]');
    submit.disabled = true;
    submit.textContent = 'Memproses…';
    await new Promise((resolve) => setTimeout(resolve, 600));
    const reservation = await saveReservation(values);
    const parent = form.parentElement;
    form.outerHTML = `<div class="rounded bg-brand-50 p-6 text-center" data-reservation-success><div class="mx-auto grid size-14 place-items-center rounded-full bg-white text-success-700">${icon('check', { class: 'size-8' })}</div><h3 class="mt-4 text-xl">Reservasi berhasil</h3><p class="mt-2 text-sm">Simpan kode reservasi Anda:</p><strong class="mt-2 block text-2xl tracking-wider text-brand-700">${e(reservation.code)}</strong><button class="btn-outline mt-6" type="button" data-action="new-reservation">Buat reservasi lain</button></div>`;
    const newReservationButton = parent?.querySelector('[data-action="new-reservation"]');
    newReservationButton?.addEventListener('click', () => window.location.reload());
    const { showReservationOverlay } = await import('../../components/reservation-overlay.js');
    showReservationOverlay(reservation, newReservationButton);
    showToast('Reservasi berhasil dibuat.');
  });
}

export async function render() {
  const params = getParams();
  const site = await getSite();
  renderPageShell(
    'Reservasi',
    'Pilih layanan, tanggal, dan kebutuhan Anda. Prosesnya singkat dan data hanya tersimpan di perangkat ini.',
    `<div class="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(260px,5fr)]"><div class="bg-white p-6 shadow-card md:p-8">${await reservationFormMarkup()}</div><aside class="h-fit bg-brand-50 p-6"><h2 class="text-xl">Sebelum datang</h2><ul class="mt-5 space-y-4 text-sm"><li class="flex gap-3">${icon('clock', { class: 'mt-1 size-5 shrink-0 text-brand-700' })}<span>${e(site.hours[0].days)} ${e(site.hours[0].time)}<br />${e(site.hours[1].days)} ${e(site.hours[1].time)}</span></li><li class="flex gap-3">${icon('info', { class: 'mt-1 size-5 shrink-0 text-brand-700' })}<span>Reservasi maksimal 30 hari ke depan. Minggu adalah hari tutup.</span></li><li class="flex gap-3">${icon('pin', { class: 'mt-1 size-5 shrink-0 text-brand-700' })}<span>${e(site.address)}</span></li></ul><a class="btn-outline mt-6 w-full" href="./src/pages/kontak.html">Butuh bantuan?</a></aside></div><div class="mt-16">${await reservationsMarkup()}</div>`,
  );
  const service = params.get('layanan');
  const librarian = params.get('pustakawan');
  const book = params.get('buku');
  if (service) {
    const control = main().querySelector('[name="serviceId"]');
    if (control) control.value = service;
  }
  if (librarian) {
    const control = main().querySelector('[name="librarianId"]');
    if (control) control.value = librarian;
  }
  if (book) {
    const note = main().querySelector('[name="note"]');
    if (note) note.value = `Reservasi buku: ${book}`;
  }
  bindReservationForm();
  main()
    .querySelectorAll('[data-cancel-reservation]')
    .forEach((button) => {
      button.addEventListener('click', async () => {
        await cancelReservation(button.dataset.cancelReservation);
        showToast('Reservasi dibatalkan.');
        await render();
      });
    });
}
