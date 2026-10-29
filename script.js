(() => {
  const root = document.documentElement;
  const button = document.querySelector('.theme-toggle');
  const savedTheme = (() => {
    try { return localStorage.getItem('portfolio-theme'); }
    catch { return null; } // The page also works when browser storage is disabled.
  })();
  const initialDark = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  function setTheme(dark) {
    root.dataset.theme = dark ? 'dark' : 'light';
    button.setAttribute('aria-label', dark ? '切换到浅色模式' : '切换到深色模式');
    button.setAttribute('aria-pressed', String(dark));
    document.querySelector('meta[name="theme-color"]').content = dark ? '#152922' : '#f6f4ee';
  }
  setTheme(initialDark);
  button.hidden = false;
  button.addEventListener('click', () => {
    const dark = root.dataset.theme !== 'dark';
    setTheme(dark);
    try { localStorage.setItem('portfolio-theme', dark ? 'dark' : 'light'); }
    catch { /* Theme changes remain usable for this visit without persistence. */ }
  });
  document.querySelector('#year').textContent = new Date().getFullYear();
})();
