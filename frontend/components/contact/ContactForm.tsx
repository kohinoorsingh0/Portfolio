"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";

interface FormState {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormState>({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "error" | "valid">("idle");

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Please enter your name.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email address.";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Please tell me about your idea.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isValid = validate();

    if (!isValid) {
      setStatus("error");
      return;
    }

    setStatus("valid");
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field-specific error on change
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (status === "error") {
      setStatus("idle");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="bg-[#FFF8F4] dark:bg-[#1E1B29] border border-[#14121F]/20 dark:border-white/10 rounded-[28px] p-6 sm:p-9 lg:p-10 shadow-[12px_14px_0_rgba(20,18,31,0.18)] dark:shadow-[12px_14px_0_rgba(0,0,0,0.35)] flex flex-col transition-colors duration-300"
    >
      {/* Form Heading */}
      <div className="border-b border-[#14121F]/15 dark:border-white/10 pb-5 mb-7 flex flex-col sm:flex-row sm:items-center justify-between gap-2 select-none">
        <span className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-[0.14em] text-[#14121F]/80 dark:text-cream/80">
          YOUR MESSAGE
        </span>
        <strong className="text-xs text-[#715044] dark:text-[#A8A8B8] font-medium">
          Usually replies within 24 hours
        </strong>
      </div>

      <div className="space-y-6">
        {/* Your Name */}
        <div>
          <label
            htmlFor="name"
            className="block font-mono text-[11px] font-bold uppercase tracking-wider text-[#491B11] dark:text-cream/90 mb-1.5"
          >
            Your name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Jane Doe"
            className={`w-full bg-transparent border-0 border-b-2 py-3 px-1 text-base text-ink dark:text-cream placeholder:text-ink/30 dark:placeholder:text-cream/30 focus:outline-none transition-colors ${
              errors.name
                ? "border-red-600 focus:border-red-600"
                : "border-[#14121F]/40 dark:border-white/30 focus:border-[#111111] dark:focus:border-white"
            }`}
          />
          {errors.name && (
            <p className="font-mono text-xs text-red-700 dark:text-red-400 mt-1.5">
              {errors.name}
            </p>
          )}
        </div>

        {/* Email Address */}
        <div>
          <label
            htmlFor="email"
            className="block font-mono text-[11px] font-bold uppercase tracking-wider text-[#491B11] dark:text-cream/90 mb-1.5"
          >
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="e.g. jane@example.com"
            className={`w-full bg-transparent border-0 border-b-2 py-3 px-1 text-base text-ink dark:text-cream placeholder:text-ink/30 dark:placeholder:text-cream/30 focus:outline-none transition-colors ${
              errors.email
                ? "border-red-600 focus:border-red-600"
                : "border-[#14121F]/40 dark:border-white/30 focus:border-[#111111] dark:focus:border-white"
            }`}
          />
          {errors.email && (
            <p className="font-mono text-xs text-red-700 dark:text-red-400 mt-1.5">
              {errors.email}
            </p>
          )}
        </div>

        {/* Tell me about your idea */}
        <div>
          <label
            htmlFor="message"
            className="block font-mono text-[11px] font-bold uppercase tracking-wider text-[#491B11] dark:text-cream/90 mb-1.5"
          >
            Tell me about your idea
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={formData.message}
            onChange={handleChange}
            placeholder="What are you building, what's the timeline, and how can I help?"
            className={`w-full bg-transparent border-0 border-b-2 py-3 px-1 text-base text-ink dark:text-cream placeholder:text-ink/30 dark:placeholder:text-cream/30 focus:outline-none resize-none transition-colors ${
              errors.message
                ? "border-red-600 focus:border-red-600"
                : "border-[#14121F]/40 dark:border-white/30 focus:border-[#111111] dark:focus:border-white"
            }`}
          />
          {errors.message && (
            <p className="font-mono text-xs text-red-700 dark:text-red-400 mt-1.5">
              {errors.message}
            </p>
          )}
        </div>
      </div>

      {/* Status Messages */}
      {status === "error" && (
        <div className="mt-4 p-3 rounded-lg bg-red-100 dark:bg-red-950/60 border border-red-300 dark:border-red-800">
          <p className="font-mono text-xs font-semibold text-red-700 dark:text-red-400">
            Please complete each field with a valid email.
          </p>
        </div>
      )}

      {status === "valid" && (
        <div className="mt-4 p-3 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800">
          <p className="font-mono text-xs font-semibold text-emerald-800 dark:text-emerald-300">
            ✓ Form validated! (Submission API will be connected in Step 33).
          </p>
        </div>
      )}

      {/* Submit Button */}
      <div className="mt-8">
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 sm:py-4 rounded-full bg-[#111111] text-white hover:bg-black active:scale-[0.99] font-bold text-sm sm:text-base hover:-translate-y-0.5 transition-all duration-200 shadow-md cursor-pointer select-none"
        >
          <span>Send message</span>
          <span className="text-base" aria-hidden="true">
            →
          </span>
        </button>
      </div>
    </form>
  );
}
