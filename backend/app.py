# ============================================
# TruthLens - AI Fake News Detector
# Backend API Server (Groq + URL Analysis)
# ============================================

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from dotenv import load_dotenv
import os
import json
import re
import pathlib
from datetime import datetime
from urllib.parse import urlparse
from groq import Groq
from bs4 import BeautifulSoup
import requests as http_requests

# Load environment variables from the backend/.env file
env_path = pathlib.Path(__file__).resolve().parent / '.env'
load_dotenv(dotenv_path=str(env_path))

# Initialize Flask app
app = Flask(__name__, static_folder='../frontend/dist', static_url_path='/')
CORS(app)  # For production, replace with: CORS(app, origins=["https://your-domain.com"])

# Setup Rate Limiting
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://"
)

# ---- API KEYS ----
GROQ_KEY = os.getenv('GROQ_API_KEY', '').strip()
SERPAPI_KEY = os.getenv('SERPAPI_KEY', '').strip()

print(f"GROQ_KEY loaded: {'Yes (' + GROQ_KEY[:8] + '...)' if GROQ_KEY else 'No'}")
print(f"SERPAPI_KEY loaded: {'Yes (' + SERPAPI_KEY[:8] + '...)' if SERPAPI_KEY else 'No'}")


# ============================================
# GROQ CLIENT
# ============================================

def get_groq_client():
    """Get a Groq client instance."""
    key = os.getenv('GROQ_API_KEY', '').strip()
    if not key:
        return None
    return Groq(api_key=key)


def ask_groq(prompt):
    """Send a prompt to Groq and return the response text."""
    client = get_groq_client()
    if not client:
        return None
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
        max_tokens=2048
    )
    return response.choices[0].message.content.strip()


# ============================================
# URL DETECTION & SCRAPING
# ============================================

def is_valid_url(text):
    """Check if the input text is a valid URL."""
    text = text.strip()
    # Add http:// if it starts with www.
    if text.startswith('www.'):
        text = 'http://' + text
    try:
        result = urlparse(text)
        return all([result.scheme in ('http', 'https'), result.netloc])
    except:
        return False


def fetch_article_content(url):
    """
    Scrape an article URL and extract its content.
    Returns dict with title, author, date, text, domain, excerpt.
    """
    print(f"🌐 Fetching article from: {url}")

    # Add http:// if missing
    if not url.startswith(('http://', 'https://')):
        url = 'https://' + url

    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
        response = http_requests.get(url, headers=headers, timeout=15, allow_redirects=True)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, 'lxml')

        # Extract domain
        domain = urlparse(url).netloc.replace('www.', '')

        # Extract title
        title = ''
        if soup.find('h1'):
            title = soup.find('h1').get_text(strip=True)
        elif soup.title:
            title = soup.title.get_text(strip=True)

        # Extract author
        author = ''
        author_meta = soup.find('meta', attrs={'name': 'author'})
        if author_meta:
            author = author_meta.get('content', '')
        if not author:
            author_tag = soup.find(class_=re.compile(r'author', re.I))
            if author_tag:
                author = author_tag.get_text(strip=True)

        # Extract date
        date = ''
        date_meta = soup.find('meta', attrs={'property': 'article:published_time'})
        if date_meta:
            date = date_meta.get('content', '')[:10]
        if not date:
            time_tag = soup.find('time')
            if time_tag:
                date = time_tag.get('datetime', time_tag.get_text(strip=True))[:10]

        # Extract article text
        article_text = ''
        # Try common article containers
        for selector in ['article', '[role="main"]', '.article-body', '.story-body',
                         '.post-content', '.entry-content', '.article-content', 'main']:
            container = soup.find(selector)
            if container:
                paragraphs = container.find_all('p')
                article_text = ' '.join([p.get_text(strip=True) for p in paragraphs])
                break

        # Fallback: grab all paragraphs
        if not article_text or len(article_text) < 100:
            paragraphs = soup.find_all('p')
            article_text = ' '.join([p.get_text(strip=True) for p in paragraphs])

        # Clean up text
        article_text = re.sub(r'\s+', ' ', article_text).strip()

        # Limit text length for AI processing
        if len(article_text) > 3000:
            article_text = article_text[:3000] + '...'

        excerpt = article_text[:200] + '...' if len(article_text) > 200 else article_text

        print(f"📄 Scraped: {title[:60]}... ({len(article_text)} chars)")

        return {
            'success': True,
            'url': url,
            'domain': domain,
            'title': title or 'Title not found',
            'author': author or 'Unknown',
            'date': date or 'Unknown',
            'text': article_text,
            'excerpt': excerpt
        }

    except http_requests.exceptions.Timeout:
        print(f"❌ Timeout fetching {url}")
        return {'success': False, 'error': 'Request timed out. The website took too long to respond.'}
    except http_requests.exceptions.HTTPError as e:
        status = e.response.status_code if e.response else 'Unknown'
        print(f"❌ HTTP error {status} for {url}")
        if status == 403:
            return {'success': False, 'error': 'Access denied. This website blocks automated access.'}
        elif status == 404:
            return {'success': False, 'error': 'Page not found. Check the URL and try again.'}
        return {'success': False, 'error': f'HTTP error {status} when fetching the article.'}
    except Exception as e:
        print(f"❌ Scrape error: {e}")
        return {'success': False, 'error': f'Could not fetch article: {str(e)}'}


# ============================================
# URL CREDIBILITY ANALYSIS
# ============================================

def analyze_url_credibility(url, content_data):
    """
    Use Groq AI to analyze an article's credibility.
    Returns credibility score, verdict, bias, analysis, red flags.
    """
    print(f"🔎 Analyzing credibility for: {content_data['domain']}")

    try:
        prompt = f"""You are an expert media literacy analyst. Analyze this article for credibility.

URL: {url}
DOMAIN: {content_data['domain']}
TITLE: {content_data['title']}
AUTHOR: {content_data['author']}
DATE: {content_data['date']}
CONTENT: {content_data['text'][:2000]}

Analyze for:
1. Factual accuracy — are claims verifiable and supported?
2. Bias — political, commercial, sensationalism
3. Source quality — citations, author credentials, editorial standards
4. Red flags — clickbait headline, unverified claims, logical fallacies, emotional manipulation

Return ONLY valid JSON (no markdown, no code blocks):
{{
  "credibility_score": <number 0-100>,
  "verdict": "MOSTLY_CREDIBLE" or "QUESTIONABLE" or "NOT_CREDIBLE",
  "bias_detected": "neutral" or "left" or "right" or "commercial" or "sensationalist",
  "analysis": {{
    "accuracy": "<factual accuracy assessment in 1-2 sentences>",
    "bias": "<bias analysis in 1-2 sentences>",
    "sensationalism": "<sensationalism check in 1-2 sentences>",
    "quality": "<writing quality assessment in 1-2 sentences>"
  }},
  "red_flags": ["flag1", "flag2"]
}}

Rules:
- credibility_score: 0-30 = NOT_CREDIBLE, 31-69 = QUESTIONABLE, 70-100 = MOSTLY_CREDIBLE
- red_flags should be empty array [] if none found
- Be objective and evidence-based"""

        raw_text = ask_groq(prompt)
        if not raw_text:
            return _default_url_analysis('Groq API key not configured.')

        # Clean markdown blocks
        raw_text = re.sub(r'^```json\s*', '', raw_text)
        raw_text = re.sub(r'^```\s*', '', raw_text)
        raw_text = re.sub(r'\s*```$', '', raw_text)
        raw_text = raw_text.strip()

        result = json.loads(raw_text)

        # Validate fields
        result.setdefault('credibility_score', 50)
        result.setdefault('verdict', 'QUESTIONABLE')
        result.setdefault('bias_detected', 'neutral')
        result.setdefault('analysis', {})
        result.setdefault('red_flags', [])

        result['credibility_score'] = max(0, min(100, int(result['credibility_score'])))

        valid_verdicts = ['MOSTLY_CREDIBLE', 'QUESTIONABLE', 'NOT_CREDIBLE']
        if result['verdict'] not in valid_verdicts:
            result['verdict'] = 'QUESTIONABLE'

        print(f"✅ Credibility: {result['verdict']} (score: {result['credibility_score']})")
        return result

    except json.JSONDecodeError:
        print(f"❌ JSON parse error in credibility analysis")
        return _default_url_analysis('Response format was unexpected.')
    except Exception as e:
        print(f"❌ Credibility analysis error: {e}")
        return _default_url_analysis(str(e))


def _default_url_analysis(reason):
    """Return default URL analysis when something fails."""
    return {
        'credibility_score': 50,
        'verdict': 'QUESTIONABLE',
        'bias_detected': 'unknown',
        'analysis': {
            'accuracy': f'Could not fully analyze: {reason}',
            'bias': 'Unable to determine.',
            'sensationalism': 'Unable to determine.',
            'quality': 'Unable to determine.'
        },
        'red_flags': []
    }


def extract_and_verify_claims(article_text, content_data):
    """
    Extract key factual claims from article and verify each one.
    Returns list of {claim, verdict, sources}.
    """
    print(f"📋 Extracting key claims from article...")

    try:
        # Step 1: Extract claims using Groq
        prompt = f"""From this article, extract the 2-3 most important FACTUAL claims that can be verified.
Do NOT include opinions. Only include specific, checkable facts.

ARTICLE TITLE: {content_data['title']}
ARTICLE TEXT: {article_text[:2000]}

Return ONLY a JSON array of claim strings (no markdown):
["claim 1", "claim 2", "claim 3"]"""

        raw_text = ask_groq(prompt)
        if not raw_text:
            return []

        raw_text = re.sub(r'^```json\s*', '', raw_text)
        raw_text = re.sub(r'^```\s*', '', raw_text)
        raw_text = re.sub(r'\s*```$', '', raw_text)
        claims = json.loads(raw_text.strip())

        if not isinstance(claims, list):
            return []

        print(f"📝 Found {len(claims)} key claims to verify")

        # Step 2: Verify each claim
        verified_claims = []
        for claim_text in claims[:3]:  # Max 3 claims
            # Search for evidence
            keywords = claim_text.split()[:5]
            sources = search_evidence(keywords)

            # Analyze this specific claim
            analysis = analyze_single_claim(claim_text, sources)

            verified_claims.append({
                'claim': claim_text,
                'verdict': analysis.get('verdict', 'UNVERIFIED'),
                'sources': sources[:2]  # Top 2 sources per claim
            })

        return verified_claims

    except Exception as e:
        print(f"❌ Claim extraction error: {e}")
        return []


def analyze_single_claim(claim, evidence):
    """Analyze a single claim against evidence. Returns {verdict}."""
    try:
        evidence_text = ""
        if evidence:
            for i, item in enumerate(evidence[:3], 1):
                evidence_text += f"\n{i}. {item['title']}: {item['snippet']}"
        else:
            evidence_text = "\nNo evidence found."

        prompt = f"""Is this claim true or false based on the evidence?

CLAIM: {claim}
EVIDENCE:{evidence_text}

Return ONLY valid JSON:
{{"verdict": "VERIFIED" or "UNVERIFIED" or "FALSE"}}"""

        raw = ask_groq(prompt)
        if not raw:
            return {'verdict': 'UNVERIFIED'}

        raw = re.sub(r'^```json\s*', '', raw)
        raw = re.sub(r'^```\s*', '', raw)
        raw = re.sub(r'\s*```$', '', raw)
        return json.loads(raw.strip())

    except:
        return {'verdict': 'UNVERIFIED'}


# ============================================
# TEXT CLAIM HELPERS (unchanged)
# ============================================

def extract_keywords(claim):
    """Use Groq to extract searchable keywords from the claim."""
    try:
        prompt = f"""Extract 3-5 concise, searchable keywords from this claim for fact-checking.
Return ONLY the keywords separated by commas, nothing else.

Claim: {claim}

Keywords:"""
        result = ask_groq(prompt)
        if not result:
            return claim.split()[:5]
        keywords = [k.strip() for k in result.split(',') if k.strip()]
        print(f"📝 Keywords: {keywords}")
        return keywords
    except Exception as e:
        print(f"❌ Keyword extraction error: {e}")
        return claim.split()[:5]


def search_evidence(keywords):
    """Search for news articles using SerpAPI."""
    key = os.getenv('SERPAPI_KEY', '').strip()
    if not key:
        print("⚠️  SerpAPI key not set, skipping search")
        return []
    try:
        query = ' '.join(keywords)
        params = {
            'api_key': key,
            'engine': 'google',
            'q': query,
            'tbm': 'nws',
            'num': 5
        }
        response = http_requests.get('https://serpapi.com/search', params=params, timeout=15)
        data = response.json()

        results = []
        for item in data.get('news_results', [])[:5]:
            results.append({
                'title': item.get('title', 'No title'),
                'snippet': item.get('snippet', ''),
                'link': item.get('link', '#')
            })
        if not results:
            for item in data.get('organic_results', [])[:5]:
                results.append({
                    'title': item.get('title', 'No title'),
                    'snippet': item.get('snippet', ''),
                    'link': item.get('link', '#')
                })
        print(f"🔍 Found {len(results)} search results")
        return results
    except Exception as e:
        print(f"❌ Search error: {e}")
        return []


def analyze_claim(claim, evidence):
    """Use Groq to analyze a text claim against evidence."""
    try:
        evidence_text = ""
        if evidence:
            for i, item in enumerate(evidence, 1):
                evidence_text += f"\n{i}. {item['title']}: {item['snippet']}"
        else:
            evidence_text = "\nNo external evidence found."

        prompt = f"""You are an expert fact-checker. Analyze this claim against the provided evidence.

CLAIM: {claim}

EVIDENCE:{evidence_text}

Return ONLY a valid JSON object (no markdown, no code blocks, no extra text) with this EXACT structure:
{{
  "verdict": "REAL" or "FAKE" or "UNCERTAIN",
  "score": <number between 0-100>,
  "explanation": "<2-3 sentence clear explanation>",
  "verified_context": "<brief factual context about this topic>"
}}

Rules:
- verdict must be exactly "REAL", "FAKE", or "UNCERTAIN"
- score: 0-30 = FAKE, 31-69 = UNCERTAIN, 70-100 = REAL
- Be objective and evidence-based
- Return ONLY the JSON object"""

        raw_text = ask_groq(prompt)
        if not raw_text:
            return {
                'verdict': 'UNCERTAIN', 'score': 50,
                'explanation': 'Could not analyze - Groq API key not configured.',
                'verified_context': ''
            }

        raw_text = re.sub(r'^```json\s*', '', raw_text)
        raw_text = re.sub(r'^```\s*', '', raw_text)
        raw_text = re.sub(r'\s*```$', '', raw_text)
        raw_text = raw_text.strip()

        result = json.loads(raw_text)
        result.setdefault('verdict', 'UNCERTAIN')
        result.setdefault('score', 50)
        result.setdefault('explanation', 'Analysis completed.')
        result.setdefault('verified_context', '')

        if result['verdict'] not in ['REAL', 'FAKE', 'UNCERTAIN']:
            result['verdict'] = 'UNCERTAIN'
        result['score'] = max(0, min(100, int(result.get('score', 50))))

        print(f"✅ Analysis: {result['verdict']} (score: {result['score']})")
        return result

    except json.JSONDecodeError:
        return {'verdict': 'UNCERTAIN', 'score': 50,
                'explanation': 'Analysis completed but response format was unexpected.',
                'verified_context': ''}
    except Exception as e:
        print(f"❌ Analysis error: {e}")
        return {'verdict': 'UNCERTAIN', 'score': 50,
                'explanation': f'Analysis error: {str(e)}', 'verified_context': ''}


# ============================================
# ROUTES
# ============================================

@app.route('/')
def serve_frontend():
    """Serve the React frontend."""
    if os.path.exists(app.static_folder):
        return send_from_directory(app.static_folder, 'index.html')
    return jsonify({
        'name': 'TruthLens API',
        'version': '2.0',
        'status': 'backend_only',
        'message': 'Build frontend to see full UI'
    })


@app.route('/api/info')
def api_info():
    return jsonify({
        'name': 'TruthLens API',
        'version': '2.0',
        'description': 'AI-powered fake news detector with URL analysis',
        'ai_model': 'Groq Llama 3.3 70B'
    })

# Serve static assets (JS, CSS, etc.)
@app.route('/<path:path>')
def serve_static(path):
    if os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return serve_frontend()


@app.route('/health')
def health():
    key = os.getenv('GROQ_API_KEY', '').strip()
    skey = os.getenv('SERPAPI_KEY', '').strip()
    return jsonify({
        'status': 'ok',
        'groq_key_present': bool(key),
        'serpapi_key_present': bool(skey)
    })


@app.route('/api/verify', methods=['POST'])
def verify_claim_route():
    """
    Main verification endpoint.
    Detects if input is URL or text claim and routes accordingly.
    """
    try:
        data = request.get_json()
        if not data or 'claim' not in data:
            return jsonify({'success': False, 'error': 'Missing claim field'}), 400

        claim = data['claim'].strip()
        if not claim:
            return jsonify({'success': False, 'error': 'Input cannot be empty'}), 400

        # ---- DETECT: URL or TEXT ----
        if is_valid_url(claim):
            return handle_url_analysis(claim)
        else:
            return handle_text_claim(claim)

    except Exception as e:
        print(f"❌ Server error: {e}")
        return jsonify({
            'success': False,
            'error': 'Internal server error. Please try again.',
            'timestamp': datetime.now().isoformat()
        }), 500


def handle_text_claim(claim):
    """Handle text-based claim verification (original flow)."""
    if len(claim) < 10:
        return jsonify({'success': False, 'error': 'Claim too short (min 10 chars)'}), 400
    if len(claim) > 1000:
        return jsonify({'success': False, 'error': 'Claim too long (max 1000 chars)'}), 400

    print(f"\n{'='*50}")
    print(f"📋 Verifying TEXT claim: {claim}")
    print(f"{'='*50}")

    keywords = extract_keywords(claim)
    sources = search_evidence(keywords)
    analysis = analyze_claim(claim, sources)

    return jsonify({
        'success': True,
        'input_type': 'text',
        'data': {
            'verdict': analysis['verdict'],
            'score': analysis['score'],
            'explanation': analysis['explanation'],
            'verified_context': analysis.get('verified_context', ''),
            'sources': sources,
            'keywords': keywords
        },
        'timestamp': datetime.now().isoformat()
    })


def handle_url_analysis(url):
    """Handle URL-based article analysis."""
    print(f"\n{'='*50}")
    print(f"🌐 Analyzing URL: {url}")
    print(f"{'='*50}")

    # Step 1: Fetch article content
    content = fetch_article_content(url)
    if not content.get('success'):
        return jsonify({
            'success': False,
            'input_type': 'url',
            'error': content.get('error', 'Could not fetch the article.')
        }), 400

    # Step 2: Analyze credibility
    credibility = analyze_url_credibility(url, content)

    # Step 3: Extract and verify key claims
    key_claims = extract_and_verify_claims(content['text'], content)

    return jsonify({
        'success': True,
        'input_type': 'url',
        'data': {
            'url': content['url'],
            'domain': content['domain'],
            'article': {
                'title': content['title'],
                'author': content['author'],
                'date': content['date'],
                'excerpt': content['excerpt']
            },
            'credibility_score': credibility['credibility_score'],
            'verdict': credibility['verdict'],
            'bias_detected': credibility['bias_detected'],
            'analysis': credibility['analysis'],
            'red_flags': credibility['red_flags'],
            'key_claims': key_claims
        },
        'timestamp': datetime.now().isoformat()
    })


# ============================================
# PHISHING LINK DETECTOR
# ============================================

import ssl
import socket
import ipaddress
import urllib.parse

# Lazy-import whois so missing package doesn't crash the whole app
try:
    import whois as whois_lib
    WHOIS_AVAILABLE = True
except ImportError:
    WHOIS_AVAILABLE = False
    print("⚠️  python-whois not installed — WHOIS layer disabled")

# Known URL shorteners
URL_SHORTENERS = {
    'bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'ow.ly', 'short.link',
    'buff.ly', 'adf.ly', 'tiny.cc', 'is.gd', 'cli.gs', 'pic.gd',
    'cutt.ly', 'rb.gy', 'shorturl.at', 'snip.ly'
}

# Suspicious keywords in URLs
SUSPICIOUS_KEYWORDS = [
    'login', 'signin', 'verify', 'secure', 'update', 'confirm',
    'account', 'banking', 'password', 'credential', 'wallet',
    'paypal', 'amazon', 'apple', 'microsoft', 'google', 'facebook',
    'netflix', 'support', 'helpdesk', 'recover', 'suspended',
    'unusual', 'activity', 'limited', 'unlock', 'validate'
]

# Trusted TLDs that are less commonly phished (not a guarantee)
SUSPICIOUS_TLDS = ['.tk', '.ml', '.ga', '.cf', '.gq', '.xyz', '.top', '.click', '.link']


def analyze_url_heuristics(url: str) -> dict:
    """Layer 1: Pure URL pattern analysis. Returns risk points and signals."""
    signals = []
    risk = 0

    try:
        parsed = urllib.parse.urlparse(url)
        hostname = parsed.hostname or ''
        path_query = (parsed.path + '?' + parsed.query).lower()
        full_url = url.lower()

        # 1. IP address as hostname
        try:
            ipaddress.ip_address(hostname)
            signals.append('IP address used instead of domain name')
            risk += 30
        except ValueError:
            pass

        # 2. @ symbol in URL (redirects to different host)
        if '@' in url:
            signals.append('@ symbol in URL (host redirect trick)')
            risk += 20

        # 3. Excessive subdomains (> 3 dots in hostname)
        subdomain_count = hostname.count('.')
        if subdomain_count > 3:
            signals.append(f'Excessive subdomains ({subdomain_count} levels deep)')
            risk += 20

        # 4. Lookalike characters (0→o, 1→l, rn→m, etc.)
        lookalike_map = {'0': 'o', '1': 'l', '3': 'e', '4': 'a', '5': 's', '@': 'a'}
        normalized = hostname
        for fake, real in lookalike_map.items():
            normalized = normalized.replace(fake, real)
        if normalized != hostname:
            signals.append('Lookalike characters in domain (e.g. 0→o, 1→l)')
            risk += 25

        # 5. Suspicious keywords in URL
        found_keywords = [kw for kw in SUSPICIOUS_KEYWORDS if kw in full_url]
        if len(found_keywords) >= 2:
            signals.append(f'Multiple suspicious keywords: {", ".join(found_keywords[:4])}')
            risk += 15
        elif len(found_keywords) == 1:
            signals.append(f'Suspicious keyword in URL: {found_keywords[0]}')
            risk += 8

        # 6. Very long URL
        if len(url) > 100:
            signals.append(f'Unusually long URL ({len(url)} characters)')
            risk += 10
        elif len(url) > 75:
            risk += 5

        # 7. Hyphen-heavy domain
        domain_part = hostname.split('.')[0] if hostname else ''
        if domain_part.count('-') >= 2:
            signals.append(f'Multiple hyphens in domain ({domain_part.count("-")} hyphens)')
            risk += 15

        # 8. Non-standard port
        if parsed.port and parsed.port not in (80, 443, 8080):
            signals.append(f'Non-standard port: {parsed.port}')
            risk += 10

        # 9. URL shortener
        if hostname in URL_SHORTENERS:
            signals.append(f'URL shortener detected ({hostname}) — hides real destination')
            risk += 10

        # 10. Suspicious TLD
        for tld in SUSPICIOUS_TLDS:
            if hostname.endswith(tld):
                signals.append(f'High-risk TLD: {tld}')
                risk += 12
                break

        # 11. No HTTPS
        if parsed.scheme == 'http':
            signals.append('No HTTPS — connection is not encrypted')
            risk += 10

        # 12. Double slashes in path (obfuscation)
        if '//' in parsed.path:
            signals.append('Double slashes in URL path (obfuscation attempt)')
            risk += 8

    except Exception as e:
        print(f"⚠️ Heuristic error: {e}")

    return {'risk': min(risk, 60), 'signals': signals}


def check_domain_age(hostname: str) -> dict:
    """Layer 2: WHOIS domain age check."""
    if not WHOIS_AVAILABLE:
        return {'risk': 0, 'signals': [], 'domain_age_days': None, 'registrar': None}

    try:
        # Strip www.
        domain = hostname.replace('www.', '')
        w = whois_lib.whois(domain)

        creation = w.creation_date
        if isinstance(creation, list):
            creation = creation[0]

        if not creation:
            return {'risk': 5, 'signals': ['Domain registration date unknown'], 'domain_age_days': None, 'registrar': str(w.registrar or '')}

        age_days = (datetime.now() - creation).days
        registrar = str(w.registrar or 'Unknown')
        risk = 0
        signals = []

        if age_days < 30:
            signals.append(f'Domain is only {age_days} days old — very new, high risk')
            risk = 40
        elif age_days < 180:
            signals.append(f'Domain is {age_days} days old — relatively new')
            risk = 20
        elif age_days < 365:
            signals.append(f'Domain is {age_days} days old — less than 1 year')
            risk = 10

        return {'risk': risk, 'signals': signals, 'domain_age_days': age_days, 'registrar': registrar}

    except Exception as e:
        print(f"⚠️ WHOIS error for {hostname}: {e}")
        return {'risk': 0, 'signals': [], 'domain_age_days': None, 'registrar': None}


def check_ssl_certificate(hostname: str) -> dict:
    """Layer 3: SSL certificate validity check."""
    signals = []
    risk = 0

    try:
        ctx = ssl.create_default_context()
        with ctx.wrap_socket(socket.socket(), server_hostname=hostname) as s:
            s.settimeout(5)
            s.connect((hostname, 443))
            cert = s.getpeercert()

        # Check expiry
        not_after = ssl.cert_time_to_seconds(cert['notAfter'])
        days_left = (not_after - datetime.now().timestamp()) / 86400
        issuer = dict(x[0] for x in cert.get('issuer', []))
        org = issuer.get('organizationName', 'Unknown')

        if days_left < 0:
            signals.append('SSL certificate has EXPIRED')
            risk += 25
        elif days_left < 14:
            signals.append(f'SSL certificate expires in {int(days_left)} days')
            risk += 10

        ssl_info = {'valid': True, 'issuer': org, 'days_remaining': int(days_left)}

    except ssl.SSLCertVerificationError:
        signals.append('SSL certificate is invalid or self-signed')
        risk += 20
        ssl_info = {'valid': False, 'issuer': None, 'days_remaining': None}
    except (socket.timeout, ConnectionRefusedError, OSError):
        signals.append('No SSL/HTTPS — site does not support encrypted connections')
        risk += 15
        ssl_info = {'valid': False, 'issuer': None, 'days_remaining': None}
    except Exception as e:
        print(f"⚠️ SSL check error for {hostname}: {e}")
        ssl_info = {'valid': None, 'issuer': None, 'days_remaining': None}

    return {'risk': risk, 'signals': signals, 'ssl_info': ssl_info}


def check_google_safe_browsing(url: str) -> dict:
    """Layer 4: Google Safe Browsing API (free, optional)."""
    gsb_key = os.getenv('GOOGLE_SAFE_BROWSING_KEY', '').strip()
    if not gsb_key:
        return {'risk': 0, 'signals': [], 'threat_type': None, 'checked': False}

    try:
        payload = {
            'client': {'clientId': 'truthlens', 'clientVersion': '1.0'},
            'threatInfo': {
                'threatTypes': ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE', 'POTENTIALLY_HARMFUL_APPLICATION'],
                'platformTypes': ['ANY_PLATFORM'],
                'threatEntryTypes': ['URL'],
                'threatEntries': [{'url': url}]
            }
        }
        resp = http_requests.post(
            f'https://safebrowsing.googleapis.com/v4/threatMatches:find?key={gsb_key}',
            json=payload, timeout=5
        )
        data = resp.json()

        if data.get('matches'):
            threat = data['matches'][0].get('threatType', 'UNKNOWN')
            threat_labels = {
                'SOCIAL_ENGINEERING': 'Phishing / Social Engineering',
                'MALWARE': 'Malware Distribution',
                'UNWANTED_SOFTWARE': 'Unwanted Software',
                'POTENTIALLY_HARMFUL_APPLICATION': 'Harmful Application'
            }
            label = threat_labels.get(threat, threat)
            return {
                'risk': 60,
                'signals': [f'🚨 Google Safe Browsing: FLAGGED as {label}'],
                'threat_type': label,
                'checked': True
            }

        return {'risk': 0, 'signals': [], 'threat_type': None, 'checked': True}

    except Exception as e:
        print(f"⚠️ Safe Browsing API error: {e}")
        return {'risk': 0, 'signals': [], 'threat_type': None, 'checked': False}


def groq_phishing_summary(url: str, hostname: str, total_risk: int, all_signals: list, domain_age_days, ssl_info: dict) -> dict:
    """Layer 5: Groq AI generates human-readable explanation and attack type."""
    try:
        signals_text = '\n'.join(f'- {s}' for s in all_signals) if all_signals else '- No specific signals detected'
        age_text = f'{domain_age_days} days old' if domain_age_days is not None else 'unknown'
        ssl_text = f"Valid (issued by {ssl_info.get('issuer', 'Unknown')})" if ssl_info.get('valid') else 'Invalid or missing'

        prompt = f"""You are a cybersecurity expert analyzing a URL for phishing risk.

URL: {url}
Domain: {hostname}
Risk Score: {total_risk}/100
Domain Age: {age_text}
SSL Certificate: {ssl_text}

Detected Signals:
{signals_text}

Based on this analysis, provide:
1. A concise 2-3 sentence explanation of why this URL is or isn't suspicious
2. The most likely attack type if it IS suspicious (e.g. "Credential Harvesting", "Malware Distribution", "Advance Fee Scam", "Fake Login Page", "Safe Website")
3. One specific recommendation for the user

Return ONLY valid JSON (no markdown):
{{
  "explanation": "<2-3 sentence explanation>",
  "attack_type": "<attack type or 'Appears Safe'>",
  "recommendation": "<one actionable recommendation>"
}}"""

        raw = ask_groq(prompt)
        if not raw:
            return {'explanation': 'AI analysis unavailable.', 'attack_type': 'Unknown', 'recommendation': 'Exercise caution with this URL.'}

        raw = re.sub(r'^```json\s*', '', raw)
        raw = re.sub(r'^```\s*', '', raw)
        raw = re.sub(r'\s*```$', '', raw)
        result = json.loads(raw.strip())
        return result

    except Exception as e:
        print(f"⚠️ Groq phishing summary error: {e}")
        return {'explanation': 'AI analysis unavailable.', 'attack_type': 'Unknown', 'recommendation': 'Exercise caution with this URL.'}


@app.route('/api/phishing', methods=['POST'])
def phishing_check():
    """
    Phishing Link Detector endpoint.
    Runs 5-layer analysis: heuristics → WHOIS → SSL → Safe Browsing → Groq AI
    """
    try:
        data = request.get_json()
        if not data or 'url' not in data:
            return jsonify({'success': False, 'error': 'Missing url field'}), 400

        raw_url = data['url'].strip()
        if not raw_url:
            return jsonify({'success': False, 'error': 'URL cannot be empty'}), 400

        # Normalize URL
        if not raw_url.startswith(('http://', 'https://')):
            raw_url = 'https://' + raw_url

        parsed = urlparse(raw_url)
        hostname = parsed.hostname or ''

        if not hostname:
            return jsonify({'success': False, 'error': 'Invalid URL — could not extract hostname'}), 400

        print(f"\n🎣 Phishing check: {raw_url}")

        # ── Run all layers ──
        print("  Layer 1: URL heuristics...")
        heuristics = analyze_url_heuristics(raw_url)

        print("  Layer 2: WHOIS domain age...")
        whois_result = check_domain_age(hostname)

        print("  Layer 3: SSL certificate...")
        ssl_result = check_ssl_certificate(hostname)

        print("  Layer 4: Google Safe Browsing...")
        gsb_result = check_google_safe_browsing(raw_url)

        # ── Aggregate risk score ──
        total_risk = heuristics['risk'] + whois_result['risk'] + ssl_result['risk'] + gsb_result['risk']
        total_risk = min(total_risk, 100)

        all_signals = (
            heuristics['signals'] +
            whois_result['signals'] +
            ssl_result['signals'] +
            gsb_result['signals']
        )

        # ── Verdict ──
        if total_risk >= 60:
            verdict = 'DANGEROUS'
        elif total_risk >= 30:
            verdict = 'SUSPICIOUS'
        else:
            verdict = 'SAFE'

        print(f"  Layer 5: Groq AI summary... (risk={total_risk}, verdict={verdict})")
        ai_result = groq_phishing_summary(
            raw_url, hostname, total_risk, all_signals,
            whois_result.get('domain_age_days'),
            ssl_result.get('ssl_info', {})
        )

        print(f"✅ Phishing check complete: {verdict} ({total_risk}/100)")

        return jsonify({
            'success': True,
            'data': {
                'url': raw_url,
                'hostname': hostname,
                'risk_score': total_risk,
                'verdict': verdict,
                'signals': all_signals,
                'layers': {
                    'heuristics': {'risk': heuristics['risk'], 'signals': heuristics['signals']},
                    'whois': {
                        'risk': whois_result['risk'],
                        'signals': whois_result['signals'],
                        'domain_age_days': whois_result.get('domain_age_days'),
                        'registrar': whois_result.get('registrar'),
                    },
                    'ssl': {
                        'risk': ssl_result['risk'],
                        'signals': ssl_result['signals'],
                        'info': ssl_result.get('ssl_info', {}),
                    },
                    'safe_browsing': {
                        'risk': gsb_result['risk'],
                        'signals': gsb_result['signals'],
                        'threat_type': gsb_result.get('threat_type'),
                        'checked': gsb_result.get('checked', False),
                    },
                },
                'ai_analysis': ai_result,
            },
            'timestamp': datetime.now().isoformat()
        })

    except Exception as e:
        print(f"❌ Phishing endpoint error: {e}")
        return jsonify({'success': False, 'error': 'Internal server error. Please try again.'}), 500



# ============================================
# FAKE IMAGE DETECTOR
# ============================================

import io
import base64
import struct

try:
    from PIL import Image, ExifTags, UnidentifiedImageError
    PIL_AVAILABLE = True
except ImportError:
    PIL_AVAILABLE = False
    print("⚠️  Pillow not installed — image analysis disabled")

# AI-generation software signatures found in EXIF
AI_SOFTWARE_SIGNATURES = [
    'dall-e', 'midjourney', 'stable diffusion', 'firefly', 'imagen',
    'nightcafe', 'artbreeder', 'craiyon', 'wombo', 'canva ai',
    'adobe firefly', 'bing image creator', 'ideogram', 'leonardo',
]

ALLOWED_IMAGE_TYPES = {'image/jpeg', 'image/png', 'image/webp', 'image/gif'}
MAX_IMAGE_SIZE = 10 * 1024 * 1024  # 10 MB


def extract_exif(img: 'Image.Image') -> dict:
    """Extract and decode EXIF metadata from a PIL image."""
    exif_data = {
        'has_exif': False,
        'camera_make': None,
        'camera_model': None,
        'software': None,
        'date_taken': None,
        'gps': False,
        'ai_software_detected': None,
    }

    try:
        raw_exif = img._getexif()
        if not raw_exif:
            return exif_data

        exif_data['has_exif'] = True
        tag_map = {v: k for k, v in ExifTags.TAGS.items()}

        def get(name):
            tag_id = tag_map.get(name)
            return raw_exif.get(tag_id) if tag_id else None

        exif_data['camera_make']  = str(get('Make') or '').strip() or None
        exif_data['camera_model'] = str(get('Model') or '').strip() or None
        exif_data['software']     = str(get('Software') or '').strip() or None
        exif_data['date_taken']   = str(get('DateTimeOriginal') or get('DateTime') or '').strip() or None

        # GPS check
        gps_tag = tag_map.get('GPSInfo')
        if gps_tag and raw_exif.get(gps_tag):
            exif_data['gps'] = True

        # AI software detection
        sw = (exif_data['software'] or '').lower()
        for sig in AI_SOFTWARE_SIGNATURES:
            if sig in sw:
                exif_data['ai_software_detected'] = exif_data['software']
                break

    except Exception as e:
        print(f"⚠️ EXIF extraction error: {e}")

    return exif_data


def analyze_image_stats(img: 'Image.Image') -> dict:
    """Layer 2: Statistical image analysis for AI-generation signals."""
    signals = []
    risk_points = 0

    try:
        w, h = img.size

        # 1. Exact power-of-2 dimensions (common for AI images)
        def is_pow2(n): return n > 0 and (n & (n - 1)) == 0
        if is_pow2(w) and is_pow2(h):
            signals.append(f'Dimensions are exact powers of 2 ({w}×{h}) — common for AI-generated images')
            risk_points += 15

        # 2. Perfect square dimensions
        if w == h and is_pow2(w):
            risk_points += 5  # extra for perfect square power-of-2

        # 3. Convert to RGB for analysis
        rgb = img.convert('RGB')

        # 4. Color histogram uniformity — AI images tend to be smoother
        hist = rgb.histogram()  # 256*3 values
        r_hist = hist[:256]
        g_hist = hist[256:512]
        b_hist = hist[512:]

        def hist_variance(h):
            total = sum(h)
            if total == 0: return 0
            mean = total / 256
            return sum((x - mean) ** 2 for x in h) / 256

        avg_var = (hist_variance(r_hist) + hist_variance(g_hist) + hist_variance(b_hist)) / 3
        # Very low variance = unnaturally smooth (AI), very high = normal photo
        if avg_var < 5000:
            signals.append('Unusually uniform color distribution — may indicate AI generation')
            risk_points += 10

        # 5. Image mode checks
        if img.mode == 'RGBA':
            signals.append('Image has transparency channel (RGBA) — common in AI-generated images')
            risk_points += 8

        # 6. File size vs dimensions ratio (AI images are often very clean/small)
        pixel_count = w * h
        # We can't get file size here easily, but flag very large images
        if pixel_count > 4096 * 4096:
            signals.append(f'Very high resolution ({w}×{h}) — may be AI upscaled')
            risk_points += 5

    except Exception as e:
        print(f"⚠️ Image stats error: {e}")

    return {'risk_points': min(risk_points, 30), 'signals': signals}


def groq_vision_analysis(img_bytes: bytes, mime_type: str, exif: dict, stats: dict) -> dict:
    """Layer 3: Groq Vision AI analysis of the image."""
    client = get_groq_client()
    if not client:
        return {
            'ai_probability': 50,
            'verdict': 'UNCERTAIN',
            'manipulation_type': 'Unknown',
            'signals': ['AI analysis unavailable — no Groq API key'],
            'explanation': 'Could not perform AI analysis.',
            'recommendation': 'Check the image manually for signs of manipulation.',
        }

    try:
        # Encode image as base64
        b64 = base64.standard_b64encode(img_bytes).decode('utf-8')
        data_url = f"data:{mime_type};base64,{b64}"

        exif_context = []
        if not exif['has_exif']:
            exif_context.append('No EXIF metadata (suspicious — real cameras always embed EXIF)')
        else:
            if exif['camera_make']:
                exif_context.append(f"Camera: {exif['camera_make']} {exif['camera_model'] or ''}")
            if exif['software']:
                exif_context.append(f"Software: {exif['software']}")
            if exif['ai_software_detected']:
                exif_context.append(f"⚠️ AI software detected in EXIF: {exif['ai_software_detected']}")
            if exif['gps']:
                exif_context.append('GPS coordinates present (suggests real photo)')
        if stats['signals']:
            exif_context.extend(stats['signals'])

        context_text = '\n'.join(f'- {s}' for s in exif_context) if exif_context else '- No additional context'

        prompt = f"""You are an expert digital forensics analyst specializing in detecting AI-generated and manipulated images.

Analyze this image carefully and look for:
1. Signs of AI generation: unnatural textures, impossible anatomy (especially hands/fingers/teeth), perfect symmetry, dreamlike quality, watermarks from AI tools, inconsistent lighting/shadows
2. Signs of manipulation: cloning artifacts, splicing boundaries, inconsistent noise patterns, unnatural edges
3. Signs it's a real photograph: natural imperfections, consistent lighting, realistic depth of field, natural noise

Additional context from metadata analysis:
{context_text}

Provide your analysis as ONLY valid JSON (no markdown, no explanation outside JSON):
{{
  "ai_probability": <integer 0-100, where 100 = definitely AI generated>,
  "manipulation_type": "<one of: AI Generated, Digitally Manipulated, Deepfake, Likely Real, Uncertain>",
  "signals": ["<specific visual signal 1>", "<specific visual signal 2>", "<up to 5 signals>"],
  "explanation": "<2-3 sentence expert explanation of your findings>",
  "recommendation": "<one actionable recommendation for the user>"
}}"""

        response = client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=[{
                "role": "user",
                "content": [
                    {"type": "image_url", "image_url": {"url": data_url}},
                    {"type": "text", "text": prompt}
                ]
            }],
            temperature=0.2,
            max_tokens=1024,
        )

        raw = response.choices[0].message.content.strip()
        raw = re.sub(r'^```json\s*', '', raw, flags=re.MULTILINE)
        raw = re.sub(r'^```\s*', '', raw, flags=re.MULTILINE)
        raw = re.sub(r'\s*```$', '', raw)
        result = json.loads(raw.strip())

        # Determine verdict from ai_probability
        prob = int(result.get('ai_probability', 50))
        if prob >= 66:
            verdict = 'LIKELY_AI'
        elif prob >= 31:
            verdict = 'UNCERTAIN'
        else:
            verdict = 'LIKELY_REAL'

        result['verdict'] = verdict
        result['ai_probability'] = prob
        return result

    except Exception as e:
        print(f"⚠️ Groq vision error: {e}")
        return {
            'ai_probability': 50,
            'verdict': 'UNCERTAIN',
            'manipulation_type': 'Unknown',
            'signals': [f'AI analysis error: {str(e)[:80]}'],
            'explanation': 'Could not complete AI analysis.',
            'recommendation': 'Try again or inspect the image manually.',
        }


@app.route('/api/image', methods=['POST'])
def image_check():
    """
    Fake Image Detector endpoint.
    Accepts multipart/form-data with 'image' file field,
    OR JSON with 'image_url' field.
    """
    if not PIL_AVAILABLE:
        return jsonify({'success': False, 'error': 'Image analysis unavailable — Pillow not installed.'}), 500

    try:
        img_bytes = None
        mime_type = 'image/jpeg'
        source_name = 'uploaded image'

        # ── Mode A: File upload ──
        if 'image' in request.files:
            file = request.files['image']
            if not file or file.filename == '':
                return jsonify({'success': False, 'error': 'No file selected.'}), 400

            mime_type = file.content_type or 'image/jpeg'
            if mime_type not in ALLOWED_IMAGE_TYPES:
                return jsonify({'success': False, 'error': f'Unsupported file type: {mime_type}. Use JPEG, PNG, WebP, or GIF.'}), 400

            img_bytes = file.read()
            source_name = file.filename
            if len(img_bytes) > MAX_IMAGE_SIZE:
                return jsonify({'success': False, 'error': 'Image too large. Maximum size is 10 MB.'}), 400

        # ── Mode B: Image URL ──
        elif request.is_json and request.json.get('image_url'):
            image_url = request.json['image_url'].strip()
            print(f"\n🖼️ Fetching image from URL: {image_url}")
            resp = http_requests.get(image_url, timeout=10, stream=True)
            resp.raise_for_status()
            mime_type = resp.headers.get('Content-Type', 'image/jpeg').split(';')[0].strip()
            img_bytes = resp.content
            source_name = image_url
            if len(img_bytes) > MAX_IMAGE_SIZE:
                return jsonify({'success': False, 'error': 'Image too large. Maximum size is 10 MB.'}), 400

        else:
            return jsonify({'success': False, 'error': 'Provide an image file (multipart) or image_url (JSON).'}), 400

        print(f"\n🖼️ Image analysis: {source_name} ({len(img_bytes)//1024} KB, {mime_type})")

        # ── Open with Pillow ──
        try:
            img = Image.open(io.BytesIO(img_bytes))
            img.verify()  # Check integrity
            img = Image.open(io.BytesIO(img_bytes))  # Re-open after verify
        except UnidentifiedImageError:
            return jsonify({'success': False, 'error': 'Could not read image. Make sure it is a valid image file.'}), 400

        w, h = img.size
        mode = img.mode

        # ── Layer 1: EXIF ──
        print("  Layer 1: EXIF metadata...")
        exif = extract_exif(img)

        # ── Layer 2: Image stats ──
        print("  Layer 2: Image statistics...")
        stats = analyze_image_stats(img)

        # ── Layer 3: Groq Vision ──
        print("  Layer 3: Groq Vision AI...")
        # Resize for API if too large (keep under ~1MB encoded)
        if len(img_bytes) > 800_000:
            img_resized = img.convert('RGB')
            buf = io.BytesIO()
            img_resized.thumbnail((1024, 1024), Image.LANCZOS)
            img_resized.save(buf, format='JPEG', quality=85)
            img_bytes_for_api = buf.getvalue()
            mime_type_for_api = 'image/jpeg'
        else:
            img_bytes_for_api = img_bytes
            mime_type_for_api = mime_type

        ai_result = groq_vision_analysis(img_bytes_for_api, mime_type_for_api, exif, stats)

        # ── Build EXIF signals ──
        exif_signals = []
        if not exif['has_exif']:
            exif_signals.append('No EXIF metadata found — AI-generated images typically lack EXIF')
        else:
            if exif['ai_software_detected']:
                exif_signals.append(f'AI software in EXIF: {exif["ai_software_detected"]}')
            if exif['camera_make']:
                exif_signals.append(f'Camera: {exif["camera_make"]} {exif["camera_model"] or ""}')
            if exif['gps']:
                exif_signals.append('GPS location data present')

        all_signals = exif_signals + stats['signals'] + (ai_result.get('signals') or [])

        print(f"✅ Image check complete: {ai_result['verdict']} ({ai_result['ai_probability']}% AI probability)")

        return jsonify({
            'success': True,
            'data': {
                'source': source_name,
                'dimensions': {'width': w, 'height': h},
                'mode': mode,
                'file_size_kb': len(img_bytes) // 1024,
                'ai_probability': ai_result['ai_probability'],
                'verdict': ai_result['verdict'],
                'manipulation_type': ai_result.get('manipulation_type', 'Unknown'),
                'signals': all_signals,
                'exif': exif,
                'ai_analysis': {
                    'explanation': ai_result.get('explanation', ''),
                    'recommendation': ai_result.get('recommendation', ''),
                },
            },
            'timestamp': datetime.now().isoformat()
        })

    except http_requests.RequestException as e:
        return jsonify({'success': False, 'error': f'Could not fetch image URL: {str(e)}'}), 400
    except Exception as e:
        print(f"❌ Image endpoint error: {e}")
        import traceback; traceback.print_exc()
        return jsonify({'success': False, 'error': 'Internal server error. Please try again.'}), 500



# ============================================
# DEEPFAKE AUDIO DETECTOR
# ============================================

import tempfile
import uuid
import numpy as np

try:
    import librosa
    import soundfile as sf
    AUDIO_AVAILABLE = True
except ImportError:
    AUDIO_AVAILABLE = False
    print("⚠️  Librosa/Soundfile not installed — audio analysis disabled")

def analyze_audio_signal(file_path):
    """Layer 1: Acoustic Forensics using Librosa."""
    signals = []
    risk_score = 0
    
    try:
        y, sr = librosa.load(file_path, sr=None)  # Load native SR
        duration = librosa.get_duration(y=y, sr=sr)
        
        # 1. Silence Analysis (Digital Silence)
        # Deepfakes sometimes have "perfect zero" silence between words.
        # Real mics have background noise.
        # Check percentage of samples that are EXACTLY zero.
        zero_samples = np.sum(y == 0)
        total_samples = len(y)
        zero_ratio = zero_samples / total_samples
        
        if zero_ratio > 0.1: # If >10% of audio is digital zero
            signals.append("Contains 'perfect digital silence' (unnatural for real recordings)")
            risk_score += 20
        
        # 2. Spectral Rolloff (Frequency Cutoff)
        # Many TTS models generate up to 22kHz or 24kHz. Telephony is 8kHz.
        # We check where 99% of energy is concentrated.
        rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr, roll_percent=0.99)
        mean_rolloff = np.mean(rolloff)
        
        if mean_rolloff < 8500: # Cutoff around 8kHz
            signals.append("Low-frequency cutoff (~8kHz) — possible telephony or low-quality upsampling")
            risk_score += 10
        elif mean_rolloff > 22000 and sr > 44100:
            # Suspiciously high fidelity? Not necessarily bad.
            pass
            
        # 3. Pitch Volatility (Micro-tremors)
        # AI can be 'too stable'. Real voices have jitter.
        # Approximate using zero-crossing rate variance
        zcr = librosa.feature.zero_crossing_rate(y)
        zcr_var = np.var(zcr)
        
        if zcr_var < 0.0005: 
            signals.append("Unnatural pitch stability (lack of micro-tremors)")
            risk_score += 15
            
        return {
            "signals": signals, 
            "acoustic_risk": risk_score, 
            "duration": duration
        }
        
    except Exception as e:
        print(f"⚠️ Audio analysis error: {e}")
        return {"signals": [f"Signal analysis failed: {str(e)}"], "acoustic_risk": 0, "duration": 0}

@app.route('/api/audio', methods=['POST'])
def audio_check():
    """
    Deepfake Audio Detector endpoint.
    Accepts multipart/form-data with 'audio' file field.
    """
    if not AUDIO_AVAILABLE:
        return jsonify({'success': False, 'error': 'Audio analysis unavailable — Librosa not installed.'}), 500
        
    if 'audio' not in request.files:
        return jsonify({'success': False, 'error': 'No audio file uploaded.'}), 400
        
    file = request.files['audio']
    if file.filename == '':
        return jsonify({'success': False, 'error': 'No file selected.'}), 400
        
    # Save to temp file for Librosa analysis
    temp_filename = f"temp_{uuid.uuid4().hex}.wav" 
    temp_path = os.path.join(tempfile.gettempdir(), temp_filename)
    
    try:
        file.save(temp_path)
        
        # ── Layer 1: Acoustic Analysis ──
        print(f"🎙️ Analyzing audio signal: {file.filename}")
        acoustic = analyze_audio_signal(temp_path)
        
        # ── Layer 2: Transcription (Groq Whisper) ──
        print("🎙️ Transcribing with Groq Whisper...")
        client = get_groq_client()
        transcript_text = ""
        
        if client:
            with open(temp_path, "rb") as f:
                transcription = client.audio.transcriptions.create(
                    file=(temp_filename, f.read()),
                    model="distil-whisper-large-v3-en",
                    response_format="json",
                    language="en",
                    temperature=0.0
                )
                transcript_text = transcription.text
        else:
            transcript_text = "(Transcription unavailable - No API Key)"
            
        # ── Layer 3: Content Intent Analysis (Groq Llama) ──
        content_risk = 0
        ai_verdict = "UNCERTAIN"
        explanation = "Could not analyze content."
        
        if client and transcript_text:
            print("🎙️ Analyzing intent with Llama...")
            prompt = f"""Analyze this audio transcript for indicators of deepfake scams or social engineering.
Transcript: "{transcript_text}"

Look for:
1. Urgency ("Do this now", "I'm in trouble")
2. Financial demands ("Wire money", "Gift cards", "Bank transfer")
3. Authority impersonation ("This is the IRS", "This is the Police", "This is the CEO")
4. Grandparent scam patterns ("I'm in jail", "Don't tell mom")

Return JSON:
{{
  "scam_likelihood": <0-100>,
  "verdict": "<LIKELY_FAKE, UNCERTAIN, LIKELY_REAL>",
  "explanation": "<Short explanation>",
  "signals": ["<Signal 1>", "<Signal 2>"]
}}"""
            completion = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.1,
                response_format={"type": "json_object"}
            )
            analysis = json.loads(completion.choices[0].message.content)
            content_risk = analysis.get("scam_likelihood", 0)
            ai_verdict = analysis.get("verdict", "UNCERTAIN")
            explanation = analysis.get("explanation", "")
            if analysis.get("signals"):
                acoustic['signals'].extend(analysis['signals'])
        
        # ── Final Verdict Logic ──
        total_risk = max(acoustic['acoustic_risk'], content_risk)
        
        # If acoustic signals are strong, override Llama's "soft" verdict
        if acoustic['acoustic_risk'] > 40:
            ai_verdict = "LIKELY_FAKE"
            explanation += " Acoustic analysis detected synthetic artifacts."
            
        final_verdict = ai_verdict
        if total_risk < 20 and final_verdict == "UNCERTAIN":
            final_verdict = "LIKELY_REAL"

        # Cleanup
        try:
            os.remove(temp_path)
        except:
            pass
            
        return jsonify({
            'success': True,
            'data': {
                'file_name': file.filename,
                'duration_seconds': round(acoustic['duration'], 2),
                'ai_probability': total_risk,
                'verdict': final_verdict,
                'analysis_type': 'Hybrid (Acoustic + Content)',
                'signals': acoustic['signals'],
                'transcript': transcript_text,
                'explanation': explanation
            }
        })
        
    except Exception as e:
        print(f"❌ Audio endpoint error: {e}")
        if os.path.exists(temp_path):
            os.remove(temp_path)
        return jsonify({'success': False, 'error': f"Processing failed: {str(e)}"}), 500

# ============================================
# TRENDING NEWS ENDPOINT
# ============================================

@app.route('/api/trending', methods=['GET'])
def get_trending():
    """Fetch trending fact-check news from SerpAPI or return fallback data."""
    try:
        articles = []
        
        if SERPAPI_KEY: 
            # Fetch from SerpAPI Google News
            url = "https://serpapi.com/search.json"
            params = {
                "engine": "google_news",
                "q": "fact check",
                "gl": "us",
                "hl": "en",
                "api_key": SERPAPI_KEY
            }
            try:
                response = http_requests.get(url, params=params, timeout=10)
                data = response.json()
                
                if "news_results" in data:
                    for item in data["news_results"][:6]:
                        articles.append({
                            "title": item.get("title", "No Title"),
                            "source": item.get("source", {}).get("name", "Unknown Source"),
                            "date": item.get("date", "Recent"),
                            "link": item.get("link", "#"),
                            "thumbnail": item.get("thumbnail", None)
                        })
            except Exception as e:
                print(f"⚠️ SerpAPI Error: {e}")
                # Fall through to fallback
        
        # Fallback Data if API fails or yields no results
        if not articles:
            articles = [
                {
                    "title": "Fact Check: Viral video claimed to show alien invasion is CGI",
                    "source": "Reuters Fact Check",
                    "date": "2 hours ago",
                    "link": "#",
                    "thumbnail": "https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&q=80&w=200"
                },
                {
                    "title": "Debunked: Government did NOT ban digital currency",
                    "source": "AP News",
                    "date": "5 hours ago",
                    "link": "#",
                    "thumbnail": "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&q=80&w=200"
                },
                {
                    "title": "Health Myth: Drinking hot water does not cure all diseases",
                    "source": "WHO Mythbusters",
                    "date": "1 day ago",
                    "link": "#",
                    "thumbnail": "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=200"
                },
                {
                    "title": "Deepfake Alert: CEO interview circulating on social media is AI-generated",
                    "source": "TruthLens Analysis",
                    "date": "Just now",
                    "link": "#",
                    "thumbnail": "https://images.unsplash.com/photo-1639322537228-ad7117a7a640?auto=format&fit=crop&q=80&w=200"
                }
            ]
            
        return jsonify({"success": True, "articles": articles})

    except Exception as e:
        print(f"⚠️ Trending API Error: {e}")
        return jsonify({"success": False, "error": str(e)})

# ============================================
# START SERVER
# ============================================

if __name__ == '__main__':
    key = os.getenv('GROQ_API_KEY', '').strip()
    skey = os.getenv('SERPAPI_KEY', '').strip()
    print("\n" + "="*50)
    print("🚀 TruthLens API v2.0 starting...")
    print(f"   Server: http://localhost:5000")
    print(f"   Features: Text claims + URL analysis")
    print(f"   AI Model: Groq Llama 3.3 70B")
    print(f"   Groq: {'✅ Ready' if key else '❌ No API key'}")
    print(f"   SerpAPI: {'✅ Ready' if skey else '❌ No API key'}")
    print("="*50 + "\n")
    # Production: Use Gunicorn; Local: Use debug=True
    debug_mode = os.getenv('FLASK_ENV') == 'development'
    app.run(debug=debug_mode, port=5000)
