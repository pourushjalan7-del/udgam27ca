-- =========================================================================
-- UDGAM'27 Campus Ambassador Portal - Supabase Permissions Fix
-- Run this in Supabase Dashboard -> SQL Editor -> New Query -> Run
-- Project: https://supabase.com/dashboard/project/ozqpawnsrlscwgpcxohk
-- =========================================================================

-- 1. Grant Schema Usage to anon and authenticated API roles
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;

-- 2. Grant Full CRUD Permissions on all existing tables to anon and authenticated
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- 3. Automatically grant permissions on any future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO postgres, anon, authenticated, service_role;

-- 4. Disable Row Level Security (RLS) on all tables for public portal access
ALTER TABLE IF EXISTS public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.ambassador_stats DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.managers DISABLE ROW LEVEL SECURITY;
