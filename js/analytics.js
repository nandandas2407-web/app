const Analytics = {
  charts: {},

  init() {
    this.render();
  },

  render() {
    const planner = Storage.getPlanner();
    const analyticsEmpty = document.getElementById('analyticsEmpty');
    const analyticsContent = document.getElementById('analyticsContent');

    if (!planner) {
      analyticsEmpty.style.display = 'flex';
      analyticsContent.style.display = 'none';
      return;
    }

    analyticsEmpty.style.display = 'none';
    analyticsContent.style.display = 'block';

    this.renderStudyHoursChart();
    this.renderGoalCompletionChart();
    this.renderProductivityChart();
    this.renderHabitChart();
    this.renderSummary();
  },

  getCanvasContext(id) {
    const canvas = document.getElementById(id);
    if (!canvas) return null;
    
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    
    return { ctx, width: rect.width, height: rect.height };
  },

  renderStudyHoursChart() {
    const data = this.getCanvasContext('studyHoursChart');
    if (!data) return;

    const { ctx, width, height } = data;
    const hours = [6, 8, 7, 9, 8, 10, 7];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const maxHours = Math.max(...hours, 12);
    const padding = { top: 20, right: 20, bottom: 40, left: 40 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(Math.round(maxHours - (maxHours / 4) * i) + 'h', padding.left - 8, y + 4);
    }

    const barWidth = chartWidth / days.length * 0.6;
    const gap = chartWidth / days.length;

    days.forEach((day, i) => {
      const barHeight = (hours[i] / maxHours) * chartHeight;
      const x = padding.left + gap * i + (gap - barWidth) / 2;
      const y = padding.top + chartHeight - barHeight;

      const gradient = ctx.createLinearGradient(x, y, x, padding.top + chartHeight);
      gradient.addColorStop(0, '#6366f1');
      gradient.addColorStop(1, '#a855f7');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0]);
      ctx.fill();

      ctx.fillStyle = '#64748b';
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(day, x + barWidth / 2, height - padding.bottom + 20);
    });
  },

  renderGoalCompletionChart() {
    const data = this.getCanvasContext('goalCompletionChart');
    if (!data) return;

    const { ctx, width, height } = data;
    const goals = Storage.getProgress();
    const completed = goals.completedGoals || 3;
    const total = goals.totalGoals || 10;
    const remaining = total - completed;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 30;
    const lineWidth = 20;

    ctx.clearRect(0, 0, width, height);

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = lineWidth;
    ctx.stroke();

    if (total > 0) {
      const completionRate = completed / total;
      const startAngle = -Math.PI / 2;
      const endAngle = startAngle + (Math.PI * 2 * completionRate);

      const gradient = ctx.createLinearGradient(centerX - radius, centerY, centerX + radius, centerY);
      gradient.addColorStop(0, '#6366f1');
      gradient.addColorStop(1, '#a855f7');

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.stroke();
    }

    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 28px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(percentage + '%', centerX, centerY - 8);

    ctx.fillStyle = '#64748b';
    ctx.font = '12px Inter, sans-serif';
    ctx.fillText(`${completed} of ${total} goals`, centerX, centerY + 16);
  },

  renderProductivityChart() {
    const data = this.getCanvasContext('productivityChart');
    if (!data) return;

    const { ctx, width, height } = data;
    const scores = [75, 82, 78, 88, 85, 90, 87];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const padding = { top: 20, right: 20, bottom: 40, left: 40 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(Math.round(100 - 25 * i) + '%', padding.left - 8, y + 4);
    }

    const pointGap = chartWidth / (days.length - 1);

    const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartHeight);
    gradient.addColorStop(0, 'rgba(99, 102, 241, 0.2)');
    gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');

    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top + chartHeight - (scores[0] / 100) * chartHeight);
    scores.forEach((score, i) => {
      const x = padding.left + pointGap * i;
      const y = padding.top + chartHeight - (score / 100) * chartHeight;
      ctx.lineTo(x, y);
    });
    ctx.lineTo(padding.left + pointGap * (scores.length - 1), padding.top + chartHeight);
    ctx.lineTo(padding.left, padding.top + chartHeight);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top + chartHeight - (scores[0] / 100) * chartHeight);
    scores.forEach((score, i) => {
      const x = padding.left + pointGap * i;
      const y = padding.top + chartHeight - (score / 100) * chartHeight;
      ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.stroke();

    scores.forEach((score, i) => {
      const x = padding.left + pointGap * i;
      const y = padding.top + chartHeight - (score / 100) * chartHeight;

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#6366f1';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();
    });

    days.forEach((day, i) => {
      ctx.fillStyle = '#64748b';
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(day, padding.left + pointGap * i, height - padding.bottom + 20);
    });
  },

  renderHabitChart() {
    const data = this.getCanvasContext('habitChart');
    if (!data) return;

    const { ctx, width, height } = data;
    const habits = Storage.getHabits();
    const categories = {};

    habits.forEach(habit => {
      const cat = habit.category || 'other';
      categories[cat] = (categories[cat] || 0) + 1;
    });

    const catList = Object.entries(categories);
    if (catList.length === 0) {
      catList.push(['study', 3], ['exercise', 2], ['reading', 1]);
    }

    const colors = ['#6366f1', '#a855f7', '#22c55e', '#f59e0b', '#ef4444', '#3b82f6'];
    const total = catList.reduce((sum, [, count]) => sum + count, 0);
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 40;

    ctx.clearRect(0, 0, width, height);

    let startAngle = -Math.PI / 2;
    catList.forEach(([name, count], i) => {
      const sliceAngle = (count / total) * Math.PI * 2;
      const endAngle = startAngle + sliceAngle;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();

      const midAngle = startAngle + sliceAngle / 2;
      const labelX = centerX + (radius * 0.65) * Math.cos(midAngle);
      const labelY = centerY + (radius * 0.65) * Math.sin(midAngle);

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(Math.round((count / total) * 100) + '%', labelX, labelY);

      startAngle = endAngle;
    });

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.5, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();

    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(habits.length, centerX, centerY - 6);
    ctx.fillStyle = '#64748b';
    ctx.font = '10px Inter, sans-serif';
    ctx.fillText('habits', centerX, centerY + 10);

    const legendY = height - 20;
    const legendStartX = (width - catList.length * 80) / 2;
    catList.forEach(([name], i) => {
      const x = legendStartX + i * 80;
      ctx.fillStyle = colors[i % colors.length];
      ctx.beginPath();
      ctx.arc(x, legendY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#64748b';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(name, x + 8, legendY + 3);
    });
  },

  renderSummary() {
    const progress = Storage.getProgress();
    const habits = Storage.getHabits();
    const goals = progress.totalGoals || 0;
    const completedGoals = progress.completedGoals || 0;

    document.getElementById('totalStudyHours').textContent = progress.studyHours || 42;
    document.getElementById('avgProductivity').textContent = (progress.productivityScore || 83) + '%';
    document.getElementById('completedGoals').textContent = completedGoals;
    document.getElementById('activeHabits').textContent = habits.length;

    document.querySelectorAll('.summary-card').forEach(card => {
      card.style.animation = 'fadeInUp 0.5s ease forwards';
    });
  }
};

function renderAnalytics() {
  Analytics.render();
}
