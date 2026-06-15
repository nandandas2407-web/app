const Settings = {
  init() {
    this.updateStorageUsage();
  },

  updateStorageUsage() {
    const usage = Storage.getStorageUsage();
    const el = document.getElementById('storageUsage');
    if (el) {
      el.textContent = usage + ' used';
    }
  },

  clearPlanner() {
    if (confirm('Are you sure you want to clear your planner? This cannot be undone.')) {
      Storage.clearPlanner();
      showToast('Planner cleared', 'success');
      navigateTo('home');
      updateHomeState();
    }
  },

  clearAll() {
    if (confirm('Are you sure you want to clear ALL data? This will remove everything and cannot be undone.')) {
      Storage.clearAll();
      showToast('All data cleared', 'success');
      navigateTo('home');
      updateHomeState();
    }
  }
};

function confirmClearPlanner() {
  Settings.clearPlanner();
}

function confirmClearAll() {
  Settings.clearAll();
}

function updateStorageUsage() {
  Settings.updateStorageUsage();
}
