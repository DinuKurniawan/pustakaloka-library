import { postCard } from '../../components/post-card.js';
import { pagination } from '../../components/pagination.js';
import { getPosts } from '../../services/content-service.js';
import { escapeHTML as e } from '../../utils/escape.js';
import { getParams } from '../../utils/url.js';
import { emptyState, renderPageShell } from './shell.js';

export async function render() {
  const params = getParams();
  const category = params.get('kategori') ?? '';
  const result = await getPosts({ category, page: Math.max(1, Number(params.get('hal')) || 1) });
  renderPageShell(
    'Berita & artikel',
    'Catatan dari kegiatan, koleksi, dan percakapan yang hidup di Pustakaloka.',
    `<div class="mb-8 flex flex-wrap gap-2"><a class="min-h-11 rounded-full px-4 py-2 text-sm ${!category ? 'bg-brand-700 text-white' : 'bg-brand-50 text-brand-900'}" href="./src/pages/berita.html">Semua</a>${['kegiatan', 'literasi', 'pengumuman'].map((value) => `<a class="min-h-11 rounded-full px-4 py-2 text-sm ${category === value ? 'bg-brand-700 text-white' : 'bg-brand-50 text-brand-900'}" href="./src/pages/berita.html?kategori=${e(value)}">${value[0].toUpperCase() + value.slice(1)}</a>`).join('')}</div><div class="grid gap-8 lg:grid-cols-2">${result.items.length ? result.items.map(postCard).join('') : emptyState('Belum ada berita', 'Coba kategori lainnya.')}</div>${pagination({ page: result.page, totalPages: result.totalPages, baseParams: category ? { kategori: category } : {} })}`,
  );
}
