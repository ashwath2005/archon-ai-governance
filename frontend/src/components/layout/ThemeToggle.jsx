import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-secondary btn-sm"
      title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
      style={{ borderRadius: '50%', width: '36px', height: '36px', padding: 0 }}
    >
      {theme === 'dark' ? <Sun size={18} style={{ color: 'var(--accent-primary)' }} /> : <Moon size={18} style={{ color: 'var(--accent-secondary)' }} />}
    </button>
  );
};
