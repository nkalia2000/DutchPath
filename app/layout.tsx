import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { ToastContainer } from "@/components/ui/toast-container";

export const metadata: Metadata = {
  title: "DutchPath — Learn Dutch for Inburgering",
  description:
    "A Duolingo-inspired progressive learning platform for the Dutch Inburgering (civic integration) exam. Starting at A2 level.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="nl" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <Providers>
          {children}
          <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}
