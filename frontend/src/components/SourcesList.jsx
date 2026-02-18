import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

export default function SourcesList({ sources = [] }) {
  if (!sources.length) return null;

  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-3)' }}>
        Sources
      </h3>
      <div className="flex flex-col gap-2">
        {sources.map((src, i) => (
          <motion.a
            key={i}
            href={src.link}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="flex items-start gap-3 p-3 rounded-xl group"
            style={{
              background: 'var(--bg-glass)',
              border: '1px solid var(--border-glass)',
              textDecoration: 'none',
              transition: 'border-color 0.2s, background 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--accent)';
              e.currentTarget.style.background = 'var(--accent-sub)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border-glass)';
              e.currentTarget.style.background = 'var(--bg-glass)';
            }}
          >
            <span
              className="font-mono font-bold text-sm mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs"
              style={{ background: 'var(--accent-sub)', color: 'var(--accent)' }}
            >
              {i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: 'var(--text-1)' }}>
                {src.title || 'Source'}
              </p>
              {src.snippet && (
                <p className="text-xs mt-0.5 line-clamp-2" style={{ color: 'var(--text-2)' }}>
                  {src.snippet}
                </p>
              )}
            </div>
            <ExternalLink size={13} className="shrink-0 mt-0.5" style={{ color: 'var(--text-3)' }} />
          </motion.a>
        ))}
      </div>
    </div>
  );
}
