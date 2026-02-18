import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function WaveformVisualizer({ isPlaying }) {
  const [bars, setBars] = useState(new Array(30).fill(10));

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setBars(prev => prev.map(() => Math.floor(Math.random() * 80) + 10));
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="flex items-center justify-center gap-1 h-12 w-full max-w-xs mx-auto">
      {bars.map((height, i) => (
        <motion.div
          key={i}
          className="w-1 bg-blue-500 rounded-full opacity-80"
          animate={{ height: `${isPlaying ? height : 10}%` }}
          transition={{ duration: 0.1 }}
        />
      ))}
    </div>
  );
}
