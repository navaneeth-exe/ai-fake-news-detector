import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Link2, Sparkles } from 'lucide-react';

const TEXT_EXAMPLES = [
  'The Earth is flat',
  'COVID-19 vaccines contain microchips',
  'Water boils at 100°C at sea level',
  'The Great Wall of China is visible from space',
  'Humans only use 10% of their brain',
];

const URL_EXAMPLES = [
  'https://www.bbc.com/news',
  'https://www.reuters.com',
];

const MAX_CHARS = 1000;

function isUrl(text) {
  return /^(https?:\/\/|www\.)/i.test(text.trim());
}

export default function InputPanel({ onVerify, loading }) {
  const [value, setValue] = useState('');
  const textareaRef = useRef(null);

  const urlMode = isUrl(value);
  const charCount = value.length;
  const tooShort = value.trim().length > 0 && value.trim().length < 5;

  const handleSubmit = () => {
    if (!value.trim() || loading) return;
    onVerify(value.trim());
  };

  const handleKey = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') handleSubmit();
  };

  const fillExample = (ex) => {
    setValue(ex);
    textareaRef.current?.focus();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="glass-card p-6 flex flex-col gap-5"
    >
      {/* Header */}
      <div>
        <h1
          className="font-heading font-bold text-2xl mb-1"
          style={{ color: 'var(--text-1)' }}
        >
          Fact-Check Anything
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-2)' }}>
          Enter a claim or paste a news article URL to verify with AI.
        </p>
      </div>

      {/* Mode indicator */}
      <AnimatePresence mode="wait">
        {value.trim() && (
          <motion.div
            key={urlMode ? 'url' : 'text'}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-full w-fit"
            style={{
              background: urlMode ? 'var(--accent-sub)' : 'rgba(34,197,94,0.1)',
              color: urlMode ? 'var(--accent)' : '#22c55e',
            }}
          >
            {urlMode ? <Link2 size={11} /> : <Search size={11} />}
            {urlMode ? 'URL Analysis Mode' : 'Text Claim Mode'}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Textarea */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          id="claimInput"
          className="input-field"
          placeholder="e.g. 'The Earth is flat' or paste a news URL..."
          value={value}
          onChange={e => setValue(e.target.value.slice(0, MAX_CHARS))}
          onKeyDown={handleKey}
          disabled={loading}
          rows={5}
        />
        {/* Char counter */}
        <span
          className="absolute bottom-3 right-3 text-xs font-mono"
          style={{ color: charCount > MAX_CHARS * 0.9 ? 'var(--warning)' : 'var(--text-3)' }}
        >
          {charCount}/{MAX_CHARS}
        </span>
      </div>

      {/* Verify button */}
      <motion.button
        id="verifyBtn"
        whileHover={!loading ? { scale: 1.02 } : {}}
        whileTap={!loading ? { scale: 0.98 } : {}}
        className="verify-btn flex items-center justify-center gap-2"
        onClick={handleSubmit}
        disabled={loading || !value.trim() || tooShort}
      >
        {loading ? (
          <>
            <span className="orbital-spinner" />
            {urlMode ? 'Fetching & Analyzing…' : 'Analyzing…'}
          </>
        ) : (
          <>
            <Sparkles size={16} />
            {urlMode ? '🌐 Analyze URL' : '🔍 Verify Claim'}
            <span
              className="ml-auto text-xs opacity-60 font-mono hidden sm:inline"
            >
              Ctrl+↵
            </span>
          </>
        )}
      </motion.button>

      {/* Example chips */}
      <div>
        <p className="text-xs mb-2 font-medium" style={{ color: 'var(--text-3)' }}>
          Try an example:
        </p>
        <div className="flex flex-wrap gap-2">
          {TEXT_EXAMPLES.map(ex => (
            <motion.button
              key={ex}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="chip"
              onClick={() => fillExample(ex)}
            >
              {ex}
            </motion.button>
          ))}
          {URL_EXAMPLES.map(ex => (
            <motion.button
              key={ex}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="chip chip-url"
              onClick={() => fillExample(ex)}
            >
              <Link2 size={10} className="inline mr-1" />
              {ex.replace('https://', '')}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
