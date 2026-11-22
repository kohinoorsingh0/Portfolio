"use client";

import { useState, useEffect, FormEvent } from "react";
import AdminShell from "@/components/admin/AdminShell";

interface SiteSettingsForm {
  name: string;
  role: string;
  tagline: string;
  bio: string;
  location: string;
  availability: string;
  email: string;
  phone: string;
  whatsapp: string;
  github: string;
  linkedin: string;
  heroTitle: string;
  heroHighlightWord: string;
  profilePhotoUrl: string;
}

const INITIAL_FORM: SiteSettingsForm = {
  name: "",
  role: "",
  tagline: "",
  bio: "",
  location: "",
  availability: "",
  email: "",
  phone: "",
  whatsapp: "",
  github: "",
  linkedin: "",
  heroTitle: "",
  heroHighlightWord: "",
  profilePhotoUrl: "",
};

export default function AdminSettingsPage() {
  const [formData, setFormData] = useState<SiteSettingsForm>(INITIAL_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    let isMounted = true;

    const fetchSettings = async () => {
      try {
        const res = await fetch(`${apiUrl.replace(/\/$/, "")}/admin/settings`, {
          credentials: "include",
        });

        if (res.status === 401) {
          window.location.href = "/admin/login";
          return;
        }

        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setFormData({
              name: data.name || "",
              role: data.role || "",
              tagline: data.tagline || "",
              bio: data.bio || "",
              location: data.location || "",
              availability: data.availability || "",
              email: data.email || "",
              phone: data.phone || "",
              whatsapp: data.whatsapp || "",
              github: data.github || "",
              linkedin: data.linkedin || "",
              heroTitle: data.heroTitle || "",
              heroHighlightWord: data.heroHighlightWord || "",
              profilePhotoUrl: data.profilePhotoUrl || "",
            });
          }
        }
      } catch {
        setError("Failed to load settings from server.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSettings();

    return () => {
      isMounted = false;
    };
  }, [apiUrl]);

  const handleChange = (
    field: keyof SiteSettingsForm,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Client-side validation: trimmed checks
    const trimmedName = formData.name.trim();
    const trimmedRole = formData.role.trim();
    const trimmedEmail = formData.email.trim();

    if (!trimmedName) {
      setError("Name is required");
      return;
    }
    if (!trimmedRole) {
      setError("Role is required");
      return;
    }
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("A valid email address is required");
      return;
    }

    setSaving(true);

    try {
      const payload: SiteSettingsForm = {
        name: trimmedName,
        role: trimmedRole,
        tagline: formData.tagline.trim(),
        bio: formData.bio.trim(),
        location: formData.location.trim(),
        availability: formData.availability.trim(),
        email: trimmedEmail.toLowerCase(),
        phone: formData.phone.trim(),
        whatsapp: formData.whatsapp.trim(),
        github: formData.github.trim(),
        linkedin: formData.linkedin.trim(),
        heroTitle: formData.heroTitle.trim(),
        heroHighlightWord: formData.heroHighlightWord.trim(),
        profilePhotoUrl: formData.profilePhotoUrl.trim(),
      };

      const res = await fetch(`${apiUrl.replace(/\/$/, "")}/admin/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.ok) {
        setSuccess("Site settings updated successfully! Changes are live in database.");
        if (data.settings) {
          setFormData((prev) => ({
            ...prev,
            ...data.settings,
          }));
        }
      } else {
        setError(data.error || "Failed to update settings. Please check your inputs.");
      }
    } catch {
      setError("Network error updating site settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell>
      {/* Page Header */}
      <div className="mb-8 sm:mb-10">
        <span className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-royal dark:text-[#7888FF] mb-2 block select-none">
          CONFIGURATION
        </span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-ink dark:text-cream">
          Site Settings
        </h1>
        <p className="text-muted dark:text-[#A8A8B8] text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
          Manage your personal identity, hero headlines, bio, location, and social profile links.
        </p>
      </div>

      {/* Notifications */}
      {error && (
        <div
          role="alert"
          className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm font-medium"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-sm font-medium"
        >
          {success}
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-muted font-mono text-sm">
          Loading site configuration…
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8" noValidate>
          {/* Section 1: Core Identity & Hero */}
          <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#121730] border border-black/10 dark:border-white/10 space-y-6">
            <h2 className="text-lg font-bold text-ink dark:text-cream border-b border-black/5 dark:border-white/5 pb-3">
              1. Identity &amp; Hero Content
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="field-name"
                  className="font-mono text-xs uppercase tracking-wider font-semibold text-ink dark:text-cream"
                >
                  Full Name <span className="text-coral">*</span>
                </label>
                <input
                  id="field-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Kohinoor Singh"
                  className="w-full px-4 py-3 text-base rounded-xl bg-[#FAF8F5] dark:bg-[#0B0F24] border border-black/15 dark:border-white/15 text-ink dark:text-cream focus:outline-none focus:ring-2 focus:ring-royal"
                />
              </div>

              {/* Role */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="field-role"
                  className="font-mono text-xs uppercase tracking-wider font-semibold text-ink dark:text-cream"
                >
                  Professional Role <span className="text-coral">*</span>
                </label>
                <input
                  id="field-role"
                  type="text"
                  required
                  value={formData.role}
                  onChange={(e) => handleChange("role", e.target.value)}
                  placeholder="Full-Stack Developer"
                  className="w-full px-4 py-3 text-base rounded-xl bg-[#FAF8F5] dark:bg-[#0B0F24] border border-black/15 dark:border-white/15 text-ink dark:text-cream focus:outline-none focus:ring-2 focus:ring-royal"
                />
              </div>

              {/* Hero Title */}
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label
                  htmlFor="field-heroTitle"
                  className="font-mono text-xs uppercase tracking-wider font-semibold text-ink dark:text-cream"
                >
                  Hero Title
                </label>
                <input
                  id="field-heroTitle"
                  type="text"
                  value={formData.heroTitle}
                  onChange={(e) => handleChange("heroTitle", e.target.value)}
                  placeholder="I build fast, beautiful web products."
                  className="w-full px-4 py-3 text-base rounded-xl bg-[#FAF8F5] dark:bg-[#0B0F24] border border-black/15 dark:border-white/15 text-ink dark:text-cream focus:outline-none focus:ring-2 focus:ring-royal"
                />
              </div>

              {/* Hero Highlight Word */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="field-heroHighlightWord"
                  className="font-mono text-xs uppercase tracking-wider font-semibold text-ink dark:text-cream"
                >
                  Hero Highlight Word
                </label>
                <input
                  id="field-heroHighlightWord"
                  type="text"
                  value={formData.heroHighlightWord}
                  onChange={(e) =>
                    handleChange("heroHighlightWord", e.target.value)
                  }
                  placeholder="beautiful"
                  className="w-full px-4 py-3 text-base rounded-xl bg-[#FAF8F5] dark:bg-[#0B0F24] border border-black/15 dark:border-white/15 text-ink dark:text-cream focus:outline-none focus:ring-2 focus:ring-royal"
                />
              </div>

              {/* Tagline */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="field-tagline"
                  className="font-mono text-xs uppercase tracking-wider font-semibold text-ink dark:text-cream"
                >
                  Tagline
                </label>
                <input
                  id="field-tagline"
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => handleChange("tagline", e.target.value)}
                  placeholder="Interface craftsman &amp; problem solver"
                  className="w-full px-4 py-3 text-base rounded-xl bg-[#FAF8F5] dark:bg-[#0B0F24] border border-black/15 dark:border-white/15 text-ink dark:text-cream focus:outline-none focus:ring-2 focus:ring-royal"
                />
              </div>

              {/* Profile Photo URL */}
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label
                  htmlFor="field-profilePhotoUrl"
                  className="font-mono text-xs uppercase tracking-wider font-semibold text-ink dark:text-cream"
                >
                  Profile Photo URL
                </label>
                <input
                  id="field-profilePhotoUrl"
                  type="text"
                  value={formData.profilePhotoUrl}
                  onChange={(e) =>
                    handleChange("profilePhotoUrl", e.target.value)
                  }
                  placeholder="/images/kohinoor-watercolor.jpg"
                  className="w-full px-4 py-3 text-base rounded-xl bg-[#FAF8F5] dark:bg-[#0B0F24] border border-black/15 dark:border-white/15 text-ink dark:text-cream focus:outline-none focus:ring-2 focus:ring-royal"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Bio & Status */}
          <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#121730] border border-black/10 dark:border-white/10 space-y-6">
            <h2 className="text-lg font-bold text-ink dark:text-cream border-b border-black/5 dark:border-white/5 pb-3">
              2. Biography &amp; Availability
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Bio */}
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label
                  htmlFor="field-bio"
                  className="font-mono text-xs uppercase tracking-wider font-semibold text-ink dark:text-cream"
                >
                  Biography
                </label>
                <textarea
                  id="field-bio"
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => handleChange("bio", e.target.value)}
                  placeholder="Full-stack developer building deliberate web products..."
                  className="w-full px-4 py-3 text-base rounded-xl bg-[#FAF8F5] dark:bg-[#0B0F24] border border-black/15 dark:border-white/15 text-ink dark:text-cream focus:outline-none focus:ring-2 focus:ring-royal leading-relaxed resize-y"
                />
              </div>

              {/* Location */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="field-location"
                  className="font-mono text-xs uppercase tracking-wider font-semibold text-ink dark:text-cream"
                >
                  Location
                </label>
                <input
                  id="field-location"
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  placeholder="Karnal, India"
                  className="w-full px-4 py-3 text-base rounded-xl bg-[#FAF8F5] dark:bg-[#0B0F24] border border-black/15 dark:border-white/15 text-ink dark:text-cream focus:outline-none focus:ring-2 focus:ring-royal"
                />
              </div>

              {/* Availability */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="field-availability"
                  className="font-mono text-xs uppercase tracking-wider font-semibold text-ink dark:text-cream"
                >
                  Availability Status
                </label>
                <input
                  id="field-availability"
                  type="text"
                  value={formData.availability}
                  onChange={(e) =>
                    handleChange("availability", e.target.value)
                  }
                  placeholder="Internships &amp; Junior roles"
                  className="w-full px-4 py-3 text-base rounded-xl bg-[#FAF8F5] dark:bg-[#0B0F24] border border-black/15 dark:border-white/15 text-ink dark:text-cream focus:outline-none focus:ring-2 focus:ring-royal"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Contact Channels & Socials */}
          <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#121730] border border-black/10 dark:border-white/10 space-y-6">
            <h2 className="text-lg font-bold text-ink dark:text-cream border-b border-black/5 dark:border-white/5 pb-3">
              3. Contact &amp; Social Links
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="field-email"
                  className="font-mono text-xs uppercase tracking-wider font-semibold text-ink dark:text-cream"
                >
                  Contact Email <span className="text-coral">*</span>
                </label>
                <input
                  id="field-email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="kohinoorsingh040@gmail.com"
                  className="w-full px-4 py-3 text-base rounded-xl bg-[#FAF8F5] dark:bg-[#0B0F24] border border-black/15 dark:border-white/15 text-ink dark:text-cream focus:outline-none focus:ring-2 focus:ring-royal"
                />
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="field-phone"
                  className="font-mono text-xs uppercase tracking-wider font-semibold text-ink dark:text-cream"
                >
                  Phone Number
                </label>
                <input
                  id="field-phone"
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="9350666578"
                  className="w-full px-4 py-3 text-base rounded-xl bg-[#FAF8F5] dark:bg-[#0B0F24] border border-black/15 dark:border-white/15 text-ink dark:text-cream focus:outline-none focus:ring-2 focus:ring-royal"
                />
              </div>

              {/* WhatsApp */}
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label
                  htmlFor="field-whatsapp"
                  className="font-mono text-xs uppercase tracking-wider font-semibold text-ink dark:text-cream"
                >
                  WhatsApp Link
                </label>
                <input
                  id="field-whatsapp"
                  type="text"
                  value={formData.whatsapp}
                  onChange={(e) => handleChange("whatsapp", e.target.value)}
                  placeholder="https://wa.me/919350666578"
                  className="w-full px-4 py-3 text-base rounded-xl bg-[#FAF8F5] dark:bg-[#0B0F24] border border-black/15 dark:border-white/15 text-ink dark:text-cream focus:outline-none focus:ring-2 focus:ring-royal"
                />
              </div>

              {/* GitHub */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="field-github"
                  className="font-mono text-xs uppercase tracking-wider font-semibold text-ink dark:text-cream"
                >
                  GitHub URL
                </label>
                <input
                  id="field-github"
                  type="url"
                  value={formData.github}
                  onChange={(e) => handleChange("github", e.target.value)}
                  placeholder="https://github.com/kohinoorsingh0"
                  className="w-full px-4 py-3 text-base rounded-xl bg-[#FAF8F5] dark:bg-[#0B0F24] border border-black/15 dark:border-white/15 text-ink dark:text-cream focus:outline-none focus:ring-2 focus:ring-royal"
                />
              </div>

              {/* LinkedIn */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="field-linkedin"
                  className="font-mono text-xs uppercase tracking-wider font-semibold text-ink dark:text-cream"
                >
                  LinkedIn URL
                </label>
                <input
                  id="field-linkedin"
                  type="url"
                  value={formData.linkedin}
                  onChange={(e) => handleChange("linkedin", e.target.value)}
                  placeholder="https://www.linkedin.com/in/kohinoor-singh-5137b9413/"
                  className="w-full px-4 py-3 text-base rounded-xl bg-[#FAF8F5] dark:bg-[#0B0F24] border border-black/15 dark:border-white/15 text-ink dark:text-cream focus:outline-none focus:ring-2 focus:ring-royal"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3.5 rounded-full bg-royal text-white font-bold text-sm sm:text-base hover:bg-royal/90 dark:bg-lime dark:text-ink dark:hover:bg-lime/90 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
            >
              {saving ? (
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
                  <span>Saving…</span>
                </>
              ) : (
                <span>Save Settings →</span>
              )}
            </button>
          </div>
        </form>
      )}
    </AdminShell>
  );
}
