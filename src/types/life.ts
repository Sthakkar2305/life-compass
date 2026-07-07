export type Language = "english" | "hindi" | "gujarati";
export type ThemeMode = "light" | "dark" | "system";
export type Mood = "happy" | "calm" | "sad" | "angry" | "love" | "tired";
export type WritingTool = "pen" | "pencil" | "marker" | "eraser";
export type HabitCategory =
  | "Health"
  | "Mind"
  | "Career"
  | "Money"
  | "Spiritual"
  | "Fitness"
  | "Relationship"
  | "Learning"
  | "Productivity"
  | "Morning Routine"
  | "Night Routine";
export type NegativeStatus = "Need Attention" | "Improving" | "Completed";
export type TaskPriority = "High" | "Medium" | "Low";
export type TaskCategory = "Personal" | "Study" | "Work" | "Health" | "Fitness" | "Shopping" | "Family";

export type DiaryPage = {
  id: string;
  title: string;
  dateKey: string;
  createdAt: string;
  updatedAt: string;
  content: string;
  mood: Mood;
  favorite: boolean;
  canvasDataUrl?: string;
  tags: string[];
};

export type Habit = {
  id: string;
  name: string;
  category: HabitCategory;
  color: string;
  icon: string;
  targetPerWeek: number;
  createdAt: string;
  completions: Record<string, boolean>;
  archived: boolean;
};

export type NegativePoint = {
  id: string;
  title: string;
  category: string;
  severity: number;
  status: NegativeStatus;
  progress: number;
  notes: string;
  reflection: string;
  createdAt: string;
  updatedAt: string;
};

export type MotivationFavorite = {
  id: string;
  dateKey: string;
  language: Language;
  tab: string;
  title: string;
  body: string;
  createdAt: string;
};

export type TodoTask = {
  id: string;
  title: string;
  category: TaskCategory;
  priority: TaskPriority;
  dueDate: string;
  completed: boolean;
  carryForward: boolean;
  createdAt: string;
  completedAt?: string;
};

export type AppSettings = {
  themeMode: ThemeMode;
  themeColor: string;
  language: Language;
  notifications: boolean;
  reminderSound: boolean;
  font: "modern" | "serif" | "notebook";
  soundsEnabled: boolean;
  diaryPinHash?: string;
};

export type NaamJapCount = {
  deity: string;
  count: number;
  lastUpdated: string;
};

export type NameWriteCount = {
  name: string;
  count: number;
  lastUpdated: string;
};

export type LifeData = {
  version: 1;
  diaryPages: DiaryPage[];
  habits: Habit[];
  negativePoints: NegativePoint[];
  motivationFavorites: MotivationFavorite[];
  tasks: TodoTask[];
  naamJapCounts: NaamJapCount[];
  nameWriteCounts: NameWriteCount[];
  settings: AppSettings;
};
