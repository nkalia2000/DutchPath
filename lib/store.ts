import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Profile } from "./supabase/types";

interface Toast {
  id: string;
  type: "achievement" | "xp" | "error" | "success";
  title: string;
  message?: string;
  icon?: string;
  xp?: number;
}

interface AppState {
  profile: Profile | null;
  toasts: Toast[];
  hearts: number;
  maxHearts: number;
  unlockedHearts: boolean;

  setProfile: (profile: Profile | null) => void;
  updateXP: (amount: number) => void;
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
  setHearts: (hearts: number) => void;
  loseHeart: () => void;
  refillHearts: () => void;
  setUnlockedHearts: (unlocked: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      profile: null,
      toasts: [],
      hearts: 5,
      maxHearts: 5,
      unlockedHearts: false,

      setProfile: (profile) => set({ profile }),

      updateXP: (amount) =>
        set((state) => ({
          profile: state.profile
            ? { ...state.profile, xp_total: state.profile.xp_total + amount }
            : null,
        })),

      addToast: (toast) => {
        const id = Math.random().toString(36).slice(2);
        set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
        setTimeout(() => get().removeToast(id), 5000);
      },

      removeToast: (id) =>
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),

      setHearts: (hearts) => set({ hearts }),

      loseHeart: () =>
        set((state) => ({
          hearts: state.unlockedHearts ? state.hearts : Math.max(0, state.hearts - 1),
        })),

      refillHearts: () => set({ hearts: 5 }),

      setUnlockedHearts: (unlocked) => set({ unlockedHearts: unlocked }),
    }),
    {
      name: "dutchpath-store",
      partialize: (state) => ({
        hearts: state.hearts,
        unlockedHearts: state.unlockedHearts,
      }),
    }
  )
);
