"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { createClient } from "@/lib/supabase/client";

export function Providers({ children }: { children: React.ReactNode }) {
  const setProfile = useAppStore((s) => s.setProfile);
  const setUnlockedHearts = useAppStore((s) => s.setUnlockedHearts);

  useEffect(() => {
    const supabase = createClient();

    const fetchProfile = async (userId: string) => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      if (data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const profile = data as any;
        setProfile(profile);
        // Unlock unlimited hearts at 30+ day streak
        if (profile.streak_days >= 30) setUnlockedHearts(true);
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) fetchProfile(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) fetchProfile(session.user.id);
        else setProfile(null);
      }
    );

    return () => subscription.unsubscribe();
  }, [setProfile, setUnlockedHearts]);

  return <>{children}</>;
}
