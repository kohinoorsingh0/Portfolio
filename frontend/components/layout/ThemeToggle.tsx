"use client";

import { useEffect, useState, useRef, useCallback } from "react";

export type ThemeMode = "auto" | "light" | "dark";

/**
 * Determine automatic theme based on local time:
 * - LIGHT from 06:00 to 18:00
 * - DARK from 18:00 to 06:00
 * - Respects prefers-color-scheme as fallback if time is not available
 */
export function getAutoTheme(date?: Date): "light" | "dark" {
  try {
    const d = date || new Date();
    const h = d.getHours();
    if (!isNaN(h)) {
      return h >= 6 && h < 18 ? "light" : "dark";
    }
  } catch {
    // Fallback if Date is not available
  }
  try {
    if (
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }
  } catch {
    // Fallback
  }
  return "light";
}

export default function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>("auto");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressRef = useRef(false);

  // Apply theme to document element
  const applyTheme = useCallback((theme: "light" | "dark") => {
    setResolvedTheme(theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Initialize and synchronize with localStorage & local time
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") {
      setMode(stored);
      applyTheme(stored);
    } else {
      setMode("auto");
      applyTheme(getAutoTheme());
    }
  }, [applyTheme]);

  // Periodic check (every 30 mins) + exact boundary transition at 06:00 and 18:00
  useEffect(() => {
    if (!mounted) return;

    const checkAuto = () => {
      const stored = localStorage.getItem("theme");
      if (stored === "light" || stored === "dark") {
        return; // Manual override active, do not auto-switch
      }
      const auto = getAutoTheme();
      applyTheme(auto);
    };

    // 1. Re-check every 30 minutes while the site is open
    const interval = setInterval(checkAuto, 30 * 60 * 1000);

    // 2. Schedule timeout for the exact upcoming 06:00 or 18:00 transition
    const now = new Date();
    const nextTransition = new Date(now);
    const h = now.getHours();
    if (h >= 6 && h < 18) {
      nextTransition.setHours(18, 0, 0, 0);
    } else if (h >= 18) {
      nextTransition.setDate(nextTransition.getDate() + 1);
      nextTransition.setHours(6, 0, 0, 0);
    } else {
      nextTransition.setHours(6, 0, 0, 0);
    }
    const msUntilBoundary = Math.max(1000, nextTransition.getTime() - now.getTime());
    const boundaryTimer = setTimeout(() => {
      checkAuto();
    }, msUntilBoundary);

    // 3. Also re-check when the user returns to the tab
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        checkAuto();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearInterval(interval);
      clearTimeout(boundaryTimer);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [mounted, applyTheme]);

  // Set mode to Auto (clears manual override and resumes time-based switching)
  const setAutoMode = useCallback(() => {
    setMode("auto");
    localStorage.removeItem("theme");
    applyTheme(getAutoTheme());
  }, [applyTheme]);

  // Handle click / toggle
  const handleToggle = () => {
    if (isLongPressRef.current) {
      isLongPressRef.current = false;
      return;
    }

    if (mode === "auto") {
      // First tap from auto: switches to the opposite of current auto theme and saves manual choice
      const next: "light" | "dark" = resolvedTheme === "light" ? "dark" : "light";
      setMode(next);
      localStorage.setItem("theme", next);
      applyTheme(next);
    } else {
      // Second tap (from manual override): returns to Auto
      setAutoMode();
    }
  };

  // Long-press handling (holding for 500ms returns to Auto)
  const startLongPress = () => {
    isLongPressRef.current = false;
    longPressTimerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      setAutoMode();
    }, 500);
  };

  const cancelLongPress = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-full border border-black/10 dark:border-white/10" />
    );
  }

  const isAuto = mode === "auto";

  return (
    <button
      type="button"
      onClick={handleToggle}
      onMouseDown={startLongPress}
      onMouseUp={cancelLongPress}
      onMouseLeave={cancelLongPress}
      onTouchStart={startLongPress}
      onTouchEnd={cancelLongPress}
      onContextMenu={(e) => {
        if (isLongPressRef.current) {
          e.preventDefault();
        }
      }}
      title={
        isAuto
          ? `Auto Theme (${resolvedTheme === "light" ? "Day / Light" : "Night / Dark"}). Click to switch theme, or hold for Auto.`
          : `Manual ${mode === "dark" ? "Dark" : "Light"} mode. Click or hold to return to Auto.`
      }
      aria-label={
        isAuto
          ? `Auto theme active (currently ${resolvedTheme}). Click to toggle manually, hold to reset Auto.`
          : `Manual ${mode} theme active. Click to return to Auto Day/Night.`
      }
      className="relative flex items-center justify-center min-w-[44px] min-h-[44px] w-9 h-9 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-all duration-200 text-ink dark:text-cream cursor-pointer focus-visible:outline-2 focus-visible:outline-royal select-none"
    >
      {resolvedTheme === "light" ? (
        // Moon icon for switching to dark
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
          aria-hidden="true"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      ) : (
        // Sun icon for switching to light
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 text-lime"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      )}

      {/* Auto indicator: subtle small lime dot indicating automatic day/night mode */}
      {isAuto && (
        <span
          className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-lime ring-1 ring-black/20 dark:ring-white/30"
          aria-hidden="true"
        />
      )}
    </button>
  );
}
