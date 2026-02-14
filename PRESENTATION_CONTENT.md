# 🔍 TruthLens — AI-Powered Fake News Detector

## Complete Project Documentation for Presentation

---

## 📌 SLIDE 1: Title Slide

**Project Name:** TruthLens — AI Fake News Detector
**Tagline:** "Verify any news claim in seconds using AI and real-time web evidence"
**Team:** [Your Team Name]
**Event:** [Hackathon Name]
**Date:** February 2026
**GitHub:** https://github.com/navaneeth-exe/ai-fake-news-detector

---

## 📌 SLIDE 2: Problem Statement

### The Problem

- **Fake news spreads 6x faster** than real news on social media (MIT Study, 2018)
- **67% of social media users** have encountered misinformation online
- People lack quick, reliable tools to verify claims they see online
- Manual fact-checking is time-consuming and requires expertise
- Existing fact-check websites are slow and don't cover all topics

### Why It Matters

- Fake news influences elections, public health decisions, and social harmony
- During COVID-19, misinformation led to widespread health risks
- There's a growing need for **instant, AI-powered verification**

---

## 📌 SLIDE 3: Our Solution

### TruthLens — Instant AI Fact-Checking

A web application that allows users to:

1. **Enter any news claim** in plain text
2. **Get an instant verdict** — REAL ✅, FAKE ❌, or UNCERTAIN ⚠️
3. **See a confidence score** (0-100)
4. **Read an AI explanation** of why the claim is true or false
5. **View source articles** from the web as evidence

### Key Differentiators

- ⚡ **Real-time** — Results in 5-10 seconds
- 🌐 **Live web evidence** — Searches real news articles, not a static database
- 🤖 **AI-powered analysis** — Uses LLM to cross-reference claim against evidence
- 🎯 **Simple UI** — Anyone can use it, no technical knowledge needed

---

## 📌 SLIDE 4: How It Works (Architecture)

### System Flow

```
User enters claim
       ↓
┌──────────────────┐
│   Frontend       │  HTML/CSS/JS
│   (Browser)      │  User Interface
└──────┬───────────┘
       │ POST /api/verify
       ↓
┌──────────────────┐
│   Flask Backend   │  Python API Server
│   (Port 5000)     │
└──────┬───────────┘
       │
       ├──→ Step 1: KEYWORD EXTRACTION
       │    Groq AI extracts 3-5 search keywords
       │
       ├──→ Step 2: EVIDENCE SEARCH
       │    SerpAPI searches Google News for articles
       │
       ├──→ Step 3: FACT ANALYSIS
       │    Groq AI compares claim vs. evidence
       │    Returns verdict + score + explanation
       │
       ↓
┌──────────────────┐
│   Results shown   │  Verdict, Score, Explanation
│   in Browser      │  + Source Links
└──────────────────┘
```

### 3-Step AI Pipeline:

1. **Extract** → AI pulls key searchable terms from the claim
2. **Search** → SerpAPI finds real news articles as evidence
3. **Analyze** → AI cross-references the claim against evidence and gives a verdict

---

## 📌 SLIDE 5: Tech Stack

| Layer               | Technology                  | Purpose                            |
| ------------------- | --------------------------- | ---------------------------------- |
| **Frontend**        | HTML5, CSS3, JavaScript ES6 | User Interface                     |
| **Backend**         | Python 3.9+, Flask          | API Server                         |
| **AI Model**        | Groq API (Llama 3.3 70B)    | Keyword extraction & Fact analysis |
| **Search**          | SerpAPI (Google News)       | Real-time evidence gathering       |
| **Cross-Origin**    | Flask-CORS                  | Frontend-backend communication     |
| **Config**          | python-dotenv               | API key management                 |
| **Version Control** | Git + GitHub                | Source code management             |

### Why These Technologies?

- **Flask** — Lightweight, fast to develop, perfect for APIs
- **Groq + Llama 3.3** — Free, extremely fast inference (fastest AI API available)
- **SerpAPI** — Reliable Google search results via API
- **Vanilla HTML/CSS/JS** — No framework overhead, loads instantly

---

## 📌 SLIDE 6: Features

### Core Features

| Feature                    | Description                                      |
| -------------------------- | ------------------------------------------------ |
| 🔍 **Claim Verification**  | Enter any text claim and get instant AI analysis |
| ✅❌⚠️ **3-Level Verdict** | REAL (70-100), UNCERTAIN (31-69), FAKE (0-30)    |
| 📊 **Confidence Score**    | 0-100 score with visual progress bar             |
| 💡 **AI Explanation**      | 2-3 sentence explanation of the verdict          |
| 📰 **Source Links**        | Clickable news article sources used as evidence  |
| 📝 **Example Claims**      | Pre-loaded examples for quick testing            |
| ⏳ **Loading States**      | Visual feedback during AI processing             |
| ⚡ **Input Validation**    | Min/max length checks, empty input prevention    |
| 🎨 **Color-Coded Results** | Green (REAL), Red (FAKE), Orange (UNCERTAIN)     |
| ⌨️ **Keyboard Shortcut**   | Ctrl+Enter to submit                             |

---

## 📌 SLIDE 7: Live Demo Screenshots

### Demo Flow:

1. **Home Screen** — Clean input with example suggestions
2. **Loading State** — Spinner + "Analyzing claim..." message
3. **FAKE Result** — Red verdict for "The Earth is flat"
4. **REAL Result** — Green verdict for "Water boils at 100°C at sea level"
5. **UNCERTAIN Result** — Orange verdict for edge cases

### Demo Claims to Show:

| Claim                                             | Expected Verdict            |
| ------------------------------------------------- | --------------------------- |
| "The Earth is flat"                               | ❌ FAKE (score ~5-15)       |
| "Water boils at 100 degrees Celsius at sea level" | ✅ REAL (score ~85-95)      |
| "Humans only use 10 percent of their brain"       | ❌ FAKE (score ~10-25)      |
| "The Great Wall of China is visible from space"   | ⚠️ UNCERTAIN (score ~35-50) |

---

## 📌 SLIDE 8: Project Structure

```
ai-news-detector/
│
├── backend/
│   ├── app.py              ← Complete Flask API (all logic)
│   ├── requirements.txt    ← Python dependencies
│   ├── .env                ← API keys (not in git)
│   └── .env.example        ← API key template
│
├── frontend/
│   ├── index.html          ← Main page UI
│   ├── style.css           ← Styling
│   └── script.js           ← Frontend logic
│
├── .gitignore              ← Excludes venv, .env, cache
├── IMPLEMENTATION_PLAN.md  ← Step-by-step build guide
└── README.md               ← Setup instructions
```

**Total Lines of Code:**

- `app.py` — ~280 lines (backend)
- `script.js` — ~120 lines (frontend logic)
- `index.html` — ~60 lines (UI structure)
- `style.css` — ~200 lines (styling)
- **Total: ~660 lines**

---

## 📌 SLIDE 9: API Design

### Endpoints

| Method | Endpoint      | Purpose                   |
| ------ | ------------- | ------------------------- |
| GET    | `/`           | API info                  |
| GET    | `/health`     | Health check + key status |
| POST   | `/api/verify` | **Main — verify a claim** |

### Request Format

```json
POST /api/verify
{
  "claim": "The Earth is flat"
}
```

### Response Format

```json
{
  "success": true,
  "data": {
    "verdict": "FAKE",
    "score": 8,
    "explanation": "The claim that the Earth is flat is false. Scientific evidence overwhelmingly supports that the Earth is an oblate spheroid.",
    "verified_context": "The Earth's spherical shape has been confirmed through satellite imagery, physics, and centuries of scientific observation.",
    "sources": [
      {
        "title": "Flat Earth debunked by science",
        "link": "https://example.com/article",
        "snippet": "Scientists explain why..."
      }
    ],
    "keywords": ["Earth", "flat", "shape", "science"]
  },
  "timestamp": "2026-02-14T16:42:00"
}
```

---

## 📌 SLIDE 10: AI Pipeline Details

### Step 1: Keyword Extraction

- **Model:** Llama 3.3 70B (via Groq)
- **Prompt:** "Extract 3-5 concise, searchable keywords from this claim"
- **Example:** "COVID vaccines contain microchips" → `["COVID", "vaccines", "microchips", "health"]`

### Step 2: Evidence Search

- **API:** SerpAPI (Google News search)
- **Returns:** Top 5 news articles with title, snippet, and link
- **Fallback:** If no news results, searches organic Google results

### Step 3: Fact Analysis

- **Model:** Llama 3.3 70B (via Groq)
- **Input:** Original claim + evidence snippets
- **Output:** JSON with verdict, score, explanation, and context
- **Scoring:** 0-30 = FAKE, 31-69 = UNCERTAIN, 70-100 = REAL

### Error Handling

- If keyword extraction fails → uses raw claim as search query
- If search fails → analyzes with just the claim (no evidence)
- If AI analysis fails → returns UNCERTAIN with error message
- All errors are logged to server console

---

## 📌 SLIDE 11: Challenges Faced

| Challenge                                    | Solution                                      |
| -------------------------------------------- | --------------------------------------------- |
| API rate limiting                            | Switched from Gemini to Groq (higher limits)  |
| .env file not loading                        | Used `pathlib` for reliable path resolution   |
| Flask debug reloader losing global variables | Lazy initialization pattern for AI model      |
| Gemini model name deprecated                 | Updated to latest model + upgraded SDK        |
| CORS blocking frontend requests              | Added Flask-CORS middleware                   |
| AI returning markdown instead of JSON        | Regex cleanup to strip code blocks            |
| Slow response times                          | Show loading spinner, async fetch in frontend |

---

## 📌 SLIDE 12: Future Enhancements

### Short-Term (If Time Permits)

- 🌙 Dark mode toggle
- 📋 Copy result to clipboard
- 📜 History of checked claims (localStorage)
- 🔗 Shareable result links
- 📊 Better score visualization (gauge/meter)

### Long-Term (Production)

- 🗄️ Database to store verification history
- 👤 User accounts and saved results
- 🌍 Multi-language support
- 📱 Mobile app (React Native)
- 🔄 Browser extension for instant verification
- 📈 Dashboard with trending misinformation
- 🤝 Community reporting and voting system

---

## 📌 SLIDE 13: Impact & Use Cases

### Who Can Use This?

- **Students** — Verify claims for research papers
- **Journalists** — Quick initial fact-check before publishing
- **Social Media Users** — Check viral posts before sharing
- **Educators** — Teach media literacy to students
- **General Public** — Anyone who reads news online

### Social Impact

- Reduces spread of misinformation
- Promotes critical thinking
- Makes fact-checking accessible to everyone
- Supports informed decision-making

---

## 📌 SLIDE 14: Demo Script (2 Minutes)

**[0:00 - 0:15]** Introduction

> "We built TruthLens — an AI-powered tool that verifies any news claim in seconds using real-time web evidence."

**[0:15 - 0:45]** Show FAKE claim

> "Let me show you. I'll type 'The Earth is flat'... click Verify... and in a few seconds — FAKE, score 8 out of 100, with an explanation and source links."

**[0:45 - 1:15]** Show REAL claim

> "Now a true claim — 'Water boils at 100 degrees Celsius at sea level'... REAL, score 92. It found news and science articles confirming this."

**[1:15 - 1:45]** How it works

> "Under the hood: Groq AI extracts keywords, SerpAPI searches Google News for evidence, then AI analyzes the claim against that evidence."

**[1:45 - 2:00]** Closing

> "Built in under 4 hours with Python, Flask, Groq AI, and SerpAPI. It's open source on GitHub. Thank you!"

---

## 📌 SLIDE 15: Thank You

**TruthLens** — Verify Before You Share 🔍

- **GitHub:** https://github.com/navaneeth-exe/ai-fake-news-detector
- **Tech:** Python · Flask · Groq AI · SerpAPI
- **Team:** [Your Names]

_Thank you for listening! Questions?_

---

## 📎 Additional Reference

### How to Run Locally

```bash
# 1. Clone the repo
git clone https://github.com/navaneeth-exe/ai-fake-news-detector.git

# 2. Setup virtual environment
cd ai-fake-news-detector
python -m venv venv
venv\Scripts\activate          # Windows

# 3. Install dependencies
pip install -r backend/requirements.txt

# 4. Add API keys to backend/.env
GROQ_API_KEY=your_key_here
SERPAPI_KEY=your_key_here

# 5. Start server
python backend/app.py

# 6. Open frontend/index.html in browser
```

### API Keys (Free)

- **Groq:** https://console.groq.com/keys (30 req/min free)
- **SerpAPI:** https://serpapi.com/users/sign_up (100 searches/month free)
