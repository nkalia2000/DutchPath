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
