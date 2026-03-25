"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, User, ChevronRight, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAppStore } from "@/lib/store";

const STEPS = [
  { id: 1, title: "What's your name?", subtitle: "Pick a username for your profile" },
  { id: 2, title: "When is your exam?", subtitle: "We'll count down the days for you" },
  { id: 3, title: "Daily learning goal", subtitle: "How many minutes per day can you study?" },
];

const GOALS = [
  { minutes: 10, label: "Casual", desc: "10 min/day", emoji: "🌱" },
  { minutes: 20, label: "Regular", desc: "20 min/day", emoji: "⚡" },
  { minutes: 30, label: "Intensive", desc: "30 min/day", emoji: "🔥" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const setProfile = useAppStore((s) => s.setProfile);
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [examDate, setExamDate] = useState("");
  const [goalMinutes, setGoalMinutes] = useState(20);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const progress = ((step - 1) / STEPS.length) * 100;

  const handleNext = async () => {
    setError("");
    if (step === 1) {
      if (!username.trim() || username.length < 3) { setError("Username must be at least 3 characters."); return; }
      if (!/^[a-zA-Z0-9_]+$/.test(username)) { setError("Only letters, numbers and underscores allowed."); return; }
      // Check uniqueness
      const supabase = createClient();
      const { data } = await supabase.from("profiles").select("id").eq("username", username).single();
      if (data) { setError("Username already taken."); return; }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else {
      // Save profile
      setLoading(true);
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: profile, error: err } = await (supabase as any)
        .from("profiles")
        .update({
          username,
          exam_target_date: examDate || null,
          daily_goal_minutes: goalMinutes,
        })
        .eq("id", user.id)
        .select()
        .single();

      if (err) { setError(err.message); setLoading(false); return; }

      // Initialize first lesson as available
      const { data: firstLesson } = await supabase
        .from("lessons")
        .select("id")
        .eq("day", 1)
        .single();

      if (firstLesson) {
        const firstLessonId = (firstLesson as unknown as { id: number }).id;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from("user_lesson_progress") as any).upsert({
          user_id: user.id,
          lesson_id: firstLessonId,
          status: "available",
        });
      }

      if (profile) setProfile(profile);
      router.push("/dashboard");
    }
  };

  const stepVariants = {
    enter: { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] px-4">
      {/* Progress bar */}
      <div className="w-full max-w-sm mb-8">
        <div className="flex justify-between text-xs text-[var(--muted)] mb-2">
          <span>Step {step} of {STEPS.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-[var(--border)] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      <div className="w-full max-w-sm bg-[var(--card-bg)] rounded-2xl shadow-lg border border-[var(--border)] p-6 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25 }}
          >
            <div className="mb-6">
              <div className="text-3xl mb-3" aria-hidden="true">
                {step === 1 ? "👋" : step === 2 ? "📅" : "🎯"}
              </div>
              <h2 className="text-xl font-bold">{STEPS[step - 1].title}</h2>
              <p className="text-[var(--muted)] text-sm mt-1">{STEPS[step - 1].subtitle}</p>
            </div>

            {/* Step 1: Username */}
            {step === 1 && (
              <div className="space-y-3">
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" aria-hidden="true" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. dutchlearner_2026"
                    autoFocus
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    onKeyDown={(e) => e.key === "Enter" && handleNext()}
                    aria-label="Choose a username"
                  />
                </div>
                <p className="text-xs text-[var(--muted)]">3–20 characters. Letters, numbers, underscores only.</p>
              </div>
            )}

            {/* Step 2: Exam date */}
            {step === 2 && (
              <div className="space-y-3">
                <div className="relative">
                  <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" aria-hidden="true" />
                  <input
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    aria-label="Set your exam date"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => { setExamDate(""); setStep(3); }}
                  className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] underline"
                >
                  I don&apos;t have a date yet
                </button>
              </div>
            )}

            {/* Step 3: Daily goal */}
            {step === 3 && (
              <div className="space-y-3">
                {GOALS.map(({ minutes, label, desc, emoji }) => (
                  <button
                    key={minutes}
                    type="button"
                    onClick={() => setGoalMinutes(minutes)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all tap-target ${
                      goalMinutes === minutes
                        ? "border-primary bg-primary/5 dark:bg-primary/10"
                        : "border-[var(--border)] hover:border-[var(--muted)]"
                    }`}
                    aria-pressed={goalMinutes === minutes}
                  >
                    <span className="text-2xl" aria-hidden="true">{emoji}</span>
                    <div className="text-left">
                      <p className="font-semibold text-sm">{label}</p>
                      <p className="text-xs text-[var(--muted)]">{desc}</p>
                    </div>
                    {goalMinutes === minutes && (
                      <div className="ml-auto w-5 h-5 rounded-full bg-primary flex items-center justify-center" aria-hidden="true">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                role="alert"
                className="text-danger text-sm bg-danger/10 rounded-lg px-3 py-2 mt-3"
              >
                {error}
              </motion.p>
            )}
          </motion.div>
        </AnimatePresence>

        <button
          onClick={handleNext}
          disabled={loading}
          className="mt-6 w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-xl transition-colors tap-target disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin" aria-hidden="true" />
          ) : (
            <>
              {step === 3 ? "Start learning!" : "Continue"}
              <ChevronRight size={18} aria-hidden="true" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
