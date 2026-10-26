import { getPostById } from '../../services/content-service.js';
import { getSite } from '../../services/content-service.js';
import { formatDate } from '../../utils/format.js';
import { icon } from '../../utils/icons.js';
import { escapeHTML as e } from '../../utils/escape.js';
import { getParams } from '../../utils/url.js';
import { showToast } from '../../components/toast.js';
import { emptyState, renderPageShell } from './shell.js';

export async function render() {
  const post = await getPostById(getParams().get('id'));
  if (!post) {
    renderPageShell(
      'Berita tidak ditemukan',
      'Kembali ke daftar berita untuk membaca catatan lainnya.',
      emptyState(
        'Berita tidak ditemukan',
        'Artikel yang Anda cari tidak tersedia.',
        './src/pages/berita.html',
        'Lihat berita',
      ),
    );
    return;
  }
  const site = await getSite();
  document.title = `${post.title} — ${site.name}`;
  renderPageShell(
    post.title,
    '',
    `<article class="mx-auto max-w-3xl"><img src="${e(post.image)}" alt="" width="960" height="640" loading="lazy" decoding="async" class="w-full bg-surface object-cover" /><div class="mt-6 flex flex-wrap gap-3 text-sm text-subtle"><span>${e(post.author)}</span><span>${formatDate(post.date)}</span><span class="text-brand-700">${e(post.category)}</span></div><div class="prose-library mt-8 text-body">${post.body.map((block) => (block.type === 'h2' ? `<h2>${e(block.text)}</h2>` : block.type === 'quote' ? `<blockquote class="my-8 border-l-4 border-brand-500 bg-brand-50 p-5 text-lg italic text-brand-900">${e(block.text)}</blockquote>` : `<p>${e(block.text)}</p>`)).join('')}</div><div class="mt-8 flex flex-wrap gap-2">${post.tags.map((tag) => `<span class="rounded-full bg-brand-50 px-3 py-1 text-sm text-brand-900">#${e(tag)}</span>`).join('')}</div><button class="btn-outline mt-8" type="button" data-action="copy-link">${icon('share', { class: 'size-5' })}Salin tautan</button></article>`,
  );
  document.querySelector('[data-action="copy-link"]')?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast('Tautan artikel disalin.');
    } catch {
      showToast('Tautan siap disalin dari bilah alamat.', 'info');
    }
  });
}
