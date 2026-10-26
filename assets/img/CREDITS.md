# Credits aset

Foto demo sebelumnya menggunakan Unsplash dan sudah diganti dengan ilustrasi SVG lokal agar halaman awal tidak bergantung pada request gambar pihak ketiga.

- Ilustrasi lokal: `hero/hero.svg`, `koleksi/collection.svg`, `staf/librarian.svg`, dan `berita/news.svg` dibuat khusus untuk demo ini.

Semua gambar halaman beranda dan konten statis memakai SVG lokal sehingga dapat di-cache oleh hosting dan tidak menunggu CDN pihak ketiga.

Sampul buku katalog dinamis berasal dari Open Library Covers API dan ditampilkan menggunakan cover ID yang dikembalikan oleh Open Library. Sampul fallback lokal berada di `buku/cover.svg`.
