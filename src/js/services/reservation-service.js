import { read, write } from '../utils/storage.js';
import { waitForIdle } from '../utils/idle.js';

const KEY = 'pustakaloka:reservations';

export const getReservations = async () => {
  await waitForIdle();
  return read(KEY, []);
};

export async function saveReservation(values) {
  const code = `RSV-${values.date.replaceAll('-', '')}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  const reservation = { ...values, code, createdAt: new Date().toISOString(), status: 'pending' };
  write(KEY, [reservation, ...(await getReservations())]);
  return reservation;
}

export async function cancelReservation(code) {
  write(
    KEY,
    (await getReservations()).filter((reservation) => reservation.code !== code),
  );
}
