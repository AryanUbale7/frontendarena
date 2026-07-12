-- Migration: 0005_problem_statements.sql
-- Create tracks, teams, team_members, profiles, and problem_statements tables with RLS and private Storage buckets

-- 1. Create tracks table
CREATE TABLE IF NOT EXISTS public.tracks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create teams table
CREATE TABLE IF NOT EXISTS public.teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  track_id UUID REFERENCES public.tracks(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create team_members table
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- 4. Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sync users to profiles trigger
CREATE OR REPLACE FUNCTION public.sync_user_to_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (NEW.id, NEW.full_name, NEW.avatar_url)
  ON CONFLICT (id) DO UPDATE
  SET full_name = EXCLUDED.full_name,
      avatar_url = EXCLUDED.avatar_url,
      updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER sync_user_to_profile_trigger
AFTER INSERT OR UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.sync_user_to_profile();

-- Seed initial profile records from users
INSERT INTO public.profiles (id, full_name, avatar_url, created_at, updated_at)
SELECT id, full_name, avatar_url, created_at, updated_at FROM public.users
ON CONFLICT (id) DO NOTHING;

-- 5. Create problem_statements table
CREATE TABLE IF NOT EXISTS public.problem_statements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  track_id UUID REFERENCES public.tracks(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL, -- size in bytes
  status TEXT CHECK (status IN ('draft', 'published')) DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update updated_at column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply auto-update trigger
CREATE OR REPLACE TRIGGER update_problem_statements_updated_at
BEFORE UPDATE ON public.problem_statements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problem_statements ENABLE ROW LEVEL SECURITY;

-- Helper check function for admin role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid() AND users.role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. RLS Policies
-- Profiles policies
CREATE POLICY "Allow public read of profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Admins can manage profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

-- Tracks policies
CREATE POLICY "Everyone can read tracks" ON public.tracks FOR SELECT USING (true);
CREATE POLICY "Admins can manage tracks" ON public.tracks FOR ALL USING (true) WITH CHECK (true);

-- Teams policies
CREATE POLICY "Everyone can read teams" ON public.teams FOR SELECT USING (true);
CREATE POLICY "Admins can manage teams" ON public.teams FOR ALL USING (true) WITH CHECK (true);

-- Team members policies
CREATE POLICY "Everyone can read team members" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "Admins can manage team members" ON public.team_members FOR ALL USING (true) WITH CHECK (true);

-- Problem Statements policies
CREATE POLICY "Admins can manage problem statements" ON public.problem_statements FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Everyone can view published problem statements" ON public.problem_statements
  FOR SELECT
  USING (status = 'published');

-- 7. Indexes
CREATE INDEX IF NOT EXISTS idx_problem_statements_track_id ON public.problem_statements(track_id);
CREATE INDEX IF NOT EXISTS idx_problem_statements_status ON public.problem_statements(status);

-- 8. Storage Private Bucket Configuration
INSERT INTO storage.buckets (id, name, public)
VALUES ('problem-statements', 'problem-statements', false)
ON CONFLICT (id) DO NOTHING;

-- Storage object policies
CREATE POLICY "Admin full storage access" ON storage.objects FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Participant read storage access for published problem statements" ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'problem-statements' AND
    EXISTS (
      SELECT 1 
      FROM public.team_members tm
      JOIN public.teams t ON tm.team_id = t.id
      JOIN public.tracks tr ON t.track_id = tr.id
      JOIN public.problem_statements ps ON ps.track_id = tr.id
      WHERE tm.user_id = auth.uid() 
        AND ps.status = 'published'
        AND storage.objects.name = ps.track_id::text || '/' || ps.file_name
    )
  );
