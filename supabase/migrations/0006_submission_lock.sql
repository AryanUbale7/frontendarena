-- Migration: 0006_submission_lock.sql
-- Description: Add locking support to submissions and enforce one-time-only submission per team + track.

-- 1. Add new columns to public.submissions
ALTER TABLE public.submissions 
ADD COLUMN IF NOT EXISTS locked BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS track_id UUID REFERENCES public.tracks(id) ON DELETE CASCADE;

-- 2. Enforce unique submissions per team per track at database level
ALTER TABLE public.submissions DROP CONSTRAINT IF EXISTS submissions_team_id_track_id_key;
ALTER TABLE public.submissions ADD CONSTRAINT submissions_team_id_track_id_key UNIQUE (team_id, track_id);

-- 3. Trigger to automatically set locked = true on INSERT
CREATE OR REPLACE FUNCTION public.lock_submission_on_insert()
RETURNS TRIGGER AS $$
BEGIN
  NEW.locked := true;
  NEW.submitted_at := COALESCE(NEW.submitted_at, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_lock_submission_on_insert ON public.submissions;
CREATE TRIGGER trg_lock_submission_on_insert
BEFORE INSERT ON public.submissions
FOR EACH ROW
EXECUTE FUNCTION public.lock_submission_on_insert();

-- 4. Update Row Level Security (RLS) policies
DROP POLICY IF EXISTS "Participants can manage own submissions" ON public.submissions;
DROP POLICY IF EXISTS "Team members can insert own team submissions" ON public.submissions;
DROP POLICY IF EXISTS "Team members can view own team submissions" ON public.submissions;
DROP POLICY IF EXISTS "Admins can manage all submissions" ON public.submissions;

-- SELECT: Allow team members to view their own team's submissions
CREATE POLICY "Team members can view own team submissions" ON public.submissions
FOR SELECT USING (
  auth.uid() = participant_id OR
  EXISTS (
    SELECT 1 FROM public.team_members tm
    WHERE tm.team_id = submissions.team_id AND tm.user_id = auth.uid()
  )
);

-- INSERT: Allow team members to create a submission for their team
CREATE POLICY "Team members can insert own team submissions" ON public.submissions
FOR INSERT WITH CHECK (
  auth.uid() = participant_id AND
  EXISTS (
    SELECT 1 FROM public.team_members tm
    WHERE tm.team_id = team_id AND tm.user_id = auth.uid()
  )
);

-- ALL: Admins can do everything (override, update, delete)
CREATE POLICY "Admins can manage all submissions" ON public.submissions
FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
