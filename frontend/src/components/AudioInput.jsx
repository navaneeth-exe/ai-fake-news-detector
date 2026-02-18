import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Mic, X, Play, Pause, ScanSearch } from 'lucide-react';

export default function AudioInput({ onCheck, loading }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  
  const fileInputRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFile = (f) => {
    if (!f || !f.type.startsWith('audio/')) return;
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
    setIsPlaying(false);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, []);

  const handleDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = () => setDragging(false);

  const clearFile = () => {
    setFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const onEnded = () => setIsPlaying(false);

  const handleSubmit = () => {
    if (loading || !file) return;
    onCheck(file);
  };

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
          style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.4)' }}
        >
          🎙️
        </div>
        <div>
          <h2 className="font-heading font-bold text-lg" style={{ color: 'var(--text-1)' }}>
            Deepfake Audio Detector
          </h2>
          <p className="text-xs" style={{ color: 'var(--text-2)' }}>
            Upload voice clips to detect AI synthesis and scam patterns
          </p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={e => handleFile(e.target.files[0])}
      />

      <AnimatePresence mode="wait" initial={false}>
        {!file ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, y: 10 }}
            exit={{ opacity: 0, y: -10 }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            animate={{ 
              opacity: 1, 
              y: 0,
              borderColor: dragging ? 'rgba(59,130,246,0.8)' : 'rgba(59,130,246,0.3)',
              backgroundColor: dragging ? 'rgba(59,130,246,0.08)' : 'var(--bg-glass)' 
            }}
            className="flex flex-col items-center justify-center gap-3 p-10 rounded-xl cursor-pointer transition-colors w-full"
            style={{
              border: '2px dashed rgba(59,130,246,0.3)',
              minHeight: '180px',
            }}
          >
            <motion.div
              animate={{ y: dragging ? -6 : 0 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Mic size={36} style={{ color: 'rgba(59,130,246,0.6)' }} />
            </motion.div>
            <div className="text-center">
              <p className="text-sm font-medium" style={{ color: 'var(--text-1)' }}>
                {dragging ? 'Drop audio file!' : 'Drag & drop audio clip'}
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-3)' }}>
                or click to browse · MP3, WAV, M4A · max 10 MB
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-xl p-4 flex flex-col gap-3 w-full"
            style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shrink-0"
                  style={{ background: 'var(--accent)', color: 'white', border: 'none' }}
                >
                  {isPlaying ? <Pause size={16} fill="white" /> : <Play size={16} fill="white" className="ml-0.5" />}
                </button>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium truncate max-w-[200px]" style={{ color: 'var(--text-1)' }}>{file.name}</span>
                  <span className="text-xs font-mono" style={{ color: 'var(--text-3)' }}>
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              </div>
              <button
                onClick={clearFile}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors shrink-0"
                style={{ color: 'var(--text-2)' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden relative">
              <div
                className="h-full absolute top-0 left-0 bg-blue-500 transition-all duration-100"
                style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
              />
            </div>

            <audio
              ref={audioRef}
              src={previewUrl}
              onTimeUpdate={onTimeUpdate}
              onEnded={onEnded}
              className="hidden"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={file && !loading ? { scale: 1.02 } : {}}
        whileTap={file && !loading ? { scale: 0.98 } : {}}
        onClick={handleSubmit}
        disabled={!file || loading}
        className="verify-btn flex items-center justify-center gap-2"
        style={{
          background: file && !loading
            ? 'linear-gradient(135deg, #3b82f6, #60a5fa)'
            : 'rgba(59,130,246,0.3)',
          opacity: file && !loading ? 1 : 0.8,
          cursor: file && !loading ? 'pointer' : 'not-allowed',
        }}
      >
        {loading ? (
          <><span className="orbital-spinner" /> Analyzing Voice...</>
        ) : (
          <><ScanSearch size={16} /> Detect Deepfake</>
        )}
      </motion.button>
    </motion.div>
  );
}
