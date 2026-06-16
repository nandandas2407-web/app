const PromptGenerator = {
  prompts: {
    comeback: `You are an expert productivity strategist, academic planner, habit coach, and exam preparation consultant.

Generate ONLY valid JSON.
Do not use markdown.
Do not explain.
Do not wrap inside code blocks.

Generate a comprehensive planner with the following structure:

{
  "student": {
    "name": "Student Name",
    "goal": "Primary academic goal",
    "exam": "Target exam name",
    "targetDate": "YYYY-MM-DD",
    "dailyHours": 8,
    "weeklyHours": 50
  },
  "stats": {
    "currentStreak": 0,
    "totalStudyDays": 0,
    "completionRate": 0
  },
  "schedule": [
    {
      "time": "06:00 AM",
      "task": "Wake up & Morning Routine",
      "subject": "Health",
      "duration": "30 min",
      "priority": "high"
    }
  ],
  "weekly_plan": {
    "Monday": [{ "task": "Task name", "subject": "Subject", "duration": "2 hours", "priority": "high" }],
    "Tuesday": [],
    "Wednesday": [],
    "Thursday": [],
    "Friday": [],
    "Saturday": [],
    "Sunday": []
  },
  "tasks": [
    {
      "id": "task_1",
      "title": "Task title",
      "subject": "Subject",
      "priority": "high",
      "status": "pending",
      "dueDate": "YYYY-MM-DD",
      "description": "Brief description"
    }
  ],
  "habits": [
    {
      "id": "habit_1",
      "name": "Study 8 hours",
      "category": "study",
      "target": 7,
      "completedDates": []
    }
  ],
  "goals": {
    "daily": [
      {
        "id": "gd_1",
        "text": "Complete 3 chapters of Physics",
        "priority": "high",
        "completed": false,
        "points": 10
      },
      {
        "id": "gd_2",
        "text": "Solve 50 Math problems",
        "priority": "high",
        "completed": false,
        "points": 15
      },
      {
        "id": "gd_3",
        "text": "Revise Chemistry notes",
        "priority": "medium",
        "completed": false,
        "points": 10
      },
      {
        "id": "gd_4",
        "text": "Read English chapter",
        "priority": "low",
        "completed": false,
        "points": 5
      },
      {
        "id": "gd_5",
        "text": "Drink 3L water",
        "priority": "low",
        "completed": false,
        "points": 5
      }
    ],
    "weekly": [
      {
        "id": "gw_1",
        "text": "Finish Math syllabus Unit 1",
        "priority": "high",
        "completed": false,
        "points": 50
      },
      {
        "id": "gw_2",
        "text": "Complete Physics lab manual",
        "priority": "medium",
        "completed": false,
        "points": 30
      },
      {
        "id": "gw_3",
        "text": "Write 2 practice essays",
        "priority": "low",
        "completed": false,
        "points": 20
      }
    ],
    "monthly": [
      {
        "id": "gm_1",
        "text": "Cover 40% of total syllabus",
        "priority": "high",
        "completed": false,
        "points": 100
      },
      {
        "id": "gm_2",
        "text": "Take 4 full mock tests",
        "priority": "high",
        "completed": false,
        "points": 80
      },
      {
        "id": "gm_3",
        "text": "Improve weak subjects by 20%",
        "priority": "medium",
        "completed": false,
        "points": 60
      }
    ]
  },
  "points": {
    "totalEarned": 0,
    "dailyTarget": 50,
    "weeklyTarget": 200,
    "monthlyTarget": 800
  },
  "analytics": {
    "studyHoursTarget": 8,
    "productivityTarget": 85,
    "weeklyGoalTarget": 5
  },
  "healthReminders": [
    "Drink 3 liters of water",
    "Take 10 minute break every 2 hours",
    "Sleep 7-8 hours"
  ],
  "breakBlocks": [
    { "time": "10:00 AM", "duration": "15 min", "activity": "Stretch and walk" }
  ]
}

RULES FOR GOALS:
- priority must be: "high" (red), "medium" (yellow), "low" (green)
- Each goal MUST have a "points" value (5-100 based on difficulty)
- Generate 5-7 DAILY goals, 3-5 WEEKLY goals, 3-4 MONTHLY goals
- Mix priorities: some high, some medium, some low
- Goals should be specific, measurable, and actionable

Return ONLY JSON. Make the schedule detailed with at least 12 time blocks.`,

    jee: `You are an expert JEE preparation strategist and academic planner.

Generate ONLY valid JSON.
Do not use markdown.
Do not explain.
Do not wrap inside code blocks.

Generate a comprehensive JEE planner with the following structure:

{
  "student": {
    "name": "Student Name",
    "goal": "Score 99+ percentile in JEE Main/Advanced",
    "exam": "JEE Main 2026",
    "targetDate": "2026-04-15",
    "dailyHours": 10,
    "weeklyHours": 65
  },
  "stats": { "currentStreak": 0, "totalStudyDays": 0, "completionRate": 0 },
  "schedule": [
    { "time": "05:30 AM", "task": "Wake up & Exercise", "subject": "Health", "duration": "45 min", "priority": "high" }
  ],
  "weekly_plan": {
    "Monday": [{ "task": "Physics - Mechanics", "subject": "Physics", "duration": "3 hours", "priority": "high" }],
    "Tuesday": [], "Wednesday": [], "Thursday": [], "Friday": [], "Saturday": [], "Sunday": []
  },
  "tasks": [
    { "id": "task_1", "title": "Complete Mechanics chapter", "subject": "Physics", "priority": "high", "status": "pending", "dueDate": "YYYY-MM-DD", "description": "Study HCV and solve PYQs" }
  ],
  "habits": [
    { "id": "habit_1", "name": "Study 10 hours", "category": "study", "target": 7, "completedDates": [] },
    { "id": "habit_2", "name": "Solve 50 MCQs daily", "category": "study", "target": 7, "completedDates": [] }
  ],
  "goals": {
    "daily": [
      { "id": "gd_1", "text": "Complete Physics lecture + notes", "priority": "high", "completed": false, "points": 15 },
      { "id": "gd_2", "text": "Solve 30 MCQs from Physics", "priority": "high", "completed": false, "points": 15 },
      { "id": "gd_3", "text": "Solve 20 MCQs from Maths", "priority": "high", "completed": false, "points": 15 },
      { "id": "gd_4", "text": "Revise Chemistry formulas", "priority": "medium", "completed": false, "points": 10 },
      { "id": "gd_5", "text": "Solve 10 Numericals", "priority": "medium", "completed": false, "points": 10 },
      { "id": "gd_6", "text": "Review today mistakes", "priority": "low", "completed": false, "points": 5 }
    ],
    "weekly": [
      { "id": "gw_1", "text": "Finish Thermodynamics in all 3 subjects", "priority": "high", "completed": false, "points": 50 },
      { "id": "gw_2", "text": "Complete 200 MCQs this week", "priority": "high", "completed": false, "points": 40 },
      { "id": "gw_3", "text": "Take 1 full mock test", "priority": "medium", "completed": false, "points": 30 },
      { "id": "gw_4", "text": "Revise all short notes", "priority": "low", "completed": false, "points": 20 }
    ],
    "monthly": [
      { "id": "gm_1", "text": "Complete 30% of JEE syllabus", "priority": "high", "completed": false, "points": 100 },
      { "id": "gm_2", "text": "Score 150+ in 2 mock tests", "priority": "high", "completed": false, "points": 80 },
      { "id": "gm_3", "text": "Master 5 weak topics", "priority": "medium", "completed": false, "points": 60 }
    ]
  },
  "points": { "totalEarned": 0, "dailyTarget": 70, "weeklyTarget": 250, "monthlyTarget": 900 },
  "analytics": { "studyHoursTarget": 10, "productivityTarget": 90, "weeklyGoalTarget": 7 },
  "subjects": [
    { "name": "Physics", "topics": ["Mechanics", "Thermodynamics", "Electromagnetism", "Optics", "Modern Physics"], "weightage": 33 },
    { "name": "Chemistry", "topics": ["Physical Chemistry", "Organic Chemistry", "Inorganic Chemistry"], "weightage": 33 },
    { "name": "Mathematics", "topics": ["Calculus", "Algebra", "Coordinate Geometry", "Trigonometry", "Vectors"], "weightage": 34 }
  ],
  "healthReminders": ["Drink 3 liters of water", "Eye exercises every hour", "Sleep by 11 PM"],
  "breakBlocks": [{ "time": "09:30 AM", "duration": "15 min", "activity": "Quick walk and stretch" }]
}

RULES FOR GOALS:
- priority: "high" (red), "medium" (yellow), "low" (green)
- Each goal MUST have "points" (5-100 based on difficulty)
- Generate 5-7 DAILY, 3-5 WEEKLY, 3-4 MONTHLY goals
- Make goals JEE-specific and measurable

Return ONLY JSON. Make it detailed and realistic for a JEE aspirant.`,

    board: `You are an expert board exam preparation strategist.

Generate ONLY valid JSON.
Do not use markdown.
Do not explain.
Do not wrap inside code blocks.

Generate a comprehensive board exam planner:

{
  "student": {
    "name": "Student Name",
    "goal": "Score 95%+ in Board Exams",
    "exam": "CBSE Board Exams 2026",
    "targetDate": "2026-03-15",
    "dailyHours": 8,
    "weeklyHours": 52
  },
  "stats": { "currentStreak": 0, "totalStudyDays": 0, "completionRate": 0 },
  "schedule": [
    { "time": "06:00 AM", "task": "Morning Exercise", "subject": "Health", "duration": "30 min", "priority": "medium" }
  ],
  "weekly_plan": {
    "Monday": [{ "task": "Study Physics Theory", "subject": "Physics", "duration": "2 hours", "priority": "high" }],
    "Tuesday": [], "Wednesday": [], "Thursday": [], "Friday": [], "Saturday": [], "Sunday": []
  },
  "tasks": [
    { "id": "task_1", "title": "Complete NCERT Physics Chapter 1", "subject": "Physics", "priority": "high", "status": "pending", "dueDate": "YYYY-MM-DD", "description": "Read, make notes, solve exercises" }
  ],
  "habits": [
    { "id": "habit_1", "name": "Study 8 hours", "category": "study", "target": 7, "completedDates": [] },
    { "id": "habit_2", "name": "Revise daily", "category": "revision", "target": 7, "completedDates": [] }
  ],
  "goals": {
    "daily": [
      { "id": "gd_1", "text": "Read and note 1 Physics chapter", "priority": "high", "completed": false, "points": 15 },
      { "id": "gd_2", "text": "Solve 20 Math problems", "priority": "high", "completed": false, "points": 15 },
      { "id": "gd_3", "text": "Revise Chemistry reactions", "priority": "medium", "completed": false, "points": 10 },
      { "id": "gd_4", "text": "Practice English writing", "priority": "low", "completed": false, "points": 5 },
      { "id": "gd_5", "text": "Solve previous year questions", "priority": "medium", "completed": false, "points": 10 }
    ],
    "weekly": [
      { "id": "gw_1", "text": "Complete 2 chapters per subject", "priority": "high", "completed": false, "points": 50 },
      { "id": "gw_2", "text": "Write 3 practice papers", "priority": "medium", "completed": false, "points": 30 },
      { "id": "gw_3", "text": "Revise all formulas", "priority": "low", "completed": false, "points": 20 }
    ],
    "monthly": [
      { "id": "gm_1", "text": "Finish 25% of total syllabus", "priority": "high", "completed": false, "points": 100 },
      { "id": "gm_2", "text": "Score 80%+ in 2 practice tests", "priority": "high", "completed": false, "points": 80 },
      { "id": "gm_3", "text": "Complete all NCERT back exercises", "priority": "medium", "completed": false, "points": 60 }
    ]
  },
  "points": { "totalEarned": 0, "dailyTarget": 55, "weeklyTarget": 200, "monthlyTarget": 750 },
  "analytics": { "studyHoursTarget": 8, "productivityTarget": 85, "weeklyGoalTarget": 6 },
  "subjects": [
    { "name": "Physics", "chapters": 15, "completed": 0 },
    { "name": "Chemistry", "chapters": 16, "completed": 0 },
    { "name": "Mathematics", "chapters": 13, "completed": 0 },
    { "name": "English", "chapters": 10, "completed": 0 }
  ],
  "healthReminders": ["Drink water regularly", "Take breaks between study sessions", "Get 7-8 hours of sleep"],
  "breakBlocks": [{ "time": "10:00 AM", "duration": "15 min", "activity": "Short walk" }]
}

RULES: priority: "high"/"medium"/"low", each goal needs "points", 5-7 daily, 3-5 weekly, 3-4 monthly goals.

Return ONLY JSON.`,

    productivity: `You are an expert productivity strategist and life coach.

Generate ONLY valid JSON. No markdown. No explanation. No code blocks.

{
  "student": {
    "name": "User Name",
    "goal": "Become highly productive and achieve work-life balance",
    "exam": "Personal Development",
    "targetDate": "2026-12-31",
    "dailyHours": 8,
    "weeklyHours": 50
  },
  "stats": { "currentStreak": 0, "totalStudyDays": 0, "completionRate": 0 },
  "schedule": [
    { "time": "05:30 AM", "task": "Morning Routine & Meditation", "subject": "Health", "duration": "45 min", "priority": "high" }
  ],
  "weekly_plan": {
    "Monday": [{ "task": "Deep Work Session", "subject": "Work", "duration": "4 hours", "priority": "high" }],
    "Tuesday": [], "Wednesday": [], "Thursday": [], "Friday": [], "Saturday": [], "Sunday": []
  },
  "tasks": [
    { "id": "task_1", "title": "Complete project proposal", "subject": "Work", "priority": "high", "status": "pending", "dueDate": "YYYY-MM-DD", "description": "Draft and review proposal" }
  ],
  "habits": [
    { "id": "habit_1", "name": "Wake up at 5:30 AM", "category": "health", "target": 7, "completedDates": [] },
    { "id": "habit_2", "name": "Exercise 30 minutes", "category": "exercise", "target": 5, "completedDates": [] },
    { "id": "habit_3", "name": "Read 30 minutes", "category": "reading", "target": 7, "completedDates": [] }
  ],
  "goals": {
    "daily": [
      { "id": "gd_1", "text": "Complete 3 priority tasks", "priority": "high", "completed": false, "points": 20 },
      { "id": "gd_2", "text": "Exercise for 30 minutes", "priority": "medium", "completed": false, "points": 10 },
      { "id": "gd_3", "text": "Read 20 pages", "priority": "medium", "completed": false, "points": 10 },
      { "id": "gd_4", "text": "No social media before noon", "priority": "low", "completed": false, "points": 5 },
      { "id": "gd_5", "text": "Plan tomorrow's tasks", "priority": "low", "completed": false, "points": 5 }
    ],
    "weekly": [
      { "id": "gw_1", "text": "Complete all weekly projects", "priority": "high", "completed": false, "points": 50 },
      { "id": "gw_2", "text": "Review weekly progress", "priority": "medium", "completed": false, "points": 20 },
      { "id": "gw_3", "text": "Maintain exercise streak", "priority": "medium", "completed": false, "points": 30 }
    ],
    "monthly": [
      { "id": "gm_1", "text": "Achieve 80% habit consistency", "priority": "high", "completed": false, "points": 100 },
      { "id": "gm_2", "text": "Read 4 books this month", "priority": "medium", "completed": false, "points": 60 },
      { "id": "gm_3", "text": "Complete 1 major project", "priority": "high", "completed": false, "points": 80 }
    ]
  },
  "points": { "totalEarned": 0, "dailyTarget": 50, "weeklyTarget": 200, "monthlyTarget": 700 },
  "analytics": { "studyHoursTarget": 8, "productivityTarget": 85, "weeklyGoalTarget": 5 },
  "healthReminders": ["Stay hydrated", "Take regular breaks", "Practice mindfulness"],
  "breakBlocks": [{ "time": "10:00 AM", "duration": "10 min", "activity": "Stretch and breathe" }]
}

RULES: priority: "high"/"medium"/"low", each goal needs "points", 5-7 daily, 3-5 weekly, 3-4 monthly.

Return ONLY JSON.`,

    custom: `You are an expert planner generator.

Generate ONLY valid JSON. No markdown. No explanation. No code blocks.

{
  "student": {
    "name": "User Name",
    "goal": "User's primary goal",
    "exam": "Target milestone or exam",
    "targetDate": "YYYY-MM-DD",
    "dailyHours": 8,
    "weeklyHours": 50
  },
  "stats": { "currentStreak": 0, "totalStudyDays": 0, "completionRate": 0 },
  "schedule": [
    { "time": "06:00 AM", "task": "Morning Routine", "subject": "General", "duration": "1 hour", "priority": "medium" }
  ],
  "weekly_plan": {
    "Monday": [], "Tuesday": [], "Wednesday": [], "Thursday": [], "Friday": [], "Saturday": [], "Sunday": []
  },
  "tasks": [],
  "habits": [],
  "goals": {
    "daily": [
      { "id": "gd_1", "text": "Goal text", "priority": "high", "completed": false, "points": 10 }
    ],
    "weekly": [
      { "id": "gw_1", "text": "Goal text", "priority": "medium", "completed": false, "points": 30 }
    ],
    "monthly": [
      { "id": "gm_1", "text": "Goal text", "priority": "high", "completed": false, "points": 50 }
    ]
  },
  "points": { "totalEarned": 0, "dailyTarget": 50, "weeklyTarget": 200, "monthlyTarget": 700 },
  "analytics": { "studyHoursTarget": 8, "productivityTarget": 80, "weeklyGoalTarget": 5 },
  "healthReminders": [],
  "breakBlocks": []
}

RULES: priority: "high"/"medium"/"low", each goal needs "points" (5-100).

Return ONLY JSON with realistic sample data.`
  },

  currentPrompt: 'comeback',

  getPrompt(type) {
    return this.prompts[type || this.currentPrompt] || this.prompts.comeback;
  },

  setPrompt(type) {
    if (this.prompts[type]) {
      this.currentPrompt = type;
    }
  },

  copyPrompt(type) {
    const prompt = this.getPrompt(type);
    return navigator.clipboard.writeText(prompt).then(() => true).catch(() => false);
  },

  downloadPrompt(type) {
    const prompt = this.getPrompt(type);
    const blob = new Blob([prompt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `comeback-planner-prompt-${type || this.currentPrompt}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};
