let deferredPrompt = null;

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  Storage.init();
  Importer.init();
  Search.init();
  Settings.init();
  updateHomeState();
  setupScrollEffects();
  setupIntersectionObserver();
  loadJSONGuide();

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    showInstallButtons();
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    hideInstallButtons();
    showToast('App installed successfully!', 'success');
  });

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js').catch(() => {});
  }

  const urlParams = new URLSearchParams(window.location.search);
  const action = urlParams.get('action');
  if (action) {
    setTimeout(() => {
      switch (action) {
        case 'prompt':
          openModal('promptModal');
          break;
        case 'import':
          openModal('importModal');
          break;
        case 'dashboard':
          navigateTo('dashboard');
          break;
      }
    }, 500);
  }
}

function updateHomeState() {
  const hasPlanner = Storage.hasPlanner();
  const recentSection = document.getElementById('recentSection');
  
  if (hasPlanner) {
    const planner = Storage.getPlanner();
    const tasks = Storage.getTasks();
    const habits = Storage.getHabits();
    const streak = Storage.getStreak();

    document.getElementById('recentName').textContent = planner.student?.name || 'Your Planner';
    document.getElementById('recentGoal').textContent = 'Goal: ' + (planner.student?.goal || 'No goal set');
    document.getElementById('recentTasks').textContent = tasks.length + ' Tasks';
    document.getElementById('recentHabits').textContent = habits.length + ' Habits';
    document.getElementById('recentStreak').textContent = streak.current + ' Day Streak';
    
    recentSection.style.display = 'block';
  } else {
    recentSection.style.display = 'none';
  }
}

function navigateTo(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(`page-${page}`).classList.add('active');

  document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
  const navLink = document.querySelector(`.nav-link[data-page="${page}"]`);
  if (navLink) navLink.classList.add('active');

  document.querySelectorAll('.mobile-nav-btn').forEach(btn => btn.classList.remove('active'));
  const mobileBtn = document.querySelector(`.mobile-nav-btn[data-page="${page}"]`);
  if (mobileBtn) mobileBtn.classList.add('active');

  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (page === 'dashboard') {
    Dashboard.render();
  } else if (page === 'analytics') {
    Analytics.render();
  } else if (page === 'settings') {
    Settings.updateStorageUsage();
  }

  history.pushState(null, '', page === 'home' ? '/' : `#${page}`);
}

function openDashboard() {
  navigateTo('dashboard');
}

function openModal(modalId) {
  document.getElementById('modalOverlay').classList.add('active');
  document.getElementById(modalId).classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
  document.getElementById('modalOverlay').classList.remove('active');
  document.getElementById(modalId).classList.remove('active');
  document.body.style.overflow = '';
}

function closeAllModals() {
  document.querySelectorAll('.modal').forEach(modal => {
    modal.classList.remove('active');
  });
  document.getElementById('modalOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

function toggleMobileMenu() {
  const navLinks = document.getElementById('navLinks');
  navLinks.classList.toggle('mobile-open');
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

function selectPrompt(type) {
  PromptGenerator.setPrompt(type);
  document.querySelectorAll('.prompt-option').forEach(opt => opt.classList.remove('active'));
  document.querySelector(`.prompt-option[data-prompt="${type}"]`).classList.add('active');
  document.getElementById('promptCode').textContent = PromptGenerator.getPrompt(type);
}

async function copyPrompt() {
  try {
    await PromptGenerator.copyPrompt();
    showToast('Prompt copied to clipboard!', 'success');
  } catch (e) {
    showToast('Failed to copy prompt', 'error');
  }
}

function downloadPrompt() {
  PromptGenerator.downloadPrompt();
  showToast('Prompt downloaded!', 'success');
}

function loadJSONGuide() {
  const templateStructure = `{
  "student": {
    "name": "Your Name",
    "goal": "Your primary goal",
    "exam": "Target exam",
    "targetDate": "YYYY-MM-DD",
    "dailyHours": 8,
    "weeklyHours": 50
  },
  "schedule": [...],
  "weekly_plan": {
    "Monday": [...],
    "Tuesday": [...],
    ...
  },
  "tasks": [...],
  "habits": [...],
  "goals": {
    "daily": [...],
    "weekly": [...],
    "monthly": [...]
  },
  "analytics": {...}
}`;

  const templateExample = `{
  "student": {
    "name": "Priya Sharma",
    "goal": "Score 95% in Board Exams",
    "exam": "CBSE Board 2026",
    "targetDate": "2026-03-15",
    "dailyHours": 8,
    "weeklyHours": 52
  },
  "stats": {
    "currentStreak": 5,
    "totalStudyDays": 45,
    "completionRate": 78
  },
  "schedule": [
    {
      "time": "06:00 AM",
      "task": "Wake up & Exercise",
      "subject": "Health",
      "duration": "30 min",
      "priority": "high"
    },
    {
      "time": "06:30 AM",
      "task": "Morning Study - Physics",
      "subject": "Physics",
      "duration": "2 hours",
      "priority": "high"
    },
    {
      "time": "08:30 AM",
      "task": "Breakfast",
      "subject": "Health",
      "duration": "30 min",
      "priority": "low"
    },
    {
      "time": "09:00 AM",
      "task": "Mathematics Practice",
      "subject": "Mathematics",
      "duration": "2 hours",
      "priority": "high"
    },
    {
      "time": "11:00 AM",
      "task": "Short Break",
      "subject": "Health",
      "duration": "15 min",
      "priority": "low"
    },
    {
      "time": "11:15 AM",
      "task": "Chemistry Revision",
      "subject": "Chemistry",
      "duration": "1.5 hours",
      "priority": "high"
    },
    {
      "time": "12:45 PM",
      "task": "Lunch & Rest",
      "subject": "Health",
      "duration": "1 hour",
      "priority": "medium"
    },
    {
      "time": "01:45 PM",
      "task": "English Literature",
      "subject": "English",
      "duration": "1 hour",
      "priority": "medium"
    },
    {
      "time": "02:45 PM",
      "task": "Physics Problems",
      "subject": "Physics",
      "duration": "1.5 hours",
      "priority": "high"
    },
    {
      "time": "04:15 PM",
      "task": "Evening Break",
      "subject": "Health",
      "duration": "30 min",
      "priority": "low"
    },
    {
      "time": "04:45 PM",
      "task": "Math Mock Test",
      "subject": "Mathematics",
      "duration": "2 hours",
      "priority": "high"
    },
    {
      "time": "06:45 PM",
      "task": "Revision & Notes",
      "subject": "General",
      "duration": "1 hour",
      "priority": "medium"
    },
    {
      "time": "07:45 PM",
      "task": "Dinner",
      "subject": "Health",
      "duration": "45 min",
      "priority": "medium"
    },
    {
      "time": "08:30 PM",
      "task": "Light Reading",
      "subject": "English",
      "duration": "1 hour",
      "priority": "low"
    },
    {
      "time": "09:30 PM",
      "task": "Plan Tomorrow",
      "subject": "General",
      "duration": "15 min",
      "priority": "medium"
    },
    {
      "time": "09:45 PM",
      "task": "Wind Down & Sleep",
      "subject": "Health",
      "duration": "15 min",
      "priority": "high"
    }
  ],
  "weekly_plan": {
    "Monday": [
      {"task": "Physics Ch-1 Revision", "subject": "Physics", "duration": "2h", "priority": "high"},
      {"task": "Math Practice Set 1", "subject": "Mathematics", "duration": "2h", "priority": "high"},
      {"task": "Chem Lab Report", "subject": "Chemistry", "duration": "1h", "priority": "medium"}
    ],
    "Tuesday": [
      {"task": "Physics Ch-2 Notes", "subject": "Physics", "duration": "2h", "priority": "high"},
      {"task": "Math Calculus", "subject": "Mathematics", "duration": "3h", "priority": "high"},
      {"task": "English Essay", "subject": "English", "duration": "1h", "priority": "medium"}
    ],
    "Wednesday": [
      {"task": "Physics Problems", "subject": "Physics", "duration": "2h", "priority": "high"},
      {"task": "Chem Organic", "subject": "Chemistry", "duration": "2h", "priority": "high"},
      {"task": "Math Test Prep", "subject": "Mathematics", "duration": "2h", "priority": "high"}
    ],
    "Thursday": [
      {"task": "Physics Mock", "subject": "Physics", "duration": "3h", "priority": "high"},
      {"task": "Math Algebra", "subject": "Mathematics", "duration": "2h", "priority": "high"},
      {"task": "English Reading", "subject": "English", "duration": "1h", "priority": "medium"}
    ],
    "Friday": [
      {"task": "Full Revision", "subject": "All", "duration": "4h", "priority": "high"},
      {"task": "Weak Topics", "subject": "All", "duration": "2h", "priority": "high"},
      {"task": "Notes Review", "subject": "General", "duration": "1h", "priority": "medium"}
    ],
    "Saturday": [
      {"task": "Mock Test Day", "subject": "All", "duration": "4h", "priority": "high"},
      {"task": "Test Analysis", "subject": "All", "duration": "2h", "priority": "high"},
      {"task": "Rest & Relax", "subject": "Health", "duration": "2h", "priority": "medium"}
    ],
    "Sunday": [
      {"task": "Light Revision", "subject": "All", "duration": "2h", "priority": "medium"},
      {"task": "Plan Next Week", "subject": "General", "duration": "1h", "priority": "high"},
      {"task": "Rest Day", "subject": "Health", "duration": "4h", "priority": "high"}
    ]
  },
  "tasks": [
    {"id": "t1", "title": "Complete Physics Ch-1", "subject": "Physics", "priority": "high", "status": "completed"},
    {"id": "t2", "title": "Math Practice Set 5", "subject": "Mathematics", "priority": "high", "status": "in-progress"},
    {"id": "t3", "title": "Chemistry Lab File", "subject": "Chemistry", "priority": "medium", "status": "pending"},
    {"id": "t4", "title": "English Essay Draft", "subject": "English", "priority": "low", "status": "pending"},
    {"id": "t5", "title": "Physics Numericals", "subject": "Physics", "priority": "high", "status": "pending"}
  ],
  "habits": [
    {"id": "h1", "name": "Study 8 Hours", "category": "study", "target": 7, "completedDates": ["2026-01-10", "2026-01-11", "2026-01-12"]},
    {"id": "h2", "name": "Exercise 30 Min", "category": "exercise", "target": 5, "completedDates": ["2026-01-10", "2026-01-12"]},
    {"id": "h3", "name": "Read 30 Pages", "category": "reading", "target": 7, "completedDates": ["2026-01-10", "2026-01-11"]},
    {"id": "h4", "name": "Revise Notes", "category": "revision", "target": 6, "completedDates": ["2026-01-10", "2026-01-11", "2026-01-12"]},
    {"id": "h5", "name": "Sleep by 10 PM", "category": "health", "target": 7, "completedDates": ["2026-01-10"]}
  ],
  "goals": {
    "daily": [
      {"id": "gd1", "text": "Complete 3 chapters", "completed": true, "progress": 100},
      {"id": "gd2", "text": "Solve 50 problems", "completed": false, "progress": 60},
      {"id": "gd3", "text": "Revise yesterday's notes", "completed": true, "progress": 100}
    ],
    "weekly": [
      {"id": "gw1", "text": "Finish Physics syllabus", "completed": false, "progress": 40},
      {"id": "gw2", "text": "Complete Math practice sets", "completed": false, "progress": 30},
      {"id": "gw3", "text": "Write 2 English essays", "completed": true, "progress": 100}
    ],
    "monthly": [
      {"id": "gm1", "text": "Cover 40% of total syllabus", "completed": false, "progress": 35},
      {"id": "gm2", "text": "Take 4 mock tests", "completed": false, "progress": 50},
      {"id": "gm3", "text": "Improve weak subjects", "completed": false, "progress": 20}
    ]
  },
  "analytics": {
    "studyHoursTarget": 8,
    "productivityTarget": 85,
    "weeklyGoalTarget": 5
  }
}`;

  const fieldReference = [
    { name: 'student', type: 'Object', desc: 'Contains student profile information including name, goal, exam target, and daily/weekly hour commitments.' },
    { name: 'student.name', type: 'String', desc: 'The student\'s name displayed on the dashboard.' },
    { name: 'student.goal', type: 'String', desc: 'Primary goal description (e.g., "Score 95% in Board Exams").' },
    { name: 'student.exam', type: 'String', desc: 'Target exam or milestone name.' },
    { name: 'student.targetDate', type: 'Date', desc: 'Target date in YYYY-MM-DD format.' },
    { name: 'student.dailyHours', type: 'Number', desc: 'Target daily study hours.' },
    { name: 'student.weeklyHours', type: 'Number', desc: 'Target weekly study hours.' },
    { name: 'schedule', type: 'Array', desc: 'Daily schedule with time blocks. Each entry has: time, task, subject, duration, priority.' },
    { name: 'weekly_plan', type: 'Object', desc: 'Weekly plan organized by day names (Monday-Sunday). Each day contains an array of tasks.' },
    { name: 'tasks', type: 'Array', desc: 'Task board items. Each task has: id, title, subject, priority, status, dueDate, description.' },
    { name: 'tasks[].status', type: 'Enum', desc: 'Task status: "pending", "in-progress", or "completed".' },
    { name: 'tasks[].priority', type: 'Enum', desc: 'Task priority: "low", "medium", or "high".' },
    { name: 'habits', type: 'Array', desc: 'Habits to track. Each habit has: id, name, category, target, completedDates.' },
    { name: 'habits[].category', type: 'String', desc: 'Habit category: study, revision, exercise, reading, health, or other.' },
    { name: 'goals', type: 'Object', desc: 'Goals organized by time period: daily, weekly, monthly.' },
    { name: 'goals.daily', type: 'Array', desc: 'Daily goals. Each goal has: id, text, completed, progress.' },
    { name: 'goals.weekly', type: 'Array', desc: 'Weekly goals with same structure as daily goals.' },
    { name: 'goals.monthly', type: 'Array', desc: 'Monthly goals with same structure as daily goals.' },
    { name: 'analytics', type: 'Object', desc: 'Analytics targets: studyHoursTarget, productivityTarget, weeklyGoalTarget.' }
  ];

  document.getElementById('structureCode').textContent = templateStructure;
  document.getElementById('exampleCode').textContent = templateExample;

  const fieldRefContainer = document.getElementById('fieldReference');
  fieldRefContainer.innerHTML = fieldReference.map(field => `
    <div class="field-item">
      <div class="field-item-header">
        <span class="field-name">${field.name}</span>
        <span class="field-type">${field.type}</span>
      </div>
      <p class="field-desc">${field.desc}</p>
    </div>
  `).join('');
}

function switchGuideTab(tab) {
  document.querySelectorAll('.guide-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.guide-content').forEach(c => c.classList.remove('active'));
  
  event.target.classList.add('active');
  document.getElementById(`guide${tab.charAt(0).toUpperCase() + tab.slice(1)}`).classList.add('active');
}

function copyTemplate() {
  const example = document.getElementById('exampleCode').textContent;
  navigator.clipboard.writeText(example).then(() => {
    showToast('Template copied to clipboard!', 'success');
  }).catch(() => {
    showToast('Failed to copy template', 'error');
  });
}

function downloadTemplate() {
  const example = document.getElementById('exampleCode').textContent;
  const blob = new Blob([example], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'comeback-planner-template.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('Template downloaded!', 'success');
}

function showInstallButtons() {
  const installBtn = document.getElementById('installBtn');
  const floatingBtn = document.getElementById('floatingInstallBtn');
  const settingItem = document.getElementById('installSettingItem');
  
  if (installBtn) installBtn.style.display = 'flex';
  if (floatingBtn) floatingBtn.style.display = 'flex';
  if (settingItem) settingItem.style.display = 'flex';
}

function hideInstallButtons() {
  const installBtn = document.getElementById('installBtn');
  const floatingBtn = document.getElementById('floatingInstallBtn');
  const settingItem = document.getElementById('installSettingItem');
  
  if (installBtn) installBtn.style.display = 'none';
  if (floatingBtn) floatingBtn.style.display = 'none';
  if (settingItem) settingItem.style.display = 'none';
}

async function installPWA() {
  if (!deferredPrompt) {
    showToast('App can be installed from browser menu', 'info');
    return;
  }

  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  
  if (outcome === 'accepted') {
    showToast('Installing app...', 'success');
  }
  
  deferredPrompt = null;
  hideInstallButtons();
}

function setupScrollEffects() {
  let lastScroll = 0;
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
      navbar.style.boxShadow = 'var(--shadow-sm)';
    } else {
      navbar.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
  });
}

function setupIntersectionObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.feature-card, .step-card, .quick-action-card').forEach(el => {
    observer.observe(el);
  });
}
