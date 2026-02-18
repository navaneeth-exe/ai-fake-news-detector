import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Clock, Search, Filter } from 'lucide-react';
import { useState, useMemo } from 'react';

// ... (existing helper functions verdictColor, timeAgo) ...
function verdictColor(verdict) {
  if (!verdict) return 'var(--text-3)';
  const v = String(verdict).toUpperCase();
  if (['REAL', 'MOSTLY_CREDIBLE', 'SAFE', 'LIKELY_REAL', 'LIKELY_AUTHENTIC'].includes(v)) return '#22c55e';
  if (['FAKE', 'NOT_CREDIBLE', 'DANGEROUS', 'LIKELY_AI', 'LIKELY_FAKE'].includes(v)) return '#ef4444';
  return '#eab308'; // UNCERTAIN, QUESTIONABLE, SUSPICIOUS
}

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'text', label: 'News' },
  { id: 'url', label: 'Links' },
  { id: 'image', label: 'Images' },
  { id: 'audio', label: 'Audio' },
  { id: 'phishing', label: 'Phishing' },
];

export default function HistorySidebar({ open, history, onClose, onClear, onReplay }) {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredHistory = useMemo(() => {
    return history.filter(entry => {
      const matchesSearch = (entry.input || '').toLowerCase().includes(search.toLowerCase());
      const matchesFilter = activeFilter === 'all' || entry.type === activeFilter || (activeFilter === 'text' && !entry.type);
      return matchesSearch && matchesFilter;
    });
  }, [history, search, activeFilter]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
          />

          {/* Panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full z-50 flex flex-col"
            style={{
              width: 'min(380px, 100vw)',
              background: 'var(--bg-secondary)',
              borderLeft: '1px solid var(--border-glass)',
              backdropFilter: 'blur(20px)',
            }}
          >
            {/* Header */}
            <div className="flex flex-col gap-4 px-5 py-4" style={{ borderBottom: '1px solid var(--border-glass)' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock size={16} style={{ color: 'var(--accent)' }} />
                  <span className="font-heading font-semibold" style={{ color: 'var(--text-1)' }}>
                    History
                  </span>
                  <span
                    className="text-xs font-mono px-1.5 py-0.5 rounded-full"
                    style={{ background: 'var(--accent-sub)', color: 'var(--accent)' }}
                  >
                    {filteredHistory.length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                   {/* Clean Button */}
                   {history.length > 0 && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={onClear}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                      title="Clear All History"
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                    style={{ color: 'var(--text-2)' }}
                  >
                    <X size={16} />
                  </motion.button>
                </div>
              </div>

              {/* Search & Filter */}
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-3)' }} />
                  <input
                    type="text"
                    placeholder="Search history..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
                    style={{
                      background: 'var(--bg-glass)',
                      border: '1px solid var(--border-glass)',
                      color: 'var(--text-1)',
                    }}
                  />
                </div>
                
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {FILTERS.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setActiveFilter(f.id)}
                      className={`text-xs px-3 py-1 rounded-full whitespace-nowrap transition-all border ${
                        activeFilter === f.id
                          ? 'border-[var(--accent)] bg-[var(--accent)] text-white'
                          : 'border-[var(--border-glass)] bg-transparent text-[var(--text-2)] hover:bg-white/5'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
              {filteredHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 opacity-50">
                  <Search size={32} style={{ color: 'var(--text-3)' }} />
                  <p className="text-sm" style={{ color: 'var(--text-3)' }}>
                    {history.length === 0 ? 'No analyses yet' : 'No matches found'}
                  </p>
                </div>
              ) : (
                filteredHistory.map((entry, i) => (
                  <motion.button
                    key={entry.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: i * 0.03 }}
                    whileHover={{ scale: 1.01, x: -2 }}
                    onClick={() => { onReplay(entry); onClose(); }}
                    className="text-left p-3 rounded-xl w-full group"
                    style={{
                      background: 'var(--bg-glass)',
                      border: '1px solid var(--border-glass)',
                      cursor: 'pointer',
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className="text-xs font-mono font-bold"
                        style={{ color: verdictColor(entry.verdict) }}
                      >
                        {entry.verdict ? String(entry.verdict).replace('LIKELY_', '') : `${Math.round(entry.score)}%`}
                      </span>
                      <span className="text-xs" style={{ color: 'var(--text-3)' }}>
                        {timeAgo(entry.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm truncate mb-1.5 group-hover:text-[var(--accent)] transition-colors" style={{ color: 'var(--text-1)' }}>
                      {entry.input}
                    </p>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[10px] font-medium px-1.5 py-0.5 rounded opacity-80"
                        style={{ background: 'var(--bg-glass-h)', color: 'var(--text-3)' }}
                      >
                        {entry.type === 'url' ? 'Link' : 
                         entry.type === 'phishing' ? 'Phish' : 
                         entry.type === 'image' ? 'Img' : 
                         entry.type === 'audio' ? 'Audio' : 'Text'}
                      </span>
                    </div>
                  </motion.button>
                ))
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

