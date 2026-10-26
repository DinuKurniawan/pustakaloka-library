export const normalize = (value = '') =>
  String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

export const formatDate = (value) =>
  new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' }).format(new Date(value));

export const todayISO = () => new Date().toISOString().slice(0, 10);

export const datePlusDays = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};
