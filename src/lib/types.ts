// Project types
export interface Project {
  id: string;
  title: string;
  goal: string; // Goal in words
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

// Session types
export interface WritingSession {
  id: string;
  projectId: string;
  date: Date;
  wordsWritten: number;
  notes?: string;
  createdAt: Date;
  userId: string;
}

// User types
export interface User {
  id: string;
  email: string;
  name?: string;
  photoURL?: string;
}

// Dashboard data
export interface DashboardData {
  totalWords: number;
  totalSessions: number;
  projectsCount: number;
  recentSessions: WritingSession[];
  progressOverTime: { date: string; words: number }[];
}
