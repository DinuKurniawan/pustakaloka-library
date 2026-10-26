const MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export const escapeHTML = (value = '') => String(value).replace(/[&<>"']/g, (char) => MAP[char]);
