import { useState, useEffect } from 'react';

const THEME_KEY = 'truthlens-theme';
const MAX_HISTORY = 20;
const HISTORY_KEY = 'truthlens-history';

// ── useTheme ──────────────────────────────────────────────
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem(THEME_KEY);
    return saved || 'cosmic'; // Default to cosmic (dark)
  });

  useEffect(() => {
    const root = document.documentElement;
    // Remove all previous theme classes
    root.classList.remove('theme-cosmic', 'theme-eco', 'theme-ember', 'theme-corporate', 'dark', 'light');
    
    // Add new theme class
    root.classList.add(`theme-${theme}`);
    
    // For backward compatibility or Tailwind dark mode if using 'class' strategy
    if (['cosmic', 'ember'].includes(theme)) {
        root.classList.add('dark');
    }

    localStorage.setItem(THEME_KEY, theme);
    
    // Update meta theme-color for mobile browsers
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
        const colors = {
            'cosmic': '#0a0a1a',
            'eco': '#064e3b',
            'ember': '#450a0a',
            'corporate': '#f8fafc'
        };
        meta.content = colors[theme] || '#0a0a1a';
    }
  }, [theme]);

  const changeTheme = (newTheme) => setTheme(newTheme);
  
  // Legacy toggle support (cycles through) - optional, but might break if components expect toggle()
  // let's keep toggle for now but maybe just switch between cosmic and corporate?
  const toggle = () => setTheme(t => t === 'cosmic' ? 'corporate' : 'cosmic');

  return { theme, changeTheme, toggle };
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
