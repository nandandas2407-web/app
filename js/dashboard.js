const Dashboard = {
  currentTab: 'timeline',
  dayNumber: 1,

  init() {
    this.dayNumber = (Storage.getProgress().dayNumber || 0) + 1;
    this.render();
  },

  render() {
    const planner = Storage.getPlanner();
    const emptyState = document.getElementById('emptyState');
    const dashboardContent = document.getElementById('dashboardContent');

    if (!planner) {
      emptyState.style.display = 'flex';
      dashboardContent.style.display = 'none';
      return;
    }

    emptyState.style.display = 'none';
    dashboardContent.style.display = 'block';

    this.renderOverview(planner);
    this.renderTimeline(planner);
    this.renderWeekly(planner);
    this.renderTasks();
    this.renderHabits();
    this.renderGoals(planner);
    this.checkDailyCompletion(planner);
  },

  renderOverview(planner) {
    const student = planner.student || {};
    const streak = Storage.getStreak();
    const progress = Storage.getProgress();

    document.getElementById('dashTitle').textContent = student.name || 'Your Planner';
    document.getElementById('dashSubtitle').textContent = student.goal || 'Track your progress';

    document.getElementById('ovName').textContent = student.name || '-';
    document.getElementById('ovGoal').textContent = student.goal ? (student.goal.length > 25 ? student.goal.substring(0, 25) + '...' : student.goal) : '-';
    document.getElementById('ovExam').textContent = student.exam || '-';
    document.getElementById('ovHours').textContent = (student.dailyHours || 0) + 'h';

    const streakEl = document.getElementById('ovStreak');
    const streakVal = streak.current || 0;
    streakEl.textContent = streakVal + (streakVal === 1 ? ' day' : ' days');

    const totalGoals = progress.totalGoals || 0;
    const completedGoals = progress.completedGoals || 0;
    const completion = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;
    document.getElementById('ovCompletion').textContent = completion + '%';

    this.animateCounters();
  },

  animateCounters() {
    document.querySelectorAll('.overview-value').forEach(el => {
      el.style.animation = 'counterUp 0.5s ease forwards';
    });
  },

  renderTimeline(planner) {
    const container = document.getElementById('timelineContainer');
    const schedule = planner.schedule || [];

    if (schedule.length === 0) {
      container.innerHTML = '<p style="text-align:center;color:var(--gray-500);padding:40px;">No schedule data available</p>';
      return;
    }

    container.innerHTML = schedule.map((item, index) => `
      <div class="timeline-item priority-${item.priority || 'medium'} stagger-${Math.min(index + 1, 8)}">
        <div class="timeline-time">${item.time || 'Flexible'}</div>
        <div class="timeline-title">${item.task || 'Task'}</div>
        <div class="timeline-meta">
          <span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
            ${item.subject || 'General'}
          </span>
          <span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            ${item.duration || '-'}
          </span>
          <span class="kanban-card-priority priority-${item.priority || 'medium'}">${item.priority || 'medium'}</span>
        </div>
      </div>
    `).join('');

    this.observeElements(container.querySelectorAll('.timeline-item'));
  },

  renderWeekly(planner) {
    const container = document.getElementById('weeklyContainer');
    const weeklyPlan = planner.weekly_plan || {};
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    container.innerHTML = days.map(day => {
      const tasks = weeklyPlan[day] || [];
      return `
        <div class="weekly-card">
          <div class="weekly-card-header">
            <h3>${day}</h3>
            <p>${tasks.length} task${tasks.length !== 1 ? 's' : ''}</p>
          </div>
          <div class="weekly-card-body">
            ${tasks.length > 0 ? tasks.map((task, i) => `
              <div class="weekly-task">
                <div class="weekly-task-check" onclick="toggleWeeklyTask(this)"></div>
                <span class="weekly-task-text">${task.task || task.title || 'Task'}</span>
              </div>
            `).join('') : '<p style="color:var(--gray-400);font-size:13px;text-align:center;padding:16px 0;">No tasks planned</p>'}
          </div>
        </div>
      `;
    }).join('');
  },

  renderTasks() {
    const tasks = Storage.getTasks();
    const pending = tasks.filter(t => t.status === 'pending');
    const inProgress = tasks.filter(t => t.status === 'in-progress');
    const completed = tasks.filter(t => t.status === 'completed');

    document.getElementById('pendingCount').textContent = pending.length;
    document.getElementById('progressCount').textContent = inProgress.length;
    document.getElementById('completedCount').textContent = completed.length;

    document.getElementById('pendingCards').innerHTML = pending.map(task => this.renderTaskCard(task)).join('');
    document.getElementById('progressCards').innerHTML = inProgress.map(task => this.renderTaskCard(task)).join('');
    document.getElementById('completedCards').innerHTML = completed.map(task => this.renderTaskCard(task)).join('');

    this.observeElements(document.querySelectorAll('.kanban-card'));
  },

  renderTaskCard(task) {
    return `
      <div class="kanban-card" draggable="true" ondragstart="dragTask(event, '${task.id}')" data-task-id="${task.id}">
        <div class="kanban-card-title">${task.title || 'Untitled'}</div>
        <div class="kanban-card-meta">
          <span class="kanban-card-subject">${task.subject || 'General'}</span>
          <span class="kanban-card-priority priority-${task.priority || 'medium'}">${task.priority || 'medium'}</span>
        </div>
      </div>
    `;
  },

  renderHabits() {
    const habits = Storage.getHabits();
    const container = document.getElementById('habitsContainer');

    if (habits.length === 0) {
      container.innerHTML = '<p style="text-align:center;color:var(--gray-500);padding:40px;">No habits tracked yet. Add one!</p>';
      return;
    }

    container.innerHTML = habits.map(habit => {
      const today = new Date().toISOString().split('T')[0];
      const completedToday = (habit.completedDates || []).includes(today);
      const completion = habit.target > 0 ? Math.min(100, Math.round(((habit.completedDates || []).length / habit.target) * 100)) : 0;
      const circumference = 2 * Math.PI * 40;
      const offset = circumference - (completion / 100) * circumference;

      return `
        <div class="habit-card">
          <div class="habit-ring">
            <svg width="64" height="64" viewBox="0 0 100 100">
              <circle class="habit-ring-bg" cx="50" cy="50" r="40"></circle>
              <circle class="habit-ring-progress" cx="50" cy="50" r="40" 
                stroke-dasharray="${circumference}" 
                stroke-dashoffset="${offset}"
                style="stroke: ${completedToday ? 'var(--success)' : 'var(--primary)'}">
              </circle>
            </svg>
            <div class="habit-ring-text">${completion}%</div>
          </div>
          <div class="habit-info">
            <div class="habit-name">${habit.name}</div>
            <div class="habit-category">${habit.category || 'other'}</div>
            <div class="habit-streak">${habit.currentStreak || 0} day streak</div>
          </div>
          <div class="habit-actions">
            <button class="habit-toggle ${completedToday ? 'completed' : ''}" onclick="toggleHabit('${habit.id}')">
              ${completedToday ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>' : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle></svg>'}
            </button>
          </div>
        </div>
      `;
    }).join('');

    this.observeElements(container.querySelectorAll('.habit-card'));
  },

  renderGoals(planner) {
    const goals = planner.goals || {};
    this.renderGoalList('dailyGoals', goals.daily || [], 'daily');
    this.renderGoalList('weeklyGoals', goals.weekly || [], 'weekly');
    this.renderGoalList('monthlyGoals', goals.monthly || [], 'monthly');
    this.updatePointsDisplay(planner);
  },

  renderGoalList(containerId, goals, period) {
    const container = document.getElementById(containerId);
    
    if (goals.length === 0) {
      container.innerHTML = `
        <div class="goals-empty-state">
          <p>No ${period} goals set</p>
          <button class="btn btn-sm btn-primary" onclick="openAddGoalModal('${period}')">+ Add Goal</button>
        </div>
      `;
      return;
    }

    const sorted = [...goals].sort((a, b) => {
      const order = { high: 0, medium: 1, low: 2 };
      return (order[a.priority] || 2) - (order[b.priority] || 2);
    });

    container.innerHTML = sorted.map(goal => {
      const priorityClass = goal.completed ? 'completed' : (goal.priority || 'medium');
      return `
        <div class="goal-item goal-priority-${priorityClass}" data-goal-id="${goal.id}">
          <label class="goal-checkbox-wrapper">
            <input type="checkbox" class="goal-checkbox" ${goal.completed ? 'checked' : ''} onchange="toggleGoal('${goal.id}', '${period}')">
            <span class="goal-checkbox-custom"></span>
          </label>
          <div class="goal-info">
            <div class="goal-text ${goal.completed ? 'completed' : ''}">${goal.text || goal.title || 'Goal'}</div>
            <div class="goal-meta">
              <span class="goal-priority-badge priority-${goal.priority || 'medium'}">${goal.priority || 'medium'}</span>
              ${goal.points ? `<span class="goal-points">+${goal.points} pts</span>` : ''}
            </div>
          </div>
          <button class="goal-delete-btn" onclick="deleteGoal('${goal.id}', '${period}')" title="Delete goal">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      `;
    }).join('');

    this.observeElements(container.querySelectorAll('.goal-item'));
  },

  updatePointsDisplay(planner) {
    const points = planner.points || {};
    const totalEl = document.getElementById('totalPoints');
    const targetEl = document.getElementById('dailyTarget');
    if (totalEl) totalEl.textContent = points.totalEarned || 0;
    if (targetEl) targetEl.textContent = points.dailyTarget || 50;
  },

  checkDailyCompletion(planner) {
    const goals = (planner.goals || {}).daily || [];
    if (goals.length === 0) return;

    const allCompleted = goals.every(g => g.completed);
    const completedCount = goals.filter(g => g.completed).length;
    const progress = Storage.getProgress();
    const dayNum = progress.dayNumber || 1;

    const congratsPanel = document.getElementById('congratsPanel');
    const congratsOverlay = document.getElementById('congratsOverlay');

    if (allCompleted && !progress.congratsShownToday) {
      const today = new Date().toISOString().split('T')[0];
      if (progress.lastCongratsDate !== today) {
        this.showCongratsPanel(dayNum, goals);
        Storage.updateProgress({ congratsShownToday: true, lastCongratsDate: today });
      }
    } else if (completedCount > 0 && completedCount < goals.length) {
      const progressEl = document.getElementById('goalsProgress');
      if (progressEl) {
        const pct = Math.round((completedCount / goals.length) * 100);
        progressEl.style.display = 'block';
        progressEl.innerHTML = `
          <div class="progress-bar-container">
            <div class="progress-bar-fill" style="width: ${pct}%"></div>
          </div>
          <span class="progress-text">${completedCount}/${goals.length} goals completed (${pct}%)</span>
        `;
      }
    }
  },

  showCongratsPanel(dayNumber, goals) {
    const totalPoints = goals.reduce((sum, g) => sum + (g.points || 0), 0);
    const panel = document.getElementById('congratsPanel');
    const overlay = document.getElementById('congratsOverlay');

    document.getElementById('congratsDayNumber').textContent = dayNumber;
    document.getElementById('congratsPointsEarned').textContent = totalPoints;
    document.getElementById('congratsGoalsCompleted').textContent = goals.length;

    const streak = Storage.getStreak();
    document.getElementById('congratsStreak').textContent = streak.current || dayNumber;

    const confettiContainer = document.getElementById('confettiContainer');
    confettiContainer.innerHTML = '';
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti-piece';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.animationDelay = Math.random() * 2 + 's';
      confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
      confetti.style.backgroundColor = ['#6366f1', '#a855f7', '#22c55e', '#f59e0b', '#ef4444', '#ec4899'][Math.floor(Math.random() * 6)];
      confettiContainer.appendChild(confetti);
    }

    overlay.classList.add('active');
    panel.classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  closeCongratsPanel() {
    document.getElementById('congratsPanel').classList.remove('active');
    document.getElementById('congratsOverlay').classList.remove('active');
    document.body.style.overflow = '';
  },

  observeElements(elements) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));
  }
};

function switchTab(tab) {
  Dashboard.currentTab = tab;
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`.tab-btn[data-tab="${tab}"]`).classList.add('active');
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
  document.getElementById(`tab${tab.charAt(0).toUpperCase() + tab.slice(1)}`).classList.add('active');
}

function toggleWeeklyTask(el) {
  el.classList.toggle('checked');
  const text = el.nextElementSibling;
  if (text) text.classList.toggle('completed');
}

function dragTask(event, taskId) {
  event.dataTransfer.setData('text/plain', taskId);
  event.target.classList.add('dragging');
}

function allowDrop(event) {
  event.preventDefault();
}

function dropTask(event, status) {
  event.preventDefault();
  const taskId = event.dataTransfer.getData('text/plain');
  if (taskId) {
    Storage.updateTask(taskId, { status });
    Dashboard.renderTasks();
    showToast('Task moved!', 'success');
  }
  document.querySelectorAll('.kanban-card.dragging').forEach(card => card.classList.remove('dragging'));
}

function toggleHabit(habitId) {
  Storage.toggleHabitDay(habitId);
  Dashboard.renderHabits();
}

function toggleGoal(goalId, period) {
  const planner = Storage.getPlanner();
  if (!planner || !planner.goals || !planner.goals[period]) return;

  const goal = planner.goals[period].find(g => g.id === goalId);
  if (!goal) return;

  goal.completed = !goal.completed;
  
  if (goal.completed && goal.points) {
    if (!planner.points) planner.points = { totalEarned: 0, dailyTarget: 50, weeklyTarget: 200, monthlyTarget: 800 };
    planner.points.totalEarned = (planner.points.totalEarned || 0) + goal.points;
  } else if (!goal.completed && goal.points) {
    if (planner.points) planner.points.totalEarned = Math.max(0, (planner.points.totalEarned || 0) - goal.points);
  }

  Storage.setPlanner(planner);

  const allGoals = [...(planner.goals.daily || []), ...(planner.goals.weekly || []), ...(planner.goals.monthly || [])];
  const completedGoals = allGoals.filter(g => g.completed).length;
  Storage.updateProgress({ completedGoals, totalGoals: allGoals.length });

  Dashboard.renderGoals(planner);
  Dashboard.renderOverview(planner);
  Dashboard.checkDailyCompletion(planner);
}

function deleteGoal(goalId, period) {
  const planner = Storage.getPlanner();
  if (!planner || !planner.goals || !planner.goals[period]) return;

  planner.goals[period] = planner.goals[period].filter(g => g.id !== goalId);
  Storage.setPlanner(planner);

  const allGoals = [...(planner.goals.daily || []), ...(planner.goals.weekly || []), ...(planner.goals.monthly || [])];
  const completedGoals = allGoals.filter(g => g.completed).length;
  Storage.updateProgress({ completedGoals, totalGoals: allGoals.length });

  Dashboard.renderGoals(planner);
  Dashboard.renderOverview(planner);
  showToast('Goal deleted', 'info');
}

function openAddGoalModal(period) {
  document.getElementById('goalPeriod').value = period;
  document.getElementById('goalPeriodLabel').textContent = period.charAt(0).toUpperCase() + period.slice(1);
  openModal('addGoalModal');
}

function saveNewGoal() {
  const period = document.getElementById('goalPeriod').value;
  const text = document.getElementById('goalText').value.trim();
  const priority = document.getElementById('goalPriority').value;
  const points = parseInt(document.getElementById('goalPoints').value) || 10;

  if (!text) {
    showToast('Please enter a goal', 'error');
    return;
  }

  const planner = Storage.getPlanner();
  if (!planner) {
    showToast('Import a planner first', 'error');
    return;
  }

  if (!planner.goals) planner.goals = { daily: [], weekly: [], monthly: [] };
  if (!planner.goals[period]) planner.goals[period] = [];

  const newGoal = {
    id: `g${period[0]}_${Date.now()}`,
    text,
    priority,
    completed: false,
    points
  };

  planner.goals[period].push(newGoal);
  Storage.setPlanner(planner);

  const allGoals = [...(planner.goals.daily || []), ...(planner.goals.weekly || []), ...(planner.goals.monthly || [])];
  Storage.updateProgress({ totalGoals: allGoals.length, completedGoals: allGoals.filter(g => g.completed).length });

  document.getElementById('goalText').value = '';
  document.getElementById('goalPriority').value = 'medium';
  document.getElementById('goalPoints').value = '10';

  closeModal('addGoalModal');
  Dashboard.renderGoals(planner);
  showToast('Goal added!', 'success');
}

function openAddTaskModal() {
  openModal('addTaskModal');
}

function saveNewTask() {
  const title = document.getElementById('taskTitle').value.trim();
  const subject = document.getElementById('taskSubject').value.trim();
  const priority = document.getElementById('taskPriority').value;
  const dueDate = document.getElementById('taskDue').value;

  if (!title) {
    showToast('Please enter a task title', 'error');
    return;
  }

  Storage.addTask({ title, subject: subject || 'General', priority, dueDate, status: 'pending' });

  document.getElementById('taskTitle').value = '';
  document.getElementById('taskSubject').value = '';
  document.getElementById('taskPriority').value = 'medium';
  document.getElementById('taskDue').value = '';

  closeModal('addTaskModal');
  Dashboard.renderTasks();
  showToast('Task added!', 'success');
}

function openAddHabitModal() {
  openModal('addHabitModal');
}

function saveNewHabit() {
  const name = document.getElementById('habitName').value.trim();
  const category = document.getElementById('habitCategory').value;
  const target = parseInt(document.getElementById('habitTarget').value) || 7;

  if (!name) {
    showToast('Please enter a habit name', 'error');
    return;
  }

  Storage.addHabit({ name, category, target });

  document.getElementById('habitName').value = '';
  document.getElementById('habitCategory').value = 'study';
  document.getElementById('habitTarget').value = '7';

  closeModal('addHabitModal');
  Dashboard.renderHabits();
  showToast('Habit added!', 'success');
}

function closeCongrats() {
  Dashboard.closeCongratsPanel();
}

function renderDashboard() {
  Dashboard.render();
}
