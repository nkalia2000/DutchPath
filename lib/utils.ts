import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatXP(xp: number): string {
  if (xp >= 1000) return `${(xp / 1000).toFixed(1)}k`;
  return xp.toString();
}

export function getStreakColor(days: number): string {
  if (days >= 30) return "#FFD700"; // gold
  if (days >= 7) return "#DC2626";  // red
  return "#FF6B00";                  // orange
}

export function getStreakEmoji(days: number): string {
  if (days >= 30) return "🔥";
  if (days >= 7) return "🔥";
  return "🔥";
}

export function getLessonTypeColor(type: string): string {
  switch (type) {
    case "reading": return "bg-blue-500";
    case "vocabulary": return "bg-green-500";
    case "grammar": return "bg-amber-500";
    case "listening": return "bg-purple-500";
    default: return "bg-gray-500";
  }
}

export function getLessonTypeBorder(type: string): string {
  switch (type) {
    case "reading": return "border-blue-500";
    case "vocabulary": return "border-green-500";
    case "grammar": return "border-amber-500";
    case "listening": return "border-purple-500";
    default: return "border-gray-500";
  }
}

export function getStarRating(score: number): number {
  if (score >= 90) return 3;
  if (score >= 70) return 2;
  if (score >= 50) return 1;
  return 0;
}

export function getDaysUntilExam(examDate: string | null): number | null {
  if (!examDate) return null;
  const today = new Date();
  const exam = new Date(examDate);
  const diff = Math.ceil((exam.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}

export function getAmsterdamDate(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Amsterdam" });
}

export function getAmsterdamHour(): number {
  return parseInt(
    new Date().toLocaleTimeString("en-US", {
      timeZone: "Europe/Amsterdam",
      hour: "numeric",
      hour12: false,
    })
  );
}

export function calculateNextReview(rating: "hard" | "ok" | "easy", currentStreak: number): Date {
  const now = new Date();
  let days = 1;
  if (rating === "ok") days = 3;
  if (rating === "easy") days = currentStreak >= 2 ? 30 : 7;
  now.setDate(now.getDate() + days);
  return now;
}

export function getInitials(username: string | null): string {
  if (!username) return "?";
  return username
    .split(/[\s_-]/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

