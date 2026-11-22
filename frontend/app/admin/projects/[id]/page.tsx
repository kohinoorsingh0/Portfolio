"use client";

import { useState, useEffect, FormEvent, ChangeEvent, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { triggerRevalidation } from "@/lib/api";

interface CaseStudyFields {
  overview: string;
  challenge: string;
  solution: string;
  outcome: string;
}

interface ProjectFormState {
  title: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  stackString: string;
  imageUrl: string;
  githubUrl: string;
  liveUrl: string;
  featured: boolean;
  order: number;
  visible: boolean;
  caseStudy: CaseStudyFields;
  resultText: string;
}

const DEFAULT_PROJECT_FORM: ProjectFormState = {
  title: "",
  slug: "",
  shortDescription: "",
  longDescription: "",
  stackString: "",
  imageUrl: "",
  githubUrl: "",
  liveUrl: "",
  featured: false,
  order: 1,
  visible: true,
  caseStudy: {
    overview: "",
    challenge: "",
    solution: "",
    outcome: "",
  },
  resultText: "",
};

// Helper to generate a clean URL-friendly slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function AdminProjectFormPage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const isNew = id === "new";

  const [formData, setFormData] = useState<ProjectFormState>(DEFAULT_PROJECT_FORM);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(!isNew);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  // Fetch project details in edit mode
  useEffect(() => {
    if (isNew) return;

    let isMounted = true;
    const fetchProject = async () => {
      try {
        const res = await fetch(
          `${apiUrl.replace(/\/$/, "")}/admin/projects/${id}`,
          { credentials: "include" }
        );

        if (res.status === 401) {
          window.location.href = "/admin/login";
          return;
        }

        if (res.ok) {
          const data = await res.json();
          const p = data.project;
          if (isMounted && p) {
            setFormData({
              title: p.title || "",
              slug: p.slug || "",
              shortDescription: p.shortDescription || "",
              longDescription: p.longDescription || "",
              stackString: Array.isArray(p.stack) ? p.stack.join(", ") : "",
              imageUrl: p.imageUrl || "",
              githubUrl: p.githubUrl || "",
              liveUrl: p.liveUrl || "",
              featured: Boolean(p.featured),
              order: typeof p.order === "number" ? p.order : 1,
              visible: p.visible !== false,
              caseStudy: {
                overview: p.caseStudy?.overview || "",
                challenge: p.caseStudy?.challenge || "",
                solution: p.caseStudy?.solution || "",
                outcome: p.caseStudy?.outcome || "",
              },
              resultText: p.resultText || "",
            });
          }
        } else {
          setError("Project not found or failed to load.");
        }
      } catch {
        setError("Network error fetching project.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProject();

    return () => {
      isMounted = false;
    };
  }, [id, isNew, apiUrl]);

  // Handle title changes and auto-generate slug if not manually customized
  const handleTitleChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: slugManuallyEdited ? prev.slug : generateSlug(val),
    }));
    setError(null);
  };

  // Handle slug change manually
  const handleSlugChange = (val: string) => {
    setSlugManuallyEdited(true);
    setFormData((prev) => ({
      ...prev,
      slug: val.toLowerCase().replace(/\s+/g, "-"),
    }));
    setError(null);
  };

  // Handle image upload to Cloudinary via POST /api/admin/upload
  const handleImageFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image format
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a valid image file (JPG, PNG, or WEBP only).");
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size exceeds the 5MB limit.");
      return;
    }

    setUploadingImage(true);
    setError(null);

    try {
      const uploadBody = new FormData();
      uploadBody.append("file", file);

      const res = await fetch(`${apiUrl.replace(/\/$/, "")}/admin/upload`, {
        method: "POST",
        credentials: "include",
        body: uploadBody,
      });

      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.ok && data.url) {
        setFormData((prev) => ({ ...prev, imageUrl: data.url }));
        setSuccess("Project image uploaded to Cloudinary successfully!");
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.error || "Failed to upload image. Please try again.");
      }
    } catch {
      setError("Network error uploading image to Cloudinary.");
    } finally {
      setUploadingImage(false);
      // Reset input value
      e.target.value = "";
    }
  };

  // Handle Form Submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const trimmedTitle = formData.title.trim();
    const trimmedSlug = formData.slug.trim().toLowerCase();
    const trimmedShortDesc = formData.shortDescription.trim();

    if (!trimmedTitle) {
      setError("Project title is required.");
      return;
    }

    if (!trimmedSlug) {
      setError("Project slug is required.");
      return;
    }

    if (!/^[a-z0-9-]+$/.test(trimmedSlug)) {
      setError(
        "Slug must only contain lowercase alphanumeric characters and hyphens (e.g. fixflow)."
      );
      return;
    }

    if (!trimmedShortDesc) {
      setError("Short description is required.");
      return;
    }

    setSaving(true);

    // Parse stack comma-separated string into clean array
    const parsedStack = formData.stackString
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const payload = {
      title: trimmedTitle,
      slug: trimmedSlug,
      shortDescription: trimmedShortDesc,
      longDescription: formData.longDescription.trim(),
      stack: parsedStack,
      imageUrl: formData.imageUrl.trim(),
      githubUrl: formData.githubUrl.trim() || null,
      liveUrl: formData.liveUrl.trim() || null,
      featured: formData.featured,
      order: Number(formData.order) || 0,
      visible: formData.visible,
      caseStudy: {
        overview: formData.caseStudy.overview.trim(),
        challenge: formData.caseStudy.challenge.trim(),
        solution: formData.caseStudy.solution.trim(),
        outcome: formData.caseStudy.outcome.trim(),
      },
      resultText: formData.resultText.trim() || null,
    };

    try {
      const endpoint = isNew
        ? `${apiUrl.replace(/\/$/, "")}/admin/projects`
        : `${apiUrl.replace(/\/$/, "")}/admin/projects/${id}`;

      const method = isNew ? "POST" : "PUT";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.ok) {
        triggerRevalidation();
        setSuccess(
          isNew
            ? `Project "${trimmedTitle}" created successfully!`
            : `Project "${trimmedTitle}" updated successfully!`
        );
        setTimeout(() => {
          router.push("/admin/projects");
        }, 1200);
      } else {
        setError(data.error || "Failed to save project. Please check inputs.");
      }
    } catch {
      setError("Network error saving project.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell>
      {/* Top Breadcrumb & Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 text-xs font-mono text-muted dark:text-[#A8A8B8] mb-2">
          <Link
            href="/admin/projects"
            className="hover:text-royal dark:hover:text-[#7888FF] transition-colors"
          >
            ← Projects List
          </Link>
          <span>/</span>
          <span className="uppercase text-ink dark:text-cream font-bold">
            {isNew ? "Create" : "Edit"}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-ink dark:text-cream">
          {isNew ? "Create New Project" : `Edit Project: ${formData.title || "Loading…"}`}
        </h1>
        <p className="text-muted dark:text-[#A8A8B8] text-sm sm:text-base mt-1.5 max-w-2xl leading-relaxed">
          Fill in the project details, showcase media, tech stack, and case study sections.
        </p>
      </div>

      {/* Notifications */}
      {error && (
        <div
          role="alert"
          className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm font-medium flex items-center justify-between"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-red-500 hover:text-red-700 text-sm font-bold ml-3"
          >
            ×
          </button>
        </div>
      )}

      {success && (
        <div
          role="status"
          className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-sm font-medium flex items-center justify-between"
        >
          <span>{success}</span>
          <button
            type="button"
            onClick={() => setSuccess(null)}
            className="text-emerald-600 hover:text-emerald-800 text-sm font-bold ml-3"
          >
            ×
          </button>
        </div>
      )}

      {loading ? (
        <div className="p-16 text-center text-muted font-mono text-sm bg-white dark:bg-[#121730] rounded-3xl border border-black/10 dark:border-white/10">
          Loading project details…
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8" noValidate>
          {/* SECTION 1: Core Details & URLs */}
          <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#121730] border border-black/10 dark:border-white/10 space-y-6">
            <h2 className="text-lg font-bold text-ink dark:text-cream border-b border-black/5 dark:border-white/5 pb-3">
              1. Project Overview &amp; Links
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Title */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="field-project-title"
                  className="font-mono text-xs uppercase tracking-wider font-semibold text-ink dark:text-cream"
                >
                  Project Title <span className="text-coral">*</span>
                </label>
                <input
                  id="field-project-title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. FixFlow"
                  className="w-full px-4 py-3 text-base rounded-xl bg-[#FAF8F5] dark:bg-[#0B0F24] border border-black/15 dark:border-white/15 text-ink dark:text-cream focus:outline-none focus:ring-2 focus:ring-royal"
                />
              </div>

              {/* Slug */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="field-project-slug"
                  className="font-mono text-xs uppercase tracking-wider font-semibold text-ink dark:text-cream"
                >
                  URL Slug <span className="text-coral">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 font-mono text-sm text-muted dark:text-[#A8A8B8] select-none">
                    /
                  </span>
                  <input
                    id="field-project-slug"
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    placeholder="fixflow"
                    className="w-full pl-8 pr-4 py-3 text-base font-mono rounded-xl bg-[#FAF8F5] dark:bg-[#0B0F24] border border-black/15 dark:border-white/15 text-ink dark:text-cream focus:outline-none focus:ring-2 focus:ring-royal"
                  />
                </div>
              </div>
            </div>

            {/* Short Description */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="field-project-short-desc"
                className="font-mono text-xs uppercase tracking-wider font-semibold text-ink dark:text-cream"
              >
                Short Description (Cards &amp; Meta) <span className="text-coral">*</span>
              </label>
              <input
                id="field-project-short-desc"
                type="text"
                required
                value={formData.shortDescription}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    shortDescription: e.target.value,
                  }))
                }
                placeholder="Campus complaint workflow system with multi-role routing, SLA tracking, and AI triage."
                className="w-full px-4 py-3 text-base rounded-xl bg-[#FAF8F5] dark:bg-[#0B0F24] border border-black/15 dark:border-white/15 text-ink dark:text-cream focus:outline-none focus:ring-2 focus:ring-royal"
              />
            </div>

            {/* Long Description */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="field-project-long-desc"
                className="font-mono text-xs uppercase tracking-wider font-semibold text-ink dark:text-cream"
              >
                Long Description (Detailed Overview)
              </label>
              <textarea
                id="field-project-long-desc"
                rows={3}
                value={formData.longDescription}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    longDescription: e.target.value,
                  }))
                }
                placeholder="End-to-end grievance management platform for colleges featuring 3 roles..."
                className="w-full px-4 py-3 text-base rounded-xl bg-[#FAF8F5] dark:bg-[#0B0F24] border border-black/15 dark:border-white/15 text-ink dark:text-cream focus:outline-none focus:ring-2 focus:ring-royal"
              />
            </div>

            {/* Tech Stack */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="field-project-stack"
                className="font-mono text-xs uppercase tracking-wider font-semibold text-ink dark:text-cream"
              >
                Tech Stack (Comma-separated list)
              </label>
              <input
                id="field-project-stack"
                type="text"
                value={formData.stackString}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    stackString: e.target.value,
                  }))
                }
                placeholder="React 19, Node.js, Express 5, MongoDB, Tailwind 4, Gemini AI"
                className="w-full px-4 py-3 text-base rounded-xl bg-[#FAF8F5] dark:bg-[#0B0F24] border border-black/15 dark:border-white/15 text-ink dark:text-cream focus:outline-none focus:ring-2 focus:ring-royal"
              />
              <span className="text-xs font-mono text-muted dark:text-[#A8A8B8]">
                Separate technologies with commas.
              </span>
            </div>

            {/* Links: GitHub & Live URL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="field-project-github"
                  className="font-mono text-xs uppercase tracking-wider font-semibold text-ink dark:text-cream"
                >
                  GitHub Repository URL
                </label>
                <input
                  id="field-project-github"
                  type="url"
                  value={formData.githubUrl}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      githubUrl: e.target.value,
                    }))
                  }
                  placeholder="https://github.com/FixFlow-Official/FixFlow"
                  className="w-full px-4 py-3 text-base rounded-xl bg-[#FAF8F5] dark:bg-[#0B0F24] border border-black/15 dark:border-white/15 text-ink dark:text-cream focus:outline-none focus:ring-2 focus:ring-royal"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="field-project-live"
                  className="font-mono text-xs uppercase tracking-wider font-semibold text-ink dark:text-cream"
                >
                  Live Demo URL (Optional)
                </label>
                <input
                  id="field-project-live"
                  type="url"
                  value={formData.liveUrl}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      liveUrl: e.target.value,
                    }))
                  }
                  placeholder="https://your-demo-url.com (Leave empty if none)"
                  className="w-full px-4 py-3 text-base rounded-xl bg-[#FAF8F5] dark:bg-[#0B0F24] border border-black/15 dark:border-white/15 text-ink dark:text-cream focus:outline-none focus:ring-2 focus:ring-royal"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Image & Media Upload (Cloudinary) */}
          <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#121730] border border-black/10 dark:border-white/10 space-y-6">
            <h2 className="text-lg font-bold text-ink dark:text-cream border-b border-black/5 dark:border-white/5 pb-3">
              2. Showcase Image &amp; Media (Cloudinary)
            </h2>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Image Preview */}
              <div className="w-40 h-28 rounded-2xl bg-[#FAF8F5] dark:bg-[#0B0F24] border border-black/15 dark:border-white/15 overflow-hidden flex items-center justify-center shrink-0 relative">
                {formData.imageUrl ? (
                  <Image
                    src={formData.imageUrl}
                    alt="Project preview"
                    fill
                    className="object-cover"
                    sizes="160px"
                    unoptimized
                  />
                ) : (
                  <span className="text-muted dark:text-[#A8A8B8] font-mono text-[11px] text-center px-2">
                    No image uploaded
                  </span>
                )}
              </div>

              {/* Upload Controls */}
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-royal text-white font-medium text-xs uppercase tracking-wider cursor-pointer hover:bg-royal/90 transition-colors shadow-sm select-none">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    {uploadingImage ? "Uploading to Cloudinary…" : "Upload New Image"}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      disabled={uploadingImage}
                      onChange={handleImageFileChange}
                    />
                  </label>

                  {formData.imageUrl && (
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, imageUrl: "" }))}
                      className="px-4 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-full transition-colors"
                    >
                      Clear image
                    </button>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="field-project-image-url"
                    className="font-mono text-[11px] uppercase tracking-wider text-muted dark:text-[#A8A8B8]"
                  >
                    Or paste direct Cloudinary / Image URL:
                  </label>
                  <input
                    id="field-project-image-url"
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        imageUrl: e.target.value,
                      }))
                    }
                    placeholder="/images/fixflow-card.png or https://res.cloudinary.com/..."
                    className="w-full px-4 py-2.5 text-sm rounded-xl bg-[#FAF8F5] dark:bg-[#0B0F24] border border-black/15 dark:border-white/15 text-ink dark:text-cream focus:outline-none focus:ring-2 focus:ring-royal"
                  />
                </div>
                <span className="text-[11px] font-mono text-muted dark:text-[#A8A8B8] block">
                  Accepted formats: JPG, PNG, WEBP (Max 5MB). Uploads automatically to Cloudinary.
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 3: Case Study Details */}
          <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#121730] border border-black/10 dark:border-white/10 space-y-6">
            <h2 className="text-lg font-bold text-ink dark:text-cream border-b border-black/5 dark:border-white/5 pb-3">
              3. Case Study Breakdown (Overview, Challenge, Solution, Outcome)
            </h2>

            <div className="grid grid-cols-1 gap-5">
              {/* Overview */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="field-case-overview"
                  className="font-mono text-xs uppercase tracking-wider font-semibold text-ink dark:text-cream"
                >
                  Case Study: Overview
                </label>
                <textarea
                  id="field-case-overview"
                  rows={3}
                  value={formData.caseStudy.overview}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      caseStudy: { ...prev.caseStudy, overview: e.target.value },
                    }))
                  }
                  placeholder="Context and purpose of the project..."
                  className="w-full px-4 py-3 text-base rounded-xl bg-[#FAF8F5] dark:bg-[#0B0F24] border border-black/15 dark:border-white/15 text-ink dark:text-cream focus:outline-none focus:ring-2 focus:ring-royal"
                />
              </div>

              {/* Challenge */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="field-case-challenge"
                  className="font-mono text-xs uppercase tracking-wider font-semibold text-ink dark:text-cream"
                >
                  Case Study: The Challenge
                </label>
                <textarea
                  id="field-case-challenge"
                  rows={3}
                  value={formData.caseStudy.challenge}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      caseStudy: { ...prev.caseStudy, challenge: e.target.value },
                    }))
                  }
                  placeholder="The bottlenecks and problems addressed..."
                  className="w-full px-4 py-3 text-base rounded-xl bg-[#FAF8F5] dark:bg-[#0B0F24] border border-black/15 dark:border-white/15 text-ink dark:text-cream focus:outline-none focus:ring-2 focus:ring-royal"
                />
              </div>

              {/* Solution */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="field-case-solution"
                  className="font-mono text-xs uppercase tracking-wider font-semibold text-ink dark:text-cream"
                >
                  Case Study: The Solution
                </label>
                <textarea
                  id="field-case-solution"
                  rows={3}
                  value={formData.caseStudy.solution}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      caseStudy: { ...prev.caseStudy, solution: e.target.value },
                    }))
                  }
                  placeholder="Technical architecture, design patterns, and engineering choices..."
                  className="w-full px-4 py-3 text-base rounded-xl bg-[#FAF8F5] dark:bg-[#0B0F24] border border-black/15 dark:border-white/15 text-ink dark:text-cream focus:outline-none focus:ring-2 focus:ring-royal"
                />
              </div>

              {/* Outcome */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="field-case-outcome"
                  className="font-mono text-xs uppercase tracking-wider font-semibold text-ink dark:text-cream"
                >
                  Case Study: The Outcome &amp; Impact
                </label>
                <textarea
                  id="field-case-outcome"
                  rows={3}
                  value={formData.caseStudy.outcome}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      caseStudy: { ...prev.caseStudy, outcome: e.target.value },
                    }))
                  }
                  placeholder="Real deliverables, tests passing, robustness..."
                  className="w-full px-4 py-3 text-base rounded-xl bg-[#FAF8F5] dark:bg-[#0B0F24] border border-black/15 dark:border-white/15 text-ink dark:text-cream focus:outline-none focus:ring-2 focus:ring-royal"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: Verified Results & Display Settings */}
          <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#121730] border border-black/10 dark:border-white/10 space-y-6">
            <h2 className="text-lg font-bold text-ink dark:text-cream border-b border-black/5 dark:border-white/5 pb-3">
              4. Results &amp; Display Configuration
            </h2>

            {/* Verified Result Text */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="field-project-result"
                className="font-mono text-xs uppercase tracking-wider font-semibold text-ink dark:text-cream"
              >
                Result Metric Badge (Only verified facts)
              </label>
              <input
                id="field-project-result"
                type="text"
                value={formData.resultText}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    resultText: e.target.value,
                  }))
                }
                placeholder="e.g. 37,612 lines · 183 files · 43 tests (Leave blank if not verified)"
                className="w-full px-4 py-3 text-base rounded-xl bg-[#FAF8F5] dark:bg-[#0B0F24] border border-black/15 dark:border-white/15 text-ink dark:text-cream focus:outline-none focus:ring-2 focus:ring-royal"
              />
              <span className="text-xs font-mono text-muted dark:text-[#A8A8B8]">
                Hard Rule: Never invent stats or scores. Only verified metrics are permitted.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-end">
              {/* Order */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="field-project-order"
                  className="font-mono text-xs uppercase tracking-wider font-semibold text-ink dark:text-cream"
                >
                  Display Order
                </label>
                <input
                  id="field-project-order"
                  type="number"
                  min="0"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      order: parseInt(e.target.value, 10) || 0,
                    }))
                  }
                  className="w-full px-4 py-3 text-base rounded-xl bg-[#FAF8F5] dark:bg-[#0B0F24] border border-black/15 dark:border-white/15 text-ink dark:text-cream focus:outline-none focus:ring-2 focus:ring-royal"
                />
              </div>

              {/* Featured Toggle */}
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#FAF8F5] dark:bg-[#0B0F24] border border-black/15 dark:border-white/15">
                <input
                  id="field-project-featured"
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      featured: e.target.checked,
                    }))
                  }
                  className="w-5 h-5 rounded border-black/20 text-royal focus:ring-royal cursor-pointer"
                />
                <label
                  htmlFor="field-project-featured"
                  className="text-sm font-semibold text-ink dark:text-cream cursor-pointer select-none"
                >
                  Featured on Home
                </label>
              </div>

              {/* Visible Toggle */}
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#FAF8F5] dark:bg-[#0B0F24] border border-black/15 dark:border-white/15">
                <input
                  id="field-project-visible"
                  type="checkbox"
                  checked={formData.visible}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      visible: e.target.checked,
                    }))
                  }
                  className="w-5 h-5 rounded border-black/20 text-royal focus:ring-royal cursor-pointer"
                />
                <label
                  htmlFor="field-project-visible"
                  className="text-sm font-semibold text-ink dark:text-cream cursor-pointer select-none"
                >
                  Visible on Site
                </label>
              </div>
            </div>
          </div>

          {/* Form Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-black/10 dark:border-white/10">
            <Link
              href="/admin/projects"
              className="px-6 py-3 rounded-full border border-black/15 dark:border-white/15 text-muted dark:text-[#A8A8B8] hover:text-ink dark:hover:text-cream font-medium text-sm transition-colors select-none"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 rounded-full bg-coral hover:bg-[#E84E2E] text-white font-semibold text-sm transition-all shadow-sm active:scale-95 disabled:opacity-50 select-none cursor-pointer"
            >
              {saving ? "Saving Project…" : isNew ? "Create Project" : "Save Changes"}
            </button>
          </div>
        </form>
      )}
    </AdminShell>
  );
}
