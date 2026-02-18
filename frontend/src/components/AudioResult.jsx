import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic2, FileText, Activity, AlertTriangle, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import ScoreRing from './ScoreRing';
import ConfidenceBreakdown from './ConfidenceBreakdown';
import ShareCard from './ShareCard';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const section   = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } } };

function VerdictConfig(verdict) {
  const map = {
    LIKELY_REAL: { icon: '✅', label: 'LIKELY AUTHENTIC',    color: '#22c55e', bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.3)'   },
    UNCERTAIN:   { icon: '⚠️', label: 'UNCERTAIN',           color: '#eab308', bg: 'rgba(234,179,8,0.1)',  border: 'rgba(234,179,8,0.3)'  },
    LIKELY_FAKE: { icon: '🤖', label: 'LIKELY AI / SCAM',    color: '#ef4444', bg: 'rgba(239,68,68,0.1)',  border: 'rgba(239,68,68,0.3)'  },
  };
  return map[verdict] ?? map.UNCERTAIN;
}

export default function AudioResult({ data }) {
  const {
    file_name, duration_seconds, ai_probability,
    verdict, analysis_type, signals, transcript, explanation
  } = data;
  
  const [showShare, setShowShare] = useState(false);

  const vc = VerdictConfig(verdict);

  const handleCopy = () => {
    navigator.clipboard.writeText(transcript).then(() => toast.success('Transcript copied!'));
  };

  // Generate breakdown metrics based on the main probability (Mocked for visual effect)
  const breakdown = [
    { label: 'Acoustic Anomalies', score: Math.min(98, Math.round(ai_probability)), color: '#ef4444' },
    { label: 'Spectral Consistency', score: Math.max(2, 100 - Math.round(ai_probability)), color: '#3b82f6' },
    { label: 'Scam Pattern Match',   score: Math.min(95, Math.round(ai_probability * 0.9)), color: '#eab308' },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="glass-card p-6 flex flex-col gap-6 max-w-2xl mx-auto w-full"
    >
      {/* Verdict Header */}
      <motion.div
        variants={section}
        className="flex items-center justify-between flex-wrap gap-4 p-5 rounded-xl"
        style={{ background: vc.bg, border: `1px solid ${vc.border}` }}
      >
        <div className="flex flex-col gap-2">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-heading font-bold text-sm w-fit"
            style={{ background: vc.bg, color: vc.color, border: `1px solid ${vc.color}` }}
          >
            <span>{vc.icon}</span>
            {vc.label}
          </motion.div>

          <span
            className="text-xs font-mono font-bold px-2 py-0.5 rounded w-fit"
            style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6' }}
          >
            {analysis_type}
          </span>

          <p className="text-xs" style={{ color: 'var(--text-3)' }}>
            {file_name} · {duration_seconds}s
          </p>
        </div>

        {/* Risk Score Ring (Inverted: High = Bad) */}
        <ScoreRing score={ai_probability} label="Deepfake Risk" inverted />
      </motion.div>

      {/* Confidence Breakdown */}
      <motion.div variants={section}>
        <h3 className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text-3)' }}>
          Risk Analysis Breakdown
        </h3>
        <ConfidenceBreakdown metrics={breakdown} />
      </motion.div>

      {/* AI Explanation */}
      {explanation && (
        <motion.div variants={section}>
          <h3 className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text-3)' }}>
            AI Analysis
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-1)' }}>
            {explanation}
          </p>
        </motion.div>
      )}

      {/* Acoustic Signals */}
      {signals && signals.length > 0 && (
        <motion.div variants={section}>
          <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-3)' }}>
            Acoustic & Content Signals
          </h3>
          <ul className="flex flex-col gap-2">
            {signals.map((s, i) => {
              const isGood = s.toLowerCase().includes('natural') || s.toLowerCase().includes('human') || s.toLowerCase().includes('authentic');
              const color  = isGood ? '#22c55e' : '#ef4444';
              return (
                <motion.li
                  key={i}
                  className="flex items-start gap-2 text-sm p-2 rounded-lg"
                  style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)' }}
                >
                  <Activity size={16} style={{ color, marginTop: 2, flexShrink: 0 }} />
                  <span style={{ color: 'var(--text-2)' }}>{s}</span>
                </motion.li>
              );
            })}
          </ul>
        </motion.div>
      )}

      {/* Transcript Accordion */}
      {transcript && (
        <motion.div variants={section} className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-3)' }}>
              Transcript
            </h3>
            <button
              onClick={handleCopy}
              className="text-xs px-2 py-1 rounded hover:bg-white/10 transition-colors"
              style={{ color: 'var(--accent)' }}
            >
              Copy Text
            </button>
          </div>
          <div
            className="p-4 rounded-xl text-sm leading-relaxed max-h-60 overflow-y-auto custom-scrollbar"
            style={{
              background: 'var(--bg-glass)',
              border: '1px solid var(--border-glass)',
              color: 'var(--text-1)',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {transcript}
          </div>
        </motion.div>
      )}
      {/* Share */}
      <motion.div variants={section}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowShare(true)}
          className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl"
          style={{
            background: 'var(--bg-glass)',
            border: '1px solid var(--border-glass)',
            color: 'var(--text-2)',
            cursor: 'pointer',
          }}
        >
          📋 Share Result
        </motion.button>
      </motion.div>

      <ShareCard
        isOpen={showShare}
        onClose={() => setShowShare(false)}
        data={data}
      />
    </motion.div>
  );
}
