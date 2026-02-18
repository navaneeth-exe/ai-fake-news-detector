# 🔍 TruthLens — AI-Powered Fake News & Deepfake Detector

> **The ultimate forensic tool for the post-truth era.** Verify text, URLs, images, and audio with military-grade AI analysis, wrapped in a stunning, theme-reactive interface.

![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?logo=react&logoColor=black)
![Tailwind](https://img.shields.io/badge/Styling-TailwindCSS-38B2AC?logo=tailwind-css&logoColor=white)
![Python](https://img.shields.io/badge/Backend-Flask-000000?logo=flask&logoColor=white)
![AI](https://img.shields.io/badge/AI-Groq%20Llama%203-f55036?logo=openai&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 🚀 Live Demo

**[Deploy your own instance on Render](#-deployment)**

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
- **Theme Switcher**: 4 Distinct Personalities (Cosmic, Eco, Ember, Corporate).
- **Social Sharing**: Generate beautiful, shareable cards of your verification results instantly.

### 🛡️ **Production Ready**

- **Rate Limiting**: Built-in protection against API abuse.
- **Security**: Hardened HTTP headers and CORS policies.
- **Docker/Render Ready**: Configured for one-click deployment.

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

---

## ☁️ Deployment

### Free Deployment on Render.com

This project is configured for **free hosting** on Render (Frontend + Backend in one service).

1.  **Fork this repository** to your GitHub.
2.  Sign up at [render.com](https://render.com).
3.  Create a **New Web Service** and connect your repo.
4.  **Settings**:
    - **Build Command**: `cd frontend && npm install && npm run build && cd ../backend && pip install -r requirements.txt`
    - **Start Command**: `cd backend && gunicorn app:app -c gunicorn_config.py`
    - **Environment Variables**: Add `GROQ_API_KEY`, `SERPAPI_KEY`, and `FLASK_ENV=production`.

👉 **[Read the Full Deployment Guide](DEPLOYMENT_GUIDE.md)**

---

## 🚀 Local Development

### Prerequisites

- Node.js 18+
- Python 3.9+
- API Keys: [Groq](https://console.groq.com) and [SerpAPI](https://serpapi.com)

### Installation

#### 1. Backend Setup

```bash
git clone https://github.com/navaneeth-exe/TruthLens.git
cd TruthLens/backend

# Create virtual env & Install deps
python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate
pip install -r requirements.txt

# Configure Environment
cp .env.example .env
# Add keys to .env

# Run Server
python app.py
```

#### 2. Frontend Setup

```bash
cd ../frontend
npm install
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
│   ├── gunicorn_config.py  # Production server config
│   └── Procfile            # Deployment command
│
├── frontend/               # React + Vite Application
│   ├── src/
│   │   ├── components/     # UI Components
│   │   ├── hooks/          # Custom Hooks
│   │   ├── lib/            # API utilities
│   │   └── App.jsx         # Main Router
│   └── vite.config.js      # Bundler config
│
└── DEPLOYMENT_GUIDE.md     # Hosting instructions
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
