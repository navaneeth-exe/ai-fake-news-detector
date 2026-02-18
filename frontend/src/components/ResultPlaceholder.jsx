import { motion } from 'framer-motion';

export default function ResultPlaceholder({ icon, title, description, tags }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="glass-card p-10 flex flex-col items-center justify-center text-center gap-4 h-full"
      style={{ minHeight: '400px' }}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="text-6xl mb-2"
      >
        {icon}
      </motion.div>
      <div>
        <h3 className="font-heading font-bold text-xl mb-2" style={{ color: 'var(--text-1)' }}>
          {title}
        </h3>
        <p className="text-sm max-w-xs mx-auto leading-relaxed" style={{ color: 'var(--text-2)' }}>
          {description}
        </p>
      </div>

      {tags && (
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="text-xs font-mono font-medium px-2 py-1 rounded-md"
              style={{ background: 'var(--bg-glass-h)', color: 'var(--accent)', border: '1px solid var(--border-glass)' }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
