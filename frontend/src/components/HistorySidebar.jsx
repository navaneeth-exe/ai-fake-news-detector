import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Clock } from 'lucide-react';

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

export default function HistorySidebar({ open, history, onClose, onClear, onReplay }) {
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
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: '1px solid var(--border-glass)' }}
            >
              <div className="flex items-center gap-2">
                <Clock size={16} style={{ color: 'var(--accent)' }} />
                <span className="font-heading font-semibold" style={{ color: 'var(--text-1)' }}>
                  History
                </span>
                {history.length > 0 && (
                  <span
                    className="text-xs font-mono px-1.5 py-0.5 rounded-full"
                    style={{ background: 'var(--accent-sub)', color: 'var(--accent)' }}
                  >
                    {history.length}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {history.length > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClear}
                    className="p-1.5 rounded-lg"
                    style={{ color: 'var(--danger)', background: 'var(--danger-bg)', border: 'none', cursor: 'pointer' }}
                    title="Clear history"
                  >
                    <Trash2 size={14} />
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-1.5 rounded-lg"
                  style={{ color: 'var(--text-2)', background: 'var(--bg-glass)', border: 'none', cursor: 'pointer' }}
                >
                  <X size={14} />
                </motion.button>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 opacity-50">
                  <Clock size={32} style={{ color: 'var(--text-3)' }} />
                  <p className="text-sm" style={{ color: 'var(--text-3)' }}>No analyses yet</p>
                </div>
              ) : (
                history.map((entry, i) => (
                  <motion.button
                    key={entry.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    whileHover={{ scale: 1.01, x: -2 }}
                    onClick={() => { onReplay(entry); onClose(); }}
                    className="text-left p-3 rounded-xl w-full"
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
                        {entry.verdict ?? `${entry.score}/100`}
                      </span>
                      <span className="text-xs" style={{ color: 'var(--text-3)' }}>
                        {timeAgo(entry.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm truncate" style={{ color: 'var(--text-1)' }}>
                      {entry.input}
                    </p>
                    <span
                      className="text-xs mt-1 inline-block px-1.5 py-0.5 rounded"
                      style={{ background: 'var(--accent-sub)', color: 'var(--accent)' }}
                    >
                      {entry.type === 'url' ? '🌐 URL' : 
                       entry.type === 'phishing' ? '🎣 Phishing' : 
                       entry.type === 'image' ? '🖼️ Image' : 
                       entry.type === 'audio' ? '🎙️ Audio' : '📝 Text'}
                    </span>
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
