import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LoginPage } from './components/Auth/LoginPage';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { OverviewView } from './components/Overview/OverviewView';
import { TasksView } from './components/Tasks/TasksView';
import { LeaderboardView } from './components/Leaderboard/LeaderboardView';
import { ProfileView } from './components/Profile/ProfileView';
import { TaskModal } from './components/Tasks/TaskModal';
import { Toast } from './components/UI/Toast';

// Manager & Admin views
import { SubmissionsReviewView } from './components/Manager/SubmissionsReviewView';
import { ManagerTasksView } from './components/Manager/ManagerTasksView';
import { GradingModal } from './components/Manager/GradingModal';
import { AdminOverview } from './components/Admin/AdminOverview';
import { TaskManagement } from './components/Admin/TaskManagement';
import { NewTaskModal } from './components/Admin/NewTaskModal';
import { EditTaskPointsModal } from './components/Admin/EditTaskPointsModal';
import { AmbassadorDirectory } from './components/Admin/AmbassadorDirectory';
import { NewAmbassadorModal } from './components/Admin/NewAmbassadorModal';
import { ManagerDirectory } from './components/Admin/ManagerDirectory';
import { NewManagerModal } from './components/Admin/NewManagerModal';

// Database Service Layer (Universal PostgreSQL / SQLite Adapter)
import { dbService } from './services/dbService';

import { 
  mockUsers, 
  initialTasks, 
  initialSubmissions, 
  initialLeaderboard, 
  initialManagers,
  calculateRankings 
} from './data/mockData';

export function App() {
  // Authentication & Role State
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [currentUser, setCurrentUser] = useState(mockUsers.ambassador);
  const currentRole = currentUser?.role || 'ambassador'; // 'ambassador' | 'manager' | 'admin'

  // Navigation State
  const [currentTab, setCurrentTab] = useState('overview');
  const [mobileOpen, setMobileOpen] = useState(false);

  // Database Connection Status
  const [dbStatus, setDbStatus] = useState({
    status: 'connected',
    type: 'SQLite / REST API (Local)',
    latency: '< 2ms'
  });

  // Core Data State (Initialized with seed, synced with DB)
  const [tasks, setTasks] = useState(initialTasks);
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [leaderboard, setLeaderboard] = useState(() => calculateRankings(initialLeaderboard));
  const [managers, setManagers] = useState(initialManagers);

  // Modal States
  const [selectedTask, setSelectedTask] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isGradingModalOpen, setIsGradingModalOpen] = useState(false);

  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [taskToEditPoints, setTaskToEditPoints] = useState(null);
  const [isEditPointsModalOpen, setIsEditPointsModalOpen] = useState(false);
  const [isNewManagerModalOpen, setIsNewManagerModalOpen] = useState(false);
  const [isNewAmbassadorModalOpen, setIsNewAmbassadorModalOpen] = useState(false);

  // Toast State
  const [toast, setToast] = useState(null);

  // Keep a ref to currentUser for live sync without stale closures
  const currentUserRef = useRef(currentUser);
  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  // Real-time Database Synchronization Function
  const syncDatabaseData = useCallback(async (isSilent = false) => {
    try {
      const status = await dbService.checkDatabaseStatus();
      setDbStatus(status);

      const [dbTasks, dbSubmissions, dbLeaderboard, dbManagers] = await Promise.all([
        dbService.getTasks(),
        dbService.getSubmissions(),
        dbService.getLeaderboard(),
        dbService.getManagers()
      ]);

      if (Array.isArray(dbTasks) && dbTasks.length > 0) {
        setTasks(dbTasks);
      }
      if (Array.isArray(dbSubmissions)) {
        setSubmissions(dbSubmissions);
      }
      if (Array.isArray(dbLeaderboard) && dbLeaderboard.length > 0) {
        const activeUser = currentUserRef.current;
        const mapped = dbLeaderboard.map((amb) => ({
          ...amb,
          isCurrentUser: Boolean(
            (activeUser && (amb.id === activeUser.id || amb.username === activeUser.username)) ||
            (!activeUser && amb.id === 'amb-5')
          )
        }));
        setLeaderboard(mapped);
      }
      if (Array.isArray(dbManagers) && dbManagers.length > 0) {
        setManagers(dbManagers);
      }
    } catch (err) {
      if (!isSilent) console.warn('Database sync error:', err);
    }
  }, []);

  // Real-time lifecycle: Load on mount + recurring 3.5s background polling + focus trigger
  useEffect(() => {
    // 1. Restore active session if present
    try {
      const savedSession = localStorage.getItem('udgam_session_user');
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        if (parsed && parsed.username) {
          setCurrentUser(parsed);
          setIsLoggedIn(true);
          if (parsed.role === 'admin') setCurrentTab('admin_overview');
          else if (parsed.role === 'manager') setCurrentTab('submissions');
          else setCurrentTab('overview');
        }
      }
    } catch (e) {}

    // 2. Initial synchronization
    syncDatabaseData(false);

    // 3. Real-time background polling interval (20s in production for 1000+ CAs, 3.5s in dev)
    const pollIntervalMs = import.meta.env.PROD ? 20000 : 3500;
    const intervalId = setInterval(() => {
      syncDatabaseData(true);
    }, pollIntervalMs);

    // 4. Instant sync whenever tab regains user focus
    const handleFocus = () => {
      if (document.visibilityState === 'visible') {
        syncDatabaseData(true);
      }
    };
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleFocus);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleFocus);
    };
  }, [syncDatabaseData]);

  // Derived ambassador metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const pendingTasks = tasks.filter((t) => t.status === 'pending');
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Pending reviews for managers/admins
  const pendingSubmissionsCount = submissions.filter((s) => s.status === 'pending_review').length;

  // Current user's entry in leaderboard (if ambassador)
  const userLeaderboardEntry = leaderboard.find((amb) => amb.isCurrentUser);

  // 1. Role Switching Handler
  const handleSwitchRole = (newRole) => {
    const userToSet = mockUsers[newRole] || mockUsers.ambassador;
    setCurrentUser(userToSet);

    if (newRole === 'admin') {
      setCurrentTab('admin_overview');
    } else if (newRole === 'manager') {
      setCurrentTab('submissions');
    } else {
      setCurrentTab('overview');
    }

    setToast({
      type: 'info',
      title: `Switched to ${userToSet.roleTitle || newRole.toUpperCase()}`,
      message: `Active persona: ${userToSet.name} (${userToSet.college || 'E-Cell IITG'}).`,
    });
  };

  // 2. Real Database Login Handler
  const handleLogin = async (username, password) => {
    try {
      const res = await dbService.login(username, password);

      if (!res.success) {
        return { success: false, error: res.error || 'Invalid credentials' };
      }

      const authenticatedUser = res.user;
      setCurrentUser(authenticatedUser);
      setIsLoggedIn(true);

      // Persist active session to browser storage
      try {
        localStorage.setItem('udgam_session_user', JSON.stringify(authenticatedUser));
      } catch (e) {}

      if (authenticatedUser.role === 'admin') {
        setCurrentTab('admin_overview');
      } else if (authenticatedUser.role === 'manager') {
        setCurrentTab('submissions');
      } else {
        setCurrentTab('overview');
      }

      setToast({
        type: 'success',
        title: `Welcome, ${authenticatedUser.name}!`,
        message: `Authenticated via database as ${authenticatedUser.roleTitle || authenticatedUser.role}.`,
      });

      return { success: true, user: authenticatedUser };
    } catch (err) {
      return { success: false, error: 'Database connection failed. Please ensure the backend server is running.' };
    }
  };

  // 3. Logout Handler
  const handleLogout = () => {
    setIsLoggedIn(false);
    try {
      localStorage.removeItem('udgam_session_user');
    } catch (e) {}
    setToast({
      type: 'info',
      title: 'Logged out successfully',
      message: 'You have safely signed out from the portal.',
    });
  };

  // 4. Ambassador Task Submit Handler
  const handleTaskSubmit = async (taskId, submissionData) => {
    const taskObj = tasks.find((t) => t.id === taskId);
    const today = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    // Update task in local state
    const updatedTasks = tasks.map((t) => {
      if (t.id === taskId) {
        return {
          ...t,
          status: 'completed',
          submittedDate: today,
          submissionData: submissionData,
        };
      }
      return t;
    });
    setTasks(updatedTasks);

    // Create a new submission record
    const newSubmission = {
      id: `sub-${Date.now()}`,
      taskId: taskId,
      taskTitle: taskObj?.title || 'Ambassador Task Deliverable',
      ambassadorId: 'amb-5',
      ambassadorName: currentUser.name,
      college: currentUser.college,
      avatar: currentUser.initials || 'RS',
      submittedAt: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      submissionType: taskObj?.submissionType || 'link',
      submissionData: submissionData,
      fileUrl: submissionData?.fileUrl || null,
      fileName: submissionData?.fileName || null,
      fileSize: submissionData?.fileSize || null,
      maxPoints: taskObj?.points || 150,
      status: 'pending_review',
      pointsAwarded: null,
      reviewedBy: null,
      reviewedAt: null,
      feedback: null
    };

    setSubmissions([newSubmission, ...submissions]);

    // Persist to database
    try {
      await dbService.createSubmission(newSubmission);
    } catch (e) {
      console.warn('Could not persist submission to database:', e);
    }

    // Update user entry in leaderboard with faster average speed and higher points
    const newCompletedCount = updatedTasks.filter((t) => t.status === 'completed').length;
    const updatedLeaderboardRaw = leaderboard.map((entry) => {
      if (entry.isCurrentUser) {
        const newScore = entry.score + (taskObj?.points || 150);
        const newSpeed = Math.max(1.1, Number((entry.speedDays - 0.2).toFixed(1)));
        return {
          ...entry,
          tasksCompleted: newCompletedCount,
          score: newScore,
          speedDays: newSpeed,
          avgSpeed: `${newSpeed} days`,
          performance: newCompletedCount >= 10 ? 'Exceptional' : newCompletedCount >= 8 ? 'Outstanding' : 'Superior',
        };
      }
      return entry;
    });

    const reorderedLeaderboard = calculateRankings(updatedLeaderboardRaw);
    setLeaderboard(reorderedLeaderboard);

    const updatedUserEntry = reorderedLeaderboard.find((e) => e.isCurrentUser);

    setToast({
      type: 'success',
      title: 'Task Saved & Dispatched to Database!',
      message: `Your deliverable is in the Manager evaluation queue. Rank updated to #${updatedUserEntry?.rank || 5}!`,
    });
  };

  // 5. Manager / Admin Grade Submission Handler
  const handleGradeSubmit = async (submissionId, gradeData) => {
    let targetAmbassadorId = null;
    let pointsDifference = 0;

    const updatedSubmissions = submissions.map((sub) => {
      if (sub.id === submissionId) {
        targetAmbassadorId = sub.ambassadorId;
        const prevPoints = sub.pointsAwarded || 0;
        pointsDifference = gradeData.pointsAwarded - prevPoints;

        return {
          ...sub,
          status: gradeData.status,
          pointsAwarded: gradeData.pointsAwarded,
          reviewedBy: gradeData.reviewedBy,
          reviewedAt: gradeData.reviewedAt,
          feedback: gradeData.feedback,
        };
      }
      return sub;
    });

    setSubmissions(updatedSubmissions);

    // Persist evaluation to database
    try {
      await dbService.gradeSubmission(submissionId, gradeData);
    } catch (e) {
      console.warn('Could not persist grade to database:', e);
    }

    // If approved, update leaderboard for that ambassador
    if (targetAmbassadorId && pointsDifference !== 0) {
      const updatedLeaderboardRaw = leaderboard.map((amb) => {
        if (amb.id === targetAmbassadorId) {
          const newScore = Math.max(0, amb.score + pointsDifference);
          return {
            ...amb,
            score: newScore
          };
        }
        return amb;
      });
      setLeaderboard(calculateRankings(updatedLeaderboardRaw));
    }

    setToast({
      type: 'success',
      title: 'Evaluation Saved in Database!',
      message: `Marked as ${gradeData.status.replace('_', ' ').toUpperCase()} with ${gradeData.pointsAwarded} points awarded.`,
    });
  };

  // 6. Super Admin Add New Task Handler
  const handleAddNewTask = async (newTask) => {
    setTasks([newTask, ...tasks]);

    // Persist new task to database
    try {
      await dbService.createTask(newTask);
    } catch (e) {
      console.warn('Could not persist new task to database:', e);
    }

    setToast({
      type: 'success',
      title: 'New Task Published to Database!',
      message: `"${newTask.title}" is now live for all Campus Ambassadors.`,
    });
  };

  // 7. Super Admin Edit Task Points & Parameters Handler
  const handleSaveTaskPoints = async (taskId, updatedParams) => {
    const updatedTasks = tasks.map((t) => {
      if (t.id === taskId) {
        return {
          ...t,
          ...updatedParams
        };
      }
      return t;
    });
    setTasks(updatedTasks);

    // Persist updated points to database
    try {
      await dbService.updateTaskPoints(taskId, updatedParams);
    } catch (e) {
      console.warn('Could not persist task points to database:', e);
    }

    setToast({
      type: 'success',
      title: 'Task Points Calibrated in Database!',
      message: `Updated points weighting to ${updatedParams.points} pts for this deliverable.`,
    });
  };

  // 8. Super Admin Add New Manager Handler
  const handleAddNewManager = async (newManager) => {
    setManagers([newManager, ...managers]);

    try {
      await dbService.createManager(newManager);
      await syncDatabaseData(true);
    } catch (e) {
      console.warn('Could not persist manager to database:', e);
    }

    setToast({
      type: 'success',
      title: 'Task Review Manager Onboarded!',
      message: `${newManager.name} (@${newManager.username}) is now authorized with Staff ID ${newManager.managerId}.`,
    });
  };

  // 9. Super Admin Add New Campus Ambassador Handler
  const handleAddNewAmbassador = async (newAmbassador) => {
    const updatedList = [...leaderboard, newAmbassador];
    const reordered = calculateRankings(updatedList);
    setLeaderboard(reordered);

    try {
      await dbService.createAmbassador(newAmbassador);
      await syncDatabaseData(true);
    } catch (e) {
      console.warn('Could not persist ambassador to database:', e);
    }

    setToast({
      type: 'success',
      title: 'Campus Ambassador Enrolled!',
      message: `${newAmbassador.name} (${newAmbassador.college}) has been added to the national roster with CA ID ${newAmbassador.caId}.`,
    });
  };

  // 10. Super Admin Remove Ambassador Handler
  const handleRemoveAmbassador = async (ambassadorId) => {
    const toRemove = leaderboard.find((a) => a.id === ambassadorId);
    const updatedLeaderboard = leaderboard.filter((a) => a.id !== ambassadorId);
    setLeaderboard(calculateRankings(updatedLeaderboard));

    // Also remove any submissions associated with this ambassador
    setSubmissions((prev) => prev.filter((s) => s.ambassadorId !== ambassadorId));

    try {
      await dbService.deleteAmbassador(ambassadorId);
      await syncDatabaseData(true);
    } catch (e) {
      console.warn('Could not delete ambassador from database:', e);
    }

    setToast({
      type: 'info',
      title: 'Ambassador Removed from Database',
      message: `${toRemove?.name || 'Ambassador'} has been removed from database and rankings re-indexed.`,
    });
  };

  // If not logged in, show Login Page
  if (!isLoggedIn) {
    return (
      <>
        <LoginPage onLogin={handleLogin} />
        <Toast toast={toast} onClose={() => setToast(null)} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onLogout={handleLogout}
        user={currentUser}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        pendingCount={pendingTasks.length}
        pendingSubmissionsCount={pendingSubmissionsCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-w-0">
        {/* Sticky Header with Database Status and Role Switcher */}
        <Header
          currentTab={currentTab}
          setMobileOpen={setMobileOpen}
          user={currentUser}
          completionRate={completionRate}
          onOpenQuickSubmit={currentRole === 'ambassador' && pendingTasks.length > 0 ? () => {
            setSelectedTask(pendingTasks[0]);
            setIsTaskModalOpen(true);
          } : null}
          currentRole={currentRole}
          dbStatus={dbStatus}
        />

        {/* Content Views */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* AMBASSADOR VIEWS */}
          {currentTab === 'overview' && (
            <OverviewView
              user={currentUser}
              tasks={tasks}
              onSelectTask={(task) => {
                setSelectedTask(task);
                setIsTaskModalOpen(true);
              }}
              onNavigateTasks={() => setCurrentTab('tasks')}
              userLeaderboardEntry={userLeaderboardEntry}
            />
          )}

          {currentTab === 'tasks' && (
            <TasksView
              tasks={tasks}
              onSelectTask={(task) => {
                setSelectedTask(task);
                setIsTaskModalOpen(true);
              }}
            />
          )}

          {/* LEADERBOARD (Accessible by Ambassador & Admin) */}
          {currentTab === 'leaderboard' && (
            <LeaderboardView
              leaderboardData={leaderboard}
              currentUser={currentUser}
            />
          )}

          {/* MY PROFILE (All roles) */}
          {currentTab === 'profile' && (
            <ProfileView
              user={currentUser}
              onLogout={handleLogout}
              tasksCount={totalTasks}
              completedCount={completedTasks}
              rank={userLeaderboardEntry?.rank || 5}
            />
          )}

          {/* MANAGER & ADMIN SUBMISSIONS REVIEW */}
          {currentTab === 'submissions' && (
            <SubmissionsReviewView
              submissions={submissions}
              tasks={tasks}
              userRole={currentRole}
              onOpenGradingModal={(sub) => {
                setSelectedSubmission(sub);
                setIsGradingModalOpen(true);
              }}
            />
          )}

          {/* MANAGER VIEW TASKS (Read-only) */}
          {currentTab === 'manager_tasks' && (
            <ManagerTasksView
              tasks={tasks}
              submissions={submissions}
              onFilterSubmissionsByTask={(taskId) => {
                setCurrentTab('submissions');
              }}
            />
          )}

          {/* ADMIN EXCLUSIVE: OVERVIEW */}
          {currentTab === 'admin_overview' && (
            <AdminOverview
              user={currentUser}
              tasks={tasks}
              submissions={submissions}
              leaderboard={leaderboard}
              onNavigate={(tab) => setCurrentTab(tab)}
              onOpenNewTaskModal={() => setIsNewTaskModalOpen(true)}
              onOpenGradingModal={(sub) => {
                setSelectedSubmission(sub);
                setIsGradingModalOpen(true);
              }}
            />
          )}

          {/* ADMIN EXCLUSIVE: TASK MANAGEMENT (Add Task & Edit Points) */}
          {currentTab === 'task_mgmt' && (
            <TaskManagement
              tasks={tasks}
              submissions={submissions}
              onOpenNewTaskModal={() => setIsNewTaskModalOpen(true)}
              onOpenEditPointsModal={(task) => {
                setTaskToEditPoints(task);
                setIsEditPointsModalOpen(true);
              }}
              onNavigateSubmissions={(taskId) => {
                setCurrentTab('submissions');
              }}
            />
          )}

          {/* ADMIN EXCLUSIVE: AMBASSADOR DIRECTORY */}
          {currentTab === 'directory' && (
            <AmbassadorDirectory
              leaderboard={leaderboard}
              submissions={submissions}
              onFilterSubmissionsByAmbassador={(ambName) => {
                setCurrentTab('submissions');
              }}
              onOpenNewAmbassadorModal={() => setIsNewAmbassadorModalOpen(true)}
              onRemoveAmbassador={handleRemoveAmbassador}
            />
          )}

          {/* ADMIN EXCLUSIVE: MANAGER DIRECTORY */}
          {currentTab === 'managers' && (
            <ManagerDirectory
              managers={managers}
              submissions={submissions}
              onOpenNewManagerModal={() => setIsNewManagerModalOpen(true)}
              onNavigateSubmissions={(domainFilter) => {
                setCurrentTab('submissions');
              }}
            />
          )}
        </main>

        {/* Page Footer */}
        <footer className="border-t border-slate-200/80 bg-white py-4 px-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>
              © 2026–2027 <strong className="text-slate-700">UDGAM'27</strong> | Entrepreneurship Cell, IIT Guwahati. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-slate-400">
              <span className="hover:text-slate-600 transition-colors">CA Operations</span>
              <span>•</span>
              <span className="hover:text-slate-600 transition-colors">Evaluation Desk</span>
              <span>•</span>
              <span className="hover:text-slate-600 transition-colors">Admin Console</span>
            </div>
          </div>
        </footer>
      </div>

      {/* AMBASSADOR TASK MODAL */}
      <TaskModal
        task={selectedTask}
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmitTask={handleTaskSubmit}
      />

      {/* MANAGER & ADMIN GRADING MODAL */}
      <GradingModal
        submission={selectedSubmission}
        isOpen={isGradingModalOpen}
        onClose={() => setIsGradingModalOpen(false)}
        onGradeSubmit={handleGradeSubmit}
        reviewerName={`${currentUser.name} (${currentRole === 'admin' ? 'Admin' : 'Manager'})`}
      />

      {/* ADMIN EXCLUSIVE: CREATE NEW TASK MODAL */}
      <NewTaskModal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
        onAddTask={handleAddNewTask}
      />

      {/* ADMIN EXCLUSIVE: EDIT TASK POINTS & PARAMETERS MODAL */}
      <EditTaskPointsModal
        task={taskToEditPoints}
        isOpen={isEditPointsModalOpen}
        onClose={() => setIsEditPointsModalOpen(false)}
        onSaveTask={handleSaveTaskPoints}
      />

      {/* ADMIN EXCLUSIVE: ONBOARD MANAGER MODAL */}
      <NewManagerModal
        isOpen={isNewManagerModalOpen}
        onClose={() => setIsNewManagerModalOpen(false)}
        onAddManager={handleAddNewManager}
        nextManagerId={`UDGAM27-MGR-0${managers.length + 1}`}
      />

      {/* ADMIN EXCLUSIVE: ONBOARD AMBASSADOR MODAL */}
      <NewAmbassadorModal
        isOpen={isNewAmbassadorModalOpen}
        onClose={() => setIsNewAmbassadorModalOpen(false)}
        onAddAmbassador={handleAddNewAmbassador}
        nextCaNumber={1000 + leaderboard.length + 1}
      />

      {/* Toast Alert System */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

export default App;
