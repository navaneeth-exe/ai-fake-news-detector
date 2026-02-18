import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

export default function RedFlags({ flags = [] }) {
  if (!flags.length) return null;

  return (
    <div
      className="p-4 rounded-xl"
      style={{ background: 'var(--danger-bg)', border: '1px solid rgba(239,68,68,0.2)' }}
    >
      <h3
        className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-3"
        style={{ color: 'var(--danger)' }}
      >
        <AlertTriangle size={13} />
        Red Flags
      </h3>
      <ul className="flex flex-col gap-1.5">
        {flags.map((flag, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
            className="flex items-start gap-2 text-sm"
            style={{ color: 'var(--danger)' }}
          >
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--danger)' }} />
            {flag}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
