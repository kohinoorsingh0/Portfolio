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
      className="w-full max-w-[430px] my-7 px-5 py-4 sm:px-6 sm:py-5 bg-[#0F1530] border border-white/10 rounded-2xl sm:rounded-3xl flex items-center justify-between text-left select-none transition-all hover:bg-[#141C40] active:scale-[0.99] cursor-pointer group shadow-md"
      aria-label={`Copy email address ${email}`}
    >
      <span className="flex flex-col gap-1">
        <small className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#C8F542]">
          {copied ? "COPIED TO CLIPBOARD!" : "EMAIL ME AT"}
        </small>
        <span className="font-mono text-sm xs:text-base sm:text-lg font-bold text-white truncate max-w-[220px] xs:max-w-[260px] sm:max-w-none">
          {email}
        </span>
      </span>

      <span
        className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#C8F542] flex items-center justify-center shrink-0 transition-transform ${
          copied ? "scale-105 shadow-sm" : "group-hover:scale-105"
        }`}
        aria-hidden="true"
      >
        {copied ? (
          <svg
            className="w-5 h-5 text-white drop-shadow-[0_1px_2px_rgba(15,21,48,0.6)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="3"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        ) : (
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 text-white drop-shadow-[0_1px_2px_rgba(15,21,48,0.6)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
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
