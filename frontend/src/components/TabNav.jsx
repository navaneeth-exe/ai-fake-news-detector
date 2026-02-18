import { motion } from 'framer-motion';

const TABS = [
  { id: 'home',     label: 'Dashboard',         icon: '🏠', ready: true },
  { id: 'news',     label: 'Fake News',         icon: '📰', ready: true },
  { id: 'phishing', label: 'Phishing Detector', icon: '🎣', ready: true },
  { id: 'image',    label: 'Fake Image',        icon: '🖼️', ready: true },
  { id: 'audio',    label: 'Deepfake Audio',    icon: '🎙️', ready: true },
];

export default function TabNav({ active, onChange }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="flex items-center gap-1 p-1 rounded-2xl w-fit mx-auto"
      style={{
        background: 'var(--bg-glass)',
        border: '1px solid var(--border-glass)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {TABS.map(tab => {
        const isActive = active === tab.id;
        return (
          <motion.button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
            style={{
              color: isActive ? 'white' : 'var(--text-2)',
              cursor: 'pointer',
              border: 'none',
              background: 'transparent',
              fontFamily: 'Space Grotesk, sans-serif',
            }}
          >
            {/* Active pill background */}
            {isActive && (
              <motion.span
                layoutId="tab-pill"
                className="absolute inset-0 rounded-xl"
                style={{ background: 'var(--accent)' }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10 text-base leading-none">{tab.icon}</span>
            <span className="relative z-10 hidden sm:inline">{tab.label}</span>
            {!tab.ready && (
              <span
                className="relative z-10 text-[10px] font-mono px-1.5 py-0.5 rounded-full hidden sm:inline"
                style={{
                  background: isActive ? 'rgba(255,255,255,0.2)' : 'var(--accent-sub)',
                  color: isActive ? 'white' : 'var(--accent)',
                }}
              >
                Soon
              </span>
            )}
          </motion.button>
        );
      })}
    </motion.div>
  );
}
