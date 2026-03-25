import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardClient } from "./dashboard-client";
import { getAmsterdamDate } from "@/lib/utils";
import type { DailyActivity } from "@/lib/supabase/types";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const today = getAmsterdamDate();
  const twelveWeeksAgo = new Date();
  twelveWeeksAgo.setDate(twelveWeeksAgo.getDate() - 84);
  const twelveWeeksAgoStr = twelveWeeksAgo.toISOString().split("T")[0];

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();

  const { data: activityRaw } = await supabase
    .from("daily_activity")
    .select("*")
    .eq("user_id", user.id)
    .gte("date", twelveWeeksAgoStr)
    .order("date", { ascending: true });

  const activity: DailyActivity[] = activityRaw ?? [];

  const { data: nextLessonRow } = await supabase
    .from("user_lesson_progress")
    .select("lesson_id, lessons(id, title, type, week, day, xp_reward, estimated_minutes)")
    .eq("user_id", user.id)
    .eq("status", "available")
    .order("lesson_id", { ascending: true })
    .limit(1)
    .single();

  const { count: vocabDueCount } = await supabase
    .from("user_vocabulary")
    .select("card_id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .lte("next_review_at", new Date().toISOString());

  const { count: completedLessonsCount } = await supabase
    .from("user_lesson_progress")
    .select("lesson_id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "completed");

  const { count: masteredVocabCount } = await supabase
    .from("user_vocabulary")
    .select("card_id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "mastered");

  const todayActivity = activity.find((a) => a.date === today);

  return (
    <DashboardClient
      profile={profile}
      activity={activity}
      nextLesson={(nextLessonRow as any)?.lessons ?? null}
      vocabDueCount={vocabDueCount ?? 0}
      completedLessonsCount={completedLessonsCount ?? 0}
      masteredVocabCount={masteredVocabCount ?? 0}
      todayXP={todayActivity?.xp_earned ?? 0}
    />
  );
}
