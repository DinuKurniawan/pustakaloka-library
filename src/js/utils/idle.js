/**
 * Menunda pekerjaan non-kritis sampai browser selesai menggambar konten awal.
 * @returns {Promise<void>}
 */
export function waitForIdle() {
  return new Promise((resolve) => {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => resolve(), { timeout: 1000 });
      return;
    }
    window.setTimeout(resolve, 0);
  });
}
