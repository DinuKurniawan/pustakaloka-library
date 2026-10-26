# Pustakaloka

Website perpustakaan multi-halaman untuk menjelajah koleksi, membaca informasi layanan, mengenal pustakawan, dan melakukan simulasi reservasi serta pendaftaran anggota.

Proyek ini adalah **frontend statis**: tidak memiliki backend, login, database, atau integrasi pengiriman formulir. Metadata katalog buku diambil secara dinamis dari Open Library API, sedangkan konten situs lainnya disimpan sebagai modul JavaScript di repository. Simpanan buku, reservasi, dan pendaftaran anggota disimpan secara lokal di browser pengguna.

## Daftar Isi

- [Fitur](#fitur)
- [Teknologi](#teknologi)
- [Prasyarat](#prasyarat)
- [Menjalankan Proyek](#menjalankan-proyek)
- [Perintah yang Tersedia](#perintah-yang-tersedia)
- [Struktur Proyek](#struktur-proyek)
- [Daftar Halaman](#daftar-halaman)
- [Parameter URL](#parameter-url)
- [Arsitektur Aplikasi](#arsitektur-aplikasi)
- [Mengubah Konten](#mengubah-konten)
- [Penyimpanan Browser](#penyimpanan-browser)
- [Aset dan Lisensi](#aset-dan-lisensi)
- [Build dan Deployment](#build-dan-deployment)
- [Troubleshooting](#troubleshooting)
- [Pemeriksaan Kualitas](#pemeriksaan-kualitas)
- [Batasan Saat Ini](#batasan-saat-ini)
- [Dokumentasi Terkait](#dokumentasi-terkait)

## Fitur

- Beranda dengan hero, pencarian katalog, koleksi, layanan, buku terbaru, reservasi, pustakawan, dan berita terbaru.
- Katalog buku dengan pencarian berdasarkan judul, penulis, ISBN, dan tag.
- Filter katalog berdasarkan kategori dan bahasa.
- Pengurutan katalog berdasarkan buku terbaru, judul A–Z, judul Z–A, dan popularitas.
- Paginasi katalog dengan 12 buku per halaman.
- Detail buku dengan metadata Open Library, informasi ketersediaan yang perlu dikonfirmasi, buku terkait, dan tautan sumber.
- Simpan/hapus buku dari daftar simpanan dengan badge jumlah pada header.
- Halaman koleksi dengan tujuh kategori dan empat buku pilihan per kategori.
- Halaman layanan dengan delapan layanan, syarat, jam layanan, dan aturan peminjaman.
- Form reservasi dengan prefill layanan, pustakawan, atau buku melalui query string.
- Validasi nama, email, telepon, tanggal, layanan, dan hari tutup Minggu.
- Kode reservasi berbentuk `RSV-YYYYMMDD-XXXX`.
- Daftar reservasi tersimpan dengan opsi pembatalan.
- Daftar pustakawan dan jadwal konsultasi.
- Daftar berita dengan filter kategori dan paginasi, serta halaman detail berita.
- Halaman Tentang, Kontak & FAQ, Daftar Anggota, Simpanan, dan 404.
- Header, footer, menu mobile, dropdown, toast, breadcrumb, kartu, dan paginasi yang dipakai lintas halaman.
- Fallback memori ketika `localStorage` tidak tersedia atau tidak dapat ditulis.
- Markup dinamis di-escape melalui `escapeHTML()` sebelum dirender.
- Layout responsif mobile-first dan dukungan `prefers-reduced-motion` pada CSS.

## Teknologi

| Area         | Teknologi                                                     |
| ------------ | ------------------------------------------------------------- |
| Markup       | HTML5 semantik                                                |
| Styling      | Tailwind CSS v4 melalui `@tailwindcss/cli`                    |
| JavaScript   | Vanilla JavaScript ES Modules, tanpa framework runtime        |
| Data buku    | Open Library Search API dan Works/Books API                   |
| Font         | Poppins dari Google Fonts                                     |
| Ikon         | SVG inline dari `src/js/utils/icons.js`                       |
| Server lokal | `serve`                                                       |
| Tooling      | ESLint, Prettier, `prettier-plugin-tailwindcss`, Concurrently |
| Node.js      | Disarankan Node.js 20 LTS atau lebih baru                     |

Tidak ada dependensi JavaScript pihak ketiga yang dikirim ke browser saat runtime. Dependensi pada `package.json` hanya digunakan untuk development dan build CSS.

## Prasyarat

Pastikan perangkat sudah memiliki:

1. Node.js 20 LTS atau lebih baru.
2. npm yang ikut terpasang bersama Node.js.
3. Browser modern seperti Chrome, Edge, Firefox, atau Safari.

## Menjalankan Proyek

```bash
npm install
```

### Mode development

```bash
npm run dev
```

Perintah tersebut menjalankan dua proses secara bersamaan:

- Tailwind CSS dalam mode watch.
- Server statis pada `http://localhost:3000`.

Buka `http://localhost:3000` di browser. **Jangan membuka halaman langsung melalui `file://`** karena browser dapat memblokir ES Modules dan perilaku routing relatif.

### Build produksi

```bash
npm run build
```

Hasil CSS minify ditulis ke `dist/output.css`. Folder `dist/` masuk `.gitignore`, jadi build perlu dijalankan kembali pada mesin atau pipeline deployment sebelum situs dipublikasikan.

## Perintah yang Tersedia

| Perintah               | Kegunaan                                       |
| ---------------------- | ---------------------------------------------- |
| `npm install`          | Memasang dependensi development.               |
| `npm run dev`          | Menjalankan Tailwind watch dan server lokal.   |
| `npm run dev:css`      | Menjalankan Tailwind CSS watch saja.           |
| `npm run dev:serve`    | Menjalankan server statis saja pada port 3000. |
| `npm run build`        | Membuat CSS minified untuk deployment.         |
| `npm run lint`         | Menjalankan ESLint pada `src/js`.              |
| `npm run format`       | Memformat seluruh repository dengan Prettier.  |
| `npm run format:check` | Memeriksa format tanpa mengubah file.          |
| `npm run check`        | Menjalankan lint dan pemeriksaan format.       |

## Struktur Proyek

```text
perpustakaan/
├── index.html
├── pustakawan.html
├── src/
│   ├── pages/                 # halaman HTML selain beranda dan pustakawan
│   │   ├── katalog.html
│   │   ├── buku.html
│   │   ├── koleksi.html
│   │   ├── layanan.html
│   │   ├── reservasi.html
│   │   ├── berita.html
│   │   ├── berita-detail.html
│   │   ├── tentang.html
│   │   ├── kontak.html
│   │   ├── daftar-anggota.html
│   │   ├── simpanan.html
│   │   └── 404.html
│   ├── css/
│   │   └── input.css           # entry point Tailwind dan design token
│   └── js/
│       ├── components/         # header, footer, kartu, toast, dll.
│       ├── data/               # konten situs statis yang dapat diedit
│       ├── pages/              # entry point setiap halaman + renderer bersama
│       ├── services/           # akses Open Library, konten, dan state aplikasi
│       └── utils/              # escape, URL, validasi, format, ikon, storage
├── assets/
│   └── img/
│       ├── hero/
│       ├── koleksi/
│       ├── buku/
│       ├── staf/
│       ├── CREDITS.md
│       └── ...
├── dist/
│   └── output.css              # hasil build; tidak di-commit
├── AGENTS.md                   # aturan kerja dan checklist implementasi
├── Design.md                   # sumber kebenaran visual
├── PRD.md                      # requirement produk dan acceptance criteria
├── package.json
├── eslint.config.js
├── .prettierrc
├── .gitignore
├── robots.txt
├── sitemap.xml
└── favicon.svg
```

### Alur JavaScript

Setiap file HTML menunjuk ke entry point halaman di `src/js/pages/`, misalnya:

```html
<script type="module" src="./src/js/pages/catalog.js"></script>
```

Entry point tersebut mendelegasikan rendering ke `src/js/pages/app.js`, lalu `startPage()`:

1. Memasang header dan footer melalui `mountLayout()`.
2. Memasang perilaku global seperti menu, dropdown, toast, bookmark badge, dan tombol kembali ke atas.
3. Memilih renderer sesuai `data-page` pada `<body>`.
4. Mengambil konten melalui service.
5. Merender konten halaman ke `#main`.

## Daftar Halaman

Beranda dan halaman pustakawan berada di root; halaman lainnya berada di `src/pages/`.

| File                  | `data-page`   | Isi                                              | Parameter utama                          |
| --------------------- | ------------- | ------------------------------------------------ | ---------------------------------------- |
| `index.html`          | `home`        | Beranda dan pencarian cepat                      | —                                        |
| `katalog.html`        | `catalog`     | Pencarian, filter, pengurutan, dan paginasi buku | `q`, `kategori`, `bahasa`, `urut`, `hal` |
| `buku.html`           | `book`        | Detail satu buku                                 | `id`                                     |
| `koleksi.html`        | `collections` | Koleksi dan buku pilihan berdasarkan kategori    | `kategori`                               |
| `layanan.html`        | `services`    | Daftar layanan dan aturan peminjaman             | Anchor `#id-layanan`                     |
| `reservasi.html`      | `reservation` | Form reservasi dan daftar reservasi lokal        | `layanan`, `pustakawan`, `buku`          |
| `pustakawan.html`     | `librarians`  | Daftar pustakawan dan jadwal                     | —                                        |
| `berita.html`         | `news`        | Daftar berita dan filter kategori                | `kategori`, `hal`                        |
| `berita-detail.html`  | `news-detail` | Detail berita                                    | `id`                                     |
| `tentang.html`        | `about`       | Profil, visi, misi, statistik, dan jam buka      | —                                        |
| `kontak.html`         | `contact`     | Kontak, formulir pesan, dan FAQ                  | —                                        |
| `daftar-anggota.html` | `membership`  | Pendaftaran anggota demo                         | —                                        |
| `simpanan.html`       | `saved`       | Daftar buku yang disimpan                        | —                                        |
| `404.html`            | `not-found`   | Halaman tidak ditemukan dan pencarian katalog    | —                                        |

## Parameter URL

Contoh tautan yang dapat digunakan atau dibagikan:

```text
# Pencarian dari beranda
./katalog.html?q=web&kategori=teknologi

# Filter katalog
./katalog.html?kategori=sains&bahasa=id&urut=popular&hal=2

# Detail buku
./buku.html?id=OL27448W

# Koleksi tertentu
./koleksi.html?kategori=teknologi

# Layanan tertentu
./layanan.html#ruang-diskusi

# Prefill form reservasi
./reservasi.html?layanan=ruang-diskusi&pustakawan=anjelina-rossy
./reservasi.html?buku=OL27448W

# Berita
./berita.html?kategori=literasi&hal=1
./berita-detail.html?id=mengapa-literasi-penting
```

Nilai query string berasal dari URL pengguna dan harus tetap diproses melalui helper URL serta di-escape sebelum masuk ke markup.

## Arsitektur Aplikasi

### `components/`

Komponen untuk markup dan perilaku lintas halaman, antara lain:

- `layout.js`: memasang layout global dan event global.
- `header.js` dan `footer.js`: navigasi, kontak, galeri, dan tahun copyright.
- `book-card.js`, `service-card.js`, `librarian-card.js`, `post-card.js`: kartu konten.
- `section-heading.js`, `breadcrumb.js`, `pagination.js`: pola layout berulang.
- `accordion.js`: FAQ dan panel yang dapat dibuka/tutup.
- `toast.js`: notifikasi non-blocking dengan `role="status"`.

### `services/`

Service adalah satu-satunya lapisan yang semestinya mengakses modul data dan storage:

- `book-service.js`: mengambil metadata dinamis dari Open Library, menormalisasi hasil API, filter, pengurutan, detail, dan buku terkait.
- `content-service.js`: kategori, layanan, pustakawan, berita, dan FAQ.
- `bookmark-service.js`: tambah, hapus, dan kosongkan simpanan.
- `reservation-service.js`: simpan, baca, dan batalkan reservasi.
- `member-service.js`: membuat nomor anggota sementara.

### `data/`

Konten lokal saat ini terdiri dari tujuh kategori, delapan layanan, empat pustakawan, enam berita, dan enam FAQ. Tidak ada seed buku lokal; katalog mengambil data langsung dari Open Library melalui `src/js/services/book-service.js`.

### `utils/`

Utility utama mencakup:

- `escape.js`: mencegah nilai dinamis mentah masuk ke HTML.
- `storage.js`: wrapper `localStorage` dengan fallback `Map` di memori.
- `url.js`: membaca dan memperbarui query string.
- `validate.js`: validasi nama, email, telepon, layanan, persetujuan, dan tanggal reservasi.
- `format.js`: normalisasi pencarian, tanggal, dan perhitungan tanggal.
- `icons.js`: kumpulan SVG inline.
- `dom.js` dan `debounce.js`: helper DOM dan debounce.

## Mengubah Konten

### Mengubah identitas situs

Edit `src/js/data/site.js` untuk mengubah:

- Nama dan tagline.
- Alamat, telepon, dan email.
- Tautan media sosial.
- Foto hero dan galeri.
- Jam operasional dan hari tutup.

### Katalog buku dari Open Library

Katalog, halaman Koleksi, buku terbaru di beranda, detail buku, buku terkait, dan Simpanan menggunakan Open Library API. Tidak diperlukan API key. Jalankan situs melalui server lokal agar browser dapat melakukan request API:

```bash
npm run dev
```

Konfigurasi integrasi berada di `src/js/services/book-service.js`:

- `searchBooks()` menggunakan Search API dengan paginasi, kategori, bahasa, dan pengurutan.
- `getBookById()` mengambil Work atau Edition berdasarkan ID Open Library.
- Cover diambil dari Covers API dengan cover ID yang dikembalikan Open Library.
- Hasil API dinormalisasi ke skema kartu buku yang dipakai Pustakaloka.

Open Library hanya menyediakan metadata katalog umum. Stok fisik, lokasi rak, peminjaman, dan reservasi perpustakaan belum disediakan API sehingga ditampilkan sebagai “Perlu dikonfirmasi”. Jika nanti tersedia backend perpustakaan, field tersebut dapat digabungkan di service tanpa mengubah komponen kartu.

### Mengubah kategori, layanan, pustakawan, berita, dan FAQ

| Konten           | File                        |
| ---------------- | --------------------------- |
| Kategori koleksi | `src/js/data/categories.js` |
| Layanan          | `src/js/data/services.js`   |
| Pustakawan       | `src/js/data/librarians.js` |
| Berita           | `src/js/data/posts.js`      |
| FAQ              | `src/js/data/faqs.js`       |

Format objek dan aturan bisnis rinci dijelaskan di `PRD.md` dan `AGENTS.md`.

### Mengubah visual

Edit `src/css/input.css` untuk design token, komponen CSS berulang, dan sumber Tailwind. Gunakan token yang sudah ada seperti `brand-700`, `surface`, `ink-900`, dan `shadow-card`; hindari hard-code warna baru di markup. Detail visual lengkap ada di `Design.md`.

## Penyimpanan Browser

Semua state transaksi pada versi demo berada di browser yang digunakan. Kunci yang dipakai:

| Kunci                      | Isi                                                              |
| -------------------------- | ---------------------------------------------------------------- |
| `pustakaloka:bookmarks`    | Array ID buku yang disimpan.                                     |
| `pustakaloka:reservations` | Array data reservasi, kode, waktu pembuatan, dan status.         |
| `pustakaloka:members`      | Array data pendaftaran anggota demo dan nomor anggota sementara. |

Catatan:

- Data tidak dikirim ke server dari aplikasi ini.
- Menghapus data situs/browser akan menghapus state lokal tersebut.
- Mode privat, storage yang diblokir, atau storage penuh menggunakan fallback memori selama halaman masih terbuka.
- Jangan menyimpan NIK, kata sandi, token, atau data sensitif lain di state demo.
- Form Kontak hanya menampilkan toast sukses; belum terhubung ke email, Formspree, Netlify Forms, atau backend.

## Aset dan Lisensi

Sumber gambar dan catatan lisensi ada di [`assets/img/CREDITS.md`](assets/img/CREDITS.md). Foto konten statis disimpan sebagai WebP lokal; sampul buku dinamis adalah satu-satunya gambar yang masih dapat diminta dari Open Library.

Sebelum deployment publik:

1. Pastikan setiap gambar memiliki sumber dan lisensi yang jelas.
2. Jangan menyalin aset dari template referensi.
3. Pertimbangkan mengunduh dan mengoptimalkan aset lokal bila hosting harus berjalan tanpa koneksi eksternal.
4. Pertahankan `alt`, `width`, `height`, dan `loading="lazy"` sesuai kebutuhan gambar.

## Build dan Deployment

Proyek dapat dipublikasikan ke GitHub Pages, Netlify, Vercel, atau hosting statis lain.

Build lokal:

```bash
npm ci
npm run build
```

Publikasikan file HTML di root, `src/`, `assets/`, `dist/`, `favicon.svg`, `robots.txt`, dan `sitemap.xml`. Jangan publikasikan `node_modules/`, file `.env`, atau secret.

Sebelum deployment produksi, perbarui placeholder berikut:

- URL canonical dan Open Graph di setiap HTML.
- `Sitemap:` pada `robots.txt`.
- URL pada `sitemap.xml` yang saat ini masih menggunakan `https://example.com`.
- URL media sosial, alamat, email, dan sumber aset di `src/js/data/site.js` serta `assets/img/CREDITS.md`.

Contoh header keamanan yang dapat dikonfigurasi di hosting:

```text
Content-Security-Policy: default-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' https://covers.openlibrary.org data:; connect-src 'self' https://openlibrary.org; script-src 'self'
```

Sesuaikan CSP jika sumber font, gambar, atau aset berubah.

## Troubleshooting

### `tailwindcss` tidak ditemukan

Pastikan dependensi sudah terpasang:

```bash
npm install
```

Jika perlu, jalankan CLI melalui npm:

```bash
npx @tailwindcss/cli -i ./src/css/input.css -o ./dist/output.css --minify
```

### Halaman kosong atau error module

Jangan membuka HTML dengan `file://`. Jalankan:

```bash
npm run dev
```

Lalu buka `http://localhost:3000`.

### Perubahan class Tailwind tidak terlihat

Pastikan class ditulis lengkap dan file sumber berada dalam cakupan `@source` di `src/css/input.css`. Jalankan ulang `npm run build` atau biarkan `npm run dev` menjalankan watch CSS.

### Data reservasi atau simpanan tidak muncul

Periksa bahwa browser mengizinkan storage untuk `localhost:3000`. Jika storage diblokir, data hanya tersedia di memori dan akan hilang setelah reload atau tab ditutup.

### Gambar foto tidak tampil

Foto konten statis berada di `assets/img/**/*.webp` dan tidak membutuhkan koneksi ke CDN foto pihak ketiga. Periksa file lokal serta URL pada `src/js/data/site.js`, `src/js/data/categories.js`, `src/js/data/librarians.js`, dan `src/js/data/posts.js`. Sampul buku katalog tetap memerlukan koneksi ke Open Library.

## Pemeriksaan Kualitas

Pemeriksaan otomatis minimum:

```bash
npm run check
npm run build
```

Pemeriksaan manual yang disarankan:

- Buka semua 14 halaman melalui server lokal.
- Uji viewport 360, 390, 768, 1024, 1280, dan 1440 px.
- Uji pencarian dari hero dan filter katalog.
- Uji detail buku valid dan `id` yang tidak ditemukan.
- Simpan buku, reload, hapus dari Simpanan, dan kosongkan daftar.
- Uji reservasi valid, tanggal Minggu, tanggal di luar rentang, dan pembatalan.
- Uji pendaftaran anggota dan nomor anggota sementara.
- Uji menu mobile, dropdown, tombol Escape, fokus keyboard, dan skip link.
- Uji FAQ, paginasi, query string, dan tombol salin tautan.
- Pastikan tidak ada error/warning di console.
- Jalankan Lighthouse dan axe DevTools sebelum rilis.

Checklist lengkap dan aturan implementasi ada di bagian Definition of Done pada `AGENTS.md`.

## Batasan Saat Ini

Versi ini sengaja belum menyediakan:

- Autentikasi, akun anggota, dan dashboard admin.
- Backend, database, sinkronisasi antarperangkat, atau sistem sirkulasi nyata.
- Peminjaman/pengembalian aktual dan perhitungan denda terintegrasi.
- Pembayaran online atau pembaca e-book.
- Pengiriman formulir Kontak ke petugas.
- Analytics atau pelacakan pengguna.
- Multi-bahasa dan dark mode.

Fitur-fitur tersebut dapat dipertimbangkan pada fase lanjutan setelah kebutuhan layanan, domain produksi, dan backend ditetapkan.

## Dokumentasi Terkait

- [`AGENTS.md`](AGENTS.md): aturan coding, aksesibilitas, keamanan, struktur, dan checklist pengerjaan.
- [`PRD.md`](PRD.md): tujuan produk, daftar halaman, requirement fungsional, model data, dan acceptance criteria.
- [`Design.md`](Design.md): design token, layout, komponen visual, responsivitas, dan panduan aksesibilitas.
- [`assets/img/CREDITS.md`](assets/img/CREDITS.md): sumber dan lisensi gambar.

## Lisensi Proyek

Belum ada lisensi open-source yang ditetapkan untuk kode proyek ini. Tambahkan file `LICENSE` sebelum repository didistribusikan sebagai perangkat lunak open-source.
