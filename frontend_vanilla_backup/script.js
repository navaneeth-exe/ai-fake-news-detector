// ============================================
// TruthLens v3 — Glassmorphism UI with all features
// ============================================

const API_URL = 'http://localhost:5000';

// ============================================
// DOM ELEMENTS
// ============================================
const claimInput = document.getElementById('claimInput');
const verifyBtn = document.getElementById('verifyBtn');
const loading = document.getElementById('loading');
const loadingText = document.getElementById('loadingText');
const errorMsg = document.getElementById('errorMsg');
const resultContainer = document.getElementById('resultContainer');
const urlResultContainer = document.getElementById('urlResultContainer');
const emptyState = document.getElementById('emptyState');
const themeToggle = document.getElementById('themeToggle');
const historyToggle = document.getElementById('historyToggle');
const historyPanel = document.getElementById('historyPanel');
const historyOverlay = document.getElementById('historyOverlay');
const historyList = document.getElementById('historyList');
const historyBadge = document.getElementById('historyBadge');

// ============================================
// PARTICLE BACKGROUND ENGINE
// ============================================
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: -1000, y: -1000 };
        this.particleCount = 80;
        this.connectionDistance = 120;
        this.mouseRadius = 100;
        this.animationId = null;
        this.lastFrame = 0;
        this.frameInterval = 1000 / 30; // Target ~30fps for performance

        this.resize();
        this.init();
        this.bindEvents();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 1.4,
                vy: (Math.random() - 0.5) * 1.4,
                radius: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2,
            });
        }
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            this.resize();
        });

        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        document.addEventListener('mouseleave', () => {
            this.mouse.x = -1000;
            this.mouse.y = -1000;
        });
    }

    getColors() {
        const theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'light') {
            return {
                particle: 'rgba(79, 70, 229,',
                line: 'rgba(79, 70, 229,',
            };
        }
        return {
            particle: 'rgba(255, 255, 255,',
            line: 'rgba(99, 102, 241,',
        };
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());

        // Frame throttling — target ~30fps for performance
        const now = performance.now();
        if (now - this.lastFrame < this.frameInterval) return;
        this.lastFrame = now;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const colors = this.getColors();

        this.particles.forEach((p) => {
            // Mouse repulsion
            const dx = p.x - this.mouse.x;
            const dy = p.y - this.mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < this.mouseRadius) {
                const force = (this.mouseRadius - dist) / this.mouseRadius;
                p.vx += (dx / dist) * force * 0.4;
                p.vy += (dy / dist) * force * 0.4;
            }

            // Damping
            p.vx *= 0.99;
            p.vy *= 0.99;

            // Move
            p.x += p.vx;
            p.y += p.vy;

            // Bounce off edges
            if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

            // Keep in bounds
            p.x = Math.max(0, Math.min(this.canvas.width, p.x));
            p.y = Math.max(0, Math.min(this.canvas.height, p.y));

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `${colors.particle} ${p.opacity})`;
            this.ctx.fill();
        });

        // Draw connections
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const a = this.particles[i];
                const b = this.particles[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < this.connectionDistance) {
                    const opacity = (1 - dist / this.connectionDistance) * 0.15;
                    this.ctx.beginPath();
                    this.ctx.moveTo(a.x, a.y);
                    this.ctx.lineTo(b.x, b.y);
                    this.ctx.strokeStyle = `${colors.line} ${opacity})`;
                    this.ctx.lineWidth = 0.8;
                    this.ctx.stroke();
                }
            }
        }

    }
}

// Initialize particle system
const particleCanvas = document.getElementById('particleCanvas');
const particleSystem = new ParticleSystem(particleCanvas);

// ============================================
// THEME TOGGLE
// ============================================
function initTheme() {
    const saved = localStorage.getItem('truthlens-theme');
    if (saved) {
        document.documentElement.setAttribute('data-theme', saved);
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
        document.documentElement.setAttribute('data-theme', 'light');
    }
    updateThemeMeta();
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('truthlens-theme', next);
    updateThemeMeta();
}

function updateThemeMeta() {
    const theme = document.documentElement.getAttribute('data-theme');
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
        meta.content = theme === 'dark' ? '#0a0a1a' : '#f0f2f5';
    }
}

themeToggle.addEventListener('click', toggleTheme);
initTheme();

// ============================================
// FILL CLAIM FROM EXAMPLE
// ============================================
function fillClaim(text) {
    claimInput.value = text;
    claimInput.focus();
}

// ============================================
// VERIFY CLAIM
// ============================================
verifyBtn.addEventListener('click', verifyClaim);

claimInput.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') verifyClaim();
});

function isUrl(text) {
    return /^(https?:\/\/|www\.)/i.test(text.trim());
}

async function verifyClaim() {
    const claim = claimInput.value.trim();

    if (!claim) {
        showError('Please enter a claim or URL to verify.');
        return;
    }

    const urlMode = isUrl(claim);
    loadingText.textContent = urlMode
        ? '🌐 Fetching article & analyzing content... This may take 10-15 seconds.'
        : '🔍 Analyzing claim... This may take a few seconds.';

    showLoading(true);
    hideError();
    emptyState.style.display = 'none';
    resultContainer.style.display = 'none';
    urlResultContainer.style.display = 'none';

    try {
        const response = await fetch(`${API_URL}/api/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ claim }),
        });

        const data = await response.json();

        if (data.success) {
            if (data.input_type === 'url') {
                displayUrlResults(data.data);
                saveToHistory(claim, data.data, 'url');
            } else {
                displayTextResults(data.data);
                saveToHistory(claim, data.data, 'text');
            }
        } else {
            showError(data.error || 'Verification failed. Please try again.');
        }
    } catch (err) {
        showError('Could not connect to server. Make sure the backend is running.');
        console.error('Error:', err);
    } finally {
        showLoading(false);
    }
}

// ============================================
// TEXT CLAIM RESULTS
// ============================================
function displayTextResults(data) {
    // Verdict
    const verdictEl = document.getElementById('verdict');
    verdictEl.textContent = `Verdict: ${data.verdict}`;
    verdictEl.className = `verdict-badge verdict-${data.verdict}`;

    // Score ring
    animateScoreRing('scoreRing', 'scoreValue', data.score, data.verdict);

    // Explanation
    document.getElementById('explanation').textContent = data.explanation || '';

    // Context
    const contextEl = document.getElementById('context');
    if (data.verified_context) {
        contextEl.textContent = data.verified_context;
        contextEl.style.display = 'block';
    } else {
        contextEl.style.display = 'none';
    }

    // Sources
    const sourcesEl = document.getElementById('sources');
    if (data.sources && data.sources.length > 0) {
        let html = '<h3>📰 Sources</h3>';
        data.sources.forEach((source, i) => {
            html += `
                <div class="source-item">
                    <a href="${source.link}" target="_blank">${i + 1}. ${source.title}</a>
                    <p class="snippet">${source.snippet || ''}</p>
                </div>`;
        });
        sourcesEl.innerHTML = html;
    } else {
        sourcesEl.innerHTML = '<p style="color:var(--text-muted);">No sources found.</p>';
    }

    resultContainer.style.display = 'block';
    // Store last result for sharing
    window._lastResult = { type: 'text', data };
    // Trigger scroll-reveal for result children
    applyScrollReveal(resultContainer);
}

// ============================================
// URL ANALYSIS RESULTS
// ============================================
function displayUrlResults(data) {
    // Domain badge
    document.getElementById('domainBadge').textContent = `🌐 ${data.domain}`;

    // Article info
    document.getElementById('articleTitle').textContent = data.article.title;
    document.getElementById('articleAuthor').textContent = `By: ${data.article.author}`;
    document.getElementById('articleDate').textContent =
        data.article.date !== 'Unknown' ? ` · ${data.article.date}` : '';
    document.getElementById('articleExcerpt').textContent = data.article.excerpt;

    // Verdict
    const urlVerdict = document.getElementById('urlVerdict');
    urlVerdict.textContent = `${getVerdictEmoji(data.verdict)} ${formatVerdict(data.verdict)}`;
    urlVerdict.className = `verdict-badge verdict-url-${data.verdict}`;

    // Score ring
    animateScoreRing('urlScoreRing', 'urlScoreValue', data.credibility_score, data.verdict);

    // Bias
    const biasBadge = document.getElementById('biasBadge');
    biasBadge.textContent = capitalizeFirst(data.bias_detected);
    biasBadge.className = `bias-badge bias-${data.bias_detected}`;

    // Analysis details
    const analysisEl = document.getElementById('analysisDetails');
    if (data.analysis) {
        let html = '<h3>📊 Detailed Analysis</h3>';
        if (data.analysis.accuracy)
            html += `<div class="analysis-item"><strong>📌 Accuracy:</strong> ${data.analysis.accuracy}</div>`;
        if (data.analysis.bias)
            html += `<div class="analysis-item"><strong>⚖️ Bias:</strong> ${data.analysis.bias}</div>`;
        if (data.analysis.sensationalism)
            html += `<div class="analysis-item"><strong>📢 Sensationalism:</strong> ${data.analysis.sensationalism}</div>`;
        if (data.analysis.quality)
            html += `<div class="analysis-item"><strong>✍️ Quality:</strong> ${data.analysis.quality}</div>`;
        analysisEl.innerHTML = html;
    }

    // Red Flags
    const redFlagsEl = document.getElementById('redFlags');
    if (data.red_flags && data.red_flags.length > 0) {
        let html = '<h3>🚩 Red Flags</h3>';
        data.red_flags.forEach((flag) => {
            html += `<div class="red-flag-item">⚠️ ${flag}</div>`;
        });
        redFlagsEl.innerHTML = html;
        redFlagsEl.style.display = 'block';
    } else {
        redFlagsEl.style.display = 'none';
    }

    // Key Claims
    const keyClaimsEl = document.getElementById('keyClaims');
    if (data.key_claims && data.key_claims.length > 0) {
        let html = '<h3>🔎 Key Claims Verified</h3>';
        data.key_claims.forEach((kc) => {
            const emoji =
                kc.verdict === 'VERIFIED' ? '✅' : kc.verdict === 'FALSE' ? '❌' : '❓';
            const cls =
                kc.verdict === 'VERIFIED' ? 'verified' : kc.verdict === 'FALSE' ? 'false' : 'unverified';
            html += `
                <div class="claim-card claim-${cls}">
                    <div class="claim-text">${emoji} ${kc.claim}</div>
                    <span class="claim-verdict">${kc.verdict}</span>
                </div>`;
        });
        keyClaimsEl.innerHTML = html;
    } else {
        keyClaimsEl.innerHTML = '';
    }

    urlResultContainer.style.display = 'block';
    // Store last result for sharing
    window._lastResult = { type: 'url', data };
    // Trigger scroll-reveal for result children
    applyScrollReveal(urlResultContainer);
}

// ============================================
// ANIMATED SCORE RING
// ============================================
function animateScoreRing(ringId, valueId, score, verdict) {
    const ring = document.getElementById(ringId);
    const valueEl = document.getElementById(valueId);
    const circumference = 2 * Math.PI * 45; // r=45

    // Set color based on verdict
    let color;
    if (['REAL', 'MOSTLY_CREDIBLE'].includes(verdict)) {
        color = 'var(--success)';
    } else if (['FAKE', 'NOT_CREDIBLE'].includes(verdict)) {
        color = 'var(--danger)';
    } else {
        color = 'var(--warning)';
    }
    ring.style.stroke = color;

    // Reset and animate
    ring.style.transition = 'none';
    ring.style.strokeDashoffset = circumference;

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            ring.style.transition = 'stroke-dashoffset 1.5s ease-out';
            ring.style.strokeDashoffset = circumference - (score / 100) * circumference;
        });
    });

    // Animate number count
    let current = 0;
    const duration = 1500;
    const start = performance.now();
    function countUp(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        current = Math.round(progress * score);
        valueEl.textContent = current;
        if (progress < 1) {
            requestAnimationFrame(countUp);
        }
    }
    requestAnimationFrame(countUp);
}

// ============================================
// ANALYSIS HISTORY
// ============================================
const MAX_HISTORY = 20;

function getHistory() {
    try {
        return JSON.parse(localStorage.getItem('truthlens-history') || '[]');
    } catch {
        return [];
    }
}

function saveToHistory(input, result, type) {
    const history = getHistory();
    const entry = {
        id: Date.now(),
        input: input.substring(0, 120),
        type,
        verdict: type === 'url' ? result.verdict : result.verdict,
        score: type === 'url' ? result.credibility_score : result.score,
        timestamp: new Date().toISOString(),
        result,
    };

    history.unshift(entry);
    if (history.length > MAX_HISTORY) history.pop();

    localStorage.setItem('truthlens-history', JSON.stringify(history));
    renderHistory();
}

function renderHistory() {
    const history = getHistory();

    // Update badge
    if (history.length > 0) {
        historyBadge.textContent = history.length;
        historyBadge.style.display = 'flex';
    } else {
        historyBadge.style.display = 'none';
    }

    if (history.length === 0) {
        historyList.innerHTML = '<p class="history-empty">No analyses yet. Start verifying claims!</p>';
        return;
    }

    let html = '';
    history.forEach((entry) => {
        const time = new Date(entry.timestamp).toLocaleString(undefined, {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });

        let verdictClass = '';
        if (['REAL', 'MOSTLY_CREDIBLE'].includes(entry.verdict)) {
            verdictClass = 'background:var(--success-bg);color:var(--success);';
        } else if (['FAKE', 'NOT_CREDIBLE'].includes(entry.verdict)) {
            verdictClass = 'background:var(--danger-bg);color:var(--danger);';
        } else {
            verdictClass = 'background:var(--warning-bg);color:var(--warning);';
        }

        const emoji = entry.type === 'url' ? '🔗' : '📝';

        html += `
            <div class="history-item" onclick="replayHistory(${entry.id})">
                <div class="history-item-header">
                    <span class="history-item-verdict" style="${verdictClass}">
                        ${formatVerdict(entry.verdict)}
                    </span>
                    <span class="history-item-time">${time}</span>
                </div>
                <div class="history-item-text">${emoji} ${entry.input}</div>
            </div>`;
    });

    historyList.innerHTML = html;
}

function replayHistory(id) {
    const history = getHistory();
    const entry = history.find((h) => h.id === id);
    if (!entry) return;

    claimInput.value = entry.input;
    emptyState.style.display = 'none';
    resultContainer.style.display = 'none';
    urlResultContainer.style.display = 'none';

    if (entry.type === 'url') {
        displayUrlResults(entry.result);
    } else {
        displayTextResults(entry.result);
    }

    toggleHistory(); // close sidebar
}

function toggleHistory() {
    const isOpen = historyPanel.classList.contains('open');
    historyPanel.classList.toggle('open');
    historyOverlay.classList.toggle('active');
    document.body.style.overflow = isOpen ? '' : 'hidden';
}

function clearHistory() {
    if (!confirm('Clear all analysis history?')) return;
    localStorage.removeItem('truthlens-history');
    renderHistory();
}

historyToggle.addEventListener('click', toggleHistory);

// Initialize history on load
renderHistory();

// ============================================
// SHARE RESULTS
// ============================================
function shareResults(type) {
    const result = window._lastResult;
    if (!result) return;

    let text = '';
    if (result.type === 'text') {
        const d = result.data;
        text = `🔍 TruthLens Fact-Check Results\n`;
        text += `━━━━━━━━━━━━━━━━━━━━━━\n`;
        text += `📋 Claim: "${claimInput.value}"\n`;
        text += `🏷️ Verdict: ${d.verdict}\n`;
        text += `📊 Truth Score: ${d.score}/100\n`;
        text += `\n💬 ${d.explanation || ''}\n`;
        text += `━━━━━━━━━━━━━━━━━━━━━━\n`;
        text += `Powered by TruthLens AI`;
    } else {
        const d = result.data;
        text = `🔍 TruthLens URL Analysis\n`;
        text += `━━━━━━━━━━━━━━━━━━━━━━\n`;
        text += `🔗 URL: ${claimInput.value}\n`;
        text += `📰 ${d.article?.title || ''}\n`;
        text += `🏷️ Verdict: ${formatVerdict(d.verdict)}\n`;
        text += `📊 Credibility: ${d.credibility_score}/100\n`;
        text += `⚖️ Bias: ${capitalizeFirst(d.bias_detected)}\n`;
        text += `━━━━━━━━━━━━━━━━━━━━━━\n`;
        text += `Powered by TruthLens AI`;
    }

    document.getElementById('shareText').value = text;
    document.getElementById('shareModal').style.display = 'flex';

    // Show native share button if supported
    if (navigator.share) {
        document.getElementById('nativeShareBtn').style.display = 'block';
    }
}

function closeShareModal() {
    document.getElementById('shareModal').style.display = 'none';
    document.getElementById('copyToast').style.display = 'none';
}

async function copyToClipboard() {
    const text = document.getElementById('shareText').value;
    try {
        await navigator.clipboard.writeText(text);
        const toast = document.getElementById('copyToast');
        toast.style.display = 'block';
        setTimeout(() => {
            toast.style.display = 'none';
        }, 2000);
    } catch (err) {
        // Fallback
        document.getElementById('shareText').select();
        document.execCommand('copy');
    }
}

async function nativeShare() {
    const text = document.getElementById('shareText').value;
    try {
        await navigator.share({ title: 'TruthLens Results', text });
        closeShareModal();
    } catch (err) {
        // User cancelled or not supported
    }
}

// Close modal on overlay click
document.getElementById('shareModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeShareModal();
});

// ============================================
// HELPERS
// ============================================

// ============================================
// INTERSECTION OBSERVER FOR SCROLL ANIMATIONS
// ============================================
const scrollRevealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                scrollRevealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

// Observe initial page elements
document.querySelectorAll('.animate-in').forEach((el) => {
    scrollRevealObserver.observe(el);
});

/**
 * Apply scroll-reveal classes to children of a result container,
 * then observe them with IntersectionObserver for staggered entrance.
 */
function applyScrollReveal(container) {
    const children = container.querySelectorAll(
        '.verdict-badge, .score-ring-section, .detail-section, .sources-section, '
        + '.article-meta-card, .bias-section, .red-flags-card, .key-claims-section, .share-btn'
    );
    children.forEach((el, i) => {
        el.classList.remove('scroll-reveal', 'revealed',
            'sr-delay-1', 'sr-delay-2', 'sr-delay-3', 'sr-delay-4', 'sr-delay-5');
        el.classList.add('scroll-reveal', `sr-delay-${Math.min(i + 1, 5)}`);
        scrollRevealObserver.observe(el);
    });
}
function getVerdictEmoji(verdict) {
    if (verdict === 'MOSTLY_CREDIBLE') return '✅';
    if (verdict === 'NOT_CREDIBLE') return '❌';
    return '⚠️';
}

function formatVerdict(verdict) {
    return (verdict || '').replace(/_/g, ' ');
}

function capitalizeFirst(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function showLoading(show) {
    loading.style.display = show ? 'block' : 'none';
    verifyBtn.disabled = show;
    const btnText = verifyBtn.querySelector('.btn-text');
    const btnLoading = verifyBtn.querySelector('.btn-loading');
    if (show) {
        btnText.style.display = 'none';
        btnLoading.style.display = 'flex';
    } else {
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
    }
}

function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.style.display = 'block';
    emptyState.style.display = 'none';
}

function hideError() {
    errorMsg.style.display = 'none';
}
