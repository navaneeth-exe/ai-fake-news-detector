# ============================================
# TruthLens - AI Fake News Detector
# Backend API Server (Groq + URL Analysis)
# ============================================

from flask import Flask, request, jsonify
from flask_cors import CORS
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
app = Flask(__name__)
CORS(app)

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
def home():
    return jsonify({
        'name': 'TruthLens API',
        'version': '2.0',
        'description': 'AI-powered fake news detector with URL analysis',
        'ai_model': 'Groq Llama 3.3 70B'
    })


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
    app.run(debug=True, port=5000)
