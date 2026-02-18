export default function BackgroundBlobs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      <div
        className="absolute animate-blob"
        style={{
          width: 450, height: 450,
          background: 'var(--accent-glow, rgba(99,102,241,0.15))',
          filter: 'blur(80px)',
          top: '-10%', left: '-5%',
          animationDuration: '22s',
          borderRadius: '40% 60% 60% 40% / 60% 30% 70% 40%',
        }}
      />
      <div
        className="absolute animate-blob"
        style={{
          width: 350, height: 350,
          background: 'rgba(168,85,247,0.12)',
          filter: 'blur(80px)',
          top: '40%', right: '-8%',
          animationDuration: '28s',
          animationDelay: '-8s',
          borderRadius: '60% 40% 30% 70% / 40% 60% 40% 60%',
        }}
      />
      <div
        className="absolute animate-blob"
        style={{
          width: 400, height: 400,
          background: 'rgba(59,130,246,0.10)',
          filter: 'blur(80px)',
          bottom: '-10%', left: '30%',
          animationDuration: '32s',
          animationDelay: '-15s',
          borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%',
        }}
      />
    </div>
  );
}
