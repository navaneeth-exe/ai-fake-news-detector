import { motion } from 'framer-motion';

export default function StatCard({ value, label, icon, color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass-card p-6 flex items-center gap-4 relative overflow-hidden group"
    >
      {/* Background Glow */}
      <div 
        className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full opacity-10 blur-xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-20"
        style={{ background: color }}
      />

      <div 
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
        style={{ background: `${color}20`, border: `1px solid ${color}40` }}
      >
        {icon}
      </div>

      <div>
        <h3 className="text-2xl font-bold font-heading" style={{ color: 'var(--text-1)' }}>
          {value}
        </h3>
        <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-3)' }}>
          {label}
        </p>
      </div>
    </motion.div>
  );
}
