// ============================================
// TruthLens - Frontend Logic
// ============================================

const API_URL = 'http://localhost:5000';

// Get DOM elements
const claimInput = document.getElementById('claimInput');
const verifyBtn = document.getElementById('verifyBtn');
const loading = document.getElementById('loading');
const errorMsg = document.getElementById('errorMsg');
const resultContainer = document.getElementById('resultContainer');

// Fill claim from example buttons
function fillClaim(text) {
    claimInput.value = text;
}

// Verify button click
verifyBtn.addEventListener('click', verifyClaim);

// Also allow Enter key (Ctrl+Enter)
claimInput.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
        verifyClaim();
    }
});

async function verifyClaim() {
    const claim = claimInput.value.trim();

    // Validate input
    if (!claim) {
        showError('Please enter a claim to verify.');
        return;
    }
    if (claim.length < 10) {
        showError('Claim is too short. Please enter at least 10 characters.');
        return;
    }

    // Show loading, hide previous results
    showLoading(true);
    hideError();
    resultContainer.style.display = 'none';

    try {
        const response = await fetch(`${API_URL}/api/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ claim: claim })
        });

        const data = await response.json();

        if (data.success) {
            displayResults(data.data);
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

function displayResults(data) {
    // Verdict
    const verdictEl = document.getElementById('verdict');
    verdictEl.textContent = `Verdict: ${data.verdict}`;
    verdictEl.className = `verdict verdict-${data.verdict}`;

    // Score bar
    const scoreBar = document.getElementById('scoreBar');
    const scoreText = document.getElementById('scoreText');
    scoreBar.style.width = `${data.score}%`;
    scoreText.textContent = `${data.score}/100`;

    // Color the score bar based on verdict
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
                </div>
            `;
        });
        sourcesEl.innerHTML = html;
    } else {
        sourcesEl.innerHTML = '<p>No sources found.</p>';
    }

    // Show results
    resultContainer.style.display = 'block';
}

function showLoading(show) {
    loading.style.display = show ? 'block' : 'none';
    verifyBtn.disabled = show;
    verifyBtn.textContent = show ? '⏳ Verifying...' : '🔍 Verify Claim';
}

function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.style.display = 'block';
}

function hideError() {
    errorMsg.style.display = 'none';
}
