const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^(\+62|62|0)8[0-9]{8,12}$/;

export const validators = {
  name: (value) =>
    value.trim().length >= 3 && value.trim().length <= 80
      ? ''
      : 'Nama lengkap wajib diisi (minimal 3 karakter).',
  email: (value) =>
    EMAIL.test(value.trim()) ? '' : 'Format email tidak valid, contoh: nama@email.com.',
  phone: (value) =>
    PHONE.test(value.trim()) ? '' : 'Nomor telepon tidak valid, contoh: 081234567890.',
  required: (value, message = 'Kolom ini wajib diisi.') => (String(value).trim() ? '' : message),
};

export function validateDate(value) {
  if (!value) return 'Pilih tanggal reservasi.';
  const chosen = new Date(`${value}T00:00:00`);
  const today = new Date(`${new Date().toISOString().slice(0, 10)}T00:00:00`);
  const max = new Date(today);
  max.setDate(max.getDate() + 30);
  if (chosen < today || chosen > max)
    return 'Pilih tanggal mulai hari ini sampai 30 hari ke depan.';
  if (chosen.getDay() === 0) return 'Perpustakaan tutup pada hari Minggu.';
  return '';
}
