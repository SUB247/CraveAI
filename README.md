# 🍳 CraveAI — The Intelligent Culinary Magazine & Digital Cookbook

**CraveAI** is a modern food-magazine style digital cookbook where users discover chef-crafted recipes with AI-assisted food photography, dynamic servings recalculation, interactive mise-en-place checklists, step-by-step instructions with sensory visual cues, and a real-time contextual AI sous-chef.

---

## ✨ Features

- **Food-Magazine Editorial Aesthetic**: Warm cream palettes, dark typography, terracotta accents, rounded cards, and generous whitespace.
- **14 Master Culinary Recipes**: Authentic, fully written recipes spanning North Indian, Italian, Cantonese, French Patisserie, Thai, and Levantine cuisines.
- **Dynamic Servings Stepper**: Automatically recalculates all ingredient amounts with smart culinary fractions (e.g. `1 1/2 cups`, `2 1/4 tbsp`).
- **Interactive Mise-en-Place Checklists**: Tick off ingredients as you prepare them.
- **Sensory & Visual Cues for Every Step**: Cooking times, temperatures, and descriptions of how food looks, smells, and bubbles at each stage.
- **AI Pantry Recipe Generator**: Enter whatever you have in your fridge, select a cuisine, and receive a bespoke chef-level recipe.
- **Real AI Food Photography**: Connects to AI image generation engines with authentic fallbacks when offline (clearly indicating whether an image is AI-generated).
- **Contextual AI Sous-Chef**: Embedded conversational cooking assistant on every recipe page to answer questions about substitutions, timing, and technique.
- **My Cookbook**: Locally persistent archive to save your favorite dishes and review AI creations anytime.
- **Print & Share**: Dedicated print styling for distraction-free kitchen printing and one-click link copying.

---

## 🚀 Quick Start (Windows)

### 1. Requirements
Ensure you have **Node.js 18+** installed. You can check by running in PowerShell or Command Prompt:
```bash
node -v
npm -v
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables (Optional)
CraveAI is **100% functional out of the box** without API keys thanks to its built-in smart culinary engine!

To unlock live **Google Gemini 2.5 Flash** recipe creation and real-time conversational assistance:
1. Copy `.env.example` to `.env.local`:
   ```powershell
   Copy-Item .env.example .env.local
   ```
2. Open `.env.local` and add your free Google AI Studio API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   *(Get your free key at: [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey))*

### 4. Run the Development Server
```bash
npm run dev
```

Open your browser and navigate to **[http://localhost:3000](http://localhost:3000)**.

---

## 📁 Project Architecture

```
d:\stdy\idk\
├── app/
│   ├── layout.js              # Global layout, Google Fonts (Playfair & Plus Jakarta Sans)
│   ├── page.js                # Editorial Homepage
│   ├── globals.css            # Tailwind CSS v4 & custom print stylesheet
│   ├── explore/
│   │   └── page.js            # Explore & Filter catalog
│   ├── recipe/[id]/
│   │   └── page.js            # Dedicated Recipe detail page with servings scaler & assistant
│   ├── ai-chef/
│   │   └── page.js            # AI Recipe Studio
│   ├── cookbook/
│   │   └── page.js            # My Saved Cookbook (localStorage persisted)
│   └── api/
│       ├── generate-recipe/   # Gemini / Smart Culinary Recipe API
│       ├── generate-image/    # Real AI Food Photography endpoint
│       └── chat-assistant/    # Contextual AI Sous-Chef endpoint
├── components/
│   ├── Navbar.js              # Header with search & active badge counters
│   ├── Footer.js              # Magazine-style footer
│   ├── HeroSection.js         # "What are we craving today?" hero
│   ├── CategoryPills.js       # Category filters with icons
│   ├── RecipeCard.js          # Recipe preview cards with favorites toggle
│   └── CookingAssistant.js    # Embedded AI Sous-Chef chat interface
├── data/
│   └── recipes.js             # Master catalog of 14 chef-tested recipes
├── lib/
│   ├── recipe-helpers.js      # Servings scaler math, fraction formatter, filters
│   └── storage.js             # LocalStorage helpers for favorites & custom recipes
└── .env.example               # Environment variables template
```

---

## 🚢 Deploying to Vercel

1. Push your project to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial CraveAI commit"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```
2. Go to [https://vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Under **Environment Variables**, add:
   - `GEMINI_API_KEY`: *(your Gemini API key)*
5. Click **Deploy**. Vercel will automatically build and deploy your Next.js application!

---

## 🍽 Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: JavaScript (ES6+)
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **AI Intelligence**: Google Gemini API (`@google/genai`)
- **State Persistence**: Browser LocalStorage
