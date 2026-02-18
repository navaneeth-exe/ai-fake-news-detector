import { motion } from 'framer-motion';
import { Camera, Code2, MapPin, Calendar, AlertTriangle, CheckCircle2, HelpCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import ScoreRing from './ScoreRing';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const section   = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } } };

function VerdictConfig(verdict) {
  const map = {
    LIKELY_REAL: { icon: '✅', label: 'LIKELY REAL',         color: '#22c55e', bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.3)'   },
    UNCERTAIN:   { icon: '⚠️', label: 'UNCERTAIN',           color: '#eab308', bg: 'rgba(234,179,8,0.1)',  border: 'rgba(234,179,8,0.3)'  },
    LIKELY_AI:   { icon: '🤖', label: 'LIKELY AI / FAKE',    color: '#ef4444', bg: 'rgba(239,68,68,0.1)',  border: 'rgba(239,68,68,0.3)'  },
  };
  return map[verdict] ?? map.UNCERTAIN;
}

function ExifRow({ icon, label, value, highlight }) {
  return (
    <div className="flex items-center justify-between gap-2 py-1.5" style={{ borderBottom: '1px solid var(--border-glass)' }}>
      <div className="flex items-center gap-2">
        <span style={{ color: 'var(--text-3)' }}>{icon}</span>
        <span className="text-xs" style={{ color: 'var(--text-2)' }}>{label}</span>
      </div>
      <span
        className="text-xs font-mono font-medium"
        style={{ color: highlight ? '#ef4444' : value ? 'var(--text-1)' : 'var(--text-3)' }}
      >
        {value || 'Not found'}
      </span>
    </div>
  );
}

export default function ImageResult({ data }) {
  const {
    source, dimensions, file_size_kb, ai_probability,
    verdict, manipulation_type, signals, exif, ai_analysis,
  } = data;

  const vc = VerdictConfig(verdict);

  const handleShare = () => {
    const text = `TruthLens Image Analysis\n\nVerdict: ${vc.label} (${ai_probability}% AI probability)\nType: ${manipulation_type}\n\n${ai_analysis?.explanation || ''}\n\nAnalysed by TruthLens AI`;
    navigator.clipboard.writeText(text).then(() => toast.success('Copied to clipboard!'));
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="glass-card p-6 flex flex-col gap-5 max-w-2xl mx-auto w-full"
    >
      {/* Verdict header */}
      <motion.div
        variants={section}
        className="flex items-center justify-between flex-wrap gap-4 p-4 rounded-xl"
        style={{ background: vc.bg, border: `1px solid ${vc.border}` }}
      >
        <div className="flex flex-col gap-2">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-heading font-bold text-sm w-fit"
            style={{ background: vc.bg, color: vc.color, border: `1px solid ${vc.color}` }}
          >
            <span>{vc.icon}</span>
            {vc.label}
          </motion.div>

          {/* Manipulation type */}
          <span
            className="text-xs font-mono font-bold px-2 py-0.5 rounded w-fit"
            style={{ background: 'rgba(168,85,247,0.15)', color: '#a855f7' }}
          >
            {manipulation_type}
          </span>

          {/* Image info */}
          <p className="text-xs" style={{ color: 'var(--text-3)' }}>
            {dimensions.width}×{dimensions.height}px · {file_size_kb} KB
          </p>
        </div>

        {/* AI probability ring — inverted: high % = more AI = bad */}
        <ScoreRing score={ai_probability} label="AI Probability" inverted />
      </motion.div>

      {/* AI Explanation */}
      {ai_analysis?.explanation && (
        <motion.div variants={section}>
          <h3 className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text-3)' }}>
            AI Analysis
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-1)' }}>
            {ai_analysis.explanation}
          </p>
        </motion.div>
      )}

      {/* Recommendation */}
      {ai_analysis?.recommendation && (
        <motion.div
          variants={section}
          className="flex items-start gap-3 p-3 rounded-xl"
          style={{ background: 'var(--accent-sub)', border: '1px solid var(--border-glass)' }}
        >
          <span className="text-base shrink-0">💡</span>
          <p className="text-sm" style={{ color: 'var(--text-1)' }}>{ai_analysis.recommendation}</p>
        </motion.div>
      )}

      {/* Signals */}
      {signals.length > 0 && (
        <motion.div variants={section}>
          <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-3)' }}>
            Detection Signals ({signals.length})
          </h3>
          <ul className="flex flex-col gap-1.5">
            {signals.map((s, i) => {
              const isGood = s.toLowerCase().includes('real') || s.toLowerCase().includes('gps') || s.toLowerCase().includes('camera');
              const color  = isGood ? '#22c55e' : '#ef4444';
              return (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-2 text-xs"
                  style={{ color: 'var(--text-2)' }}
                >
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} />
                  {s}
                </motion.li>
              );
            })}
          </ul>
        </motion.div>
      )}

      {/* EXIF Metadata */}
      <motion.div variants={section}>
        <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-3)' }}>
          EXIF Metadata
        </h3>
        <div
          className="rounded-xl px-4 py-2"
          style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)' }}
        >
          <ExifRow
            icon={<Camera size={13} />}
            label="Camera"
            value={exif.camera_make ? `${exif.camera_make} ${exif.camera_model || ''}`.trim() : null}
          />
          <ExifRow
            icon={<Code2 size={13} />}
            label="Software"
            value={exif.software}
            highlight={!!exif.ai_software_detected}
          />
          <ExifRow
            icon={<Calendar size={13} />}
            label="Date Taken"
            value={exif.date_taken}
          />
          <ExifRow
            icon={<MapPin size={13} />}
            label="GPS Data"
            value={exif.gps ? 'Present ✓' : null}
          />
          <div className="flex items-center justify-between gap-2 py-1.5">
            <div className="flex items-center gap-2">
              {exif.has_exif
                ? <CheckCircle2 size={13} style={{ color: '#22c55e' }} />
                : <AlertTriangle size={13} style={{ color: '#ef4444' }} />
              }
              <span className="text-xs" style={{ color: 'var(--text-2)' }}>EXIF Present</span>
            </div>
            <span
              className="text-xs font-mono font-bold"
              style={{ color: exif.has_exif ? '#22c55e' : '#ef4444' }}
            >
              {exif.has_exif ? 'Yes' : 'No — suspicious'}
            </span>
          </div>
        </div>
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
          📋 Share Result
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
