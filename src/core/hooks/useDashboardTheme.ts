import { useState, useEffect } from 'react';

const STORAGE_KEY = 'dashboard-theme';

export const useDashboardTheme = (): [boolean, () => void] => {
  const [theme, setTheme] = useState<boolean>(() => {
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
    return stored === 'light' ? false : stored === 'dark' ? true : true;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme) {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.setAttribute('data-theme', 'light');
    }
    window.localStorage.setItem(STORAGE_KEY, theme ? 'dark' : 'light');
  }, [theme]);

  const toggle = () => setTheme(prev => !prev);

  return [theme, toggle];
};
