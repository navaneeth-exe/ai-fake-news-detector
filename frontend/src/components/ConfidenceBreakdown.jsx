import { motion } from 'framer-motion';

export default function ConfidenceBreakdown({ metrics }) {
  return (
    <div className="flex flex-col gap-3 py-2">
      {metrics.map((m, i) => (
        <div key={i} className="flex flex-col gap-1">
          <div className="flex justify-between text-xs font-medium" style={{ color: 'var(--text-2)' }}>
            <span>{m.label}</span>
            <span>{m.score}%</span>
          </div>
          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${m.score}%` }}
              transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ background: m.color || 'var(--accent)' }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
