"use client";

import { useState, FormEvent } from "react";

export default function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const endpoint = `${apiUrl.replace(/\/$/, "")}/admin/login`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.status === 200 && data.ok) {
        // Successful login: redirect to admin dashboard
        window.location.href = "/admin";
        return;
      }

      if (res.status === 429) {
        // Rate-limited response
        setError(
          data.error ||
            "Too many login attempts. Please wait 15 minutes before trying again."
        );
      } else if (res.status === 401 || res.status === 400) {
        // Generic failure message — do not reveal which field is invalid
        setError("Invalid email or password");
      } else {
        setError(data.error || "Unable to sign in. Please try again.");
      }
    } catch {
      setError("Network error connecting to backend. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-5" noValidate>
      {error && (
        <div
          role="alert"
          aria-live="polite"
          className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm font-medium leading-relaxed"
        >
          {error}
        </div>
      )}

      {/* Email Input */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="admin-email"
          className="font-mono text-xs uppercase tracking-wider font-semibold text-ink dark:text-cream"
        >
          Email address
        </label>
        <input
          id="admin-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@example.com"
          disabled={loading}
          className="w-full px-4 py-3 text-base rounded-xl bg-white dark:bg-[#182046] border border-black/15 dark:border-white/15 text-ink dark:text-cream placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-royal focus:border-transparent transition-all disabled:opacity-50"
        />
      </div>

      {/* Password Input */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="admin-password"
          className="font-mono text-xs uppercase tracking-wider font-semibold text-ink dark:text-cream"
        >
          Password
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••••••"
          disabled={loading}
          className="w-full px-4 py-3 text-base rounded-xl bg-white dark:bg-[#182046] border border-black/15 dark:border-white/15 text-ink dark:text-cream placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-royal focus:border-transparent transition-all disabled:opacity-50"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full mt-2 py-3.5 px-6 rounded-full bg-ink text-cream dark:bg-cream dark:text-ink font-bold text-sm sm:text-base hover:bg-ink/90 dark:hover:bg-white hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-4 w-4 text-current"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Signing in...</span>
          </>
        ) : (
          <span>Sign In →</span>
        )}
      </button>
    </form>
  );
}
