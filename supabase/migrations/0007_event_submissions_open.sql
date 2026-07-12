-- Migration: 0007_event_submissions_open.sql
-- Description: Add a submissions_open boolean column to events table to control participant submission access.

ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS submissions_open BOOLEAN NOT NULL DEFAULT true;
