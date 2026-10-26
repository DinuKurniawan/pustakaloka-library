import { renderPageShell, main } from './shell.js';

export function render() {
  renderPageShell(
    'Halaman tidak ditemukan',
    'Alamat yang Anda buka mungkin salah atau sudah dipindahkan.',
    `<div class="mx-auto max-w-xl text-center"><div class="text-8xl font-bold text-brand-700">404</div><p class="mt-4 text-lg">Mari kembali menemukan sesuatu yang menarik.</p><form class="mt-8 flex gap-2" data-not-found-search><label class="sr-only" for="not-found-query">Cari buku</label><input class="field" id="not-found-query" name="q" placeholder="Cari di katalog" /><button class="btn-primary shrink-0" type="submit">Cari</button></form><div class="mt-5 flex justify-center gap-3"><a class="btn-outline" href="./index.html">Beranda</a><a class="btn-outline" href="./src/pages/katalog.html">Katalog</a></div></div>`,
  );
  main()
    .querySelector('[data-not-found-search]')
    .addEventListener('submit', (event) => {
      event.preventDefault();
      const query = new FormData(event.currentTarget).get('q')?.toString().trim();
      window.location.href = `./src/pages/katalog.html${query ? `?q=${encodeURIComponent(query)}` : ''}`;
    });
}
