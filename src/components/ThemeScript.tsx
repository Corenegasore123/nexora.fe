export function ThemeScript() {
  const script = `
    (function () {
      try {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('quantscope-theme', 'light');
      } catch (e) {}
    })();
  `;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
