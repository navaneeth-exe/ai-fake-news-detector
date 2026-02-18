# 🔍 TruthLens — AI-Powered Fake News & Deepfake Detector

> **The ultimate forensic tool for the post-truth era.** Verify text, URLs, images, and audio with military-grade AI analysis, wrapped in a stunning, theme-reactive interface.

![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?logo=react&logoColor=black)
![Tailwind](https://img.shields.io/badge/Styling-TailwindCSS-38B2AC?logo=tailwind-css&logoColor=white)
![Python](https://img.shields.io/badge/Backend-Flask-000000?logo=flask&logoColor=white)
![AI](https://img.shields.io/badge/AI-Groq%20Llama%203-f55036?logo=openai&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

### 🖥️ **Forensic Dashboard**

- **Live Trending Feed**: Real-time misinformation alerts from around the globe.
- **Visual Intelligence**: Interactive trust score rings, waveform visualizers, and confidence bars.
- **History System**: Searchable, filterable local history of all your verifications.

### 🕵️ **Multi-Modal Verification**

1.  **📝 Text Analysis**: Fact-checks claims using real-time web evidence (SerpAPI).
2.  **🌐 URL Scanner**: Detects phishing, bias, and clickbait using **Google Safe Browsing** and heuristic analysis.
3.  **🖼️ Image Forensics**: Analyzes noise patterns and metadata to detect AI generation (Deepfakes).
4.  **🎙️ Audio Analysis**: Identifies synthetic voices and robotic artifacts in audio clips.

### 🎨 **Immersive UI Experience**

- **Neural Network Grid**: A living background that adapts to your theme and reacts to your mouse.
- **Context-Aware Loading**: Dynamic visuals that change based on whether you're scanning audio, images, or text.
- **Theme Switcher**: 4 Distinct Personalities (Cosmic, Eco, Ember, Corporate).
- **Social Sharing**: Generate beautiful, shareable cards of your verification results instantly.

### 🛡️ **Production Ready**

- **Rate Limiting**: Built-in protection against API abuse.
- **Security**: Hardened HTTP headers and CORS policies.
- **Optimized**: Fast response times with efficient AI prompting.

---

## 🧠 How It Works

### 1. The Intelligence Layer (Groq & Llama 3)

TruthLens doesn't just "guess". It acts as a forensic analyst:

- **Context Extraction**: It understands the nuance of political, social, and scientific claims.
- **Cross-Referencing**: It queries `SerpAPI` to find the latest real-world evidence from trusted news sources.
- **Logical Reasoning**: It compares the claim against the evidence to detect inconsistencies, logical fallacies, or out-of-context quotes.

### 2. The Forensic Layer (Signal Processing)

For media files (Images/Audio), we use dedicated analysis pipelines:

- **Error Level Analysis (ELA)** to find digital manipulation in images.
- **Spectral Analysis** to detect robotic frequencies in audio that human vocal cords cannot produce.

---

## 🛠️ Tech Stack

| Layer               | Technology               | Purpose                             |
| :------------------ | :----------------------- | :---------------------------------- |
| **Frontend**        | **React 18 + Vite**      | High-performance reactive UI        |
| **Styling**         | **TailwindCSS**          | Utility-first styling system        |
| **Animation**       | **Framer Motion**        | Smooth layout transitions & effects |
| **Visuals**         | **Canvas API**           | Neural Grid & Particle systems      |
| **Backend**         | **Python Flask**         | REST API & orchestration            |
| **AI Intelligence** | **Groq (Llama 3)**       | Context analysis & reasoning        |
| **Web Search**      | **SerpAPI**              | Real-time fact retrieval            |
| **Security**        | **Google Safe Browsing** | Phishing & Malware detection        |

---

## 🚀 Installation & Setup

### Prerequisites

- Node.js 18+
- Python 3.9+
- API Keys: [Groq](https://console.groq.com) and [SerpAPI](https://serpapi.com)

### 1. Backend Setup (Flask)

```bash
git clone https://github.com/navaneeth-exe/TruthLens.git
cd TruthLens/backend

# Create virtual env
python -m venv venv
# Activate: venv\Scripts\activate (Windows) or source venv/bin/activate (Mac/Linux)

# Install dependencies
pip install -r requirements.txt

# Configure Environment
cp .env.example .env
# Open .env and add your GROQ_API_KEY and SERPAPI_KEY

# Run Server
python app.py
```

### 2. Frontend Setup (React)

Open a new terminal:

```bash
cd ../frontend

# Install dependencies
npm install

# Run Development Server
npm run dev
```

Open `http://localhost:5173` to launch TruthLens.

---

## 🏗️ Project Structure

```
TruthLens/
├── backend/                # Python Flask API
│   ├── app.py              # Main application logic
│   ├── requirements.txt    # Dependencies
│   └── .env                # Secrets
│
├── frontend/               # React + Vite Application
│   ├── src/
│   │   ├── components/     # UI Components
│   │   ├── hooks/          # Custom Hooks
│   │   ├── lib/            # API utilities
│   │   └── App.jsx         # Main Router
│   └── vite.config.js      # Bundler config
```

---

## 🤝 Contributing

We welcome contributions! Please fork the repository and submit a Pull Request.

1. Fork the repo.
2. Create your feature branch: `git checkout -b feature/amazing-feature`.
3. Commit your changes: `git commit -m 'Add amazing feature'`.
4. Push to the branch: `git push origin feature/amazing-feature`.
5. Open a Pull Request.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👨‍💻 Author

**Navaneeth** — [GitHub](https://github.com/navaneeth-exe)

_"In a world of noise, be the signal."_
