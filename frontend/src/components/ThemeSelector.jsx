import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../hooks/hooks';

const THEMES = [
  { id: 'cosmic',    label: 'Cosmic',    color: '#6366f1' },
  { id: 'eco',       label: 'Eco',       color: '#10b981' },
  { id: 'ember',     label: 'Ember',     color: '#f43f5e' },
  { id: 'corporate', label: 'Corporate', color: '#3b82f6' },
];

export default function ThemeSelector() {
  const { theme, changeTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-white/10 transition-colors"
        title="Change Theme"
      >
        <Palette size={20} style={{ color: 'var(--text-1)' }} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute right-0 top-full mt-2 w-48 p-2 rounded-xl z-50 glass-card flex flex-col gap-1 shadow-xl bg-[var(--bg-secondary)]"
            style={{ border: '1px solid var(--border-glass)' }}
          >
            <h3 className="text-xs font-bold uppercase tracking-wider px-3 py-2" style={{ color: 'var(--text-3)' }}>
              Select Theme
            </h3>
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  changeTheme(t.id);
                  setIsOpen(false);
                }}
                className="flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-left"
              >
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: t.color }} />
                  <span className="text-sm font-medium" style={{ color: 'var(--text-1)' }}>{t.label}</span>
                </div>
                {theme === t.id && <Check size={14} style={{ color: 'var(--accent)' }} />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
