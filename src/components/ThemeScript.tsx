export function ThemeScript() {
  const script = `
    (function () {
      try {
        var stored = localStorage.getItem('nexora-theme') || 'system';
        var dark = stored === 'dark' || (stored === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        document.documentElement.classList.toggle('dark', dark);
      } catch (e) {}
    })();
  `;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
