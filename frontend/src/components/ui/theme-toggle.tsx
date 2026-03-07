import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      className="btn-ghost"
      style={{ padding: '0.3rem 0.5rem' }}
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      title="Toggle theme"
    >
      {resolvedTheme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
    </button>
  );
}
