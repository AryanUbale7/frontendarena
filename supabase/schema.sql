-- Frontend Arena Database Schema (Idempotent Version)

-- Custom Types (Safely create if they don't exist)
DO $$ BEGIN
    CREATE TYPE event_status AS ENUM ('upcoming', 'active', 'completed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE submission_status AS ENUM ('draft', 'submitted', 'evaluated');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 1. Users Table (Extends Supabase Auth)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  team_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'participant' CHECK (role IN ('participant', 'admin', 'judge')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Events Table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  status event_status DEFAULT 'upcoming',
  problem_statement TEXT,
  starter_kit_link TEXT,
  figma_link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Sponsor Benefits Table
CREATE TABLE IF NOT EXISTS public.sponsor_benefits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sponsor_name TEXT NOT NULL,
  benefit_type TEXT NOT NULL,
  description TEXT,
  discount_code TEXT,
  eligibility_tier TEXT DEFAULT 'all',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Submissions Table
CREATE TABLE IF NOT EXISTS public.submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  project_name TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  tech_stack JSONB DEFAULT '[]'::jsonb,
  github_url TEXT,
  demo_url TEXT,
  video_url TEXT,
  challenges TEXT,
  key_features TEXT,
  future_improvements TEXT,
  status submission_status DEFAULT 'draft',
  submitted_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(participant_id, event_id)
);

-- Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsor_benefits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Safely recreate RLS Policies by dropping them first if they exist
DO $$ BEGIN
    DROP POLICY IF EXISTS "Users are viewable by everyone" ON public.users;
    DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
    DROP POLICY IF EXISTS "Events are viewable by everyone" ON public.events;
    DROP POLICY IF EXISTS "Benefits viewable by authenticated users" ON public.sponsor_benefits;
    DROP POLICY IF EXISTS "Participants can manage own submissions" ON public.submissions;
    DROP POLICY IF EXISTS "Submitted projects viewable by everyone" ON public.submissions;
EXCEPTION
    WHEN undefined_object THEN null;
END $$;

-- RLS Policies

-- Users: Can read all users (for leaderboards), but only update themselves.
CREATE POLICY "Users are viewable by everyone" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Events: Viewable by everyone. Admins manage.
CREATE POLICY "Events are viewable by everyone" ON public.events FOR SELECT USING (true);

-- Sponsor Benefits: Viewable by authenticated users.
CREATE POLICY "Benefits viewable by authenticated users" ON public.sponsor_benefits FOR SELECT USING (auth.role() = 'authenticated');

-- Submissions: 
-- 1. Participants can view and manage their own submissions.
-- 2. Submitted projects are viewable by everyone (for Hall of Fame/Leaderboard).
CREATE POLICY "Participants can manage own submissions" ON public.submissions FOR ALL USING (auth.uid() = participant_id);
CREATE POLICY "Submitted projects viewable by everyone" ON public.submissions FOR SELECT USING (status = 'submitted');

-- Triggers to auto-create user profiles on Auth Signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, full_name, team_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'team_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Safely drop trigger before recreating
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Dummy data for testing the UI (Use ON CONFLICT to avoid duplicate insert errors)
INSERT INTO public.events (id, name, description, start_date, end_date, status) 
VALUES ('00000000-0000-0000-0000-000000000000', 'Frontend Wars 2026', 'The flagship event.', NOW(), NOW() + interval '12 days', 'active')
ON CONFLICT (id) DO NOTHING;

-- 5. Sponsor Inquiries Table
CREATE TABLE IF NOT EXISTS public.sponsor_inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT NOT NULL,
  tier TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE public.sponsor_inquiries ENABLE ROW LEVEL SECURITY;

-- Policies for sponsor_inquiries
DO $$ BEGIN
    DROP POLICY IF EXISTS "Anyone can submit sponsor inquiries" ON public.sponsor_inquiries;
    DROP POLICY IF EXISTS "Anyone can read sponsor inquiries" ON public.sponsor_inquiries;
EXCEPTION
    WHEN undefined_object THEN null;
END $$;

CREATE POLICY "Anyone can submit sponsor inquiries" ON public.sponsor_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read sponsor inquiries" ON public.sponsor_inquiries FOR SELECT USING (true);

-- 6. Rate Limiting Table
CREATE TABLE IF NOT EXISTS public.rate_limits (
  key TEXT PRIMARY KEY,
  request_count INTEGER DEFAULT 0,
  window_reset TIMESTAMPTZ NOT NULL
);

-- Enable RLS
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Allow all operations for rate checking (Server Actions call anonymously)
DO $$ BEGIN
    DROP POLICY IF EXISTS "Allow all operations on rate_limits" ON public.rate_limits;
EXCEPTION
    WHEN undefined_object THEN null;
END $$;

CREATE POLICY "Allow all operations on rate_limits" ON public.rate_limits FOR ALL USING (true) WITH CHECK (true);

-- 7. Add Content Management Columns to Events
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS problem_statement TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS starter_kit_link TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS figma_link TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS problem_statement_url TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS problem_statement_filename TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS resource_file_url TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS resource_file_filename TEXT;




