import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, Clipboard, ShieldAlert, Sparkles } from 'lucide-react';

const PHISHING_EXAMPLES = [
  'https://paypa1-secure-login.com/verify',
  'http://192.168.1.1/admin',
  'https://google.com',
  'https://github.com',
];

export default function PhishingInput({ onCheck, loading }) {
  const [value, setValue] = useState('');
  const inputRef = useRef(null);

  const handleSubmit = () => {
    if (!value.trim() || loading) return;
    onCheck(value.trim());
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setValue(text.trim());
      inputRef.current?.focus();
    } catch {
      inputRef.current?.focus();
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass-card p-6 flex flex-col gap-5 max-w-2xl mx-auto w-full"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
          style={{ background: 'var(--warning-bg)', border: '1px solid var(--warning)' }}
        >
          🎣
        </div>
        <div>
          <h2 className="font-heading font-bold text-lg" style={{ color: 'var(--text-1)' }}>
            Phishing Link Detector
          </h2>
          <p className="text-xs" style={{ color: 'var(--text-2)' }}>
            Paste any URL to check for phishing, malware & scam patterns
          </p>
        </div>
      </div>

      {/* Input row */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Link2
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--text-3)' }}
          />
          <input
            ref={inputRef}
            id="phishingInput"
            type="url"
            className="w-full pl-9 pr-4 py-3 rounded-xl text-sm"
            style={{
              background: 'var(--bg-glass)',
              border: '1px solid var(--border-glass)',
              color: 'var(--text-1)',
              fontFamily: 'Inter, sans-serif',
              outline: 'none',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
            placeholder="https://suspicious-site.com/login"
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={handleKey}
            onFocus={e => {
              e.target.style.borderColor = 'var(--warning)';
              e.target.style.boxShadow = '0 0 0 3px rgba(234,179,8,0.2)';
            }}
            onBlur={e => {
              e.target.style.borderColor = 'var(--border-glass)';
              e.target.style.boxShadow = 'none';
            }}
            disabled={loading}
          />
        </div>

        {/* Paste button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePaste}
          className="px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5"
          style={{
            background: 'var(--bg-glass)',
            border: '1px solid var(--border-glass)',
            color: 'var(--text-2)',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
          title="Paste from clipboard"
        >
          <Clipboard size={13} />
          <span className="hidden sm:inline">Paste</span>
        </motion.button>
      </div>

      {/* Scan button */}
      <motion.button
        id="phishingCheckBtn"
        whileHover={!loading ? { scale: 1.02 } : {}}
        whileTap={!loading ? { scale: 0.98 } : {}}
        onClick={handleSubmit}
        disabled={loading || !value.trim()}
        className="verify-btn flex items-center justify-center gap-2"
        style={{
          background: loading || !value.trim()
            ? 'rgba(234,179,8,0.3)'
            : 'linear-gradient(135deg, #d97706, #eab308, #fbbf24)',
        }}
      >
        {loading ? (
          <>
            <span className="orbital-spinner" />
            Scanning URL…
          </>
        ) : (
          <>
            <ShieldAlert size={16} />
            Scan for Phishing
            <span className="ml-auto text-xs opacity-60 font-mono hidden sm:inline">Enter ↵</span>
          </>
        )}
      </motion.button>

      {/* Example links */}
      <div>
        <p className="text-xs mb-2 font-medium" style={{ color: 'var(--text-3)' }}>
          Try an example:
        </p>
        <div className="flex flex-wrap gap-2">
          {PHISHING_EXAMPLES.map(ex => (
            <motion.button
              key={ex}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="chip text-xs"
              onClick={() => { setValue(ex); inputRef.current?.focus(); }}
            >
              {ex.replace('https://', '').replace('http://', '').substring(0, 30)}
              {ex.length > 30 ? '…' : ''}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
