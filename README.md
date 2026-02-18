# 🔍 TruthLens — AI-Powered Fake News & Deepfake Detector

> **The ultimate forensic tool for the post-truth era.** Verify text, URLs, images, and audio with military-grade AI analysis, wrapped in a stunning, theme-reactive interface.

![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?logo=react&logoColor=black)
![Tailwind](https://img.shields.io/badge/Styling-TailwindCSS-38B2AC?logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Motion-Framer-0055FF?logo=framer&logoColor=white)
![Python](https://img.shields.io/badge/Backend-Flask-000000?logo=flask&logoColor=white)
![Groq](https://img.shields.io/badge/AI-Groq%20Llama%203-f55036)

---

## ✨ Features

### 🖥️ **Forensic Dashboard**

- **Live Trending Feed**: Real-time misinformation alerts from around the globe.
- **Visual Intelligence**: Interactive trust score rings, waveform visualizers, and confidence bars.
- **History System**: Searchable, filterable local history of all your verifications.

### 🕵️ **Multi-Modal Verification**

1.  **📝 Text Analysis**: Fact-checks claims using real-time web evidence (SerpAPI).
2.  **🌐 URL Scanner**: Detects phishing, bias, and clickbait in news articles.
3.  **🖼️ Image Forensics**: Analyzes noise patterns and metadata to detect AI generation (Deepfakes).
4.  **🎙️ Audio Analysis**: Identifies synthetic voices and robotic artifacts in audio clips.

### 🎨 **Immersive UI Experience**

- **Neural Network Grid**: A living background that adapts to your theme and reacts to your mouse.
- **Theme Switcher**: 4 Distinct Personalities:
  - **☄️ Cosmic** (Default Dark/Purple)
  - **🌿 Eco** (Nature/Green)
  - **🔥 Ember** (High Contrast/Red)
  - **🏢 Corporate** (Professional Light/Blue)
- **Social Sharing**: Generate beautiful, shareable cards of your verification results instantly.

---

## 🛠️ Tech Stack

| Layer               | Technology          | Purpose                             |
| :------------------ | :------------------ | :---------------------------------- |
| **Frontend**        | **React 18 + Vite** | High-performance reactive UI        |
| **Styling**         | **TailwindCSS**     | Utility-first styling system        |
| **Animation**       | **Framer Motion**   | Smooth layout transitions & effects |
| **Visuals**         | **Canvas API**      | Neural Grid & Particle systems      |
| **Backend**         | **Python Flask**    | REST API & orchestration            |
| **AI Intelligence** | **Groq (Llama 3)**  | Context analysis & reasoning        |
| **Web Search**      | **SerpAPI**         | Real-time fact retrieval            |
| **Scraping**        | **BeautifulSoup**   | Article content extraction          |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Python 3.9+
- API Keys: [Groq](https://console.groq.com) and [SerpAPI](https://serpapi.com)

### Installation

#### 1. Backend Setup (Flask)

```bash
git clone https://github.com/navaneeth-exe/ai-fake-news-detector.git
cd ai-fake-news-detector/backend

# Create virtual env
python -m venv venv
# Activate: venv\Scripts\activate (Windows) or source venv/bin/activate (Mac/Linux)

# Install deps
pip install -r requirements.txt

# Configure Environment
cp .env.example .env
# Add your GROQ_API_KEY and SERPAPI_KEY in .env

# Run Server
python app.py
```

#### 2. Frontend Setup (React)

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
ai-news-detector/
├── backend/                # Python Flask API
│   ├── app.py              # Main application logic
│   ├── requirements.txt    # Backend dependencies
│   └── .env                # Secrets
│
├── frontend/               # React + Vite Application
│   ├── src/
│   │   ├── components/     # UI Components (Dashboard, Results, Inputs)
│   │   ├── hooks/          # Custom Hooks (useTheme, useHistory)
│   │   ├── lib/            # API utilities
│   │   ├── index.css       # Tailwind & Theme Variables
│   │   └── App.jsx         # Main Router & Layout
│   └── vite.config.js      # Bundler config
│
└── README.md               # You are here
```

---

## 🤝 Contributing

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
