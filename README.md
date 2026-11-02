# 🍳 CraveAI — The Intelligent Culinary Magazine & Digital Cookbook

**CraveAI** is a modern food-magazine style digital cookbook where users discover chef-crafted recipes with AI-assisted food photography, dynamic servings recalculation, interactive mise-en-place checklists, step-by-step instructions with sensory visual cues, and a real-time contextual AI sous-chef.

Now upgraded with a **production-minded Google-style search engine, persistent database-backed search history, and an explainable personalized recommendation system** powered by Supabase PostgreSQL and Row Level Security (RLS).

---

## ✨ Features

- **Google-Style Search Autocomplete**:
  - Debounced queries (~250ms) with keyword match highlighting.
  - Full keyboard navigation (`ArrowUp`, `ArrowDown`, `Enter`, `Escape`).
  - Dropdown grouping: **Recent Searches**, **Matching Recipes** (with thumbnails and meta badges), **Matching Ingredients**, **Cuisines**, and **Personalized Suggestions**.
  - Empty search state surfaces **Popular Right Now** dishes.
- **Persistent Database-Backed Search History**:
  - Automatically records authenticated user searches in Supabase.
  - Normalized search queries, timestamps, and deduplication within 10-minute intervals.
  - One-click deletion of individual history items and "Clear all" capability.
  - Guest mode with safe local fallback.
- **Explainable Personalized Recommendation Engine**:
  - Deterministic multi-signal scoring system combining:
    - Recent searches with exponential recency decay (7-day half-life).
    - Saved favorites (strong preference signal).
    - Recipe interactions (views, search clicks, cooking starts).
    - Cuisine and ingredient affinity matching.
    - Diversity balance (avoiding recommending only what you already saved).
    - Strict allergen and dietary exclusions from user profile.
  - Dedicated recommendation carousels:
    - *Recommended for You*
    - *Based on Your Recent Searches*
    - *Because You Love [Cuisine]*
    - *Popular Right Now*
    - *Explore Something New*
  - Plain-English explanations (e.g. *"Because you searched for paneer recipes"*).
- **14 Master Culinary Recipes**: Authentic, fully written recipes spanning North Indian, Italian, Cantonese, French Patisserie, Thai, and Levantine cuisines.
- **Dynamic Servings Stepper**: Automatically recalculates all ingredient amounts with smart culinary fractions (e.g. `1 1/2 cups`, `2 1/4 tbsp`).
- **Interactive Mise-en-Place Checklists**: Tick off ingredients as you prepare them.
- **Sensory & Visual Cues for Every Step**: Cooking times, temperatures, and descriptions of how food looks, smells, and bubbles at each stage.
- **AI Pantry Recipe Generator**: Enter whatever you have in your fridge, select a cuisine, and receive a bespoke chef-level recipe.
- **Real AI Food Photography**: Connects to AI image generation engines with authentic fallbacks when offline (clearly indicating whether an image is AI-generated).
- **Contextual AI Sous-Chef**: Embedded conversational cooking assistant on every recipe page to answer questions about substitutions, timing, and technique.
- **Supabase Auth & Row Level Security (RLS)**:
  - Email/Password sign up, sign in, sign out modal.
  - Strict RLS policies guaranteeing users only access their own search history, preferences, and interactions.

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

### 3. Run the Development Server
```bash
npm run dev
```

Open your browser and navigate to **[http://localhost:3000](http://localhost:3000)**.

---

## 🗄️ Supabase PostgreSQL Setup & Migrations

CraveAI is built with a **resilient hybrid architecture**: it works 100% out of the box using its rich catalog fallback, and seamlessly connects to your live Supabase database the moment credentials are added.

### 1. Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and create a free account & new project.
2. Under **Project Settings -> API**, copy:
   - **Project URL**
   - **anon / public key**
   - **service_role key** (keep secret, server-side only)

### 2. Configure Environment Variables
Open your `.env.local` file and add:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Apply SQL Migrations
In your Supabase Dashboard, navigate to the **SQL Editor** and run the migration files in order:
1. Copy and run `supabase/migrations/20261023000001_initial_schema.sql` (Creates tables, full-text search indexes, and RLS policies).
2. Copy and run `supabase/migrations/20261023000002_seed_recipes.sql` (Seeds all 14 master recipes into the `recipes` table).

*Alternatively, seed automatically via terminal:*
```bash
npm run seed
```

---

## 🧪 Running the Verification Test Suite

CraveAI includes an automated test runner verifying all 12 key search, recommendation, and API integration criteria:
```bash
npm test
```

---

## 📁 Project Architecture

```
d:\stdy\idk\
├── app/
│   ├── layout.js              # Global layout, Google Fonts (Playfair & Plus Jakarta Sans)
│   ├── page.js                # Editorial Homepage with Google SearchBar
│   ├── globals.css            # Tailwind CSS v4 & custom print stylesheet
│   ├── explore/
│   │   └── page.js            # Search Results, Filters & Recommendation Carousels
│   ├── recipe/[id]/
│   │   └── page.js            # Recipe detail page with servings scaler & interaction logging
│   ├── ai-chef/
│   │   └── page.js            # AI Recipe Studio
│   ├── cookbook/
│   │   └── page.js            # My Saved Cookbook (localStorage & Supabase sync)
│   └── api/
│       ├── auth/              # Sign in, Sign up, Sign out, User status
│       ├── search/            # Full-text search route
│       │   ├── suggestions/   # Google-style autocomplete suggestions endpoint
│       │   └── history/       # Search history GET, POST, DELETE
│       ├── recommendations/   # Personalized multi-signal recommendation engine
│       ├── interactions/      # User interaction logging (view, save, search_select)
│       ├── recipes/[id]/
│       │   └── similar/       # Contextual recipe similarity
│       ├── user/preferences/  # Dietary and allergy profile management
│       ├── generate-recipe/   # Gemini / Smart Culinary Recipe API
│       ├── generate-image/    # Real AI Food Photography endpoint
│       └── chat-assistant/    # Contextual AI Sous-Chef endpoint
├── components/
│   ├── Navbar.js              # Header with compact SearchBar & AuthModal
│   ├── SearchBar.js           # Google-Style debounced autocomplete search bar
│   ├── AuthModal.js           # Supabase Auth modal for Sign In / Sign Up
│   ├── Footer.js              # Magazine-style footer
│   ├── HeroSection.js         # "What are we craving today?" hero
│   ├── CategoryPills.js       # Category filters with icons
│   ├── RecipeCard.js          # Recipe preview cards with favorites toggle
│   └── CookingAssistant.js    # Embedded AI Sous-Chef chat interface
├── data/
│   └── recipes.js             # Master catalog of 14 chef-tested recipes
├── lib/
│   ├── recipes-repository.js  # Hybrid repository (Supabase PostgreSQL + Catalog fallback)
│   ├── search-history-service.js # Persistent search history & deduplication
│   ├── recommendation-engine.js # Scoring formula with recency decay
│   ├── recipe-helpers.js      # Servings scaler math, fraction formatter, filters
│   └── supabase/
│       ├── config.js          # Verification helpers
│       ├── client.js          # Browser client
│       ├── server.js          # Server client with cookies & verified auth
│       └── admin.js           # Service-role admin client
├── supabase/
│   └── migrations/
│       ├── 20261023000001_initial_schema.sql # Tables, indexes, RLS policies
│       └── 20261023000002_seed_recipes.sql  # 14 recipes seed data
├── scripts/
│   ├── seed-supabase.mjs      # Database seed runner
│   └── test-search-system.mjs # Automated test suite (npm test)
└── .env.example               # Environment variables template
```

---

## 🚢 Deploying to Vercel

1. Push your project to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Add CraveAI personalized search and recommendation engine"
   git branch -M main
   git remote add origin https://github.com/your-username/crave-ai.git
   git push -u origin main
   ```
2. In the [Vercel Dashboard](https://vercel.com):
   - Import your repository.
   - Under **Settings -> Environment Variables**, configure:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`
     - `GEMINI_API_KEY`
   - Click **Deploy**. Vercel will build and deploy your application globally.
