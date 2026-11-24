import { createClient } from '@supabase/supabase-js';
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

// 1. Load .env variables
const envPath = path.resolve(process.cwd(), '.env');
if (!fs.existsSync(envPath)) {
  console.error('❌ .env file not found!');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const env = Object.fromEntries(
  envContent.split('\n')
    .filter(l => l.includes('='))
    .map(l => {
      const idx = l.indexOf('=');
      return [l.substring(0, idx).trim(), l.substring(idx + 1).trim()];
    })
);

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase credentials missing in .env');
  process.exit(1);
}

console.log(`🌐 Connecting to Supabase: ${supabaseUrl}`);
const supabase = createClient(supabaseUrl, supabaseKey);

// 2. Open local SQLite database
const dbPath = path.resolve(process.cwd(), 'server/data/portal.db');
if (!fs.existsSync(dbPath)) {
  console.error(`❌ SQLite database not found at ${dbPath}`);
  process.exit(1);
}

const db = new Database(dbPath);

async function sync() {
  console.log('🔄 Checking Supabase connection and table permissions...');
  const { error: testErr } = await supabase.from('tasks').select('*').limit(1);
  
  if (testErr) {
    if (testErr.code === '42501') {
      console.error('\n🚨 PERMISSION DENIED (Code 42501):');
      console.error('Supabase received your request, but the anon role does not have permission on the tables.');
      console.error('\n👉 FIX: Open your Supabase Dashboard:');
      console.error('   1. Go to https://supabase.com/dashboard/project/ozqpawnsrlscwgpcxohk/sql');
      console.error('   2. Open "SQL Editor" -> "New query"');
      console.error('   3. Paste and run the contents of fix_permissions.sql');
      console.error('   4. Run this sync script again!\n');
      process.exit(1);
    } else {
      console.error('❌ Supabase query error:', testErr.message);
      process.exit(1);
    }
  }

  console.log('✅ Connection verified! Beginning sync from local SQLite to Supabase...\n');

  // A. Sync Users
  const users = db.prepare('SELECT * FROM users').all();
  console.log(`👤 Syncing ${users.length} users to Supabase...`);
  for (const u of users) {
    const { error } = await supabase.from('users').upsert({
      id: u.id,
      name: u.name,
      email: u.email,
      username: u.username,
      password_hash: u.password_hash,
      role: u.role,
      role_title: u.role_title,
      college: u.college,
      initials: u.initials,
      ca_id: u.ca_id,
      phone: u.phone,
      department: u.department,
      year_of_study: u.year_of_study,
      state: u.state
    }, { onConflict: 'id' });
    if (error) console.warn(`   ⚠️ User ${u.username} error:`, error.message);
  }
  console.log('   ✅ Users synced.');

  // B. Sync Tasks
  const tasks = db.prepare('SELECT * FROM tasks').all();
  console.log(`📋 Syncing ${tasks.length} tasks to Supabase...`);
  for (const t of tasks) {
    let parsedInstructions = [];
    try {
      parsedInstructions = JSON.parse(t.instructions || '[]');
    } catch (e) {
      parsedInstructions = [];
    }

    const { error } = await supabase.from('tasks').upsert({
      id: t.id,
      title: t.title,
      short_description: t.short_description,
      detailed_description: t.detailed_description,
      instructions: parsedInstructions,
      submission_requirements: t.submission_requirements,
      submission_type: t.submission_type,
      accepted_formats: t.accepted_formats,
      placeholder_text: t.placeholder_text,
      assigned_date: t.assigned_date,
      deadline: t.deadline,
      status: t.status,
      points: t.points
    }, { onConflict: 'id' });
    if (error) console.warn(`   ⚠️ Task ${t.id} error:`, error.message);
  }
  console.log('   ✅ Tasks synced.');

  // C. Sync Managers
  const managers = db.prepare('SELECT * FROM managers').all();
  console.log(`👔 Syncing ${managers.length} managers to Supabase...`);
  for (const m of managers) {
    const { error } = await supabase.from('managers').upsert({
      id: m.id,
      user_id: m.user_id,
      name: m.name,
      email: m.email,
      username: m.username,
      manager_id: m.manager_id,
      domain: m.domain,
      department: m.department,
      phone: m.phone,
      evaluations_count: m.evaluations_count,
      pending_in_queue: m.pending_in_queue,
      avg_turnaround: m.avg_turnaround,
      status: m.status,
      joined_date: m.joined_date,
      avatar: m.avatar
    }, { onConflict: 'id' });
    if (error) console.warn(`   ⚠️ Manager ${m.username} error:`, error.message);
  }
  console.log('   ✅ Managers synced.');

  // D. Sync Ambassador Stats
  const stats = db.prepare('SELECT * FROM ambassador_stats').all();
  console.log(`🏆 Syncing ${stats.length} ambassador stats to Supabase...`);
  for (const s of stats) {
    const { error } = await supabase.from('ambassador_stats').upsert({
      ambassador_id: s.ambassador_id,
      tasks_completed: s.tasks_completed,
      avg_speed_days: s.avg_speed_days,
      total_score: s.total_score,
      current_rank: s.current_rank,
      performance: s.performance
    }, { onConflict: 'ambassador_id' });
    if (error) console.warn(`   ⚠️ Stat ${s.ambassador_id} error:`, error.message);
  }
  console.log('   ✅ Ambassador stats synced.');

  // E. Sync Submissions
  const submissions = db.prepare('SELECT * FROM submissions').all();
  console.log(`📝 Syncing ${submissions.length} submissions to Supabase...`);
  for (const sub of submissions) {
    let parsedData = {};
    try {
      parsedData = JSON.parse(sub.submission_data || '{}');
    } catch (e) {
      parsedData = {};
    }

    const { error } = await supabase.from('submissions').upsert({
      id: sub.id,
      task_id: sub.task_id,
      ambassador_id: sub.ambassador_id,
      ambassador_name: sub.ambassador_name,
      college: sub.college,
      avatar: sub.avatar,
      submission_type: sub.submission_type,
      submission_data: parsedData,
      file_url: sub.file_url,
      file_name: sub.file_name,
      file_size: sub.file_size,
      max_points: sub.max_points,
      status: sub.status,
      points_awarded: sub.points_awarded,
      reviewed_by: sub.reviewed_by,
      reviewed_at: sub.reviewed_at,
      feedback: sub.feedback,
      submitted_at: sub.submitted_at
    }, { onConflict: 'id' });
    if (error) console.warn(`   ⚠️ Submission ${sub.id} error:`, error.message);
  }
  console.log('   ✅ Submissions synced.');

  console.log('\n🎉 ALL LOCAL SQLITE DATA HAS BEEN SYNCHRONIZED TO SUPABASE CLOUD!');
}

sync().catch(err => {
  console.error('Fatal sync error:', err);
  process.exit(1);
});
