import { useEffect, useRef } from 'react';

// ─── Spotlight Glow ───
// A soft, large radial light that follows the mouse cursor,
// illuminating glass cards from behind as you interact.

export default function SpotlightGlow() {
  const glowRef = useRef(null);
  const pos = useRef({ x: -500, y: -500 });
  const rendered = useRef({ x: -500, y: -500 });
  const animId = useRef(null);

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;

    const onMouse = (e) => {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;
    };

    const onLeave = () => {
      pos.current.x = -500;
      pos.current.y = -500;
    };

    // Smooth lerp animation loop
    const animate = () => {
      const lerp = 0.08; // Smoothing factor (lower = smoother trail)
      rendered.current.x += (pos.current.x - rendered.current.x) * lerp;
      rendered.current.y += (pos.current.y - rendered.current.y) * lerp;

      glow.style.background = `radial-gradient(
        600px circle at ${rendered.current.x}px ${rendered.current.y}px,
        var(--accent-glow) 0%,
        transparent 70%
      )`;

      animId.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMouse);
    window.addEventListener('mouseleave', onLeave);
    animId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(animId.current);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      className="fixed inset-0 z-[1] pointer-events-none transition-opacity duration-500"
      aria-hidden="true"
      style={{ opacity: 0.6 }}
    />
  );
}
