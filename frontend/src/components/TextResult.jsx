import { motion } from 'framer-motion';
import { Share2 } from 'lucide-react';
import toast from 'react-hot-toast';
import VerdictBadge from './VerdictBadge';
import ScoreRing from './ScoreRing';
import SourcesList from './SourcesList';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const section = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

export default function TextResult({ data, onShare }) {
  const { verdict, score, explanation, verified_context, sources = [], keywords = [] } = data;

  const handleShare = () => {
    const text = `TruthLens Verdict: ${verdict} (${score}/100)\n\n${explanation}\n\nVerified by TruthLens AI`;
    navigator.clipboard.writeText(text).then(() => toast.success('Copied to clipboard!'));
    onShare?.();
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="glass-card p-6 flex flex-col gap-5"
    >
      {/* Verdict + Score */}
      <motion.div variants={section} className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-2">
          <VerdictBadge verdict={verdict} type="text" />
          {keywords.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {keywords.map(k => (
                <span
                  key={k}
                  className="text-xs px-2 py-0.5 rounded-full font-mono"
                  style={{ background: 'var(--accent-sub)', color: 'var(--accent)' }}
                >
                  {k}
                </span>
              ))}
            </div>
          )}
        </div>
        <ScoreRing score={score} label="Truth Score" />
      </motion.div>

      {/* Explanation */}
      <motion.div variants={section}>
        <h3 className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text-3)' }}>
          Analysis
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-1)' }}>{explanation}</p>
      </motion.div>

      {/* Context */}
      {verified_context && (
        <motion.div
          variants={section}
          className="p-4 rounded-xl"
          style={{ background: 'var(--accent-sub)', border: '1px solid var(--border-glass)' }}
        >
          <h3 className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--accent)' }}>
            Context
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-1)' }}>{verified_context}</p>
        </motion.div>
      )}

      {/* Sources */}
      <motion.div variants={section}>
        <SourcesList sources={sources} />
      </motion.div>

      {/* Share */}
      <motion.div variants={section}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleShare}
          className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl"
          style={{
            background: 'var(--bg-glass)',
            border: '1px solid var(--border-glass)',
            color: 'var(--text-2)',
            cursor: 'pointer',
          }}
        >
          <Share2 size={14} />
          Share Result
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
