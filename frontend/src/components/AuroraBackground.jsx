import { motion } from 'framer-motion';

export default function AuroraBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Deep Space Base */}
      <div className="absolute inset-0 bg-[var(--bg-primary)]" />

      {/* Aurora Layer 1 - Primary Accent */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: ['-10%', '10%', '-10%'],
          y: ['-10%', '10%', '-10%'],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full blur-[100px]"
        style={{
          background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
          opacity: 0.4
        }}
      />

      {/* Aurora Layer 2 - Secondary / Deep Blue */}
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
          x: ['10%', '-10%', '10%'],
          y: ['10%', '-10%', '10%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute bottom-[-10%] right-[-10%] w-[80vw] h-[80vw] rounded-full blur-[120px]"
        style={{
          background: 'radial-gradient(circle, var(--accent-d) 0%, transparent 70%)',
          opacity: 0.3
        }}
      />

      {/* Aurora Layer 3 - Subtle Highlight */}
      <motion.div
        animate={{
          scale: [0.8, 1.1, 0.8],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5
        }}
        className="absolute top-[40%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] rounded-full blur-[90px]"
        style={{
          background: 'radial-gradient(circle, var(--text-3) 0%, transparent 60%)',
          opacity: 0.2
        }}
      />

      {/* Noise Overlay for Texture */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
