import { motion } from 'framer-motion';
import { Share2, Globe } from 'lucide-react';
import toast from 'react-hot-toast';
import VerdictBadge from './VerdictBadge';
import ScoreRing from './ScoreRing';
import RedFlags from './RedFlags';
import KeyClaims from './KeyClaims';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const section = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

const biasColors = {
  neutral:       { bg: 'rgba(34,197,94,0.1)',   color: '#22c55e' },
  left:          { bg: 'rgba(59,130,246,0.1)',   color: '#3b82f6' },
  right:         { bg: 'rgba(239,68,68,0.1)',    color: '#ef4444' },
  commercial:    { bg: 'rgba(234,179,8,0.1)',    color: '#eab308' },
  sensationalist:{ bg: 'rgba(239,68,68,0.1)',    color: '#ef4444' },
};

export default function UrlResult({ data, onShare }) {
  const {
    url, domain, title, author, date,
    credibility_score, verdict, bias_detected,
    analysis = {}, red_flags = [], key_claims = [],
  } = data;

  const bias = biasColors[bias_detected] ?? biasColors.neutral;

  const handleShare = () => {
    const text = `TruthLens URL Analysis\n${url}\n\nVerdict: ${verdict} (${credibility_score}/100)\nBias: ${bias_detected}\n\nAnalyzed by TruthLens AI`;
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
      {/* Article meta */}
      <motion.div
        variants={section}
        className="p-4 rounded-xl"
        style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)' }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Globe size={13} style={{ color: 'var(--accent)' }} />
          <span className="text-xs font-mono" style={{ color: 'var(--accent)' }}>{domain}</span>
        </div>
        <h2 className="font-heading font-semibold text-base leading-snug mb-1" style={{ color: 'var(--text-1)' }}>
          {title}
        </h2>
        <p className="text-xs" style={{ color: 'var(--text-2)' }}>
          {author !== 'Unknown' && <span>{author} · </span>}
          {date !== 'Unknown' && <span>{date}</span>}
        </p>
      </motion.div>

      {/* Verdict + Score + Bias */}
      <motion.div variants={section} className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-3">
          <VerdictBadge verdict={verdict} type="url" />
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: 'var(--text-3)' }}>Bias:</span>
            <span
              className="text-xs px-2.5 py-0.5 rounded-full font-mono font-semibold capitalize"
              style={{ background: bias.bg, color: bias.color }}
            >
              {bias_detected}
            </span>
          </div>
        </div>
        <ScoreRing score={credibility_score} label="Credibility" />
      </motion.div>

      {/* Analysis breakdown */}
      {Object.keys(analysis).length > 0 && (
        <motion.div variants={section} className="flex flex-col gap-3">
          <h3 className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-3)' }}>
            Breakdown
          </h3>
          {Object.entries(analysis).map(([key, val]) => (
            <div key={key} className="p-3 rounded-xl" style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)' }}>
              <p className="text-xs font-semibold capitalize mb-1" style={{ color: 'var(--accent)' }}>{key}</p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-1)' }}>{val}</p>
            </div>
          ))}
        </motion.div>
      )}

      {/* Red Flags */}
      {red_flags.length > 0 && (
        <motion.div variants={section}>
          <RedFlags flags={red_flags} />
        </motion.div>
      )}

      {/* Key Claims */}
      {key_claims.length > 0 && (
        <motion.div variants={section}>
          <KeyClaims claims={key_claims} />
        </motion.div>
      )}

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
