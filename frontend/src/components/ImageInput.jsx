import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Link2, X, ImageIcon, ScanSearch } from 'lucide-react';

export default function ImageInput({ onCheck, loading }) {
  const [mode, setMode] = useState('upload'); // 'upload' | 'url'
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [urlValue, setUrlValue] = useState('');
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = (f) => {
    if (!f || !f.type.startsWith('image/')) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(f);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, []);

  const handleDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = () => setDragging(false);

  const clearFile = () => { setFile(null); setPreview(null); };

  const handleSubmit = () => {
    if (loading) return;
    if (mode === 'upload' && file) {
      onCheck({ type: 'file', file });
    } else if (mode === 'url' && urlValue.trim()) {
      onCheck({ type: 'url', url: urlValue.trim() });
    }
  };

  const canSubmit = !loading && (mode === 'upload' ? !!file : !!urlValue.trim());

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass-card p-6 flex flex-col gap-5 max-w-2xl mx-auto w-full"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
          style={{ background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.4)' }}
        >
          🖼️
        </div>
        <div>
          <h2 className="font-heading font-bold text-lg" style={{ color: 'var(--text-1)' }}>
            Fake Image Detector
          </h2>
          <p className="text-xs" style={{ color: 'var(--text-2)' }}>
            Upload or paste a URL — AI will detect if it's generated or manipulated
          </p>
        </div>
      </div>

      {/* Mode toggle */}
      <div
        className="flex gap-1 p-1 rounded-xl w-fit"
        style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)' }}
      >
        {[
          { id: 'upload', icon: <Upload size={13} />, label: 'Upload File' },
          { id: 'url',    icon: <Link2 size={13} />,  label: 'Image URL'  },
        ].map(m => (
          <motion.button
            key={m.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setMode(m.id); clearFile(); setUrlValue(''); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            style={{
              background: mode === m.id ? 'rgba(168,85,247,0.8)' : 'transparent',
              color: mode === m.id ? 'white' : 'var(--text-2)',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {m.icon} {m.label}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Upload mode */}
        {mode === 'upload' && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            {preview ? (
              <div className="relative rounded-xl overflow-hidden" style={{ border: '1px solid var(--border-glass)' }}>
                <img src={preview} alt="Preview" className="w-full max-h-64 object-contain" style={{ background: 'var(--bg-glass)' }} />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={clearFile}
                  className="absolute top-2 right-2 p-1.5 rounded-full"
                  style={{ background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', cursor: 'pointer' }}
                >
                  <X size={14} />
                </motion.button>
                <div className="absolute bottom-0 left-0 right-0 px-3 py-2 text-xs" style={{ background: 'rgba(0,0,0,0.5)', color: 'rgba(255,255,255,0.8)' }}>
                  {file?.name} · {(file?.size / 1024).toFixed(0)} KB
                </div>
              </div>
            ) : (
              <motion.div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                animate={{ borderColor: dragging ? 'rgba(168,85,247,0.8)' : 'rgba(168,85,247,0.3)' }}
                className="flex flex-col items-center justify-center gap-3 p-10 rounded-xl cursor-pointer transition-colors"
                style={{
                  border: '2px dashed rgba(168,85,247,0.3)',
                  background: dragging ? 'rgba(168,85,247,0.08)' : 'var(--bg-glass)',
                  minHeight: 180,
                }}
              >
                <motion.div
                  animate={{ y: dragging ? -6 : 0 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <ImageIcon size={36} style={{ color: 'rgba(168,85,247,0.6)' }} />
                </motion.div>
                <div className="text-center">
                  <p className="text-sm font-medium" style={{ color: 'var(--text-1)' }}>
                    {dragging ? 'Drop it!' : 'Drag & drop an image'}
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-3)' }}>
                    or click to browse · JPEG, PNG, WebP, GIF · max 10 MB
                  </p>
                </div>
              </motion.div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => handleFile(e.target.files[0])}
            />
          </motion.div>
        )}

        {/* URL mode */}
        {mode === 'url' && (
          <motion.div
            key="url"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex flex-col gap-3"
          >
            <div className="relative">
              <Link2 size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-3)' }} />
              <input
                type="url"
                className="w-full pl-9 pr-4 py-3 rounded-xl text-sm"
                style={{
                  background: 'var(--bg-glass)',
                  border: '1px solid var(--border-glass)',
                  color: 'var(--text-1)',
                  fontFamily: 'Inter, sans-serif',
                  outline: 'none',
                }}
                placeholder="https://example.com/image.jpg"
                value={urlValue}
                onChange={e => setUrlValue(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                onFocus={e => { e.target.style.borderColor = 'rgba(168,85,247,0.8)'; e.target.style.boxShadow = '0 0 0 3px rgba(168,85,247,0.2)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border-glass)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
            {/* URL preview */}
            {urlValue.trim() && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border-glass)' }}>
                <img
                  src={urlValue}
                  alt="URL preview"
                  className="w-full max-h-48 object-contain"
                  style={{ background: 'var(--bg-glass)' }}
                  onError={e => { e.target.style.display = 'none'; }}
                />
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analyse button */}
      <motion.button
        id="imageCheckBtn"
        whileHover={canSubmit ? { scale: 1.02 } : {}}
        whileTap={canSubmit ? { scale: 0.98 } : {}}
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="verify-btn flex items-center justify-center gap-2"
        style={{
          background: canSubmit
            ? 'linear-gradient(135deg, #7c3aed, #a855f7, #c084fc)'
            : 'rgba(168,85,247,0.3)',
        }}
      >
        {loading ? (
          <><span className="orbital-spinner" /> Analysing Image…</>
        ) : (
          <><ScanSearch size={16} /> Analyse Image<span className="ml-auto text-xs opacity-60 font-mono hidden sm:inline">Enter ↵</span></>
        )}
      </motion.button>
    </motion.div>
  );
}
