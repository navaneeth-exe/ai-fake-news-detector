import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import ParticleCanvas from './components/ParticleCanvas';
import BackgroundBlobs from './components/BackgroundBlobs';
import TabNav from './components/TabNav';
import InputPanel from './components/InputPanel';
import TextResult from './components/TextResult';
import UrlResult from './components/UrlResult';
import LoadingCard from './components/LoadingCard';
import HistorySidebar from './components/HistorySidebar';
import PhishingInput from './components/PhishingInput';
import PhishingResult from './components/PhishingResult';
import ImageInput from './components/ImageInput';
import ImageResult from './components/ImageResult';
import AudioInput from './components/AudioInput';
import AudioResult from './components/AudioResult';
import ResultPlaceholder from './components/ResultPlaceholder';
import Dashboard from './components/Dashboard';
import { useTheme, useHistory } from './hooks/hooks';
import { verifyInput, checkPhishing, checkImage, checkAudio } from './lib/api';
import toast from 'react-hot-toast';

function isUrl(text) {
  return /^(https?:\/\/|www\.)/i.test(text.trim());
}

export default function App() {
  const { theme, toggle } = useTheme();
  const { history, save, clear } = useHistory();
  const [historyOpen, setHistoryOpen] = useState(false);
  // Set default tab to 'home'
  const [activeTab, setActiveTab] = useState('home');
  // News tab state
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  // Phishing tab state
  const [phishingLoading, setPhishingLoading] = useState(false);
  const [phishingResult, setPhishingResult] = useState(null);
  const [phishingError, setPhishingError] = useState(null);
  // Image tab state
  const [imageLoading, setImageLoading] = useState(false);
  const [imageResult, setImageResult] = useState(null);
  const [imageError, setImageError] = useState(null);
  // Audio tab state
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioResult, setAudioResult] = useState(null);
  const [audioError, setAudioError] = useState(null);

  const handleVerify = async (claim) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await verifyInput(claim);
      const type = res.input_type ?? (isUrl(claim) ? 'url' : 'text');
      const data = res.data ?? res;
      setResult({ type, data });
      save(claim, data, type);
      toast.success('Analysis complete!', { icon: '✅' });
    } catch (err) {
      setError(err.message || 'Something went wrong. Is the backend running?');
      toast.error(err.message || 'Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhishingCheck = async (url) => {
    setPhishingLoading(true);
    setPhishingError(null);
    setPhishingResult(null);
    try {
      const res = await checkPhishing(url);
      setPhishingResult(res.data);
      save(url, res.data, 'phishing');          // ← save to history
      toast.success('Scan complete!', { icon: '🛡️' });
    } catch (err) {
      setPhishingError(err.message || 'Scan failed. Is the backend running?');
      toast.error(err.message || 'Phishing scan failed.');
    } finally {
      setPhishingLoading(false);
    }
  };

  const handleImageCheck = async (input) => {
    setImageLoading(true);
    setImageError(null);
    setImageResult(null);
    try {
      const res = await checkImage(input);
      setImageResult(res.data);
      const label = input.type === 'url' ? input.url : input.file.name;
      save(label, res.data, 'image');
      toast.success('Analysis complete!', { icon: '🖼️' });
    } catch (err) {
      setImageError(err.message || 'Analysis failed. Is the backend running?');
      toast.error(err.message || 'Image analysis failed.');
    } finally {
      setImageLoading(false);
    }
  };

  const handleAudioCheck = async (file) => {
    setAudioLoading(true);
    setAudioError(null);
    setAudioResult(null);
    try {
      const res = await checkAudio(file);
      setAudioResult(res.data);
      save(file.name, res.data, 'audio');
      toast.success('Analysis complete!', { icon: '🎙️' });
    } catch (err) {
      setAudioError(err.message || 'Analysis failed.');
      toast.error(err.message || 'Audio analysis failed.');
    } finally {
      setAudioLoading(false);
    }
  };

  const handleReplay = (entry) => {
    if (entry.type === 'phishing') {
      setActiveTab('phishing');
      setPhishingResult(entry.result);
      setPhishingError(null);
    } else if (entry.type === 'image') {
      setActiveTab('image');
      setImageResult(entry.result);
      setImageError(null);
    } else if (entry.type === 'audio') {
      setActiveTab('audio');
      setAudioResult(entry.result);
      setAudioError(null);
    } else {
      setActiveTab('news');
      setResult({ type: entry.type, data: entry.result });
      setError(null);
    }
  };

  // Reset result when switching tabs
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setResult(null);
    setError(null);
  };

  return (
    <div className="relative min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Background layers */}
      <BackgroundBlobs />
      <ParticleCanvas theme={theme} />

      {/* Toast notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: 'var(--bg-secondary)',
            color: 'var(--text-1)',
            border: '1px solid var(--border-glass)',
            backdropFilter: 'blur(20px)',
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.875rem',
          },
        }}
      />

      {/* Navbar */}
      <Navbar
        theme={theme}
        onToggleTheme={toggle}
        onToggleHistory={() => setHistoryOpen(o => !o)}
        historyCount={history.length}
      />

      {/* Main layout */}
      <main className="relative z-10 pt-24 pb-12 px-4 min-h-screen flex flex-col gap-6">

        {/* Tab navigation */}
        <TabNav active={activeTab} onChange={handleTabChange} />

        {/* Tab content */}
        <AnimatePresence mode="wait">


          {/* ── Dashboard Tab ── */}
          {activeTab === 'home' && (
            <Dashboard onNavigate={setActiveTab} />
          )}

          {/* ── Fake News Tab ── */}
          {activeTab === 'news' && (
            <motion.div
              key="news"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-6 items-start"
            >
              {/* Left: Input */}
              <InputPanel onVerify={handleVerify} loading={loading} />

              {/* Right: Results */}
              <div className="flex flex-col gap-4">
                <AnimatePresence mode="wait">
                  {loading && (
                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <LoadingCard urlMode={false} />
                    </motion.div>
                  )}

                  {!loading && error && (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="glass-card p-6 text-center"
                    >
                      <p className="text-3xl mb-3">⚠️</p>
                      <p className="font-heading font-semibold mb-1" style={{ color: 'var(--danger)' }}>
                        Verification Failed
                      </p>
                      <p className="text-sm" style={{ color: 'var(--text-2)' }}>{error}</p>
                    </motion.div>
                  )}

                  {!loading && !error && result && (
                    <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      {result.type === 'url'
                        ? <UrlResult data={result.data} />
                        : <TextResult data={result.data} />
                      }
                    </motion.div>
                  )}

                  {!loading && !error && !result && (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="glass-card p-10 flex flex-col items-center justify-center text-center gap-4"
                      style={{ minHeight: 300 }}
                    >
                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        className="text-5xl"
                      >
                        🔍
                      </motion.div>
                      <div>
                        <p className="font-heading font-semibold text-lg" style={{ color: 'var(--text-1)' }}>
                          Ready to Verify
                        </p>
                        <p className="text-sm mt-1" style={{ color: 'var(--text-2)' }}>
                          Enter a claim or URL on the left to get started.
                        </p>
                      </div>
                      <div className="flex flex-wrap justify-center gap-2 mt-2">
                        {['AI-powered', 'Web evidence', 'Instant results'].map(tag => (
                          <span
                            key={tag}
                            className="text-xs px-3 py-1 rounded-full font-mono"
                            style={{ background: 'var(--accent-sub)', color: 'var(--accent)' }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* ── Phishing Tab ── */}
          {activeTab === 'phishing' && (
            <motion.div
              key="phishing"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-6 items-start"
            >
              {/* Left: Input */}
              <PhishingInput onCheck={handlePhishingCheck} loading={phishingLoading} />

              {/* Right: Results */}
              <div className="flex flex-col gap-4">
                <AnimatePresence mode="wait">
                  {phishingLoading && (
                    <motion.div key="p-loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <LoadingCard urlMode={true} />
                    </motion.div>
                  )}
                  {!phishingLoading && phishingError && (
                    <motion.div
                      key="p-error"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="glass-card p-6 text-center"
                    >
                      <p className="text-3xl mb-3">⚠️</p>
                      <p className="font-heading font-semibold mb-1" style={{ color: 'var(--danger)' }}>Scan Failed</p>
                      <p className="text-sm" style={{ color: 'var(--text-2)' }}>{phishingError}</p>
                    </motion.div>
                  )}
                  {!phishingLoading && !phishingError && phishingResult && (
                    <motion.div key="p-result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <PhishingResult data={phishingResult} />
                    </motion.div>
                  )}
                  {!phishingLoading && !phishingError && !phishingResult && (
                    <motion.div key="p-placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <ResultPlaceholder
                        icon="🎣"
                        title="Link Scanner"
                        description="Paste a URL on the left to check for phishing, malware, and sophisticated scam patterns."
                        tags={['Heuristics', 'WHOIS Data', 'SSL Check', 'AI Analysis']}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* ── Fake Image Tab ── */}
          {activeTab === 'image' && (
            <motion.div
              key="image"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-6 items-start"
            >
              <ImageInput onCheck={handleImageCheck} loading={imageLoading} />

              <div className="flex flex-col gap-4">
                <AnimatePresence mode="wait">
                  {imageLoading && (
                    <motion.div key="i-loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <LoadingCard urlMode={false} />
                    </motion.div>
                  )}
                  {!imageLoading && imageError && (
                    <motion.div
                      key="i-error"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="glass-card p-6 text-center"
                    >
                      <p className="text-3xl mb-3">⚠️</p>
                      <p className="font-heading font-semibold mb-1" style={{ color: 'var(--danger)' }}>Analysis Failed</p>
                      <p className="text-sm" style={{ color: 'var(--text-2)' }}>{imageError}</p>
                    </motion.div>
                  )}
                  {!imageLoading && !imageError && imageResult && (
                    <motion.div key="i-result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
                      <ImageResult data={imageResult} />
                    </motion.div>
                  )}
                  {!imageLoading && !imageError && !imageResult && (
                    <motion.div key="i-placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <ResultPlaceholder
                        icon="🖼️"
                        title="Image Forensics"
                        description="Upload an image to scan for AI generation, EXIF metadata, and manipulation artifacts."
                        tags={['EXIF Data', 'Noise Analysis', 'Groq Vision', 'Pixel Forensics']}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* ── Deepfake Audio Tab ── */}
          {activeTab === 'audio' && (
            <motion.div
              key="audio"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-6 items-start"
            >
              <AudioInput onCheck={handleAudioCheck} loading={audioLoading} />

              <div className="flex flex-col gap-4">
                <AnimatePresence mode="wait">
                  {audioLoading && (
                    <motion.div key="a-loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <LoadingCard urlMode={false} />
                    </motion.div>
                  )}
                  {!audioLoading && audioError && (
                    <motion.div
                      key="a-error"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="glass-card p-6 text-center"
                    >
                      <p className="text-3xl mb-3">⚠️</p>
                      <p className="font-heading font-semibold mb-1" style={{ color: 'var(--danger)' }}>Analysis Failed</p>
                      <p className="text-sm" style={{ color: 'var(--text-2)' }}>{audioError}</p>
                    </motion.div>
                  )}
                  {!audioLoading && !audioError && audioResult && (
                    <motion.div key="a-result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
                      <AudioResult data={audioResult} />
                    </motion.div>
                  )}
                  {!audioLoading && !audioError && !audioResult && (
                    <motion.div key="a-placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <ResultPlaceholder
                        icon="🎙️"
                        title="Deepfake Voice Detector"
                        description="Analyze audio for AI synthesis, robotic artifacts, and scam scripts."
                        tags={['Acoustic Fingerprinting', 'Intent Analysis', 'Whisper Transcribe', 'Spectral Check']}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* History Sidebar */}
      <HistorySidebar
        open={historyOpen}
        history={history}
        onClose={() => setHistoryOpen(false)}
        onClear={clear}
        onReplay={handleReplay}
      />
    </div>
  );
}
