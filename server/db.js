import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'portal.db');
export const db = new Database(dbPath);

// Enable WAL mode for high concurrency and performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// 1. Initialize Tables
export function initDatabase() {
  db.exec(`
    -- Users Table
    CREATE TABLE IF NOT EXISTS users (
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
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Tasks Table
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      short_description TEXT NOT NULL,
      detailed_description TEXT NOT NULL,
      instructions TEXT NOT NULL DEFAULT '[]', -- JSON array of steps
      submission_requirements TEXT,
      submission_type TEXT NOT NULL CHECK (submission_type IN ('link', 'file', 'text')),
      accepted_formats TEXT,
      placeholder_text TEXT,
      assigned_date TEXT NOT NULL,
      deadline TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      points INTEGER NOT NULL CHECK (points > 0),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Submissions Table
    CREATE TABLE IF NOT EXISTS submissions (
      id TEXT PRIMARY KEY,
      task_id TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
      ambassador_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      ambassador_name TEXT NOT NULL,
      college TEXT NOT NULL,
      avatar TEXT,
      submission_type TEXT NOT NULL,
      submission_data TEXT NOT NULL DEFAULT '{}', -- JSON object
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
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Ambassador Stats / Leaderboard Table
    CREATE TABLE IF NOT EXISTS ambassador_stats (
      ambassador_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      tasks_completed INTEGER NOT NULL DEFAULT 0,
      avg_speed_days REAL NOT NULL DEFAULT 0.0,
      total_score INTEGER NOT NULL DEFAULT 0,
      current_rank INTEGER NOT NULL DEFAULT 999,
      performance TEXT DEFAULT 'Moderate',
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Managers Table
    DROP TABLE IF EXISTS managers;
    CREATE TABLE IF NOT EXISTS managers (
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
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Performance Indexes
    CREATE INDEX IF NOT EXISTS idx_submissions_task ON submissions(task_id);
    CREATE INDEX IF NOT EXISTS idx_submissions_ambassador ON submissions(ambassador_id);
    CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
    CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
    CREATE INDEX IF NOT EXISTS idx_stats_ordering ON ambassador_stats(tasks_completed DESC, avg_speed_days ASC, total_score DESC);
  `);

  seedInitialData();
  seedManagers();
}

// 2. Seeding Initial Data
function seedInitialData() {
  const userCount = db.prepare('SELECT COUNT(*) AS count FROM users').get().count;
  if (userCount > 0) {
    return; // Already seeded
  }

  console.log('🌱 Seeding fresh initial database records for UDGAM\'27 Portal...');

  // A. Seed Staff Users
  const insertUser = db.prepare(`
    INSERT INTO users (id, name, email, username, password_hash, role, role_title, college, initials, ca_id, phone, department, year_of_study, state)
    VALUES (@id, @name, @email, @username, @password_hash, @role, @role_title, @college, @initials, @ca_id, @phone, @department, @year_of_study, @state)
  `);

  insertUser.run({
    id: 'user-adm-1',
    name: 'Aman Singhania',
    email: 'aman.singhania@ecell-iitg.org',
    username: 'admin',
    password_hash: 'admin123',
    role: 'admin',
    role_title: 'Head of Operations & Lead Admin',
    college: 'E-Cell, IIT Guwahati',
    initials: 'AS',
    ca_id: 'UDGAM27-ADMIN-01',
    phone: '+91 98760 12345',
    department: 'Executive Board',
    year_of_study: 'Staff',
    state: 'Assam'
  });

  insertUser.run({
    id: 'user-mgr-1',
    name: 'Pooja Verma',
    email: 'pooja.verma@ecell-iitg.org',
    username: 'manager',
    password_hash: 'manager123',
    role: 'manager',
    role_title: 'CA Task Review Manager',
    college: 'E-Cell, IIT Guwahati',
    initials: 'PV',
    ca_id: 'UDGAM27-MGR-04',
    phone: '+91 98112 34567',
    department: 'CA Operations & Outreach',
    year_of_study: 'Staff',
    state: 'Assam'
  });

  // B. Seed Ambassadors
  const ambassadors = [
    { id: 'amb-1', name: 'Priya Sundaram', email: 'priya.s@iitm.ac.in', username: 'priya_iitm', college: 'IIT Madras', initials: 'PS', caId: 'UDGAM27-CA-1001', phone: '+91 98401 23456', tasks: 11, speed: 1.2, score: 1850, perf: 'Exceptional' },
    { id: 'amb-2', name: 'Aditya Verma', email: 'aditya.v@pilani.bits-pilani.ac.in', username: 'aditya_bits', college: 'BITS Pilani', initials: 'AV', caId: 'UDGAM27-CA-1002', phone: '+91 98290 87654', tasks: 10, speed: 1.5, score: 1680, perf: 'Outstanding' },
    { id: 'amb-3', name: 'Sneha Mukherjee', email: 'sneha.m@ju.edu.in', username: 'sneha_ju', college: 'Jadavpur University', initials: 'SM', caId: 'UDGAM27-CA-1003', phone: '+91 98300 45678', tasks: 9, speed: 1.8, score: 1520, perf: 'Superior' },
    { id: 'amb-4', name: 'Rohan Kulkarni', email: 'rohan.k@coep.ac.in', username: 'rohan_coep', college: 'COEP Tech Pune', initials: 'RK', caId: 'UDGAM27-CA-1004', phone: '+91 98220 11223', tasks: 8, speed: 2.1, score: 1360, perf: 'High' },
    { id: 'amb-5', name: 'Rahul Sharma', email: 'rahul.sharma@example.com', username: 'rahul123', college: 'NIT Silchar', initials: 'RS', caId: 'UDGAM27-CA-1042', phone: '+91 98765 43210', tasks: 7, speed: 2.4, score: 1100, perf: 'High' },
    { id: 'amb-6', name: 'Ananya Deshmukh', email: 'ananya.d@vnit.ac.in', username: 'ananya_vnit', college: 'VNIT Nagpur', initials: 'AD', caId: 'UDGAM27-CA-1006', phone: '+91 98711 99887', tasks: 7, speed: 2.8, score: 1050, perf: 'Good' },
    { id: 'amb-7', name: 'Devendra Rathore', email: 'devendra.r@iitr.ac.in', username: 'devendra_iitr', college: 'IIT Roorkee', initials: 'DR', caId: 'UDGAM27-CA-1007', phone: '+91 98970 33445', tasks: 6, speed: 2.0, score: 980, perf: 'Good' },
    { id: 'amb-8', name: 'Kavya Nair', email: 'kavya.n@nitc.ac.in', username: 'kavya_nitc', college: 'NIT Calicut', initials: 'KN', caId: 'UDGAM27-CA-1008', phone: '+91 94470 55667', tasks: 6, speed: 2.5, score: 920, perf: 'Good' },
    { id: 'amb-9', name: 'Ayush Patel', email: 'ayush.p@svnit.ac.in', username: 'ayush_svnit', college: 'SVNIT Surat', initials: 'AP', caId: 'UDGAM27-CA-1009', phone: '+91 98250 77889', tasks: 5, speed: 3.1, score: 790, perf: 'Moderate' },
    { id: 'amb-10', name: 'Meera Nambiar', email: 'meera.n@dtu.ac.in', username: 'meera_dtu', college: 'DTU Delhi', initials: 'MN', caId: 'UDGAM27-CA-1010', phone: '+91 98100 88990', tasks: 5, speed: 3.4, score: 740, perf: 'Moderate' },
    { id: 'amb-11', name: 'Tanmay Joshi', email: 'tanmay.j@iitg.ac.in', username: 'tanmay_iitg', college: 'IIT Guwahati', initials: 'TJ', caId: 'UDGAM27-CA-1011', phone: '+91 94350 12345', tasks: 4, speed: 2.2, score: 660, perf: 'Moderate' },
    { id: 'amb-12', name: 'Sarthak Bansal', email: 'sarthak.b@thapar.edu', username: 'sarthak_thapar', college: 'Thapar Institute', initials: 'SB', caId: 'UDGAM27-CA-1012', phone: '+91 98150 44556', tasks: 4, speed: 3.8, score: 590, perf: 'On Track' },
  ];

  const insertStats = db.prepare(`
    INSERT INTO ambassador_stats (ambassador_id, tasks_completed, avg_speed_days, total_score, current_rank, performance)
    VALUES (@ambassador_id, @tasks_completed, @avg_speed_days, @total_score, @current_rank, @performance)
  `);

  ambassadors.forEach((amb, index) => {
    insertUser.run({
      id: amb.id,
      name: amb.name,
      email: amb.email,
      username: amb.username,
      password_hash: 'password123',
      role: 'ambassador',
      role_title: 'Campus Ambassador',
      college: amb.college,
      initials: amb.initials,
      ca_id: amb.caId,
      phone: amb.phone,
      department: 'Computer Science & Engineering',
      year_of_study: '3rd Year, B.Tech',
      state: 'Assam'
    });

    insertStats.run({
      ambassador_id: amb.id,
      tasks_completed: amb.tasks,
      avg_speed_days: amb.speed,
      total_score: amb.score,
      current_rank: index + 1,
      performance: amb.perf
    });
  });

  // C. Seed 12 Tasks
  const insertTask = db.prepare(`
    INSERT INTO tasks (id, title, short_description, detailed_description, instructions, submission_requirements, submission_type, accepted_formats, placeholder_text, assigned_date, deadline, status, points)
    VALUES (@id, @title, @short_description, @detailed_description, @instructions, @submission_requirements, @submission_type, @accepted_formats, @placeholder_text, @assigned_date, @deadline, @status, @points)
  `);

  const initialTasksList = [
    {
      id: "task-1",
      title: "Share UDGAM'27 registration announcement in college WhatsApp groups",
      short_description: "Disseminate the official registration poster and link across active batch and college group chats.",
      detailed_description: "Spread the word about UDGAM'27, the flagship entrepreneurship summit of IIT Guwahati. Share the official announcement poster, message, and registration link in at least 3 major college WhatsApp or Telegram communities.",
      instructions: JSON.stringify([
        "Download the official promotional message and graphics from the CA resource drive.",
        "Share the announcement in at least 3 distinct student groups.",
        "Take screenshots of the messages showing engagement or timestamp.",
        "Upload the screenshot or drive link."
      ]),
      submission_requirements: "Publicly accessible link (Google Drive, Imgur, or direct post URL).",
      submission_type: "link",
      accepted_formats: null,
      placeholder_text: "https://drive.google.com/drive/folders/...",
      assigned_date: "Oct 15, 2026",
      deadline: "Oct 22, 2026",
      status: "completed",
      points: 100
    },
    {
      id: "task-2",
      title: "Publish a UDGAM'27 promotional story on Instagram",
      short_description: "Post the official UDGAM'27 poster as a story, tag @ecell_iitg, and add the event link.",
      detailed_description: "Create visibility for the summit on your social media. Post the summit teaser story on your personal or college society Instagram handle, tagging @ecell_iitg.",
      instructions: JSON.stringify([
        "Use the official high-resolution story template.",
        "Tag @ecell_iitg and use hashtag #UDGAM27.",
        "Add the link sticker pointing to udgam.ecell-iitg.org."
      ]),
      submission_requirements: "Instagram story highlight URL or screenshot drive link.",
      submission_type: "link",
      accepted_formats: null,
      placeholder_text: "https://instagram.com/stories/...",
      assigned_date: "Oct 18, 2026",
      deadline: "Oct 25, 2026",
      status: "completed",
      points: 120
    },
    {
      id: "task-3",
      title: "Prepare and submit a campus outreach report",
      short_description: "Compile an initial report detailing student outreach channels, reach metrics, and club alignments.",
      detailed_description: "Draft a comprehensive campus outreach report highlighting your initial campaign strategies. Outline student body demographics and club partnerships.",
      instructions: JSON.stringify([
        "Utilize the official E-Cell outreach report template.",
        "Document key reach statistics.",
        "Export as a PDF document (Max 15MB)."
      ]),
      submission_requirements: "Single compiled PDF document detailing outreach strategy.",
      submission_type: "file",
      accepted_formats: ".pdf",
      placeholder_text: null,
      assigned_date: "Oct 22, 2026",
      deadline: "Oct 30, 2026",
      status: "completed",
      points: 200
    },
    {
      id: "task-4",
      title: "Share UDGAM'27 poster across college communities",
      short_description: "Distribute physical or digital posters on central campus boards and student lounges.",
      detailed_description: "Ensure high physical and digital visibility of UDGAM'27 posters across prominent college notice boards.",
      instructions: JSON.stringify([
        "Place posters in at least 4 designated high-traffic locations.",
        "Take clear photographic proof."
      ]),
      submission_requirements: "High resolution image file (PNG, JPG) or PDF showing posters displayed.",
      submission_type: "file",
      accepted_formats: ".pdf,.png,.jpg,.jpeg",
      placeholder_text: null,
      assigned_date: "Oct 26, 2026",
      deadline: "Nov 02, 2026",
      status: "completed",
      points: 150
    },
    {
      id: "task-5",
      title: "Identify entrepreneurship clubs in your college",
      short_description: "Catalog existing innovation and entrepreneurship clubs, their coordinators, and contact details.",
      detailed_description: "Conduct thorough mapping of all innovation, startup, incubation, and entrepreneurial cells active within your institution.",
      instructions: JSON.stringify([
        "Identify official names of E-Cells or clubs.",
        "List faculty in-charge and student president details."
      ]),
      submission_requirements: "Structured written response covering club names and POC contacts.",
      submission_type: "text",
      accepted_formats: null,
      placeholder_text: "1. E-Cell: President [Name], Contact [Phone]...",
      assigned_date: "Oct 28, 2026",
      deadline: "Nov 04, 2026",
      status: "completed",
      points: 100
    },
    {
      id: "task-6",
      title: "Organize a campus promotional activity",
      short_description: "Host a flash quiz, booth, or kiosk on campus introducing UDGAM'27 competitions.",
      detailed_description: "Conduct an interactive on-ground activation on campus. Set up an information desk during lunch hours or a mini-quiz.",
      instructions: JSON.stringify([
        "Obtain required permissions.",
        "Organize an engaging kiosk or quiz session.",
        "Compile a 1-2 page event summary with photos."
      ]),
      submission_requirements: "PDF summary report including event photos and total attendees.",
      submission_type: "file",
      accepted_formats: ".pdf",
      placeholder_text: null,
      assigned_date: "Oct 30, 2026",
      deadline: "Nov 06, 2026",
      status: "completed",
      points: 250
    },
    {
      id: "task-7",
      title: "Create a list of potential participants",
      short_description: "Collate a verified roster of students interested in pitching, case study events, and hackathons.",
      detailed_description: "Gather contact details of aspiring student founders, coders, and business minds from your college.",
      instructions: JSON.stringify([
        "Collect Name, Department, Year, and Email.",
        "Ensure minimum 25 verified leads are recorded."
      ]),
      submission_requirements: "Spreadsheet (.xlsx, .csv) or compiled PDF containing student participant leads.",
      submission_type: "file",
      accepted_formats: ".xlsx,.csv,.pdf",
      placeholder_text: null,
      assigned_date: "Nov 02, 2026",
      deadline: "Nov 09, 2026",
      status: "completed",
      points: 180
    },
    {
      id: "task-8",
      title: "Promote UDGAM'27 through LinkedIn",
      short_description: "Author a professional LinkedIn article or post detailing UDGAM'27 speaker sessions and networking.",
      detailed_description: "Amplify UDGAM'27 on professional networks. Write a thoughtful post highlighting the marquee speakers and venture capital exposure.",
      instructions: JSON.stringify([
        "Craft a 150-250 word professional post.",
        "Tag official pages @E-Cell IIT Guwahati.",
        "Paste your published post URL."
      ]),
      submission_requirements: "Direct URL of the live LinkedIn post.",
      submission_type: "link",
      accepted_formats: null,
      placeholder_text: "https://www.linkedin.com/posts/...",
      assigned_date: "Nov 05, 2026",
      deadline: "Nov 15, 2026",
      status: "pending",
      points: 150
    },
    {
      id: "task-9",
      title: "Conduct a classroom announcement",
      short_description: "Visit 3+ classrooms or lecture halls to deliver a 2-minute elevator pitch about UDGAM'27.",
      detailed_description: "Pitch the summit directly to students before or after lectures. Highlight the ₹10 Lakh+ prize pool.",
      instructions: JSON.stringify([
        "Deliver the elevator pitch covering dates and venue.",
        "Have a peer take a clear photo of you speaking at the podium."
      ]),
      submission_requirements: "Classroom presentation photo proof (PNG, JPG, or PDF).",
      submission_type: "file",
      accepted_formats: ".pdf,.png,.jpg,.jpeg",
      placeholder_text: null,
      assigned_date: "Nov 07, 2026",
      deadline: "Nov 18, 2026",
      status: "pending",
      points: 180
    },
    {
      id: "task-10",
      title: "Submit a weekly outreach report",
      short_description: "Submit weekly metrics including footfalls, click-through rates, and query resolutions.",
      detailed_description: "Provide a concise weekly progress report covering your ambassador activities over the past 7 days.",
      instructions: JSON.stringify([
        "Summarize week 3 promotional performance.",
        "Upload in PDF format."
      ]),
      submission_requirements: "Weekly report document in PDF format (Max 10MB).",
      submission_type: "file",
      accepted_formats: ".pdf",
      placeholder_text: null,
      assigned_date: "Nov 09, 2026",
      deadline: "Nov 20, 2026",
      status: "pending",
      points: 130
    },
    {
      id: "task-11",
      title: "Connect with college societies for collaboration",
      short_description: "Initiate tie-ups with technical, cultural, or literary societies for event cross-promotions.",
      detailed_description: "Reach out to influential societies in your college to cross-promote UDGAM events.",
      instructions: JSON.stringify([
        "Approach executive leads of at least 2 campus clubs.",
        "Document agreed collaboration terms."
      ]),
      submission_requirements: "Text report detailing society names and POC contacts.",
      submission_type: "text",
      accepted_formats: null,
      placeholder_text: "Detail the societies contacted, agreement terms, POC contacts...",
      assigned_date: "Nov 10, 2026",
      deadline: "Nov 23, 2026",
      status: "pending",
      points: 160
    },
    {
      id: "task-12",
      title: "Submit the final Campus Ambassador report",
      short_description: "Comprehensive final documentation of all achievements, overall impact, and learnings.",
      detailed_description: "The capstone submission for your UDGAM'27 Campus Ambassador tenure. Collate end-to-end impact statistics.",
      instructions: JSON.stringify([
        "Compile overall campaign performance.",
        "Upload comprehensive final dossier as a PDF."
      ]),
      submission_requirements: "Final comprehensive report in PDF format (Max 25MB).",
      submission_type: "file",
      accepted_formats: ".pdf",
      placeholder_text: null,
      assigned_date: "Nov 12, 2026",
      deadline: "Nov 30, 2026",
      status: "pending",
      points: 300
    }
  ];

  initialTasksList.forEach((task) => insertTask.run(task));

  // D. Seed Submissions Queue
  const insertSubmission = db.prepare(`
    INSERT INTO submissions (id, task_id, ambassador_id, ambassador_name, college, avatar, submission_type, submission_data, file_name, file_size, max_points, status, points_awarded, reviewed_by, reviewed_at, feedback, submitted_at)
    VALUES (@id, @task_id, @ambassador_id, @ambassador_name, @college, @avatar, @submission_type, @submission_data, @file_name, @file_size, @max_points, @status, @points_awarded, @reviewed_by, @reviewed_at, @feedback, @submitted_at)
  `);

  const initialSubmissionsList = [
    {
      id: "sub-101",
      task_id: "task-10",
      ambassador_id: "amb-1",
      ambassador_name: "Priya Sundaram",
      college: "IIT Madras",
      avatar: "PS",
      submission_type: "file",
      submission_data: JSON.stringify({ fileName: "IIT_Madras_Week3_Report.pdf", fileSize: "3.2 MB" }),
      file_name: "IIT_Madras_Week3_Report.pdf",
      file_size: "3.2 MB",
      max_points: 130,
      status: "pending_review",
      points_awarded: null,
      reviewed_by: null,
      reviewed_at: null,
      feedback: null,
      submitted_at: "Nov 10, 2026, 02:15 PM"
    },
    {
      id: "sub-102",
      task_id: "task-8",
      ambassador_id: "amb-2",
      ambassador_name: "Aditya Verma",
      college: "BITS Pilani",
      avatar: "AV",
      submission_type: "link",
      submission_data: JSON.stringify({ link: "https://www.linkedin.com/posts/aditya-verma-bits/udgam27" }),
      file_name: null,
      file_size: null,
      max_points: 150,
      status: "pending_review",
      points_awarded: null,
      reviewed_by: null,
      reviewed_at: null,
      feedback: null,
      submitted_at: "Nov 10, 2026, 11:30 AM"
    },
    {
      id: "sub-103",
      task_id: "task-9",
      ambassador_id: "amb-3",
      ambassador_name: "Sneha Mukherjee",
      college: "Jadavpur University",
      avatar: "SM",
      submission_type: "file",
      submission_data: JSON.stringify({ fileName: "Jadavpur_CS_Classroom_Pitch_Photos.pdf", fileSize: "4.7 MB" }),
      file_name: "Jadavpur_CS_Classroom_Pitch_Photos.pdf",
      file_size: "4.7 MB",
      max_points: 180,
      status: "pending_review",
      points_awarded: null,
      reviewed_by: null,
      reviewed_at: null,
      feedback: null,
      submitted_at: "Nov 10, 2026, 09:45 AM"
    },
    {
      id: "sub-104",
      task_id: "task-4",
      ambassador_id: "amb-7",
      ambassador_name: "Devendra Rathore",
      college: "IIT Roorkee",
      avatar: "DR",
      submission_type: "file",
      submission_data: JSON.stringify({ fileName: "IITR_Hostel_NoticeBoards_PosterCollage.jpg", fileSize: "5.1 MB" }),
      file_name: "IITR_Hostel_NoticeBoards_PosterCollage.jpg",
      file_size: "5.1 MB",
      max_points: 150,
      status: "pending_review",
      points_awarded: null,
      reviewed_by: null,
      reviewed_at: null,
      feedback: null,
      submitted_at: "Nov 09, 2026, 06:10 PM"
    },
    {
      id: "sub-105",
      task_id: "task-11",
      ambassador_id: "amb-4",
      ambassador_name: "Rohan Kulkarni",
      college: "COEP Tech Pune",
      avatar: "RK",
      submission_type: "text",
      submission_data: JSON.stringify({ text: "Met with President of Robotics Club and Literary Society. Both agreed in principle." }),
      file_name: null,
      file_size: null,
      max_points: 160,
      status: "needs_revision",
      points_awarded: 0,
      reviewed_by: "Pooja Verma (Manager)",
      reviewed_at: "Nov 09, 2026, 04:30 PM",
      feedback: "Please provide official coordinator email addresses, mobile numbers, and an agreed date for the workshop.",
      submitted_at: "Nov 09, 2026, 01:20 PM"
    },
    {
      id: "sub-106",
      task_id: "task-7",
      ambassador_id: "amb-5", // Rahul Sharma
      ambassador_name: "Rahul Sharma",
      college: "NIT Silchar",
      avatar: "RS",
      submission_type: "file",
      submission_data: JSON.stringify({ fileName: "UDGAM27_Potential_Participants_NIT_Silchar.xlsx", fileSize: "84 KB" }),
      file_name: "UDGAM27_Potential_Participants_NIT_Silchar.xlsx",
      file_size: "84 KB",
      max_points: 180,
      status: "approved",
      points_awarded: 180,
      reviewed_by: "Pooja Verma (Manager)",
      reviewed_at: "Nov 08, 2026, 07:00 PM",
      feedback: "Excellent verified list with 32 interested students across CSE and ECE batches. Full marks awarded!",
      submitted_at: "Nov 08, 2026, 05:15 PM"
    }
  ];

  initialSubmissionsList.forEach((sub) => insertSubmission.run(sub));

  console.log('✅ Initial database seed completed successfully!');
}

// 2B. Seeding Managers
function seedManagers() {
  const count = db.prepare('SELECT COUNT(*) AS count FROM managers').get().count;
  if (count > 0) return;

  console.log('🌱 Seeding 8 Task Review Managers into managers & users tables...');

  try {
    db.prepare("UPDATE users SET ca_id = 'UDGAM27-MGR-01' WHERE id = 'user-mgr-1'").run();
  } catch (e) {}

  const defaultManagers = [
    {
      id: "user-mgr-1",
      name: "Pooja Verma",
      email: "pooja.verma@ecell-iitg.org",
      username: "manager",
      managerId: "UDGAM27-MGR-01",
      domain: "Social Media & Digital Promotion (Tasks 1-2)",
      phone: "+91 98112 34567",
      department: "Media & PR Track",
      evaluationsCount: 142,
      pendingInQueue: 2,
      avgTurnaround: "1.8 hrs",
      status: "active",
      joinedDate: "Aug 15, 2026",
      avatar: "PV"
    },
    {
      id: "user-mgr-2",
      name: "Arunav Sengupta",
      email: "arunav.s@ecell-iitg.org",
      username: "arunav_mgr",
      managerId: "UDGAM27-MGR-02",
      domain: "Offline Campus Activations & Kiosks (Task 6)",
      phone: "+91 98311 44556",
      department: "Events & On-Ground Outreach",
      evaluationsCount: 98,
      pendingInQueue: 1,
      avgTurnaround: "2.4 hrs",
      status: "active",
      joinedDate: "Sep 01, 2026",
      avatar: "AS"
    },
    {
      id: "user-mgr-3",
      name: "Nandini Kashyap",
      email: "nandini.k@ecell-iitg.org",
      username: "nandini_mgr",
      managerId: "UDGAM27-MGR-03",
      domain: "Classroom Pitches & Notice Boards (Tasks 4, 9)",
      phone: "+91 98722 88990",
      department: "Academic Outreach",
      evaluationsCount: 115,
      pendingInQueue: 1,
      avgTurnaround: "1.5 hrs",
      status: "active",
      joinedDate: "Sep 10, 2026",
      avatar: "NK"
    },
    {
      id: "user-mgr-4",
      name: "Harshit Bajpai",
      email: "harshit.b@ecell-iitg.org",
      username: "harshit_mgr",
      managerId: "UDGAM27-MGR-04",
      domain: "College Society & Club Collaborations (Tasks 5, 11)",
      phone: "+91 98910 12344",
      department: "Strategic Alliances",
      evaluationsCount: 84,
      pendingInQueue: 0,
      avgTurnaround: "3.2 hrs",
      status: "active",
      joinedDate: "Sep 15, 2026",
      avatar: "HB"
    },
    {
      id: "user-mgr-5",
      name: "Debojit Barman",
      email: "debojit.b@ecell-iitg.org",
      username: "debojit_mgr",
      managerId: "UDGAM27-MGR-05",
      domain: "Participant Rosters & Lead Sheets (Task 7)",
      phone: "+91 94350 99881",
      department: "Data & Registrations",
      evaluationsCount: 130,
      pendingInQueue: 0,
      avgTurnaround: "2.0 hrs",
      status: "active",
      joinedDate: "Oct 01, 2026",
      avatar: "DB"
    },
    {
      id: "user-mgr-6",
      name: "Ritwika Das",
      email: "ritwika.d@ecell-iitg.org",
      username: "ritwika_mgr",
      managerId: "UDGAM27-MGR-06",
      domain: "Weekly Reports & Capstone Dossiers (Tasks 3, 10, 12)",
      phone: "+91 98305 66778",
      department: "Quality Assurance & Reports",
      evaluationsCount: 76,
      pendingInQueue: 1,
      avgTurnaround: "2.8 hrs",
      status: "active",
      joinedDate: "Oct 05, 2026",
      avatar: "RD"
    },
    {
      id: "user-mgr-7",
      name: "Siddharth Roy",
      email: "siddharth.r@ecell-iitg.org",
      username: "siddharth_mgr",
      managerId: "UDGAM27-MGR-07",
      domain: "North-East Region Special Outreach Track",
      phone: "+91 94011 22334",
      department: "Regional Special Operations",
      evaluationsCount: 104,
      pendingInQueue: 0,
      avgTurnaround: "1.9 hrs",
      status: "active",
      joinedDate: "Oct 12, 2026",
      avatar: "SR"
    },
    {
      id: "user-mgr-8",
      name: "Ananya Swaminathan",
      email: "ananya.s@ecell-iitg.org",
      username: "ananya_mgr",
      managerId: "UDGAM27-MGR-08",
      domain: "Quality Audit & Grievance Resolutions",
      phone: "+91 98410 77665",
      department: "CA Operations Support",
      evaluationsCount: 65,
      pendingInQueue: 0,
      avgTurnaround: "2.2 hrs",
      status: "active",
      joinedDate: "Oct 18, 2026",
      avatar: "AS"
    }
  ];

  const insertManager = db.prepare(`
    INSERT OR REPLACE INTO managers (id, user_id, name, email, username, manager_id, domain, department, phone, evaluations_count, pending_in_queue, avg_turnaround, status, joined_date, avatar)
    VALUES (@id, @user_id, @name, @email, @username, @manager_id, @domain, @department, @phone, @evaluations_count, @pending_in_queue, @avg_turnaround, @status, @joined_date, @avatar)
  `);

  const insertUser = db.prepare(`
    INSERT OR IGNORE INTO users (id, name, email, username, password_hash, role, role_title, college, initials, ca_id, phone, department, year_of_study, state)
    VALUES (@id, @name, @email, @username, @password_hash, 'manager', 'CA Task Review Manager', 'E-Cell, IIT Guwahati', @initials, @ca_id, @phone, @department, 'Staff', 'Assam')
  `);

  defaultManagers.forEach((mgr) => {
    insertUser.run({
      id: mgr.id,
      name: mgr.name,
      email: mgr.email,
      username: mgr.username,
      password_hash: 'manager123',
      initials: mgr.avatar,
      ca_id: mgr.managerId,
      phone: mgr.phone,
      department: mgr.department
    });

    insertManager.run({
      id: mgr.id,
      user_id: mgr.id,
      name: mgr.name,
      email: mgr.email,
      username: mgr.username,
      manager_id: mgr.managerId,
      domain: mgr.domain,
      department: mgr.department,
      phone: mgr.phone,
      evaluations_count: mgr.evaluationsCount,
      pending_in_queue: mgr.pendingInQueue,
      avg_turnaround: mgr.avgTurnaround,
      status: mgr.status,
      joined_date: mgr.joinedDate,
      avatar: mgr.avatar
    });
  });

  console.log('✅ Seeded 8 Review Managers successfully!');
}

// 3. Database Operations Helper Functions
export const dbOperations = {
  // Tasks
  getAllTasks: () => {
    const tasks = db.prepare('SELECT * FROM tasks ORDER BY created_at ASC').all();
    return tasks.map(t => ({
      ...t,
      instructions: JSON.parse(t.instructions || '[]')
    }));
  },

  createTask: (task) => {
    const stmt = db.prepare(`
      INSERT INTO tasks (id, title, short_description, detailed_description, instructions, submission_requirements, submission_type, accepted_formats, placeholder_text, assigned_date, deadline, status, points)
      VALUES (@id, @title, @shortDescription, @detailedDescription, @instructions, @submissionRequirements, @submissionType, @acceptedFormats, @placeholderText, @assignedDate, @deadline, 'pending', @points)
    `);

    stmt.run({
      ...task,
      instructions: JSON.stringify(task.instructions || [])
    });

    return dbOperations.getTaskById(task.id);
  },

  getTaskById: (id) => {
    const t = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    if (!t) return null;
    return {
      ...t,
      instructions: JSON.parse(t.instructions || '[]')
    };
  },

  updateTaskPoints: (id, { points, deadline, title, shortDescription }) => {
    const stmt = db.prepare(`
      UPDATE tasks 
      SET points = COALESCE(?, points),
          deadline = COALESCE(?, deadline),
          title = COALESCE(?, title),
          short_description = COALESCE(?, short_description),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    stmt.run(points, deadline, title, shortDescription, id);
    return dbOperations.getTaskById(id);
  },

  // Submissions
  getAllSubmissions: () => {
    const rows = db.prepare('SELECT * FROM submissions ORDER BY created_at DESC').all();
    return rows.map(r => ({
      id: r.id,
      taskId: r.task_id,
      taskTitle: r.task_title || db.prepare('SELECT title FROM tasks WHERE id = ?').get(r.task_id)?.title || 'Task Deliverable',
      ambassadorId: r.ambassador_id,
      ambassadorName: r.ambassador_name,
      college: r.college,
      avatar: r.avatar,
      submissionType: r.submission_type,
      submissionData: JSON.parse(r.submission_data || '{}'),
      fileUrl: r.file_url,
      fileName: r.file_name,
      fileSize: r.file_size,
      maxPoints: r.max_points,
      status: r.status,
      pointsAwarded: r.points_awarded,
      reviewedBy: r.reviewed_by,
      reviewedAt: r.reviewed_at,
      feedback: r.feedback,
      submittedAt: r.submitted_at
    }));
  },

  createSubmission: (sub) => {
    const stmt = db.prepare(`
      INSERT INTO submissions (id, task_id, ambassador_id, ambassador_name, college, avatar, submission_type, submission_data, file_url, file_name, file_size, max_points, status, points_awarded, submitted_at)
      VALUES (@id, @taskId, @ambassadorId, @ambassadorName, @college, @avatar, @submissionType, @submissionData, @fileUrl, @fileName, @fileSize, @maxPoints, 'pending_review', NULL, @submittedAt)
    `);

    stmt.run({
      id: sub.id,
      taskId: sub.taskId,
      ambassadorId: sub.ambassadorId,
      ambassadorName: sub.ambassadorName,
      college: sub.college,
      avatar: sub.avatar,
      submissionType: sub.submissionType,
      submissionData: JSON.stringify(sub.submissionData || {}),
      fileUrl: sub.fileUrl || null,
      fileName: sub.fileName || sub.submissionData?.fileName || null,
      fileSize: sub.fileSize || sub.submissionData?.fileSize || null,
      maxPoints: sub.maxPoints,
      submittedAt: sub.submittedAt
    });

    // Mark task completed for ambassador
    db.prepare("UPDATE tasks SET status = 'completed' WHERE id = ?").run(sub.taskId);

    // Update ambassador stats
    dbOperations.recalculateAmbassadorStats(sub.ambassadorId);

    return sub;
  },

  gradeSubmission: (id, { pointsAwarded, status, feedback, reviewedBy, reviewedAt }) => {
    const stmt = db.prepare(`
      UPDATE submissions
      SET points_awarded = ?,
          status = ?,
          feedback = ?,
          reviewed_by = ?,
          reviewed_at = ?
      WHERE id = ?
    `);

    stmt.run(pointsAwarded, status, feedback, reviewedBy, reviewedAt, id);

    const sub = db.prepare('SELECT * FROM submissions WHERE id = ?').get(id);
    if (sub) {
      dbOperations.recalculateAmbassadorStats(sub.ambassador_id);
    }

    return sub;
  },

  // Recalculate stats & ranks in single transaction
  recalculateAmbassadorStats: (ambassadorId) => {
    const completedCount = db.prepare(`
      SELECT COUNT(*) as count, COALESCE(SUM(points_awarded), 0) as total_score
      FROM submissions 
      WHERE ambassador_id = ? AND status = 'approved'
    `).get(ambassadorId);

    db.prepare(`
      UPDATE ambassador_stats
      SET tasks_completed = ?,
          total_score = ?,
          avg_speed_days = MAX(1.1, ROUND(avg_speed_days - 0.2, 1)),
          updated_at = CURRENT_TIMESTAMP
      WHERE ambassador_id = ?
    `).run(completedCount.count, completedCount.total_score, ambassadorId);

    // Recompute ranks across all ambassadors
    const allStats = db.prepare(`
      SELECT ambassador_id 
      FROM ambassador_stats 
      ORDER BY tasks_completed DESC, avg_speed_days ASC, total_score DESC
    `).all();

    const updateRank = db.prepare('UPDATE ambassador_stats SET current_rank = ? WHERE ambassador_id = ?');
    allStats.forEach((s, idx) => {
      updateRank.run(idx + 1, s.ambassador_id);
    });
  },

  // Leaderboard
  getLeaderboard: () => {
    const rows = db.prepare(`
      SELECT 
        u.id, 
        u.name, 
        u.college, 
        u.email, 
        u.phone, 
        u.initials as avatar,
        s.tasks_completed as tasksCompleted, 
        s.avg_speed_days as speedDays, 
        s.avg_speed_days || ' days' as avgSpeed,
        s.total_score as score,
        s.current_rank as rank,
        s.performance,
        (CASE WHEN u.username = 'rahul123' THEN 1 ELSE 0 END) as isCurrentUser
      FROM ambassador_stats s
      JOIN users u ON s.ambassador_id = u.id
      ORDER BY s.current_rank ASC
    `).all();

    return rows.map(r => ({
      ...r,
      isCurrentUser: Boolean(r.isCurrentUser)
    }));
  },

  // Ambassador Management
  createAmbassador: (amb) => {
    const id = amb.id || `amb-${Date.now()}`;
    const initials = amb.avatar || amb.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    // 1. Insert into users table
    db.prepare(`
      INSERT INTO users (id, name, email, username, password_hash, role, role_title, college, initials, ca_id, phone, department, year_of_study, state)
      VALUES (?, ?, ?, ?, ?, 'ambassador', 'Campus Ambassador', ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      amb.name,
      amb.email,
      amb.username,
      amb.password || 'password123',
      amb.college,
      initials,
      amb.caId || `UDGAM27-CA-${Math.floor(Math.random() * 9000 + 1000)}`,
      amb.phone || '+91 98000 00000',
      amb.department || 'Computer Science & Engineering',
      amb.year || '3rd Year, B.Tech',
      amb.state || 'Assam'
    );

    // 2. Insert into ambassador_stats
    const count = db.prepare('SELECT COUNT(*) as c FROM ambassador_stats').get().c;
    db.prepare(`
      INSERT INTO ambassador_stats (ambassador_id, tasks_completed, avg_speed_days, total_score, current_rank, performance)
      VALUES (?, 0, 3.0, 0, ?, 'New Lead')
    `).run(id, count + 1);

    // Recompute ranks across all ambassadors
    const allStats = db.prepare(`
      SELECT ambassador_id 
      FROM ambassador_stats 
      ORDER BY tasks_completed DESC, avg_speed_days ASC, total_score DESC
    `).all();

    const updateRank = db.prepare('UPDATE ambassador_stats SET current_rank = ? WHERE ambassador_id = ?');
    allStats.forEach((s, idx) => {
      updateRank.run(idx + 1, s.ambassador_id);
    });

    return {
      id,
      name: amb.name,
      college: amb.college,
      email: amb.email,
      phone: amb.phone || '+91 98000 00000',
      avatar: initials,
      tasksCompleted: 0,
      speedDays: 3.0,
      avgSpeed: '3.0 days',
      score: 0,
      rank: count + 1,
      performance: 'New Lead',
      isCurrentUser: false
    };
  },

  deleteAmbassador: (id) => {
    // 1. Delete dependent submissions
    db.prepare('DELETE FROM submissions WHERE ambassador_id = ?').run(id);
    // 2. Delete ambassador stats
    db.prepare('DELETE FROM ambassador_stats WHERE ambassador_id = ?').run(id);
    // 3. Delete user
    const res = db.prepare("DELETE FROM users WHERE id = ? AND role = 'ambassador'").run(id);

    // 4. Recompute ranks across all remaining ambassadors
    const allStats = db.prepare(`
      SELECT ambassador_id 
      FROM ambassador_stats 
      ORDER BY tasks_completed DESC, avg_speed_days ASC, total_score DESC
    `).all();

    const updateRank = db.prepare('UPDATE ambassador_stats SET current_rank = ? WHERE ambassador_id = ?');
    allStats.forEach((s, idx) => {
      updateRank.run(idx + 1, s.ambassador_id);
    });

    return { success: res.changes > 0, deletedId: id };
  },

  // Users
  getUserByUsername: (username) => {
    return db.prepare('SELECT * FROM users WHERE LOWER(username) = LOWER(?)').get(username);
  },

  getAllUsers: () => {
    return db.prepare('SELECT id, name, email, username, role, role_title, college, initials, ca_id, phone, department, state FROM users').all();
  },

  // Managers
  getAllManagers: () => {
    const rows = db.prepare('SELECT * FROM managers ORDER BY manager_id ASC').all();
    return rows.map(r => ({
      id: r.id,
      userId: r.user_id,
      name: r.name,
      email: r.email,
      username: r.username,
      managerId: r.manager_id,
      domain: r.domain,
      department: r.department,
      phone: r.phone,
      evaluationsCount: r.evaluations_count,
      pendingInQueue: r.pending_in_queue,
      avgTurnaround: r.avg_turnaround,
      status: r.status,
      joinedDate: r.joined_date,
      avatar: r.avatar
    }));
  },

  createManager: (mgr) => {
    const existingUser = db.prepare('SELECT id FROM users WHERE username = ? OR email = ?').get(mgr.username, mgr.email);
    let userId = existingUser?.id;
    if (!existingUser) {
      userId = mgr.id || `user-mgr-${Date.now()}`;
      db.prepare(`
        INSERT INTO users (id, name, email, username, password_hash, role, role_title, college, initials, ca_id, phone, department, year_of_study, state)
        VALUES (?, ?, ?, ?, ?, 'manager', 'CA Task Review Manager', 'E-Cell, IIT Guwahati', ?, ?, ?, ?, 'Staff', 'Assam')
      `).run(
        userId,
        mgr.name,
        mgr.email,
        mgr.username,
        mgr.password || 'manager123',
        mgr.avatar || mgr.name.slice(0, 2).toUpperCase(),
        mgr.managerId,
        mgr.phone,
        mgr.department
      );
    }

    const stmt = db.prepare(`
      INSERT INTO managers (id, user_id, name, email, username, manager_id, domain, department, phone, evaluations_count, pending_in_queue, avg_turnaround, status, joined_date, avatar)
      VALUES (@id, @userId, @name, @email, @username, @managerId, @domain, @department, @phone, @evaluationsCount, @pendingInQueue, @avgTurnaround, @status, @joinedDate, @avatar)
    `);

    stmt.run({
      id: mgr.id || `mgr-${Date.now()}`,
      userId: userId,
      name: mgr.name,
      email: mgr.email,
      username: mgr.username,
      managerId: mgr.managerId,
      domain: mgr.domain,
      department: mgr.department,
      phone: mgr.phone || '+91 98000 00000',
      evaluationsCount: mgr.evaluationsCount || 0,
      pendingInQueue: mgr.pendingInQueue || 0,
      avgTurnaround: mgr.avgTurnaround || '2.0 hrs',
      status: mgr.status || 'active',
      joinedDate: mgr.joinedDate || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      avatar: mgr.avatar || mgr.name.slice(0, 2).toUpperCase()
    });

    return mgr;
  }
};
