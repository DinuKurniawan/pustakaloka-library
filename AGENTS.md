# AGENTS.md — Panduan untuk AI Agent & Developer

Proyek: **Website Perpustakaan "Pustakaloka"** — multi-page statis dengan **HTML + Tailwind CSS v4 + Vanilla JavaScript (ES Modules)**.

Dokumen ini adalah aturan kerja. Baca juga:

1. `PRD.md` — _apa_ yang dibangun (halaman, fitur, data, aturan bisnis).
2. `Design.md` — _seperti apa_ tampilannya (token, komponen, pola).

> Jika ada konflik: **PRD** menang untuk fungsi, **Design** menang untuk visual, dokumen ini menang untuk cara menulis kode. Jika ada hal yang ambigu, pilih opsi paling sederhana, catat asumsinya di deskripsi PR/jawaban, jangan menebak diam-diam.

---

## 1. Ringkasan Proyek

- 14 halaman HTML statis di root repo (`index.html`, `katalog.html`, `buku.html`, …; daftar lengkap di `PRD.md` §8).
- Tanpa framework, tanpa bundler, tanpa backend, **tanpa library JS runtime**.
- Header, footer, dan komponen UI dirender oleh JavaScript dari `src/js/components/`.
- Data (buku, kategori, layanan, pustakawan, berita) ada di `src/js/data/` dan diakses lewat `src/js/services/`.
- State pengguna (simpanan, reservasi, anggota) disimpan di `localStorage` melalui `services/storage.js`.
- Bahasa UI: **Bahasa Indonesia**. Identifier kode: **bahasa Inggris**.

## 2. Tech Stack & Versi

| Kebutuhan  | Pilihan                                                                      |
| ---------- | ---------------------------------------------------------------------------- |
| Markup     | HTML5 semantik, `lang="id"`                                                  |
| Styling    | Tailwind CSS **v4** via `@tailwindcss/cli` (CSS-first, token di `@theme`)    |
| Script     | JavaScript ES2022+, ES Modules native (`<script type="module">`)             |
| Font       | Poppins (Google Fonts)                                                       |
| Ikon       | SVG inline dari `src/js/utils/icons.js`                                      |
| Dev server | `serve` (statis) — **wajib**, jangan buka lewat `file://`                    |
| Kualitas   | Prettier (+ `prettier-plugin-tailwindcss`), ESLint, html-validate (opsional) |
| Node       | ≥ 20 LTS (hanya untuk tooling dev)                                           |

## 3. Setup & Perintah

```bash
npm install            # instal dependensi dev
npm run dev            # jalankan watch CSS + server lokal (http://localhost:3000)
npm run build          # build CSS minify → dist/output.css
npm run lint           # ESLint pada src/js
npm run format         # Prettier pada seluruh repo
npm run check          # lint + format:check (+ validasi HTML jika terpasang)
```

`package.json` (acuan):

```json
{
  "name": "pustakaloka",
  "private": true,
  "type": "module",
  "scripts": {
    "dev:css": "tailwindcss -i ./src/css/input.css -o ./dist/output.css --watch",
    "dev:serve": "serve . -l 3000",
    "dev": "concurrently -n css,web -c cyan,green \"npm:dev:css\" \"npm:dev:serve\"",
    "build": "tailwindcss -i ./src/css/input.css -o ./dist/output.css --minify",
    "lint": "eslint src/js",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "check": "npm run lint && npm run format:check"
  },
  "devDependencies": {
    "@tailwindcss/cli": "^4",
    "tailwindcss": "^4",
    "concurrently": "^9",
    "eslint": "^9",
    "prettier": "^3",
    "prettier-plugin-tailwindcss": "^0.6",
    "serve": "^14"
  }
}
```

> Versi di atas hanya acuan. Saat menginstal, gunakan versi stabil terbaru dan sesuaikan perintah jika CLI berubah. Jika `tailwindcss` CLI tidak ditemukan, gunakan `npx @tailwindcss/cli …`.

`dist/` ada di `.gitignore`; deploy harus menjalankan `npm run build` terlebih dahulu.

## 4. Struktur Direktori

```
pustakaloka/
├── AGENTS.md  PRD.md  Design.md  README.md
├── package.json  .gitignore  .prettierrc  eslint.config.js
├── index.html  katalog.html  buku.html  koleksi.html  layanan.html
├── reservasi.html  pustakawan.html  berita.html  berita-detail.html
├── tentang.html  kontak.html  daftar-anggota.html  simpanan.html  404.html
├── sitemap.xml  robots.txt  favicon.svg
├── assets/
│   └── img/
│       ├── hero/  koleksi/  buku/  staf/  berita/  galeri/  ui/
│       └── CREDITS.md            # sumber & lisensi SETIAP gambar
├── dist/                         # hasil build (jangan di-commit)
│   └── output.css
└── src/
    ├── css/
    │   └── input.css             # @import tailwindcss + @theme + komponen (lihat Design.md §3.5)
    └── js/
        ├── pages/                # satu entry point per halaman
        │   ├── home.js  catalog.js  book-detail.js  collections.js  services.js
        │   ├── reservation.js  librarians.js  news.js  news-detail.js
        │   ├── about.js  contact.js  membership.js  saved.js  not-found.js
        ├── components/           # fungsi yang mengembalikan string HTML / memasang perilaku
        │   ├── layout.js         # mountLayout(): render topbar+header+footer, set menu aktif
        │   ├── header.js  footer.js  mobile-menu.js  search-overlay.js
        │   ├── section-heading.js  book-card.js  service-card.js
        │   ├── librarian-card.js  post-card.js  pagination.js  breadcrumb.js
        │   ├── vertical-tabs.js  accordion.js  toast.js  booking-form.js
        │   └── back-to-top.js  reveal.js
        ├── services/             # lapisan data & storage (satu-satunya yang boleh mengimpor data/)
        │   ├── book-service.js  content-service.js
        │   ├── reservation-service.js  member-service.js  bookmark-service.js
        │   └── storage.js
        ├── data/                 # konten statis (diedit pengelola)
        │   ├── site.js  categories.js  books.js  services.js
        │   ├── librarians.js  posts.js  faqs.js
        └── utils/
            ├── dom.js  url.js  format.js  validate.js  icons.js  debounce.js  escape.js
```

Aturan struktur:

- **Semua HTML di root** (path relatif sederhana). Jangan membuat subfolder untuk halaman.
- Satu halaman = satu file entry di `src/js/pages/` (`<script type="module" src="./src/js/pages/xxx.js">`).
- Logika dipakai ≥ 2 halaman → pindahkan ke `components/`, `services/`, atau `utils/`.

## 5. Kerangka Halaman Standar

Setiap halaman HARUS mengikuti kerangka ini (ganti nilai spesifik):

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Katalog Buku — Pustakaloka</title>
    <meta
      name="description"
      content="Cari dan temukan buku koleksi Pustakaloka. Filter berdasarkan kategori, bahasa, dan ketersediaan."
    />
    <link rel="canonical" href="https://example.com/katalog.html" />
    <meta property="og:title" content="Katalog Buku — Pustakaloka" />
    <meta property="og:description" content="…" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="https://example.com/assets/img/og-default.jpg" />
    <link rel="icon" href="./favicon.svg" type="image/svg+xml" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="./dist/output.css" />
  </head>
  <body data-page="catalog" class="min-h-screen">
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-70 focus:rounded focus:bg-white focus:px-4 focus:py-2"
    >
      Lewati ke konten utama
    </a>

    <div id="site-header" class="min-h-[108px]"></div>

    <main id="main" tabindex="-1">
      <!-- Konten khusus halaman -->
    </main>

    <div id="site-footer"></div>

    <noscript>
      <p class="p-4 text-center">
        Aktifkan JavaScript untuk pengalaman penuh. Menu: <a href="./index.html">Beranda</a> ·
        <a href="./katalog.html">Katalog</a> · <a href="./kontak.html">Kontak</a>
      </p>
    </noscript>

    <script type="module" src="./src/js/pages/catalog.js"></script>
  </body>
</html>
```

Entry halaman selalu diawali pemasangan layout:

```js
// src/js/pages/catalog.js
import { mountLayout } from '../components/layout.js';
import { searchBooks } from '../services/book-service.js';

mountLayout(); // render header+footer, tandai menu aktif dari <body data-page>
// …logika khusus halaman…
```

Nilai `data-page` standar: `home`, `catalog`, `book`, `collections`, `services`, `reservation`, `librarians`, `news`, `news-detail`, `about`, `contact`, `membership`, `saved`, `not-found`.

## 6. Konvensi Kode

### 6.1 HTML

- Semantik: `header`, `nav`, `main`, `section`, `article`, `aside`, `footer`, `figure`, `button` (aksi) vs `a` (navigasi).
- Satu `<h1>` per halaman; heading berurutan.
- Setiap `<section>` memiliki heading atau `aria-labelledby`.
- Gambar: selalu `alt`, `width`, `height`; `loading="lazy"` kecuali gambar LCP/hero; `decoding="async"`.
- Link eksternal: `target="_blank" rel="noopener noreferrer"`.
- Form: `<label for>` untuk setiap kontrol, `name`, `autocomplete` yang sesuai, `type` tepat (`email`, `tel`, `date`), `novalidate` pada `<form>` (validasi ditangani JS agar pesan konsisten).
- Jangan memakai `onclick=""` inline atau atribut `style=""`.
- ID unik; kelas hook JS memakai atribut `data-*` (mis. `data-tab`, `data-action="bookmark"`), **bukan** kelas Tailwind sebagai selector.

### 6.2 Tailwind CSS

- Gunakan **utility class** langsung; hindari CSS kustom kecuali di `input.css` (bagian `@layer components`) untuk pola yang berulang ≥ 3 kali (`btn`, `field`, `container-page`, dst.).
- Semua warna/ukuran dari **token** (`bg-brand-700`, `text-ink-900`, `shadow-card`). Dilarang `text-[#0abcde]` atau nilai arbitrer tanpa alasan kuat (boleh untuk `clamp()`, ukuran tata letak spesifik dari Design.md).
- Urutan kelas dirapikan oleh `prettier-plugin-tailwindcss`.
- Mobile-first: tulis gaya dasar untuk mobile, lalu `sm:`, `md:`, `lg:`.
- Tombol dengan teks kecil memakai `bg-brand-700` (bukan `brand-500`) demi kontras — lihat `Design.md` §3.1.
- Gunakan `focus-visible:` untuk gaya fokus; jangan menghapus outline tanpa pengganti.
- Variasi dinamis: **jangan** menyusun nama kelas dari string parsial (`` `bg-${color}-500` ``) karena tidak terdeteksi Tailwind — tulis kelas lengkap dalam kode (mis. peta `{ success: 'bg-success-50 text-success-700' }`).
- Setelah menambah kelas baru di file JS, pastikan terdeteksi oleh Tailwind (v4 memindai sumber otomatis). Jika ada kelas yang tidak muncul, tambahkan `@source "../js";` / `@source "../../*.html";` di `input.css`.

### 6.3 JavaScript

- **ES Modules**, `const`/`let` (tanpa `var`), `===`, fungsi panah/deklarasi biasa, `async/await`.
- Satu tanggung jawab per fungsi; nama kerja yang jelas: `renderBookCard`, `getBookById`, `toggleBookmark`.
- Penamaan: `camelCase` (variabel/fungsi), `PascalCase` (hanya jika class), `UPPER_SNAKE_CASE` (konstanta), `kebab-case` (nama file).
- Tidak ada variabel global; tidak ada `window.xxx =`. Jangan mengubah prototipe bawaan.
- **Dilarang** library/CDN JS pihak ketiga di runtime tanpa persetujuan (lihat §10).
- Komentar singkat dalam Bahasa Indonesia untuk _mengapa_, bukan _apa_. JSDoc untuk fungsi publik di `services/` dan `utils/`.
- Tangani error: `try/catch` untuk `localStorage`, `JSON.parse`, dan clipboard; tampilkan pesan ramah (toast), bukan membiarkan error ke console.
- Tidak ada `console.log` tersisa pada commit (boleh `console.warn/error` terarah).

### 6.4 Rendering HTML dari JS (KEAMANAN)

- Template literal untuk string HTML boleh **hanya** jika semua nilai dinamis melewati `escapeHTML()` (`utils/escape.js`).
- Data dari URL (`?q=`, `?id=`), form, dan `localStorage` dianggap **tidak tepercaya**.
- Untuk teks sederhana gunakan `element.textContent = value`.
- Jangan memakai `eval`, `new Function`, `document.write`, atau `innerHTML` dengan data mentah.

```js
// utils/escape.js
const MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const escapeHTML = (value = '') => String(value).replace(/[&<>"']/g, (c) => MAP[c]);
```

```js
// components/book-card.js
import { escapeHTML as e } from '../utils/escape.js';
import { icon } from '../utils/icons.js';

export function bookCard(book, { saved = false } = {}) {
  const available = book.stock.available > 0;
  return `
  <article class="group relative flex flex-col bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-card-hover">
    <a href="./buku.html?id=${encodeURIComponent(book.id)}" class="block overflow-hidden bg-surface">
      <img src="${e(book.cover)}" alt="Sampul buku ${e(book.title)}" width="400" height="600" loading="lazy" decoding="async"
           class="aspect-[2/3] w-full object-cover transition duration-300 group-hover:scale-[1.03]" />
    </a>
    <span class="absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${available ? 'bg-success-50 text-success-700' : 'bg-warning-50 text-warning-700'}">
      ${available ? 'Tersedia' : 'Dipinjam'}
    </span>
    <button type="button" data-action="bookmark" data-id="${e(book.id)}" aria-pressed="${saved}"
            aria-label="${saved ? 'Hapus' : 'Simpan'} ${e(book.title)}"
            class="absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-white/90 text-brand-700 hover:bg-white">
      ${icon(saved ? 'bookmark-filled' : 'bookmark', { class: 'size-5' })}
    </button>
    <div class="flex flex-1 flex-col gap-1 p-4">
      <h3 class="line-clamp-2 text-base font-semibold text-ink-900">${e(book.title)}</h3>
      <p class="text-[13px] text-subtle">${e(book.author)}</p>
    </div>
  </article>`;
}
```

### 6.5 Services & Data

- Halaman dan komponen **tidak** mengimpor dari `data/` secara langsung — selalu lewat `services/` (agar nanti mudah diganti `fetch()`).
- Fungsi service dibuat **async** (mengembalikan `Promise`) walaupun datanya sinkron, supaya kontrak sama dengan API nanti.

```js
// services/book-service.js
import { books } from '../data/books.js';
import { normalize } from '../utils/format.js';

/**
 * @param {{q?:string, categories?:string[], language?:string, onlyAvailable?:boolean,
 *          sort?:'newest'|'az'|'za'|'popular', page?:number, perPage?:number}} params
 * @returns {Promise<{items:object[], total:number, page:number, totalPages:number}>}
 */
export async function searchBooks({
  q = '',
  categories = [],
  language = '',
  onlyAvailable = false,
  sort = 'newest',
  page = 1,
  perPage = 12,
} = {}) {
  const needle = normalize(q);
  let list = books.filter((b) => {
    const hay = normalize([b.title, b.author, b.isbn, ...b.tags].join(' '));
    return (
      (!needle || hay.includes(needle)) &&
      (!categories.length || categories.includes(b.categoryId)) &&
      (!language || b.language === language) &&
      (!onlyAvailable || b.stock.available > 0)
    );
  });

  const sorters = {
    newest: (a, b) => b.addedAt.localeCompare(a.addedAt),
    az: (a, b) => a.title.localeCompare(b.title, 'id'),
    za: (a, b) => b.title.localeCompare(a.title, 'id'),
    popular: (a, b) => b.popularity - a.popularity,
  };
  list = [...list].sort(sorters[sort] ?? sorters.newest);

  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const current = Math.min(Math.max(1, page), totalPages);
  return {
    items: list.slice((current - 1) * perPage, current * perPage),
    total,
    page: current,
    totalPages,
  };
}

export const getBookById = async (id) => books.find((b) => b.id === id) ?? null;
```

### 6.6 Storage

```js
// services/storage.js — selalu aman terhadap storage yang diblokir/penuh
const memory = new Map();

export function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return memory.has(key) ? memory.get(key) : fallback;
  }
}

export function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    memory.set(key, value);
  }
}
```

Kunci memakai prefiks `pustakaloka:` (`bookmarks`, `reservations`, `members`). **Jangan** menyimpan data sensitif (NIK, kata sandi, dll).

### 6.7 State di URL

- Katalog, Koleksi, Berita menyimpan state di query string (`utils/url.js`: `getParams()`, `setParams(obj, { replace })`).
- Perubahan filter memakai `history.replaceState` (ketik) atau `pushState` (pindah halaman/ganti filter eksplisit); dengarkan `popstate`.
- Validasi nilai dari URL (angka halaman, enum urutan) dan kembalikan ke default bila tidak valid.

### 6.8 Event & DOM

- Gunakan **event delegation** pada kontainer (`container.addEventListener('click', …)` lalu `event.target.closest('[data-action]')`).
- Render ulang dengan `container.innerHTML = …` hanya untuk string yang sudah di-escape; pertahankan fokus (kembalikan ke elemen relevan) setelah render.
- Hindari layout thrash; batasi listener `scroll` dengan `requestAnimationFrame`/`IntersectionObserver`.
- Debounce input pencarian 300 ms (`utils/debounce.js`).

### 6.9 Validasi Form

Aturan di `utils/validate.js`, pesan Bahasa Indonesia:

| Field       | Aturan                                              | Pesan                                                                                            |
| ----------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Nama        | wajib, 3–80 karakter                                | "Nama lengkap wajib diisi (minimal 3 karakter)."                                                 |
| Email       | wajib, regex sederhana `^[^\s@]+@[^\s@]+\.[^\s@]+$` | "Format email tidak valid, contoh: nama@email.com."                                              |
| Telepon     | `^(\+62\|62\|0)8[0-9]{8,12}$`                       | "Nomor telepon tidak valid, contoh: 081234567890."                                               |
| Tanggal     | ≥ hari ini, ≤ +30 hari, bukan hari tutup            | "Pilih tanggal mulai hari ini sampai 30 hari ke depan." / "Perpustakaan tutup pada hari Minggu." |
| Layanan     | wajib                                               | "Pilih salah satu layanan."                                                                      |
| Persetujuan | wajib dicentang                                     | "Anda perlu menyetujui syarat keanggotaan."                                                      |

Perilaku: validasi saat `submit` dan `blur`; set `aria-invalid`, tampilkan pesan di elemen `id="{field}-error"` dengan `aria-describedby`; fokuskan error pertama; tombol submit dikunci saat memproses.

## 7. Cara Menambah Hal Baru

### 7.1 Menambah halaman

1. Buat `nama.html` dengan kerangka §5 (title, description, canonical, OG unik, `data-page`).
2. Buat `src/js/pages/nama.js` (impor `mountLayout`).
3. Tambahkan ke menu di `components/header.js` bila perlu & ke footer (`footer.js`).
4. Tambahkan URL ke `sitemap.xml`.
5. Perbarui tabel sitemap di `PRD.md` §8 bila ruang lingkup berubah.
6. Jalankan checklist §11.

### 7.2 Menambah komponen

1. Buat `src/js/components/nama-komponen.js` yang mengekspor fungsi `render…()` (mengembalikan string) dan, jika ada interaksi, `init…(root)`.
2. Pastikan semua nilai dinamis di-escape dan atribut ARIA lengkap.
3. Cocokkan visual dengan `Design.md`; jika komponen baru, dokumentasikan di `Design.md` §6.

### 7.3 Menambah/ubah konten

- **Buku:** tambah objek ke `data/books.js` mengikuti skema `PRD.md` §12; `id` = slug unik huruf kecil dan tanda hubung; `cover` mengarah ke file yang ada; `stock.available ≤ stock.total`.
- **Berita:** tambah ke `data/posts.js` (urut terbaru dulu tidak wajib — service mengurutkan).
- **Layanan/Pustakawan/FAQ:** edit `data/services.js`, `librarians.js`, `faqs.js`.
- **Info situs** (nama, alamat, jam, sosmed): hanya di `data/site.js`.
- Jangan menaruh teks konten di dalam file HTML/komponen bila tersedia di `data/`.

### 7.4 Menambah ikon

Tambahkan path SVG ke objek `ICONS` di `utils/icons.js` (viewBox `0 0 24 24`, `fill="none" stroke="currentColor" stroke-width="1.75"`), lalu panggil `icon('nama')`.

## 8. Aksesibilitas — Wajib

- Navigasi keyboard penuh (Tab, Shift+Tab, Enter, Space, Esc, panah pada tab/menu).
- Drawer/overlay: fokus masuk ke dalam saat dibuka, terkunci (focus trap), kembali ke pemicu saat ditutup; tombol Esc menutup; `aria-expanded` & `aria-controls` pada pemicu; `inert`/`aria-hidden` pada latar jika perlu.
- Tab & akordeon mengikuti WAI-ARIA APG.
- Pembaruan dinamis (hasil pencarian, toast, sukses form) diumumkan dengan `aria-live`/`role="status"`.
- Kontras: lihat `Design.md` §3.1 dan §11.
- `prefers-reduced-motion` dihormati.
- Jangan mengandalkan warna saja untuk status (tambah ikon/teks).
- Uji dengan axe DevTools/Lighthouse pada setiap halaman sebelum dianggap selesai.

## 9. Performa & SEO

- Hanya gambar hero yang memakai `fetchpriority="high"` dan tanpa lazy-load; sisanya `loading="lazy"`.
- Ukuran gambar sesuai tampilan (jangan memuat 3000 px untuk kotak 300 px); format WebP.
- Satu stylesheet (`dist/output.css`); tanpa `@import` CSS tambahan selain font.
- JS tidak memblokir render (`type="module"` bersifat deferred secara default).
- Hindari _layout shift_: sediakan `min-h` pada `#site-header`, `width/height` pada gambar, skeleton untuk daftar.
- Setiap halaman: `<title>` & `meta description` unik (≤ 60 / ≤ 160 karakter), canonical, OG tags.
- Halaman dinamis (`buku.html`, `berita-detail.html`) memperbarui `document.title` dan meta description di JS; sisipkan JSON-LD (`Book`, `Article`) lewat `<script type="application/ld+json">` yang dibuat dengan `JSON.stringify` (aman).
- `sitemap.xml` dan `robots.txt` selalu diperbarui.

## 10. Batasan Perilaku Agent

### ✅ Boleh dilakukan tanpa bertanya

- Membuat/mengubah halaman, komponen, data, dan gaya sesuai `PRD.md` & `Design.md`.
- Memperbaiki bug, aksesibilitas, performa, dan typo.
- Menambah utilitas kecil di `utils/` dan menulis dokumentasi.

### ⚠️ Tanyakan dulu

- Menambah **dependensi** baru (runtime maupun dev) atau library CDN.
- Mengubah token desain (warna, font, radius), struktur direktori, atau konvensi nama.
- Mengubah skema data (`books`, `posts`, dll.) yang memengaruhi banyak halaman.
- Menambah/menghapus halaman di luar PRD, atau mengubah aturan bisnis.
- Mengubah build/tooling (`package.json` scripts, konfigurasi ESLint/Prettier).
- Menambahkan analytics, form service eksternal, atau panggilan jaringan apa pun.

### 🚫 Jangan pernah

- Menyalin aset gambar/teks dari template referensi atau situs lain tanpa lisensi.
- Menambahkan framework (React/Vue/jQuery/Bootstrap/Alpine, dll.) atau bundler.
- Memakai `innerHTML` dengan data mentah; `eval`; `document.write`.
- Menyimpan data sensitif di `localStorage`, atau menaruh secret/API key di repo.
- Menghapus atribut aksesibilitas atau outline fokus demi tampilan.
- Meninggalkan teks _lorem ipsum_, `console.log`, `TODO` tanpa isu, atau tautan `#` kosong pada hasil akhir.
- Menulis CSS di `style=""` atau file CSS lain di luar `input.css`.
- Meng-commit `node_modules/` atau `dist/`.
- Mengubah file lain di luar cakupan tugas (jaga _diff_ tetap kecil dan terfokus).

## 11. Definition of Done (per halaman/fitur)

Centang semuanya sebelum menyatakan selesai:

**Fungsi**

- [ ] Sesuai requirement `PRD.md` (sebutkan ID FR yang dipenuhi)
- [ ] Semua tautan internal valid; tidak ada `href="#"` kosong
- [ ] State kosong, error, loading, dan data tidak ditemukan ditangani
- [ ] Parameter URL tidak valid ditangani dengan default aman
- [ ] Data tersimpan/terbaca benar dari `localStorage` (dan aman jika storage diblokir)

**Visual**

- [ ] Mengikuti `Design.md` (token, komponen, ritme latar, spacing)
- [ ] Diuji di 360, 390, 768, 1024, 1280, 1440 px — tanpa scroll horizontal
- [ ] Semua state interaktif: hover, fokus, aktif, disabled

**Kualitas**

- [ ] Tidak ada error/warning di console
- [ ] `npm run check` lolos (ESLint & Prettier)
- [ ] HTML valid (html-validate/W3C), satu `<h1>`, landmark benar
- [ ] Lighthouse mobile: Perf ≥ 90, A11y ≥ 95, Best Practices ≥ 95, SEO ≥ 95
- [ ] axe: 0 isu kritis/serius; navigasi keyboard penuh berhasil
- [ ] Gambar: alt, width/height, lazy (kecuali hero), ukuran wajar; sumber tercatat di `CREDITS.md`
- [ ] Title, description, canonical, OG diisi; masuk `sitemap.xml`

## 12. Daftar Uji Manual Cepat

| Skenario                               | Hasil yang diharapkan                                                    |
| -------------------------------------- | ------------------------------------------------------------------------ |
| Hero search "web" + kategori Teknologi | Pindah ke `katalog.html?q=web&kategori=teknologi` dengan hasil terfilter |
| Katalog: ketik cepat lalu Back         | Tidak ada hasil ganda; URL dan hasil konsisten                           |
| Katalog: query tanpa hasil             | Empty state + tombol Reset Filter                                        |
| `buku.html?id=tidak-ada`               | State "Buku tidak ditemukan" + tautan ke katalog                         |
| Bookmark buku → refresh                | Status tetap; badge di header bertambah                                  |
| Reservasi tanggal Minggu               | Error spesifik; data tidak tersimpan                                     |
| Reservasi valid                        | Loading → konfirmasi + kode `RSV-…`; tersimpan di localStorage           |
| Reservasi dengan localStorage diblokir | Tetap berfungsi (memori) tanpa error console                             |
| Menu mobile                            | Terbuka/tertutup via tombol, overlay, Esc; fokus terjebak lalu kembali   |
| Tab Koleksi dengan keyboard            | ↑/↓ berpindah, Home/End bekerja, panel berubah                           |
| Tanpa JavaScript                       | Muncul pesan `<noscript>` dengan tautan navigasi dasar                   |
| `prefers-reduced-motion` aktif         | Tidak ada animasi non-esensial                                           |
| Zoom 200%                              | Tata letak tetap terbaca, tanpa elemen terpotong                         |

## 13. Git & Kolaborasi

- Cabang: `main` (stabil), `feat/<nama>`, `fix/<nama>`, `docs/<nama>`.
- Commit mengikuti **Conventional Commits**: `feat(catalog): tambah filter ketersediaan`, `fix(reservation): tolak tanggal hari Minggu`, `docs: perbarui PRD`.
- Satu PR = satu tujuan; sertakan: ringkasan, ID FR terkait, tangkapan layar (mobile + desktop), hasil checklist §11.
- Jangan commit: `node_modules/`, `dist/`, `.DS_Store`, file `.env`.

`.gitignore` minimal:

```
node_modules/
dist/
.DS_Store
.env
```

## 14. Rencana Pengerjaan yang Disarankan untuk Agent

Kerjakan **berurutan** dan hentikan untuk verifikasi di akhir tiap tahap:

1. **Setup** — `package.json`, Tailwind v4 + `input.css` (token dari `Design.md` §3.5), `.prettierrc`, ESLint, `.gitignore`, struktur folder, `utils/` (escape, dom, url, format, validate, icons, debounce), `services/storage.js`.
2. **Layout bersama** — `components/layout.js`, `header.js`, `footer.js`, `mobile-menu.js`, `search-overlay.js`, `toast.js`, `back-to-top.js`, kerangka `index.html`.
3. **Data awal** — `site.js`, `categories.js` (7), `services.js` (8), `librarians.js` (≥ 4), `books.js` (≥ 24 untuk menguji paginasi), `posts.js` (≥ 6), `faqs.js` (≥ 6). Gunakan gambar placeholder lokal.
4. **Beranda** — urutan bagian sesuai `Design.md` §5.
5. **Katalog + Detail Buku + Simpanan** (termasuk `book-service`, `bookmark-service`, paginasi, state URL).
6. **Koleksi, Layanan, Reservasi** (`booking-form.js` dipakai ulang di beranda).
7. **Pustakawan, Berita (+detail), Tentang, Kontak, Daftar Anggota, 404.**
8. **Polish** — SEO (`sitemap.xml`, `robots.txt`, JSON-LD), aksesibilitas, performa gambar, QA lintas perangkat/browser, perbaikan checklist §11, `README.md` (cara menjalankan, struktur, cara edit konten, cara deploy).

Setelah tiap tahap, laporkan: apa yang selesai, file yang diubah, hasil uji (§12), dan asumsi/pertanyaan terbuka.

## 15. Deployment (ringkas)

1. `npm ci && npm run build` → hasilkan `dist/output.css`.
2. Publikasikan seluruh repo **kecuali** `node_modules/` (HTML di root + `assets/` + `dist/` + `src/js/`).
3. GitHub Pages/Netlify/Vercel: atur perintah build `npm run build`, direktori publikasi root (`.`).
4. Tambahkan header keamanan di hosting bila mungkin, mis. `Content-Security-Policy: default-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; script-src 'self'`.
5. Perbarui URL canonical, OG, dan `sitemap.xml` ke domain produksi.
