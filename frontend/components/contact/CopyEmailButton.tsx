"use client";

import { useState } from "react";

interface CopyEmailButtonProps {
  email: string;
}

export default function CopyEmailButton({ email }: CopyEmailButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="w-full max-w-[430px] my-7 py-5 border-y border-[#14121F]/25 flex items-center justify-between text-left select-none transition-all hover:opacity-90 active:scale-[0.99] cursor-pointer group"
      aria-label={`Copy email address ${email}`}
    >
      <span className="flex flex-col gap-1">
        <small className="font-mono text-[9px] font-bold uppercase tracking-wider text-[#5B1B0D]">
          {copied ? "COPIED TO CLIPBOARD!" : "EMAIL ME AT"}
        </small>
        <span className="font-mono text-sm xs:text-base sm:text-lg font-bold text-ink truncate max-w-[220px] xs:max-w-[280px] sm:max-w-none">
          {email}
        </span>
      </span>

      <span
        className={`w-10 h-10 rounded-full border border-[#14121F]/30 flex items-center justify-center transition-all ${
          copied ? "bg-white text-emerald-700 shadow-sm" : "text-ink/70 group-hover:bg-white/40"
        }`}
        aria-hidden="true"
      >
        {copied ? (
          <svg
            className="w-5 h-5 text-emerald-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        ) : (
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        )}
      </span>
    </button>
  );
}
