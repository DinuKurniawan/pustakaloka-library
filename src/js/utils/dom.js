export const qs = (selector, root = document) => root.querySelector(selector);
export const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];
export const on = (element, event, handler, options) =>
  element?.addEventListener(event, handler, options);
