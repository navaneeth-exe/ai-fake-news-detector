# 🎯 TruthLens - AI Fake News Detector

## ULTRA-ENHANCED Hackathon Project Build Instructions for AI Assistants

---

## 🚨 MANDATORY ACKNOWLEDGMENT

**BEFORE YOU START, RESPOND WITH:**
"I understand. I will complete ONLY Step [NUMBER] and then STOP and wait for your 'NEXT' command. I will not jump ahead or combine steps."

---

## ⚠️ CRITICAL RULES - READ TWICE

### ✅ DO:

1. **COMPLETE ONLY THE CURRENT STEP** - If I say "Step 3", do ONLY Step 3
2. **STOP AFTER EACH STEP** - End response with "✋ STEP [X] COMPLETE. Type 'NEXT' to continue."
3. **SHOW 100% OF THE CODE** - Every single line, no "..." or "rest of code here"
4. **USE EXACT FILE PATHS** - Tell me: "Save this as `backend/app.py`"
5. **ADD COMMENTS IN CODE** - Explain what each section does
6. **INCLUDE VERSION NUMBERS** - Specify exact package versions
7. **PROVIDE TEST COMMANDS** - Show how to verify each step works
8. **NUMBER YOUR CODE BLOCKS** - Use <!-- CODE BLOCK 1 -->, etc.

### ❌ DON'T:

1. ❌ Don't implement features from future steps
2. ❌ Don't say "as we'll do in Step X"
3. ❌ Don't use placeholders like `# Add more code here`
4. ❌ Don't skip error handling
5. ❌ Don't assume I know how to test things
6. ❌ Don't combine multiple steps
7. ❌ Don't use advanced patterns (keep it simple)
8. ❌ Don't forget CORS, error handling, or input validation

---

## 📋 PROJECT OVERVIEW

**Name:** TruthLens - AI Fake News Detector

**Purpose:** Web app for instant news claim verification with AI reasoning and web evidence.

**User Flow:**

```
User enters claim → Click "Verify" → See loading → Get results in <10 seconds
```

**Output Format:**

```
┌─────────────────────────────────┐
│ Verdict: REAL (Green)           │
│ Truth Score: 85/100 ████████░░  │
│ Explanation: [2-3 sentences]    │
│ Context: [Brief background]     │
│ Sources:                        │
│  1. [Clickable Link 1]          │
│  2. [Clickable Link 2]          │
│  3. [Clickable Link 3]          │
└─────────────────────────────────┘
```

---

## 🛠️ TECH STACK (EXACT VERSIONS)

**Frontend:**

- HTML5
- CSS3 (vanilla, no frameworks)
- JavaScript ES6+ (vanilla, no frameworks)

**Backend:**

- Python 3.9+
- Flask 3.0.0
- Flask-CORS 4.0.0
- python-dotenv 1.0.0
- google-generativeai 0.3.0+
- serpapi 0.1.5+
- requests 2.31.0+

**APIs:**

- Google Gemini API (gemini-1.5-flash model)
- SerpAPI (Google News search)

**Ports:**

- Backend: http://localhost:5000
- Frontend: Open directly in browser (file://) or http://localhost:8000

---

## 📁 PROJECT STRUCTURE (EXACT)

```
truthlens/
├── README.md                    # Setup instructions
├── backend/
│   ├── app.py                  # Main Flask application
│   ├── requirements.txt        # Python dependencies
│   ├── .env                    # API keys (NOT in git)
│   └── .env.example            # Template for API keys
└── frontend/
    ├── index.html              # Main HTML page
    ├── style.css               # All styles
    └── script.js               # All JavaScript logic
```

---

## 🚀 STEP-BY-STEP BUILD PROCESS

---

### **STEP 1 — Project Setup and Environment**

**🎯 Goal:** Create folder structure, install dependencies, prepare environment.

**📝 Deliverables:**

1. **Create folder structure** (tell me the exact commands)

2. **Create `backend/requirements.txt`** with EXACT versions:

```txt
Flask==3.0.0
Flask-CORS==4.0.0
python-dotenv==1.0.0
google-generativeai==0.3.2
serpapi==0.1.5
requests==2.31.0
```

3. **Create `backend/.env.example`** (template):

```
GEMINI_API_KEY=your_gemini_api_key_here
SERPAPI_KEY=your_serpapi_key_here
```

4. **Create `README.md`** with setup instructions

5. **Provide terminal commands:**

```bash
# Command to create folders
# Command to create virtual environment
# Command to activate virtual environment
# Command to install requirements
# Command to verify installation
```

**✅ Verification:** Show me how to check Python and pip versions.

**📤 Format your response as:**

```
STEP 1: PROJECT SETUP

<!-- CODE BLOCK 1: Directory Commands -->
[show commands]

<!-- CODE BLOCK 2: requirements.txt -->
File: backend/requirements.txt
[show full content]

<!-- CODE BLOCK 3: .env.example -->
File: backend/.env.example
[show full content]

<!-- CODE BLOCK 4: README.md -->
File: README.md
[show full content]

<!-- CODE BLOCK 5: Installation Commands -->
[show all commands with explanations]

TEST: Run `pip list` and verify Flask==3.0.0 is installed

✋ STEP 1 COMPLETE. Type 'NEXT' to continue.
```

---

### **STEP 2 — Basic Flask Server**

**🎯 Goal:** Create working Flask server with test endpoint.

**📝 Deliverables:**

1. **Create `backend/app.py`** with:
   - Flask app initialization
   - CORS enabled (all origins for development)
   - Test route: `GET /health` returns `{"status": "ok", "message": "TruthLens API is running"}`
   - Route: `GET /` returns basic info
   - Run on port 5000
   - Debug mode enabled
   - Proper error handling

2. **Code requirements:**
   - Import statements with comments
   - CORS configured correctly
   - Clean, readable code with comments
   - Proper if **name** == '**main**' block

**✅ Verification Steps:**

```bash
# Start server
python backend/app.py

# Test in new terminal (provide exact curl command)
curl http://localhost:5000/health

# Expected output: {"status":"ok","message":"TruthLens API is running"}
```

**📤 Format your response as:**

```
STEP 2: BASIC FLASK SERVER

<!-- CODE BLOCK 1: backend/app.py -->
File: backend/app.py
[show COMPLETE code with line numbers and comments]

<!-- CODE BLOCK 2: Run Instructions -->
How to run:
1. [command to activate venv]
2. [command to run Flask]
3. [expected output in terminal]

<!-- CODE BLOCK 3: Test Commands -->
Test in browser: http://localhost:5000/health
Test with curl: [exact curl command]
Expected JSON: [show expected response]

TROUBLESHOOTING:
- If port 5000 is busy: [solution]
- If CORS errors: [solution]

✋ STEP 2 COMPLETE. Type 'NEXT' to continue.
```

---

### **STEP 3 — Simple Frontend UI**

**🎯 Goal:** Create beautiful, functional UI for claim input.

**📝 Deliverables:**

1. **Create `frontend/index.html`** with:
   - DOCTYPE and proper HTML5 structure
   - Meta tags (viewport, charset)
   - Title: "TruthLens - AI Fake News Detector"
   - Link to style.css
   - Main container with:
     - Header with logo/title
     - Textarea (id="claimInput", placeholder text)
     - Button (id="verifyBtn", text="🔍 Verify Claim")
     - Result container (id="resultContainer", hidden by default)
   - Script tag linking to script.js

2. **Create `frontend/style.css`** with:
   - Modern, clean design
   - Color scheme: Primary (#2563eb blue), Success (#22c55e green), Danger (#ef4444 red), Warning (#f59e0b orange)
   - Responsive design (mobile-friendly)
   - Google Font (e.g., Inter or Poppins)
   - Smooth transitions
   - Button hover effects
   - Textarea styling (min-height: 120px)

3. **Design requirements:**
   - Centered layout
   - Max-width: 800px
   - Padding and spacing
   - Box shadows for depth
   - Rounded corners

**✅ Verification:** Open `frontend/index.html` in browser, should see styled form.

**📤 Format your response as:**

```
STEP 3: FRONTEND UI

<!-- CODE BLOCK 1: frontend/index.html -->
File: frontend/index.html
[show COMPLETE HTML with comments]

<!-- CODE BLOCK 2: frontend/style.css -->
File: frontend/style.css
[show COMPLETE CSS with section comments]

<!-- CODE BLOCK 3: Visual Preview -->
Expected appearance:
- Title centered at top
- Large textarea in middle
- Blue button below textarea
- Clean, modern look

How to open:
- Right-click index.html → Open with [browser]
- Or double-click index.html
- No server needed yet

✋ STEP 3 COMPLETE. Type 'NEXT' to continue.
```

---

### **STEP 4 — Connect Frontend to Backend**

**🎯 Goal:** Frontend sends claim to backend, receives response.

**📝 Deliverables:**

1. **Create `frontend/script.js`** with:
   - Get DOM elements
   - Button click event listener
   - Fetch POST request to `http://localhost:5000/api/verify`
   - Send JSON: `{"claim": "user input"}`
   - Console.log the response
   - Basic error handling

2. **Update `backend/app.py`** with:
   - New route: `POST /api/verify`
   - Accept JSON with "claim" field
   - Validate input (not empty, max 500 chars)
   - Return MOCK JSON response:
   ```json
   {
     "verdict": "REAL",
     "score": 85,
     "explanation": "This is a test response. API integration coming next.",
     "verified_context": "Mock context for testing frontend-backend connection.",
     "sources": [
       {
         "title": "Test Source 1",
         "link": "https://example.com/1",
         "snippet": "Test snippet 1"
       },
       {
         "title": "Test Source 2",
         "link": "https://example.com/2",
         "snippet": "Test snippet 2"
       },
       {
         "title": "Test Source 3",
         "link": "https://example.com/3",
         "snippet": "Test snippet 3"
       }
     ]
   }
   ```

**✅ Verification:**

```bash
# Start Flask server first
# Open browser console
# Enter test claim and click Verify
# Check console for response object
```

**📤 Format your response as:**

```
STEP 4: FRONTEND-BACKEND CONNECTION

<!-- CODE BLOCK 1: frontend/script.js -->
File: frontend/script.js
[show COMPLETE JavaScript with comments]

<!-- CODE BLOCK 2: Updated backend/app.py -->
File: backend/app.py
[show ONLY the new /api/verify route code to ADD to existing app.py]

<!-- CODE BLOCK 3: Testing Steps -->
1. Start backend: python backend/app.py
2. Open frontend/index.html in browser
3. Open browser console (F12)
4. Type any claim and click Verify
5. Check console - you should see the mock JSON response

Expected console output: [show expected object]

TROUBLESHOOTING:
- CORS error: [check CORS setup]
- 404 error: [check route path]
- Network error: [check server is running]

✋ STEP 4 COMPLETE. Type 'NEXT' to continue.
```

---

### **STEP 5 — Gemini API Integration (Keyword Extraction)**

**🎯 Goal:** Use Gemini to extract searchable keywords from claim.

**📝 Deliverables:**

1. **Update `backend/.env.example`** and create `.env`:

```
GEMINI_API_KEY=your_actual_key_here
SERPAPI_KEY=your_key_here_later
```

2. **Update `backend/app.py`** with:
   - Import google.generativeai
   - Load environment variables
   - Initialize Gemini with API key
   - Create function:

   ```python
   def extract_keywords(claim):
       """
       Extract searchable keywords from claim using Gemini.
       Returns: List of 3-5 keywords
       """
       # Implementation here
       pass
   ```

   - Prompt template:

   ```
   Extract 3-5 concise, searchable keywords from this claim for fact-checking.
   Return ONLY the keywords separated by commas, nothing else.

   Claim: {claim}

   Keywords:
   ```

   - Handle API errors gracefully
   - Use model: "gemini-1.5-flash"

3. **Test the function** in /api/verify route (just log keywords, don't use yet)

**🔑 How to get Gemini API Key:**

```
1. Go to: https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key
4. Paste in backend/.env
```

**✅ Verification:**

```bash
# In /api/verify route, add:
keywords = extract_keywords(claim)
print("Extracted keywords:", keywords)
# Test with claim, check terminal output
```

**📤 Format your response as:**

```
STEP 5: GEMINI KEYWORD EXTRACTION

<!-- CODE BLOCK 1: Environment Setup -->
File: backend/.env
[show structure, NOT actual keys]

<!-- CODE BLOCK 2: Updated app.py - Imports -->
[show new imports to add]

<!-- CODE BLOCK 3: Updated app.py - Gemini Setup -->
[show Gemini initialization code]

<!-- CODE BLOCK 4: Updated app.py - extract_keywords Function -->
[show COMPLETE function with error handling and comments]

<!-- CODE BLOCK 5: Updated app.py - Test Integration -->
[show how to temporarily test in /api/verify route]

<!-- CODE BLOCK 6: How to Get API Key -->
Step-by-step instructions with screenshots description

<!-- CODE BLOCK 7: Testing -->
1. Add GEMINI_API_KEY to .env
2. Restart Flask server
3. Submit claim: "The Earth is flat"
4. Check terminal output
Expected: ["Earth", "flat", "shape", "planet", "science"]

TROUBLESHOOTING:
- API key invalid: [check key format]
- Import error: [reinstall package]
- Timeout: [check internet]

✋ STEP 5 COMPLETE. Type 'NEXT' to continue.
```

---

### **STEP 6 — SerpAPI Integration (Search Evidence)**

**🎯 Goal:** Search for news articles using extracted keywords.

**📝 Deliverables:**

1. **Update `backend/.env`** with SerpAPI key

2. **Update `backend/app.py`** with:
   - Import serpapi or requests
   - Create function:

   ```python
   def search_evidence(keywords):
       """
       Search for evidence using SerpAPI Google News.
       Returns: List of top 5 results with title, snippet, link
       """
       # Implementation here
       pass
   ```

   - Use SerpAPI parameters:
     - engine: "google"
     - q: keywords joined
     - tbm: "nws" (news)
     - num: 5
   - Return clean, structured list of dicts
   - Handle API errors

3. **Test in /api/verify route** (log results)

**🔑 How to get SerpAPI Key:**

```
1. Go to: https://serpapi.com/users/sign_up
2. Sign up (free tier: 100 searches/month)
3. Copy API key from dashboard
4. Paste in backend/.env
```

**✅ Verification:**

```bash
# Test with claim: "COVID-19 vaccine effectiveness"
# Check terminal for search results
# Should see 5 news articles
```

**📤 Format your response as:**

```
STEP 6: SERPAPI SEARCH INTEGRATION

<!-- CODE BLOCK 1: Environment Update -->
Add to backend/.env:
SERPAPI_KEY=your_serpapi_key_here

<!-- CODE BLOCK 2: Updated app.py - Imports -->
[show new imports]

<!-- CODE BLOCK 3: Updated app.py - search_evidence Function -->
[show COMPLETE function with error handling]

<!-- CODE BLOCK 4: Updated app.py - Test Integration -->
[show how to test in /api/verify]

<!-- CODE BLOCK 5: How to Get API Key -->
Step-by-step with screenshots description

<!-- CODE BLOCK 6: Example Response Structure -->
Expected result format:
[
  {
    "title": "Article title",
    "snippet": "Preview text...",
    "link": "https://..."
  },
  ...
]

<!-- CODE BLOCK 7: Testing -->
1. Add SERPAPI_KEY to .env
2. Restart Flask
3. Submit claim: "COVID-19 vaccine effectiveness"
4. Check terminal - should see 5 search results

TROUBLESHOOTING:
- No results: [check keywords]
- API limit: [check quota]
- Format error: [check parsing]

✋ STEP 6 COMPLETE. Type 'NEXT' to continue.
```

---

### **STEP 7 — Gemini Fact Analysis**

**🎯 Goal:** Analyze claim against evidence using Gemini, return verdict.

**📝 Deliverables:**

1. **Update `backend/app.py`** with:
   - Create function:
   ```python
   def analyze_claim(claim, evidence):
       """
       Analyze claim against evidence using Gemini.
       Returns: Dict with verdict, score, explanation, context
       """
       # Implementation here
       pass
   ```
2. **Gemini prompt template:**

```
You are an expert fact-checker. Analyze this claim against the provided evidence.

CLAIM: {claim}

EVIDENCE:
{formatted_evidence_snippets}

Return ONLY a valid JSON object (no markdown, no code blocks, no extra text) with this EXACT structure:
{
  "verdict": "REAL" or "FAKE" or "UNCERTAIN",
  "score": <number between 0-100>,
  "explanation": "<2-3 sentence clear explanation of your verdict>",
  "verified_context": "<brief factual context about this topic>"
}

Rules:
- verdict must be exactly "REAL", "FAKE", or "UNCERTAIN"
- score: 0-30=FAKE, 31-69=UNCERTAIN, 70-100=REAL
- Be objective and evidence-based
- Return ONLY the JSON object, nothing else
```

3. **Response parsing:**
   - Extract JSON from response
   - Handle malformed JSON
   - Validate all required fields
   - Set defaults if parsing fails

**✅ Verification:**

```bash
# Test with claim and evidence
# Should return proper JSON structure
```

**📤 Format your response as:**

```
STEP 7: GEMINI FACT ANALYSIS

<!-- CODE BLOCK 1: Updated app.py - analyze_claim Function -->
[show COMPLETE function with:
- Prompt construction
- API call
- JSON parsing
- Error handling
- Comments]

<!-- CODE BLOCK 2: Helper Functions (if needed) -->
[any helper functions for formatting evidence]

<!-- CODE BLOCK 3: Example Usage -->
[show how to call the function]

<!-- CODE BLOCK 4: Testing -->
Test with:
Claim: "Water boils at 100°C at sea level"
Evidence: [mock evidence]
Expected output: {verdict: "REAL", score: 95, ...}

TROUBLESHOOTING:
- JSON parse error: [handle malformed response]
- Missing fields: [set defaults]
- API timeout: [add retry logic]

✋ STEP 7 COMPLETE. Type 'NEXT' to continue.
```

---

### **STEP 8 — Complete API Pipeline**

**🎯 Goal:** Integrate all functions into working /api/verify endpoint.

**📝 Deliverables:**

1. **Update `/api/verify` route** with complete pipeline:

```python
@app.route('/api/verify', methods=['POST'])
def verify_claim():
    try:
        # 1. Get claim from request
        # 2. Validate input
        # 3. Extract keywords
        # 4. Search evidence
        # 5. Analyze claim
        # 6. Format response
        # 7. Return JSON
    except Exception as e:
        # Error handling
```

2. **Response format:**

```json
{
  "success": true,
  "data": {
    "verdict": "REAL|FAKE|UNCERTAIN",
    "score": 85,
    "explanation": "...",
    "verified_context": "...",
    "sources": [
      { "title": "...", "link": "...", "snippet": "..." },
      { "title": "...", "link": "...", "snippet": "..." },
      { "title": "...", "link": "...", "snippet": "..." }
    ],
    "keywords": ["...", "..."]
  },
  "timestamp": "2024-01-15T10:30:00"
}
```

3. **Error response format:**

```json
{
  "success": false,
  "error": "Error message",
  "timestamp": "2024-01-15T10:30:00"
}
```

**✅ End-to-End Test:**

```bash
# Test claims:
1. "The Earth is flat" (should be FAKE)
2. "Water boils at 100°C" (should be REAL)
3. "Aliens built the pyramids" (should be UNCERTAIN/FAKE)
```

**📤 Format your response as:**

```
STEP 8: COMPLETE API PIPELINE

<!-- CODE BLOCK 1: Full Updated app.py -->
File: backend/app.py
[show COMPLETE file with all functions integrated]

<!-- CODE BLOCK 2: Testing Commands -->
# Use curl or Postman:
curl -X POST http://localhost:5000/api/verify \
  -H "Content-Type: application/json" \
  -d '{"claim":"Water boils at 100°C at sea level"}'

Expected response: [show full JSON]

<!-- CODE BLOCK 3: Test Cases -->
Test these 3 claims and verify correct verdicts:
1. [claim 1] → Expected: [verdict]
2. [claim 2] → Expected: [verdict]
3. [claim 3] → Expected: [verdict]

<!-- CODE BLOCK 4: Flow Diagram -->
Request Flow:
1. Receive claim → 2. Extract keywords → 3. Search → 4. Analyze → 5. Return

TROUBLESHOOTING:
- Pipeline breaks: [check each function individually]
- Slow response: [check API latency]
- Inconsistent results: [check prompt]

✋ STEP 8 COMPLETE. Type 'NEXT' to continue.
```

---

### **STEP 9 — Enhanced UI with Results Display**

**🎯 Goal:** Display results beautifully with color-coded verdicts and progress bar.

**📝 Deliverables:**

1. **Update `frontend/script.js`** with:
   - Remove console.log
   - Display results in #resultContainer
   - Show/hide result container
   - Format verdict with colors
   - Create progress bar for score
   - List sources as clickable links
   - Handle errors gracefully

2. **Update `frontend/style.css`** with:
   - Result container styling
   - Verdict colors:
     - REAL: Green background (#22c55e)
     - FAKE: Red background (#ef4444)
     - UNCERTAIN: Orange background (#f59e0b)
   - Progress bar styles (0-100%)
   - Source link styles (hover effects)
   - Spacing and typography

3. **Update `frontend/index.html`** with:
   - Result container structure:
   ```html
   <div id="resultContainer" style="display:none;">
     <div id="verdict"></div>
     <div id="scoreContainer">
       <div id="scoreBar"></div>
     </div>
     <div id="explanation"></div>
     <div id="context"></div>
     <div id="sources"></div>
   </div>
   ```

**✅ Visual Requirements:**

- Smooth fade-in animation
- Clear visual hierarchy
- Mobile responsive
- Accessible (proper contrast)

**📤 Format your response as:**

```
STEP 9: ENHANCED UI RESULTS DISPLAY

<!-- CODE BLOCK 1: Updated frontend/index.html -->
File: frontend/index.html
[show COMPLETE updated HTML]

<!-- CODE BLOCK 2: Updated frontend/style.css -->
File: frontend/style.css
[show ALL new CSS for results display]

<!-- CODE BLOCK 3: Updated frontend/script.js -->
File: frontend/script.js
[show COMPLETE updated JavaScript with display functions]

<!-- CODE BLOCK 4: Visual Guide -->
Expected appearance:
- Verdict badge at top (colored)
- Progress bar with percentage
- Clear explanation text
- Numbered source links
- Smooth animations

<!-- CODE BLOCK 5: Testing -->
1. Open index.html
2. Enter: "The Earth revolves around the Sun"
3. Click Verify
4. Should see:
   - Green "REAL" verdict
   - High score (90-100)
   - Clear explanation
   - 3 clickable sources

✋ STEP 9 COMPLETE. Type 'NEXT' to continue.
```

---

### **STEP 10 — Polish and UX Features**

**🎯 Goal:** Add loading states, error handling, and basic polish. Keep it simple!

**📝 Deliverables:**

1. **Update `frontend/script.js`** with:
   - Loading spinner (show during API call)
   - Disable button during loading
   - Input validation (min 10 chars, max 500 chars)
   - Clear/reset functionality
   - Example claims feature
   - Error messages (user-friendly)
   - Smooth scroll to results

2. **Update `frontend/style.css`** with:
   - Loading spinner animation
   - Disabled button state
   - Error message styling
   - Example button styling
   - Refined spacing

3. **Update `frontend/index.html`** with:
   - Loading indicator
   - Error message container
   - "Try Example" button with dropdown/modal
   - Clear button
   - Character counter (optional)

4. **Example claims to include:**

```javascript
const exampleClaims = [
  "The Earth is flat",
  "COVID-19 vaccines contain microchips",
  "Water boils at 100°C at sea level",
  "The Great Wall of China is visible from space",
  "Humans only use 10% of their brain",
];
```

5. **Final touches:**
   - Add footer with credits
   - Add instructions/help text
   - Keyboard shortcuts (Enter to submit)
   - Copy result to clipboard feature (optional)

**✅ Final Testing Checklist:**

```
□ Empty input shows error
□ Short input (<10 chars) shows error
□ Loading spinner appears during request
□ Button disables during loading
□ Results display correctly for REAL verdict
□ Results display correctly for FAKE verdict
□ Results display correctly for UNCERTAIN verdict
□ Progress bar animates smoothly
□ Sources are clickable
□ Example claims work
□ Clear button resets form
□ Mobile responsive (test on phone size)
□ No console errors
□ API errors show user-friendly message
```

**📤 Format your response as:**

```
STEP 10: POLISH AND UX FEATURES

<!-- CODE BLOCK 1: Updated frontend/index.html -->
File: frontend/index.html
[show COMPLETE final HTML with all features]

<!-- CODE BLOCK 2: Updated frontend/style.css -->
File: frontend/style.css
[show COMPLETE final CSS]

<!-- CODE BLOCK 3: Updated frontend/script.js -->
File: frontend/script.js
[show COMPLETE final JavaScript with all features]

<!-- CODE BLOCK 4: Feature Guide -->
New features added:
✅ Loading spinner
✅ Input validation
✅ Example claims
✅ Clear button
✅ Error handling
✅ Smooth animations

<!-- CODE BLOCK 5: Final Testing -->
Run through this checklist:
[provide full testing checklist]

<!-- CODE BLOCK 6: Demo Script -->
How to demo:
1. Start with example claim: "..."
2. Show loading state
3. Show result display
4. Try another example
5. Show error handling (empty input)

✋ STEP 10 COMPLETE. PROJECT FINISHED!
Type 'NEXT' for final documentation.
```

---

## 📚 FINAL STEP — Complete Documentation

**After Step 10, provide:**

1. **Complete README.md** with:
   - Project description
   - Features list
   - Tech stack
   - Prerequisites
   - Installation (step-by-step)
   - API keys setup
   - How to run
   - How to use
   - Troubleshooting
   - Known limitations
   - Future improvements
   - Credits

2. **Complete file structure overview**

3. **Quick start commands**:

```bash
# Clone or download
# Setup virtual environment
# Install dependencies
# Add API keys
# Run backend
# Open frontend
```

4. **Demo video script** (text description)

5. **Hackathon presentation tips**

---

## 🎯 SUCCESS CRITERIA CHECKLIST

```
□ User can enter any claim text
□ System extracts relevant keywords
□ System searches for evidence automatically
□ AI analyzes and returns verdict
□ Results display clearly with colors
□ Progress bar shows truth score
□ Sources are clickable and relevant
□ Loading states are clear
□ Errors are handled gracefully
□ Works on Chrome, Firefox, Safari
□ Mobile responsive
□ No crashes or console errors
□ API keys are secure (in .env)
□ Code is readable and commented
□ Ready for live demo
```

---

## 🚨 COMMON MISTAKES TO AVOID

### Backend:

❌ Forgetting to load .env variables
❌ Not enabling CORS
❌ Not handling API rate limits
❌ Returning 500 errors instead of proper error JSON
❌ Not validating input data
❌ Hardcoding API keys in code

### Frontend:

❌ Not checking if API is running
❌ Not showing loading states
❌ Not handling empty responses
❌ Not validating input before sending
❌ Using alert() instead of nice UI messages
❌ Forgetting to clear previous results

### APIs:

❌ Using wrong Gemini model name
❌ Not parsing JSON correctly
❌ Exceeding API rate limits
❌ Not handling API timeouts
❌ Malformed prompts causing bad responses

---

## 💡 BEST PRACTICES

### Code Quality:

✅ Use meaningful variable names
✅ Add comments for complex logic
✅ Handle all edge cases
✅ Use try-catch blocks
✅ Log errors for debugging
✅ Keep functions small and focused

### User Experience:

✅ Provide immediate feedback
✅ Show clear error messages
✅ Use smooth animations
✅ Make buttons obvious
✅ Test on mobile devices
✅ Add keyboard shortcuts

### Performance:

✅ Show loading indicators
✅ Debounce rapid clicks
✅ Cache API responses (optional)
✅ Optimize image sizes (if any)
✅ Minimize API calls

---

## 🔧 TROUBLESHOOTING GUIDE

### "CORS Error"

**Problem:** Frontend can't reach backend
**Solution:**

1. Check Flask-CORS is installed: `pip list | grep Flask-CORS`
2. Verify CORS(app) is called in app.py
3. Check backend is running on port 5000: `lsof -i :5000` (Mac/Linux) or `netstat -ano | findstr :5000` (Windows)
4. Try restarting Flask server with Ctrl+C and re-run
5. Clear browser cache and hard reload (Ctrl+Shift+R)
6. Check browser console for specific CORS error details

### "API Key Invalid"

**Problem:** Gemini or SerpAPI not working
**Solution:**

1. Check .env file exists
2. Verify no extra spaces in key
3. Confirm key is active on provider site
4. Check quotas not exceeded
5. Restart Flask after adding keys

### "No Results Returned"

**Problem:** Search returns empty
**Solution:**

1. Check keywords are being extracted
2. Verify SerpAPI key is valid
3. Try different claim (more specific)
4. Check API quota
5. Log full API response

### "JSON Parse Error"

**Problem:** Can't parse Gemini response
**Solution:**

1. Check prompt asks for "ONLY JSON"
2. Strip markdown code blocks from response
3. Add fallback default response
4. Log raw response to see issue
5. Try different Gemini model

### "Slow Response"

**Problem:** Takes too long to verify
**Solution:**

1. Check internet connection
2. Verify API latency (log timestamps)
3. Reduce number of search results
4. Use faster Gemini model
5. Add timeout to API calls

---

## 🎨 DESIGN SPECIFICATIONS

### Colors:

```
Primary Blue: #2563eb
Success Green: #22c55e
Danger Red: #ef4444
Warning Orange: #f59e0b
Background: #f8fafc
Text: #1e293b
Border: #e2e8f0
```

### Typography:

```
Font Family: 'Inter', sans-serif
Heading: 32px bold
Subheading: 24px semibold
Body: 16px regular
Small: 14px regular
```

### Spacing:

```
Container padding: 2rem
Element spacing: 1rem
Button padding: 0.75rem 1.5rem
Border radius: 0.5rem
```

---

---

### **STEP 11 — Deployment & Production Ready**

**🎯 Goal:** Deploy the application and make it production-ready.

**📝 Deliverables:**

1. **Update `backend/app.py`** for production:
   - Remove debug mode
   - Add proper logging
   - Add rate limiting
   - Add request timeout handling
   - Add health check improvements
   - Add API versioning

2. **Create `backend/config.py`** for environment management:

```python
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # API Keys
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
    SERPAPI_KEY = os.getenv('SERPAPI_KEY')

    # Flask Settings
    DEBUG = os.getenv('DEBUG', 'False') == 'True'
    PORT = int(os.getenv('PORT', 5000))

    # Rate Limiting
    RATE_LIMIT = os.getenv('RATE_LIMIT', '20 per minute')

    # Timeout Settings
    API_TIMEOUT = int(os.getenv('API_TIMEOUT', 30))
```

3. **Add rate limiting** with Flask-Limiter:

```bash
pip install Flask-Limiter==3.5.0
```

4. **Create deployment configuration files:**

**Procfile** (for Heroku):

```
web: gunicorn backend.app:app
```

**runtime.txt** (for Heroku):

```
python-3.9.18
```

**vercel.json** (for Vercel):

```json
{
  "version": 2,
  "builds": [
    { "src": "backend/app.py", "use": "@vercel/python" },
    { "src": "frontend/**", "use": "@vercel/static" }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "backend/app.py" },
    { "src": "/(.*)", "dest": "frontend/$1" }
  ]
}
```

5. **Deployment options:**
   - **Backend:** Heroku, Render, Railway, Google Cloud Run, AWS Lambda
   - **Frontend:** Vercel, Netlify, GitHub Pages, Cloudflare Pages
   - **Full-stack:** Railway, Render, Heroku

6. **Environment variables setup** on hosting platform

7. **Update CORS** for production domain:

```python
from flask_cors import CORS

# Production
allowed_origins = os.getenv('ALLOWED_ORIGINS', 'http://localhost:3000').split(',')
CORS(app, resources={r"/api/*": {"origins": allowed_origins}})
```

**✅ Deployment Checklist:**

```
□ Remove debug mode
□ Add rate limiting
□ Configure proper CORS
□ Set environment variables on platform
□ Add logging and monitoring
□ Test production build locally
□ Deploy backend first
□ Update frontend API URL
□ Deploy frontend
□ Test end-to-end in production
□ Set up custom domain (optional)
□ Add SSL certificate (usually automatic)
□ Monitor error logs
```

**📤 Format your response as:**

```
STEP 11: DEPLOYMENT & PRODUCTION

<!-- CODE BLOCK 1: Updated requirements.txt -->
Add to backend/requirements.txt:
gunicorn==21.2.0
Flask-Limiter==3.5.0

<!-- CODE BLOCK 2: config.py -->
File: backend/config.py
[show complete configuration class]

<!-- CODE BLOCK 3: Updated app.py for Production -->
[show production-ready updates]

<!-- CODE BLOCK 4: Deployment Files -->
Procfile, runtime.txt, vercel.json
[show all deployment config files]

<!-- CODE BLOCK 5: Deployment Guide -->
Step-by-step deployment to:
1. Railway (recommended for beginners)
2. Heroku (classic option)
3. Vercel (for frontend + serverless functions)

<!-- CODE BLOCK 6: Post-Deployment Testing -->
- Test health endpoint
- Test verify endpoint with real claim
- Check response times
- Verify error handling
- Test rate limiting

TROUBLESHOOTING:
- 502 Bad Gateway: [check backend logs]
- CORS error in production: [verify allowed origins]
- API keys not working: [check environment variables]
- Slow responses: [check API timeouts, add caching]

✋ STEP 11 COMPLETE. PROJECT PRODUCTION-READY!
```

---

## 🔒 SECURITY BEST PRACTICES

### Critical Security Measures:

1. **API Key Protection:**

   ```python
   # NEVER commit .env to git
   # Add to .gitignore:
   .env
   __pycache__/
   *.pyc
   venv/
   .DS_Store
   ```

2. **Input Validation & Sanitization:**

   ```python
   def validate_claim(claim):
       if not claim or not isinstance(claim, str):
           return False, "Claim must be a non-empty string"

       # Remove potentially dangerous characters
       claim = claim.strip()

       # Length validation
       if len(claim) < 10:
           return False, "Claim too short (minimum 10 characters)"
       if len(claim) > 1000:
           return False, "Claim too long (maximum 1000 characters)"

       # Check for SQL injection patterns (if adding database later)
       dangerous_patterns = ['DROP', 'DELETE', 'INSERT', 'UPDATE', '--', ';']
       claim_upper = claim.upper()
       for pattern in dangerous_patterns:
           if pattern in claim_upper:
               return False, "Invalid characters detected"

       return True, claim
   ```

3. **Rate Limiting Implementation:**

   ```python
   from flask_limiter import Limiter
   from flask_limiter.util import get_remote_address

   limiter = Limiter(
       app=app,
       key_func=get_remote_address,
       default_limits=["200 per day", "50 per hour"],
       storage_uri="memory://"
   )

   @app.route('/api/verify', methods=['POST'])
   @limiter.limit("10 per minute")
   def verify_claim():
       # Your verification logic
       pass
   ```

4. **HTTPS Enforcement:**

   ```python
   from flask_talisman import Talisman

   # Force HTTPS in production
   if not app.debug:
       Talisman(app, force_https=True)
   ```

5. **Security Headers:**

   ```python
   @app.after_request
   def add_security_headers(response):
       response.headers['X-Content-Type-Options'] = 'nosniff'
       response.headers['X-Frame-Options'] = 'DENY'
       response.headers['X-XSS-Protection'] = '1; mode=block'
       response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
       return response
   ```

6. **API Response Sanitization:**

   ```python
   import bleach

   def sanitize_html(text):
       """Remove any HTML/JavaScript from text"""
       return bleach.clean(text, strip=True)
   ```

### Security Checklist:

```
□ .env file in .gitignore
□ API keys stored securely
□ Input validation on all endpoints
□ Rate limiting enabled
□ HTTPS enforced in production
□ Security headers added
□ CORS properly configured
□ Error messages don't leak sensitive info
□ Dependencies regularly updated
□ No sensitive data in logs
```

---

## ⚡ PERFORMANCE OPTIMIZATION

### 1. **Backend Caching Strategy:**

```python
from flask_caching import Cache
import hashlib

# Initialize cache
cache = Cache(app, config={
    'CACHE_TYPE': 'simple',
    'CACHE_DEFAULT_TIMEOUT': 3600  # 1 hour
})

def get_cache_key(claim):
    """Generate cache key from claim"""
    return hashlib.md5(claim.lower().encode()).hexdigest()

@app.route('/api/verify', methods=['POST'])
def verify_claim():
    data = request.get_json()
    claim = data.get('claim', '').strip()

    # Check cache first
    cache_key = f"verify_{get_cache_key(claim)}"
    cached_result = cache.get(cache_key)

    if cached_result:
        return jsonify({
            'success': True,
            'data': cached_result,
            'cached': True,
            'timestamp': datetime.now().isoformat()
        })

    # Process claim if not cached
    result = process_verification(claim)

    # Cache the result
    cache.set(cache_key, result, timeout=3600)

    return jsonify({
        'success': True,
        'data': result,
        'cached': False,
        'timestamp': datetime.now().isoformat()
    })
```

### 2. **API Request Optimization:**

```python
import asyncio
import aiohttp
from concurrent.futures import ThreadPoolExecutor

# Parallel API calls
def process_verification_parallel(claim):
    with ThreadPoolExecutor(max_workers=2) as executor:
        # Extract keywords and search evidence in parallel
        future_keywords = executor.submit(extract_keywords, claim)

        # Wait for keywords
        keywords = future_keywords.result()

        # Search and analyze can be sequential
        evidence = search_evidence(keywords)
        analysis = analyze_claim(claim, evidence)

        return analysis
```

### 3. **Frontend Performance:**

```javascript
// Debounce function to prevent rapid API calls
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Apply debouncing to verify button
const debouncedVerify = debounce(verifyClaim, 300);

// Lazy loading for images (if any)
const images = document.querySelectorAll("img[data-src]");
const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      imageObserver.unobserve(img);
    }
  });
});

images.forEach((img) => imageObserver.observe(img));
```

### 4. **Database Connection Pooling** (if adding database):

```python
from sqlalchemy import create_engine
from sqlalchemy.pool import QueuePool

engine = create_engine(
    DATABASE_URL,
    poolclass=QueuePool,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True
)
```

### Performance Checklist:

```
□ Implement caching for repeated claims
□ Use connection pooling
□ Minimize API calls
□ Compress responses (gzip)
□ Optimize frontend bundle size
□ Use CDN for static assets
□ Implement pagination for results
□ Add request timeout limits
□ Monitor API response times
□ Use async processing where possible
```

---

## ♿ ACCESSIBILITY FEATURES

### 1. **Semantic HTML:**

```html
<!-- Use proper ARIA labels -->
<form role="form" aria-label="Fact-checking form">
  <label for="claimInput" class="sr-only">Enter claim to verify</label>
  <textarea
    id="claimInput"
    aria-describedby="claimHelp"
    aria-required="true"
    placeholder="Enter a news claim to fact-check..."
  ></textarea>
  <span id="claimHelp" class="sr-only">
    Enter a claim between 10 and 1000 characters
  </span>

  <button id="verifyBtn" type="submit" aria-label="Verify claim">
    🔍 Verify Claim
  </button>
</form>

<!-- Screen reader only text -->
<style>
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
</style>
```

### 2. **Keyboard Navigation:**

```javascript
// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
  // Ctrl/Cmd + Enter to submit
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    e.preventDefault();
    verifyClaim();
  }

  // Escape to clear results
  if (e.key === "Escape") {
    clearResults();
  }

  // Tab navigation improvements
  if (e.key === "Tab") {
    // Ensure focus is visible
    document.body.classList.add("keyboard-navigation");
  }
});

// Remove keyboard navigation class on mouse use
document.addEventListener("mousedown", () => {
  document.body.classList.remove("keyboard-navigation");
});
```

### 3. **Color Contrast & Focus States:**

```css
/* High contrast focus indicators */
:focus {
  outline: 3px solid #2563eb;
  outline-offset: 2px;
}

/* Only show focus for keyboard navigation */
body:not(.keyboard-navigation) :focus {
  outline: none;
}

body.keyboard-navigation :focus {
  outline: 3px solid #2563eb;
  outline-offset: 2px;
}

/* Ensure sufficient contrast for verdict colors */
.verdict-real {
  background-color: #16a34a; /* Darker green for better contrast */
  color: #ffffff;
}

.verdict-fake {
  background-color: #dc2626; /* Darker red */
  color: #ffffff;
}

.verdict-uncertain {
  background-color: #ea580c; /* Darker orange */
  color: #ffffff;
}
```

### 4. **Screen Reader Announcements:**

```javascript
// Create live region for announcements
const liveRegion = document.createElement("div");
liveRegion.setAttribute("role", "status");
liveRegion.setAttribute("aria-live", "polite");
liveRegion.setAttribute("aria-atomic", "true");
liveRegion.className = "sr-only";
document.body.appendChild(liveRegion);

function announce(message) {
  liveRegion.textContent = message;
  setTimeout(() => {
    liveRegion.textContent = "";
  }, 1000);
}

// Use in verification flow
function displayResults(data) {
  // ... display logic ...

  announce(
    `Verification complete. Verdict: ${data.verdict}. Score: ${data.score} out of 100.`,
  );
}
```

### Accessibility Checklist:

```
□ All images have alt text
□ Form inputs have labels
□ Keyboard navigation works
□ Focus indicators visible
□ Color contrast meets WCAG AA
□ Screen reader tested
□ ARIA labels added
□ Skip navigation links
□ Error messages accessible
□ Loading states announced
```

---

## 🧪 TESTING & AUTOMATION

### 1. **Backend Unit Tests:**

Create `backend/test_app.py`:

```python
import unittest
import json
from app import app, extract_keywords, validate_claim

class TestTruthLensAPI(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_health_endpoint(self):
        """Test health check endpoint"""
        response = self.app.get('/health')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['status'], 'ok')

    def test_verify_endpoint_valid(self):
        """Test verify endpoint with valid claim"""
        payload = {'claim': 'Water boils at 100 degrees Celsius'}
        response = self.app.post(
            '/api/verify',
            data=json.dumps(payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertTrue(data['success'])
        self.assertIn('verdict', data['data'])

    def test_verify_endpoint_empty(self):
        """Test verify endpoint with empty claim"""
        payload = {'claim': ''}
        response = self.app.post(
            '/api/verify',
            data=json.dumps(payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data)
        self.assertFalse(data['success'])

    def test_validate_claim(self):
        """Test claim validation function"""
        # Valid claim
        valid, result = validate_claim("This is a valid claim")
        self.assertTrue(valid)

        # Too short
        valid, result = validate_claim("Short")
        self.assertFalse(valid)

        # Too long
        valid, result = validate_claim("a" * 1001)
        self.assertFalse(valid)

if __name__ == '__main__':
    unittest.main()
```

### 2. **Frontend Testing with Jest:**

Create `frontend/script.test.js`:

```javascript
// Mock fetch for testing
global.fetch = jest.fn();

describe("TruthLens Frontend", () => {
  beforeEach(() => {
    fetch.mockClear();
    document.body.innerHTML = `
            <textarea id="claimInput"></textarea>
            <button id="verifyBtn">Verify</button>
            <div id="resultContainer"></div>
        `;
  });

  test("should validate empty input", () => {
    const input = document.getElementById("claimInput");
    input.value = "";

    const isValid = validateInput();
    expect(isValid).toBe(false);
  });

  test("should make API call on verify", async () => {
    const mockResponse = {
      success: true,
      data: {
        verdict: "REAL",
        score: 85,
        explanation: "Test",
        sources: [],
      },
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const input = document.getElementById("claimInput");
    input.value = "Test claim";

    await verifyClaim();

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:5000/api/verify",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }),
    );
  });
});
```

### 3. **Integration Tests:**

Create `tests/integration_test.py`:

```python
import requests
import time

def test_end_to_end():
    """Test complete verification flow"""
    base_url = 'http://localhost:5000'

    # Test health
    health = requests.get(f'{base_url}/health')
    assert health.status_code == 200

    # Test verification
    claim = "The Earth revolves around the Sun"
    response = requests.post(
        f'{base_url}/api/verify',
        json={'claim': claim},
        timeout=60
    )

    assert response.status_code == 200
    data = response.json()
    assert data['success'] == True
    assert 'verdict' in data['data']
    assert data['data']['verdict'] in ['REAL', 'FAKE', 'UNCERTAIN']
    assert 0 <= data['data']['score'] <= 100
    assert len(data['data']['sources']) > 0

    print("✅ All integration tests passed!")

if __name__ == '__main__':
    test_end_to_end()
```

### 4. **GitHub Actions CI/CD:**

Create `.github/workflows/test.yml`:

```yaml
name: Run Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: "3.9"

      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r backend/requirements.txt
          pip install pytest pytest-cov

      - name: Run tests
        env:
          GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
          SERPAPI_KEY: ${{ secrets.SERPAPI_KEY }}
        run: |
          cd backend
          pytest test_app.py --cov=app --cov-report=xml

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./backend/coverage.xml
```

### Testing Checklist:

```
□ Unit tests for all functions
□ API endpoint tests
□ Input validation tests
□ Error handling tests
□ Integration tests
□ Frontend validation tests
□ Load testing (optional)
□ Security testing
□ CI/CD pipeline setup
□ Code coverage > 70%
```

---

## 🚀 ADVANCED FEATURES (OPTIONAL - AFTER STEP 11)

**If time permits, add:**

### Tier 1 - Quick Wins (30-60 min each):

1. **History of previous checks** (localStorage)
2. **Dark mode toggle** (CSS variables + toggle)
3. **Share results via link** (URL parameters)
4. **Copy results to clipboard** (Navigator API)
5. **Keyboard shortcuts guide** (Modal with help)

### Tier 2 - Medium Features (1-2 hours each):

6. **Export results as PDF** (jsPDF library)
7. **Analytics dashboard** (track usage stats)
8. **Multiple language support** (i18n)
9. **User feedback on results** (thumbs up/down)
10. **Detailed source analysis** (expanded view)

### Tier 3 - Advanced Features (3+ hours each):

11. **Voice input** (Web Speech API)
12. **Comparison mode** (check multiple claims)
13. **Browser extension** (Chrome/Firefox)
14. **Mobile app** (React Native/PWA)
15. **Real-time fact-checking** (WebSocket streaming)

---

## 📊 HACKATHON DEMO SCRIPT

**Opening (30 seconds):**
"TruthLens is an AI-powered fact-checker that instantly verifies news claims using Google Gemini AI and real-time web evidence."

**Demo (90 seconds):**

1. Show interface: "Clean, simple input"
2. Enter example: "COVID vaccines contain microchips"
3. Click Verify, show loading
4. Reveal results: "FAKE verdict, low score, clear explanation, credible sources"
5. Try real claim: "Water boils at 100°C"
6. Show REAL verdict with high score

**Tech Stack (30 seconds):**
"Built with Flask backend, vanilla JavaScript frontend, integrated with Google Gemini for AI reasoning and SerpAPI for evidence gathering."

**Impact (30 seconds):**
"Helps users make informed decisions, combat misinformation, and understand news claims with AI-powered verification."

---

## ⚡ QUICK REFERENCE

### Run Project:

```bash
# Terminal 1 - Backend
cd truthlens
source venv/bin/activate  # or venv\Scripts\activate on Windows
python backend/app.py

# Terminal 2 - Frontend
cd truthlens/frontend
# Just open index.html in browser
```

### Test Endpoint:

```bash
curl -X POST http://localhost:5000/api/verify \
  -H "Content-Type: application/json" \
  -d '{"claim":"Your claim here"}'
```

### Check Logs:

```bash
# Flask terminal shows:
- Incoming requests
- Extracted keywords
- Search results count
- Gemini analysis
- Response status
```

---

## 🎓 LEARNING OUTCOMES

After completing this project, you'll understand:
✅ Flask REST API development
✅ Frontend-backend communication
✅ AI API integration (Gemini)
✅ Web search API integration (SerpAPI)
✅ JSON data handling
✅ Error handling and validation
✅ Responsive UI design
✅ Async JavaScript (fetch)
✅ Environment variable management
✅ CORS configuration

---

## 📝 FINAL NOTES

**Remember:**

- This is a PROTOTYPE for demonstration
- Not production-ready (no database, auth, etc.)
- Focus on working demo, not perfection
- Keep it simple and functional
- Document what you built
- Practice your demo presentation

**Before submitting/demoing:**
□ Test on fresh browser
□ Clear console errors
□ Verify all features work
□ Prepare 3 good example claims
□ Have backup claims ready
□ Know your tech stack inside-out
□ Be ready to explain AI reasoning
□ Have backup if APIs fail (mock data)

---

## 🏆 YOU'VE GOT THIS!

Follow each step carefully, test thoroughly, and you'll have an impressive hackathon project that demonstrates:

- AI integration
- Web scraping
- Full-stack development
- Clean UI/UX
- Practical application

**Now, let's start building! 🚀**

---

## 📌 START HERE

**Type "START" to begin with STEP 1**

I will acknowledge the rules and begin with STEP 1 only, then wait for your "NEXT" command before proceeding to STEP 2.

**Remember:** I will STOP after each step and wait for your confirmation!
