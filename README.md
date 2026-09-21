# FORNOVA INTERIOR — Atelier Website

> A bespoke, luxury web application for **Fornova Interior**, a premier interior architecture and turnkey execution atelier based in Vadodara, Gujarat.

[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF.svg?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Vanilla CSS](https://img.shields.io/badge/Design_System-Warm_Luxury_CSS-B88E4F.svg?style=flat-square)](https://github.com/Programmer-NITIN/Fornova)
[![Google Sheets Lead Sync](https://img.shields.io/badge/Backend-Google_Apps_Script-34A853.svg?style=flat-square&logo=google-sheets)](https://github.com/Programmer-NITIN/Fornova)

---

## ✨ Features

- **Warm Luxury Aesthetic**: Tailored typography (Playfair Display & DM Sans), curated golden-amber/charcoal palette, frosted glassmorphic containers, and fluid micro-animations.
- **100% Responsive Architecture**: Meticulously optimized for mobile devices (320px–480px, Samsung Galaxy, iPhone) and wide desktop displays without layout overflow.
- **Hero & Conversion Funnel**: Primary **Book Consultation** CTA with smooth anchor scrolling straight to the inquiry form.
- **Floating Luxury Action Dock**: Bottom-anchored action dock featuring live studio status pill (`[ 🟢 CONTACT ]`) and quick-access touch micro-containers for Direct Phone Call (`tel:`), WhatsApp Chat Desk, Instagram (`@fornova.interior`), and Consultation Booking.
- **Interactive Before / After Transformation**: Draggable split-screen visualizer showcasing site progress from 2D CAD architectural blueprints to turnkey reality.
- **Lead Capture & Sheet Integration**: Connected to Google Apps Script (`exec` endpoint) logging leads to a Google Sheet with instant automated email alerts.

---

## 📁 Repository Structure

```
├── assets/                  # Brand vectors, photography, textures, and video reel
│   ├── fornova-logo-*.svg   # Official SVG vector logos (horizontal & monogram)
│   ├── hero-luxury-bg.jpg   # High-resolution hero background
│   ├── 38.mp4               # Background video reel
│   └── *.jpeg               # Curated project portfolio photography
├── css/
│   └── design-system.css    # Unified design tokens, luxury UI components, and mobile queries
├── js/
│   └── app.js               # Transformation slider, modal lightbox & form handler
├── index.html               # Main single-page application entry
├── GOOGLE_SHEET_SETUP.md    # Documentation & Apps Script code for Google Sheets lead sync
├── package.json             # Project dependencies & Vite scripts
└── .gitignore               # Ignored dependencies and build artifacts
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm

### Installation & Local Development

```bash
# Clone the repository
git clone https://github.com/Programmer-NITIN/Fornova.git

# Enter project directory
cd Fornova

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173/` in your browser.

### Production Build

```bash
npm run build
```

The compiled, production-ready static bundle will be generated in `dist/`.

---

## 📄 License & Credits

Developed for **Fornova Interior**, Vadodara, Gujarat. All rights reserved.
