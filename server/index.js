import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { db, initDatabase, dbOperations } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 25 * 1024 * 1024 } // 25 MB
});

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    console.log(`📡 [${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl || req.url} -> ${res.statusCode} (${Date.now() - start}ms)`);
  });
  next();
});

// Initialize DB schema and initial seeds
initDatabase();

// 1. Health check & DB Status
app.get('/api/health', (req, res) => {
  const taskCount = db.prepare('SELECT COUNT(*) as count FROM tasks').get().count;
  const subCount = db.prepare('SELECT COUNT(*) as count FROM submissions').get().count;
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;

  res.json({
    status: 'online',
    database: 'SQLite (Active & Connected)',
    engine: 'better-sqlite3 v11 (High Performance WAL Mode)',
    version: '1.0.0',
    stats: {
      totalUsers: userCount,
      totalTasks: taskCount,
      totalSubmissions: subCount
    }
  });
});

// 2. Tasks Endpoints
app.get('/api/tasks', (req, res) => {
  try {
    const tasks = dbOperations.getAllTasks();
    res.json({ success: true, data: tasks });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/tasks', (req, res) => {
  try {
    const { title, shortDescription, detailedDescription, instructions, submissionRequirements, submissionType, acceptedFormats, points, deadline } = req.body;
    
    if (!title || !points) {
      return res.status(400).json({ success: false, error: 'Title and points are required.' });
    }

    const newTask = {
      id: `task-${Date.now()}`,
      title,
      shortDescription,
      detailedDescription,
      instructions: instructions || [],
      submissionRequirements: submissionRequirements || 'Standard verification guidelines apply.',
      submissionType: submissionType || 'link',
      acceptedFormats: acceptedFormats || null,
      placeholderText: submissionType === 'link' ? 'https://...' : null,
      assignedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      deadline: deadline || 'Dec 15, 2026',
      points: Number(points)
    };

    const saved = dbOperations.createTask(newTask);
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.patch('/api/tasks/:id/points', (req, res) => {
  try {
    const { id } = req.params;
    const { points, deadline, title, shortDescription } = req.body;
    
    const updated = dbOperations.updateTaskPoints(id, { points, deadline, title, shortDescription });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. File Upload Endpoint (Stores real PDF / image / xlsx files!)
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded.' });
    }

    const sizeKB = Math.round(req.file.size / 1024);
    const sizeText = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB} KB`;
    const fileUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;

    res.json({
      success: true,
      data: {
        fileUrl: fileUrl,
        fileName: req.file.originalname,
        fileSize: sizeText,
        mimeType: req.file.mimetype
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Submissions Endpoints
app.get('/api/submissions', (req, res) => {
  try {
    const submissions = dbOperations.getAllSubmissions();
    res.json({ success: true, data: submissions });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/submissions', (req, res) => {
  try {
    const { taskId, ambassadorId, ambassadorName, college, avatar, submissionType, submissionData, maxPoints } = req.body;

    const newSub = {
      id: `sub-${Date.now()}`,
      taskId,
      ambassadorId: ambassadorId || 'amb-5',
      ambassadorName: ambassadorName || 'Rahul Sharma',
      college: college || 'NIT Silchar',
      avatar: avatar || 'RS',
      submissionType,
      submissionData,
      fileUrl: submissionData?.fileUrl || null,
      fileName: submissionData?.fileName || null,
      fileSize: submissionData?.fileSize || null,
      maxPoints: Number(maxPoints) || 150,
      submittedAt: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    };

    dbOperations.createSubmission(newSub);
    res.status(201).json({ success: true, data: newSub });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.patch('/api/submissions/:id/grade', (req, res) => {
  try {
    const { id } = req.params;
    const { pointsAwarded, status, feedback, reviewedBy } = req.body;

    const reviewedAt = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const updated = dbOperations.gradeSubmission(id, {
      pointsAwarded: Number(pointsAwarded),
      status,
      feedback: feedback || '',
      reviewedBy: reviewedBy || 'Manager (E-Cell IITG)',
      reviewedAt
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Leaderboard Endpoint
app.get('/api/leaderboard', (req, res) => {
  try {
    const leaderboard = dbOperations.getLeaderboard();
    res.json({ success: true, data: leaderboard });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. Users & Ambassador Directory
app.get('/api/users', (req, res) => {
  try {
    const users = dbOperations.getAllUsers();
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6B. Task Review Managers Directory
app.get('/api/managers', (req, res) => {
  try {
    const managers = dbOperations.getAllManagers();
    res.json({ success: true, data: managers });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/managers', (req, res) => {
  try {
    const { name, email, username, password, managerId, domain, department, phone, avatar } = req.body;
    if (!name || !email || !username) {
      return res.status(400).json({ success: false, error: 'Name, email, and username are required.' });
    }

    const newMgr = {
      id: `user-mgr-${Date.now()}`,
      name,
      email,
      username,
      password: password || 'manager123',
      managerId: managerId || `UDGAM27-MGR-${Date.now().toString().slice(-2)}`,
      domain: domain || 'General Summit Evaluation Track',
      department: department || 'CA Operations',
      phone: phone || '+91 98000 00000',
      evaluationsCount: 0,
      pendingInQueue: 0,
      avgTurnaround: '2.0 hrs',
      status: 'active',
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      avatar: avatar || name.slice(0, 2).toUpperCase()
    };

    const saved = dbOperations.createManager(newMgr);
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6C. Ambassador Management (Create & Delete)
app.post('/api/ambassadors', (req, res) => {
  try {
    const { name, college, email, username, password, phone, caId, department, year, state } = req.body;
    if (!name || !college || !email || !username) {
      return res.status(400).json({ success: false, error: 'Name, college, email, and username are required.' });
    }

    const newAmb = dbOperations.createAmbassador({
      name,
      college,
      email,
      username,
      password: password || 'password123',
      phone: phone || '+91 98000 00000',
      caId,
      department,
      year,
      state
    });

    res.status(201).json({ success: true, data: newAmb });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/ambassadors/:id', (req, res) => {
  try {
    const { id } = req.params;
    const result = dbOperations.deleteAmbassador(id);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. Auth Login Endpoint
app.post('/api/auth/login', (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Username and password are required' });
    }

    const user = dbOperations.getUserByUsername(username);

    if (!user) {
      return res.status(401).json({ success: false, error: 'User not found in database. Please check username.' });
    }

    if (user.password_hash !== password && password !== 'password123' && password !== 'admin123' && password !== 'manager123') {
      return res.status(401).json({ success: false, error: 'Invalid password. Try password123, admin123, or manager123.' });
    }

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role,
      roleTitle: user.role_title || (user.role === 'admin' ? 'Head of Operations & Lead Admin' : user.role === 'manager' ? 'CA Task Review Manager' : 'Campus Ambassador'),
      college: user.college,
      initials: user.initials || user.name.slice(0, 2).toUpperCase(),
      caId: user.ca_id,
      phone: user.phone,
      department: user.department,
      year: user.year_of_study,
      state: user.state,
      badges: user.role === 'admin' 
        ? ["Super Admin", "Operations Head", "Summit Convener"]
        : user.role === 'manager'
        ? ["Core Evaluator", "Outreach Lead"]
        : ["Early Adopter", "Community Builder", "Promoter Star"]
    };

    res.json({ success: true, user: safeUser });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 UDGAM'27 Portal Database Server running at http://localhost:${PORT}`);
  console.log(`📊 Connected to SQLite database at server/data/portal.db`);
});
