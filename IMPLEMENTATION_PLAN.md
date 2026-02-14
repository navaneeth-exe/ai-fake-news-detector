# 🎯 TruthLens - Implementation Plan

## AI Fake News Detector — Hackathon Build

> **Goal:** Get a WORKING demo as fast as possible. Functionality > Design.

---

## 📁 Final Project Structure

```
ai-news-detector/
├── backend/
│   ├── app.py              # Flask API (all backend logic in ONE file)
│   ├── requirements.txt    # Python dependencies
│   ├── .env                # API keys (DO NOT commit)
│   └── .env.example        # Template for API keys
├── frontend/
│   ├── index.html          # Main page
│   ├── style.css           # Styles
│   └── script.js           # Frontend logic
└── README.md               # Setup instructions
```

---

## ⏱️ Step-by-Step Plan (Total: ~4 hours)

---

### STEP 1 — Project Setup (15 min)

**What to do:**

1. Create folder structure:

   ```bash
   mkdir backend frontend
   ```

2. Create `backend/requirements.txt`:

   ```
   Flask==3.0.0
   Flask-CORS==4.0.0
   python-dotenv==1.0.0
   google-generativeai==0.3.2
   serpapi==0.1.5
   requests==2.31.0
   ```

3. Create `backend/.env.example`:

   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   SERPAPI_KEY=your_serpapi_key_here
   ```

4. Setup virtual environment & install:
   ```bash
   python -m venv venv
   venv\Scripts\activate        # Windows
   pip install -r backend/requirements.txt
   ```

**✅ Done when:** `pip list` shows Flask installed.

---

### STEP 2 — Basic Flask Server (20 min)

**What to do:**
Create `backend/app.py` with:

- Flask app with CORS enabled
- `GET /health` → returns `{"status": "ok"}`
- `GET /` → returns basic info
- Runs on port 5000, debug mode ON

**✅ Done when:** Opening `http://localhost:5000/health` in browser shows JSON response.

**Test:**

```bash
python backend/app.py
# Then visit http://localhost:5000/health
```

---

### STEP 3 — Frontend UI (30 min)

**What to do:**

Create 3 files:

1. `frontend/index.html`:
   - Textarea for claim input (`id="claimInput"`)
   - Verify button (`id="verifyBtn"`)
   - Result container (`id="resultContainer"`, hidden)
   - Link to style.css and script.js

2. `frontend/style.css`:
   - Simple centered layout, max-width 600px
   - Basic colors: blue button, green/red/orange for verdicts
   - Keep it MINIMAL — don't spend time on fancy design

3. `frontend/script.js`:
   - Empty for now (just a placeholder file)

**✅ Done when:** Opening `index.html` in browser shows a textarea and button.

---

### STEP 4 — Connect Frontend to Backend (20 min)

**What to do:**

1. Update `frontend/script.js`:
   - Button click → sends POST to `http://localhost:5000/api/verify`
   - Sends JSON: `{"claim": "user input text"}`
   - Console.log the response

2. Add to `backend/app.py`:
   - `POST /api/verify` route
   - Validate input (not empty, max 500 chars)
   - Return **MOCK** response:
     ```json
     {
       "success": true,
       "data": {
         "verdict": "REAL",
         "score": 85,
         "explanation": "This is a test response.",
         "sources": [
           {
             "title": "Test Source",
             "link": "https://example.com",
             "snippet": "Test"
           }
         ]
       }
     }
     ```

**✅ Done when:** Clicking Verify → browser console shows the mock JSON.

**Test:**

```bash
# Terminal 1: Start backend
python backend/app.py

# Open frontend/index.html in browser
# Type any claim, click Verify
# Check browser console (F12) for response
```

---

### STEP 5 — Gemini Keyword Extraction (30 min)

**What to do:**

1. Create `backend/.env` with your real Gemini API key

2. Add to `backend/app.py`:
   - Import `google.generativeai`
   - Load API key from `.env`
   - Create `extract_keywords(claim)` function:
     - Prompt: "Extract 3-5 searchable keywords from this claim. Return ONLY keywords separated by commas."
     - Model: `gemini-1.5-flash`
     - Returns list of keywords

3. Call it in `/api/verify` and print keywords to terminal

**🔑 Get API Key:** https://makersuite.google.com/app/apikey

**✅ Done when:** Terminal shows extracted keywords when you submit a claim.

---

### STEP 6 — SerpAPI Search (25 min)

**What to do:**

1. Add SerpAPI key to `backend/.env`

2. Add to `backend/app.py`:
   - Create `search_evidence(keywords)` function:
     - Call SerpAPI with keywords joined as query
     - Use `engine: "google"`, `tbm: "nws"` (news), `num: 5`
     - Return list of `{title, snippet, link}` dicts
     - Handle errors (return empty list on failure)

3. Call it in `/api/verify` and print results to terminal

**🔑 Get API Key:** https://serpapi.com/users/sign_up (free: 100 searches/month)

**✅ Done when:** Terminal shows 5 news article results for a claim.

---

### STEP 7 — Gemini Fact Analysis (40 min)

**What to do:**

Add to `backend/app.py`:

- Create `analyze_claim(claim, evidence)` function:
  - Build prompt with claim + evidence snippets
  - Ask Gemini to return JSON:
    ```json
    {
      "verdict": "REAL|FAKE|UNCERTAIN",
      "score": 0-100,
      "explanation": "2-3 sentences",
      "verified_context": "brief context"
    }
    ```
  - Parse the JSON response (strip markdown blocks if needed)
  - Handle parse errors with fallback defaults

**Key prompt rules:**

- Tell Gemini: "Return ONLY valid JSON, no markdown"
- Score: 0-30 = FAKE, 31-69 = UNCERTAIN, 70-100 = REAL
- Strip `json and ` from response before parsing

**✅ Done when:** Function returns proper verdict JSON for a test claim.

---

### STEP 8 — Complete Pipeline (30 min)

**What to do:**

Update `/api/verify` route to chain everything:

```
Receive claim → Extract keywords → Search evidence → Analyze → Return result
```

Full response format:

```json
{
  "success": true,
  "data": {
    "verdict": "REAL",
    "score": 85,
    "explanation": "...",
    "verified_context": "...",
    "sources": [...],
    "keywords": [...]
  }
}
```

Add proper error handling:

- If keyword extraction fails → use claim as search query
- If search fails → analyze with just the claim
- If analysis fails → return error JSON

**✅ Done when:** Full pipeline works end-to-end via curl:

```bash
curl -X POST http://localhost:5000/api/verify -H "Content-Type: application/json" -d "{\"claim\":\"Water boils at 100 degrees\"}"
```

**Test with 3 claims:**

1. "The Earth is flat" → should be FAKE
2. "Water boils at 100°C" → should be REAL
3. "Aliens built the pyramids" → should be UNCERTAIN/FAKE

---

### STEP 9 — Display Results in UI (30 min)

**What to do:**

1. Update `frontend/script.js`:
   - Remove console.log, display results in `#resultContainer`
   - Show verdict with color (green=REAL, red=FAKE, orange=UNCERTAIN)
   - Show score as number or simple bar
   - Show explanation text
   - List sources as clickable links

2. Update `frontend/style.css`:
   - Verdict badge colors
   - Source link styles
   - Basic spacing and layout

3. Update `frontend/index.html`:
   - Add result sections: verdict, score, explanation, sources

**✅ Done when:** Submitting a claim shows colored verdict with sources in the browser.

---

### STEP 10 — Loading State & Basic Polish (20 min)

**What to do:**

1. Add to `frontend/script.js`:
   - Show "Verifying..." text during API call
   - Disable button while loading
   - Basic input validation (not empty)
   - Clear previous results before new search
   - Handle errors (show "Something went wrong")

2. Add to `frontend/index.html`:
   - Loading indicator element
   - 3-5 example claims as clickable suggestions

3. Quick CSS fixes:
   - Loading state style
   - Disabled button style

**✅ Done when:** Full user flow works smoothly: type → verify → see loading → see results.

---

## 🚨 Common Pitfalls to Avoid

| Problem                 | Solution                                      |
| ----------------------- | --------------------------------------------- |
| CORS error              | Make sure `CORS(app)` is in app.py            |
| .env not loading        | Call `load_dotenv()` before accessing keys    |
| Gemini returns markdown | Strip `json and ` before parsing              |
| SerpAPI 403             | Check API key and quota                       |
| Empty results           | Use claim as fallback search query            |
| Slow response           | Gemini + SerpAPI can take 5-10s, show loading |

---

## 🎤 Demo Prep (After Step 10)

### Have these 3 claims ready:

1. **FAKE:** "COVID-19 vaccines contain 5G microchips"
2. **REAL:** "The Earth revolves around the Sun"
3. **UNCERTAIN:** "The Great Wall of China is visible from space"

### 2-Minute Demo Script:

- **30s:** "TruthLens verifies news claims using AI and live web evidence."
- **60s:** Live demo with 2 claims (show FAKE then REAL)
- **30s:** "Built with Flask, Gemini AI, SerpAPI. Full-stack in under 4 hours."

---

## ✅ Final Checklist Before Demo

- [ ] Backend running on port 5000
- [ ] Frontend opens and looks clean
- [ ] Can type a claim and click Verify
- [ ] Loading state shows during processing
- [ ] Verdict displays with correct color
- [ ] Score shows
- [ ] Explanation is readable
- [ ] At least 1 source link is clickable
- [ ] Error handling works (try empty input)
- [ ] Tested on the demo machine/browser

**If all boxes are checked → YOU'RE READY! 🏆**
