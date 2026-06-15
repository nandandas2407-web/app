const Export = {
  exportJSON() {
    const planner = Storage.getPlanner();
    if (!planner) {
      showToast('No planner to export', 'error');
      return;
    }

    const data = JSON.stringify(planner, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `comeback-planner-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Planner exported!', 'success');
  },

  exportBackup() {
    const data = Storage.exportAll();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `comeback-planner-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Backup exported!', 'success');
  },

  printDashboard() {
    window.print();
  },

  downloadSnapshot() {
    const planner = Storage.getPlanner();
    const tasks = Storage.getTasks();
    const habits = Storage.getHabits();
    const progress = Storage.getProgress();
    const streak = Storage.getStreak();

    const snapshot = {
      planner,
      tasks,
      habits,
      progress,
      streak,
      exportedAt: new Date().toISOString(),
      version: Storage.VERSION
    };

    const data = JSON.stringify(snapshot, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `comeback-snapshot-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Snapshot downloaded!', 'success');
  }
};

function exportPlanner() {
  Export.exportJSON();
}

function exportBackup() {
  Export.exportBackup();
}

function downloadSnapshot() {
  Export.downloadSnapshot();
}
