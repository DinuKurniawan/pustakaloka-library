# Credits aset

Foto konten statis diunduh dari sumber stok bebas dan disimpan sebagai WebP lokal. Halaman tidak melakukan hotlink foto ke Google, Unsplash, atau Pexels saat runtime, sehingga request foto tetap berasal dari origin situs sendiri dan dapat di-cache oleh hosting.

## Foto lokal

| File lokal                   | Sumber                                                                             | Lisensi                                           |
| ---------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------- |
| `hero/library-interior.webp` | [Unsplash photo](https://images.unsplash.com/photo-1507842217343-583bb7270b66)     | [Unsplash License](https://unsplash.com/license)  |
| `koleksi/book-stack.webp`    | [Unsplash photo](https://images.unsplash.com/photo-1543002588-bfa74002ed7e)        | [Unsplash License](https://unsplash.com/license)  |
| `staf/librarian.webp`        | [Pexels photo](https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg)   | [Pexels License](https://www.pexels.com/license/) |
| `berita/reading.webp`        | [Pexels photo](https://images.pexels.com/photos/2760243/pexels-photo-2760243.jpeg) | [Pexels License](https://www.pexels.com/license/) |
| `koleksi/fiction.webp`       | [Unsplash photo](https://images.unsplash.com/photo-1516979187457-637abb4f9353)     | [Unsplash License](https://unsplash.com/license)  |
| `koleksi/science.webp`       | [Unsplash photo](https://images.unsplash.com/photo-1532094349884-543bc11b234d)     | [Unsplash License](https://unsplash.com/license)  |
| `koleksi/technology.webp`    | [Unsplash photo](https://images.unsplash.com/photo-1518770660439-4636190af475)     | [Unsplash License](https://unsplash.com/license)  |
| `koleksi/history.webp`       | [Unsplash photo](https://images.unsplash.com/photo-1461360228754-6e81c478b882)     | [Unsplash License](https://unsplash.com/license)  |
| `koleksi/children.webp`      | [Unsplash photo](https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9)     | [Unsplash License](https://unsplash.com/license)  |
| `koleksi/business.webp`      | [Unsplash photo](https://images.unsplash.com/photo-1556761175-b413da4baf72)        | [Unsplash License](https://unsplash.com/license)  |
| `koleksi/art.webp`           | [Unsplash photo](https://images.unsplash.com/photo-1549490349-8643362247b5)        | [Unsplash License](https://unsplash.com/license)  |
| `staf/anjelina.webp`         | [Unsplash photo](https://images.unsplash.com/photo-1494790108377-be9c29b29330)     | [Unsplash License](https://unsplash.com/license)  |
| `staf/dimas.webp`            | [Unsplash photo](https://images.unsplash.com/photo-1500648767791-00dcc994a43e)     | [Unsplash License](https://unsplash.com/license)  |
| `staf/maya.webp`             | [Unsplash photo](https://images.unsplash.com/photo-1544005313-94ddf0286df2)        | [Unsplash License](https://unsplash.com/license)  |
| `staf/raka.webp`             | [Unsplash photo](https://images.unsplash.com/photo-1531123897727-8f129e1688ce)     | [Unsplash License](https://unsplash.com/license)  |

Foto dikirim sebagai WebP terkompresi: hero sekitar 238 KB, sedangkan foto non-hero di bawah 150 KB sesuai batas performa pada `Design.md`.

Ilustrasi SVG lokal yang masih digunakan adalah `staf/librarian.svg` sebagai ilustrasi bagian reservasi beranda.

Sampul buku katalog dinamis berasal dari Open Library Covers API dan ditampilkan menggunakan cover ID yang dikembalikan oleh Open Library. Sampul fallback lokal berada di `buku/cover.svg`.
