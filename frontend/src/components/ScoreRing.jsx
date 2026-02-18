import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const CIRCUMFERENCE = 2 * Math.PI * 45; // r=45

function scoreColor(score, inverted = false) {
  if (inverted) {
    // Risk score: high = bad (red), low = good (green)
    if (score >= 60) return '#ef4444';
    if (score >= 30) return '#eab308';
    return '#22c55e';
  }
  // Credibility score: high = good (green), low = bad (red)
  if (score >= 70) return '#22c55e';
  if (score >= 40) return '#eab308';
  return '#ef4444';
}

export default function ScoreRing({ score, label = 'Truth Score', inverted = false }) {
  const [displayed, setDisplayed] = useState(0);
  const [offset, setOffset] = useState(CIRCUMFERENCE);
  const raf = useRef(null);

  useEffect(() => {
    const target = Math.max(0, Math.min(100, score));
    const targetOffset = CIRCUMFERENCE - (target / 100) * CIRCUMFERENCE;
    const duration = 1500;
    const start = performance.now();
    const fromOffset = CIRCUMFERENCE;
    const fromNum = 0;

    const tick = (now) => {
      const elapsed = Math.min(now - start, duration);
      const t = 1 - Math.pow(1 - elapsed / duration, 3); // ease-out cubic
      setOffset(fromOffset + (targetOffset - fromOffset) * t);
      setDisplayed(Math.round(fromNum + (target - fromNum) * t));
      if (elapsed < duration) raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [score]);

  const color = scoreColor(score, inverted);

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--text-3)' }}>
        {label}
      </p>
      <div className="relative w-28 h-28">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          {/* Track */}
          <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
          {/* Progress */}
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            style={{ transition: 'stroke 0.4s ease', filter: `drop-shadow(0 0 6px ${color}80)` }}
          />
        </svg>
        {/* Center number */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono font-bold text-2xl" style={{ color }}>
            {displayed}
          </span>
          <span className="text-xs" style={{ color: 'var(--text-3)' }}>/100</span>
        </div>
      </div>
    </div>
  );
}
