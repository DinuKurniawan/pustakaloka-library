const PATHS = {
  'book-open':
    '<path d="M2.5 5.5A2.5 2.5 0 0 1 5 3h5.5v16H5a2.5 2.5 0 0 0-2.5 2.5V5.5Zm19 0A2.5 2.5 0 0 0 19 3h-5.5v16H19a2.5 2.5 0 0 1 2.5 2.5V5.5Z"/><path d="M5 19h14"/>',
  bookmark: '<path d="M6 3.5h12v17l-6-3.5-6 3.5v-17Z"/>',
  'bookmark-filled': '<path fill="currentColor" stroke="none" d="M6 3.5h12v17l-6-3.5-6 3.5v-17Z"/>',
  search: '<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  x: '<path d="m6 6 12 12M18 6 6 18"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  'arrow-left': '<path d="M19 12H5m6 6-6-6 6-6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  phone:
    '<path d="M5 4h3l2 5-2 1.5a13 13 0 0 0 5.5 5.5L15 14l5 2v3a2 2 0 0 1-2 2C10.3 21 3 13.7 3 6a2 2 0 0 1 2-2Z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  pin: '<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  users:
    '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  flask:
    '<path d="M9 3h6M10 3v6l-6.5 10.5A2 2 0 0 0 5.2 22h13.6a2 2 0 0 0 1.7-2.5L14 9V3"/><path d="M7 16h10"/>',
  monitor: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
  landmark: '<path d="m3 10 9-6 9 6M5 10v8M9 10v8M15 10v8M19 10v8M3 21h18M2 18h20"/>',
  star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z"/>',
  briefcase:
    '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2"/>',
  palette:
    '<path d="M12 3a9 9 0 0 0 0 18h1.2a2 2 0 0 0 1.2-3.7 2 2 0 0 1 1.2-3.7H18a3 3 0 0 0 3-3C21 6.8 17 3 12 3Z"/><circle cx="7.5" cy="10" r=".8"/><circle cx="10" cy="7" r=".8"/><circle cx="14" cy="7" r=".8"/>',
  refresh: '<path d="M20 11a8 8 0 0 0-14-5L3 8M3 4v4h4M4 13a8 8 0 0 0 14 5l3-2M21 20v-4h-4"/>',
  armchair:
    '<path d="M5 11V8a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v3M4 11h16a2 2 0 0 1 2 2v4H2v-4a2 2 0 0 1 2-2ZM5 17v4M19 17v4"/>',
  tablet: '<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/>',
  scan: '<path d="M4 7V5a1 1 0 0 1 1-1h2M17 4h2a1 1 0 0 1 1 1v2M20 17v2a1 1 0 0 1-1 1h-2M7 20H5a1 1 0 0 1-1-1v-2M7 12h10"/>',
  lightbulb: '<path d="M9 18h6M10 22h4M8 14a6 6 0 1 1 8 0c-.8.7-1 1.3-1 2H9c0-.7-.2-1.3-1-2Z"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  share:
    '<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.6-4.5M8.2 13.2l7.6 4.5"/>',
  'chevron-right': '<path d="m9 18 6-6-6-6"/>',
};

export function icon(name, { class: className = 'size-5', label = '' } = {}) {
  const path = PATHS[name] ?? PATHS.info;
  return `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="${label ? 'false' : 'true'}"${label ? ` aria-label="${label}" role="img"` : ''}>${path}</svg>`;
}
