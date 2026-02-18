import { motion } from 'framer-motion';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export default function LoadingCard({ type = 'claim' }) {
  const getMessages = () => {
    switch (type) {
      case 'url':
        return { title: 'Fetching & Analyzing Article…', subtitle: 'Scraping content, checking credibility & verifying claims.' };
      case 'phishing':
        return { title: 'Scanning for Threats…', subtitle: 'Checking URL patterns, SSL status, and Google Safe Browsing database.' };
      case 'image':
        return { title: 'Analyzing Image Forensics…', subtitle: 'Processing pixel data, EXIF metadata, and running AI detection model.' };
      case 'audio':
        return { title: 'Analyzing Audio Patterns…', subtitle: 'Examining spectral data and checking for synthetic voice artifacts.' };
      default:
        return { title: 'Analyzing Claim…', subtitle: 'Searching evidence and cross-referencing sources.' };
    }
  };

  const { title, subtitle } = getMessages();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="glass-card p-6 flex flex-col items-center gap-6"
    >
      {/* Orbital spinner */}
      <div className="relative w-16 h-16 flex items-center justify-center">
        <span className="orbital-spinner lg" />
        <span className="absolute text-2xl animate-float">
          {type === 'phishing' ? '🛡️' : type === 'image' ? '🖼️' : type === 'audio' ? '🎙️' : '🔍'}
        </span>
      </div>

      <div className="text-center">
        <p className="font-heading font-semibold text-base" style={{ color: 'var(--text-1)' }}>
          {title}
        </p>
        <p className="text-sm mt-1" style={{ color: 'var(--text-2)' }}>
          {subtitle}
        </p>
      </div>

      {/* Skeleton bars */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full flex flex-col gap-3"
      >
        {[80, 60, 90, 50].map((w, i) => (
          <motion.div
            key={i}
            variants={item}
            className="h-3 rounded-full"
            style={{
              width: `${w}%`,
              background: 'linear-gradient(90deg, var(--bg-glass) 25%, var(--bg-glass-h) 50%, var(--bg-glass) 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.8s ease-in-out infinite',
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
