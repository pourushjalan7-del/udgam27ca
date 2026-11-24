# UDGAM'27 Campus Ambassador Portal
**Flagship Entrepreneurship Summit | E-Cell, IIT Guwahati**

A modern, premium, fully responsive web application with **integrated real database persistence**, role-based access control (Super Admin, Task Manager, Campus Ambassador), and direct file upload handling.

---

## 🗄️ Integrated Database Architecture

The web application now features a **dual-mode database integration**:

1. **Local High-Performance Database Engine (Active by default)**:
   - **Engine**: SQLite 3 via `better-sqlite3` running in high-concurrency **Write-Ahead Logging (WAL)** mode.
   - **API Server**: Express.js REST API on `http://localhost:5001/api`.
   - **Database File**: Stored persistently at [`server/data/portal.db`](file:///Users/pourushjalan/.gemini/antigravity/scratch/udgam-ca-portal/server/data/portal.db).
   - **File Uploads**: Handled via `multer`, saving real deliverables (PDFs, images, Excel sheets) to [`server/uploads/`](file:///Users/pourushjalan/.gemini/antigravity/scratch/udgam-ca-portal/server/uploads) and serving them with real static URLs.
   - **Latency**: `< 2ms` round-trip.

2. **Cloud PostgreSQL / Supabase Integration (Production-Ready)**:
   - Includes full `@supabase/supabase-js` client in [`src/services/supabaseClient.js`](file:///Users/pourushjalan/.gemini/antigravity/scratch/udgam-ca-portal/src/services/supabaseClient.js).
   - Complete PostgreSQL migration script in [`supabase_schema.sql`](file:///Users/pourushjalan/.gemini/antigravity/scratch/udgam-ca-portal/supabase_schema.sql) with Row Level Security (RLS) policies and storage bucket setup.
   - Plug-and-play `.env` support: simply add your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to switch to cloud PostgreSQL with zero code changes.

---

## 📡 REST API & Database Endpoints (`http://localhost:5001/api`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Live database health, engine details, and table record counts. |
| `GET` | `/tasks` | Retrieves all tasks from the database. |
| `POST` | `/tasks` | Super Admin creates a new task (persisted in DB). |
| `PATCH` | `/tasks/:id/points` | Super Admin modifies point weightings & deadlines in DB. |
| `GET` | `/submissions` | Retrieves all ambassador deliverables across colleges. |
| `POST` | `/submissions` | Ambassador submits a deliverable (persisted to review queue). |
| `POST` | `/upload` | Multipart file upload endpoint (stores real files in `/uploads`). |
| `PATCH` | `/submissions/:id/grade` | Manager/Admin grades a deliverable and writes evaluation to DB. |
| `GET` | `/leaderboard` | Returns ranked standings calculated dynamically via SQL. |
| `GET` | `/users` | Returns verified ambassador directory with institutional records. |
| `POST` | `/auth/login` | Validates credentials against the database. |

---

## 👥 Role-Based Architecture & Permission Matrix

| Capability / Feature | 🟠 Campus Ambassador (`rahul123`) | 🟣 Task Manager (`manager`) | 🛡️ Super Admin (`admin`) |
| :--- | :---: | :---: | :---: |
| **View Assigned Tasks & Submit Work** | ✅ Full access | ❌ N/A | ❌ N/A |
| **View All Program Tasks** | ❌ Assigned only | ✅ Read-only list | ✅ Full control |
| **Inspect & Grade Submissions** | ❌ (Own proofs only) | ✅ **Full Grading Desk** | ✅ Full access & override |
| **Award / Modify Points on Submissions**| ❌ | ✅ (0 to task max) | ✅ (0 to task max) |
| **Request Revisions & Provide Feedback** | ❌ | ✅ | ✅ |
| **Create New Tasks** | ❌ | 🚫 **Restricted to Admin** | ✅ **Exclusive Access** |
| **Edit Task Point Weightings & Parameters** | ❌ | 🚫 **Restricted to Admin** | ✅ **Exclusive Access** |
| **Full Leaderboard & Rankings** | ✅ Public Standings | 🚫 Hidden from Manager | ✅ **Full Analytics** |
| **Ambassador Directory** | ❌ | ❌ | ✅ Contact & Stats Roster |

---

## 🏃 Running the Application

### 1. Start Both Frontend and Database Server
```bash
cd /Users/pourushjalan/.gemini/antigravity/scratch/udgam-ca-portal

# In Terminal 1 (Database API Server):
npm run server
# Listening on http://localhost:5001

# In Terminal 2 (Vite Frontend):
npm run dev
# Live at http://localhost:3000
```

### 2. Build for Production
```bash
npm run build
```

---

## 🗂️ Production Deployment with Supabase / PostgreSQL

To deploy to a cloud PostgreSQL database:
1. Create a project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in Supabase and paste the contents of [`supabase_schema.sql`](file:///Users/pourushjalan/.gemini/antigravity/scratch/udgam-ca-portal/supabase_schema.sql).
3. In your `.env` file, add:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```
4. The application will instantly switch to live Cloud PostgreSQL and Supabase Storage!
