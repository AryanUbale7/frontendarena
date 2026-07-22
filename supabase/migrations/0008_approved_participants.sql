-- Migration: 0008_approved_participants.sql
-- Description: Table for whitelisting approved participant emails from Unstop

CREATE TABLE IF NOT EXISTS public.approved_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  registered BOOLEAN NOT NULL DEFAULT false,
  registered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast O(1) email lookups during signup
CREATE INDEX IF NOT EXISTS idx_approved_participants_email 
ON public.approved_participants (LOWER(email));

-- RLS: Enable RLS and allow admins full access
ALTER TABLE public.approved_participants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage approved participants" ON public.approved_participants;
CREATE POLICY "Admins can manage approved participants" 
ON public.approved_participants 
FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Allow public read access to check email eligibility during signup securely
DROP POLICY IF EXISTS "Public can check approved email status" ON public.approved_participants;
CREATE POLICY "Public can check approved email status" 
ON public.approved_participants 
FOR SELECT USING (true);
