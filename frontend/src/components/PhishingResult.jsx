import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, ShieldAlert, ShieldX, CheckCircle2, AlertTriangle, XCircle, Globe, Lock, Clock, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import ScoreRing from './ScoreRing';
import ConfidenceBreakdown from './ConfidenceBreakdown';
import ShareCard from './ShareCard';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const section = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

function VerdictConfig(verdict) {
  const map = {
    SAFE:       { icon: <Shield size={20} />,      label: '✅ SAFE',       color: '#22c55e', bg: 'rgba(34,197,94,0.1)',  border: 'rgba(34,197,94,0.3)'  },
    SUSPICIOUS: { icon: <ShieldAlert size={20} />, label: '⚠️ SUSPICIOUS', color: '#eab308', bg: 'rgba(234,179,8,0.1)', border: 'rgba(234,179,8,0.3)' },
    DANGEROUS:  { icon: <ShieldX size={20} />,     label: '🔴 DANGEROUS',  color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)'  },
  };
  return map[verdict] ?? map.SUSPICIOUS;
}

function LayerRow({ icon, label, risk, signals, checked }) {
  const hasSignals = signals && signals.length > 0;
  const statusColor = risk > 20 ? '#ef4444' : risk > 0 ? '#eab308' : '#22c55e';
  const StatusIcon = risk > 20 ? XCircle : risk > 0 ? AlertTriangle : CheckCircle2;

  return (
    <div
      className="p-3 rounded-xl"
      style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)' }}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span style={{ color: 'var(--text-3)' }}>{icon}</span>
          <span className="text-sm font-medium" style={{ color: 'var(--text-1)' }}>{label}</span>
          {checked === false && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-glass)', color: 'var(--text-3)' }}>
              skipped
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <StatusIcon size={14} style={{ color: statusColor }} />
          <span className="text-xs font-mono font-bold" style={{ color: statusColor }}>
            +{risk}
          </span>
        </div>
      </div>
      {hasSignals && (
        <ul className="mt-2 flex flex-col gap-1">
          {signals.map((s, i) => (
            <li key={i} className="text-xs flex items-start gap-1.5" style={{ color: 'var(--text-2)' }}>
              <span className="mt-1 w-1 h-1 rounded-full shrink-0" style={{ background: statusColor }} />
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function PhishingResult({ data }) {
  const { url, hostname, risk_score, verdict, signals, layers, ai_analysis } = data;
  const [showShare, setShowShare] = useState(false);
  const vc = VerdictConfig(verdict);

  // Removed handleShare function as it's replaced by the modal logic

  const breakdown = [
    { label: 'Heuristics Risk', score: Math.min(100, layers.heuristics.risk * 2), color: '#ef4444' },
    { label: 'Domain Trust',    score: Math.max(0, 100 - layers.whois.risk * 2), color: '#3b82f6' },
    { label: 'SSL Security',    score: Math.max(0, 100 - layers.ssl.risk * 2),   color: '#22c55e' },
  ];

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
          {/* Verdict badge */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-heading font-bold text-sm"
            style={{ background: vc.bg, color: vc.color, border: `1px solid ${vc.color}` }}
          >
            {vc.icon}
            {vc.label}
          </motion.div>

          {/* Domain */}
          <div className="flex items-center gap-2">
            <Globe size={13} style={{ color: 'var(--text-3)' }} />
            <span className="text-xs font-mono" style={{ color: 'var(--text-2)' }}>{hostname}</span>
          </div>

          {/* Attack type */}
          {ai_analysis?.attack_type && ai_analysis.attack_type !== 'Appears Safe' && (
            <span
              className="text-xs font-mono font-bold px-2 py-0.5 rounded w-fit"
              style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}
            >
              {ai_analysis.attack_type}
            </span>
          )}
        </div>

        <ScoreRing score={risk_score} label="Risk Score" inverted />
      </motion.div>

      {/* Confidence Breakdown */}
      <motion.div variants={section}>
        <h3 className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text-3)' }}>
          Risk Allocation
        </h3>
        <ConfidenceBreakdown metrics={breakdown} />
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

      {/* Layer breakdown */}
      <motion.div variants={section}>
        <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-3)' }}>
          Detection Layers
        </h3>
        <div className="flex flex-col gap-2">
          <LayerRow
            icon={<Search size={14} />}
            label="URL Heuristics"
            risk={layers.heuristics.risk}
            signals={layers.heuristics.signals}
          />
          <LayerRow
            icon={<Clock size={14} />}
            label={`Domain Age${layers.whois.domain_age_days != null ? ` (${layers.whois.domain_age_days} days)` : ''}`}
            risk={layers.whois.risk}
            signals={layers.whois.signals}
          />
          <LayerRow
            icon={<Lock size={14} />}
            label={`SSL Certificate${layers.ssl.info?.issuer ? ` — ${layers.ssl.info.issuer}` : ''}`}
            risk={layers.ssl.risk}
            signals={layers.ssl.signals}
          />
          <LayerRow
            icon={<Shield size={14} />}
            label="Google Safe Browsing"
            risk={layers.safe_browsing.risk}
            signals={layers.safe_browsing.signals}
            checked={layers.safe_browsing.checked}
          />
        </div>
      </motion.div>

      {/* All signals summary */}
      {signals.length > 0 && (
        <motion.div
          variants={section}
          className="p-4 rounded-xl"
          style={{ background: 'var(--danger-bg)', border: '1px solid rgba(239,68,68,0.2)' }}
        >
          <h3 className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--danger)' }}>
            ⚠️ All Risk Signals ({signals.length})
          </h3>
          <ul className="flex flex-col gap-1">
            {signals.map((s, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-2 text-xs"
                style={{ color: 'var(--danger)' }}
              >
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--danger)' }} />
                {s}
              </motion.li>
            ))}
          </ul>
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
