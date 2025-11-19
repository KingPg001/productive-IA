
export enum TaskPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export enum TaskCategory {
  STUDY = 'Study',
  EXERCISE = 'Exercise',
  OTHER = 'Other'
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string; // ISO string
  priority: TaskPriority;
  category: TaskCategory;
  tags: string[]; // New field for custom tags
  completed: boolean;
  completedAt?: string; // ISO string
  points: number;
  isAiScored: boolean;
}

export interface UserStats {
  totalPoints: number;
  level: number;
  tasksCompleted: number;
  currentStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  completionRate: number;
}

export interface DailyPerformance {
  date: string;
  pointsEarned: number;
  tasksCompleted: number;
}
