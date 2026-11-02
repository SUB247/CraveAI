-- CraveAI Supabase Database Migration
-- 001_initial_schema.sql
-- Enables full-text search, trigrams, persistent search history, user preferences, and recommendation interactions

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 2. Master Recipes Table
CREATE TABLE IF NOT EXISTS public.recipes (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  category TEXT NOT NULL,
  cuisine TEXT NOT NULL,
  prep_time TEXT,
  prep_time_minutes INTEGER DEFAULT 0,
  cook_time TEXT,
  cook_time_minutes INTEGER DEFAULT 0,
  total_time TEXT,
  servings INTEGER NOT NULL DEFAULT 4,
  difficulty TEXT NOT NULL DEFAULT 'Medium',
  rating NUMERIC(3, 2) DEFAULT 4.90,
  review_count INTEGER DEFAULT 100,
  calories INTEGER,
  tags TEXT[] DEFAULT '{}',
  equipment TEXT[] DEFAULT '{}',
  ingredients JSONB NOT NULL DEFAULT '[]'::jsonb,
  steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  chef_tips TEXT[] DEFAULT '{}',
  substitutions JSONB DEFAULT '[]'::jsonb,
  common_mistakes JSONB DEFAULT '[]'::jsonb,
  allergens TEXT[] DEFAULT '{}',
  safety TEXT,
  storage TEXT,
  image_url TEXT,
  is_ai_generated BOOLEAN DEFAULT FALSE,
  nutrition JSONB DEFAULT '{}'::jsonb,
  search_vector TSVECTOR GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(cuisine, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(category, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(tagline, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'D')
  ) STORED,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Search History Table (persistent, user-specific)
CREATE TABLE IF NOT EXISTS public.search_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  normalized_query TEXT NOT NULL,
  selected_recipe_id TEXT REFERENCES public.recipes(id) ON DELETE SET NULL,
  category TEXT,
  result_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. User Preferences Table (dietary, allergies, preferred cuisines)
CREATE TABLE IF NOT EXISTS public.user_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  preferred_cuisines TEXT[] DEFAULT '{}',
  dietary_preferences TEXT[] DEFAULT '{}',
  excluded_ingredients TEXT[] DEFAULT '{}',
  preferred_categories TEXT[] DEFAULT '{}',
  maximum_cooking_time INTEGER,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Recipe Interactions Table (views, saves, clicks for recommendations)
CREATE TABLE IF NOT EXISTS public.recipe_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipe_id TEXT NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('view', 'save', 'search_select', 'cook')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. User Favorites Table (synced cross-device favorites)
CREATE TABLE IF NOT EXISTS public.user_favorites (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipe_id TEXT NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, recipe_id)
);

-- 7. Performance & Search Indexes
CREATE INDEX IF NOT EXISTS idx_recipes_search_vector ON public.recipes USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_recipes_title_trgm ON public.recipes USING GIN(title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_recipes_cuisine_trgm ON public.recipes USING GIN(cuisine gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_recipes_category ON public.recipes(category);
CREATE INDEX IF NOT EXISTS idx_recipes_cook_time ON public.recipes(cook_time_minutes);
CREATE INDEX IF NOT EXISTS idx_recipes_rating ON public.recipes(rating DESC);

CREATE INDEX IF NOT EXISTS idx_search_history_user_time ON public.search_history(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_search_history_user_query ON public.search_history(user_id, normalized_query);

CREATE INDEX IF NOT EXISTS idx_interactions_user_time ON public.recipe_interactions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_interactions_user_recipe ON public.recipe_interactions(user_id, recipe_id);

CREATE INDEX IF NOT EXISTS idx_favorites_user_time ON public.user_favorites(user_id, created_at DESC);

-- 8. Row Level Security (RLS) Configuration
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

-- RLS Policies: recipes (Public read, admin write)
DROP POLICY IF EXISTS "Recipes are viewable by everyone" ON public.recipes;
CREATE POLICY "Recipes are viewable by everyone"
  ON public.recipes FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Recipes are insertable by service_role" ON public.recipes;
CREATE POLICY "Recipes are insertable by service_role"
  ON public.recipes FOR ALL
  USING (auth.jwt()->>'role' = 'service_role' OR auth.role() = 'service_role');

-- RLS Policies: search_history (User isolated)
DROP POLICY IF EXISTS "Users can view own search history" ON public.search_history;
CREATE POLICY "Users can view own search history"
  ON public.search_history FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own search history" ON public.search_history;
CREATE POLICY "Users can insert own search history"
  ON public.search_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own search history" ON public.search_history;
CREATE POLICY "Users can delete own search history"
  ON public.search_history FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies: user_preferences (User isolated)
DROP POLICY IF EXISTS "Users can view own preferences" ON public.user_preferences;
CREATE POLICY "Users can view own preferences"
  ON public.user_preferences FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own preferences" ON public.user_preferences;
CREATE POLICY "Users can insert own preferences"
  ON public.user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own preferences" ON public.user_preferences;
CREATE POLICY "Users can update own preferences"
  ON public.user_preferences FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own preferences" ON public.user_preferences;
CREATE POLICY "Users can delete own preferences"
  ON public.user_preferences FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies: recipe_interactions (User isolated)
DROP POLICY IF EXISTS "Users can view own interactions" ON public.recipe_interactions;
CREATE POLICY "Users can view own interactions"
  ON public.recipe_interactions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own interactions" ON public.recipe_interactions;
CREATE POLICY "Users can insert own interactions"
  ON public.recipe_interactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own interactions" ON public.recipe_interactions;
CREATE POLICY "Users can delete own interactions"
  ON public.recipe_interactions FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies: user_favorites (User isolated)
DROP POLICY IF EXISTS "Users can view own favorites" ON public.user_favorites;
CREATE POLICY "Users can view own favorites"
  ON public.user_favorites FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own favorites" ON public.user_favorites;
CREATE POLICY "Users can insert own favorites"
  ON public.user_favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own favorites" ON public.user_favorites;
CREATE POLICY "Users can delete own favorites"
  ON public.user_favorites FOR DELETE
  USING (auth.uid() = user_id);
