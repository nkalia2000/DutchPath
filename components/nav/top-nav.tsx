"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Flame, LogOut } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { createClient } from "@/lib/supabase/client";
import { getStreakColor, formatXP, cn } from "@/lib/utils";
import { DarkModeToggle } from "@/components/ui/dark-mode-toggle";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/lessons", label: "Lessons" },
  { href: "/vocabulary", label: "Vocabulary" },
  { href: "/reading", label: "Reading" },
  { href: "/profile", label: "Profile" },
];

export function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const profile = useAppStore((s) => s.profile);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const flameColor = getStreakColor(profile?.streak_days ?? 0);

  return (
    <header className="hidden md:flex sticky top-0 z-40 h-14 border-b border-[var(--border)] bg-[var(--card-bg)]/90 backdrop-blur items-center px-6 gap-6">
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg text-primary dark:text-blue-400 shrink-0">
        <span className="text-xl" aria-hidden="true">🇳🇱</span>
        DutchPath
      </Link>

      {/* Nav links */}
      <nav className="flex items-center gap-1 flex-1" aria-label="Main navigation">
        {NAV_LINKS.map(({ href, label }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary dark:text-blue-400"
                  : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--border)]"
              )}
              aria-current={active ? "page" : undefined}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Right side stats */}
      {profile && (
        <div className="flex items-center gap-4 shrink-0">
          {/* Streak */}
          <div className="flex items-center gap-1" aria-label={`${profile.streak_days} day streak`}>
            <Flame size={18} style={{ color: flameColor }} aria-hidden="true" />
            <span className="text-sm font-semibold">{profile.streak_days}</span>
          </div>
          {/* XP */}
          <div className="flex items-center gap-1" aria-label={`${profile.xp_total} total XP`}>
            <span className="text-yellow-500 font-bold text-sm">⚡</span>
            <span className="text-sm font-semibold">{formatXP(profile.xp_total)}</span>
          </div>
          {/* Level badge */}
          <span className="text-xs font-bold bg-primary text-white px-2 py-0.5 rounded-full">
            {profile.current_level}
          </span>
          {/* Dark mode */}
          <DarkModeToggle />
          {/* Sign out */}
          <button
            onClick={handleSignOut}
            className="tap-target flex items-center justify-center text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            aria-label="Sign out"
          >
            <LogOut size={18} aria-hidden="true" />
          </button>
        </div>
      )}
    </header>
  );
}
