import { motion } from 'framer-motion';

export default function AmbientLights({ theme }) {
  // Ultra-subtle lighting
  const isLight = theme === 'light' || theme === 'corporate';
  
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Top Center Glow (Very Faint) */}
      <motion.div
        animate={{
          opacity: [0.15, 0.25, 0.15],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-[-25%] left-[20%] w-[70vw] h-[70vw] rounded-full blur-[150px]"
        style={{
          background: isLight 
            ? 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)' 
            : 'radial-gradient(circle, var(--accent) 0%, transparent 80%)',
          opacity: 0.2, // Base opacity lowered significantly
          mixBlendMode: 'screen' 
        }}
      />

      {/* Bottom Right Secondary Glow (Barely Visible) */}
      <motion.div
        animate={{
          opacity: [0.1, 0.2, 0.1],
          x: [0, 30, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full blur-[140px]"
        style={{
          background: isLight
            ? 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)'
            : 'radial-gradient(circle, var(--text-3) 0%, transparent 85%)', 
          opacity: 0.15,
          mixBlendMode: 'screen'
        }}
      />
    </div>
  );
}
