import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, startOfWeek, addDays, startOfMonth, endOfMonth, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import { CalendarDay, EmotionOption, TriggerOption, CopingStrategy } from "./types";

// Utility for combining Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format a date to display in the UI
export function formatDate(date: Date, formatString = "MMMM d, yyyy"): string {
  return format(date, formatString);
}

// Get an array of calendar days for a month view
export function getCalendarDays(
  currentDate: Date,
  entries: { date: Date }[] = []
): CalendarDay[] {
  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);
  const startDate = startOfWeek(firstDayOfMonth);
  
  const days: CalendarDay[] = [];
  let day = startDate;
  
  // Generate 42 days (6 weeks) to ensure we always have enough rows
  for (let i = 0; i < 42; i++) {
    const hasEntry = entries.some(entry => 
      isSameDay(new Date(entry.date), day)
    );
    
    days.push({
      date: day,
      isCurrentMonth: isSameMonth(day, currentDate),
      isToday: isSameDay(day, new Date()),
      hasEntry,
      isSelected: isSameDay(day, currentDate)
    });
    
    day = addDays(day, 1);
    
    // Break if we've gone past the end of the month and completed the week
    if (!isSameMonth(day, firstDayOfMonth) && day.getDay() === 0 && i > 27) {
      break;
    }
  }
  
  return days;
}

// Get the next month
export function getNextMonth(date: Date): Date {
  return addMonths(date, 1);
}

// Get the previous month
export function getPrevMonth(date: Date): Date {
  return subMonths(date, 1);
}

// Map an anxiety level (1-10) to a text description
export function getAnxietyLevelText(level: number): string {
  if (level <= 3) return "Low Stress";
  if (level <= 6) return "Moderate Anxiety";
  return "High Anxiety";
}

// Get a color based on anxiety level
export function getAnxietyLevelColor(level: number): string {
  if (level <= 3) return "bg-success";
  if (level <= 6) return "bg-primary-light";
  if (level <= 8) return "bg-secondary";
  return "bg-destructive";
}

// Calculate the width percentage for a slider
export function getAnxietyLevelWidth(level: number): string {
  return `${(level / 10) * 100}%`;
}

// Emotion options for the selector
export const emotions: EmotionOption[] = [
  {
    id: "calm",
    label: "Calm",
    icon: "M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    color: "bg-primary-light/20 hover:bg-primary-light/30 text-primary"
  },
  {
    id: "happy",
    label: "Happy",
    icon: "M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    color: "bg-success-light/20 hover:bg-success-light/30 text-success"
  },
  {
    id: "anxious",
    label: "Anxious",
    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    color: "bg-primary/20 hover:bg-primary/30 text-primary"
  },
  {
    id: "sad",
    label: "Sad",
    icon: "M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    color: "bg-secondary-light/20 hover:bg-secondary-light/30 text-secondary"
  },
  {
    id: "angry",
    label: "Angry",
    icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
    color: "bg-neutral-200 hover:bg-neutral-300 text-neutral-600"
  }
];

// Trigger options
export const triggers: TriggerOption[] = [
  {
    id: "home",
    label: "Home",
    icon: "🏠"
  },
  {
    id: "school",
    label: "School",
    icon: "🏫"
  },
  {
    id: "work",
    label: "Work",
    icon: "💼"
  },
  {
    id: "social",
    label: "Social",
    icon: "👥"
  }
];

// Coping strategies with SVG data
export const copingStrategies: CopingStrategy[] = [
  {
    id: 1,
    title: "Deep Breathing",
    description: "Practice 4-7-8 breathing: inhale for 4, hold for 7, exhale for 8.",
    category: "relaxation",
    icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" // clock icon
  },
  {
    id: 2,
    title: "Mindfulness",
    description: "Focus on the present moment without judgment.",
    category: "mindfulness",
    icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" // checkmark in circle
  },
  {
    id: 3,
    title: "Progressive Relaxation",
    description: "Tense and then release each muscle group.",
    category: "relaxation",
    icon: "M5 13l4 4L19 7" // checkmark
  },
  {
    id: 4,
    title: "Positive Self-Talk",
    description: "Replace negative thoughts with positive affirmations.",
    category: "cognitive",
    icon: "M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" // chat bubble
  },
  {
    id: 5,
    title: "Physical Exercise",
    description: "Even a short walk can reduce anxiety.",
    category: "physical",
    icon: "M13 10V3L4 14h7v7l9-11h-7z" // lightning bolt
  },
  {
    id: 6,
    title: "Journaling",
    description: "Write down your thoughts and feelings.",
    category: "cognitive",
    icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" // pencil
  }
];

// Mind quadrant options
export const mindItems = [
  { id: "racing-thoughts", label: "Racing thoughts" },
  { id: "overthinking", label: "Overthinking" },
  { id: "difficulty-concentrating", label: "Difficulty concentrating" },
  { id: "memory-issues", label: "Memory issues" },
  { id: "negative-thought-patterns", label: "Negative thought patterns" }
];

// Body quadrant options
export const bodyItems = [
  { id: "rapid-heartbeat", label: "Rapid heartbeat" },
  { id: "trouble-sleeping", label: "Trouble sleeping" },
  { id: "muscle-tension", label: "Muscle tension" },
  { id: "headaches", label: "Headaches" },
  { id: "stomach-issues", label: "Stomach issues" }
];

// Emotion quadrant options
export const emotionItems = [
  { id: "overwhelmed", label: "Overwhelmed" },
  { id: "irritable", label: "Irritable" },
  { id: "fearful", label: "Fearful" },
  { id: "sad", label: "Sad" },
  { id: "worried", label: "Worried" }
];

// Behavior quadrant options
export const behaviorItems = [
  { id: "avoiding-situations", label: "Avoiding situations" },
  { id: "procrastination", label: "Procrastination" },
  { id: "restlessness", label: "Restlessness" },
  { id: "increased-irritability", label: "Increased irritability" },
  { id: "social-withdrawal", label: "Social withdrawal" }
];