"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, BookMarked, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", icon: Home, label: "Home" },
  { href: "/lessons", icon: BookOpen, label: "Lessons" },
  { href: "/vocabulary", icon: BookMarked, label: "Vocab" },
  { href: "/profile", icon: User, label: "Profile" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[var(--card-bg)] border-t border-[var(--border)] pb-safe"
      aria-label="Main navigation"
    >
      <div className="flex items-stretch">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-1 py-2 tap-target transition-colors",
                active
                  ? "text-primary dark:text-blue-400"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              )}
              aria-label={label}
              aria-current={active ? "page" : undefined}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 2} aria-hidden="true" />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
