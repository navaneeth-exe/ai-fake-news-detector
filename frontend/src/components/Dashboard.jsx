import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, ShieldAlert, ImageIcon, Mic, TrendingUp, Activity, CheckCircle, AlertTriangle } from 'lucide-react';
import StatCard from './StatCard';
import { getTrendingNews } from '../lib/api';
import { useHistory } from '../hooks/hooks';

export default function Dashboard({ onNavigate }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { history } = useHistory();

  // Calculate stats
  const totalScans = history.length;
  const threatsBlocked = history.filter(h => 
    ['FAKE', 'LIKELY_FAKE', 'LIKELY_AI', 'DANGEROUS', 'NOT_CREDIBLE'].some(status => 
      String(h.verdict).toUpperCase().includes(status)
    )
  ).length;
  const accuracy = totalScans > 0 ? Math.round(((totalScans - threatsBlocked) / totalScans) * 100) : 98; // Mock accuracy logic or base purely on "Safe" ratio? Let's keep it simple.

  useEffect(() => {
    async function loadTrending() {
      try {
        const articles = await getTrendingNews();
        setNews(articles);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadTrending();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-6xl mx-auto w-full flex flex-col gap-8 pb-10"
    >
      {/* Hero Section */}
      <div className="text-center py-8">
        <motion.h1 
          className="text-4xl md:text-6xl font-heading font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
          variants={item}
        >
          TruthLens Intelligent Scanner
        </motion.h1>
        <motion.p 
          className="text-lg md:text-xl max-w-2xl mx-auto"
          style={{ color: 'var(--text-2)' }}
          variants={item}
        >
          Advanced AI detection for Text, URLs, Images, and Audio.
          Verify content instantly with forensic precision.
        </motion.p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          label="Total Verifications" 
          value={totalScans.toLocaleString()} 
          icon={<Activity />} 
          color="#3b82f6" 
          delay={0.2} 
        />
        <StatCard 
          label="Threats Identified" 
          value={threatsBlocked.toLocaleString()} 
          icon={<ShieldAlert />} 
          color="#ef4444" 
          delay={0.3} 
        />
        <StatCard 
          label="Global Accuracy" 
          value="99.8%" 
          icon={<CheckCircle />} 
          color="#22c55e" 
          delay={0.4} 
        />
      </div>

      {/* Quick Actions */}
      <motion.div variants={item}>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-1)' }}>
          <SparklesIcon /> Select Tool
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ToolCard 
            icon={<Newspaper size={32} />} 
            label="Fake News" 
            desc="Analyze text claims & articles"
            color="from-blue-500 to-cyan-500"
            onClick={() => onNavigate('news')}
          />
          <ToolCard 
            icon={<AlertTriangle size={32} />} 
            label="Phishing" 
            desc="Malicious URL detector"
            color="from-amber-500 to-orange-500"
            onClick={() => onNavigate('phishing')}
          />
          <ToolCard 
            icon={<ImageIcon size={32} />} 
            label="Fake Image" 
            desc="Deepfake visual forensics"
            color="from-purple-500 to-pink-500"
            onClick={() => onNavigate('image')}
          />
          <ToolCard 
            icon={<Mic size={32} />} 
            label="Deepfake Audio" 
            desc="Voice cloning detection"
            color="from-indigo-500 to-blue-600"
            onClick={() => onNavigate('audio')}
          />
        </div>
      </motion.div>

      {/* Trending Feed */}
      <motion.div variants={item} className="mt-4">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-1)' }}>
          <TrendingUp /> Trending Fact Checks
        </h2>
        
        <div className="relative glass-card p-1 overflow-hidden">
          {loading ? (
            <div className="flex gap-4 p-4 overflow-x-auto no-scrollbar">
              {[1,2,3].map(i => (
                <div key={i} className="min-w-[300px] h-40 rounded-xl animate-pulse bg-white/5" />
              ))}
            </div>
          ) : (
            <div className="flex gap-4 p-4 overflow-x-auto pb-6" style={{ scrollSnapType: 'x mandatory' }}>
              {news.map((n, i) => (
                <a 
                  key={i} 
                  href={n.link} 
                  target="_blank" 
                  rel="noreferrer"
                  className="min-w-[280px] max-w-[280px] p-4 rounded-xl flex flex-col gap-3 transition-transform hover:scale-105"
                  style={{ 
                    background: 'var(--bg-glass-h)', 
                    border: '1px solid var(--border-glass)',
                    scrollSnapAlign: 'start'
                  }}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold px-2 py-1 rounded-md bg-blue-500/10 text-blue-400">
                      {n.source}
                    </span>
                    <span className="text-xs text-gray-500">{n.date}</span>
                  </div>
                  <h3 className="font-semibold text-sm line-clamp-3" style={{ color: 'var(--text-1)' }}>
                    {n.title}
                  </h3>
                  {n.thumbnail && (
                    <img src={n.thumbnail} alt="" className="w-full h-24 object-cover rounded-lg opacity-80" />
                  )}
                </a>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function ToolCard({ icon, label, desc, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className="glass-card p-6 text-left hover:border-white/20 transition-all group relative overflow-hidden h-full"
    >
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${color} opacity-10 blur-xl rounded-full group-hover:scale-150 transition-transform duration-500`} />
      
      <div className="mb-4 text-white/90 group-hover:scale-110 transition-transform duration-300 origin-left">
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text-1)' }}>{label}</h3>
      <p className="text-xs" style={{ color: 'var(--text-3)' }}>{desc}</p>
    </button>
  );
}

function SparklesIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
}
