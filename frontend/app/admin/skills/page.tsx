"use client";

import { useState, useEffect, useMemo, FormEvent } from "react";
import AdminShell from "@/components/admin/AdminShell";

export type SkillCategory =
  | "Frontend"
  | "Backend"
  | "Database"
  | "Tools & DevOps";

export type SkillLevel = "Strong" | "Working" | "Beginner";

export interface SkillItem {
  _id: string;
  category: SkillCategory;
  name: string;
  level: SkillLevel;
  order: number;
  visible: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const CATEGORIES: SkillCategory[] = [
  "Frontend",
  "Backend",
  "Database",
  "Tools & DevOps",
];

const LEVELS: SkillLevel[] = ["Strong", "Working", "Beginner"];

const LEVEL_BADGE_STYLES: Record<SkillLevel, string> = {
  Strong:
    "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60",
  Working:
    "bg-sky-50 text-royal dark:bg-royal/20 dark:text-[#7888FF] border-sky-200 dark:border-royal/30",
  Beginner:
    "bg-zinc-100 text-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700",
};

const CATEGORY_PILL_STYLES: Record<SkillCategory, string> = {
  Frontend:
    "bg-indigo-50 text-royal dark:bg-royal/20 dark:text-[#7888FF] border-indigo-200 dark:border-royal/30",
  Backend:
    "bg-lime/20 text-ink dark:bg-lime/15 dark:text-lime border-lime/40",
  Database:
    "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800/60",
  "Tools & DevOps":
    "bg-purple-50 text-zinc-800 dark:bg-white/10 dark:text-cream border-zinc-200 dark:border-white/10",
};

interface FormDataState {
  category: SkillCategory;
  name: string;
  level: SkillLevel;
  order: number;
  visible: boolean;
}

const DEFAULT_FORM: FormDataState = {
  category: "Frontend",
  name: "",
  level: "Strong",
  order: 1,
  visible: true,
};

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Filter tab: "All" or a specific category
  const [selectedFilter, setSelectedFilter] = useState<string>("All");

  // Modal / Drawer state for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<SkillItem | null>(null);
  const [formData, setFormData] = useState<FormDataState>(DEFAULT_FORM);

  // Delete confirmation dialog state
  const [deletingSkill, setDeletingSkill] = useState<SkillItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  // Fetch skills from GET /api/admin/skills
  const fetchSkills = async () => {
    try {
      setError(null);
      const res = await fetch(`${apiUrl.replace(/\/$/, "")}/admin/skills`, {
        credentials: "include",
      });

      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setSkills(Array.isArray(data) ? data : []);
      } else {
        setError("Failed to fetch skills from server.");
      }
    } catch {
      setError("Network error loading skills.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiUrl]);

  // Open modal in "Add" mode
  const handleOpenAdd = () => {
    setEditingSkill(null);
    const maxOrder = skills.reduce((max, s) => Math.max(max, s.order || 0), 0);
    setFormData({
      category: selectedFilter !== "All" ? (selectedFilter as SkillCategory) : "Frontend",
      name: "",
      level: "Strong",
      order: maxOrder + 1,
      visible: true,
    });
    setError(null);
    setSuccess(null);
    setIsModalOpen(true);
  };

  // Open modal in "Edit" mode
  const handleOpenEdit = (skill: SkillItem) => {
    setEditingSkill(skill);
    setFormData({
      category: skill.category,
      name: skill.name,
      level: skill.level,
      order: skill.order,
      visible: skill.visible,
    });
    setError(null);
    setSuccess(null);
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSkill(null);
  };

  // Quick toggle visibility directly from list
  const handleToggleVisibility = async (skill: SkillItem) => {
    try {
      const updatedVisible = !skill.visible;
      // Optimistic update
      setSkills((prev) =>
        prev.map((s) =>
          s._id === skill._id ? { ...s, visible: updatedVisible } : s
        )
      );

      const res = await fetch(
        `${apiUrl.replace(/\/$/, "")}/admin/skills/${skill._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            category: skill.category,
            name: skill.name,
            level: skill.level,
            order: skill.order,
            visible: updatedVisible,
          }),
        }
      );

      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }

      if (!res.ok) {
        // Revert on failure
        setSkills((prev) =>
          prev.map((s) =>
            s._id === skill._id ? { ...s, visible: skill.visible } : s
          )
        );
        setError("Failed to update visibility toggle.");
      } else {
        setSuccess(`"${skill.name}" is now ${updatedVisible ? "visible" : "hidden"}.`);
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch {
      setError("Network error updating visibility.");
    }
  };

  // Handle Form Submission (Add or Edit)
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedName = formData.name.trim();

    if (!trimmedName) {
      setError("Skill name is required");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    const payload = {
      category: formData.category,
      name: trimmedName,
      level: formData.level,
      order: Number(formData.order) || 0,
      visible: Boolean(formData.visible),
    };

    try {
      const endpoint = editingSkill
        ? `${apiUrl.replace(/\/$/, "")}/admin/skills/${editingSkill._id}`
        : `${apiUrl.replace(/\/$/, "")}/admin/skills`;

      const method = editingSkill ? "PUT" : "POST";

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
        if (editingSkill) {
          setSkills((prev) =>
            prev.map((s) => (s._id === editingSkill._id ? data.skill : s))
          );
          setSuccess(`Skill "${trimmedName}" updated successfully.`);
        } else {
          setSkills((prev) => [...prev, data.skill]);
          setSuccess(`Skill "${trimmedName}" created successfully.`);
        }
        setIsModalOpen(false);
        setEditingSkill(null);
        setTimeout(() => setSuccess(null), 3500);
      } else {
        setError(data.error || "Failed to save skill. Please try again.");
      }
    } catch {
      setError("Network error saving skill.");
    } finally {
      setSaving(false);
    }
  };

  // Confirm delete
  const handleDeleteConfirm = async () => {
    if (!deletingSkill) return;

    setIsDeleting(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(
        `${apiUrl.replace(/\/$/, "")}/admin/skills/${deletingSkill._id}`,
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
        setSkills((prev) => prev.filter((s) => s._id !== deletingSkill._id));
        setSuccess(`Skill "${deletingSkill.name}" was permanently deleted.`);
        setDeletingSkill(null);
        setTimeout(() => setSuccess(null), 3500);
      } else {
        setError(data.error || "Failed to delete skill.");
      }
    } catch {
      setError("Network error deleting skill.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered skills list
  const filteredSkills = useMemo(() => {
    let list = [...skills];
    if (selectedFilter !== "All") {
      list = list.filter((s) => s.category === selectedFilter);
    }
    return list.sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [skills, selectedFilter]);

  // Summary counts
  const stats = useMemo(() => {
    const total = skills.length;
    const strong = skills.filter((s) => s.level === "Strong").length;
    const working = skills.filter((s) => s.level === "Working").length;
    const beginner = skills.filter((s) => s.level === "Beginner").length;
    const visibleCount = skills.filter((s) => s.visible).length;
    const hiddenCount = total - visibleCount;
    return { total, strong, working, beginner, visibleCount, hiddenCount };
  }, [skills]);

  return (
    <AdminShell>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <span className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-royal dark:text-[#7888FF] mb-2 block select-none">
            TECHNICAL TOOLBOX
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-ink dark:text-cream">
            Skills Management
          </h1>
          <p className="text-muted dark:text-[#A8A8B8] text-sm sm:text-base mt-1.5 max-w-2xl leading-relaxed">
            Manage your technical skills, categorical grouping, proficiency levels, and visibility status.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
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
          Add New Skill
        </button>
      </div>

      {/* Stats Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#121730] border border-black/10 dark:border-white/10">
          <span className="block font-mono text-[10px] uppercase font-bold tracking-wider text-muted dark:text-[#A8A8B8]">
            Total Skills
          </span>
          <span className="text-2xl font-black text-ink dark:text-cream mt-0.5 block">
            {stats.total}
          </span>
        </div>
        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#121730] border border-black/10 dark:border-white/10">
          <span className="block font-mono text-[10px] uppercase font-bold tracking-wider text-emerald-700 dark:text-emerald-400">
            Strong
          </span>
          <span className="text-2xl font-black text-ink dark:text-cream mt-0.5 block">
            {stats.strong}
          </span>
        </div>
        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#121730] border border-black/10 dark:border-white/10">
          <span className="block font-mono text-[10px] uppercase font-bold tracking-wider text-royal dark:text-[#7888FF]">
            Working
          </span>
          <span className="text-2xl font-black text-ink dark:text-cream mt-0.5 block">
            {stats.working}
          </span>
        </div>
        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#121730] border border-black/10 dark:border-white/10">
          <span className="block font-mono text-[10px] uppercase font-bold tracking-wider text-muted dark:text-[#A8A8B8]">
            Beginner
          </span>
          <span className="text-2xl font-black text-ink dark:text-cream mt-0.5 block">
            {stats.beginner}
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

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["All", ...CATEGORIES].map((cat) => {
          const active = selectedFilter === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedFilter(cat)}
              className={`px-4 py-2 rounded-full font-mono text-xs font-semibold tracking-wider transition-all select-none cursor-pointer ${
                active
                  ? "bg-royal text-white shadow-sm"
                  : "bg-white dark:bg-[#121730] text-muted dark:text-[#A8A8B8] border border-black/10 dark:border-white/10 hover:text-ink dark:hover:text-cream"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Main Skills Content */}
      {loading ? (
        <div className="p-16 text-center text-muted font-mono text-sm bg-white dark:bg-[#121730] rounded-3xl border border-black/10 dark:border-white/10">
          Loading technical skills…
        </div>
      ) : filteredSkills.length === 0 ? (
        <div className="p-16 text-center bg-white dark:bg-[#121730] rounded-3xl border border-black/10 dark:border-white/10">
          <p className="text-muted dark:text-[#A8A8B8] font-mono text-sm mb-4">
            No skills found in category &ldquo;{selectedFilter}&rdquo;.
          </p>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-royal text-white text-xs font-medium uppercase tracking-wider"
          >
            Add first skill
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#121730] rounded-3xl border border-black/10 dark:border-white/10 overflow-hidden shadow-sm">
          {/* Desktop Table View (sm:block) */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#FAF8F5] dark:bg-[#0B0F24] border-b border-black/5 dark:border-white/5 text-muted dark:text-[#A8A8B8] font-mono text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6 font-semibold w-16 text-center">Order</th>
                  <th className="py-3.5 px-6 font-semibold">Skill Name</th>
                  <th className="py-3.5 px-6 font-semibold">Category</th>
                  <th className="py-3.5 px-6 font-semibold">Proficiency</th>
                  <th className="py-3.5 px-6 font-semibold text-center">Status</th>
                  <th className="py-3.5 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/5">
                {filteredSkills.map((skill) => (
                  <tr
                    key={skill._id || `${skill.category}-${skill.name}`}
                    className="hover:bg-black/[0.015] dark:hover:bg-white/[0.015] transition-colors"
                  >
                    {/* Order */}
                    <td className="py-4 px-6 text-center font-mono text-xs text-muted dark:text-[#A8A8B8]">
                      #{skill.order}
                    </td>

                    {/* Name */}
                    <td className="py-4 px-6 font-bold text-ink dark:text-cream text-base">
                      {skill.name}
                    </td>

                    {/* Category */}
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block font-mono text-[11px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border ${
                          CATEGORY_PILL_STYLES[skill.category] ||
                          "bg-zinc-100 text-zinc-800"
                        }`}
                      >
                        {skill.category}
                      </span>
                    </td>

                    {/* Level */}
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block font-mono text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                          LEVEL_BADGE_STYLES[skill.level] ||
                          "bg-zinc-100 text-zinc-800"
                        }`}
                      >
                        {skill.level}
                      </span>
                    </td>

                    {/* Visibility Toggle */}
                    <td className="py-4 px-6 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleVisibility(skill)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-xs font-medium border transition-colors select-none cursor-pointer ${
                          skill.visible
                            ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50"
                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700"
                        }`}
                        title="Click to toggle visibility"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            skill.visible ? "bg-emerald-500" : "bg-zinc-400"
                          }`}
                        />
                        {skill.visible ? "Visible" : "Hidden"}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(skill)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-royal dark:text-[#7888FF] hover:bg-royal/10 dark:hover:bg-royal/20 transition-colors select-none cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingSkill(skill)}
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
            {filteredSkills.map((skill) => (
              <div key={skill._id || `${skill.category}-${skill.name}`} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="font-mono text-[10px] text-muted dark:text-[#A8A8B8] block mb-1">
                      Order #{skill.order}
                    </span>
                    <h3 className="font-bold text-base text-ink dark:text-cream">
                      {skill.name}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleVisibility(skill)}
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono text-[11px] font-medium border shrink-0 ${
                      skill.visible
                        ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border-zinc-200"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        skill.visible ? "bg-emerald-500" : "bg-zinc-400"
                      }`}
                    />
                    {skill.visible ? "Visible" : "Hidden"}
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`font-mono text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${
                      CATEGORY_PILL_STYLES[skill.category] || "bg-zinc-100"
                    }`}
                  >
                    {skill.category}
                  </span>
                  <span
                    className={`font-mono text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${
                      LEVEL_BADGE_STYLES[skill.level] || "bg-zinc-100"
                    }`}
                  >
                    {skill.level}
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-black/5 dark:border-white/5">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(skill)}
                    className="flex-1 py-2 rounded-xl text-xs font-semibold text-center text-royal dark:text-[#7888FF] bg-royal/5 dark:bg-royal/15"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingSkill(skill)}
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
      {/* ADD / EDIT MODAL                                               */}
      {/* ============================================================== */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        >
          <div className="w-full max-w-lg bg-white dark:bg-[#151C3B] rounded-3xl p-6 sm:p-8 border border-black/10 dark:border-white/10 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-black/5 dark:border-white/5 mb-6">
              <div>
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-royal dark:text-[#7888FF] block">
                  {editingSkill ? "Modify Skill" : "New Skill Entry"}
                </span>
                <h2
                  id="modal-title"
                  className="text-xl sm:text-2xl font-black text-ink dark:text-cream tracking-tight mt-0.5"
                >
                  {editingSkill ? `Edit: ${editingSkill.name}` : "Add Technical Skill"}
                </h2>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="p-2 rounded-full text-muted hover:text-ink dark:text-[#A8A8B8] dark:hover:text-cream hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                aria-label="Close dialog"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Category */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="field-skill-category"
                  className="font-mono text-xs uppercase tracking-wider font-semibold text-ink dark:text-cream"
                >
                  Category <span className="text-coral">*</span>
                </label>
                <select
                  id="field-skill-category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: e.target.value as SkillCategory,
                    }))
                  }
                  className="w-full px-4 py-3 text-base rounded-xl bg-[#FAF8F5] dark:bg-[#0B0F24] border border-black/15 dark:border-white/15 text-ink dark:text-cream focus:outline-none focus:ring-2 focus:ring-royal"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="field-skill-name"
                  className="font-mono text-xs uppercase tracking-wider font-semibold text-ink dark:text-cream"
                >
                  Skill Name <span className="text-coral">*</span>
                </label>
                <input
                  id="field-skill-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="e.g. Next.js, Express, MongoDB"
                  className="w-full px-4 py-3 text-base rounded-xl bg-[#FAF8F5] dark:bg-[#0B0F24] border border-black/15 dark:border-white/15 text-ink dark:text-cream focus:outline-none focus:ring-2 focus:ring-royal"
                />
              </div>

              {/* Level (Strong / Working / Beginner - NO PERCENTAGE) */}
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-xs uppercase tracking-wider font-semibold text-ink dark:text-cream">
                  Proficiency Level <span className="text-coral">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {LEVELS.map((lvl) => {
                    const active = formData.level === lvl;
                    return (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, level: lvl }))
                        }
                        className={`py-2.5 px-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider border transition-all text-center select-none cursor-pointer ${
                          active
                            ? "bg-royal text-white border-royal shadow-sm"
                            : "bg-[#FAF8F5] dark:bg-[#0B0F24] text-muted dark:text-[#A8A8B8] border-black/15 dark:border-white/15 hover:border-black/30"
                        }`}
                      >
                        {lvl}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Order and Visible */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                {/* Order */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="field-skill-order"
                    className="font-mono text-xs uppercase tracking-wider font-semibold text-ink dark:text-cream"
                  >
                    Display Order
                  </label>
                  <input
                    id="field-skill-order"
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

                {/* Visible Toggle */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FAF8F5] dark:bg-[#0B0F24] border border-black/15 dark:border-white/15">
                  <input
                    id="field-skill-visible"
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
                    htmlFor="field-skill-visible"
                    className="text-sm font-semibold text-ink dark:text-cream cursor-pointer select-none"
                  >
                    Visible on Site
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/5 dark:border-white/5">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={saving}
                  className="px-5 py-2.5 rounded-full border border-black/15 dark:border-white/15 text-muted dark:text-[#A8A8B8] hover:text-ink dark:hover:text-cream text-sm font-medium transition-colors select-none cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-full bg-coral hover:bg-[#E84E2E] text-white text-sm font-semibold transition-all shadow-sm active:scale-95 disabled:opacity-50 select-none cursor-pointer"
                >
                  {saving ? "Saving…" : editingSkill ? "Save Changes" : "Create Skill"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* DELETE CONFIRMATION DIALOG                                     */}
      {/* ============================================================== */}
      {deletingSkill && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
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
              id="delete-dialog-title"
              className="text-xl font-black text-ink dark:text-cream tracking-tight"
            >
              Confirm Skill Deletion
            </h3>
            <p className="text-muted dark:text-[#A8A8B8] text-sm mt-2 leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <strong className="text-ink dark:text-cream">
                &ldquo;{deletingSkill.name}&rdquo;
              </strong>{" "}
              from the <span className="font-semibold">{deletingSkill.category}</span> category? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-black/5 dark:border-white/5">
              <button
                type="button"
                onClick={() => setDeletingSkill(null)}
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
                {isDeleting ? "Deleting…" : "Delete Skill"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
