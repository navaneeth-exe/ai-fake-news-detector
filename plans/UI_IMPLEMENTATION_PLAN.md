# TruthLens UI Redesign — React + Vite Implementation Plan (v2)

## Overview

A complete frontend rewrite using **React + Vite** as the framework, **Tailwind CSS v3** for styling, **Framer Motion** for animations, **Shadcn/UI** for pre-built accessible components, and **React Icons** for polished SVG icons. The backend (Flask) remains unchanged.

> [!IMPORTANT]
> The backend API (`backend/app.py`) is **not modified**. All changes are frontend-only. The new React app lives in `frontend/` and communicates with `http://localhost:5000` exactly as before.

---

## Chosen Tech Stack

| Layer         | Technology                   | Reason                                                   |
| ------------- | ---------------------------- | -------------------------------------------------------- |
| Framework     | **React 18 + Vite 5**        | Fast HMR, component model, huge ecosystem                |
| Styling       | **Tailwind CSS v3**          | Utility-first, rapid styling, dark mode built-in         |
| Animations    | **Framer Motion**            | Spring physics, layout animations, gesture support       |
| Components    | **Shadcn/UI**                | Accessible, beautiful pre-built components (Radix-based) |
| Icons         | **React Icons (Lucide set)** | Polished SVG icons, tree-shakeable                       |
| Notifications | **React Hot Toast**          | Beautiful, non-intrusive toast notifications             |
| Charts        | **Recharts**                 | Animated score visualization                             |
| HTTP          | **Native fetch**             | No extra dependency needed                               |

---

## Project Structure (New)

```
ai-news-detector/
├── backend/                  # Unchanged Flask API
│   ├── app.py
│   ├── requirements.txt
│   └── .env
└── frontend/                 # NEW: React + Vite app
    ├── index.html            # Vite entry point
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── package.json
    └── src/
        ├── main.jsx          # React entry
        ├── App.jsx           # Root component + routing
        ├── index.css         # Tailwind base + custom tokens
        ├── components/
        │   ├── Navbar.jsx
        │   ├── ParticleCanvas.jsx
        │   ├── BackgroundBlobs.jsx
        │   ├── InputPanel.jsx
        │   ├── ResultsPanel.jsx
        │   ├── TextResult.jsx
        │   ├── UrlResult.jsx
        │   ├── ScoreRing.jsx
        │   ├── VerdictBadge.jsx
        │   ├── SourcesList.jsx
        │   ├── KeyClaims.jsx
        │   ├── RedFlags.jsx
        │   ├── HistorySidebar.jsx
        │   ├── ShareModal.jsx
        │   └── LoadingCard.jsx
        ├── hooks/
        │   ├── useHistory.js
        │   └── useTheme.js
        └── lib/
            └── api.js        # API call helpers
```

---

## Design System

### Color Palette (Tailwind custom tokens)

| Token          | Dark                   | Light                  |
| -------------- | ---------------------- | ---------------------- |
| `--bg-primary` | `#0a0a1a`              | `#f0f2f5`              |
| `--accent`     | `#6366f1` (indigo-500) | `#4f46e5` (indigo-600) |
| `--success`    | `#22c55e`              | `#16a34a`              |
| `--danger`     | `#ef4444`              | `#dc2626`              |
| `--warning`    | `#eab308`              | `#ca8a04`              |

### Typography

- **Headings**: `Space Grotesk` (Google Fonts)
- **Body**: `Inter` (Google Fonts)
- **Mono**: `JetBrains Mono` (scores, badges)

### Glassmorphism

```css
.glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
}
```

---

## Key Features

### Animations (Framer Motion)

- Page-level layout animations with `AnimatePresence`
- Spring-physics card entrance (`initial → animate`)
- Staggered children animations on result sections
- Smooth score ring count-up with `useMotionValue` + `useSpring`
- History sidebar slide-in with `x` motion
- Share modal scale + fade

### Components (Shadcn/UI)

- `Badge` — verdict + bias labels
- `Card` — glassmorphic panels
- `Dialog` — share modal
- `Sheet` — history sidebar
- `Tooltip` — hover info on scores
- `Progress` — score bar alternative
- `Separator` — section dividers

### New UI Improvements over v1

1. **Animated score ring** using Framer Motion spring (smoother than CSS)
2. **Staggered card sections** — each result section animates in with delay
3. **Toast notifications** — "Copied to clipboard!", "Analysis complete!"
4. **Keyboard shortcut hint** — `Ctrl+Enter` shown in button
5. **Character counter** on textarea
6. **Smooth theme transition** — Framer Motion color interpolation
7. **Result skeleton loader** — animated placeholder while fetching
8. **Responsive sheet** — history becomes bottom sheet on mobile automatically via Shadcn

---

## Build Steps

### Step 1 — Scaffold Vite + React

```bash
cd frontend
npx create-vite@latest . --template react
npm install
```

### Step 2 — Install Dependencies

```bash
npm install tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
npm install framer-motion
npm install react-icons
npm install react-hot-toast
npm install recharts
npm install lucide-react
npm install clsx tailwind-merge
npm install @radix-ui/react-dialog @radix-ui/react-tooltip @radix-ui/react-separator
```

### Step 3 — Configure Tailwind

- Add custom colors, fonts, glassmorphism utilities to `tailwind.config.js`
- Import Tailwind directives in `index.css`

### Step 4 — Build Components

Build in order: `Navbar → BackgroundBlobs → ParticleCanvas → InputPanel → LoadingCard → TextResult → UrlResult → HistorySidebar → ShareModal`

### Step 5 — Wire up API

- `lib/api.js` — `verifyInput(claim)` → `POST /api/verify`
- Handle `input_type: 'url'` vs `'text'` routing

### Step 6 — Run Dev Server

```bash
npm run dev   # Vite dev server on http://localhost:5173
```

---

## Verification Plan

1. Open `http://localhost:5173` — glassmorphic UI renders
2. Toggle dark/light — smooth Framer Motion transition
3. Submit text claim — skeleton → animated result card
4. Submit URL — article meta + credibility score animate in
5. Open history sidebar — slides in from right (Sheet component)
6. Share result — Dialog opens, copy toast fires
7. Mobile (375px) — stacked layout, bottom sheet history
8. No console errors

---

## File Summary

| File                   | Action            | Est. Size          |
| ---------------------- | ----------------- | ------------------ |
| `src/App.jsx`          | Root component    | ~80 lines          |
| `src/components/*.jsx` | 14 components     | ~60-120 lines each |
| `src/hooks/*.js`       | 2 custom hooks    | ~40 lines each     |
| `src/lib/api.js`       | API helper        | ~30 lines          |
| `src/index.css`        | Tailwind + custom | ~100 lines         |
| `tailwind.config.js`   | Design tokens     | ~60 lines          |
