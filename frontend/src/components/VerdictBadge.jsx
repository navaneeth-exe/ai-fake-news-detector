import { motion } from 'framer-motion';

export default function VerdictBadge({ verdict, type = 'text' }) {
  const map = {
    // Text verdicts
    REAL:      { label: '✅ REAL',      cls: 'verdict-real' },
    FAKE:      { label: '❌ FAKE',      cls: 'verdict-fake' },
    UNCERTAIN: { label: '⚠️ UNCERTAIN', cls: 'verdict-uncertain' },
    // URL verdicts
    MOSTLY_CREDIBLE: { label: '✅ MOSTLY CREDIBLE', cls: 'verdict-real' },
    QUESTIONABLE:    { label: '⚠️ QUESTIONABLE',    cls: 'verdict-uncertain' },
    NOT_CREDIBLE:    { label: '❌ NOT CREDIBLE',     cls: 'verdict-fake' },
  };

  const { label, cls } = map[verdict] ?? { label: verdict, cls: 'verdict-uncertain' };

  return (
    <motion.div
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`inline-flex items-center px-5 py-2 rounded-full font-heading font-bold text-sm tracking-wide ${cls}`}
    >
      {label}
    </motion.div>
  );
}
