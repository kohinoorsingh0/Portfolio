"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";

export interface ProjectItem {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  longDescription?: string;
  stack?: string[];
  imageUrl?: string;
  githubUrl?: string | null;
  liveUrl?: string | null;
  featured: boolean;
  order: number;
  visible: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Filter state: "All", "Featured", "Standard"
  const [filter, setFilter] = useState<string>("All");

  // Delete confirmation modal state
  const [deletingProject, setDeletingProject] = useState<ProjectItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const fetchProjects = async () => {
    try {
      setError(null);
      const res = await fetch(`${apiUrl.replace(/\/$/, "")}/admin/projects`, {
        credentials: "include",
      });

      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setProjects(Array.isArray(data) ? data : []);
      } else {
        setError("Failed to fetch projects from server.");
      }
    } catch {
      setError("Network error loading projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiUrl]);

  // Quick toggle visibility directly from list
  const handleToggleVisibility = async (project: ProjectItem) => {
    const updatedVisible = !project.visible;
    // Optimistic UI update
    setProjects((prev) =>
      prev.map((p) =>
        p._id === project._id ? { ...p, visible: updatedVisible } : p
      )
    );

    try {
      const res = await fetch(
        `${apiUrl.replace(/\/$/, "")}/admin/projects/${project._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            ...project,
            visible: updatedVisible,
          }),
        }
      );

      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }

      if (!res.ok) {
        // Revert on error
        setProjects((prev) =>
          prev.map((p) =>
            p._id === project._id ? { ...p, visible: project.visible } : p
          )
        );
        setError("Failed to update project visibility.");
      } else {
        setSuccess(
          `"${project.title}" is now ${updatedVisible ? "visible" : "hidden"}.`
        );
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch {
      setError("Network error updating visibility.");
    }
  };

  // Confirm and execute project deletion
  const handleDeleteConfirm = async () => {
    if (!deletingProject) return;

    setIsDeleting(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(
        `${apiUrl.replace(/\/$/, "")}/admin/projects/${deletingProject._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.ok) {
        setProjects((prev) => prev.filter((p) => p._id !== deletingProject._id));
        setSuccess(`Project "${deletingProject.title}" was permanently deleted.`);
        setDeletingProject(null);
        setTimeout(() => setSuccess(null), 3500);
      } else {
        setError(data.error || "Failed to delete project.");
      }
    } catch {
      setError("Network error deleting project.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered and sorted projects
  const filteredProjects = useMemo(() => {
    let list = [...projects];
    if (filter === "Featured") {
      list = list.filter((p) => p.featured);
    } else if (filter === "Standard") {
      list = list.filter((p) => !p.featured);
    }
    return list.sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [projects, filter]);

  // Statistics counts
  const stats = useMemo(() => {
    const total = projects.length;
    const featured = projects.filter((p) => p.featured).length;
    const standard = total - featured;
    const visibleCount = projects.filter((p) => p.visible).length;
    const hiddenCount = total - visibleCount;
    return { total, featured, standard, visibleCount, hiddenCount };
  }, [projects]);

  return (
    <AdminShell>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <span className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-royal dark:text-[#7888FF] mb-2 block select-none">
            WORK SHOWCASE
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-ink dark:text-cream">
            Projects Management
          </h1>
          <p className="text-muted dark:text-[#A8A8B8] text-sm sm:text-base mt-1.5 max-w-2xl leading-relaxed">
            Manage your portfolio case studies, featured assignments, display order, and live URLs.
          </p>
        </div>

        <Link
          href="/admin/projects/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-coral hover:bg-[#E84E2E] text-white font-medium text-sm transition-all duration-200 shadow-sm active:scale-95 shrink-0 select-none cursor-pointer"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add New Project
        </Link>
      </div>

      {/* Summary Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#121730] border border-black/10 dark:border-white/10">
          <span className="block font-mono text-[10px] uppercase font-bold tracking-wider text-muted dark:text-[#A8A8B8]">
            Total Projects
          </span>
          <span className="text-2xl font-black text-ink dark:text-cream mt-0.5 block">
            {stats.total}
          </span>
        </div>
        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#121730] border border-black/10 dark:border-white/10">
          <span className="block font-mono text-[10px] uppercase font-bold tracking-wider text-royal dark:text-[#7888FF]">
            Featured Main
          </span>
          <span className="text-2xl font-black text-ink dark:text-cream mt-0.5 block">
            {stats.featured}
          </span>
        </div>
        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#121730] border border-black/10 dark:border-white/10">
          <span className="block font-mono text-[10px] uppercase font-bold tracking-wider text-muted dark:text-[#A8A8B8]">
            Standard
          </span>
          <span className="text-2xl font-black text-ink dark:text-cream mt-0.5 block">
            {stats.standard}
          </span>
        </div>
        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#121730] border border-black/10 dark:border-white/10">
          <span className="block font-mono text-[10px] uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400">
            Live
          </span>
          <span className="text-2xl font-black text-ink dark:text-cream mt-0.5 block">
            {stats.visibleCount}
          </span>
        </div>
        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#121730] border border-black/10 dark:border-white/10">
          <span className="block font-mono text-[10px] uppercase font-bold tracking-wider text-zinc-500 dark:text-zinc-400">
            Hidden
          </span>
          <span className="text-2xl font-black text-ink dark:text-cream mt-0.5 block">
            {stats.hiddenCount}
          </span>
        </div>
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

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["All", "Featured", "Standard"].map((tab) => {
          const active = filter === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-full font-mono text-xs font-semibold tracking-wider transition-all select-none cursor-pointer ${
                active
                  ? "bg-royal text-white shadow-sm"
                  : "bg-white dark:bg-[#121730] text-muted dark:text-[#A8A8B8] border border-black/10 dark:border-white/10 hover:text-ink dark:hover:text-cream"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Main Projects Table / Cards */}
      {loading ? (
        <div className="p-16 text-center text-muted font-mono text-sm bg-white dark:bg-[#121730] rounded-3xl border border-black/10 dark:border-white/10">
          Loading projects showcase…
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="p-16 text-center bg-white dark:bg-[#121730] rounded-3xl border border-black/10 dark:border-white/10">
          <p className="text-muted dark:text-[#A8A8B8] font-mono text-sm mb-4">
            No projects found for filter &ldquo;{filter}&rdquo;.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#121730] rounded-3xl border border-black/10 dark:border-white/10 overflow-hidden shadow-sm">
          {/* Desktop Table View (sm:block) */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#FAF8F5] dark:bg-[#0B0F24] border-b border-black/5 dark:border-white/5 text-muted dark:text-[#A8A8B8] font-mono text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6 font-semibold w-16 text-center">Order</th>
                  <th className="py-3.5 px-6 font-semibold">Title</th>
                  <th className="py-3.5 px-6 font-semibold">Slug</th>
                  <th className="py-3.5 px-6 font-semibold text-center">Featured</th>
                  <th className="py-3.5 px-6 font-semibold text-center">Visible</th>
                  <th className="py-3.5 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/5">
                {filteredProjects.map((project) => (
                  <tr
                    key={project._id || project.slug}
                    className="hover:bg-black/[0.015] dark:hover:bg-white/[0.015] transition-colors"
                  >
                    {/* Order */}
                    <td className="py-4 px-6 text-center font-mono text-xs text-muted dark:text-[#A8A8B8]">
                      #{project.order}
                    </td>

                    {/* Title */}
                    <td className="py-4 px-6 font-bold text-ink dark:text-cream text-base">
                      <div className="flex items-center gap-2">
                        <span>{project.title}</span>
                        {project.featured && (
                          <span className="font-mono text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-lime/30 text-ink dark:bg-lime/20 dark:text-lime border border-lime/40">
                            Featured
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-normal text-muted dark:text-[#A8A8B8] block truncate max-w-sm mt-0.5">
                        {project.shortDescription}
                      </span>
                    </td>

                    {/* Slug */}
                    <td className="py-4 px-6 font-mono text-xs text-royal dark:text-[#7888FF]">
                      /{project.slug}
                    </td>

                    {/* Featured */}
                    <td className="py-4 px-6 text-center font-mono text-xs">
                      {project.featured ? (
                        <span className="inline-flex items-center gap-1 text-royal dark:text-[#7888FF] font-semibold">
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          Yes
                        </span>
                      ) : (
                        <span className="text-muted dark:text-[#A8A8B8]">No</span>
                      )}
                    </td>

                    {/* Visible Toggle */}
                    <td className="py-4 px-6 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleVisibility(project)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-xs font-medium border transition-colors select-none cursor-pointer ${
                          project.visible
                            ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50"
                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700"
                        }`}
                        title="Click to toggle visibility"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            project.visible ? "bg-emerald-500" : "bg-zinc-400"
                          }`}
                        />
                        {project.visible ? "Visible" : "Hidden"}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          href={`/admin/projects/${project._id}`}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-royal dark:text-[#7888FF] hover:bg-royal/10 dark:hover:bg-royal/20 transition-colors select-none"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeletingProject(project)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors select-none cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View (<sm:block) */}
          <div className="sm:hidden divide-y divide-black/5 dark:divide-white/5">
            {filteredProjects.map((project) => (
              <div key={project._id || project.slug} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="font-mono text-[10px] text-muted dark:text-[#A8A8B8] block mb-1">
                      Order #{project.order} · /{project.slug}
                    </span>
                    <h3 className="font-bold text-base text-ink dark:text-cream flex items-center gap-2">
                      <span>{project.title}</span>
                      {project.featured && (
                        <span className="font-mono text-[8px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-lime/30 text-ink dark:bg-lime/20 dark:text-lime border border-lime/40">
                          Featured
                        </span>
                      )}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleVisibility(project)}
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono text-[11px] font-medium border shrink-0 ${
                      project.visible
                        ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border-zinc-200"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        project.visible ? "bg-emerald-500" : "bg-zinc-400"
                      }`}
                    />
                    {project.visible ? "Visible" : "Hidden"}
                  </button>
                </div>

                <p className="text-xs text-muted dark:text-[#A8A8B8] line-clamp-2">
                  {project.shortDescription}
                </p>

                <div className="flex items-center gap-2 pt-2 border-t border-black/5 dark:border-white/5">
                  <Link
                    href={`/admin/projects/${project._id}`}
                    className="flex-1 py-2 rounded-xl text-xs font-semibold text-center text-royal dark:text-[#7888FF] bg-royal/5 dark:bg-royal/15"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => setDeletingProject(project)}
                    className="flex-1 py-2 rounded-xl text-xs font-semibold text-center text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* DELETE CONFIRMATION DIALOG                                     */}
      {/* ============================================================== */}
      {deletingProject && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-project-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        >
          <div className="w-full max-w-md bg-white dark:bg-[#151C3B] rounded-3xl p-6 sm:p-8 border border-black/10 dark:border-white/10 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>

            <h3
              id="delete-project-title"
              className="text-xl font-black text-ink dark:text-cream tracking-tight"
            >
              Confirm Project Deletion
            </h3>
            <p className="text-muted dark:text-[#A8A8B8] text-sm mt-2 leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <strong className="text-ink dark:text-cream">
                &ldquo;{deletingProject.title}&rdquo;
              </strong>{" "}
              (slug: <code className="font-mono text-xs">/{deletingProject.slug}</code>)?
              This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-black/5 dark:border-white/5">
              <button
                type="button"
                onClick={() => setDeletingProject(null)}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-full border border-black/15 dark:border-white/15 text-muted dark:text-[#A8A8B8] hover:text-ink dark:hover:text-cream text-sm font-medium transition-colors select-none cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-all shadow-sm active:scale-95 disabled:opacity-50 select-none cursor-pointer"
              >
                {isDeleting ? "Deleting…" : "Delete Project"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
