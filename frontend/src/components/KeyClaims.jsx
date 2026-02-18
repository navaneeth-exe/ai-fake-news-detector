import { motion } from 'framer-motion';

const verdictMap = {
  REAL:      { label: 'Real', cls: 'verdict-real' },
  FAKE:      { label: 'Fake', cls: 'verdict-fake' },
  UNCERTAIN: { label: 'Uncertain', cls: 'verdict-uncertain' },
  UNVERIFIED:{ label: 'Unverified', cls: 'verdict-uncertain' },
};

export default function KeyClaims({ claims = [] }) {
  if (!claims.length) return null;

  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-3)' }}>
        Key Claims Verified
      </h3>
      <div className="flex flex-col gap-2">
        {claims.map((c, i) => {
          const { label, cls } = verdictMap[c.verdict] ?? { label: c.verdict, cls: 'verdict-uncertain' };
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-3 rounded-xl"
              style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)' }}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm flex-1" style={{ color: 'var(--text-1)' }}>{c.claim}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-mono font-bold shrink-0 ${cls}`}>
                  {label}
                </span>
              </div>
              {c.sources?.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {c.sources.slice(0, 2).map((s, j) => (
                    <a
                      key={j}
                      href={s.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        background: 'var(--accent-sub)',
                        color: 'var(--accent)',
                        textDecoration: 'none',
                      }}
                    >
                      {s.title?.substring(0, 30) || 'Source'}…
                    </a>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
