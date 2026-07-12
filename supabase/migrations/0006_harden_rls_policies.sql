-- Migration 0006: Harden RLS Policies
-- This migration drops insecure policies and recreates them with proper admin checks and row-level restrictions.

-- 1. Helper function for admin check
-- Ensures the user is actually an admin according to their role in the users table.
-- We must make sure users cannot maliciously update their own role (see trigger below).
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid() AND users.role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Drop existing insecure policies
DO $$ BEGIN
    -- Profiles (from 0005)
    DROP POLICY IF EXISTS "Admins can manage profiles" ON public.profiles;
    -- Tracks (from 0005)
    DROP POLICY IF EXISTS "Admins can manage tracks" ON public.tracks;
    -- Teams (from 0005)
    DROP POLICY IF EXISTS "Admins can manage teams" ON public.teams;
    -- Team members (from 0005)
    DROP POLICY IF EXISTS "Admins can manage team members" ON public.team_members;
    -- Problem statements (from 0005)
    DROP POLICY IF EXISTS "Admins can manage problem statements" ON public.problem_statements;
    -- Storage (from 0005)
    DROP POLICY IF EXISTS "Admin full storage access" ON storage.objects;
    
    -- Users (from original schema)
    DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
    
    -- Sponsor Inquiries (from original schema)
    DROP POLICY IF EXISTS "Anyone can read sponsor inquiries" ON public.sponsor_inquiries;
EXCEPTION
    WHEN undefined_object THEN null;
END $$;

-- 3. Recreate Policies with public.is_admin() check

-- Profiles
CREATE POLICY "Admins can manage profiles" ON public.profiles FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Tracks
CREATE POLICY "Admins can manage tracks" ON public.tracks FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Teams
CREATE POLICY "Admins can manage teams" ON public.teams FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Team members
CREATE POLICY "Admins can manage team members" ON public.team_members FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Problem Statements
CREATE POLICY "Admins can manage problem statements" ON public.problem_statements FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Storage Objects
CREATE POLICY "Admin full storage access" ON storage.objects FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Sponsor Inquiries
-- Only admins should read sponsor inquiries
CREATE POLICY "Admins can read sponsor inquiries" ON public.sponsor_inquiries FOR SELECT USING (public.is_admin());
-- Also allow admins to delete/manage them
CREATE POLICY "Admins can manage sponsor inquiries" ON public.sponsor_inquiries FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Users Table Update Policy
-- Recreate the user update policy but STILL allow users to update their own profile
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
-- Also give admins full access to manage users
CREATE POLICY "Admins can manage users" ON public.users FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 4. Prevent Role Escalation Trigger
-- Prevent users from setting their own role to 'admin' when updating their profile.
CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS TRIGGER AS $$
BEGIN
  -- If the user executing this is NOT an admin, and they are trying to change the role
  IF NOT public.is_admin() AND NEW.role IS DISTINCT FROM OLD.role THEN
    RAISE EXCEPTION 'You do not have permission to change your role.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS prevent_user_role_escalation ON public.users;
CREATE TRIGGER prevent_user_role_escalation
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE PROCEDURE public.prevent_role_escalation();
