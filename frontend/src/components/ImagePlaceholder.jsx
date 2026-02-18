import { motion } from 'framer-motion';
import { ScanSearch, FileImage, Layers, Cpu } from 'lucide-react';

const FEATURES = [
  { icon: <Cpu size={18} />,        label: 'AI vision model deepfake detection' },
  { icon: <ScanSearch size={18} />, label: 'EXIF metadata & editing software analysis' },
  { icon: <Layers size={18} />,     label: 'Pixel-level manipulation indicators' },
  { icon: <FileImage size={18} />,  label: 'AI-generation probability score' },
];

export default function ImagePlaceholder() {
  return (
    <motion.div
      key="image"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="max-w-2xl mx-auto"
    >
      <div className="glass-card p-8 flex flex-col items-center text-center gap-6">
        {/* Icon */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl"
          style={{ background: 'var(--accent-sub)', border: '1px solid var(--accent)' }}
        >
          🖼️
        </motion.div>

        {/* Badge */}
        <span
          className="text-xs font-mono font-bold px-3 py-1 rounded-full uppercase tracking-widest"
          style={{ background: 'var(--accent-sub)', color: 'var(--accent)', border: '1px solid var(--accent)' }}
        >
          Coming Soon
        </span>

        {/* Title */}
        <div>
          <h2 className="font-heading font-bold text-2xl mb-2" style={{ color: 'var(--text-1)' }}>
            Fake Image Detector
          </h2>
          <p className="text-sm leading-relaxed max-w-md" style={{ color: 'var(--text-2)' }}>
            Upload an image or paste a URL and our AI vision model will detect deepfakes,
            AI-generated images, and photo manipulation — with a confidence score and detailed breakdown.
          </p>
        </div>

        {/* Planned features */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)' }}
            >
              <span style={{ color: 'var(--accent)' }}>{f.icon}</span>
              <span className="text-sm" style={{ color: 'var(--text-2)' }}>{f.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Fake upload preview */}
        <div className="w-full opacity-50 pointer-events-none select-none">
          <div
            className="flex flex-col items-center justify-center gap-2 px-4 py-8 rounded-xl"
            style={{
              background: 'var(--bg-glass)',
              border: '2px dashed var(--border-glass)',
            }}
          >
            <FileImage size={28} style={{ color: 'var(--text-3)' }} />
            <span className="text-sm" style={{ color: 'var(--text-3)' }}>
              Drop image here or paste URL…
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
