-- =========================================================================
-- UDGAM'27 Campus Ambassador Portal - Supabase PostgreSQL Schema & Seed Data
-- E-Cell, IIT Guwahati
-- =========================================================================

-- 1. Create Tables
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('ambassador', 'manager', 'admin')),
  role_title TEXT,
  college TEXT,
  initials TEXT,
  ca_id TEXT UNIQUE,
  phone TEXT,
  department TEXT,
  year_of_study TEXT,
  state TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  short_description TEXT NOT NULL,
  detailed_description TEXT NOT NULL,
  instructions JSONB NOT NULL DEFAULT '[]'::jsonb,
  submission_requirements TEXT,
  submission_type TEXT NOT NULL CHECK (submission_type IN ('link', 'file', 'text')),
  accepted_formats TEXT,
  placeholder_text TEXT,
  assigned_date TEXT NOT NULL,
  deadline TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  points INTEGER NOT NULL CHECK (points > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.submissions (
  id TEXT PRIMARY KEY,
  task_id TEXT NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  ambassador_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  ambassador_name TEXT NOT NULL,
  college TEXT NOT NULL,
  avatar TEXT,
  submission_type TEXT NOT NULL,
  submission_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  file_url TEXT,
  file_name TEXT,
  file_size TEXT,
  max_points INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending_review' 
    CHECK (status IN ('pending_review', 'approved', 'needs_revision', 'rejected')),
  points_awarded INTEGER DEFAULT NULL,
  reviewed_by TEXT,
  reviewed_at TEXT,
  feedback TEXT,
  submitted_at TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.ambassador_stats (
  ambassador_id TEXT PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  tasks_completed INTEGER NOT NULL DEFAULT 0,
  avg_speed_days NUMERIC(4, 1) NOT NULL DEFAULT 0.0,
  total_score INTEGER NOT NULL DEFAULT 0,
  current_rank INTEGER NOT NULL DEFAULT 999,
  performance TEXT DEFAULT 'Moderate',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.managers (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  username TEXT NOT NULL,
  manager_id TEXT NOT NULL,
  domain TEXT NOT NULL,
  department TEXT NOT NULL,
  phone TEXT,
  evaluations_count INTEGER DEFAULT 0,
  pending_in_queue INTEGER DEFAULT 0,
  avg_turnaround TEXT DEFAULT '2.0 hrs',
  status TEXT DEFAULT 'active',
  joined_date TEXT,
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Permissions & Row Level Security (RLS) Configuration
-- Grant schema usage to API roles
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;

-- Grant full table, sequence, and routine privileges
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- Ensure future tables inherit these permissions
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO postgres, anon, authenticated, service_role;

-- Disable Row Level Security (RLS) for seamless client access with anon key
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.ambassador_stats DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.managers DISABLE ROW LEVEL SECURITY;

-- 3. Seed Super Admin
INSERT INTO public.users (id, name, email, username, password_hash, role, role_title, college, initials, ca_id, phone, department, year_of_study, state)
VALUES 
('user-adm-1', 'Aman Singhania', 'aman.singhania@ecell-iitg.org', 'admin', 'admin123', 'admin', 'Head of Operations & Lead Admin', 'E-Cell, IIT Guwahati', 'AS', 'UDGAM27-ADMIN-01', '+91 98760 12345', 'Executive Board', 'Staff', 'Assam')
ON CONFLICT (id) DO NOTHING;

-- 4. Seed 8 Review Managers
INSERT INTO public.users (id, name, email, username, password_hash, role, role_title, college, initials, ca_id, phone, department, year_of_study, state)
VALUES 
('user-mgr-1', 'Pooja Verma', 'pooja.verma@ecell-iitg.org', 'manager', 'manager123', 'manager', 'CA Task Review Manager', 'E-Cell, IIT Guwahati', 'PV', 'UDGAM27-MGR-01', '+91 98112 34567', 'Media & PR Track', 'Staff', 'Assam'),
('user-mgr-2', 'Arunav Sengupta', 'arunav.s@ecell-iitg.org', 'arunav_mgr', 'manager123', 'manager', 'CA Task Review Manager', 'E-Cell, IIT Guwahati', 'AS', 'UDGAM27-MGR-02', '+91 98311 44556', 'Events & On-Ground Outreach', 'Staff', 'Assam'),
('user-mgr-3', 'Nandini Kashyap', 'nandini.k@ecell-iitg.org', 'nandini_mgr', 'manager123', 'manager', 'CA Task Review Manager', 'E-Cell, IIT Guwahati', 'NK', 'UDGAM27-MGR-03', '+91 98722 88990', 'Academic Outreach', 'Staff', 'Assam'),
('user-mgr-4', 'Harshit Bajpai', 'harshit.b@ecell-iitg.org', 'harshit_mgr', 'manager123', 'manager', 'CA Task Review Manager', 'E-Cell, IIT Guwahati', 'HB', 'UDGAM27-MGR-04', '+91 98910 12344', 'Strategic Alliances', 'Staff', 'Assam'),
('user-mgr-5', 'Debojit Barman', 'debojit.b@ecell-iitg.org', 'debojit_mgr', 'manager123', 'manager', 'CA Task Review Manager', 'E-Cell, IIT Guwahati', 'DB', 'UDGAM27-MGR-05', '+91 94350 99881', 'Data & Registrations', 'Staff', 'Assam'),
('user-mgr-6', 'Ritwika Das', 'ritwika.d@ecell-iitg.org', 'ritwika_mgr', 'manager123', 'manager', 'CA Task Review Manager', 'E-Cell, IIT Guwahati', 'RD', 'UDGAM27-MGR-06', '+91 98305 66778', 'Quality Assurance & Reports', 'Staff', 'Assam'),
('user-mgr-7', 'Siddharth Roy', 'siddharth.r@ecell-iitg.org', 'siddharth_mgr', 'manager123', 'manager', 'CA Task Review Manager', 'E-Cell, IIT Guwahati', 'SR', 'UDGAM27-MGR-07', '+91 94011 22334', 'Regional Special Operations', 'Staff', 'Assam'),
('user-mgr-8', 'Ananya Swaminathan', 'ananya.s@ecell-iitg.org', 'ananya_mgr', 'manager123', 'manager', 'CA Task Review Manager', 'E-Cell, IIT Guwahati', 'AS', 'UDGAM27-MGR-08', '+91 98410 77665', 'CA Operations Support', 'Staff', 'Assam')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.managers (id, user_id, name, email, username, manager_id, domain, department, phone, evaluations_count, pending_in_queue, avg_turnaround, status, joined_date, avatar)
VALUES
('user-mgr-1', 'user-mgr-1', 'Pooja Verma', 'pooja.verma@ecell-iitg.org', 'manager', 'UDGAM27-MGR-01', 'Social Media & Digital Promotion (Tasks 1-2)', 'Media & PR Track', '+91 98112 34567', 142, 2, '1.8 hrs', 'active', 'Aug 15, 2026', 'PV'),
('user-mgr-2', 'user-mgr-2', 'Arunav Sengupta', 'arunav.s@ecell-iitg.org', 'arunav_mgr', 'UDGAM27-MGR-02', 'Offline Campus Activations & Kiosks (Task 6)', 'Events & On-Ground Outreach', '+91 98311 44556', 98, 1, '2.4 hrs', 'active', 'Sep 01, 2026', 'AS'),
('user-mgr-3', 'user-mgr-3', 'Nandini Kashyap', 'nandini.k@ecell-iitg.org', 'nandini_mgr', 'UDGAM27-MGR-03', 'Classroom Pitches & Notice Boards (Tasks 4, 9)', 'Academic Outreach', '+91 98722 88990', 115, 1, '1.5 hrs', 'active', 'Sep 10, 2026', 'NK'),
('user-mgr-4', 'user-mgr-4', 'Harshit Bajpai', 'harshit.b@ecell-iitg.org', 'harshit_mgr', 'UDGAM27-MGR-04', 'College Society & Club Collaborations (Tasks 5, 11)', 'Strategic Alliances', '+91 98910 12344', 84, 0, '3.2 hrs', 'active', 'Sep 15, 2026', 'HB'),
('user-mgr-5', 'user-mgr-5', 'Debojit Barman', 'debojit.b@ecell-iitg.org', 'debojit_mgr', 'UDGAM27-MGR-05', 'Participant Rosters & Lead Sheets (Task 7)', 'Data & Registrations', '+91 94350 99881', 130, 0, '2.0 hrs', 'active', 'Oct 01, 2026', 'DB'),
('user-mgr-6', 'user-mgr-6', 'Ritwika Das', 'ritwika.d@ecell-iitg.org', 'ritwika_mgr', 'UDGAM27-MGR-06', 'Weekly Reports & Capstone Dossiers (Tasks 3, 10, 12)', 'Quality Assurance & Reports', '+91 98305 66778', 76, 1, '2.8 hrs', 'active', 'Oct 05, 2026', 'RD'),
('user-mgr-7', 'user-mgr-7', 'Siddharth Roy', 'siddharth.r@ecell-iitg.org', 'siddharth_mgr', 'UDGAM27-MGR-07', 'North-East Region Special Outreach Track', 'Regional Special Operations', '+91 94011 22334', 104, 0, '1.9 hrs', 'active', 'Oct 12, 2026', 'SR'),
('user-mgr-8', 'user-mgr-8', 'Ananya Swaminathan', 'ananya.s@ecell-iitg.org', 'ananya_mgr', 'UDGAM27-MGR-08', 'Quality Audit & Grievance Resolutions', 'CA Operations Support', '+91 98410 77665', 65, 0, '2.2 hrs', 'active', 'Oct 18, 2026', 'AS')
ON CONFLICT (id) DO NOTHING;

-- 5. Seed Campus Ambassadors & Initial Leaderboard Stats
INSERT INTO public.users (id, name, email, username, password_hash, role, role_title, college, initials, ca_id, phone, department, year_of_study, state)
VALUES 
('amb-1', 'Priya Sundaram', 'priya.s@iitm.ac.in', 'priya_iitm', 'password123', 'ambassador', 'Campus Ambassador', 'IIT Madras', 'PS', 'UDGAM27-CA-1001', '+91 98401 23456', 'Computer Science & Engineering', '3rd Year, B.Tech', 'Tamil Nadu'),
('amb-2', 'Aditya Verma', 'aditya.v@pilani.bits-pilani.ac.in', 'aditya_bits', 'password123', 'ambassador', 'Campus Ambassador', 'BITS Pilani', 'AV', 'UDGAM27-CA-1002', '+91 98290 87654', 'Mechanical Engineering', '4th Year, B.Tech', 'Rajasthan'),
('amb-3', 'Sneha Mukherjee', 'sneha.m@ju.edu.in', 'sneha_ju', 'password123', 'ambassador', 'Campus Ambassador', 'Jadavpur University', 'SM', 'UDGAM27-CA-1003', '+91 98300 45678', 'Information Technology', '3rd Year, B.Tech', 'West Bengal'),
('amb-4', 'Rohan Kulkarni', 'rohan.k@coep.ac.in', 'rohan_coep', 'password123', 'ambassador', 'Campus Ambassador', 'COEP Tech Pune', 'RK', 'UDGAM27-CA-1004', '+91 98220 11223', 'Electronics & Telecom', '3rd Year, B.Tech', 'Maharashtra'),
('amb-5', 'Rahul Sharma', 'rahul.sharma@example.com', 'rahul123', 'password123', 'ambassador', 'Campus Ambassador', 'NIT Silchar', 'RS', 'UDGAM27-CA-1042', '+91 98765 43210', 'Computer Science & Engineering', '3rd Year, B.Tech', 'Assam'),
('amb-6', 'Ananya Deshmukh', 'ananya.d@vnit.ac.in', 'ananya_vnit', 'password123', 'ambassador', 'Campus Ambassador', 'VNIT Nagpur', 'AD', 'UDGAM27-CA-1006', '+91 98711 99887', 'Electrical Engineering', '2nd Year, B.Tech', 'Maharashtra'),
('amb-7', 'Devendra Rathore', 'devendra.r@iitr.ac.in', 'devendra_iitr', 'password123', 'ambassador', 'Campus Ambassador', 'IIT Roorkee', 'DR', 'UDGAM27-CA-1007', '+91 98970 33445', 'Civil Engineering', '4th Year, B.Tech', 'Uttarakhand'),
('amb-8', 'Kavya Nair', 'kavya.n@nitc.ac.in', 'kavya_nitc', 'password123', 'ambassador', 'Campus Ambassador', 'NIT Calicut', 'KN', 'UDGAM27-CA-1008', '+91 94470 55667', 'Computer Science & Engineering', '3rd Year, B.Tech', 'Kerala'),
('amb-9', 'Ayush Patel', 'ayush.p@svnit.ac.in', 'ayush_svnit', 'password123', 'ambassador', 'Campus Ambassador', 'SVNIT Surat', 'AP', 'UDGAM27-CA-1009', '+91 98250 77889', 'Chemical Engineering', '3rd Year, B.Tech', 'Gujarat'),
('amb-10', 'Meera Nambiar', 'meera.n@dtu.ac.in', 'meera_dtu', 'password123', 'ambassador', 'Campus Ambassador', 'DTU Delhi', 'MN', 'UDGAM27-CA-1010', '+91 98100 88990', 'Mathematics & Computing', '2nd Year, B.Tech', 'Delhi NCR'),
('amb-11', 'Tanmay Joshi', 'tanmay.j@iitg.ac.in', 'tanmay_iitg', 'password123', 'ambassador', 'Campus Ambassador', 'IIT Guwahati', 'TJ', 'UDGAM27-CA-1011', '+91 94350 12345', 'Design (DoD)', '3rd Year, B.Des', 'Assam'),
('amb-12', 'Sarthak Bansal', 'sarthak.b@thapar.edu', 'sarthak_thapar', 'password123', 'ambassador', 'Campus Ambassador', 'Thapar Institute', 'SB', 'UDGAM27-CA-1012', '+91 98150 44556', 'Computer Engineering', '3rd Year, B.Tech', 'Punjab')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.ambassador_stats (ambassador_id, tasks_completed, avg_speed_days, total_score, current_rank, performance)
VALUES
('amb-1', 11, 1.2, 1850, 1, 'Exceptional'),
('amb-2', 10, 1.5, 1680, 2, 'Outstanding'),
('amb-3', 9, 1.8, 1520, 3, 'Superior'),
('amb-4', 8, 2.1, 1360, 4, 'High'),
('amb-5', 7, 2.4, 1100, 5, 'High'),
('amb-6', 7, 2.8, 1050, 6, 'Good'),
('amb-7', 6, 2.0, 980, 7, 'Good'),
('amb-8', 6, 2.5, 920, 8, 'Good'),
('amb-9', 5, 3.1, 790, 9, 'Moderate'),
('amb-10', 5, 3.4, 740, 10, 'Moderate'),
('amb-11', 4, 2.2, 660, 11, 'Moderate'),
('amb-12', 4, 3.8, 590, 12, 'On Track')
ON CONFLICT (ambassador_id) DO NOTHING;

-- 6. Seed 12 Summit Tasks
INSERT INTO public.tasks (id, title, short_description, detailed_description, instructions, submission_requirements, submission_type, accepted_formats, placeholder_text, assigned_date, deadline, status, points)
VALUES
('task-1', 'Share UDGAM''27 registration announcement in college WhatsApp groups', 'Disseminate official poster and link across batch and college group chats.', 'Spread the word about UDGAM''27, the flagship entrepreneurship summit of IIT Guwahati. Share the official announcement poster, message, and registration link in at least 3 major college WhatsApp or Telegram communities.', '["Download promotional message and graphics.", "Share in at least 3 distinct student groups.", "Take screenshots showing timestamp.", "Upload screenshot or drive link."]'::jsonb, 'Publicly accessible link (Google Drive, Imgur, or direct post URL).', 'link', NULL, 'https://drive.google.com/drive/folders/...', 'Oct 15, 2026', 'Oct 22, 2026', 'completed', 100),
('task-2', 'Publish a UDGAM''27 promotional story on Instagram', 'Post official UDGAM''27 poster as a story, tag @ecell_iitg, and add event link.', 'Create visibility for the summit on social media. Post the summit teaser story on your personal or college society Instagram handle, tagging @ecell_iitg.', '["Use official high-resolution story template.", "Tag @ecell_iitg and use hashtag #UDGAM27.", "Add link sticker pointing to udgam.ecell-iitg.org."]'::jsonb, 'Instagram story highlight URL or screenshot drive link.', 'link', NULL, 'https://instagram.com/stories/...', 'Oct 18, 2026', 'Oct 25, 2026', 'completed', 100),
('task-3', 'Prepare and submit a campus outreach report', 'Document on-ground student reach, society meetings, and key promotional milestones.', 'Compile a structured 2-page outreach summary detailing student reactions, prominent clubs contacted, and estimated event reach across departments.', '["Summarize societies contacted.", "Include 2-3 event photos or chat highlights.", "Export as standard PDF format."]'::jsonb, 'Comprehensive PDF document (under 10 MB).', 'file', '.pdf', NULL, 'Oct 22, 2026', 'Oct 29, 2026', 'completed', 150),
('task-4', 'Share UDGAM''27 poster across college communities', 'Distribute official poster across student hostel notice boards and common areas.', 'Print and display official UDGAM posters on key campus notice boards (Library, Main Canteen, Hostels, Department boards) with permission.', '["Print at least 4 official A3 posters.", "Pin in high footfall locations.", "Photograph each placed poster."]'::jsonb, 'Clear image (.jpg, .png) or merged PDF showing all posted notices.', 'file', '.jpg,.png,.jpeg,.pdf', NULL, 'Oct 25, 2026', 'Nov 01, 2026', 'completed', 120),
('task-5', 'Identify entrepreneurship clubs in your college', 'Compile contact list of existing business clubs, incubation cells, and faculty in-charge.', 'Research and outline all entrepreneurship, innovation, and leadership clubs in your college. Identify key student heads and faculty advisors for formal partnerships.', '["List Club Name, President Name, Email, Phone.", "Provide short summary of past activities."]'::jsonb, 'Formatted text detailing clubs, heads, and direct phone/email contacts.', 'text', NULL, 'Enter club details, faculty advisor contact, and lead members...', 'Oct 28, 2026', 'Nov 04, 2026', 'completed', 80),
('task-6', 'Organize a campus promotional activity', 'Host a flash quiz, booth, or kiosk introducing UDGAM''27 competitions and cash prizes.', 'Conduct an interactive on-ground activation on campus. Set up an information desk during lunch hours or a mini-quiz around famous Indian startups.', '["Obtain required permissions.", "Organize kiosk or 15-minute quiz session.", "Take 3-5 photographs.", "Compile into 1-2 page PDF."]'::jsonb, 'PDF summary report including event photos and attendee count.', 'file', '.pdf', NULL, 'Oct 30, 2026', 'Nov 06, 2026', 'completed', 250),
('task-7', 'Create a list of potential participants', 'Collate verified roster of students interested in pitching, case studies, and hackathons.', 'Gather contact details of aspiring student founders, coders, and business minds from your college keen to participate in flagship events.', '["Collect Name, Dept, Year, Event Category, Email.", "Ensure minimum 25 verified leads.", "Export as Excel (.xlsx) or CSV."]'::jsonb, 'Spreadsheet (.xlsx, .csv) or compiled PDF containing at least 25 student leads.', 'file', '.xlsx,.csv,.pdf', NULL, 'Nov 02, 2026', 'Nov 09, 2026', 'completed', 180),
('task-8', 'Promote UDGAM''27 through LinkedIn', 'Author professional LinkedIn article or post detailing speaker sessions and networking.', 'Amplify UDGAM''27 on professional networks. Write a thoughtful post highlighting marquee speakers, workshops, venture capital exposure, and how it empowers student entrepreneurs.', '["Craft 150-250 word professional post.", "Tag @E-Cell IIT Guwahati and @UDGAM IITG.", "Paste published post URL."]'::jsonb, 'Direct URL of live LinkedIn post.', 'link', NULL, 'https://www.linkedin.com/posts/...', 'Nov 05, 2026', 'Nov 12, 2026', 'pending', 100),
('task-9', 'Conduct a classroom announcement', 'Deliver 5-minute briefing in 2nd and 3rd year lecture halls explaining event perks.', 'Deliver brief classroom announcements introducing the summit, internships, certificate benefits, and cash prizes worth ₹15 Lakhs+.', '["Present in at least 3 lecture halls.", "Have a classmate capture photos during announcement.", "Upload photos below."]'::jsonb, 'Photograph(s) or signed note from class representative/professor.', 'file', '.jpg,.png,.jpeg,.pdf', NULL, 'Nov 08, 2026', 'Nov 15, 2026', 'pending', 140),
('task-10', 'Submit a weekly outreach report', 'Consolidated status update of outreach efforts, queries resolved, and social metrics.', 'Draft a weekly progress summary outlining how many students signed up through your referral link, questions answered, and upcoming promotional drives.', '["Detail registrations driven.", "List student questions and how resolved.", "Upload as PDF."]'::jsonb, 'Weekly PDF report (1-3 pages).', 'file', '.pdf', NULL, 'Nov 10, 2026', 'Nov 17, 2026', 'pending', 160),
('task-11', 'Connect with college societies for collaboration', 'Engage cultural, technical, and fine arts societies for co-branded promotion.', 'Initiate conversations with prominent college societies (e.g. Coding Club, Debate Club, Rotaract) to cross-promote UDGAM''27 workshops and bootcamps.', '["Schedule meeting with society coordinators.", "Propose cross-promotional story swap.", "Provide summary of discussions."]'::jsonb, 'Summary of society outreach, meeting notes, and coordinator contact details.', 'text', NULL, 'Enter meeting minutes, agreement terms, and society coordinator details...', 'Nov 12, 2026', 'Nov 19, 2026', 'pending', 160),
('task-12', 'Submit the final Campus Ambassador report', 'Capstone dossier documenting your entire term, total footfall, and summit registrations.', 'The culminating deliverable for the Campus Ambassador Program. Collate your complete term contributions, all posters placed, social traction, and final participant registration tally.', '["Comprehensive 5-8 page report.", "Include photo gallery.", "Compile into single high-res PDF."]'::jsonb, 'Final capstone PDF report (under 25 MB).', 'file', '.pdf', NULL, 'Nov 15, 2026', 'Nov 22, 2026', 'pending', 300)
ON CONFLICT (id) DO NOTHING;

-- 7. Seed Initial Submissions
INSERT INTO public.submissions (id, task_id, ambassador_id, ambassador_name, college, avatar, submission_type, submission_data, file_name, file_size, max_points, status, points_awarded, reviewed_by, reviewed_at, feedback, submitted_at)
VALUES
('sub-101', 'task-1', 'amb-1', 'Priya Sundaram', 'IIT Madras', 'PS', 'link', '{"url": "https://drive.google.com/drive/folders/1aBcDeFgHiJkLmNoP"}'::jsonb, NULL, NULL, 100, 'approved', 100, 'Pooja Verma (Manager)', 'Oct 23, 2026, 04:30 PM', 'Verified! Excellent broadcast across 4 active groups.', 'Oct 22, 2026, 02:15 PM'),
('sub-102', 'task-2', 'amb-2', 'Aditya Verma', 'BITS Pilani', 'AV', 'link', '{"url": "https://instagram.com/stories/highlights/17928374628"}'::jsonb, NULL, NULL, 100, 'approved', 95, 'Pooja Verma (Manager)', 'Oct 26, 2026, 11:20 AM', 'Great story reach, sticker engagement verified.', 'Oct 25, 2026, 09:40 PM'),
('sub-103', 'task-6', 'amb-3', 'Sneha Mukherjee', 'Jadavpur University', 'SM', 'file', '{"fileName": "JU_UDGAM27_FlashQuiz_Activation.pdf", "fileSize": "4.2 MB"}'::jsonb, 'JU_UDGAM27_FlashQuiz_Activation.pdf', '4.2 MB', 250, 'approved', 250, 'Arunav Sengupta (Manager)', 'Nov 07, 2026, 03:15 PM', 'Spectacular on-ground turnout! Over 120 attendees.', 'Nov 06, 2026, 01:45 PM'),
('sub-104', 'task-9', 'amb-1', 'Priya Sundaram', 'IIT Madras', 'PS', 'file', '{"fileName": "IITM_DoMS_Classroom_Pitch.png", "fileSize": "1.8 MB"}'::jsonb, 'IITM_DoMS_Classroom_Pitch.png', '1.8 MB', 140, 'pending_review', NULL, NULL, NULL, NULL, 'Nov 09, 2026, 06:10 PM'),
('sub-105', 'task-11', 'amb-4', 'Rohan Kulkarni', 'COEP Tech Pune', 'RK', 'text', '{"text": "Met with President of Robotics Club and Literary Society. Both agreed in principle."}'::jsonb, NULL, NULL, 160, 'needs_revision', 0, 'Harshit Bajpai (Manager)', 'Nov 09, 2026, 04:30 PM', 'Please provide coordinator email addresses and phone numbers.', 'Nov 09, 2026, 01:20 PM'),
('sub-106', 'task-7', 'amb-5', 'Rahul Sharma', 'NIT Silchar', 'RS', 'file', '{"fileName": "UDGAM27_Potential_Participants_NIT_Silchar.xlsx", "fileSize": "84 KB"}'::jsonb, 'UDGAM27_Potential_Participants_NIT_Silchar.xlsx', '84 KB', 180, 'approved', 180, 'Debojit Barman (Manager)', 'Nov 08, 2026, 07:00 PM', 'Excellent verified list with 32 interested students across CSE batches. Full marks!', 'Nov 08, 2026, 05:15 PM')
ON CONFLICT (id) DO NOTHING;
