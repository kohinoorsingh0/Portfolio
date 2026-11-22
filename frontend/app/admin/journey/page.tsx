"use client";

import { useState, useEffect, useMemo, FormEvent } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { triggerRevalidation } from "@/lib/api";

export type JourneyType = "Experience" | "Education" | "Certificate";

export interface JourneyItem {
  _id: string;
  type: JourneyType;
  yearLabel: string;
  title: string;
  organisation: string;
  description: string;
  order: number;
  visible: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const JOURNEY_TYPES: JourneyType[] = [
  "Experience",
  "Education",
  "Certificate",
];

const TYPE_BADGE_STYLES: Record<JourneyType, string> = {
  Experience:
    "bg-indigo-50 text-royal dark:bg-royal/20 dark:text-[#7888FF] border-indigo-200 dark:border-royal/30",
  Education:
    "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800/60",
  Certificate:
    "bg-lime/20 text-ink dark:bg-lime/15 dark:text-lime border-lime/40",
};

interface FormDataState {
  type: JourneyType;
  yearLabel: string;
  title: string;
  organisation: string;
  description: string;
  order: number;
  visible: boolean;
}

const DEFAULT_FORM: FormDataState = {
  type: "Experience",
  yearLabel: "",
  title: "",
  organisation: "",
  description: "",
  order: 1,
  visible: true,
};

export default function AdminJourneyPage() {
  const [items, setItems] = useState<JourneyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Filter tab: "All" or a specific JourneyType
  const [selectedFilter, setSelectedFilter] = useState<string>("All");

  // Modal / Drawer state for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<JourneyItem | null>(null);
  const [formData, setFormData] = useState<FormDataState>(DEFAULT_FORM);

  // Delete confirmation dialog state
  const [deletingItem, setDeletingItem] = useState<JourneyItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  // Fetch journey items from GET /api/admin/journey
  const fetchJourney = async () => {
    try {
      setError(null);
      const res = await fetch(`${apiUrl.replace(/\/$/, "")}/admin/journey`, {
        credentials: "include",
      });

      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to load journey entries");
      }

      const data = await res.json();
      setItems(data.journey || []);
    } catch (err: unknown) {
      setError((err as Error).message || "An error occurred fetching journey data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJourney();
  }, []);

  // Filter items according to the selected tab
  const filteredItems = useMemo(() => {
    if (selectedFilter === "All") return items;
    return items.filter((item) => item.type === selectedFilter);
  }, [items, selectedFilter]);

  // Open modal for Adding a new entry
  const handleOpenAddModal = () => {
    setEditingItem(null);
    const nextOrder = items.length > 0 ? Math.max(...items.map((i) => i.order)) + 1 : 1;
    setFormData({
      ...DEFAULT_FORM,
      order: nextOrder,
    });
    setError(null);
    setSuccess(null);
    setIsModalOpen(true);
  };

  // Open modal for Editing an existing entry
  const handleOpenEditModal = (item: JourneyItem) => {
    setEditingItem(item);
    setFormData({
      type: item.type,
      yearLabel: item.yearLabel || "",
      title: item.title,
      organisation: item.organisation,
      description: item.description || "",
      order: item.order,
      visible: item.visible,
    });
    setError(null);
    setSuccess(null);
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData(DEFAULT_FORM);
  };

  // Submit Add or Edit Form
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }
    if (!formData.organisation.trim()) {
      setError("Organisation is required");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const isEdit = Boolean(editingItem);
      const endpoint = isEdit
        ? `${apiUrl.replace(/\/$/, "")}/admin/journey/${editingItem!._id}`
        : `${apiUrl.replace(/\/$/, "")}/admin/journey`;

      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || data.details?.[0] || "Failed to save journey entry");
      }

      setSuccess(
        isEdit
          ? `Updated "${formData.title}" successfully!`
          : `Created "${formData.title}" successfully!`
      );
      triggerRevalidation();
      handleCloseModal();
      await fetchJourney();
    } catch (err: unknown) {
      setError((err as Error).message || "Failed to save entry");
    } finally {
      setSaving(false);
    }
  };

  // Toggle Visibility inline
  const handleToggleVisibility = async (item: JourneyItem) => {
    try {
      const updatedVisible = !item.visible;
      const res = await fetch(
        `${apiUrl.replace(/\/$/, "")}/admin/journey/${item._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            ...item,
            visible: updatedVisible,
          }),
        }
      );

      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to update visibility");
      }

      // Update local state optimistically
      triggerRevalidation();
      setItems((prev) =>
        prev.map((i) => (i._id === item._id ? { ...i, visible: updatedVisible } : i))
      );
    } catch (err: unknown) {
      setError((err as Error).message || "Failed to toggle visibility");
    }
  };

  // Confirm Delete
  const handleDeleteConfirm = async () => {
    if (!deletingItem) return;
    setIsDeleting(true);
    setError(null);

    try {
      const res = await fetch(
        `${apiUrl.replace(/\/$/, "")}/admin/journey/${deletingItem._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to delete journey entry");
      }

      triggerRevalidation();
      setSuccess(`Deleted "${deletingItem.title}" successfully.`);
      setDeletingItem(null);
      await fetchJourney();
    } catch (err: unknown) {
      setError((err as Error).message || "Failed to delete entry");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AdminShell title="Journey Management — Kohinoor Singh">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header & Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-ink/10 dark:border-white/10">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink dark:text-cream">
                Journey Entries
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-mono font-semibold rounded-full bg-ink/5 dark:bg-white/10 text-ink/70 dark:text-cream/70 border border-ink/10 dark:border-white/10">
                {items.length} {items.length === 1 ? "entry" : "entries"}
              </span>
            </div>
            <p className="text-sm text-ink/60 dark:text-cream/60 mt-1">
              Manage your verified education, certifications, and project experience timeline.
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-coral text-white font-medium text-sm rounded-full shadow-sm hover:bg-coral-hover hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Journey Entry
          </button>
        </div>

        {/* Global Notifications */}
        {error && (
          <div
            role="alert"
            className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm flex items-center justify-between"
          >
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-700 dark:text-red-300 hover:opacity-70 font-bold ml-4"
            >
              ✕
            </button>
          </div>
        )}

        {success && (
          <div
            role="status"
            className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm flex items-center justify-between"
          >
            <span>{success}</span>
            <button
              onClick={() => setSuccess(null)}
              className="text-emerald-800 dark:text-emerald-200 hover:opacity-70 font-bold ml-4"
            >
              ✕
            </button>
          </div>
        )}

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {["All", ...JOURNEY_TYPES].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedFilter(type)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-medium transition-all cursor-pointer ${
                selectedFilter === type
                  ? "bg-ink text-white dark:bg-cream dark:text-ink shadow-sm"
                  : "bg-white/80 dark:bg-white/5 text-ink/70 dark:text-cream/70 border border-ink/10 dark:border-white/10 hover:bg-ink/5 dark:hover:bg-white/10"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Journey Items List */}
        {loading ? (
          <div className="p-12 text-center text-sm font-mono text-ink/50 dark:text-cream/50 bg-white/40 dark:bg-white/5 rounded-3xl border border-ink/5 dark:border-white/5">
            Loading journey entries...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white/40 dark:bg-white/5 border border-dashed border-ink/15 dark:border-white/15">
            <p className="text-sm text-ink/60 dark:text-cream/60">
              No journey entries found for this filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item._id}
                className="group relative p-5 sm:p-6 bg-white dark:bg-white/5 rounded-3xl border border-ink/10 dark:border-white/10 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-4"
              >
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold border ${
                        TYPE_BADGE_STYLES[item.type]
                      }`}
                    >
                      {item.type}
                    </span>
                    {item.yearLabel && (
                      <span className="px-2 py-0.5 text-xs font-mono font-medium text-ink/70 dark:text-cream/70 bg-ink/5 dark:bg-white/10 rounded-full">
                        {item.yearLabel}
                      </span>
                    )}
                    <span className="text-xs font-mono text-ink/40 dark:text-cream/40">
                      Order: {item.order}
                    </span>
                    {!item.visible && (
                      <span className="px-2 py-0.5 text-xs font-mono text-zinc-500 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                        Hidden
                      </span>
                    )}
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-ink dark:text-cream tracking-tight">
                      {item.title}
                    </h2>
                    <p className="text-sm font-medium text-royal dark:text-[#7888FF]">
                      {item.organisation}
                    </p>
                  </div>

                  {item.description && (
                    <p className="text-xs sm:text-sm text-ink/70 dark:text-cream/70 leading-relaxed max-w-3xl">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0 pt-2 sm:pt-0">
                  {/* Visibility Toggle Button */}
                  <button
                    onClick={() => handleToggleVisibility(item)}
                    title={item.visible ? "Hide from public site" : "Show on public site"}
                    className={`px-3 py-1.5 rounded-full text-xs font-mono font-medium border transition-all cursor-pointer ${
                      item.visible
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60"
                        : "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700"
                    }`}
                  >
                    {item.visible ? "Visible" : "Hidden"}
                  </button>

                  {/* Edit Button */}
                  <button
                    onClick={() => handleOpenEditModal(item)}
                    className="p-2 rounded-xl bg-ink/5 dark:bg-white/10 hover:bg-ink/10 dark:hover:bg-white/20 text-ink dark:text-cream transition-colors cursor-pointer"
                    title="Edit entry"
                  >
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
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                      />
                    </svg>
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => setDeletingItem(item)}
                    className="p-2 rounded-xl bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/60 text-red-600 dark:text-red-300 transition-colors cursor-pointer"
                    title="Delete entry"
                  >
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
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add / Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="w-full max-w-lg bg-cream dark:bg-[#131930] rounded-3xl p-6 sm:p-8 shadow-2xl border border-ink/10 dark:border-white/10 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-ink/10 dark:border-white/10">
                <h2 className="text-xl font-extrabold text-ink dark:text-cream tracking-tight">
                  {editingItem ? "Edit Journey Entry" : "Add Journey Entry"}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="p-1 rounded-full text-ink/60 dark:text-cream/60 hover:text-ink dark:hover:text-cream"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                {/* Type Selection */}
                <div>
                  <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-ink/70 dark:text-cream/70 mb-1">
                    Category Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value as JourneyType })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-ink/15 dark:border-white/15 text-ink dark:text-cream text-sm focus:outline-hidden focus:border-royal"
                  >
                    {JOURNEY_TYPES.map((t) => (
                      <option key={t} value={t} className="bg-cream dark:bg-zinc-900 text-ink dark:text-cream">
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-ink/70 dark:text-cream/70 mb-1">
                    Role / Degree / Certificate Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Full-Stack Developer"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-ink/15 dark:border-white/15 text-ink dark:text-cream text-sm focus:outline-hidden focus:border-royal"
                  />
                </div>

                {/* Organisation */}
                <div>
                  <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-ink/70 dark:text-cream/70 mb-1">
                    Organisation / Institution *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pt. Chiranji Lal Sharma Govt. P.G. College, Karnal"
                    value={formData.organisation}
                    onChange={(e) => setFormData({ ...formData, organisation: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-ink/15 dark:border-white/15 text-ink dark:text-cream text-sm focus:outline-hidden focus:border-royal"
                  />
                </div>

                {/* Year Label */}
                <div>
                  <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-ink/70 dark:text-cream/70 mb-1">
                    Year Label
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2026 or 2024 - Present"
                    value={formData.yearLabel}
                    onChange={(e) => setFormData({ ...formData, yearLabel: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-ink/15 dark:border-white/15 text-ink dark:text-cream text-sm focus:outline-hidden focus:border-royal"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-ink/70 dark:text-cream/70 mb-1">
                    Description & Key Highlights
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Key responsibilities, verified accomplishments, or coursework details..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-ink/15 dark:border-white/15 text-ink dark:text-cream text-sm focus:outline-hidden focus:border-royal leading-relaxed"
                  />
                </div>

                {/* Order & Visible */}
                <div className="grid grid-cols-2 gap-4 items-center">
                  <div>
                    <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-ink/70 dark:text-cream/70 mb-1">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) =>
                        setFormData({ ...formData, order: parseInt(e.target.value, 10) || 0 })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-ink/15 dark:border-white/15 text-ink dark:text-cream text-sm focus:outline-hidden focus:border-royal"
                    />
                  </div>

                  <div className="pt-5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.visible}
                        onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
                        className="w-4 h-4 rounded text-royal focus:ring-0 cursor-pointer"
                      />
                      <span className="text-xs font-mono uppercase tracking-wider text-ink/80 dark:text-cream/80">
                        Visible on site
                      </span>
                    </label>
                  </div>
                </div>

                {/* Submit / Cancel Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-ink/10 dark:border-white/10">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 rounded-full text-xs font-mono font-semibold text-ink/70 dark:text-cream/70 hover:bg-ink/5 dark:hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 rounded-full bg-coral text-white text-xs font-mono font-semibold hover:bg-coral-hover transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {saving ? "Saving..." : editingItem ? "Update Entry" : "Create Entry"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {deletingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="w-full max-w-md bg-cream dark:bg-[#131930] rounded-3xl p-6 sm:p-8 shadow-2xl border border-red-200 dark:border-red-900/40">
              <h2 className="text-xl font-bold text-ink dark:text-cream tracking-tight">
                Delete Journey Entry?
              </h2>
              <p className="text-sm text-ink/70 dark:text-cream/70 mt-2">
                Are you sure you want to delete{" "}
                <strong className="text-ink dark:text-cream">
                  &quot;{deletingItem.title}&quot;
                </strong>
                ? This action cannot be undone.
              </p>

              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setDeletingItem(null)}
                  disabled={isDeleting}
                  className="px-4 py-2 rounded-full text-xs font-mono font-semibold text-ink/70 dark:text-cream/70 hover:bg-ink/5 dark:hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="px-5 py-2 rounded-full bg-red-600 text-white text-xs font-mono font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isDeleting ? "Deleting..." : "Delete Permanently"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
