export interface EmotionOption {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export interface TriggerOption {
  id: string;
  label: string;
  icon: string;
}

export interface QuadrantItem {
  id: string;
  label: string;
}

export interface CopingStrategy {
  id: number;
  title: string;
  description: string;
  category: string;
  icon?: string;
}

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  hasEntry: boolean;
  isSelected: boolean;
}

export interface RecentEntry {
  id: number;
  date: Date;
  emotion: string;
  anxietyLevel: number;
  trigger: string;
  description: string;
}
