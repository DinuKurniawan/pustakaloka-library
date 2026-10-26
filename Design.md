# Design.md — Sistem Desain Website Perpustakaan "Pustakaloka"

Dokumen ini adalah **sumber kebenaran visual**. Semua halaman harus memakai token, komponen, dan pola di sini. Lihat `PRD.md` untuk fitur dan `AGENTS.md` untuk aturan implementasi.

Stack styling: **Tailwind CSS v4** (token di `@theme` pada `src/css/input.css`) + sedikit komponen `@layer components`.

---

## 1. Prinsip Desain

1. **Bersih & lapang** — latar putih/abu muda, banyak ruang kosong, satu warna aksen (teal).
2. **Teal sebagai penuntun** — aksen hanya untuk aksi, status aktif, ikon, dan judul penekanan.
3. **Hierarki jelas** — judul bagian KAPITAL tebal, subjudul kecil, divider ber-ikon.
4. **Konsisten** — bagian selalu berselang-seling latar putih ↔ abu muda ↔ foto.
5. **Aksesibel sejak awal** — kontras ≥ 4,5:1, fokus terlihat, target sentuh ≥ 44 px.
6. **Ringan** — ikon SVG inline, gambar WebP, tanpa library UI.

## 2. Hasil Analisis Template Referensi

| Aspek             | Observasi pada template                                                                               | Keputusan untuk Pustakaloka                       |
| ----------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| Lebar konten      | ±71% dari lebar halaman, terpusat (setara container ±1170 px)                                         | `max-w-[1170px]`, padding samping 16/24 px        |
| Warna dominan     | Teal (#12B0B5-ish), putih, abu muda (#F5F5F5), abu gelap footer (#4A4A4A)                             | Lihat bagian 3.1                                  |
| Tipografi         | Sans geometris (tampak seperti Poppins), judul KAPITAL tebal                                          | **Poppins** 400/500/600/700                       |
| Header            | Topbar tipis + navbar putih dengan blok teal miring di kanan memuat menu putih KAPITAL kecil          | Diimplementasikan dengan `clip-path` (bagian 6.2) |
| Hero              | Foto penuh lebar, judul KAPITAL putih + kata aksen teal, 2 tombol, kotak pencarian abu gelap di bawah | Bagian 6.3–6.4                                    |
| Judul bagian      | KAPITAL tebal tengah + subjudul abu + garis-ikon-garis                                                | Komponen `section-heading`                        |
| Tab vertikal      | Latar abu muda, item aktif teal dengan panah segitiga ke kanan                                        | Komponen `vtabs`                                  |
| Kartu layanan     | Putih, ikon dalam kotak rounded berbingkai teal, hover solid teal + bayangan                          | Komponen `service-card`                           |
| Form di atas foto | Kartu putih, input abu terisi, tombol teal penuh lebar                                                | Komponen `booking-card`                           |
| Kartu spesialis   | Foto, nama, gelar; kartu aktif punya panel teal di bawah                                              | Komponen `librarian-card`                         |
| Artikel           | Kartu horizontal: gambar kiri, teks kanan, bayangan halus                                             | Komponen `post-card`                              |
| Footer            | Latar abu gelap, 3 kolom, bar copyright lebih gelap                                                   | Komponen `footer`                                 |
| Ritme latar       | Putih → abu → putih → foto → putih → abu → gelap                                                      | Dipertahankan                                     |

## 3. Design Tokens

### 3.1 Warna

**Brand (teal)**

| Token           | Hex           | Penggunaan                                                                                        |
| --------------- | ------------- | ------------------------------------------------------------------------------------------------- |
| `brand-50`      | `#E6F7F7`     | Latar lembut, hover item                                                                          |
| `brand-100`     | `#C2EBEC`     | Border ringan aktif                                                                               |
| `brand-200`     | `#99DEDF`     | Dekoratif                                                                                         |
| `brand-300`     | `#66CDCF`     | Dekoratif                                                                                         |
| `brand-400`     | `#2EBFC1`     | Hover dekoratif                                                                                   |
| **`brand-500`** | **`#0FB3B5`** | **Warna brand utama (template)**: aksen judul besar, ikon, border, blok slant header, panel aktif |
| `brand-600`     | `#0A9A9C`     | Hover elemen brand-500                                                                            |
| **`brand-700`** | **`#087A7D`** | **Tombol/teks tautan kecil di atas putih** (kontras 5,1:1)                                        |
| `brand-800`     | `#065F62`     | Hover tombol, teks di atas brand-50                                                               |
| `brand-900`     | `#044749`     | Teks gelap bertema teal                                                                           |

> **Aturan kontras (penting):** teks putih di atas `brand-500` hanya ±2,6:1 → **gagal AA untuk teks kecil**. Karena itu:
>
> - Tombol dengan teks < 18 px / < 14 px bold → pakai `bg-brand-700 hover:bg-brand-800`.
> - `bg-brand-500` dengan teks putih hanya untuk teks **besar & tebal** (≥ 18,66 px bold / 24 px) atau elemen dekoratif tanpa teks. Blok slant header memuat menu 13 px, jadi memakai `brand-700` (lihat 6.2).
> - Tautan teks di atas putih: `text-brand-700`.

**Netral**

| Token          | Hex       | Penggunaan                         |
| -------------- | --------- | ---------------------------------- |
| `ink-900`      | `#2B2B2B` | Judul/heading                      |
| `ink-700`      | `#444444` | Teks kuat                          |
| `body`         | `#666666` | Teks isi (5,7:1 di putih)          |
| `subtle`       | `#757575` | Placeholder, meta (4,6:1 di putih) |
| `line`         | `#E8E8E8` | Border, divider                    |
| `field`        | `#EEEEEE` | Latar input                        |
| `surface`      | `#F5F5F5` | Latar bagian abu muda              |
| `charcoal-600` | `#5C5C5C` | Kotak pencarian hero               |
| `charcoal-700` | `#4A4A4A` | Latar footer                       |
| `charcoal-900` | `#333333` | Bar copyright footer               |

**Semantik**

| Token                        | Hex                   | Teks di atasnya               |
| ---------------------------- | --------------------- | ----------------------------- |
| `success-600` / `success-50` | `#16A34A` / `#F0FDF4` | Teks status memakai `#15803D` |
| `warning-600` / `warning-50` | `#D97706` / `#FFFBEB` | Teks status memakai `#B45309` |
| `danger-600` / `danger-50`   | `#DC2626` / `#FEF2F2` | Teks error memakai `#B91C1C`  |

### 3.2 Tipografi

Font: **Poppins** (Google Fonts) bobot 400, 500, 600, 700, dengan fallback `ui-sans-serif, system-ui, sans-serif`.

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
  rel="stylesheet"
/>
```

| Peran                    | Ukuran                           | Tailwind                                      | Bobot / gaya                                    |
| ------------------------ | -------------------------------- | --------------------------------------------- | ----------------------------------------------- |
| Hero H1                  | `clamp(2rem, 5vw, 3.5rem)` / 1.1 | `text-[clamp(2rem,5vw,3.5rem)] leading-[1.1]` | 700, UPPERCASE, `tracking-wide`                 |
| Judul bagian (H2)        | 28 → 32 px                       | `text-[1.75rem] md:text-[2rem]`               | 700, UPPERCASE, `tracking-wide`, `text-ink-900` |
| Judul halaman dalam (H1) | 32 → 40 px                       | `text-3xl md:text-4xl`                        | 700                                             |
| Judul kartu (H3)         | 16–18 px                         | `text-base md:text-lg`                        | 600                                             |
| Subjudul bagian          | 14 px                            | `text-sm`                                     | 400, `text-body`                                |
| Teks isi                 | 15 px / 1.7                      | `text-[15px] leading-7`                       | 400, `text-body`                                |
| Teks kecil / meta        | 13 px                            | `text-[13px]`                                 | 400–500, `text-subtle`                          |
| Label menu / tombol      | 13 px                            | `text-[13px] uppercase tracking-wider`        | 600                                             |
| Label form               | 13 px                            | `text-[13px]`                                 | 500, `text-ink-700`                             |

Aturan: ukuran teks isi minimal **14 px**; 12 px hanya untuk label uppercase non-esensial. Satu `<h1>` per halaman; jangan melompati level heading.

### 3.3 Spacing, Radius, Bayangan, Z-index

| Kategori                        | Nilai                                                                                                                       |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **Padding bagian**              | `py-16 md:py-24` (hero & CTA khusus boleh berbeda)                                                                          |
| **Jarak judul bagian → konten** | `mb-12 md:mb-14`                                                                                                            |
| **Gap grid kartu**              | `gap-6` (24 px) — layanan/pustakawan/buku; `gap-8` untuk berita                                                             |
| **Padding kartu**               | `p-6` (kartu layanan `px-5 py-8`)                                                                                           |
| **Radius**                      | `rounded-sm` 2 px (kartu), `rounded` 4 px (tombol, input), `rounded-2xl` 16 px (kotak ikon), `rounded-full` (badge, avatar) |
| **Bayangan kartu**              | `shadow-card`: `0 5px 20px rgb(0 0 0 / 0.08)`                                                                               |
| **Bayangan hover**              | `shadow-card-hover`: `0 12px 32px rgb(0 0 0 / 0.14)`                                                                        |
| **Z-index**                     | header 40 · drawer/overlay 50 · toast 60 · skip-link 70                                                                     |

### 3.4 Breakpoint & Container

Breakpoint default Tailwind: `sm 640` · `md 768` · `lg 1024` · `xl 1280` · `2xl 1536`. Pendekatan **mobile-first**.

Container: `mx-auto w-full max-w-[1170px] px-4 sm:px-6` (utility `container-page`).

### 3.5 `src/css/input.css` (acuan)

```css
@import 'tailwindcss';

@theme {
  /* Font */
  --font-sans: 'Poppins', ui-sans-serif, system-ui, sans-serif;

  /* Brand */
  --color-brand-50: #e6f7f7;
  --color-brand-100: #c2ebec;
  --color-brand-200: #99dedf;
  --color-brand-300: #66cdcf;
  --color-brand-400: #2ebfc1;
  --color-brand-500: #0fb3b5;
  --color-brand-600: #0a9a9c;
  --color-brand-700: #087a7d;
  --color-brand-800: #065f62;
  --color-brand-900: #044749;

  /* Netral */
  --color-ink-900: #2b2b2b;
  --color-ink-700: #444444;
  --color-body: #666666;
  --color-subtle: #757575;
  --color-line: #e8e8e8;
  --color-field: #eeeeee;
  --color-surface: #f5f5f5;
  --color-charcoal-600: #5c5c5c;
  --color-charcoal-700: #4a4a4a;
  --color-charcoal-900: #333333;

  /* Semantik */
  --color-success-700: #15803d;
  --color-warning-700: #b45309;
  --color-danger-700: #b91c1c;

  /* Bayangan */
  --shadow-card: 0 5px 20px rgb(0 0 0 / 0.08);
  --shadow-card-hover: 0 12px 32px rgb(0 0 0 / 0.14);
}

@layer base {
  html {
    scroll-behavior: smooth;
  }
  body {
    @apply text-body bg-white font-sans text-[15px] leading-7 antialiased;
  }
  h1,
  h2,
  h3,
  h4 {
    @apply text-ink-900 font-bold;
  }
  :focus-visible {
    @apply outline-brand-700 outline-2 outline-offset-2;
  }
  @media (prefers-reduced-motion: reduce) {
    html {
      scroll-behavior: auto;
    }
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
}

@layer components {
  .container-page {
    @apply mx-auto w-full max-w-[1170px] px-4 sm:px-6;
  }
  .section {
    @apply py-16 md:py-24;
  }

  .btn {
    @apply inline-flex min-h-11 items-center justify-center gap-2 rounded px-6 text-[13px] font-semibold tracking-wider uppercase transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50;
  }
  .btn-primary {
    @apply btn bg-brand-700 hover:bg-brand-800 text-white;
  }
  .btn-light {
    @apply btn text-ink-900 hover:bg-brand-50 bg-white;
  }
  .btn-outline {
    @apply btn border-brand-700 text-brand-700 hover:bg-brand-700 border hover:text-white;
  }

  .field {
    @apply bg-field text-ink-900 placeholder:text-subtle focus:border-brand-700 block min-h-11 w-full rounded border border-transparent px-4 text-sm focus:bg-white focus:outline-none;
  }
  .field[aria-invalid='true'] {
    @apply border-danger-700 bg-white;
  }

  .nav-slant {
    clip-path: polygon(48px 0, 100% 0, 100% 100%, 0 100%);
  }
  .tab-arrow::after {
    content: '';
    @apply border-l-brand-700 absolute top-1/2 -right-2.5 -translate-y-1/2 border-y-[10px] border-l-[10px] border-y-transparent;
  }
}
```

> Jika build Tailwind menolak `@apply` pada utility tertentu, ganti dengan CSS biasa — jangan menambah plugin.

## 4. Grid & Layout

| Bagian              | Mobile (<640)                                     | Tablet (≥768)       | Desktop (≥1024)                   |
| ------------------- | ------------------------------------------------- | ------------------- | --------------------------------- |
| Layanan             | 1 kolom                                           | 2 kolom             | **4 kolom**                       |
| Buku (katalog)      | 2 kolom                                           | 3 kolom             | 4 kolom (+ sidebar filter 260 px) |
| Pustakawan          | 1 kolom                                           | 2 kolom             | **3 kolom**                       |
| Berita (beranda)    | 1 kolom                                           | 1 kolom             | **2 kolom** (kartu horizontal)    |
| Koleksi (tab+panel) | tab jadi _select/scroll horizontal_ di atas panel | tab 1/3 + panel 2/3 | **tab 1/3 (±240px) + panel**      |
| Footer              | 1 kolom                                           | 2 kolom             | **3 kolom**                       |

## 5. Wireframe Beranda (desktop)

```
┌───────────────────────────────────────────────────────────────┐
│ f x ◎ ▶     Telp: +62…     Email: …            [ Reservasi ]  │  Topbar
├───────────────────────────────────────────────────────────────┤
│ PUSTAKALOKA   ╱▔▔▔ BERANDA TENTANG KOLEKSI LAYANAN BERITA KONTAK 🔍 ▔▔│  Header (slant teal)
├───────────────────────────────────────────────────────────────┤
│  JELAJAHI DUNIA                         (foto pustakawan /    │
│  LEWAT BUKU  ← aksen teal                pembaca, kanan)      │  Hero
│  [Tentang Kami] [Hubungi Kami]                                │
│        ┌──────────────────────────────────────────┐           │
│        │ [Kata kunci…] [Kategori ▾]   [ CARI ]    │           │  Search bar (charcoal)
│        └──────────────────────────────────────────┘           │
├───────────────────────────────────────────────────────────────┤
│                    KOLEKSI KAMI                               │  (putih)
│                    ──── 📖 ────                               │
│  ┌ Fiksi      ┐  ┌─────────────── banner ─────────────────┐   │
│  │▶Sains      ◀┤  │ Tentang Koleksi Sains                  │   │
│  │ Teknologi  │  │ paragraf…                              │   │
│  │ Sejarah …  │  │ ✓ poin  ✓ poin   ✓ poin  ✓ poin        │   │
│  └────────────┘  │ [Lihat di Katalog]                     │   │
├───────────────────────────────────────────────────────────────┤
│                    LAYANAN KAMI                               │  (abu muda)
│  [▢]   [■ aktif]  [▢]   [▢]      ← 4 kolom × 2 baris          │
├───────────────────────────────────────────────────────────────┤
│                    BUKU TERBARU  (4 kartu)                    │  (putih)
├───────────────────────────────────────────────────────────────┤
│  ┌──────────────┐                                             │
│  │ RESERVASI    │             (foto pustakawan, blur kiri)    │  (foto)
│  │ [form 2 kol] │                                             │
│  │ [Buat Reserv]│                                             │
│  └──────────────┘                                             │
├───────────────────────────────────────────────────────────────┤
│                  PUSTAKAWAN KAMI  (3 kartu)                   │  (putih)
│                  [‹]  [Semua Pustakawan]  [›]                 │
├───────────────────────────────────────────────────────────────┤
│                  BERITA & ARTIKEL  (2 kartu horizontal)       │  (abu muda)
├───────────────────────────────────────────────────────────────┤
│ TENTANG KAMI        NAVIGASI              GALERI (6 foto)     │  Footer (charcoal-700)
│ © 2026 Pustakaloka. Hak cipta dilindungi.                     │  (charcoal-900)
└───────────────────────────────────────────────────────────────┘
```

## 6. Komponen

### 6.1 Topbar

- Tinggi ±40 px, latar putih, teks 12–13 px `text-body`, ikon sosmed 16 px.
- Kiri: ikon sosmed; tengah: "Telepon: …" dan "Email: …"; kanan: tombol kecil `btn-primary` "Reservasi" (tinggi 32 px, `min-h-8`; target sentuh tetap ≥ 24 px — **di mobile** tombol dipindah ke drawer).
- Mobile: sembunyikan ikon sosmed dan email (`hidden md:flex`).

### 6.2 Header & Navigasi

```html
<header class="sticky top-0 z-40 bg-white shadow-sm">
  <div class="container-page flex h-16 items-center justify-between lg:h-[68px]">
    <a href="index.html" class="text-brand-700 text-xl font-bold tracking-wide">PUSTAKALOKA</a>
    <!-- Desktop menu -->
    <nav aria-label="Navigasi utama" class="hidden lg:block">…</nav>
    <button
      class="lg:hidden"
      aria-label="Buka menu"
      aria-expanded="false"
      aria-controls="mobile-menu"
    >
      …
    </button>
  </div>
</header>
```

- Desktop: blok menu `nav-slant bg-brand-700` memanjang ke tepi kanan layar (pakai elemen absolut `right-0` dengan lebar ±70% dari container), item `text-white text-[13px] font-semibold uppercase tracking-wider px-4 py-5`, hover `bg-brand-800`, aktif `border-b-2 border-white` + `aria-current="page"`. Sebagai penghormatan pada warna template, tambahkan strip tipis `bg-brand-500` (4 px) di bawah blok.
- Dropdown **Lainnya**: panel putih `shadow-card`, buka via klik/Enter (bukan hover saja), tutup Esc.
- Ikon cari 20 px di ujung kanan menu (membuka overlay pencarian).
- **Mobile**: drawer dari kanan lebar `min(85vw, 340px)`, latar putih, item vertikal 48 px, overlay `bg-black/50`, tombol Reservasi di bawah drawer.
- Header menyusut (padding) saat scroll > 40 px (opsional).

### 6.3 Hero

- Tinggi: `min-h-[420px] md:min-h-[520px] lg:min-h-[620px]`.
- Gambar latar `object-cover` + gradien kiri → transparan untuk menjaga kontras teks: `bg-gradient-to-r from-black/55 via-black/25 to-transparent`.
- Konten kiri (maks. 560 px): H1 putih UPPERCASE, baris aksen `text-brand-300` (**gunakan `brand-300`/`brand-400` di atas foto gelap** agar kontras lulus), paragraf pendek putih/90, dua tombol (Tentang Kami `btn-light`, Hubungi Kami `btn-primary`).
- Gambar hero: `fetchpriority="high"`, tanpa `loading="lazy"`, `width`/`height` eksplisit, ada versi `srcset`.

### 6.4 Hero Search Bar

- Posisi: tumpang tindih bawah hero (`-mb-10` atau absolut `bottom-10`), lebar `max-w-3xl`, latar `bg-charcoal-600/95`, padding `p-5`.
- Isi: input kata kunci (`flex-1`), select kategori, tombol `CARI` (`btn-primary`). Mobile: tumpuk vertikal.
- Input memakai gaya `field` bertema gelap (`bg-charcoal-700 text-white placeholder:text-white/70`), label tersembunyi `sr-only`.
- Ikon di dalam input: pin → ikon **buku**, stetoskop → ikon **tag/kategori**.

### 6.5 Section Heading (judul bagian)

```html
<div class="mb-12 text-center md:mb-14">
  <h2 class="text-ink-900 text-[1.75rem] font-bold tracking-wide uppercase md:text-[2rem]">
    Layanan Kami
  </h2>
  <p class="text-body mx-auto mt-2 max-w-xl text-sm">Kalimat pendek yang menjelaskan bagian ini.</p>
  <div class="mt-4 flex items-center justify-center gap-3" aria-hidden="true">
    <span class="bg-line h-px w-16"></span>
    <svg class="text-brand-500 size-5">…ikon buku…</svg>
    <span class="bg-line h-px w-16"></span>
  </div>
</div>
```

Dibuat sebagai fungsi `sectionHeading({ title, subtitle })` di `components/section-heading.js`.

### 6.6 Tombol

| Varian  | Kelas                  | Pemakaian                                      |
| ------- | ---------------------- | ---------------------------------------------- |
| Primary | `btn-primary`          | CTA utama (Cari, Buat Reservasi, Hubungi Kami) |
| Light   | `btn-light`            | Di atas foto/gelap (Tentang Kami)              |
| Outline | `btn-outline`          | Aksi sekunder (Lihat Semua)                    |
| Ikon    | `size-11 rounded-full` | Bookmark, pager                                |

State: **hover** (naik satu langkah warna), **focus-visible** (outline 2 px `brand-700`, offset 2), **active** (`scale-[0.98]`), **disabled** (`opacity-50`, `cursor-not-allowed`), **loading** (spinner 16 px + teks "Memproses…", `aria-busy="true"`, tombol nonaktif).
Ukuran: tinggi min. 44 px (`min-h-11`).

### 6.7 Tab Vertikal (Koleksi)

- Wadah: `bg-surface`, lebar 240–280 px, item `flex items-center gap-3 px-5 py-4 text-[13px] font-semibold uppercase tracking-wide text-ink-700`.
- Aktif: `relative bg-brand-700 text-white tab-arrow` (segitiga ke kanan).
- Hover: `bg-brand-50`.
- ARIA: `role="tablist" aria-orientation="vertical"`, tiap item `role="tab" aria-selected aria-controls`, panel `role="tabpanel"`. Panah ↑/↓ memindah fokus; Home/End ke awal/akhir.
- Mobile: tab menjadi baris yang dapat di-scroll horizontal (`flex overflow-x-auto snap-x`), item aktif `border-b-4`, tanpa panah segitiga.

### 6.8 Kartu Layanan

```html
<a
  href="layanan.html#peminjaman"
  class="group shadow-card hover:shadow-card-hover block bg-white px-5 py-8 text-center transition duration-300 hover:-translate-y-1 focus-visible:-translate-y-1"
>
  <span
    class="border-brand-500 text-brand-700 group-hover:border-brand-700 group-hover:bg-brand-700 mx-auto mb-5 grid size-16 place-items-center rounded-2xl border-[1.5px] transition group-hover:text-white"
  >
    <svg class="size-7">…</svg>
  </span>
  <h3 class="text-ink-900 group-hover:text-brand-700 text-base font-semibold">Peminjaman Buku</h3>
  <p class="text-body mt-2 text-[13px] leading-6">Ringkasan layanan maksimal dua baris.</p>
</a>
```

- Default: putih, bayangan tipis (`shadow-sm`) atau tanpa; Hover/fokus/terpilih: ikon kotak solid teal, bayangan besar, naik 4 px.
- Ikon yang disarankan (8 layanan): peminjaman buku, perpanjangan online, ruang baca, ruang diskusi, e-book/koleksi digital, layanan referensi, fotokopi & pindai, bimbingan literasi.

### 6.9 Kartu Buku

- Rasio sampul 2:3 (`aspect-[2/3] object-cover`), latar `bg-surface` sebagai placeholder.
- Struktur: sampul → badge status (kiri atas) → tombol bookmark (kanan atas, `size-10 rounded-full bg-white/90`) → judul (2 baris, `line-clamp-2`, 600) → penulis (13 px, `text-subtle`) → kategori.
- Badge: **Tersedia** `bg-success-50 text-success-700`; **Dipinjam** `bg-warning-50 text-warning-700`.
- Hover: sampul `scale-[1.03]` di dalam `overflow-hidden`, bayangan naik.
- Bookmark: `aria-pressed`, `aria-label="Simpan {judul}"` ↔ `"Hapus {judul} dari simpanan"`.

### 6.10 Kartu Pustakawan

- Latar putih tipis, foto setengah badan (rasio ±3:4) pada latar abu muda, di bawahnya nama (600), "S.IP., M.Hum" (13 px), bidang.
- **Aktif/hover/fokus-dalam:** muncul panel `bg-brand-700 text-white` yang menutup bagian bawah, berisi nama, bidang, ikon jam + "Sen – Kam · 09.00 – 15.00". Gunakan `group-focus-within` agar bisa diakses keyboard/sentuh; di perangkat sentuh panel selalu terlihat pada kartu tengah.
- Pager: tombol `‹` & `›` (`bg-charcoal-900 text-white` dan `bg-brand-700 text-white`), tombol tengah "Semua Pustakawan" (`btn-primary`) menuju `pustakawan.html`. Tombol pager memiliki `aria-label`.

### 6.11 Kartu Berita

- Horizontal di ≥ `sm`: gambar kiri 40% (`aspect-[4/3] object-cover`), teks kanan `p-6`; mobile: vertikal.
- Isi: judul (600, 2 baris), meta (ikon user + penulis, ikon kalender + tanggal, 13 px), kutipan (3 baris), tautan "Baca Selengkapnya →" `text-brand-700 font-semibold`.
- Bayangan `shadow-card`, hover `shadow-card-hover`.

### 6.12 Kartu Reservasi (di atas foto)

- Latar bagian: foto pustakawan, kiri diblur/overlay putih 70%.
- Kartu: `bg-white p-8 shadow-card-hover`, lebar `max-w-[520px]`, judul "RESERVASI" + subjudul + divider ikon.
- Grid form 2 kolom (`grid sm:grid-cols-2 gap-4`); Nama & Telepon; Email & Tanggal; Pustakawan & Layanan; Catatan (penuh); tombol penuh lebar `btn-primary`.
- Sukses: kartu diganti state konfirmasi (ikon centang `text-success-700`, kode reservasi tebal, tombol sekunder).

### 6.13 Form

- Label selalu terlihat (`<label>` 13 px/500), bukan hanya placeholder. Pada kartu Reservasi boleh `sr-only` bila placeholder jelas, namun `<label>` tetap ada.
- Input: kelas `field` (latar `#EEE`, radius 4, tinggi 44 px). Fokus: border `brand-700` + latar putih. Error: border `danger-700`, pesan di bawah `text-[13px] text-danger-700` dengan ikon, terhubung via `aria-describedby`, field `aria-invalid="true"`.
- Select: `appearance-none` + ikon chevron; Tanggal: `<input type="date">` dengan `min`/`max`.
- Checkbox/radio: `accent-brand-700`, ukuran 20 px, label dapat diklik.
- Pesan sukses/gagal global: `role="status"` / `role="alert"`.

### 6.14 Paginasi

- Tombol 40×40 px, aktif `bg-brand-700 text-white`, lain `bg-white border border-line hover:border-brand-700`.
- `<nav aria-label="Paginasi">`, halaman aktif `aria-current="page"`, Sebelumnya/Berikutnya `aria-disabled` bila di batas.
- Mobile: tampilkan maksimal 5 nomor dengan elipsis.

### 6.15 Breadcrumb

`Beranda › Katalog › Judul` — 13 px, tautan `text-brand-700`, item terakhir `text-subtle` `aria-current="page"`, dibungkus `<nav aria-label="Breadcrumb"><ol>`. Letakkan di _page banner_.

### 6.16 Page Banner (halaman dalam)

Pengganti hero pada halaman selain beranda: tinggi `py-14 md:py-20`, latar `bg-charcoal-700` + gambar overlay 20% atau `bg-brand-50`, H1 + breadcrumb. Teks putih di atas `charcoal-700`.

### 6.17 Akordeon (FAQ, layanan)

`<button aria-expanded aria-controls>` + panel `hidden`; ikon plus/minus berputar; border bawah `line`; animasi tinggi opsional (`grid-rows-[0fr]→[1fr]`).

### 6.18 Toast

Pojok kanan bawah (mobile: bawah penuh), `bg-ink-900 text-white`, radius 4, ikon status, hilang otomatis 4 s, `role="status" aria-live="polite"`, tombol tutup.

### 6.19 Empty State & Skeleton

- Empty: ikon besar `text-brand-300`, judul 600, penjelasan satu kalimat, tombol aksi.
- Skeleton: blok `bg-line animate-pulse` mengikuti bentuk kartu (`aria-hidden`).

### 6.20 Footer

- Latar `bg-charcoal-700`, teks `text-white/80`, judul kolom `text-white font-semibold`.
- Kolom 1 **Tentang Kami**: paragraf singkat, alamat (ikon pin), email (ikon amplop).
- Kolom 2 **Navigasi**: 2 sub-kolom tautan dengan ikon `»` (`text-brand-300`); hover `text-white underline`.
- Kolom 3 **Galeri**: grid 3×2 foto persegi 80–90 px, `loading="lazy"`, `alt` deskriptif.
- Bar copyright: `bg-charcoal-900`, teks tengah 12–13 px `text-white/70`.
- Kontras tautan footer ≥ 4,5:1 terhadap `charcoal-700` (putih/80 ≈ 7:1).

### 6.21 Tombol Kembali ke Atas

Bulat 44 px, `bg-brand-700 text-white`, kanan bawah, muncul setelah scroll 400 px, fokus terlihat, `aria-label="Kembali ke atas"`.

## 7. Pola Halaman Dalam

| Halaman            | Struktur                                                                                                                                                    |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Katalog**        | Page banner → bar cari + urutkan → [sidebar filter 260px │ grid buku] → paginasi. Mobile: tombol "Filter" membuka off-canvas.                               |
| **Detail Buku**    | Breadcrumb → 2 kolom: sampul (5/12, sticky) │ info (7/12: judul, penulis, badge, status stok, tabel metadata, tombol aksi) → sinopsis → tag → Buku Terkait. |
| **Koleksi**        | Page banner → komponen `vtabs` penuh → 4 buku unggulan per kategori → CTA katalog.                                                                          |
| **Layanan**        | Page banner → kartu layanan detail (zig-zag gambar kiri/kanan atau grid 2 kolom) → tabel aturan peminjaman → CTA reservasi.                                 |
| **Reservasi**      | Page banner → 2 kolom: form (7/12) │ info jam, syarat, kontak (5/12).                                                                                       |
| **Pustakawan**     | Page banner → grid 3 kolom kartu pustakawan.                                                                                                                |
| **Berita**         | Page banner → filter kategori (pill) → grid 2–3 kolom → paginasi.                                                                                           |
| **Detail Berita**  | Banner dengan judul → artikel `max-w-3xl` (tipografi nyaman) → tombol bagikan → Berita Terkait.                                                             |
| **Tentang**        | Profil (teks + foto) → visi/misi (2 kartu) → statistik (4 angka besar, `text-brand-700`) → linimasa → fasilitas → jam operasional.                          |
| **Kontak**         | Info kontak (3 kartu ikon) → form │ peta → FAQ akordeon.                                                                                                    |
| **Daftar Anggota** | Page banner → kartu form terpusat `max-w-2xl` + manfaat keanggotaan.                                                                                        |
| **Simpanan**       | Page banner → grid kartu buku dengan tombol hapus → empty state.                                                                                            |
| **404**            | Ilustrasi/ikon besar, "404", pesan, kolom cari, 2 tombol.                                                                                                   |

## 8. Ikonografi

- Gaya garis (_outline_) 1,5–2 px, sudut membulat — serupa **Lucide**/**Heroicons Outline**.
- Disimpan sebagai string SVG di `src/js/utils/icons.js` (`icon('book-open', { class: 'size-5' })`), memakai `stroke="currentColor"` agar mengikuti warna teks.
- Ikon dekoratif `aria-hidden="true"`; ikon tunggal pada tombol wajib punya `aria-label`.
- Ukuran: 16 (inline), 20 (menu/aksi), 28 (kartu layanan), 48+ (empty state).

## 9. Gambar & Media

| Jenis          | Rasio                        | Catatan                                              |
| -------------- | ---------------------------- | ---------------------------------------------------- |
| Hero           | 16:9 / 3:2 (lebar ≥ 1600 px) | Subjek di kanan, area kiri lapang untuk teks         |
| Banner koleksi | 3:1 (±1100×360)              | Foto rak/pembaca                                     |
| Sampul buku    | 2:3 (400×600)                | Placeholder `bg-surface` + ikon buku bila gagal muat |
| Pustakawan     | 3:4                          | Latar bersih/terang                                  |
| Berita         | 4:3                          | Foto kegiatan                                        |
| Galeri footer  | 1:1                          | 6 foto kegiatan                                      |

- Format **WebP** (fallback JPG), kompres ≤ 150 KB (non-hero), ≤ 250 KB (hero).
- Wajib `width`, `height`, `alt`; `loading="lazy"` untuk selain hero; `decoding="async"`.
- **Jangan** memakai foto dari template referensi. Catat sumber/lisensi setiap foto di `assets/img/CREDITS.md`.
- Handler `onerror` global menukar gambar rusak ke placeholder.

## 10. Motion

| Interaksi           | Durasi     | Easing     | Efek                            |
| ------------------- | ---------- | ---------- | ------------------------------- |
| Hover tombol/tautan | 150–200 ms | `ease-out` | Warna                           |
| Hover kartu         | 300 ms     | `ease-out` | `-translate-y-1` + bayangan     |
| Drawer menu         | 250 ms     | `ease-out` | Geser dari kanan + fade overlay |
| Pergantian tab      | 200 ms     | `ease-out` | Fade panel                      |
| Reveal on scroll    | 500 ms     | `ease-out` | Fade + naik 16 px (sekali)      |
| Toast               | 200 ms     | `ease-out` | Fade + naik                     |

Aturan: hanya animasikan `transform`/`opacity`; nonaktifkan semua animasi non-esensial bila `prefers-reduced-motion: reduce`.

## 11. Aksesibilitas (ringkas)

- Kontras teks ≥ 4,5:1; teks besar & komponen UI ≥ 3:1 (lihat aturan teal pada 3.1).
- Fokus terlihat di semua elemen interaktif (outline 2 px `brand-700`, offset 2 px).
- Struktur landmark: `header` → `nav` → `main#main` → `footer`; skip link menuju `#main`.
- Urutan heading logis; satu `h1`.
- Form: label terhubung, error terumumkan, tidak mengandalkan warna saja.
- Komponen kustom (tab, akordeon, drawer, dropdown) mengikuti pola WAI-ARIA APG.
- Target sentuh ≥ 44×44 px (pengecualian: tombol topbar desktop ≥ 32 px).
- Tautan "Baca Selengkapnya" memiliki konteks (`aria-label="Baca selengkapnya: {judul}"` atau teks `sr-only`).
- Gambar informatif beralt; dekoratif `alt=""`.

## 12. Perilaku Responsif

| Elemen     | < 640                                             | 768–1023        | ≥ 1024                 |
| ---------- | ------------------------------------------------- | --------------- | ---------------------- |
| Topbar     | Hanya telepon                                     | Telepon + email | Penuh                  |
| Header     | Hamburger + drawer                                | Hamburger       | Menu penuh + slant     |
| Hero       | Teks tengah-kiri, search bar menumpuk, tinggi 420 | 520             | 620                    |
| Search bar | Vertikal                                          | Horizontal      | Horizontal             |
| Koleksi    | Tab scroll horizontal di atas panel               | Tab 1/3 + panel | Tab 1/3 + panel        |
| Layanan    | 1 kolom                                           | 2 kolom         | 4 kolom                |
| Reservasi  | Kartu penuh lebar, foto di bawah/di belakang      | Kartu 60%       | Kartu kiri, foto kanan |
| Pustakawan | 1 (swipe)                                         | 2               | 3                      |
| Berita     | Kartu vertikal                                    | Horizontal      | 2 kolom horizontal     |
| Footer     | 1 kolom                                           | 2 kolom         | 3 kolom                |

## 13. Gaya Bahasa & Microcopy

| Konteks          | Contoh                                                               |
| ---------------- | -------------------------------------------------------------------- |
| Sapaan hero      | "Jelajahi dunia lewat buku."                                         |
| Placeholder cari | "Cari judul, penulis, atau ISBN"                                     |
| Tombol utama     | "Cari", "Buat Reservasi", "Kirim Pesan", "Daftar Sekarang"           |
| Sukses           | "Reservasi berhasil! Simpan kode Anda: RSV-…"                        |
| Error umum       | "Mohon lengkapi kolom yang bertanda merah."                          |
| Kosong           | "Belum ada buku yang cocok. Coba kata kunci lain atau reset filter." |
| 404              | "Halaman yang Anda cari tidak ditemukan."                            |

Nada: hangat, jelas, tidak menggurui. Gunakan "Anda". Hindari singkatan yang tidak umum.

## 14. Do & Don't

| ✅ Do                                       | ❌ Don't                                            |
| ------------------------------------------- | --------------------------------------------------- |
| Gunakan token warna/ukuran dari dokumen ini | Hard-code hex atau nilai px acak (`text-[#0abcde]`) |
| `bg-brand-700` untuk tombol teks kecil      | Teks putih kecil di `bg-brand-500`                  |
| Gunakan ritme latar putih ↔ abu ↔ foto      | Dua bagian abu berurutan tanpa alasan               |
| Ikon SVG inline `currentColor`              | Font icon / library ikon besar                      |
| Gambar berukuran & beralt                   | Gambar tanpa `width/height/alt`                     |
| Interaksi dapat dipakai keyboard            | Hover-only untuk informasi penting                  |
| Kartu & form konsisten dari komponen        | Membuat gaya kartu baru per halaman                 |
| Salin tata letak, bukan aset template       | Memakai foto/teks template aslinya                  |

## 15. Checklist Desain per Halaman

- [ ] Page banner / hero sesuai pola, ada breadcrumb (halaman dalam)
- [ ] Hanya warna & ukuran dari token
- [ ] Judul bagian memakai komponen `section-heading`
- [ ] Ritme latar benar dan jarak `py-16 md:py-24`
- [ ] Responsif di 360, 768, 1024, 1440 tanpa scroll horizontal
- [ ] Semua gambar: alt, width/height, lazy (kecuali hero)
- [ ] Fokus keyboard terlihat; urutan tab logis
- [ ] Kontras lulus (cek axe/Lighthouse)
- [ ] State: hover, fokus, aktif, disabled, loading, error, kosong sudah ada
