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
      "priority": "medium"
    }
  ],
  "weekly_plan": {
    "Monday": [
      {
        "task": "Task name",
        "subject": "Subject name",
        "duration": "2 hours",
        "priority": "high"
      }
    ],
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
        "id": "goal_d1",
        "text": "Complete 3 chapters",
        "completed": false,
        "progress": 0
      }
    ],
    "weekly": [
      {
        "id": "goal_w1",
        "text": "Finish math syllabus",
        "completed": false,
        "progress": 0
      }
    ],
    "monthly": [
      {
        "id": "goal_m1",
        "text": "Complete full revision",
        "completed": false,
        "progress": 0
      }
    ]
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
    {
      "time": "10:00 AM",
      "duration": "15 min",
      "activity": "Stretch and walk"
    }
  ]
}

Return ONLY JSON. Make the schedule detailed with at least 12 time blocks. Include realistic subjects, tasks, and habits for a student preparing for exams.`,

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
  "stats": {
    "currentStreak": 0,
    "totalStudyDays": 0,
    "completionRate": 0
  },
  "schedule": [
    {
      "time": "05:30 AM",
      "task": "Wake up & Exercise",
      "subject": "Health",
      "duration": "45 min",
      "priority": "high"
    }
  ],
  "weekly_plan": {
    "Monday": [
      {
        "task": "Physics - Mechanics",
        "subject": "Physics",
        "duration": "3 hours",
        "priority": "high"
      }
    ],
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
      "title": "Complete Mechanics chapter",
      "subject": "Physics",
      "priority": "high",
      "status": "pending",
      "dueDate": "YYYY-MM-DD",
      "description": "Study HCV and solve PYQs"
    }
  ],
  "habits": [
    {
      "id": "habit_1",
      "name": "Study 10 hours",
      "category": "study",
      "target": 7,
      "completedDates": []
    },
    {
      "id": "habit_2",
      "name": "Solve 50 MCQs daily",
      "category": "study",
      "target": 7,
      "completedDates": []
    }
  ],
  "goals": {
    "daily": [
      {
        "id": "goal_d1",
        "text": "Complete Physics lecture notes",
        "completed": false,
        "progress": 0
      }
    ],
    "weekly": [
      {
        "id": "goal_w1",
        "text": "Finish Thermodynamics in all 3 subjects",
        "completed": false,
        "progress": 0
      }
    ],
    "monthly": [
      {
        "id": "goal_m1",
        "text": "Complete 30% of syllabus",
        "completed": false,
        "progress": 0
      }
    ]
  },
  "analytics": {
    "studyHoursTarget": 10,
    "productivityTarget": 90,
    "weeklyGoalTarget": 7
  },
  "subjects": [
    {
      "name": "Physics",
      "topics": ["Mechanics", "Thermodynamics", "Electromagnetism", "Optics", "Modern Physics"],
      "weightage": 33
    },
    {
      "name": "Chemistry",
      "topics": ["Physical Chemistry", "Organic Chemistry", "Inorganic Chemistry"],
      "weightage": 33
    },
    {
      "name": "Mathematics",
      "topics": ["Calculus", "Algebra", "Coordinate Geometry", "Trigonometry", "Vectors"],
      "weightage": 34
    }
  ],
  "healthReminders": [
    "Drink 3 liters of water",
    "Eye exercises every hour",
    "Sleep by 11 PM"
  ],
  "breakBlocks": [
    {
      "time": "09:30 AM",
      "duration": "15 min",
      "activity": "Quick walk and stretch"
    }
  ]
}

Return ONLY JSON. Make it detailed and realistic for a JEE aspirant.`,

    board: `You are an expert board exam preparation strategist and academic planner.

Generate ONLY valid JSON.
Do not use markdown.
Do not explain.
Do not wrap inside code blocks.

Generate a comprehensive board exam planner with the following structure:

{
  "student": {
    "name": "Student Name",
    "goal": "Score 95%+ in Board Exams",
    "exam": "CBSE Board Exams 2026",
    "targetDate": "2026-03-15",
    "dailyHours": 8,
    "weeklyHours": 52
  },
  "stats": {
    "currentStreak": 0,
    "totalStudyDays": 0,
    "completionRate": 0
  },
  "schedule": [
    {
      "time": "06:00 AM",
      "task": "Morning Exercise",
      "subject": "Health",
      "duration": "30 min",
      "priority": "medium"
    }
  ],
  "weekly_plan": {
    "Monday": [
      {
        "task": "Study Physics Theory",
        "subject": "Physics",
        "duration": "2 hours",
        "priority": "high"
      }
    ],
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
      "title": "Complete NCERT Physics Chapter 1",
      "subject": "Physics",
      "priority": "high",
      "status": "pending",
      "dueDate": "YYYY-MM-DD",
      "description": "Read, make notes, solve exercises"
    }
  ],
  "habits": [
    {
      "id": "habit_1",
      "name": "Study 8 hours",
      "category": "study",
      "target": 7,
      "completedDates": []
    },
    {
      "id": "habit_2",
      "name": "Revise daily",
      "category": "revision",
      "target": 7,
      "completedDates": []
    }
  ],
  "goals": {
    "daily": [
      {
        "id": "goal_d1",
        "text": "Read and note 1 chapter",
        "completed": false,
        "progress": 0
      }
    ],
    "weekly": [
      {
        "id": "goal_w1",
        "text": "Complete 2 chapters per subject",
        "completed": false,
        "progress": 0
      }
    ],
    "monthly": [
      {
        "id": "goal_m1",
        "text": "Finish 25% of syllabus",
        "completed": false,
        "progress": 0
      }
    ]
  },
  "analytics": {
    "studyHoursTarget": 8,
    "productivityTarget": 85,
    "weeklyGoalTarget": 6
  },
  "subjects": [
    {
      "name": "Physics",
      "chapters": 15,
      "completed": 0
    },
    {
      "name": "Chemistry",
      "chapters": 16,
      "completed": 0
    },
    {
      "name": "Mathematics",
      "chapters": 13,
      "completed": 0
    },
    {
      "name": "English",
      "chapters": 10,
      "completed": 0
    }
  ],
  "healthReminders": [
    "Drink water regularly",
    "Take breaks between study sessions",
    "Get 7-8 hours of sleep"
  ],
  "breakBlocks": [
    {
      "time": "10:00 AM",
      "duration": "15 min",
      "activity": "Short walk"
    }
  ]
}

Return ONLY JSON. Make it detailed and realistic for a board exam student.`,

    productivity: `You are an expert productivity strategist and life coach.

Generate ONLY valid JSON.
Do not use markdown.
Do not explain.
Do not wrap inside code blocks.

Generate a comprehensive productivity planner with the following structure:

{
  "student": {
    "name": "User Name",
    "goal": "Become highly productive and achieve work-life balance",
    "exam": "Personal Development",
    "targetDate": "2026-12-31",
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
      "time": "05:30 AM",
      "task": "Morning Routine & Meditation",
      "subject": "Health",
      "duration": "45 min",
      "priority": "high"
    }
  ],
  "weekly_plan": {
    "Monday": [
      {
        "task": "Deep Work Session",
        "subject": "Work",
        "duration": "4 hours",
        "priority": "high"
      }
    ],
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
      "title": "Complete project proposal",
      "subject": "Work",
      "priority": "high",
      "status": "pending",
      "dueDate": "YYYY-MM-DD",
      "description": "Draft and review proposal"
    }
  ],
  "habits": [
    {
      "id": "habit_1",
      "name": "Wake up at 5:30 AM",
      "category": "health",
      "target": 7,
      "completedDates": []
    },
    {
      "id": "habit_2",
      "name": "Exercise 30 minutes",
      "category": "exercise",
      "target": 5,
      "completedDates": []
    },
    {
      "id": "habit_3",
      "name": "Read 30 minutes",
      "category": "reading",
      "target": 7,
      "completedDates": []
    }
  ],
  "goals": {
    "daily": [
      {
        "id": "goal_d1",
        "text": "Complete 3 priority tasks",
        "completed": false,
        "progress": 0
      }
    ],
    "weekly": [
      {
        "id": "goal_w1",
        "text": "Review weekly progress",
        "completed": false,
        "progress": 0
      }
    ],
    "monthly": [
      {
        "id": "goal_m1",
        "text": "Achieve 80% habit consistency",
        "completed": false,
        "progress": 0
      }
    ]
  },
  "analytics": {
    "studyHoursTarget": 8,
    "productivityTarget": 85,
    "weeklyGoalTarget": 5
  },
  "healthReminders": [
    "Stay hydrated",
    "Take regular breaks",
    "Practice mindfulness"
  ],
  "breakBlocks": [
    {
      "time": "10:00 AM",
      "duration": "10 min",
      "activity": "Stretch and breathe"
    }
  ]
}

Return ONLY JSON. Make it detailed and realistic for personal productivity.`,

    custom: `You are an expert planner generator.

Generate ONLY valid JSON.
Do not use markdown.
Do not explain.
Do not wrap inside code blocks.

Generate a customizable planner with the following structure:

{
  "student": {
    "name": "User Name",
    "goal": "User's primary goal",
    "exam": "Target milestone or exam",
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
      "task": "Morning Routine",
      "subject": "General",
      "duration": "1 hour",
      "priority": "medium"
    }
  ],
  "weekly_plan": {
    "Monday": [],
    "Tuesday": [],
    "Wednesday": [],
    "Thursday": [],
    "Friday": [],
    "Saturday": [],
    "Sunday": []
  },
  "tasks": [],
  "habits": [],
  "goals": {
    "daily": [],
    "weekly": [],
    "monthly": []
  },
  "analytics": {
    "studyHoursTarget": 8,
    "productivityTarget": 80,
    "weeklyGoalTarget": 5
  },
  "healthReminders": [],
  "breakBlocks": []
}

Return ONLY JSON with realistic sample data based on common use cases.`
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
