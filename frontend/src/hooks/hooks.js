import { useState, useEffect } from 'react';

const THEME_KEY = 'truthlens-theme';
const MAX_HISTORY = 20;
const HISTORY_KEY = 'truthlens-history';

// ── useTheme ──────────────────────────────────────────────
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(THEME_KEY, theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === 'dark' ? '#0a0a1a' : '#f0f2f5';
  }, [theme]);

  const toggle = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'));
  return { theme, toggle };
}

// ── useHistory ────────────────────────────────────────────
export function useHistory() {
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); }
    catch { return []; }
  });

  const save = (input, result, type) => {
    setHistory(prev => {
      let verdict, score;
      if (type === 'phishing') {
        verdict = result.verdict;
        score   = result.risk_score;
      } else if (type === 'image') {
        verdict = result.verdict;           // LIKELY_REAL / UNCERTAIN / LIKELY_AI
        score   = result.ai_probability;    // 0-100
      } else if (type === 'audio') {
        verdict = result.verdict;           
        score   = result.ai_probability;    
      } else if (type === 'url') {
        verdict = result.verdict;
        score   = result.credibility_score;
      } else {
        verdict = result.verdict;
        score   = result.score;
      }

      const entry = {
        id: Date.now(),
        input: input.substring(0, 120),
        type,
        verdict,
        score,
        timestamp: new Date().toISOString(),
        result,
      };
      const next = [entry, ...prev].slice(0, MAX_HISTORY);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      return next;
    });
  };

  const clear = () => {
    localStorage.removeItem(HISTORY_KEY);
    setHistory([]);
  };

  return { history, save, clear };
}
