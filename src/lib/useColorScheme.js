import { useEffect, useState } from 'react';

/**
 * The effective colour scheme, `'dark' | 'light'`.
 *
 * Follows the device (`prefers-color-scheme`) but lets an explicit
 * `data-theme` on <html> win, matching the CSS override scopes in index.css.
 * Re-renders when the OS setting or the attribute changes, so anything that
 * can't read CSS variables can react.
 */
function resolveScheme() {
  if (typeof document !== 'undefined') {
    const forced = document.documentElement.dataset.theme;
    if (forced === 'light' || forced === 'dark') return forced;
  }
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'dark';
}

export function useColorScheme() {
  const [scheme, setScheme] = useState(resolveScheme);

  useEffect(() => {
    const update = () => setScheme(resolveScheme());

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', update);

    // Watch for an in-app theme toggle flipping data-theme on <html>.
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => {
      mq.removeEventListener('change', update);
      observer.disconnect();
    };
  }, []);

  return scheme;
}
