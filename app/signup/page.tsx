"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const passwordStrong = password.length >= 8;

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!passwordStrong) { setError("Password must be at least 8 characters."); return; }
    setLoading(true);
    const supabase = createClient();
    const { error: err } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    if (err) {
      setError(err.message);
      setLoading(false);
    } else {
      setSuccess(true);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-sm"
        >
          <CheckCircle2 size={64} className="text-success mx-auto mb-4" aria-hidden="true" />
          <h2 className="text-2xl font-bold mb-2">Check your email!</h2>
          <p className="text-[var(--muted)]">
            We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.
          </p>
          <Link href="/login" className="mt-6 inline-block text-primary dark:text-blue-400 font-medium hover:underline">
            Back to login
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] px-4">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
        <div className="text-5xl mb-3" aria-hidden="true">🇳🇱</div>
        <h1 className="text-3xl font-bold text-primary dark:text-blue-400">DutchPath</h1>
        <p className="text-[var(--muted)] mt-1 text-sm">Start your Inburgering journey today</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-sm bg-[var(--card-bg)] rounded-2xl shadow-lg border border-[var(--border)] p-6"
      >
        <h2 className="text-xl font-semibold mb-5">Create your account</h2>

        <button
          onClick={handleGoogle}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 border border-[var(--border)] rounded-xl py-3 px-4 font-medium text-sm hover:bg-[var(--border)]/30 transition-colors tap-target mb-4 disabled:opacity-60"
          aria-label="Sign up with Google"
        >
          {googleLoading ? (
            <Loader2 size={18} className="animate-spin" aria-hidden="true" />
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          )}
          Continue with Google
        </button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--border)]" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-[var(--card-bg)] px-3 text-xs text-[var(--muted)]">or</span>
          </div>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1.5">Email address</label>
            <input
              id="email" type="email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              required autoComplete="email"
              className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1.5">Password</label>
            <div className="relative">
              <input
                id="password" type={showPassword ? "text" : "password"} value={password}
                onChange={(e) => setPassword(e.target.value)}
                required autoComplete="new-password"
                className="w-full px-3 py-2.5 pr-10 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                placeholder="min. 8 characters"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--foreground)] tap-target flex items-center justify-center"
                aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
              </button>
            </div>
            {password.length > 0 && (
              <div className="mt-1.5 flex items-center gap-1.5">
                <div className={`h-1 flex-1 rounded-full ${passwordStrong ? "bg-success" : "bg-danger"}`} aria-hidden="true" />
                <span className={`text-xs ${passwordStrong ? "text-success" : "text-danger"}`}>
                  {passwordStrong ? "Strong" : "Too short"}
                </span>
              </div>
            )}
          </div>

          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} role="alert"
              className="text-danger text-sm bg-danger/10 rounded-lg px-3 py-2">{error}</motion.p>
          )}

          <button type="submit" disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-xl transition-colors tap-target disabled:opacity-60 flex items-center justify-center gap-2">
            {loading && <Loader2 size={18} className="animate-spin" aria-hidden="true" />}
            Create account
          </button>
        </form>

        <p className="text-center text-sm text-[var(--muted)] mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-primary dark:text-blue-400 font-medium hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
