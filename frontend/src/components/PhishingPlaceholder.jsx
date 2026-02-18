import { motion } from 'framer-motion';
import { ShieldAlert, CheckCircle2, AlertTriangle, Link2 } from 'lucide-react';

const FEATURES = [
  { icon: <CheckCircle2 size={18} />, label: 'URL pattern & lookalike domain analysis' },
  { icon: <ShieldAlert size={18} />, label: 'Known phishing database cross-check' },
  { icon: <AlertTriangle size={18} />, label: 'SSL certificate & domain age verification' },
  { icon: <Link2 size={18} />, label: 'AI-powered page content risk scoring' },
];

export default function PhishingPlaceholder() {
  return (
    <motion.div
      key="phishing"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="max-w-2xl mx-auto"
    >
      <div className="glass-card p-8 flex flex-col items-center text-center gap-6">
        {/* Icon */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl"
          style={{ background: 'var(--warning-bg)', border: '1px solid var(--warning)' }}
        >
          🎣
        </motion.div>

        {/* Badge */}
        <span
          className="text-xs font-mono font-bold px-3 py-1 rounded-full uppercase tracking-widest"
          style={{ background: 'var(--warning-bg)', color: 'var(--warning)', border: '1px solid var(--warning)' }}
        >
          Coming Soon
        </span>

        {/* Title */}
        <div>
          <h2 className="font-heading font-bold text-2xl mb-2" style={{ color: 'var(--text-1)' }}>
            Phishing Link Detector
          </h2>
          <p className="text-sm leading-relaxed max-w-md" style={{ color: 'var(--text-2)' }}>
            Paste any suspicious URL and our AI will instantly analyze it for phishing attempts,
            malware, scam patterns, and lookalike domain tricks — before you click.
          </p>
        </div>

        {/* Planned features */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)' }}
            >
              <span style={{ color: 'var(--warning)' }}>{f.icon}</span>
              <span className="text-sm" style={{ color: 'var(--text-2)' }}>{f.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Fake input preview */}
        <div className="w-full opacity-50 pointer-events-none select-none">
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{ background: 'var(--bg-glass)', border: '1px dashed var(--border-glass)' }}
          >
            <Link2 size={16} style={{ color: 'var(--text-3)' }} />
            <span className="text-sm" style={{ color: 'var(--text-3)' }}>
              Paste a suspicious URL here…
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
