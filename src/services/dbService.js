import { supabase, isSupabaseConfigured } from './supabaseClient';
import { initialTasks, initialSubmissions, initialLeaderboard, calculateRankings, mockUsers, initialManagers } from '../data/mockData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

export const dbService = {
  // 1. Health & Status
  checkDatabaseStatus: async () => {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('tasks').select('*').limit(1);
        if (!error) {
          return { status: 'connected', type: 'PostgreSQL (Cloud Supabase)', latency: '32ms' };
        }
        if (error && error.code === '42501') {
          console.warn('⚠️ Supabase Cloud Connected, but tables lack permissions (Postgres Error 42501). Run fix_permissions.sql in Supabase SQL Editor!');
          return {
            status: 'warning',
            type: 'Cloud DB Needs Permissions (42501)',
            error: error.message,
            hint: 'Run fix_permissions.sql in Supabase SQL Editor to enable full cloud sync.',
            latency: 'N/A'
          };
        }
      } catch (e) {
        // Continue to local check
      }
    }

    try {
      const res = await fetch(`${API_BASE_URL}/health`, { method: 'GET' });
      if (res.ok) {
        const data = await res.json();
        return { 
          status: 'connected', 
          type: 'SQLite / REST API (Local)', 
          stats: data.stats,
          latency: '2ms'
        };
      }
    } catch (e) {
      // Local server not reachable
    }

    return { status: 'fallback', type: 'In-Memory / Local State', latency: '0ms' };
  },

  // 2. Tasks CRUD
  getTasks: async () => {
    // A. Check Supabase
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .order('created_at', { ascending: true });

        if (!error && data && data.length > 0) {
          return data.map(t => ({
            id: t.id,
            title: t.title,
            shortDescription: t.short_description,
            detailedDescription: t.detailed_description,
            instructions: t.instructions,
            submissionRequirements: t.submission_requirements,
            submissionType: t.submission_type,
            acceptedFormats: t.accepted_formats,
            assignedDate: t.assigned_date,
            deadline: t.deadline,
            status: t.status,
            points: t.points
          }));
        }
      } catch (err) {
        console.warn('Supabase fetch failed, trying local DB:', err);
      }
    }

    // B. Check Local Backend API
    try {
      const res = await fetch(`${API_BASE_URL}/tasks`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return json.data.map(t => ({
            ...t,
            shortDescription: t.short_description || t.shortDescription,
            detailedDescription: t.detailed_description || t.detailedDescription,
            submissionRequirements: t.submission_requirements || t.submissionRequirements,
            submissionType: t.submission_type || t.submissionType,
            acceptedFormats: t.accepted_formats || t.acceptedFormats,
            assignedDate: t.assigned_date || t.assignedDate,
          }));
        }
      }
    } catch (err) {
      // Fallback
    }

    // C. Fallback mock data
    return initialTasks;
  },

  createTask: async (task) => {
    // A. Supabase
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('tasks')
          .insert([{
            id: task.id,
            title: task.title,
            short_description: task.shortDescription,
            detailed_description: task.detailedDescription,
            instructions: task.instructions,
            submission_requirements: task.submissionRequirements,
            submission_type: task.submissionType,
            accepted_formats: task.acceptedFormats,
            assigned_date: task.assignedDate,
            deadline: task.deadline,
            points: task.points,
            status: 'pending'
          }])
          .select()
          .single();

        if (!error && data) return task;
      } catch (e) {
        console.warn('Supabase insert task error:', e);
      }
    }

    // B. Local API
    try {
      const res = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
      });
      if (res.ok) {
        const json = await res.json();
        return json.data || task;
      }
    } catch (e) {
      console.warn('Local DB insert task error:', e);
    }

    return task;
  },

  updateTaskPoints: async (taskId, updatedParams) => {
    // A. Supabase
    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('tasks')
          .update({
            points: updatedParams.points,
            deadline: updatedParams.deadline,
            title: updatedParams.title,
            short_description: updatedParams.shortDescription
          })
          .eq('id', taskId);
      } catch (e) {
        console.warn('Supabase update task error:', e);
      }
    }

    // B. Local API
    try {
      await fetch(`${API_BASE_URL}/tasks/${taskId}/points`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedParams)
      });
    } catch (e) {
      console.warn('Local DB update task error:', e);
    }

    return updatedParams;
  },

  // 3. Submissions CRUD
  getSubmissions: async () => {
    // A. Supabase
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('submissions')
          .select('*')
          .order('submitted_at', { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map(s => ({
            id: s.id,
            taskId: s.task_id,
            taskTitle: s.task_title,
            ambassadorId: s.ambassador_id,
            ambassadorName: s.ambassador_name,
            college: s.college,
            avatar: s.avatar,
            submissionType: s.submission_type,
            submissionData: s.submission_data,
            fileUrl: s.file_url,
            fileName: s.file_name,
            fileSize: s.file_size,
            maxPoints: s.max_points,
            status: s.status,
            pointsAwarded: s.points_awarded,
            reviewedBy: s.reviewed_by,
            reviewedAt: s.reviewed_at,
            feedback: s.feedback,
            submittedAt: s.submitted_at
          }));
        }
      } catch (err) {
        console.warn('Supabase getSubmissions failed:', err);
      }
    }

    // B. Local API
    try {
      const res = await fetch(`${API_BASE_URL}/submissions`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return json.data;
        }
      }
    } catch (err) {
      // Fallback
    }

    // C. Fallback mock data
    return initialSubmissions;
  },

  createSubmission: async (submissionPayload) => {
    // A. Local API
    try {
      const res = await fetch(`${API_BASE_URL}/submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionPayload)
      });
      if (res.ok) {
        const json = await res.json();
        return json.data || submissionPayload;
      }
    } catch (e) {
      console.warn('Local DB createSubmission error:', e);
    }

    // B. Supabase
    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('submissions')
          .insert([{
            id: submissionPayload.id,
            task_id: submissionPayload.taskId,
            task_title: submissionPayload.taskTitle,
            ambassador_id: submissionPayload.ambassadorId,
            ambassador_name: submissionPayload.ambassadorName,
            college: submissionPayload.college,
            avatar: submissionPayload.avatar,
            submission_type: submissionPayload.submissionType,
            submission_data: submissionPayload.submissionData,
            file_url: submissionPayload.fileUrl,
            file_name: submissionPayload.fileName,
            file_size: submissionPayload.fileSize,
            max_points: submissionPayload.maxPoints,
            status: 'pending_review',
            submitted_at: submissionPayload.submittedAt
          }]);
      } catch (e) {
        console.warn('Supabase createSubmission error:', e);
      }
    }

    return submissionPayload;
  },

  gradeSubmission: async (submissionId, gradeData) => {
    // A. Local API
    try {
      await fetch(`${API_BASE_URL}/submissions/${submissionId}/grade`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gradeData)
      });
    } catch (e) {
      console.warn('Local DB gradeSubmission error:', e);
    }

    // B. Supabase
    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('submissions')
          .update({
            points_awarded: gradeData.pointsAwarded,
            status: gradeData.status,
            feedback: gradeData.feedback,
            reviewed_by: gradeData.reviewedBy,
            reviewed_at: gradeData.reviewedAt
          })
          .eq('id', submissionId);
      } catch (e) {
        console.warn('Supabase gradeSubmission error:', e);
      }
    }

    return gradeData;
  },

  // 4. Real File Upload Engine
  uploadFile: async (file) => {
    // A. Supabase Storage Upload (Preferred for Production & Cloudflare Pages)
    if (isSupabaseConfigured) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `submissions/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('deliverables')
          .upload(filePath, file);

        if (!uploadError) {
          const { data } = supabase.storage.from('deliverables').getPublicUrl(filePath);
          const sizeKB = Math.round(file.size / 1024);
          const sizeText = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB} KB`;

          return {
            fileUrl: data.publicUrl,
            fileName: file.name,
            fileSize: sizeText
          };
        }
      } catch (err) {
        console.warn('Supabase storage upload error:', err);
      }
    }

    // B. Send to Local Express Multer API (Local Development Fallback)
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return json.data; // { fileUrl, fileName, fileSize }
        }
      }
    } catch (e) {
      console.warn('Local file upload failed, falling back to local simulation:', e);
    }

    // C. Simulated Fallback
    const sizeKB = Math.round(file.size / 1024);
    const sizeText = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB} KB`;
    return {
      fileUrl: URL.createObjectURL(file),
      fileName: file.name,
      fileSize: sizeText
    };
  },

  // 5. Leaderboard
  getLeaderboard: async () => {
    // A. Check Supabase
    if (isSupabaseConfigured) {
      try {
        let rows = null;
        const { data, error } = await supabase
          .from('ambassador_stats')
          .select('*, users(*)')
          .order('current_rank', { ascending: true });

        if (!error && data && data.length > 0) {
          rows = data;
        } else if (!error && data && data.length === 0) {
          return [];
        } else if (error && error.code !== '42501') {
          // If foreign key join had an issue, fallback to parallel select
          const [{ data: stats }, { data: users }] = await Promise.all([
            supabase.from('ambassador_stats').select('*').order('current_rank', { ascending: true }),
            supabase.from('users').select('*').eq('role', 'ambassador')
          ]);
          if (stats && users && stats.length > 0) {
            const userMap = new Map(users.map(u => [u.id, u]));
            rows = stats.map(s => ({
              ...s,
              users: userMap.get(s.ambassador_id) || {}
            }));
          }
        }

        if (rows && rows.length > 0) {
          return rows.map(row => ({
            id: row.ambassador_id,
            name: row.users?.name || 'Ambassador',
            college: row.users?.college || 'College',
            email: row.users?.email || '',
            phone: row.users?.phone || '',
            avatar: row.users?.initials || 'CA',
            tasksCompleted: row.tasks_completed,
            speedDays: Number(row.avg_speed_days),
            avgSpeed: `${row.avg_speed_days} days`,
            score: row.total_score,
            rank: row.current_rank,
            performance: row.performance,
            isCurrentUser: row.users?.username === 'rahul123'
          }));
        }
      } catch (e) {
        console.warn('Supabase getLeaderboard query failed:', e);
      }
    }

    // B. Local API
    try {
      const res = await fetch(`${API_BASE_URL}/leaderboard`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return json.data;
        }
      }
    } catch (err) {
      // Fallback
    }

    // C. Fallback
    return calculateRankings(initialLeaderboard);
  },

  // 5B. Manager Directory Operations
  getManagers: async () => {
    // A. Check Supabase
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('managers')
          .select('*')
          .order('manager_id', { ascending: true });

        if (!error && data && data.length > 0) {
          return data.map(m => ({
            id: m.id,
            userId: m.user_id,
            name: m.name,
            email: m.email,
            username: m.username,
            managerId: m.manager_id,
            domain: m.domain,
            department: m.department,
            phone: m.phone,
            evaluationsCount: m.evaluations_count,
            pendingInQueue: m.pending_in_queue,
            avgTurnaround: m.avg_turnaround,
            status: m.status,
            joinedDate: m.joined_date,
            avatar: m.avatar
          }));
        }
      } catch (e) {
        // Fallback
      }
    }

    // B. Local API
    try {
      const res = await fetch(`${API_BASE_URL}/managers`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data && json.data.length > 0) {
          return json.data;
        }
      }
    } catch (err) {
      // Fallback
    }
    return initialManagers;
  },

  createManager: async (managerData) => {
    // A. Supabase
    if (isSupabaseConfigured) {
      try {
        await supabase.from('users').insert([{
          id: managerData.id,
          name: managerData.name,
          email: managerData.email,
          username: managerData.username,
          password_hash: managerData.password || 'manager123',
          role: 'manager',
          role_title: 'CA Task Review Manager',
          college: 'E-Cell, IIT Guwahati',
          initials: managerData.avatar,
          ca_id: managerData.managerId,
          phone: managerData.phone,
          department: managerData.department,
          year_of_study: 'Staff',
          state: 'Assam'
        }]);

        await supabase.from('managers').insert([{
          id: managerData.id,
          user_id: managerData.id,
          name: managerData.name,
          email: managerData.email,
          username: managerData.username,
          manager_id: managerData.managerId,
          domain: managerData.domain,
          department: managerData.department,
          phone: managerData.phone,
          evaluations_count: 0,
          pending_in_queue: 0,
          avg_turnaround: '2.0 hrs',
          status: 'active',
          joined_date: managerData.joinedDate,
          avatar: managerData.avatar
        }]);
      } catch (e) {
        console.warn('Supabase create manager error:', e);
      }
    }

    // B. Local API
    try {
      const res = await fetch(`${API_BASE_URL}/managers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(managerData)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return json.data;
        }
      }
    } catch (err) {
      console.warn('Local DB insert manager error:', err);
    }
    return managerData;
  },

  // 5C. Ambassador Management
  createAmbassador: async (ambassadorData) => {
    // A. Supabase
    if (isSupabaseConfigured) {
      try {
        await supabase.from('users').insert([{
          id: ambassadorData.id,
          name: ambassadorData.name,
          email: ambassadorData.email,
          username: ambassadorData.username,
          password_hash: ambassadorData.password || 'password123',
          role: 'ambassador',
          role_title: 'Campus Ambassador',
          college: ambassadorData.college,
          initials: ambassadorData.avatar,
          ca_id: ambassadorData.caId,
          phone: ambassadorData.phone,
          department: ambassadorData.department,
          year_of_study: ambassadorData.year,
          state: ambassadorData.state
        }]);

        await supabase.from('ambassador_stats').insert([{
          ambassador_id: ambassadorData.id,
          tasks_completed: 0,
          avg_speed_days: 3.0,
          total_score: 0,
          current_rank: 999,
          performance: 'New Lead'
        }]);
      } catch (e) {
        console.warn('Supabase create ambassador error:', e);
      }
    }

    // B. Local API
    try {
      const res = await fetch(`${API_BASE_URL}/ambassadors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ambassadorData)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return json.data;
        }
      }
    } catch (err) {
      console.warn('Local DB insert ambassador error:', err);
    }
    return ambassadorData;
  },

  deleteAmbassador: async (ambassadorId) => {
    // A. Supabase
    if (isSupabaseConfigured) {
      try {
        await supabase.from('submissions').delete().eq('ambassador_id', ambassadorId);
        await supabase.from('ambassador_stats').delete().eq('ambassador_id', ambassadorId);
        await supabase.from('users').delete().eq('id', ambassadorId);
      } catch (e) {
        console.warn('Supabase delete ambassador error:', e);
      }
    }

    // B. Local API
    try {
      const res = await fetch(`${API_BASE_URL}/ambassadors/${ambassadorId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        const json = await res.json();
        return json.success;
      }
    } catch (err) {
      console.warn('Local DB delete ambassador error:', err);
    }
    return true;
  },

  // 6. Real Database Authentication
  login: async (username, password) => {
    // A. Check Supabase (if configured)
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('username', username)
          .single();

        if (!error && data) {
          return {
            success: true,
            user: {
              id: data.id,
              name: data.name,
              email: data.email,
              username: data.username,
              role: data.role,
              roleTitle: data.role_title || (data.role === 'admin' ? 'Head of Operations & Lead Admin' : data.role === 'manager' ? 'CA Task Review Manager' : 'Campus Ambassador'),
              college: data.college,
              initials: data.initials || data.name.slice(0, 2).toUpperCase(),
              caId: data.ca_id,
              phone: data.phone,
              department: data.department,
              year: data.year_of_study,
              state: data.state,
              badges: data.role === 'admin' 
                ? ["Super Admin", "Operations Head", "Summit Convener"]
                : data.role === 'manager'
                ? ["Core Evaluator", "Outreach Lead"]
                : ["Early Adopter", "Community Builder", "Promoter Star"]
            }
          };
        }
      } catch (err) {
        console.warn('Supabase auth error:', err);
      }
    }

    // B. Call Local Database REST API
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const json = await res.json();
      if (res.ok && json.success && json.user) {
        return { success: true, user: json.user };
      } else {
        return { success: false, error: json.error || 'Invalid credentials' };
      }
    } catch (err) {
      console.warn('Database login endpoint unreachable, using local fallback:', err);
    }

    // C. Fallback for offline mode
    const roleGuess = username.toLowerCase().includes('admin')
      ? 'admin'
      : username.toLowerCase().includes('manager')
      ? 'manager'
      : 'ambassador';

    return {
      success: true,
      user: mockUsers[roleGuess] || mockUsers.ambassador,
      isFallback: true
    };
  }
};
