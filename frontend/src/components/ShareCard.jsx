import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Copy, Share2, Check, Globe, Activity, Shield, Camera, FileText, AlertTriangle } from 'lucide-react';
import html2canvas from 'html2canvas';

// Helper to determine card style based on verdict
const getVerdictStyle = (verdict) => {
  const v = String(verdict || 'UNKNOWN').toUpperCase();
  if (['REAL', 'SAFE', 'Likely Real', 'LIKELY_REAL', 'LIKELY_AUTHENTIC', 'MOSTLY_CREDIBLE'].includes(v)) return { 
    bg: 'linear-gradient(180deg, #022c22 0%, #000000 100%)', 
    accent: '#22c55e', 
    icon: '✅',
    label: 'SAFE'
  };
  if (['FAKE', 'DANGEROUS', 'Likely Fake', 'LIKELY_AI', 'LIKELY_FAKE', 'NOT_CREDIBLE', 'SUSPICIOUS'].includes(v)) return { 
    bg: 'linear-gradient(180deg, #450a0a 0%, #000000 100%)', 
    accent: '#ef4444', 
    icon: '🚨',
    label: 'RISK'
  };
  return { 
    bg: 'linear-gradient(180deg, #422006 0%, #000000 100%)', 
    accent: '#eab308', 
    icon: '⚠️',
    label: 'UNCERTAIN'
  };
};

export default function ShareCard({ isOpen, onClose, data }) {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef(null);

  // Consolidate data for all types
  const verdict = data?.verdict || 'UNCERTAIN';
  const score = Math.round(data?.risk_score || data?.ai_probability || data?.score || data?.credibility_score || 0);
  const type = data?.type || 'Analysis'; 
  const subtype = data?.details || data?.manipulation_type || data?.analysis_type || '';
  const date = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  const explanation = data?.explanation || data?.ai_analysis?.explanation || "AI-powered analysis by TruthLens.";
  
  // Extract signals/breakdown if available
  const signals = data?.signals || data?.red_flags || [];
  // For breakdown, we mock or use real data if passed. 
  // Ideally, parents should pass the 'breakdown' array. 
  // If not, we generate a visual placeholder based on score.
  const breakdown = data?.breakdown || [
    { label: 'AI Probability', score: score, color: score > 50 ? '#ef4444' : '#22c55e' },
    { label: 'Pattern Match', score: Math.round(score * 0.9), color: '#3b82f6' },
  ];

  const style = getVerdictStyle(verdict);

  useEffect(() => {
    if (isOpen && cardRef.current) {
      setLoading(true);
      setImage(null);
      // Wait a moment for the hidden card to render
      setTimeout(async () => {
        try {
          console.log("Starting card generation...");
          const canvas = await html2canvas(cardRef.current, {
            scale: 2, // Retina quality
            backgroundColor: null, // Transparent wrapper
            useCORS: true, 
            logging: false,
            allowTaint: true,
            onclone: (clonedDoc) => {
              const element = clonedDoc.querySelector('[data-share-card]');
              if (element) {
                element.style.position = 'static';
                element.style.left = 'auto';
                element.style.top = 'auto';
                element.style.opacity = '1';
                element.style.transform = 'none';
              }
            }
          });
          setImage(canvas.toDataURL('image/png'));
        } catch (err) {
          console.error("Share gen error:", err);
        } finally {
          setLoading(false);
        }
      }, 800);
    }
  }, [isOpen]);

  const handleDownload = () => {
    if (!image) return;
    const link = document.createElement('a');
    link.href = image;
    link.download = `truthlens-report-${Date.now()}.png`;
    link.click();
  };

  const handleCopy = async () => {
    if (!image) return;
    try {
      const res = await fetch(image);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           onClick={onClose}
           className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
           initial={{ scale: 0.95, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           exit={{ scale: 0.95, opacity: 0 }}
           className="relative bg-[#0f172a] border border-white/10 rounded-2xl p-6 shadow-2xl max-w-[400px] w-full flex flex-col gap-6"
           style={{ maxHeight: '90vh', overflow: 'hidden' }}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-white">Share Analysis</h3>
            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* 1. OFF-SCREEN CAPTURE TARGET (The HD layout) */}
          <div style={{ position: 'fixed', left: '-9999px', top: 0 }}>
             <div
               ref={cardRef}
               data-share-card="true"
               style={{
                 width: '540px', // Fixed width for high quality mobile-like card
                 background: '#030712',
                 backgroundImage: style.bg,
                 padding: '40px',
                 fontFamily: '"Inter", sans-serif',
                 position: 'relative',
                 overflow: 'hidden',
                 display: 'flex',
                 flexDirection: 'column',
                 gap: '32px',
                 color: 'white'
               }}
             >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '24px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ fontSize: '24px' }}>🔍</div>
                      <div>
                        <h1 style={{ fontSize: '20px', fontWeight: '800', lineHeight: 1, letterSpacing: '-0.5px' }}>TruthLens</h1>
                        <p style={{ fontSize: '12px', opacity: 0.5, marginTop: '4px' }}>AI FORENSIC REPORT</p>
                      </div>
                   </div>
                   <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '12px', opacity: 0.5 }}>DATE</div>
                      <div style={{ fontSize: '14px', fontWeight: '600' }}>{date}</div>
                   </div>
                </div>

                {/* Hero Section */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '20px 0' }}>
                   <div style={{ 
                      width: '100px', height: '100px', borderRadius: '50%', 
                      background: `${style.accent}20`, border: `2px solid ${style.accent}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px',
                      boxShadow: `0 0 40px ${style.accent}40`
                   }}>
                      {style.icon}
                   </div>
                   
                   <div style={{ textAlign: 'center' }}>
                      <h2 style={{ fontSize: '48px', fontWeight: '900', color: style.accent, lineHeight: 1, margin: 0 }}>
                         {verdict.toUpperCase().replace('LIKELY_', '')}
                      </h2>
                      <p style={{ fontSize: '16px', opacity: 0.7, marginTop: '8px', textTransform: 'uppercase', letterSpacing: '2px' }}>
                         {style.label} LEVEL
                      </p>
                   </div>

                   <div style={{ 
                      background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '12px 24px',
                      display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid rgba(255,255,255,0.1)'
                   }}>
                      <span style={{ fontSize: '14px', opacity: 0.7 }}>CONFIDENCE SCORE</span>
                      <span style={{ fontSize: '24px', fontWeight: 'bold' }}>{score}/100</span>
                   </div>
                </div>

                {/* Visual Breakdown */}
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                   <h3 style={{ fontSize: '12px', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                      DETECTION LAYERS
                   </h3>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {breakdown.slice(0, 3).map((item, i) => (
                         <div key={i}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                               <span>{item.label}</span>
                               <span style={{ color: item.color, fontWeight: 'bold' }}>{item.score}%</span>
                            </div>
                            <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                               <div style={{ width: `${item.score}%`, background: item.color, height: '100%' }} />
                            </div>
                         </div>
                      ))}
                   </div>
                </div>

                {/* Analysis/Details */}
                <div>
                   <h3 style={{ fontSize: '12px', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                      ANALYSIS SUMMARY
                   </h3>
                   <p style={{ fontSize: '14px', lineHeight: '1.6', opacity: 0.9 }}>
                      {explanation.length > 180 ? explanation.slice(0, 180) + '...' : explanation}
                   </p>
                </div>

                {/* Signals */}
                {signals.length > 0 && (
                   <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {signals.slice(0, 4).map((s, i) => (
                         <span key={i} style={{ 
                            fontSize: '11px', padding: '6px 10px', borderRadius: '6px', 
                            background: `${style.accent}15`, color: style.accent, 
                            border: `1px solid ${style.accent}30`
                         }}>
                            {s}
                         </span>
                      ))}
                   </div>
                )}

                {/* Footer */}
                <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: 0.4 }}>
                   <div style={{ fontSize: '16px' }}>🛡️</div>
                   <span style={{ fontSize: '12px', letterSpacing: '1px', fontWeight: '600' }}>VERIFIED BY TRUTHLENS AI</span>
                </div>
             </div>
          </div>

          {/* 2. PREVIEW AREA */}
          <div className="w-full bg-gray-900/50 rounded-xl overflow-y-auto custom-scrollbar flex items-start justify-center border border-white/5 relative" style={{ height: '400px' }}>
            {loading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                 <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                 <span className="text-xs text-gray-400 animate-pulse">Scanning & Generating Report...</span>
              </div>
            ) : image ? (
              <img src={image} alt="Report Card" className="w-full h-auto object-contain" style={{ maxWidth: '100%' }} />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-red-400 text-xs">
                 Generation Failed
              </div>
            )}
          </div>

          {/* 3. ACTIONS */}
          <div className="flex gap-3">
             <button
               onClick={handleDownload}
               disabled={loading || !image}
               className="flex-1 bg-white text-black py-3 rounded-xl font-bold text-sm hover:bg-gray-100 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors shadow-lg shadow-white/10"
             >
               <Download size={18} />
               Save Report
             </button>
             <button
               onClick={handleCopy}
               disabled={loading || !image}
               className="px-4 bg-white/5 text-white border border-white/10 rounded-xl hover:bg-white/10 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
             >
               {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
             </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
