# TruthLens — Master Implementation Plan (v4)

> Last updated: 2026-02-18

---

## Project Overview

**TruthLens** is an AI-powered misinformation detection platform with three core tools:

| Tool                      | Status      | Backend                           | Frontend                    |
| ------------------------- | ----------- | --------------------------------- | --------------------------- |
| 📰 Fake News Detector     | ✅ Complete | Flask + Groq + SerpAPI            | React + Framer Motion       |
| 🎣 Phishing Link Detector | ✅ Complete | Flask + Heuristics + WHOIS + Groq | React + Phishing components |
| 🖼️ Fake Image Detector    | ✅ Complete | Flask + Pillow + Groq Vision      | React + Image upload/URL    |

---

## Tech Stack (Finalized)

### Frontend

| Layer         | Technology                              |
| ------------- | --------------------------------------- |
| Framework     | React 18 + Vite 7                       |
| Styling       | Tailwind CSS v3 + CSS custom properties |
| Animations    | Framer Motion                           |
| Icons         | Lucide React                            |
| Notifications | React Hot Toast                         |
| HTTP          | Native fetch (Vite proxy → Flask)       |

### Backend

| Layer          | Technology                                      |
| -------------- | ----------------------------------------------- |
| Server         | Flask 3.0 + Flask-CORS + Flask-Limiter          |
| AI Text        | Groq API (Llama 3.3 70B)                        |
| AI Vision      | Groq API (Llama 3.2 11B Vision / Llama 4 Scout) |
| Search         | SerpAPI (Google News)                           |
| WHOIS          | python-whois (free, no key)                     |
| DNS            | dnspython (free, no key)                        |
| Image Analysis | Pillow (PIL)                                    |
| Scraping       | requests + BeautifulSoup4 + lxml                |
| Env            | python-dotenv                                   |

### APIs Used

| API                   | Free Tier          | Key Required              | Used For                  |
| --------------------- | ------------------ | ------------------------- | ------------------------- |
| Groq API              | ✅ Free            | Yes (configured)          | Text & Vision analysis    |
| SerpAPI               | ✅ Free tier       | Yes (configured)          | Fake News evidence search |
| Google Safe Browsing  | ✅ Free (10k/day)  | Yes (configured/optional) | Phishing detection        |
| python-whois          | ✅ Completely free | No                        | Domain age check          |
| SSL (Python built-in) | ✅ Free            | No                        | Certificate check         |
| Pillow (Python lib)   | ✅ Free            | No                        | EXIF & image stats        |

---

## Project Structure

```
ai-news-detector/
├── backend/
│   ├── app.py                    # ✅ Main Flask app (all 3 endpoints)
│   ├── requirements.txt          # ✅ All Python dependencies
│   ├── .env                      # ✅ API keys (gitignored)
│   └── .env.example              # ✅ Template
├── frontend/
│   ├── index.html                # ✅ Vite entry
│   ├── vite.config.js            # ✅ Proxy to Flask :5000
│   ├── tailwind.config.js        # ✅ Design tokens
│   ├── package.json
│   └── src/
│       ├── main.jsx              # ✅ React entry
│       ├── App.jsx               # ✅ Root + 3-tab routing + state
│       ├── index.css             # ✅ Tailwind + CSS vars
│       ├── lib/api.js            # ✅ API helpers (verify, phishing, image)
│       ├── hooks/hooks.js        # ✅ useTheme, useHistory (all types)
│       └── components/
│           ├── Navbar.jsx            # ✅ Centered navbar
│           ├── TabNav.jsx            # ✅ Pill tab bar
│           ├── ParticleCanvas.jsx    # ✅ Background FX
│           ├── BackgroundBlobs.jsx   # ✅ Background FX
│           ├── InputPanel.jsx        # ✅ News Input
│           ├── TextResult.jsx        # ✅ News Result (Text)
│           ├── UrlResult.jsx         # ✅ News Result (URL)
│           ├── PhishingInput.jsx     # ✅ Phishing Input
│           ├── PhishingResult.jsx    # ✅ Phishing Result
│           ├── ImageInput.jsx        # ✅ Image Input (File/URL)
│           ├── ImageResult.jsx       # ✅ Image Result
│           ├── ScoreRing.jsx         # ✅ Inverted color support
│           ├── VerdictBadge.jsx      # ✅ Verdict badge
│           ├── SourcesList.jsx       # ✅ Evidence sources
│           ├── KeyClaims.jsx         # ✅ Per-claim verdicts
│           ├── RedFlags.jsx          # ✅ Red flag list
│           ├── HistorySidebar.jsx    # ✅ Supports all 3 types
│           └── LoadingCard.jsx       # ✅ Skeleton loader
└── plans/
    ├── MASTER_IMPLEMENTATION_PLAN.md  # ✅ This file
    ├── UI_IMPLEMENTATION_PLAN.md      # ✅ React UI plan
    └── URL_FEATURE_PLAN.md            # ✅ URL analysis plan
```

---

## ✅ Feature 1: Fake News Detector (Complete)

### Backend (`/api/verify`)

- **Input**: Text claim or Article URL
- **Logic**:
  - Text: Keyword extraction → SerpAPI search → Groq fact-check
  - URL: Scrape content → Groq credibility analysis
- **Output**: Verdict (Real/Fake), Credibility Score (0-100), Sources, Key Claims

### Frontend

- Split-panel layout (Input left / Result right)
- Animated score ring (High score = Green)
- Evidence sources list

---

## ✅ Feature 2: Phishing Link Detector (Complete)

### Backend (`/api/phishing`)

- **Input**: URL
- **Logic (5 Layers)**:
  1. **Heuristics**: URL patterns (IP host, lookalikes, keywords)
  2. **WHOIS**: Domain age check (<30 days = suspicious)
  3. **SSL**: Certificate validity & issuer check
  4. **Google Safe Browsing**: Checks against phishing DB
  5. **Groq AI**: Summarizes signals & identifies attack type
- **Output**: Verdict (Safe/Suspicious/Dangerous), Risk Score (0-100), Signals

### Frontend

- Warning-themed input & result
- Inverted score ring (High score = Red)
- Detailed signal checklist

---

## ✅ Feature 3: Fake Image Detector (Complete)

### Backend (`/api/image`)

- **Input**: File upload (multipart) OR Image URL (JSON)
- **Logic (3 Layers)**:
  1. **EXIF Analysis**: Extract camera make/model, software signatures (e.g., "Midjourney"), GPS
  2. **Statistical Analysis**: Check for specific noise/histogram patterns
  3. **Groq Vision AI**: Visual inspection for artifacts (hands, lighting, text, textures)
- **Output**: Verdict (Likely Real/Uncertain/Likely AI), AI Probability (0-100), EXIF data

### Frontend

- Drag-and-drop file upload zone
- Toggle for Image URL input
- Image preview
- Inverted score ring (High probability = Red)
- EXIF data table

---

## ✅ Feature 4: Deepfake Audio Detector (Complete)

### Backend (`/api/audio`)

- **Input**: Audio file (`.mp3`, `.wav`, etc.)
- **Logic (Hybrid)**:
  1.  **Acoustic Forensics (`librosa`)**:
      - **Digital Silence**: Detects unnatural "absolute zero" silence.
      - **Spectral Roll-off**: Detects sharp frequency cutoffs (8kHz/16kHz) typical of low-quality synthesis.
      - **Pitch Stability**: Detects lack of natural micro-tremors.
  2.  **Content Analysis (Groq)**:
      - **Transcription**: Uses `distil-whisper-large-v3-en` to get text.
      - **Intent Check**: Uses `llama-3.3` to detect scam patterns ("send money", urgency).
- **Output**: Verdict, Transcription, Acoustic Signals, Risk Score.

### Frontend

- Audio drag-and-drop zone.
- In-browser audio preview player.
- Transcript display with copy button.
- Detailed acoustic signal list.

---

## Future Roadmap (Next Steps)

1. **User Accounts**: Add authentication (Supabase/Firebase) to save history to cloud.
2. **Batch Processing**: Allow bulk checking of URLs or images.
3. **Browser Extension**: Bring detection to the browser context menu.
4. **Mobile App**: React Native version.

---

## Running the App

```bash
# Terminal 1 — Backend
cd backend
python app.py          # http://localhost:5000

# Terminal 2 — Frontend
cd frontend
npm run dev            # http://localhost:5173
```
