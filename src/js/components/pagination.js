export const pagination = ({ page, totalPages, baseParams = {} }) => {
  if (totalPages <= 1) return '';
  const numbers = Array.from({ length: totalPages }, (_, index) => index + 1).filter(
    (number) => number === 1 || number === totalPages || Math.abs(number - page) <= 1,
  );
  let previous = 0;
  const links = numbers
    .map((number) => {
      const gap =
        number - previous > 1
          ? '<span class="grid size-10 place-items-center text-subtle">…</span>'
          : '';
      previous = number;
      const params = new URLSearchParams({ ...baseParams, hal: number });
      return `${gap}<a href="?${params.toString()}" class="grid size-10 place-items-center border ${number === page ? 'border-brand-700 bg-brand-700 text-white' : 'border-line bg-white text-ink-700 hover:border-brand-700'}" ${number === page ? 'aria-current="page"' : ''}>${number}</a>`;
    })
    .join('');
  const previousParams = new URLSearchParams({ ...baseParams, hal: Math.max(1, page - 1) });
  const nextParams = new URLSearchParams({ ...baseParams, hal: Math.min(totalPages, page + 1) });
  return `<nav class="mt-10 flex items-center justify-center gap-2" aria-label="Paginasi"><a class="grid min-h-10 place-items-center border border-line px-3 text-sm ${page === 1 ? 'pointer-events-none opacity-50' : 'hover:border-brand-700'}" href="?${previousParams.toString()}" aria-label="Halaman sebelumnya">Sebelumnya</a>${links}<a class="grid min-h-10 place-items-center border border-line px-3 text-sm ${page === totalPages ? 'pointer-events-none opacity-50' : 'hover:border-brand-700'}" href="?${nextParams.toString()}" aria-label="Halaman berikutnya">Berikutnya</a></nav>`;
};
