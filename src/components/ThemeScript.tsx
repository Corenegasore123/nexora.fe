export function ThemeScript() {
  const script = `
    (function () {
      try {
        var stored = localStorage.getItem('quantscope-theme');
        var dark = stored === 'dark' || (stored !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        if (dark) document.documentElement.classList.add('dark');
      } catch (e) {}
    })();
  `;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
