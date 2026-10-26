# PRD — Website Perpustakaan Multi-Page "Pustakaloka"

| Item             | Detail                                                                  |
| ---------------- | ----------------------------------------------------------------------- |
| Versi            | 1.0 (Draft)                                                             |
| Tanggal          | 25 Oktober 2026                                                         |
| Jenis produk     | Website multi-page statis (frontend-only)                               |
| Stack            | HTML5, Tailwind CSS v4 (CLI), Vanilla JavaScript (ES Modules)           |
| Referensi visual | Template "Premedi" (landing page layanan kesehatan) — lihat `Design.md` |
| Dokumen terkait  | `Design.md` (sistem desain), `AGENTS.md` (panduan agen/developer)       |

> **Catatan nama:** "Pustakaloka" adalah nama kerja (_working name_). Ubah di satu tempat: `src/js/data/site.js`, lalu cari-ganti pada `<title>` dan meta tag.

---

## 1. Ringkasan

Pustakaloka adalah website resmi perpustakaan yang menampilkan profil, koleksi, layanan, pustakawan, dan berita, serta membantu pengunjung **mencari buku**, **melihat ketersediaan**, dan **membuat reservasi** (ruang baca, buku, atau konsultasi pustakawan).

Website dibangun sebagai situs multi-halaman statis tanpa framework dan tanpa backend. Metadata buku diambil secara dinamis dari Open Library API, sedangkan kategori, layanan, pustakawan, dan berita disimpan sebagai modul JavaScript di dalam repo. Interaksi pengguna (simpanan buku, reservasi, pendaftaran) disimulasikan lewat `localStorage` dan dirancang agar mudah diganti dengan API perpustakaan nyata di kemudian hari.

## 2. Latar Belakang & Masalah

| #   | Masalah                                                             | Dampak                                    |
| --- | ------------------------------------------------------------------- | ----------------------------------------- |
| 1   | Pengunjung tidak tahu koleksi apa saja yang tersedia sebelum datang | Kunjungan sia-sia, minat baca turun       |
| 2   | Informasi layanan, jam buka, dan syarat keanggotaan tersebar        | Banyak pertanyaan berulang ke petugas     |
| 3   | Tidak ada kanal reservasi ruang baca / ruang diskusi                | Antrean dan bentrok jadwal                |
| 4   | Perpustakaan belum punya identitas digital yang kredibel            | Sulit menarik anggota baru dan kerja sama |

## 3. Tujuan & Non-Tujuan

### 3.1 Tujuan

- **G1** — Pencarian katalog yang cepat dan mudah (≤ 3 klik dari beranda ke detail buku).
- **G2** — Seluruh informasi layanan dan keanggotaan tersedia di satu tempat yang mudah dipindai.
- **G3** — Alur reservasi selesai kurang dari 1 menit.
- **G4** — Tampilan profesional, konsisten, responsif (360–1440 px), dan aksesibel (WCAG 2.1 AA).
- **G5** — Basis kode ringan dan mudah dirawat; konten diubah lewat file data tanpa menyentuh HTML.

### 3.2 Non-Tujuan (di luar rilis 1.0)

- Autentikasi/login anggota sungguhan, manajemen sesi, atau dashboard admin.
- Sistem sirkulasi nyata (peminjaman, pengembalian, denda terintegrasi).
- Pembayaran online, pembaca e-book/DRM, dan unggah file oleh pengguna.
- Penyimpanan data pribadi di server. Data form hanya tersimpan di browser pengguna (demo).
- Multi-bahasa (rilis 1.0 hanya Bahasa Indonesia).
- Dark mode (dipertimbangkan untuk fase berikutnya).

## 4. Metrik Keberhasilan

| Metrik                                                        | Target                                     | Cara ukur                       |
| ------------------------------------------------------------- | ------------------------------------------ | ------------------------------- |
| Lighthouse Performance / Accessibility / Best Practices / SEO | ≥ 90 / ≥ 95 / ≥ 95 / ≥ 95                  | Lighthouse (mobile) per halaman |
| LCP / CLS / INP                                               | < 2,5 s / < 0,1 / < 200 ms                 | Lighthouse & Web Vitals         |
| Ukuran CSS hasil build                                        | < 50 KB (gzip)                             | `dist/output.css`               |
| Total JS per halaman                                          | < 60 KB (gzip), tanpa library pihak ketiga | DevTools Network                |
| Klik hero search → halaman katalog                            | ≥ 25% sesi beranda                         | Analytics opsional              |
| Penyelesaian form reservasi                                   | ≥ 60% dari yang mulai mengisi              | Analytics opsional              |
| Isu aksesibilitas kritis (axe)                                | 0                                          | axe DevTools                    |

## 5. Target Pengguna & Persona

| Persona                                        | Profil                                                           | Kebutuhan utama                                      | Perangkat            |
| ---------------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------- | -------------------- |
| **Rina (20)** — Mahasiswa                      | Mencari referensi tugas akhir, butuh ruang diskusi               | Cari buku cepat, cek ketersediaan, booking ruang     | Smartphone (dominan) |
| **Pak Budi (42)** — Guru/umum                  | Mencari buku anak dan bacaan keluarga, ingin tahu syarat anggota | Info keanggotaan jelas, jam buka, lokasi             | Smartphone & laptop  |
| **Bu Sari (35)** — Pustakawan/pengelola konten | Memperbarui koleksi baru dan berita                              | Format file data sederhana, tidak perlu coding rumit | Laptop               |

## 6. Ruang Lingkup

**Dalam lingkup:** Beranda, Katalog (cari/filter/urut/paginasi), Detail Buku, Koleksi, Layanan, Reservasi, Pustakawan, Berita (daftar + detail), Tentang, Kontak (+FAQ), Daftar Anggota, Daftar Simpanan, Halaman 404, SEO dasar, aksesibilitas, responsivitas.

**Luar lingkup:** lihat bagian 3.2.

## 7. Pemetaan Template → Website Perpustakaan

Struktur dan gaya visual template dipertahankan; konten dan terminologi diadaptasi.

| Bagian di template                                                                     | Padanan di Pustakaloka                                                                             | Catatan adaptasi                                                                   |
| -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Topbar (sosmed, Call Now, E-mail, tombol _Appointment_)                                | Topbar (sosmed, telepon, email, tombol **Reservasi**)                                              | Tombol mengarah ke `reservasi.html`                                                |
| Navbar (Home, About, Departments, Page, Blog, Contact + ikon search)                   | Beranda, Tentang, Koleksi, Layanan, Berita, Kontak + ikon cari                                     | "Page" menjadi dropdown **Lainnya**: Katalog, Pustakawan, Daftar Anggota, Simpanan |
| Hero "WE CARE ABOUT YOUR HEALTH" + 2 tombol + search bar (Location, Specialty, Search) | Hero "JELAJAHI DUNIA LEWAT BUKU" + tombol Tentang/Kontak + search bar (Kata kunci, Kategori, Cari) | Submit → `katalog.html?q=…&kategori=…`                                             |
| Our Department (tab vertikal + panel konten)                                           | **Koleksi Kami** (tab vertikal kategori + panel deskripsi)                                         | 7 kategori; checklist = keunggulan koleksi                                         |
| Our Services (8 kartu ikon)                                                            | **Layanan Kami** (8 kartu ikon)                                                                    | Kartu hover berubah solid teal                                                     |
| _(tidak ada)_                                                                          | **Buku Terbaru** (4 kartu buku)                                                                    | Tambahan agar beranda relevan sebagai perpustakaan                                 |
| Appointment (kartu form di atas foto)                                                  | **Reservasi** (kartu form di atas foto pustakawan)                                                 | Doctors → Pustakawan; Department → Layanan                                         |
| Our Specialist (3 kartu + pager)                                                       | **Pustakawan Kami** (3 kartu + pager)                                                              | Kartu tengah/hover menampilkan jadwal                                              |
| Recent Posts (2 kartu horizontal)                                                      | **Berita & Artikel Terbaru**                                                                       | Judul, penulis, tanggal, kutipan                                                   |
| Footer 3 kolom (About, Navigation, Instagram) + copyright                              | Footer 3 kolom (Tentang, Navigasi, Galeri) + copyright                                             | Galeri berisi foto kegiatan perpustakaan                                           |

> ⚠️ **Hak cipta:** foto, teks, dan ikon pada template hanya sebagai referensi tata letak. **Jangan** memakai ulang aset gambarnya. Gunakan foto milik sendiri atau berlisensi bebas (Unsplash/Pexels — periksa lisensi) dan catat sumbernya di `assets/img/CREDITS.md`.

## 8. Sitemap & Daftar Halaman

Semua file HTML berada di root repo (path relatif sederhana, aman untuk hosting di subfolder seperti GitHub Pages).

| #   | File                  | Judul halaman           | Parameter URL                                        | Prioritas |
| --- | --------------------- | ----------------------- | ---------------------------------------------------- | --------- |
| 1   | `index.html`          | Beranda                 | —                                                    | Must      |
| 2   | `katalog.html`        | Katalog Buku            | `q`, `kategori`, `bahasa`, `tersedia`, `urut`, `hal` | Must      |
| 3   | `buku.html`           | Detail Buku             | `id`                                                 | Must      |
| 4   | `koleksi.html`        | Koleksi Kami            | `kategori` (tab aktif)                               | Must      |
| 5   | `layanan.html`        | Layanan                 | `#anchor` per layanan                                | Must      |
| 6   | `reservasi.html`      | Reservasi               | `layanan`, `pustakawan`, `buku` (prefill)            | Must      |
| 7   | `pustakawan.html`     | Pustakawan Kami         | —                                                    | Should    |
| 8   | `berita.html`         | Berita & Artikel        | `kategori`, `hal`                                    | Should    |
| 9   | `berita-detail.html`  | Detail Berita           | `id`                                                 | Should    |
| 10  | `tentang.html`        | Tentang Kami            | —                                                    | Must      |
| 11  | `kontak.html`         | Kontak & FAQ            | —                                                    | Must      |
| 12  | `daftar-anggota.html` | Pendaftaran Anggota     | —                                                    | Should    |
| 13  | `simpanan.html`       | Daftar Simpanan Saya    | —                                                    | Should    |
| 14  | `404.html`            | Halaman Tidak Ditemukan | —                                                    | Must      |

**Navigasi utama:** Beranda · Tentang · Koleksi · Layanan · Berita · Kontak + dropdown **Lainnya** (Katalog, Pustakawan, Daftar Anggota, Simpanan). Tombol topbar: **Reservasi**.

## 9. User Stories

### Epic A — Menemukan Buku

- **A1** Sebagai pengunjung, saya ingin mencari buku dari beranda agar langsung melihat hasil di katalog.
- **A2** Sebagai pengunjung, saya ingin memfilter berdasarkan kategori, bahasa, dan ketersediaan agar hasil lebih relevan.
- **A3** Sebagai pengunjung, saya ingin melihat detail buku (sinopsis, lokasi rak, status stok) sebelum datang.
- **A4** Sebagai pengunjung, saya ingin menyimpan buku ke daftar simpanan agar mudah ditemukan lagi.
- **A5** Sebagai pengunjung, saya ingin membagikan tautan buku ke teman.

### Epic B — Mengenal Perpustakaan

- **B1** Sebagai calon anggota, saya ingin melihat daftar layanan beserta syaratnya.
- **B2** Sebagai pengunjung, saya ingin melihat jam operasional dan lokasi dengan cepat.
- **B3** Sebagai pengunjung, saya ingin mengenal pustakawan dan jadwal konsultasinya.
- **B4** Sebagai pengunjung, saya ingin membaca berita kegiatan dan artikel literasi.

### Epic C — Transaksi Ringan

- **C1** Sebagai anggota, saya ingin reservasi ruang baca/diskusi atau konsultasi dengan memilih tanggal, layanan, dan pustakawan.
- **C2** Sebagai calon anggota, saya ingin mendaftar dan mendapat nomor anggota sementara.
- **C3** Sebagai pengunjung, saya ingin mengirim pertanyaan lewat formulir kontak.

### Epic D — Pengelolaan Konten

- **D1** Sebagai pengelola, saya ingin menambah buku/berita dengan mengedit file data tanpa menyentuh HTML.

## 10. Functional Requirements

Prioritas memakai MoSCoW: **M**ust, **S**hould, **C**ould.

### 10.1 Komponen Global (semua halaman)

| ID     | Requirement                                                                                                                                         | P   |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| FR-G01 | **Topbar**: ikon sosmed (Facebook, X, Instagram, YouTube), telepon, email, tombol "Reservasi". Di mobile hanya tampil telepon & tombol.             | M   |
| FR-G02 | **Header** sticky dengan logo, menu utama, ikon cari. Blok teal miring (slant) di belakang menu pada ≥ `lg`.                                        | M   |
| FR-G03 | **Menu mobile** berupa drawer dengan tombol hamburger; tertutup via Esc, klik overlay, atau pilih tautan; fokus terkunci (focus trap) saat terbuka. | M   |
| FR-G04 | **Overlay pencarian** dari ikon cari: input kata kunci → submit menuju `katalog.html?q=…`.                                                          | S   |
| FR-G05 | Menu aktif ditandai sesuai `data-page` pada `<body>` (`aria-current="page"`).                                                                       | M   |
| FR-G06 | **Footer** 3 kolom (Tentang + kontak, Navigasi 2 sub-kolom, Galeri 6 foto) dan bar hak cipta. Tahun otomatis dari JS.                               | M   |
| FR-G07 | Tombol **kembali ke atas** muncul setelah scroll > 400 px.                                                                                          | C   |
| FR-G08 | **Toast** notifikasi non-blocking (`role="status"`) untuk aksi simpan/kirim.                                                                        | S   |
| FR-G09 | **Skip link** "Lewati ke konten utama" di awal setiap halaman.                                                                                      | M   |
| FR-G10 | Header/footer dirender dari `src/js/components/` agar tidak diduplikasi; sediakan fallback `<noscript>` berisi tautan navigasi dasar.               | M   |
| FR-G11 | Animasi _reveal-on-scroll_ ringan (IntersectionObserver), nonaktif jika `prefers-reduced-motion`.                                                   | C   |

### 10.2 Beranda (`index.html`)

| ID     | Requirement                                                                                                                                                                                                                                                           | P   |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| FR-H01 | **Hero** gambar lebar penuh, judul "JELAJAHI DUNIA / LEWAT BUKU" (baris kedua berwarna teal), subjudul, dua tombol (Tentang Kami = putih, Hubungi Kami = teal).                                                                                                       | M   |
| FR-H02 | **Hero search bar**: input kata kunci, select kategori (diisi dari data), tombol CARI. Submit menuju katalog dengan query. Boleh kosong (menampilkan semua).                                                                                                          | M   |
| FR-H03 | **Koleksi Kami**: tab vertikal 7 kategori (ikon + label); tab aktif berpanah teal; panel kanan berisi banner, judul "Tentang Koleksi {Kategori}", paragraf, 4 poin checklist (2 kolom), tombol "Lihat di Katalog". Ganti tab tanpa reload; keyboard panah atas/bawah. | M   |
| FR-H04 | **Layanan Kami**: 8 kartu (4 kolom desktop / 2 tablet / 1 mobile); kartu hover/fokus berubah solid teal dengan ikon putih dan bayangan. Tiap kartu menaut ke `layanan.html#id`.                                                                                       | M   |
| FR-H05 | **Buku Terbaru**: 4 kartu buku terbaru (berdasar `addedAt`), tombol "Lihat Semua Buku".                                                                                                                                                                               | S   |
| FR-H06 | **Reservasi**: kartu putih berisi form (Nama, Telepon, Email, Tanggal, Pustakawan, Layanan, tombol "Buat Reservasi") di atas foto pustakawan. Perilaku sama dengan FR-R01–R08.                                                                                        | M   |
| FR-H07 | **Pustakawan Kami**: 3 kartu per tampilan, pager `‹  Semua Pustakawan  ›` untuk menggeser daftar; kartu aktif menampilkan panel teal (nama, gelar, bidang, jadwal).                                                                                                   | S   |
| FR-H08 | **Berita & Artikel Terbaru**: 2 kartu horizontal (gambar kiri, teks kanan) dengan judul, penulis, tanggal, kutipan, "Baca Selengkapnya →".                                                                                                                            | M   |

### 10.3 Katalog (`katalog.html`)

| ID     | Requirement                                                                                                              | P   |
| ------ | ------------------------------------------------------------------------------------------------------------------------ | --- |
| FR-K01 | Pencarian teks pada judul, penulis, ISBN, tag (case-insensitive, abaikan diakritik, debounce 300 ms).                    | M   |
| FR-K02 | Filter: kategori (multi), bahasa, hanya yang tersedia (toggle). Rentang tahun terbit (Could).                            | M   |
| FR-K03 | Urutkan: Terbaru, Judul A–Z, Judul Z–A, Terpopuler.                                                                      | M   |
| FR-K04 | Paginasi 12 buku/halaman dengan tombol Sebelumnya/Berikutnya + nomor halaman.                                            | M   |
| FR-K05 | Seluruh state (q, filter, urut, halaman) tersinkron ke query string; URL dapat dibagikan; tombol Back browser berfungsi. | M   |
| FR-K06 | Jumlah hasil ditampilkan ("Menampilkan 12 dari 48 buku") dengan `aria-live="polite"`.                                    | M   |
| FR-K07 | _Empty state_ informatif dengan tombol "Reset Filter".                                                                   | M   |
| FR-K08 | Kartu buku: sampul, judul, penulis, badge status (Tersedia/Dipinjam), tombol simpan (ikon bookmark).                     | M   |
| FR-K09 | Di mobile, filter berada dalam panel _off-canvas_ yang dibuka tombol "Filter".                                           | S   |
| FR-K10 | Skeleton loading singkat saat render pertama.                                                                            | C   |

### 10.4 Detail Buku (`buku.html?id=`)

| ID     | Requirement                                                                                                                    | P   |
| ------ | ------------------------------------------------------------------------------------------------------------------------------ | --- |
| FR-B01 | Breadcrumb: Beranda › Katalog › {Judul}.                                                                                       | M   |
| FR-B02 | Sampul besar, judul, penulis, badge kategori, rating (jika ada), status stok ("2 dari 3 eksemplar tersedia"), lokasi rak.      | M   |
| FR-B03 | Tabel metadata: ISBN, penerbit, tahun, halaman, bahasa, edisi.                                                                 | M   |
| FR-B04 | Sinopsis dan daftar tag (tag menaut ke katalog terfilter).                                                                     | M   |
| FR-B05 | Aksi: **Reservasi Buku** (→ `reservasi.html?buku=id`), **Simpan/Hapus Simpanan**, **Salin Tautan** (Clipboard API + fallback). | M   |
| FR-B06 | "Buku Terkait" (maks. 4, kategori sama, selain buku ini).                                                                      | S   |
| FR-B07 | ID tidak ditemukan → tampilkan state "Buku tidak ditemukan" + tautan ke katalog (bukan layar kosong).                          | M   |
| FR-B08 | Perbarui `document.title` dan meta description sesuai buku; sisipkan JSON-LD `Book`.                                           | S   |

### 10.5 Koleksi (`koleksi.html`)

| ID     | Requirement                                                                                                                                     | P   |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| FR-C01 | Tata letak seperti bagian Koleksi di beranda, namun lengkap: deskripsi, statistik (jumlah judul), 4 buku unggulan, tombol ke katalog terfilter. | M   |
| FR-C02 | Tab aktif tersinkron ke `?kategori=` dan dapat di-deep-link.                                                                                    | S   |

### 10.6 Layanan (`layanan.html`)

| ID     | Requirement                                                                                                              | P   |
| ------ | ------------------------------------------------------------------------------------------------------------------------ | --- |
| FR-L01 | Daftar seluruh layanan (minimal 8) sebagai kartu detail dengan `id` untuk anchor; berisi deskripsi, syarat, jam layanan. | M   |
| FR-L02 | Aturan peminjaman ringkas (tabel): masa pinjam, jumlah maksimal, perpanjangan, denda (**nilai contoh**, sesuaikan).      | M   |
| FR-L03 | CTA "Reservasi Layanan Ini" pada layanan yang dapat dipesan (prefill `?layanan=`).                                       | S   |

### 10.7 Reservasi (`reservasi.html` + bagian beranda)

| ID     | Requirement                                                                                                                                                             | P   |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| FR-R01 | Field: Nama Lengkap*, Telepon/WA*, Email*, Tanggal*, Layanan*, Pustakawan (opsional), Catatan, serta Buku (prefill bila ada).                                           | M   |
| FR-R02 | Validasi sisi klien dengan pesan Bahasa Indonesia di bawah field, `aria-invalid` dan `aria-describedby`; fokus pindah ke error pertama saat submit gagal.               | M   |
| FR-R03 | Tanggal tidak boleh masa lalu, tidak boleh hari tutup (Minggu), maksimal 30 hari ke depan.                                                                              | M   |
| FR-R04 | Telepon format Indonesia (`08…` atau `+62…`, 9–14 digit). Email format valid.                                                                                           | M   |
| FR-R05 | Sukses → simpan ke `localStorage` (`pustakaloka:reservations`), tampilkan kartu konfirmasi dengan **kode reservasi** `RSV-YYYYMMDD-XXXX`, tombol "Buat Reservasi Lain". | M   |
| FR-R06 | Tombol submit menampilkan state _loading_ ±600 ms (simulasi) dan dinonaktifkan agar tidak terkirim ganda.                                                               | S   |
| FR-R07 | Daftar "Reservasi Saya" (dari localStorage) dengan opsi batalkan.                                                                                                       | C   |
| FR-R08 | Catatan privasi: data hanya tersimpan di perangkat ini (mode demo).                                                                                                     | M   |

### 10.8 Pustakawan (`pustakawan.html`)

| ID     | Requirement                                                                                          | P   |
| ------ | ---------------------------------------------------------------------------------------------------- | --- |
| FR-P01 | Grid kartu pustakawan (foto, nama, gelar, bidang, jadwal). Kartu hover/fokus menampilkan panel teal. | S   |
| FR-P02 | Tombol "Reservasi Konsultasi" dengan prefill `?pustakawan=`.                                         | C   |

### 10.9 Berita (`berita.html`, `berita-detail.html`)

| ID     | Requirement                                                                                                                                      | P   |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------ | --- |
| FR-N01 | Daftar berita 6/halaman, filter kategori (Kegiatan, Literasi, Pengumuman), paginasi.                                                             | S   |
| FR-N02 | Detail: judul, tanggal, penulis, gambar utama, isi (paragraf & subjudul), tag, tombol bagikan, berita terkait.                                   | S   |
| FR-N03 | Isi berita disimpan sebagai array blok (`{type:'p'｜'h2'｜'quote', text}`) dan dirender dengan aman (tanpa `innerHTML` dari data tak tepercaya). | S   |

### 10.10 Tentang & Kontak

| ID     | Requirement                                                                                                                                                                                            | P   |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --- |
| FR-T01 | Tentang: profil, visi & misi, linimasa sejarah, statistik (counter animasi), fasilitas, jam operasional.                                                                                               | M   |
| FR-T02 | Kontak: alamat, telepon, email, jam, form pesan (Nama, Email, Subjek, Pesan), peta (tautan Google Maps / iframe OSM opsional), FAQ akordeon (min. 6 pertanyaan).                                       | M   |
| FR-T03 | Form kontak: validasi seperti FR-R02; sukses menampilkan toast; opsional tombol "Kirim via Email" (`mailto:`). Integrasi layanan form (Formspree/Netlify Forms) dicatat sebagai pengembangan lanjutan. | S   |

### 10.11 Keanggotaan & Simpanan

| ID     | Requirement                                                                                                                                                                                           | P   |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| FR-M01 | Form pendaftaran: Nama, Email, Telepon, Jenis anggota (Pelajar/Mahasiswa/Umum), Alamat, Persetujuan syarat. Sukses → nomor anggota sementara `MBR-XXXXXX`. **Jangan** meminta NIK atau data sensitif. | S   |
| FR-M02 | `simpanan.html`: daftar buku tersimpan, hapus per item, "Kosongkan semua", empty state.                                                                                                               | S   |
| FR-M03 | Jumlah simpanan tampil sebagai badge pada ikon bookmark di header.                                                                                                                                    | C   |

### 10.12 404

| ID     | Requirement                                             | P   |
| ------ | ------------------------------------------------------- | --- |
| FR-E01 | Pesan ramah, kolom cari, tautan ke Beranda dan Katalog. | M   |

## 11. Non-Functional Requirements

| Kategori            | Requirement                                                                                                                                                                                                          |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Kompatibilitas**  | 2 versi terakhir Chrome, Edge, Firefox, Safari (desktop & mobile). Tanpa dukungan IE.                                                                                                                                |
| **Responsif**       | Mobile-first; diuji di 360, 390, 768, 1024, 1280, 1440 px. Tidak ada scroll horizontal.                                                                                                                              |
| **Performa**        | Gambar WebP/AVIF + `loading="lazy"` (kecuali hero), `width`/`height` eksplisit, `fetchpriority="high"` pada gambar hero, font `display=swap` dengan preconnect, hanya 3–4 bobot Poppins.                             |
| **Aksesibilitas**   | WCAG 2.1 AA: kontras teks ≥ 4,5:1, fokus terlihat, navigasi keyboard penuh, landmark (`header/nav/main/footer`), satu `h1` per halaman, alt text bermakna, label form, ARIA hanya jika perlu, target sentuh ≥ 44 px. |
| **SEO**             | `lang="id"`, title & meta description unik, canonical, Open Graph/Twitter card, `sitemap.xml`, `robots.txt`, JSON-LD `Library` di beranda & `Book` di detail buku, URL query yang rapi.                              |
| **Keamanan**        | Tidak ada secret di repo; data dari URL/form di-escape sebelum masuk DOM (gunakan `textContent`/helper `escapeHTML`); tautan eksternal `rel="noopener noreferrer"`; sediakan contoh header CSP untuk hosting.        |
| **Privasi**         | Tanpa cookie pelacak. Analytics (opsional) harus privacy-friendly dan tanpa PII.                                                                                                                                     |
| **Maintainability** | CSS kustom hanya di `input.css`; konten terpisah dari markup; fungsi kecil & terdokumentasi; konvensi pada `AGENTS.md`.                                                                                              |
| **Dependensi**      | Runtime: **nol**. Dev: Tailwind CLI, Prettier, ESLint, server statis lokal.                                                                                                                                          |
| **Deployment**      | Dapat di-host di GitHub Pages/Netlify/Vercel/hosting statis lain; build CSS dijalankan di CI atau lokal sebelum deploy.                                                                                              |

## 12. Model Data

Semua data berada di `src/js/data/*.js`. Akses data **harus** melalui `src/js/services/` (bukan impor langsung dari halaman) agar mudah diganti dengan `fetch()` ke API.

```js
// Category
{ id: 'sains', name: 'Sains', icon: 'flask', description: '…',
  highlights: ['…', '…', '…', '…'], banner: 'assets/img/koleksi/sains.webp' }

// Book
{
  id: 'dasar-dasar-pemrograman-web',      // slug unik, dipakai di URL
  title: 'Dasar-Dasar Pemrograman Web',
  author: 'Nama Penulis',
  isbn: '978-602-0000-00-0',
  categoryId: 'teknologi',
  publisher: 'Penerbit', year: 2024, pages: 320, language: 'id', edition: 'Cetakan 1',
  synopsis: '…', tags: ['html', 'css', 'javascript'],
  cover: 'assets/img/buku/dasar-pemrograman-web.webp',
  stock: { total: 3, available: 2 },
  shelf: 'TEK-005.1 / Rak B2',
  rating: 4.5, popularity: 120, addedAt: '2026-09-20'
}

// Service
{ id: 'peminjaman', name: 'Peminjaman Buku', icon: 'book-open', summary: '…',
  details: ['…'], requirements: ['…'], hours: 'Sen–Jum 08.00–16.00', reservable: false }

// Librarian
{ id: 'anjelina-rossy', name: 'Anjelina Rossy', title: 'S.IP., M.Hum', field: 'Layanan Referensi',
  photo: 'assets/img/staf/anjelina.webp', schedule: { days: 'Sen – Kam', time: '09.00 – 15.00' } }

// Post
{ id: 'mengapa-literasi-penting', title: '…', category: 'literasi', author: 'Admin',
  date: '2026-10-01', excerpt: '…', image: '…', body: [{ type: 'p', text: '…' }] }

// Reservation (localStorage)
{ code: 'RSV-20261101-AB12', name, phone, email, date, serviceId, librarianId, bookId,
  note, createdAt, status: 'pending' }

// Member (localStorage)
{ memberNo: 'MBR-483920', name, email, phone, type, address, createdAt }

// Site config (src/js/data/site.js)
{ name, tagline, address, phone, email, social: {…}, hours: [{ days, time }], closedDays: [0] }
```

### Kunci localStorage

| Kunci                      | Isi                  |
| -------------------------- | -------------------- |
| `pustakaloka:bookmarks`    | Array `bookId`       |
| `pustakaloka:reservations` | Array reservasi      |
| `pustakaloka:members`      | Array anggota (demo) |

Semua akses melalui `services/storage.js` dengan `try/catch` (storage dapat dinonaktifkan/penuh) dan fallback memori.

## 13. Aturan Bisnis (contoh — sesuaikan dengan perpustakaan Anda)

| Aturan              | Nilai contoh                                                            |
| ------------------- | ----------------------------------------------------------------------- |
| Jam operasional     | Senin–Jumat 08.00–16.00 · Sabtu 08.00–12.00 · Minggu & hari libur tutup |
| Masa pinjam         | 7 hari, dapat diperpanjang 1×                                           |
| Maks. pinjam        | 3 buku (umum), 5 buku (mahasiswa/guru)                                  |
| Denda keterlambatan | Rp500/hari/buku                                                         |
| Reservasi           | Maks. 30 hari ke depan; durasi ruang diskusi 2 jam                      |
| Keanggotaan         | Gratis; membawa tanda pengenal saat pertama datang                      |

## 14. Konten & Gaya Bahasa

- Bahasa Indonesia baku yang ramah; kalimat pendek; hindari jargon.
- Judul bagian **KAPITAL** (seperti template), isi memakai kalimat biasa.
- Microcopy form spesifik, contoh: "Nomor telepon tidak valid, contoh: 081234567890".
- Teks _lorem ipsum_ **tidak boleh** dirilis; gunakan konten nyata atau contoh bermakna.
- Semua gambar punya `alt` deskriptif; gambar dekoratif memakai `alt=""`.

## 15. Keputusan Teknis & Konsekuensi

| Keputusan                                    | Alasan                                 | Konsekuensi                                                             |
| -------------------------------------------- | -------------------------------------- | ----------------------------------------------------------------------- |
| Tailwind **v4** via CLI (CSS-first `@theme`) | Tanpa bundler, konfigurasi minimal     | Build CSS wajib sebelum deploy                                          |
| **ES Modules** native (`type="module"`)      | Kode modular tanpa bundler             | Harus dijalankan lewat server lokal (bukan `file://`)                   |
| Header/footer dirender JS                    | Hindari duplikasi di 14 halaman        | Risiko _layout shift_ → sediakan tinggi minimum + `<noscript>` fallback |
| Data sebagai modul JS                        | Tanpa `fetch` dan masalah CORS lokal   | Pengelola mengedit file `.js` (sintaks array/objek)                     |
| State di URL                                 | Mudah dibagikan, mendukung tombol Back | Perlu helper `url.js`                                                   |
| Tanpa backend                                | Biaya & kompleksitas rendah            | Reservasi/pendaftaran hanya simulasi                                    |

## 16. Acceptance Criteria

Rilis dianggap siap jika:

1. Semua 14 halaman tersedia, terhubung, dan tidak ada tautan rusak.
2. Seluruh requirement _Must_ pada bagian 10 lolos uji manual (daftar uji ada di `AGENTS.md`).
3. Skor Lighthouse memenuhi target bagian 4 pada Beranda, Katalog, dan Detail Buku.
4. Tidak ada error/warning di console; HTML valid (html-validate/W3C).
5. Navigasi keyboard penuh dapat dilakukan di semua halaman; axe tidak menemukan isu kritis.
6. Tampilan tidak pecah di 360–1440 px.
7. Tidak ada aset berhak cipta dari template yang tersisa.

### Contoh kriteria per fitur

**Katalog**

- _Given_ saya di `katalog.html`, _when_ saya mengetik "web" dan menunggu 300 ms, _then_ daftar terfilter, URL berisi `?q=web`, dan jumlah hasil diperbarui.
- _Given_ tidak ada hasil, _then_ tampil empty state, dan tombol "Reset Filter" mengembalikan semua buku.

**Reservasi**

- _Given_ tanggal hari Minggu dipilih, _when_ submit, _then_ muncul error "Perpustakaan tutup pada hari Minggu" dan data tidak tersimpan.
- _Given_ semua field valid, _when_ submit, _then_ tombol berstatus loading → kartu konfirmasi dengan kode reservasi tampil, dan data ada di `localStorage`.

**Simpan Buku**

- _Given_ saya menekan ikon bookmark, _then_ ikon berubah terisi, toast muncul, dan setelah refresh status tetap tersimpan.

## 17. Analytics (opsional)

Gunakan alat privacy-friendly (mis. Plausible/Umami). Event yang disarankan: `search_submit`, `book_view`, `bookmark_add`, `reservation_submit`, `member_register`, `contact_submit`. Jangan mengirim data pribadi.

## 18. Risiko

| Risiko                                                         | Kemungkinan | Dampak | Mitigasi                                                                |
| -------------------------------------------------------------- | ----------- | ------ | ----------------------------------------------------------------------- |
| Aset gambar berhak cipta                                       | Sedang      | Tinggi | Wajibkan `CREDITS.md`, hanya gambar berlisensi                          |
| Teal brand (#0FB3B5) berkontras rendah dengan teks putih kecil | Tinggi      | Sedang | Gunakan `brand-700` untuk tombol/teks kecil (lihat `Design.md`)         |
| Header/footer via JS menyebabkan CLS & SEO lemah               | Sedang      | Sedang | Reservasi tinggi, `<noscript>`, opsi skrip build partial di fase lanjut |
| Data bertambah besar → halaman lambat                          | Rendah      | Sedang | Paginasi, `loading="lazy"`, Search API dengan `limit` dan `page`        |
| Pengelola salah sintaks saat edit data                         | Sedang      | Sedang | Panduan + ESLint + contoh data lengkap                                  |
| `localStorage` tidak tersedia (mode privat)                    | Sedang      | Rendah | Fallback memori + pesan jelas                                           |

## 19. Rencana Rilis

| Fase            | Cakupan                                                                   | Output         |
| --------------- | ------------------------------------------------------------------------- | -------------- |
| **0 — Setup**   | Repo, Tailwind v4, `input.css` + token, layout bersama, komponen dasar    | Kerangka siap  |
| **1 — Inti**    | Beranda, Katalog, Detail Buku, Tentang, Kontak, 404                       | MVP browsing   |
| **2 — Layanan** | Koleksi, Layanan, Reservasi, Pustakawan                                   | Alur reservasi |
| **3 — Konten**  | Berita, Daftar Anggota, Simpanan, FAQ                                     | Fitur lengkap  |
| **4 — Polish**  | SEO, aksesibilitas, performa, QA lintas browser, deploy                   | Rilis 1.0      |
| **Setelah 1.0** | Dark mode, i18n (EN), backend inventaris, form service nyata, PWA offline | Roadmap        |

## 20. Pertanyaan Terbuka

1. Nama resmi, logo, dan warna brand final perpustakaan?
2. Jenis perpustakaan (sekolah/kampus/umum/daerah)? Memengaruhi kategori koleksi dan jenis anggota.
3. Apakah metadata Open Library perlu digabungkan dengan database inventaris lokal?
4. Apakah reservasi perlu terhubung ke WhatsApp/email petugas pada fase berikutnya?
5. Sumber foto (milik sendiri vs stok berlisensi)?
6. Domain dan platform hosting?
