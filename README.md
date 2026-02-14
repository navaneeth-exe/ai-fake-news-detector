# 🔍 TruthLens — AI-Powered Fake News Detector

> Verify any news claim or article URL in seconds using AI and real-time web evidence.

![Python](https://img.shields.io/badge/Python-3.9+-3776ab?logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-3.0-000000?logo=flask)
![Groq](https://img.shields.io/badge/AI-Groq%20Llama%203.3-f55036)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

### 📝 Text Claim Verification

Enter any news claim in plain text and get:

- **Verdict** — REAL ✅, FAKE ❌, or UNCERTAIN ⚠️
- **Truth Score** — 0 to 100 confidence rating
- **AI Explanation** — Why the claim is true or false
- **Source Links** — Real news articles used as evidence

### 🌐 URL Article Analysis

Paste any article URL and get:

- **Credibility Score** — 0 to 100 rating of the article
- **Bias Detection** — Neutral, Left, Right, Commercial, or Sensationalist
- **Red Flags** — Clickbait, unverified claims, logical fallacies
- **Key Claims Verified** — Individual fact-checking of claims in the article

---

## 🛠️ Tech Stack

| Layer        | Technology               | Purpose                             |
| ------------ | ------------------------ | ----------------------------------- |
| **Frontend** | HTML5, CSS3, JavaScript  | User interface                      |
| **Backend**  | Python, Flask            | REST API server                     |
| **AI Model** | Groq API (Llama 3.3 70B) | Fact analysis & credibility scoring |
| **Search**   | SerpAPI                  | Real-time Google News evidence      |
| **Scraping** | BeautifulSoup + lxml     | Article content extraction          |

---

## 🏗️ Architecture

```
User Input (Text or URL)
         │
         ▼
┌─────────────────────┐
│   Flask Backend      │
│   (localhost:5000)   │
└────────┬────────────┘
         │
    ┌────┴────┐
    ▼         ▼
  TEXT       URL
    │         │
    ▼         ▼
 Extract    Scrape article
 Keywords   (BeautifulSoup)
    │         │
    ▼         ▼
 Search     AI Credibility
 Evidence   Analysis (Groq)
 (SerpAPI)    │
    │         ▼
    ▼       Extract & Verify
 AI Fact    Key Claims
 Analysis     │
 (Groq)       │
    │         │
    ▼         ▼
┌─────────────────────┐
│  Results displayed   │
│  in Browser          │
└─────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- Python 3.9 or higher
- A [Groq API key](https://console.groq.com/keys) (free)
- A [SerpAPI key](https://serpapi.com/users/sign_up) (100 free searches/month)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/navaneeth-exe/ai-fake-news-detector.git
cd ai-fake-news-detector

# 2. Create virtual environment
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

# 3. Install dependencies
pip install -r backend/requirements.txt

# 4. Set up API keys
cp backend/.env.example backend/.env
# Edit backend/.env and add your keys:
#   GROQ_API_KEY=your_groq_key_here
#   SERPAPI_KEY=your_serpapi_key_here

# 5. Start the server
python backend/app.py

# 6. Open frontend/index.html in your browser
```

The server runs at `http://localhost:5000`. Open `frontend/index.html` directly in your browser.

---

## 📡 API Endpoints

| Method | Endpoint      | Description                     |
| ------ | ------------- | ------------------------------- |
| `GET`  | `/`           | API info                        |
| `GET`  | `/health`     | Health check & key status       |
| `POST` | `/api/verify` | Verify a claim or analyze a URL |

### Request

```json
POST /api/verify
Content-Type: application/json

{
  "claim": "The Earth is flat"
}
```

Or with a URL:

```json
{
  "claim": "https://www.bbc.com/news/some-article"
}
```

### Response — Text Claim

```json
{
  "success": true,
  "input_type": "text",
  "data": {
    "verdict": "FAKE",
    "score": 5,
    "explanation": "The claim that the Earth is flat contradicts scientific evidence...",
    "verified_context": "The Earth is an oblate spheroid...",
    "sources": [
      {
        "title": "Earth's shape explained",
        "link": "https://...",
        "snippet": "..."
      }
    ],
    "keywords": ["Earth", "flat", "shape"]
  }
}
```

### Response — URL Analysis

```json
{
  "success": true,
  "input_type": "url",
  "data": {
    "url": "https://example.com/article",
    "domain": "example.com",
    "article": {
      "title": "Article Headline",
      "author": "Author Name",
      "date": "2026-02-14",
      "excerpt": "First 200 characters..."
    },
    "credibility_score": 82,
    "verdict": "MOSTLY_CREDIBLE",
    "bias_detected": "neutral",
    "analysis": {
      "accuracy": "Claims are well-sourced...",
      "bias": "No significant bias detected...",
      "sensationalism": "Headline is factual...",
      "quality": "Well-written with proper citations..."
    },
    "red_flags": [],
    "key_claims": [
      {
        "claim": "A key fact from the article",
        "verdict": "VERIFIED",
        "sources": [...]
      }
    ]
  }
}
```

---

## 📁 Project Structure

```
ai-news-detector/
├── backend/
│   ├── app.py              # Flask API server (all backend logic)
│   ├── requirements.txt    # Python dependencies
│   ├── .env                # API keys (git-ignored)
│   └── .env.example        # API key template
│
├── frontend/
│   ├── index.html          # Main UI page
│   ├── style.css           # Styling
│   └── script.js           # Frontend logic
│
├── .gitignore
└── README.md
```

---

## 🧪 Test Claims

| Claim                                                  | Expected Result     |
| ------------------------------------------------------ | ------------------- |
| "The Earth is flat"                                    | ❌ FAKE (score ~5)  |
| "Water boils at 100 degrees Celsius at sea level"      | ✅ REAL (score ~95) |
| "NASA confirmed an asteroid will hit Earth next year"  | ❌ FAKE (score ~0)  |
| "India landed a spacecraft near the Moon's south pole" | ✅ REAL (score ~90) |
| "Humans only use 10 percent of their brain"            | ❌ FAKE (score ~15) |

---

## 🔑 API Keys

| Service     | Free Tier          | Get Key                                                |
| ----------- | ------------------ | ------------------------------------------------------ |
| **Groq**    | 30 requests/min    | [console.groq.com/keys](https://console.groq.com/keys) |
| **SerpAPI** | 100 searches/month | [serpapi.com](https://serpapi.com/users/sign_up)       |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -m 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Navaneeth** — [@navaneeth-exe](https://github.com/navaneeth-exe)

---

_Built with ❤️ for fighting misinformation_
