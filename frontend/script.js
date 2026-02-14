// ============================================
// TruthLens - Frontend Logic (v2 with URL support)
// ============================================

const API_URL = 'http://localhost:5000';

// Get DOM elements
const claimInput = document.getElementById('claimInput');
const verifyBtn = document.getElementById('verifyBtn');
const loading = document.getElementById('loading');
const loadingText = document.getElementById('loadingText');
const errorMsg = document.getElementById('errorMsg');
const resultContainer = document.getElementById('resultContainer');
const urlResultContainer = document.getElementById('urlResultContainer');

// Fill claim from example buttons
function fillClaim(text) {
    claimInput.value = text;
}

// Verify button click
verifyBtn.addEventListener('click', verifyClaim);

// Ctrl+Enter to submit
claimInput.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') verifyClaim();
});

// Detect if input looks like a URL
function isUrl(text) {
    return /^(https?:\/\/|www\.)/i.test(text.trim());
}

async function verifyClaim() {
    const claim = claimInput.value.trim();

    if (!claim) {
        showError('Please enter a claim or URL to verify.');
        return;
    }

    // Show loading with appropriate message
    const urlMode = isUrl(claim);
    loadingText.textContent = urlMode
        ? '🌐 Fetching article & analyzing content... This may take 10-15 seconds.'
        : '🔍 Analyzing claim... This may take a few seconds.';

    showLoading(true);
    hideError();
    resultContainer.style.display = 'none';
    urlResultContainer.style.display = 'none';

    try {
        const response = await fetch(`${API_URL}/api/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ claim: claim })
        });

        const data = await response.json();

        if (data.success) {
            if (data.input_type === 'url') {
                displayUrlResults(data.data);
            } else {
                displayTextResults(data.data);
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
// TEXT CLAIM RESULTS (existing)
// ============================================

function displayTextResults(data) {
    // Verdict
    const verdictEl = document.getElementById('verdict');
    verdictEl.textContent = `Verdict: ${data.verdict}`;
    verdictEl.className = `verdict verdict-${data.verdict}`;

    // Score bar
    const scoreBar = document.getElementById('scoreBar');
    const scoreText = document.getElementById('scoreText');
    scoreBar.style.width = `${data.score}%`;
    scoreText.textContent = `${data.score}/100`;

    if (data.verdict === 'REAL') scoreBar.style.background = '#16a34a';
    else if (data.verdict === 'FAKE') scoreBar.style.background = '#dc2626';
    else scoreBar.style.background = '#ca8a04';

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
        sourcesEl.innerHTML = '<p>No sources found.</p>';
    }

    resultContainer.style.display = 'block';
}

// ============================================
// URL ANALYSIS RESULTS (new)
// ============================================

function displayUrlResults(data) {
    // Domain badge
    document.getElementById('domainBadge').textContent = `🌐 ${data.domain}`;

    // Article info
    document.getElementById('articleTitle').textContent = data.article.title;
    document.getElementById('articleAuthor').textContent = `By: ${data.article.author}`;
    document.getElementById('articleDate').textContent = data.article.date !== 'Unknown' ? ` · ${data.article.date}` : '';
    document.getElementById('articleExcerpt').textContent = data.article.excerpt;

    // Verdict
    const urlVerdict = document.getElementById('urlVerdict');
    urlVerdict.textContent = `${getVerdictEmoji(data.verdict)} ${formatVerdict(data.verdict)}`;
    urlVerdict.className = `verdict verdict-url-${data.verdict}`;

    // Score bar
    const scoreBar = document.getElementById('urlScoreBar');
    const scoreText = document.getElementById('urlScoreText');
    scoreBar.style.width = `${data.credibility_score}%`;
    scoreText.textContent = `${data.credibility_score}/100`;

    if (data.verdict === 'MOSTLY_CREDIBLE') scoreBar.style.background = '#16a34a';
    else if (data.verdict === 'NOT_CREDIBLE') scoreBar.style.background = '#dc2626';
    else scoreBar.style.background = '#ca8a04';

    // Bias
    const biasBadge = document.getElementById('biasBadge');
    biasBadge.textContent = capitalizeFirst(data.bias_detected);
    biasBadge.className = `bias-badge bias-${data.bias_detected}`;

    // Analysis details
    const analysisEl = document.getElementById('analysisDetails');
    if (data.analysis) {
        let html = '<h3>📊 Detailed Analysis</h3>';
        if (data.analysis.accuracy) html += `<div class="analysis-item"><strong>📌 Accuracy:</strong> ${data.analysis.accuracy}</div>`;
        if (data.analysis.bias) html += `<div class="analysis-item"><strong>⚖️ Bias:</strong> ${data.analysis.bias}</div>`;
        if (data.analysis.sensationalism) html += `<div class="analysis-item"><strong>📢 Sensationalism:</strong> ${data.analysis.sensationalism}</div>`;
        if (data.analysis.quality) html += `<div class="analysis-item"><strong>✍️ Quality:</strong> ${data.analysis.quality}</div>`;
        analysisEl.innerHTML = html;
    }

    // Red Flags
    const redFlagsEl = document.getElementById('redFlags');
    if (data.red_flags && data.red_flags.length > 0) {
        let html = '<h3>🚩 Red Flags</h3>';
        data.red_flags.forEach(flag => {
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
        data.key_claims.forEach(kc => {
            const emoji = kc.verdict === 'VERIFIED' ? '✅' : kc.verdict === 'FALSE' ? '❌' : '❓';
            const cls = kc.verdict === 'VERIFIED' ? 'verified' : kc.verdict === 'FALSE' ? 'false' : 'unverified';
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
}

// ============================================
// HELPERS
// ============================================

function getVerdictEmoji(verdict) {
    if (verdict === 'MOSTLY_CREDIBLE') return '✅';
    if (verdict === 'NOT_CREDIBLE') return '❌';
    return '⚠️';
}

function formatVerdict(verdict) {
    return verdict.replace(/_/g, ' ');
}

function capitalizeFirst(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function showLoading(show) {
    loading.style.display = show ? 'block' : 'none';
    verifyBtn.disabled = show;
    verifyBtn.textContent = show ? '⏳ Analyzing...' : '🔍 Verify Claim';
}

function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.style.display = 'block';
}

function hideError() {
    errorMsg.style.display = 'none';
}
