export type ThemeMode = 'dark' | 'light' | 'system';

const THEME_STORAGE_KEY = 'denlight_theme_mode';

export const getStoredTheme = (): ThemeMode => {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      return saved;
    }
  } catch (e) {
    console.warn('Could not read theme from localStorage', e);
  }
  return 'dark'; // Default sleek dark mode for superadmin
};

export const applyTheme = (theme: ThemeMode): void => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const isDark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  if (isDark) {
    root.classList.add('dark');
    root.classList.remove('light');
    root.style.colorScheme = 'dark';
  } else {
    root.classList.remove('dark');
    root.classList.add('light');
    root.style.colorScheme = 'light';
  }

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (e) {
    console.warn('Could not save theme to localStorage', e);
  }

  window.dispatchEvent(new CustomEvent('denlight-theme-changed', { detail: { theme, isDark } }));
};

export const toggleTheme = (): ThemeMode => {
  const current = getStoredTheme();
  const next: ThemeMode = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  return next;
};

// Initialize theme immediately on script load
if (typeof window !== 'undefined') {
  applyTheme(getStoredTheme());

  // Listen to system changes if in system mode
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (getStoredTheme() === 'system') {
      applyTheme('system');
    }
  });
}
