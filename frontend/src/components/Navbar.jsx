import { motion } from 'framer-motion';
import { Clock, Zap } from 'lucide-react';
import ThemeSelector from './ThemeSelector';

export default function Navbar({ theme, onToggleTheme, onToggleHistory, historyCount }) {
  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="glass-card grid items-center px-5 py-3 w-full max-w-5xl"
      style={{ borderRadius: 14, gridTemplateColumns: '1fr auto 1fr' }}
    >
      {/* Left — Actions (right-aligned) */}
      <div className="flex items-center gap-2 justify-start">
        <ThemeSelector />

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onToggleHistory}
          className="glass-card p-2 rounded-xl cursor-pointer border-0 relative"
          aria-label="Toggle history"
          title="Analysis history"
        >
          <Clock size={16} style={{ color: 'var(--text-2)' }} />
          {historyCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 text-[10px] font-mono font-bold text-white rounded-full w-4 h-4 flex items-center justify-center"
              style={{ background: 'var(--accent)' }}
            >
              {historyCount > 9 ? '9+' : historyCount}
            </motion.span>
          )}
        </motion.button>
      </div>

      {/* Center — Brand (always perfectly centered) */}
      <div className="flex items-center gap-2.5 justify-center">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
          className="text-2xl"
        >
          🔍
        </motion.div>
        <div>
          <span
            className="font-heading font-bold text-lg tracking-tight"
            style={{ color: 'var(--text-1)' }}
          >
            TruthLens
          </span>
          <span
            className="ml-2 text-xs font-mono px-1.5 py-0.5 rounded"
            style={{ background: 'var(--accent-sub)', color: 'var(--accent)' }}
          >
            AI
          </span>
        </div>
      </div>

      {/* Right — Status pill (left-aligned) */}
      <div className="flex items-center justify-end">
        <div
          className="hidden sm:flex items-center gap-1.5 text-xs px-3 py-1 rounded-full"
          style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e' }}
        >
          <Zap size={11} />
          <span className="font-mono">Groq · Llama 3.3</span>
        </div>
      </div>
    </motion.nav>
    </div>
  );
}
