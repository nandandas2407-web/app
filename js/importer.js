const Importer = {
  jsonInput: '',
  parsedData: null,

  init() {
    this.jsonInput = document.getElementById('jsonInput');
  },

  validateJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      return { valid: true, data: data, error: null };
    } catch (e) {
      return { valid: false, data: null, error: e.message };
    }
  },

  validateStructure(data) {
    const warnings = [];
    
    if (!data.student) {
      warnings.push('Missing "student" object');
    } else {
      if (!data.student.name) warnings.push('Missing student.name');
      if (!data.student.goal) warnings.push('Missing student.goal');
    }

    if (!data.schedule || !Array.isArray(data.schedule)) {
      warnings.push('Missing or invalid "schedule" array');
    }

    if (!data.weekly_plan) {
      warnings.push('Missing "weekly_plan" object');
    }

    if (!data.tasks || !Array.isArray(data.tasks)) {
      warnings.push('Missing or invalid "tasks" array');
    }

    if (!data.habits || !Array.isArray(data.habits)) {
      warnings.push('Missing or invalid "habits" array');
    }

    if (!data.goals) {
      warnings.push('Missing "goals" object');
    }

    return warnings;
  },

  normalizeData(data) {
    const normalized = { ...data };

    if (!normalized.student) {
      normalized.student = {
        name: 'Student',
        goal: 'Achieve your goals',
        exam: 'Target Exam',
        dailyHours: 8,
        weeklyHours: 50
      };
    }

    if (!normalized.stats) {
      normalized.stats = {
        currentStreak: 0,
        totalStudyDays: 0,
        completionRate: 0
      };
    }

    if (!Array.isArray(normalized.schedule)) {
      normalized.schedule = [];
    }

    if (!normalized.weekly_plan) {
      normalized.weekly_plan = {
        Monday: [], Tuesday: [], Wednesday: [],
        Thursday: [], Friday: [], Saturday: [], Sunday: []
      };
    }

    if (!Array.isArray(normalized.tasks)) {
      normalized.tasks = [];
    }

    normalized.tasks = normalized.tasks.map((task, index) => ({
      id: task.id || `task_${index + 1}`,
      title: task.title || task.name || 'Untitled Task',
      subject: task.subject || 'General',
      priority: task.priority || 'medium',
      status: task.status || 'pending',
      dueDate: task.dueDate || null,
      description: task.description || '',
      createdAt: task.createdAt || new Date().toISOString()
    }));

    if (!Array.isArray(normalized.habits)) {
      normalized.habits = [];
    }

    normalized.habits = normalized.habits.map((habit, index) => ({
      id: habit.id || `habit_${index + 1}`,
      name: habit.name || 'New Habit',
      category: habit.category || 'other',
      target: habit.target || 7,
      completedDates: habit.completedDates || [],
      currentStreak: 0
    }));

    if (!normalized.goals) {
      normalized.goals = { daily: [], weekly: [], monthly: [] };
    }

    if (!Array.isArray(normalized.goals.daily)) normalized.goals.daily = [];
    if (!Array.isArray(normalized.goals.weekly)) normalized.goals.weekly = [];
    if (!Array.isArray(normalized.goals.monthly)) normalized.goals.monthly = [];

    normalized.goals.daily = normalized.goals.daily.map((goal, index) => ({
      id: goal.id || `goal_d${index + 1}`,
      text: goal.text || goal.title || 'New Goal',
      priority: goal.priority || 'medium',
      completed: goal.completed || false,
      points: goal.points || 10
    }));

    normalized.goals.weekly = normalized.goals.weekly.map((goal, index) => ({
      id: goal.id || `goal_w${index + 1}`,
      text: goal.text || goal.title || 'New Goal',
      priority: goal.priority || 'medium',
      completed: goal.completed || false,
      points: goal.points || 20
    }));

    normalized.goals.monthly = normalized.goals.monthly.map((goal, index) => ({
      id: goal.id || `goal_m${index + 1}`,
      text: goal.text || goal.title || 'New Goal',
      priority: goal.priority || 'medium',
      completed: goal.completed || false,
      points: goal.points || 50
    }));

    if (!normalized.points) {
      normalized.points = {
        totalEarned: 0,
        dailyTarget: 50,
        weeklyTarget: 200,
        monthlyTarget: 800
      };
    }

    if (!normalized.analytics) {
      normalized.analytics = {
        studyHoursTarget: 8,
        productivityTarget: 80,
        weeklyGoalTarget: 5
      };
    }

    if (!Array.isArray(normalized.healthReminders)) {
      normalized.healthReminders = [];
    }

    if (!Array.isArray(normalized.breakBlocks)) {
      normalized.breakBlocks = [];
    }

    return normalized;
  },

  importFromText(jsonString) {
    const validation = this.validateJSON(jsonString);
    
    if (!validation.valid) {
      return {
        success: false,
        error: `Invalid JSON: ${validation.error}`
      };
    }

    const warnings = this.validateStructure(validation.data);
    const normalized = this.normalizeData(validation.data);

    Storage.setPlanner(normalized);
    Storage.setTasks(normalized.tasks);
    Storage.setHabits(normalized.habits);

    Storage.updateProgress({
      completedTasks: normalized.tasks.filter(t => t.status === 'completed').length,
      totalTasks: normalized.tasks.length,
      completedGoals: [
        ...normalized.goals.daily.filter(g => g.completed),
        ...normalized.goals.weekly.filter(g => g.completed),
        ...normalized.goals.monthly.filter(g => g.completed)
      ].length,
      totalGoals: normalized.goals.daily.length + normalized.goals.weekly.length + normalized.goals.monthly.length
    });

    return {
      success: true,
      data: normalized,
      warnings: warnings
    };
  },

  importFromFile(file) {
    return new Promise((resolve, reject) => {
      if (!file || file.type !== 'application/json') {
        resolve({ success: false, error: 'Please select a valid JSON file' });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = this.importFromText(e.target.result);
        resolve(result);
      };
      reader.onerror = () => {
        resolve({ success: false, error: 'Failed to read file' });
      };
      reader.readAsText(file);
    });
  },

  switchTab(tab) {
    document.querySelectorAll('.import-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.import-panel').forEach(p => p.classList.remove('active'));
    
    document.querySelector(`.import-tab:nth-child(${tab === 'paste' ? 1 : tab === 'upload' ? 2 : 3})`).classList.add('active');
    document.getElementById(`import${tab.charAt(0).toUpperCase() + tab.slice(1)}`).classList.add('active');
  },

  showStatus(message, type) {
    const statusEl = document.getElementById('importStatus');
    statusEl.style.display = 'block';
    statusEl.className = `import-status ${type}`;
    statusEl.textContent = message;
  },

  hideStatus() {
    document.getElementById('importStatus').style.display = 'none';
  },

  reset() {
    if (this.jsonInput) {
      this.jsonInput.value = '';
    }
    this.parsedData = null;
    this.hideStatus();
  }
};

function switchImportTab(tab) {
  Importer.switchTab(tab);
}

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file) {
    Importer.importFromFile(file).then(result => {
      if (result.success) {
        Importer.showStatus('✓ File loaded successfully. Click Import to apply.', 'success');
        document.getElementById('jsonInput').value = JSON.stringify(result.data, null, 2);
      } else {
        Importer.showStatus(`✗ ${result.error}`, 'error');
      }
    });
  }
}

function handleDragOver(event) {
  event.preventDefault();
  event.stopPropagation();
  document.getElementById('dropZone').classList.add('drag-over');
}

function handleDragLeave(event) {
  event.preventDefault();
  event.stopPropagation();
  document.getElementById('dropZone').classList.remove('drag-over');
}

function handleDrop(event) {
  event.preventDefault();
  event.stopPropagation();
  document.getElementById('dropZone').classList.remove('drag-over');
  
  const files = event.dataTransfer.files;
  if (files.length > 0) {
    Importer.importFromFile(files[0]).then(result => {
      if (result.success) {
        Importer.showStatus('✓ File loaded successfully. Click Import to apply.', 'success');
        document.getElementById('jsonInput').value = JSON.stringify(result.data, null, 2);
      } else {
        Importer.showStatus(`✗ ${result.error}`, 'error');
      }
    });
  }
}

function importJSON() {
  const jsonInput = document.getElementById('jsonInput').value.trim();
  
  if (!jsonInput) {
    Importer.showStatus('✗ Please paste JSON data or upload a file', 'error');
    return;
  }

  const result = Importer.importFromText(jsonInput);

  if (result.success) {
    Importer.showStatus('✓ Planner imported successfully!', 'success');
    
    setTimeout(() => {
      closeModal('importModal');
      Importer.reset();
      showToast('Planner imported successfully!', 'success');
      navigateTo('dashboard');
      if (typeof renderDashboard === 'function') {
        renderDashboard();
      }
    }, 1000);
  } else {
    Importer.showStatus(`✗ ${result.error}`, 'error');
  }
}
