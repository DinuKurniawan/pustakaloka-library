export const getParams = () => new URLSearchParams(window.location.search);

export const setParams = (values, { replace = true } = {}) => {
  const url = new URL(window.location.href);
  Object.entries(values).forEach(([key, value]) => {
    if (value === '' || value === null || value === undefined || value === false)
      url.searchParams.delete(key);
    else url.searchParams.set(key, value);
  });
  window.history[replace ? 'replaceState' : 'pushState']({}, '', url);
};
