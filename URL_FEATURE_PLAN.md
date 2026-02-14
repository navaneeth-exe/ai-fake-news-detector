# 🌐 URL Analysis Feature — Implementation Plan

## Overview

Add the ability to analyze URLs/article links in addition to text claims.
When a user pastes a URL, TruthLens will scrape the article and perform
credibility analysis, bias detection, and fact-checking of key claims.

---

## Files to Modify

| File                       | Changes                                           |
| -------------------------- | ------------------------------------------------- |
| `backend/requirements.txt` | Add beautifulsoup4, lxml                          |
| `backend/app.py`           | Add URL detection, scraping, credibility analysis |
| `frontend/index.html`      | Update placeholder, add URL examples              |
| `frontend/script.js`       | Add URL detection, URL result display             |
| `frontend/style.css`       | Add URL-specific styles                           |

---

## Step-by-Step Plan

### STEP 1 — Install Dependencies (2 min)

- Add `beautifulsoup4==4.12.3` and `lxml==5.1.0` to `requirements.txt`
- Run `pip install -r backend/requirements.txt`
- **Done when:** `from bs4 import BeautifulSoup` works without error

### STEP 2 — Backend: URL Detection (5 min)

- Add `is_valid_url(text)` function to `app.py`
- Uses regex or urllib.parse to check if input is a URL
- Must handle http://, https://, and www. prefixes
- **Done when:** Function correctly identifies URLs vs text claims

### STEP 3 — Backend: Article Scraping (15 min)

- Add `fetch_article_content(url)` function to `app.py`
- Uses `requests` + `BeautifulSoup` to scrape the URL
- Extracts: title, author, date, article text, domain
- 15-second timeout, handles errors (404, blocked, timeout)
- Returns structured dict with extracted data
- **Done when:** Function returns article data for a BBC article URL

### STEP 4 — Backend: URL Credibility Analysis (15 min)

- Add `analyze_url_credibility(url, content_data)` function
- Uses Groq AI to analyze:
  - Factual accuracy
  - Bias detection (political, commercial, neutral)
  - Sensationalism score
  - Source quality (citations, author credentials)
  - Red flags (clickbait, unverified claims, logical fallacies)
- Returns JSON with credibility_score, verdict, bias, analysis, red_flags
- **Done when:** Function returns structured analysis for a test URL

### STEP 5 — Backend: Key Claims Extraction & Verification (15 min)

- Add `extract_and_verify_claims(article_text, url)` function
- Uses Groq AI to extract 2-3 key factual claims from article
- For each claim: search evidence via SerpAPI + verify via Groq
- Returns list of {claim, verdict, sources}
- **Done when:** Function extracts and verifies claims from a test article

### STEP 6 — Backend: Update /api/verify Route (10 min)

- Modify `verify_claim()` route to detect URL vs text
- If URL → call URL pipeline (scrape → analyze → verify claims)
- If text → call existing text pipeline (unchanged)
- Add `input_type` field to response ("url" or "text")
- Return URL-specific response format
- **Done when:** POST with a URL returns full credibility analysis

### STEP 7 — Frontend: Update HTML (5 min)

- Update textarea placeholder: "Enter a news claim OR paste a URL..."
- Add 1-2 URL example buttons alongside existing text examples
- Add URL result container sections (hidden by default)
- **Done when:** UI shows both text and URL examples

### STEP 8 — Frontend: URL Detection & Display (15 min)

- Update `verifyClaim()` in script.js to detect URL input
- Show appropriate loading message ("Fetching article..." for URLs)
- Create `displayUrlResults(data)` function:
  - Shows article title + domain badge
  - Credibility score with colored meter
  - Bias indicator
  - Red flags list
  - Key claims with individual verdicts
  - Detailed analysis sections
- **Done when:** URL analysis results display properly in browser

### STEP 9 — Frontend: URL-Specific CSS (10 min)

- Add styles for domain badge/chip
- Bias indicator colors
- Red flags alert box styling
- Article metadata section
- Key claims cards
- Keep consistent with existing color scheme
- **Done when:** URL results look clean and match existing design

### STEP 10 — Testing (10 min)

- Test with reputable news URL (BBC, Reuters)
- Test with known questionable source
- Test with invalid URL (should show error)
- Test with text claim (should still work as before)
- **Done when:** All test cases pass

---

## Response Format for URL Analysis

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
    "credibility_score": 75,
    "verdict": "MOSTLY_CREDIBLE",
    "bias_detected": "neutral",
    "analysis": {
      "accuracy": "...",
      "bias": "...",
      "sensationalism": "...",
      "quality": "..."
    },
    "red_flags": ["flag1", "flag2"],
    "key_claims": [
      {
        "claim": "extracted claim text",
        "verdict": "VERIFIED",
        "sources": [{ "title": "...", "link": "...", "snippet": "..." }]
      }
    ]
  }
}
```

## Existing text claim response stays the same:

```json
{
  "success": true,
  "input_type": "text",
  "data": {
    "verdict": "REAL|FAKE|UNCERTAIN",
    "score": 0-100,
    "explanation": "...",
    "sources": [...],
    "keywords": [...]
  }
}
```

---

## Key Rules

- DO NOT break existing text claim verification
- Use same Groq client and error patterns
- Keep same color scheme
- Log with emojis like existing code
- 15-second timeout for URL fetching
- Handle paywalled/blocked sites gracefully
