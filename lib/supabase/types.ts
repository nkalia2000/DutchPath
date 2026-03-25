export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

// Row types
export type Profile = {
  id: string;
  username: string | null;
  avatar_url: string | null;
  current_level: "A2" | "B1" | "B2";
  xp_total: number;
  streak_days: number;
  streak_last_date: string | null;
  daily_goal_minutes: number;
  exam_target_date: string | null;
  streak_freeze_available: boolean;
  leaderboard_opt_in: boolean;
  role: "user" | "admin";
  created_at: string;
};

export type Lesson = {
  id: number;
  level: string;
  week: number;
  day: number;
  type: "reading" | "vocabulary" | "grammar" | "listening";
  title: string;
  source_label: string | null;
  content: Json;
  xp_reward: number;
  estimated_minutes: number;
  unlock_after_lesson_id: number | null;
};

export type UserLessonProgress = {
  user_id: string;
  lesson_id: number;
  status: "locked" | "available" | "in_progress" | "completed";
  score: number | null;
  attempts: number;
  time_spent_seconds: number;
  completed_at: string | null;
  last_attempt_at: string | null;
};

export type VocabCard = {
  id: number;
  level: string;
  category: "forms" | "everyday" | "time" | "people";
  dutch: string;
  english: string;
  example_sentence_nl: string | null;
  example_sentence_en: string | null;
  difficulty: number;
};

export type UserVocab = {
  user_id: string;
  card_id: number;
  status: "new" | "learning" | "reviewing" | "mastered";
  next_review_at: string;
  correct_count: number;
  incorrect_count: number;
  streak: number;
};

export type DailyActivity = {
  user_id: string;
  date: string;
  xp_earned: number;
  minutes_spent: number;
  lessons_completed: number;
  words_reviewed: number;
};

export type Achievement = {
  id: number;
  key: string;
  title: string;
  description: string;
  icon: string;
  xp_reward: number;
  condition_json: Json;
};

export type UserAchievement = {
  user_id: string;
  achievement_id: number;
  unlocked_at: string;
};

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: { id: string; username?: string | null; avatar_url?: string | null; current_level?: string; xp_total?: number; streak_days?: number; streak_last_date?: string | null; daily_goal_minutes?: number; exam_target_date?: string | null; streak_freeze_available?: boolean; leaderboard_opt_in?: boolean; role?: string; created_at?: string };
        Update: { id?: string; username?: string | null; avatar_url?: string | null; current_level?: string; xp_total?: number; streak_days?: number; streak_last_date?: string | null; daily_goal_minutes?: number; exam_target_date?: string | null; streak_freeze_available?: boolean; leaderboard_opt_in?: boolean; role?: string; created_at?: string };
      };
      lessons: {
        Row: Lesson;
        Insert: { level: string; week: number; day: number; type: string; title: string; source_label?: string | null; content?: Json; xp_reward?: number; estimated_minutes?: number; unlock_after_lesson_id?: number | null };
        Update: { id?: number; level?: string; week?: number; day?: number; type?: string; title?: string; source_label?: string | null; content?: Json; xp_reward?: number; estimated_minutes?: number; unlock_after_lesson_id?: number | null };
      };
      user_lesson_progress: {
        Row: UserLessonProgress;
        Insert: { user_id: string; lesson_id: number; status?: string; score?: number | null; attempts?: number; time_spent_seconds?: number; completed_at?: string | null; last_attempt_at?: string | null };
        Update: { user_id?: string; lesson_id?: number; status?: string; score?: number | null; attempts?: number; time_spent_seconds?: number; completed_at?: string | null; last_attempt_at?: string | null };
      };
      vocabulary_cards: {
        Row: VocabCard;
        Insert: { level: string; category: string; dutch: string; english: string; example_sentence_nl?: string | null; example_sentence_en?: string | null; difficulty?: number };
        Update: { id?: number; level?: string; category?: string; dutch?: string; english?: string; example_sentence_nl?: string | null; example_sentence_en?: string | null; difficulty?: number };
      };
      user_vocabulary: {
        Row: UserVocab;
        Insert: { user_id: string; card_id: number; status?: string; next_review_at?: string; correct_count?: number; incorrect_count?: number; streak?: number };
        Update: { user_id?: string; card_id?: number; status?: string; next_review_at?: string; correct_count?: number; incorrect_count?: number; streak?: number };
      };
      daily_activity: {
        Row: DailyActivity;
        Insert: { user_id: string; date: string; xp_earned?: number; minutes_spent?: number; lessons_completed?: number; words_reviewed?: number };
        Update: { user_id?: string; date?: string; xp_earned?: number; minutes_spent?: number; lessons_completed?: number; words_reviewed?: number };
      };
      achievements: {
        Row: Achievement;
        Insert: { key: string; title: string; description: string; icon: string; xp_reward?: number; condition_json?: Json };
        Update: { id?: number; key?: string; title?: string; description?: string; icon?: string; xp_reward?: number; condition_json?: Json };
      };
      user_achievements: {
        Row: UserAchievement;
        Insert: { user_id: string; achievement_id: number; unlocked_at?: string };
        Update: { user_id?: string; achievement_id?: number; unlocked_at?: string };
      };
    };
  };
}

export type LessonContent = {
  passage: { text: string; source_label: string };
  questions: Question[];
  vocabulary_ids: number[];
};

export type Question =
  | MultipleChoiceQuestion
  | TrueFalseQuestion
  | FillBlankQuestion
  | VocabMatchQuestion
  | ReadingCompQuestion;

export type MultipleChoiceQuestion = {
  type: "multiple_choice";
  prompt: string;
  options: string[];
  correct_index: number;
  explanation: string;
  highlighted_word?: string;
};

export type TrueFalseQuestion = {
  type: "true_false";
  prompt: string;
  correct_answer: boolean;
  explanation: string;
  highlighted_word?: string;
};

export type FillBlankQuestion = {
  type: "fill_blank";
  prompt: string;
  word_bank: string[];
  correct_words: string[];
  explanation: string;
  highlighted_word?: string;
};

export type VocabMatchQuestion = {
  type: "vocab_match";
  prompt: string;
  pairs: { dutch: string; english: string }[];
  explanation: string;
};

export type ReadingCompQuestion = {
  type: "reading_comp";
  prompt: string;
  options: string[];
  correct_index: number;
  explanation: string;
};
