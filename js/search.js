const Search = {
  isOpen: false,

  init() {
    this.setupKeyboardShortcut();
  },

  setupKeyboardShortcut() {
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        this.open();
      }
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  },

  open() {
    this.isOpen = true;
    openModal('searchModal');
    setTimeout(() => {
      document.getElementById('searchInput').focus();
    }, 100);
  },

  close() {
    this.isOpen = false;
    closeModal('searchModal');
    document.getElementById('searchInput').value = '';
    document.getElementById('searchResults').innerHTML = '<div class="search-empty">Type to search...</div>';
  },

  search(query) {
    if (!query || query.length < 2) {
      document.getElementById('searchResults').innerHTML = '<div class="search-empty">Type to search...</div>';
      return;
    }

    const results = [];
    const lowerQuery = query.toLowerCase();

    const tasks = Storage.getTasks();
    tasks.forEach(task => {
      if (
        (task.title && task.title.toLowerCase().includes(lowerQuery)) ||
        (task.subject && task.subject.toLowerCase().includes(lowerQuery))
      ) {
        results.push({
          type: 'task',
          icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>',
          title: task.title,
          subtitle: task.subject || 'Task',
          highlight: this.highlightMatch(task.title, query)
        });
      }
    });

    const habits = Storage.getHabits();
    habits.forEach(habit => {
      if (habit.name && habit.name.toLowerCase().includes(lowerQuery)) {
        results.push({
          type: 'habit',
          icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
          title: habit.name,
          subtitle: habit.category || 'Habit',
          highlight: this.highlightMatch(habit.name, query)
        });
      }
    });

    const planner = Storage.getPlanner();
    if (planner) {
      if (planner.student) {
        if (planner.student.name && planner.student.name.toLowerCase().includes(lowerQuery)) {
          results.push({
            type: 'profile',
            icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',
            title: planner.student.name,
            subtitle: 'Student Profile',
            highlight: this.highlightMatch(planner.student.name, query)
          });
        }
        if (planner.student.goal && planner.student.goal.toLowerCase().includes(lowerQuery)) {
          results.push({
            type: 'goal',
            icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>',
            title: planner.student.goal,
            subtitle: 'Main Goal',
            highlight: this.highlightMatch(planner.student.goal, query)
          });
        }
      }

      if (planner.schedule) {
        planner.schedule.forEach(item => {
          if (
            (item.task && item.task.toLowerCase().includes(lowerQuery)) ||
            (item.subject && item.subject.toLowerCase().includes(lowerQuery))
          ) {
            results.push({
              type: 'schedule',
              icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
              title: item.task,
              subtitle: `${item.time || ''} - ${item.subject || 'General'}`,
              highlight: this.highlightMatch(item.task, query)
            });
          }
        });
      }

      if (planner.goals) {
        ['daily', 'weekly', 'monthly'].forEach(period => {
          if (planner.goals[period]) {
            planner.goals[period].forEach(goal => {
              if (goal.text && goal.text.toLowerCase().includes(lowerQuery)) {
                results.push({
                  type: 'goal',
                  icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>',
                  title: goal.text,
                  subtitle: `${period.charAt(0).toUpperCase() + period.slice(1)} Goal`,
                  highlight: this.highlightMatch(goal.text, query)
                });
              }
            });
          }
        });
      }
    }

    this.renderResults(results, query);
  },

  highlightMatch(text, query) {
    if (!text || !query) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<span class="search-highlight">$1</span>');
  },

  renderResults(results, query) {
    const container = document.getElementById('searchResults');

    if (results.length === 0) {
      container.innerHTML = `<div class="search-empty">No results found for "${query}"</div>`;
      return;
    }

    container.innerHTML = results.map(result => `
      <div class="search-result-item" onclick="Search.navigateToResult('${result.type}')">
        <div class="search-result-icon">${result.icon}</div>
        <div class="search-result-info">
          <div class="search-result-title">${result.highlight || result.title}</div>
          <div class="search-result-type">${result.subtitle}</div>
        </div>
      </div>
    `).join('');
  },

  navigateToResult(type) {
    this.close();
    switch (type) {
      case 'task':
        navigateTo('dashboard');
        switchTab('tasks');
        break;
      case 'habit':
        navigateTo('dashboard');
        switchTab('habits');
        break;
      case 'schedule':
        navigateTo('dashboard');
        switchTab('timeline');
        break;
      case 'goal':
        navigateTo('dashboard');
        switchTab('goals');
        break;
      case 'profile':
        navigateTo('dashboard');
        break;
      default:
        navigateTo('dashboard');
    }
  }
};

function openSearch() {
  Search.open();
}

function performSearch(query) {
  Search.search(query);
}
