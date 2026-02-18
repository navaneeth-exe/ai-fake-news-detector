# Deepfake Audio Detector — Implementation Plan

## Goal

Detect AI-generated (deepfake) voices and scam audio clips using a hybrid approach: **Signal Analysis + Content Analysis**.

---

## 🏗️ Architecture

### 1. Backend (`/api/audio`)

**Input:** Audio file (`multipart/form-data`)
**Logic Check:**

1.  **Format & Load**: Load audio using `librosa` (resampled to 16kHz for consistency).
2.  **Layer 1: Acoustic Forensics (Librosa)**
    - **Digital Silence**: Check if silence segments are _exactly_ zero (common in synthesis) vs. noisy (real mic).
    - **Spectral Analysis**: Check high-frequency cutoff (e.g., rigid cutoff at 8kHz, 11kHz, or 16kHz often indicates upsampling or telephony artifacts).
3.  **Layer 2: Transcription (Groq Whisper)**
    - Model: `distil-whisper-large-v3-en` (Fast, accurate, free on Groq).
    - Convert Audio to Text.
4.  **Layer 3: Semantic Analysis (Groq Llama 3)**
    - Analyze text for "Urgency," "Financial Demand," "Authority impersonation" (CEO/Police).
    - _Prompt:_ "Analyze this transcript for social engineering patterns common in deepfake scams..."

**Output:**

```json
{
  "verdict": "LIKELY_FAKE",
  "ai_probability": 85,
  "transcript": "Grandpa I'm in jail please send $500...",
  "signals": [
    "Detected 'Perfect Digital Silence' (characteristic of AI synthesis)",
    "High-frequency cutoff at 8kHz (low fidelity/telephony)",
    "Script matches 'Grandparent Scam' pattern"
  ]
}
```

### 2. Frontend

- **Tab**: New "Deepfake Audio" tab.
- **Input**: `AudioInput.jsx` (File dropzone).
- **Preview**: `<audio>` element to listen before scanning.
- **Result**: `AudioResult.jsx` (Verdict, Risk Score, Transcript accordion).

---

## 🛠️ Tech Stack Changes

- **Python Libs**: `librosa`, `soundfile`, `numpy` (Standard for audio).
- **Groq Models**:
  - `distil-whisper-large-v3-en` (New usage!)
  - `llama-3.3-70b-versatile`

---

## 📅 Step-by-Step Implementation

1.  **Dependencies**: Add `librosa`, `soundfile` to `requirements.txt`.
2.  **Backend**: Create `/api/audio` endpoint in `app.py`.
3.  **Frontend Components**:
    - Create `AudioInput.jsx`.
    - Create `AudioResult.jsx`.
4.  **Integration**: Update `App.jsx`, `TabNav.jsx`, `api.js`.
