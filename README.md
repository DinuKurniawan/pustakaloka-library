# Pustakaloka

Pustakaloka adalah website perpustakaan statis multi-halaman untuk menemukan buku, menjelajahi koleksi, membaca berita, mengenal pustakawan, melakukan simulasi reservasi, dan mendaftarkan anggota.

Aplikasi ini berjalan sepenuhnya di browser:

- Tidak memiliki backend, database, login, atau dashboard admin.
- Metadata buku diambil dari Open Library API.
- Kategori, layanan, pustakawan, berita, FAQ, dan identitas situs disimpan sebagai modul JavaScript lokal.
- Simpanan buku, reservasi, dan pendaftaran anggota disimpan di `localStorage` browser.
- Form Kontak hanya menampilkan konfirmasi lokal; tidak mengirim pesan ke petugas.

> Gunakan server HTTP lokal. Jangan membuka halaman dengan `file://` karena ES Modules, path relatif, dan request API dapat gagal atau diblokir browser.

## Daftar Isi

- [Fitur](#fitur)
- [Teknologi](#teknologi)
- [Prasyarat](#prasyarat)
- [Memulai](#memulai)
- [Perintah NPM](#perintah-npm)
- [Struktur Proyek](#struktur-proyek)
- [Daftar Halaman](#daftar-halaman)
- [Parameter URL](#parameter-url)
- [Arsitektur](#arsitektur)
- [Sumber Data dan Open Library](#sumber-data-dan-open-library)
- [Mengubah Konten](#mengubah-konten)
- [State Browser](#state-browser)
- [Aset dan Lisensi](#aset-dan-lisensi)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Checklist QA](#checklist-qa)
- [Batasan Saat Ini](#batasan-saat-ini)
- [Dokumentasi Terkait](#dokumentasi-terkait)
- [Lisensi](#lisensi)

## Fitur

### Eksplorasi buku

- Beranda dengan pencarian cepat dan buku terbaru.
- Katalog buku dengan pencarian judul, penulis, ISBN, atau kata kunci.
- Filter berdasarkan kategori dan bahasa.
- Pengurutan berdasarkan terbaru, judul A–Z, judul Z–A, dan rating/popularitas.
- Paginasi katalog, 12 buku per halaman secara default.
- Detail buku dari Work atau Edition Open Library.
- Buku terkait berdasarkan subjek buku.
- Cover buku dari Open Library Covers API dengan cover fallback lokal.
- Informasi stok, lokasi rak, peminjaman, dan reservasi fisik diberi status perlu dikonfirmasi karena belum terhubung ke sistem perpustakaan nyata.

### Konten perpustakaan

- Tujuh koleksi buku: fiksi, sains, teknologi, sejarah, anak, bisnis, dan seni.
- Delapan layanan perpustakaan.
- Daftar pustakawan dan bidang konsultasi.
- Berita dengan filter kategori, paginasi, dan halaman detail.
- FAQ, informasi kontak, profil perpustakaan, visi, misi, dan jam operasional.

### Interaksi pengguna

- Simpan dan hapus buku dari halaman Simpanan.
- Badge jumlah simpanan pada header.
- Reservasi layanan dengan validasi nama, email, telepon, tanggal, layanan, dan hari tutup Minggu.
- Prefill reservasi melalui query string untuk layanan, pustakawan, atau buku.
- Pendaftaran anggota demo dengan nomor anggota sementara.
- Menu mobile, menu tambahan, overlay pencarian, toast, breadcrumb, accordion, dan tombol kembali ke atas.
- State lokal tetap aman ketika `localStorage` diblokir atau penuh dengan fallback memori selama halaman masih terbuka.

### Aksesibilitas dan keamanan dasar

- HTML semantik, landmark halaman, skip link, label form, dan atribut ARIA.
- Fokus keyboard menggunakan `:focus-visible`.
- Status dinamis diumumkan melalui elemen status atau toast.
- Dukungan `prefers-reduced-motion`.
- Nilai dari URL, formulir, dan storage di-escape sebelum dimasukkan ke markup.
- Tidak menggunakan framework runtime, `eval`, `document.write`, atau inline `onclick`.

## Teknologi

| Area            | Teknologi                                                    |
| --------------- | ------------------------------------------------------------ |
| Markup          | HTML5 semantik dengan `lang="id"`                            |
| Styling         | Tailwind CSS v4 melalui `@tailwindcss/cli`                   |
| JavaScript      | Vanilla JavaScript ES Modules, target ES2022+                |
| Data buku       | Open Library Search, Works, Books, Authors, dan Covers API   |
| Konten lokal    | Modul JavaScript di `src/js/data/`                           |
| Font            | Poppins latin self-hosted (400, 500, 600)                    |
| Ikon            | SVG inline dari `src/js/utils/icons.js`                      |
| Server lokal    | `serve`                                                      |
| Build           | Tailwind CLI dan Concurrently                                |
| Quality tooling | ESLint, Prettier, `prettier-plugin-tailwindcss`              |
| Deployment      | Hosting statis; konfigurasi Vercel tersedia di `vercel.json` |

Tidak ada dependensi JavaScript pihak ketiga yang dikirim sebagai runtime ke browser. Semua paket di `package.json` digunakan untuk development, lint, formatting, atau build CSS.

## Prasyarat

Pastikan perangkat memiliki:

1. Node.js 20 LTS atau lebih baru.
2. npm yang terpasang bersama Node.js.
3. Browser modern seperti Chrome, Edge, Firefox, atau Safari.
4. Koneksi internet ketika membuka katalog, detail buku, atau cover Open Library.

## Memulai

Jalankan dari folder repository:

```bash
npm install
npm run dev
```

Kemudian buka:

```text
http://localhost:3000
```

`npm run dev` menjalankan dua proses:

1. Tailwind CSS dalam mode watch dari `src/css/input.css` ke `dist/output.css`.
2. Server statis `serve` pada port 3000. Mode dev memakai ES Modules sumber tanpa bundling.

Untuk hanya menjalankan server setelah CSS sudah tersedia:

```bash
npm run dev:serve
```

Untuk hanya menjalankan watcher Tailwind:

```bash
npm run dev:css
```

### Build produksi

```bash
npm ci
npm run build
```

Build menghasilkan situs produksi di `dist/` dengan CSS dan JavaScript minified:

```text
dist/output.css
dist/js/
dist/index.html
```

Folder `dist/` diabaikan Git. Jalankan `npm run build` kembali di mesin deployment atau pipeline CI sebelum situs dipublikasikan. HTML di `dist/` menunjuk ke bundle esbuild; HTML sumber tetap menunjuk ke ES Modules untuk dev.

## Perintah NPM

| Perintah                | Kegunaan                                                |
| ----------------------- | ------------------------------------------------------- |
| `npm install`           | Memasang dependency development dari `package.json`.    |
| `npm ci`                | Instalasi reproducible berdasarkan `package-lock.json`. |
| `npm run dev`           | Menjalankan watcher CSS dan server lokal bersamaan.     |
| `npm run dev:css`       | Menjalankan Tailwind CSS watch saja.                    |
| `npm run dev:serve`     | Menjalankan server statis pada port 3000.               |
| `npm run optimize:hero` | Membuat varian hero WebP 480/800 px.                    |
| `npm run build:css`     | Membuat `dist/output.css` versi minified.               |
| `npm run build:js`      | Membuat bundle JavaScript dan salinan HTML produksi.    |
| `npm run build`         | Menjalankan optimasi gambar, build CSS, dan build JS.   |
| `npm run lint`          | Menjalankan ESLint pada `src/js`.                       |
| `npm run format`        | Memformat seluruh repository dengan Prettier.           |
| `npm run format:check`  | Memeriksa format tanpa mengubah file.                   |
| `npm run check`         | Menjalankan lint lalu format check.                     |

## Struktur Proyek

```text
perpustakaan/
├── index.html                    # halaman beranda
├── src/
│   ├── pages/                    # HTML halaman selain beranda
│   │   ├── 404.html
│   │   ├── berita-detail.html
│   │   ├── berita.html
│   │   ├── buku.html
│   │   ├── kontak.html
│   │   ├── koleksi.html
│   │   ├── katalog.html
│   │   ├── daftar-anggota.html
│   │   ├── layanan.html
│   │   ├── pustakawan.html
│   │   ├── reservasi.html
│   │   ├── simpanan.html
│   │   └── tentang.html
│   ├── css/
│   │   └── input.css              # entry point Tailwind dan design token
│   └── js/
│       ├── components/            # layout dan komponen markup/perilaku
│       ├── data/                  # konten situs statis
│       ├── pages/                 # entry point halaman dan renderer bersama
│       ├── services/              # API, data lokal, dan operasi state
│       └── utils/                 # helper URL, storage, format, validasi, ikon
├── assets/
│   └── img/
│       ├── buku/                  # cover fallback
│       ├── berita/                # gambar berita lokal
│       ├── hero/                  # gambar hero
│       ├── koleksi/               # banner koleksi
│       ├── staf/                  # foto pustakawan
│       └── CREDITS.md             # sumber dan lisensi gambar
├── dist/                          # hasil build; tidak di-commit
├── AGENTS.md                      # aturan coding dan Definition of Done
├── Design.md                      # panduan visual dan design token
├── PRD.md                         # requirement produk dan acceptance criteria
├── package.json
├── package-lock.json
├── eslint.config.js
├── vercel.json
├── robots.txt
├── sitemap.xml
└── favicon.svg
```

Semua halaman HTML tetap statis. JavaScript halaman dipasang dengan:

```html
<script type="module" src="./src/js/pages/catalog.js"></script>
```

Beberapa entry point seperti `services.js`, `saved.js`, dan `about.js` memanggil `startPage()` dari `src/js/pages/app.js`. Halaman lain seperti beranda, katalog, dan detail buku memiliki entry point dengan perilaku khusus tetapi tetap memakai komponen serta service bersama.

## Daftar Halaman

| File                            | `data-page`   | Isi                                                                            | Parameter atau state                     |
| ------------------------------- | ------------- | ------------------------------------------------------------------------------ | ---------------------------------------- |
| `index.html`                    | `home`        | Beranda, pencarian cepat, koleksi, buku terbaru, reservasi, pustakawan, berita | —                                        |
| `src/pages/katalog.html`        | `catalog`     | Pencarian, filter, pengurutan, dan paginasi buku                               | `q`, `kategori`, `bahasa`, `urut`, `hal` |
| `src/pages/buku.html`           | `book`        | Detail buku dan buku terkait                                                   | `id`                                     |
| `src/pages/koleksi.html`        | `collections` | Detail koleksi dan empat buku pilihan                                          | `kategori`                               |
| `src/pages/layanan.html`        | `services`    | Layanan dan aturan peminjaman                                                  | anchor layanan                           |
| `src/pages/reservasi.html`      | `reservation` | Form reservasi dan reservasi tersimpan                                         | `layanan`, `pustakawan`, `buku`          |
| `src/pages/pustakawan.html`     | `librarians`  | Daftar pustakawan dan bidang konsultasi                                        | —                                        |
| `src/pages/berita.html`         | `news`        | Daftar berita, filter, dan paginasi                                            | `kategori`, `hal`                        |
| `src/pages/berita-detail.html`  | `news-detail` | Detail berita                                                                  | `id`                                     |
| `src/pages/tentang.html`        | `about`       | Profil, visi, misi, statistik, dan jam buka                                    | —                                        |
| `src/pages/kontak.html`         | `contact`     | Kontak, form pesan, dan FAQ                                                    | —                                        |
| `src/pages/daftar-anggota.html` | `membership`  | Pendaftaran anggota demo                                                       | —                                        |
| `src/pages/simpanan.html`       | `saved`       | Buku yang disimpan pengguna                                                    | `localStorage`                           |
| `src/pages/404.html`            | `not-found`   | Halaman tidak ditemukan dan pencarian katalog                                  | —                                        |

## Parameter URL

Contoh path dari root repository:

```text
# Pencarian dari beranda
./src/pages/katalog.html?q=web&kategori=teknologi

# Filter dan pengurutan katalog
./src/pages/katalog.html?kategori=sains&bahasa=id&urut=popular&hal=2

# Detail buku Open Library
./src/pages/buku.html?id=OL27448W

# Koleksi tertentu
./src/pages/koleksi.html?kategori=teknologi

# Layanan tertentu
./src/pages/layanan.html#ruang-diskusi

# Prefill reservasi
./src/pages/reservasi.html?layanan=ruang-diskusi&pustakawan=anjelina-rossy
./src/pages/reservasi.html?buku=OL27448W

# Berita
./src/pages/berita.html?kategori=literasi&hal=1
./src/pages/berita-detail.html?id=mengapa-literasi-penting
```

State katalog dan berita dipertahankan di query string. Nilai dari URL harus diproses melalui helper di `src/js/utils/url.js`, divalidasi, dan di-escape sebelum digunakan dalam markup.

## Arsitektur

### Alur sebuah halaman

1. Browser membuka file HTML statis.
2. Entry point ES Module di `src/js/pages/` dipanggil.
3. `mountLayout()` memasang header, footer, badge simpanan, menu mobile, pencarian global, dan perilaku layout.
4. Entry point memuat data melalui service.
5. Renderer membuat markup ke `#main` menggunakan komponen dan `escapeHTML()` untuk nilai dinamis.
6. Interaksi pengguna mengubah URL, API, atau state browser sesuai kebutuhan.

### `src/js/components/`

Komponen lintas halaman meliputi:

- `layout.js`: pemasangan header/footer dan perilaku global.
- `header.js`, `footer.js`: navigasi, kontak, media sosial, dan tahun copyright.
- `book-card.js`, `service-card.js`, `librarian-card.js`, `post-card.js`: kartu konten.
- `section-heading.js`, `breadcrumb.js`, `pagination.js`: pola layout.
- `accordion.js`: FAQ dan panel buka/tutup.
- `reservation-overlay.js`: konfirmasi hasil reservasi.
- `toast.js`: notifikasi singkat dengan status yang dapat dibaca screen reader.

### `src/js/services/`

Service menjadi batas akses data dan operasi state:

- `book-service.js`: Open Library Search, Works, Books, Authors, Covers, normalisasi buku, pencarian, detail, dan buku terkait.
- `content-service.js`: akses kategori, layanan, pustakawan, situs, berita, dan FAQ.
- `bookmark-service.js`: baca, tambah, hapus, dan kosongkan simpanan.
- `reservation-service.js`: simpan, baca, dan batalkan reservasi.
- `member-service.js`: membuat nomor anggota sementara dan menyimpan pendaftaran demo.

### `src/js/data/`

Konten lokal yang dapat diedit:

- `site.js`: nama, alamat, jam, media sosial, hero, dan galeri.
- `categories.js`: tujuh kategori koleksi.
- `services.js`: delapan layanan.
- `librarians.js`: data pustakawan.
- `posts.js`: berita dan artikel.
- `faqs.js`: pertanyaan umum.

Halaman dan komponen sebaiknya tidak mengimpor data lokal secara langsung jika data tersebut sudah memiliki service.

### `src/js/utils/`

- `escape.js`: escape nilai dinamis sebelum masuk template HTML.
- `storage.js`: wrapper storage dengan fallback memori.
- `url.js`: membaca dan memperbarui query string.
- `validate.js`: validasi field dan aturan tanggal reservasi.
- `format.js`: format tanggal, normalisasi teks, dan helper tanggal.
- `icons.js`: katalog ikon SVG inline.

## Sumber Data dan Open Library

### Data lokal

Konten statis tidak membutuhkan jaringan. Perubahan dilakukan pada modul di `src/js/data/`, lalu halaman mengambilnya melalui `content-service.js`.

### Data buku

Tidak diperlukan API key. `book-service.js` menggunakan:

- `https://openlibrary.org/search.json` untuk daftar dan pencarian buku.
- `https://openlibrary.org/works/{id}.json` untuk detail Work.
- `https://openlibrary.org/books/{id}.json` untuk detail Edition.
- Endpoint Authors dan Editions untuk melengkapi penulis serta metadata detail.
- `https://covers.openlibrary.org/b/id/{coverId}-M.jpg` untuk sampul.

Request pencarian sengaja dibatasi agar tidak membebani Open Library:

- Hanya meminta field yang dipakai kartu dan pengurutan: `key`, `title`, `author_name`, `cover_i`, `first_publish_year`, `ratings_average`, dan `ratings_count`.
- Tidak memakai wildcard global `title:*`, karena query tersebut memaksa pencarian katalog besar sebelum pengurutan.
- Saat pencarian kosong tanpa filter, digunakan query umum `book` sebagai kompromi performa untuk halaman awal.
- Kategori dan bahasa ditambahkan ke query ketika filter dipilih.

Konsekuensinya, hasil awal tanpa kata kunci adalah hasil jelajah praktis, bukan dump seluruh katalog. Pencarian kata kunci tetap menjadi cara utama untuk menemukan judul tertentu.

Open Library hanya menyediakan bibliografi umum. Stok lokal, lokasi rak, status peminjaman, dan reservasi fisik tidak dapat dianggap akurat sampai ada backend perpustakaan yang menjadi sumber data resmi.

## Mengubah Konten

### Identitas situs

Edit `src/js/data/site.js` untuk mengubah:

- Nama, tagline, alamat, telepon, dan email.
- Jam operasional dan hari tutup.
- Tautan media sosial.
- Foto hero dan galeri.

### Kategori, layanan, pustakawan, berita, dan FAQ

| Konten           | File                        |
| ---------------- | --------------------------- |
| Kategori koleksi | `src/js/data/categories.js` |
| Layanan          | `src/js/data/services.js`   |
| Pustakawan       | `src/js/data/librarians.js` |
| Berita           | `src/js/data/posts.js`      |
| FAQ              | `src/js/data/faqs.js`       |

Ikuti skema objek yang sudah ada. Untuk aturan bisnis dan acceptance criteria, lihat `PRD.md` dan `AGENTS.md`.

### Visual

Edit `src/css/input.css` untuk design token dan komponen CSS berulang. Gunakan token yang sudah tersedia seperti `brand-700`, `surface`, `ink-900`, dan `shadow-card`. Setelah menambah class Tailwind di JavaScript, pastikan file JavaScript tetap tercakup oleh `@source '../js';`.

### Menambah halaman

1. Buat HTML di `src/pages/` dengan `data-page` unik.
2. Buat entry point di `src/js/pages/`.
3. Pasang `mountLayout()` atau gunakan `startPage()` jika halaman cocok dengan renderer bersama.
4. Tambahkan navigasi yang diperlukan pada `header.js` atau `footer.js`.
5. Tambahkan URL produksi ke `sitemap.xml` dan perbarui `robots.txt`.
6. Jalankan `npm run check` dan `npm run build`.

## State Browser

Semua state demo berada di browser pengguna dan tidak disinkronkan antarperangkat.

| Kunci                      | Isi                                                              |
| -------------------------- | ---------------------------------------------------------------- |
| `pustakaloka:bookmarks`    | Array ID buku Open Library yang disimpan.                        |
| `pustakaloka:reservations` | Array reservasi, kode, waktu pembuatan, dan status.              |
| `pustakaloka:members`      | Array data pendaftaran anggota demo dan nomor anggota sementara. |

Catatan keamanan dan perilaku:

- Jangan menyimpan NIK, kata sandi, token, atau rahasia lain di storage demo.
- Menghapus data situs/browser akan menghapus state lokal.
- Storage yang diblokir atau penuh memakai `Map` fallback selama halaman masih terbuka.
- Fallback memori tidak bertahan setelah reload atau tab ditutup.
- Form Kontak tidak mengirim email dan tidak memanggil layanan eksternal.

## Aset dan Lisensi

Sumber serta catatan lisensi gambar dicatat di [`assets/img/CREDITS.md`](assets/img/CREDITS.md). Gambar konten lokal berada di `assets/img/`, sedangkan cover buku dimuat dinamis dari Open Library.

Sebelum deployment publik:

1. Pastikan setiap gambar memiliki sumber dan lisensi yang jelas.
2. Jangan menyalin aset dari template referensi tanpa izin.
3. Pertahankan `alt`, `width`, `height`, dan lazy-loading yang sesuai.
4. Jika hosting harus sepenuhnya offline, siapkan strategi penggantian cover Open Library dengan aset lokal berlisensi.

## Deployment

Proyek dapat dipublikasikan ke Vercel, Netlify, GitHub Pages, atau hosting statis lain yang mendukung file root dan subfolder.

### Vercel

`vercel.json` sudah mendefinisikan:

- Build command: `npm run build`
- Output directory: `dist`

Dengan konfigurasi tersebut, HTML produksi, bundle, CSS, dan aset yang dipublikasikan berasal dari `dist/`.

### Deployment manual

```bash
npm ci
npm run build
```

Publikasikan isi `dist/` setelah build:

```text
dist/index.html
dist/src/
dist/assets/
dist/js/
dist/output.css
dist/favicon.svg
dist/robots.txt
dist/sitemap.xml
```

Jangan publikasikan `node_modules/`, `.env`, token, secret, atau file lokal pribadi.

### Cloudflare Pages / CDN

Untuk pengaturan dashboard Cloudflare:

1. Pada **Web Analytics**, matikan **Automatic Web Analytics injection**. Jika beacon diperlukan, pasang script beacon sendiri dengan atribut `defer` dan ukur dampaknya kembali.
2. Pada **Speed → Optimization**, matikan **Rocket Loader** agar ES Modules dan urutan bootstrap tidak diubah.
3. Aktifkan **Early Hints** dan **Brotli**.
4. Buat **Cache Rule** untuk `/assets/*` dengan TTL browser/edge 1 tahun dan `immutable`.
5. Buat **Cache Rule** untuk `/js/chunks/*` dengan TTL 1 tahun dan `immutable`; gunakan cache pendek untuk `/js/*` karena entry bundle memakai nama stabil.
6. Gunakan cache pendek untuk HTML (`max-age=300`) agar metadata dan navigasi cepat diperbarui.

Setelah mengubah konfigurasi, jalankan Lighthouse pada URL produksi dalam mode mobile cold-cache dan ulangi pengukuran tanpa beacon untuk membedakan biaya situs dari biaya analytics.

### Sebelum produksi

Perbarui placeholder yang masih menggunakan `example.com`:

- `canonical` dan Open Graph pada seluruh HTML.
- URL `Sitemap` di `robots.txt`.
- URL pada `sitemap.xml`.
- Informasi situs di `src/js/data/site.js`.
- Sumber aset di `assets/img/CREDITS.md`.

Contoh kebijakan CSP yang dapat disesuaikan di hosting:

```text
Content-Security-Policy: default-src 'self'; style-src 'self'; font-src 'self'; img-src 'self' https://covers.openlibrary.org data:; connect-src 'self' https://openlibrary.org; script-src 'self'
```

Sesuaikan CSP jika font, gambar, API, atau sumber lain berubah.

## Troubleshooting

### `tailwindcss` tidak ditemukan

Pasang dependency lalu coba ulang:

```bash
npm install
npm run build
```

Jika CLI tidak ditemukan langsung, jalankan:

```bash
npx @tailwindcss/cli -i ./src/css/input.css -o ./dist/output.css --minify
```

### Halaman kosong atau error `Failed to resolve module`

Jangan membuka HTML dengan `file://`. Jalankan:

```bash
npm run dev
```

Lalu buka `http://localhost:3000`.

### Catalog atau detail buku gagal dimuat

Periksa:

1. Koneksi internet.
2. Console browser untuk status Open Library.
3. CSP `connect-src` jika aplikasi di-deploy.
4. CSP `img-src` untuk cover Open Library.
5. Apakah endpoint Open Library sedang membatasi atau mengalami gangguan.

### Perubahan class Tailwind tidak terlihat

Pastikan class ditulis lengkap, bukan hasil penggabungan string parsial. Jalankan ulang `npm run build` atau biarkan `npm run dev` menjalankan watcher.

### Simpanan atau reservasi hilang

State hanya tersimpan pada browser dan origin yang sama. Pastikan storage `localhost:3000` diizinkan. Jika storage diblokir, state hanya hidup di memori dan hilang setelah reload.

### Gambar lokal tidak tampil

Periksa path di `src/js/data/site.js`, `categories.js`, `librarians.js`, dan `posts.js`. Pastikan file berada di `assets/img/` dengan nama serta ekstensi yang sama.

## Checklist QA

### Pemeriksaan otomatis

```bash
npm run check
npm run build
```

### Skenario manual utama

- Buka beranda dan seluruh 14 halaman melalui `http://localhost:3000`.
- Uji viewport 360, 390, 768, 1024, 1280, dan 1440 px.
- Cari buku dari hero, header, dan halaman katalog.
- Uji kategori, bahasa, pengurutan, paginasi, dan reset filter.
- Uji `buku.html` dengan ID valid dan ID yang tidak ditemukan.
- Simpan buku, reload, buka Simpanan, hapus buku, lalu pastikan badge berubah.
- Uji reservasi valid, tanggal Minggu, tanggal di luar rentang, dan pembatalan.
- Uji prefill reservasi melalui `layanan`, `pustakawan`, dan `buku`.
- Uji pendaftaran anggota dengan field kosong dan persetujuan tidak dicentang.
- Uji form Kontak dan FAQ.
- Uji menu mobile, overlay pencarian, menu tambahan, tombol Escape, dan skip link.
- Uji navigasi keyboard untuk tab koleksi, accordion, tombol, dan form.
- Uji `prefers-reduced-motion` dan zoom 200%.
- Pastikan tidak ada scroll horizontal yang tidak diinginkan.
- Pastikan console tidak berisi error yang berasal dari aplikasi.
- Jalankan Lighthouse dan axe DevTools sebelum rilis.

## Batasan Saat Ini

Versi demo ini belum menyediakan:

- Autentikasi, akun anggota, dan dashboard admin.
- Backend, database, sinkronisasi antarperangkat, atau sistem sirkulasi nyata.
- Peminjaman/pengembalian aktual dan perhitungan denda terintegrasi.
- Pembayaran online atau pembaca e-book.
- Pengiriman form Kontak ke petugas.
- Integrasi stok fisik dengan katalog Open Library.
- Analytics atau pelacakan pengguna.
- Multi-bahasa dan dark mode.

Jika kebutuhan berubah, tambahkan backend secara terpisah melalui service layer. Jangan menaruh secret atau kredensial API di JavaScript yang dikirim ke browser.

## Dokumentasi Terkait

- [`AGENTS.md`](AGENTS.md): aturan coding, struktur, keamanan, aksesibilitas, dan Definition of Done.
- [`PRD.md`](PRD.md): tujuan produk, requirement fungsional, skema data, dan acceptance criteria.
- [`Design.md`](Design.md): design token, pola layout, komponen visual, dan panduan aksesibilitas.
- [`assets/img/CREDITS.md`](assets/img/CREDITS.md): sumber dan lisensi aset gambar.

## Lisensi

Belum ada lisensi open-source yang ditetapkan untuk kode proyek ini. Tambahkan file `LICENSE` sebelum repository didistribusikan sebagai perangkat lunak open-source.
