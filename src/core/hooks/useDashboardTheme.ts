import { useState, useEffect } from 'react';

const STORAGE_KEY = 'dashboard-theme';

export const useDashboardTheme = (): [boolean, () => void] => {
  const [theme, setTheme] = useState<boolean>(() => {
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
    return stored === 'light' ? false : stored === 'dark' ? true : true;
  });

  useEffect(() => {
    if (typeof document === 'undefined') return;

    // Find scoped dashboard containers. If present, apply data-theme to them only.
    const scopedRoots = Array.from(document.querySelectorAll<HTMLElement>('[data-dashboard-theme]'));
    if (scopedRoots.length > 0) {
      scopedRoots.forEach(root => {
        if (theme) {
          root.setAttribute('data-theme', 'dark');
        } else {
          root.setAttribute('data-theme', 'light');
        }
      });
    }

    // Remove any global data-theme attributes so public pages are not affected
    try {
      document.documentElement.removeAttribute('data-theme');
      document.body?.removeAttribute('data-theme');
    } catch (e) {
      // ignore
    }

    // Persist choice for next visit
    window.localStorage.setItem(STORAGE_KEY, theme ? 'dark' : 'light');
  }, [theme]);

  const toggle = () => setTheme(prev => !prev);

  return [theme, toggle];
};
