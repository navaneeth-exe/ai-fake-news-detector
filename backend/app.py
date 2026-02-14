# ============================================
# TruthLens - AI Fake News Detector
# Backend API Server (Groq Edition)
# ============================================

from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import json
import re
import pathlib
from datetime import datetime
from groq import Groq

# Load environment variables from the backend/.env file
env_path = pathlib.Path(__file__).resolve().parent / '.env'
print(f"Loading .env from: {env_path} (exists: {env_path.exists()})")
load_dotenv(dotenv_path=str(env_path))

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# ---- GROQ SETUP ----
GROQ_KEY = os.getenv('GROQ_API_KEY', '').strip()
SERPAPI_KEY = os.getenv('SERPAPI_KEY', '').strip()

print(f"GROQ_KEY loaded: {'Yes (' + GROQ_KEY[:8] + '...)' if GROQ_KEY else 'No'}")
print(f"SERPAPI_KEY loaded: {'Yes (' + SERPAPI_KEY[:8] + '...)' if SERPAPI_KEY else 'No'}")


def get_groq_client():
    """Get a Groq client instance."""
    key = os.getenv('GROQ_API_KEY', '').strip()
    if not key:
        print("❌ No GROQ_API_KEY in environment")
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
        max_tokens=1024
    )
    return response.choices[0].message.content.strip()


# ============================================
# HELPER FUNCTIONS
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
        import requests

        query = ' '.join(keywords)
        params = {
            'api_key': key,
            'engine': 'google',
            'q': query,
            'tbm': 'nws',
            'num': 5
        }

        response = requests.get('https://serpapi.com/search', params=params, timeout=15)
        data = response.json()

        results = []
        for item in data.get('news_results', [])[:5]:
            results.append({
                'title': item.get('title', 'No title'),
                'snippet': item.get('snippet', ''),
                'link': item.get('link', '#')
            })

        # Fallback to organic results if no news results
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
    """Use Groq to analyze the claim against evidence."""
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
                'verdict': 'UNCERTAIN',
                'score': 50,
                'explanation': 'Could not analyze - Groq API key not configured.',
                'verified_context': ''
            }

        # Clean up response - strip markdown code blocks if present
        raw_text = re.sub(r'^```json\s*', '', raw_text)
        raw_text = re.sub(r'^```\s*', '', raw_text)
        raw_text = re.sub(r'\s*```$', '', raw_text)
        raw_text = raw_text.strip()

        result = json.loads(raw_text)

        # Validate and ensure defaults
        result.setdefault('verdict', 'UNCERTAIN')
        result.setdefault('score', 50)
        result.setdefault('explanation', 'Analysis completed.')
        result.setdefault('verified_context', '')

        if result['verdict'] not in ['REAL', 'FAKE', 'UNCERTAIN']:
            result['verdict'] = 'UNCERTAIN'

        result['score'] = max(0, min(100, int(result.get('score', 50))))

        print(f"✅ Analysis: {result['verdict']} (score: {result['score']})")
        return result

    except json.JSONDecodeError as e:
        print(f"❌ JSON parse error: {e}")
        return {
            'verdict': 'UNCERTAIN',
            'score': 50,
            'explanation': 'Analysis completed but response format was unexpected.',
            'verified_context': ''
        }
    except Exception as e:
        print(f"❌ Analysis error: {e}")
        return {
            'verdict': 'UNCERTAIN',
            'score': 50,
            'explanation': f'Analysis error: {str(e)}',
            'verified_context': ''
        }


# ============================================
# ROUTES
# ============================================

@app.route('/')
def home():
    return jsonify({
        'name': 'TruthLens API',
        'version': '1.0',
        'description': 'AI-powered fake news detector',
        'ai_model': 'Groq Llama 3.3 70B'
    })


@app.route('/health')
def health():
    key = os.getenv('GROQ_API_KEY', '').strip()
    skey = os.getenv('SERPAPI_KEY', '').strip()
    return jsonify({
        'status': 'ok',
        'groq_key_present': bool(key),
        'serpapi_key_present': bool(skey),
        'groq_key_preview': key[:8] + '...' if key else 'MISSING'
    })


@app.route('/api/verify', methods=['POST'])
def verify_claim():
    try:
        data = request.get_json()

        if not data or 'claim' not in data:
            return jsonify({'success': False, 'error': 'Missing claim field'}), 400

        claim = data['claim'].strip()

        if not claim:
            return jsonify({'success': False, 'error': 'Claim cannot be empty'}), 400
        if len(claim) < 10:
            return jsonify({'success': False, 'error': 'Claim too short (min 10 chars)'}), 400
        if len(claim) > 1000:
            return jsonify({'success': False, 'error': 'Claim too long (max 1000 chars)'}), 400

        print(f"\n{'='*50}")
        print(f"📋 Verifying: {claim}")
        print(f"{'='*50}")

        # Pipeline
        keywords = extract_keywords(claim)
        sources = search_evidence(keywords)
        analysis = analyze_claim(claim, sources)

        result = {
            'success': True,
            'data': {
                'verdict': analysis['verdict'],
                'score': analysis['score'],
                'explanation': analysis['explanation'],
                'verified_context': analysis.get('verified_context', ''),
                'sources': sources,
                'keywords': keywords
            },
            'timestamp': datetime.now().isoformat()
        }

        return jsonify(result)

    except Exception as e:
        print(f"❌ Server error: {e}")
        return jsonify({
            'success': False,
            'error': 'Internal server error. Please try again.',
            'timestamp': datetime.now().isoformat()
        }), 500


# ============================================
# START SERVER
# ============================================

if __name__ == '__main__':
    key = os.getenv('GROQ_API_KEY', '').strip()
    skey = os.getenv('SERPAPI_KEY', '').strip()
    print("\n" + "="*50)
    print("🚀 TruthLens API starting...")
    print(f"   Server: http://localhost:5000")
    print(f"   Health: http://localhost:5000/health")
    print(f"   AI Model: Groq Llama 3.3 70B")
    print(f"   Groq: {'✅ Ready (' + key[:8] + '...)' if key else '❌ No API key'}")
    print(f"   SerpAPI: {'✅ Ready' if skey else '❌ No API key'}")
    print("="*50 + "\n")
    app.run(debug=True, port=5000)
