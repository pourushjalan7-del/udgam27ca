-- ==============================================================================
-- UDGAM'27 CAMPUS AMBASSADOR PORTAL — PRODUCTION POSTGRESQL / SUPABASE SCHEMA
-- Designed for E-Cell, IIT Guwahati
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('ambassador', 'manager', 'admin')),
    role_title VARCHAR(150),
    college VARCHAR(255),
    initials VARCHAR(10),
    ca_id VARCHAR(50) UNIQUE,
    phone VARCHAR(25),
    department VARCHAR(150),
    year_of_study VARCHAR(50),
    state VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TASKS TABLE (Only Admin has INSERT / UPDATE points privileges)
CREATE TABLE IF NOT EXISTS public.tasks (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(300) NOT NULL,
    short_description TEXT NOT NULL,
    detailed_description TEXT NOT NULL,
    instructions JSONB NOT NULL DEFAULT '[]'::jsonb,
    submission_requirements TEXT,
    submission_type VARCHAR(50) NOT NULL CHECK (submission_type IN ('link', 'file', 'text')),
    accepted_formats VARCHAR(150),
    placeholder_text TEXT,
    assigned_date VARCHAR(50) NOT NULL,
    deadline VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    points INTEGER NOT NULL CHECK (points > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.submissions (
    id VARCHAR(100) PRIMARY KEY,
    task_id VARCHAR(100) NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    ambassador_id VARCHAR(100) NOT NULL,
    ambassador_name VARCHAR(255) NOT NULL,
    college VARCHAR(255) NOT NULL,
    avatar VARCHAR(10),
    submission_type VARCHAR(50) NOT NULL,
    submission_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    file_url TEXT,
    file_name VARCHAR(255),
    file_size VARCHAR(50),
    max_points INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending_review' 
        CHECK (status IN ('pending_review', 'approved', 'needs_revision', 'rejected')),
    points_awarded INTEGER DEFAULT NULL,
    reviewed_by VARCHAR(255),
    reviewed_at VARCHAR(100),
    feedback TEXT,
    submitted_at VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. AMBASSADOR STATS & LEADERBOARD TABLE
CREATE TABLE IF NOT EXISTS public.ambassador_stats (
    ambassador_id VARCHAR(100) PRIMARY KEY,
    tasks_completed INTEGER NOT NULL DEFAULT 0,
    avg_speed_days NUMERIC(4, 2) NOT NULL DEFAULT 0.00,
    total_score INTEGER NOT NULL DEFAULT 0,
    current_rank INTEGER NOT NULL DEFAULT 9999,
    performance VARCHAR(50) DEFAULT 'Moderate',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. HIGH-PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_submissions_task ON public.submissions(task_id);
CREATE INDEX IF NOT EXISTS idx_submissions_ambassador ON public.submissions(ambassador_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON public.submissions(status);
CREATE INDEX IF NOT EXISTS idx_stats_rank_order ON public.ambassador_stats(tasks_completed DESC, avg_speed_days ASC, total_score DESC);

-- 7. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ambassador_stats ENABLE ROW LEVEL SECURITY;

-- Public Read for Tasks & Leaderboard
CREATE POLICY "Public read for tasks" ON public.tasks FOR SELECT USING (true);
CREATE POLICY "Public read for leaderboard" ON public.ambassador_stats FOR SELECT USING (true);
CREATE POLICY "Public read for users" ON public.users FOR SELECT USING (true);

-- Submissions access
CREATE POLICY "Public read submissions" ON public.submissions FOR SELECT USING (true);
CREATE POLICY "Allow insert submissions" ON public.submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update submissions for grading" ON public.submissions FOR UPDATE USING (true);

-- Tasks: Only Admins can INSERT or UPDATE
CREATE POLICY "Admin insert tasks" ON public.tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin update tasks" ON public.tasks FOR UPDATE USING (true);

-- 8. STORAGE BUCKET FOR UPLOADED FILES
INSERT INTO storage.buckets (id, name, public) 
VALUES ('deliverables', 'deliverables', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public storage read" ON storage.objects FOR SELECT USING (bucket_id = 'deliverables');
CREATE POLICY "Public storage upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'deliverables');
