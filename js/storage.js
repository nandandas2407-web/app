const Storage = {
  VERSION: '1.0.0',
  KEYS: {
    PLANNER: 'comeback_planner_data',
    TASKS: 'comeback_planner_tasks',
    HABITS: 'comeback_planner_habits',
    SETTINGS: 'comeback_planner_settings',
    PROGRESS: 'comeback_planner_progress',
    STREAK: 'comeback_planner_streak',
    LAST_ACTIVE: 'comeback_planner_last_active'
  },

  init() {
    this.migrate();
    this.checkStreak();
  },

  get(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Storage read error:', e);
      return null;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Storage write error:', e);
      return false;
    }
  },

  remove(key) {
    localStorage.removeItem(key);
  },

  getPlanner() {
    return this.get(this.KEYS.PLANNER);
  },

  setPlanner(data) {
    const planner = {
      ...data,
      _version: this.VERSION,
      _importedAt: new Date().toISOString(),
      _updatedAt: new Date().toISOString()
    };
    this.set(this.KEYS.PLANNER, planner);
    this.updateLastActive();
    return planner;
  },

  updatePlanner(updates) {
    const planner = this.getPlanner();
    if (!planner) return null;
    const updated = {
      ...planner,
      ...updates,
      _updatedAt: new Date().toISOString()
    };
    this.set(this.KEYS.PLANNER, updated);
    return updated;
  },

  getTasks() {
    return this.get(this.KEYS.TASKS) || [];
  },

  setTasks(tasks) {
    this.set(this.KEYS.TASKS, tasks);
    this.updateLastActive();
  },

  addTask(task) {
    const tasks = this.getTasks();
    task.id = task.id || this.generateId();
    task.createdAt = new Date().toISOString();
    task.status = task.status || 'pending';
    tasks.push(task);
    this.setTasks(tasks);
    return task;
  },

  updateTask(id, updates) {
    const tasks = this.getTasks();
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updates, updatedAt: new Date().toISOString() };
      this.setTasks(tasks);
      return tasks[index];
    }
    return null;
  },

  deleteTask(id) {
    const tasks = this.getTasks().filter(t => t.id !== id);
    this.setTasks(tasks);
  },

  getHabits() {
    return this.get(this.KEYS.HABITS) || [];
  },

  setHabits(habits) {
    this.set(this.KEYS.HABITS, habits);
    this.updateLastActive();
  },

  addHabit(habit) {
    const habits = this.getHabits();
    habit.id = habit.id || this.generateId();
    habit.createdAt = new Date().toISOString();
    habit.completedDates = habit.completedDates || [];
    habit.currentStreak = 0;
    habits.push(habit);
    this.setHabits(habits);
    return habit;
  },

  updateHabit(id, updates) {
    const habits = this.getHabits();
    const index = habits.findIndex(h => h.id === id);
    if (index !== -1) {
      habits[index] = { ...habits[index], ...updates };
      this.setHabits(habits);
      return habits[index];
    }
    return null;
  },

  toggleHabitDay(id, date) {
    const habits = this.getHabits();
    const habit = habits.find(h => h.id === id);
    if (!habit) return null;

    if (!habit.completedDates) habit.completedDates = [];
    
    const dateStr = date || new Date().toISOString().split('T')[0];
    const index = habit.completedDates.indexOf(dateStr);
    
    if (index > -1) {
      habit.completedDates.splice(index, 1);
    } else {
      habit.completedDates.push(dateStr);
    }

    habit.currentStreak = this.calculateStreak(habit.completedDates);
    this.setHabits(habits);
    return habit;
  },

  calculateStreak(completedDates) {
    if (!completedDates || completedDates.length === 0) return 0;
    
    const sorted = [...completedDates].sort().reverse();
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    if (sorted[0] !== today && sorted[0] !== yesterday) return 0;
    
    let streak = 1;
    for (let i = 0; i < sorted.length - 1; i++) {
      const current = new Date(sorted[i]);
      const next = new Date(sorted[i + 1]);
      const diff = (current - next) / 86400000;
      if (diff === 1) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  },

  getSettings() {
    return this.get(this.KEYS.SETTINGS) || {
      theme: 'light',
      notifications: true,
      autoSave: true
    };
  },

  setSettings(settings) {
    this.set(this.KEYS.SETTINGS, settings);
  },

  getProgress() {
    return this.get(this.KEYS.PROGRESS) || {
      completedTasks: 0,
      totalTasks: 0,
      completedGoals: 0,
      totalGoals: 0,
      studyHours: 0,
      productivityScore: 0
    };
  },

  setProgress(progress) {
    this.set(this.KEYS.PROGRESS, progress);
  },

  updateProgress(data) {
    const progress = this.getProgress();
    const updated = { ...progress, ...data };
    this.setProgress(updated);
    return updated;
  },

  getStreak() {
    return this.get(this.KEYS.STREAK) || {
      current: 0,
      longest: 0,
      lastActive: null
    };
  },

  checkStreak() {
    const streak = this.getStreak();
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (streak.lastActive === today) {
      return streak;
    }

    if (streak.lastActive === yesterday) {
      streak.current += 1;
      streak.lastActive = today;
    } else if (streak.lastActive !== today) {
      streak.current = 1;
      streak.lastActive = today;
    }

    streak.longest = Math.max(streak.longest, streak.current);
    this.set(this.KEYS.STREAK, streak);
    return streak;
  },

  updateLastActive() {
    const streak = this.getStreak();
    const today = new Date().toISOString().split('T')[0];
    
    if (streak.lastActive !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      if (streak.lastActive === yesterday) {
        streak.current += 1;
      } else {
        streak.current = 1;
      }
      streak.lastActive = today;
      streak.longest = Math.max(streak.longest, streak.current);
      this.set(this.KEYS.STREAK, streak);
    }
  },

  hasPlanner() {
    return this.getPlanner() !== null;
  },

  clearPlanner() {
    this.remove(this.KEYS.PLANNER);
    this.remove(this.KEYS.TASKS);
    this.remove(this.KEYS.HABITS);
    this.remove(this.KEYS.PROGRESS);
    this.remove(this.KEYS.STREAK);
  },

  clearAll() {
    Object.values(this.KEYS).forEach(key => {
      this.remove(key);
    });
  },

  getStorageUsage() {
    let total = 0;
    Object.values(this.KEYS).forEach(key => {
      const data = localStorage.getItem(key);
      if (data) {
        total += new Blob([data]).size;
      }
    });
    return this.formatBytes(total);
  },

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  },

  exportAll() {
    return {
      version: this.VERSION,
      exportedAt: new Date().toISOString(),
      planner: this.getPlanner(),
      tasks: this.getTasks(),
      habits: this.getHabits(),
      progress: this.getProgress(),
      streak: this.getStreak(),
      settings: this.getSettings()
    };
  },

  importAll(data) {
    if (data.planner) this.setPlanner(data.planner);
    if (data.tasks) this.setTasks(data.tasks);
    if (data.habits) this.setHabits(data.habits);
    if (data.progress) this.setProgress(data.progress);
    if (data.streak) this.set(this.KEYS.STREAK, data.streak);
    if (data.settings) this.setSettings(data.settings);
  },

  migrate() {
    const planner = this.get(this.KEYS.PLANNER);
    if (planner && !planner._version) {
      planner._version = this.VERSION;
      planner._migratedAt = new Date().toISOString();
      this.set(this.KEYS.PLANNER, planner);
    }
  }
};

Storage.init();
