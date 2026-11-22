"use client";

import { useState, useEffect, useMemo } from "react";
import AdminShell from "@/components/admin/AdminShell";

export interface ContactMessageItem {
  _id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
  updatedAt?: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Filter tab: "All" | "Unread" | "Read"
  const [filter, setFilter] = useState<"All" | "Unread" | "Read">("All");

  // Delete confirmation dialog state
  const [deletingMessage, setDeletingMessage] = useState<ContactMessageItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Status updating state for individual item spinners
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  // Fetch messages from GET /api/admin/messages
  const fetchMessages = async () => {
    try {
      setError(null);
      const res = await fetch(`${apiUrl.replace(/\/$/, "")}/admin/messages`, {
        credentials: "include",
      });

      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to load messages");
      }

      const data = await res.json();
      setMessages(data.messages || []);
    } catch (err: unknown) {
      setError((err as Error).message || "An error occurred fetching messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Filter messages
  const filteredMessages = useMemo(() => {
    if (filter === "Unread") return messages.filter((m) => !m.read);
    if (filter === "Read") return messages.filter((m) => m.read);
    return messages;
  }, [messages, filter]);

  const unreadCount = useMemo(() => {
    return messages.filter((m) => !m.read).length;
  }, [messages]);

  // Toggle Read / Unread
  const handleToggleRead = async (message: ContactMessageItem) => {
    setUpdatingId(message._id);
    setError(null);

    const newStatus = !message.read;

    try {
      const res = await fetch(
        `${apiUrl.replace(/\/$/, "")}/admin/messages/${message._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ read: newStatus }),
        }
      );

      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to update message status");
      }

      // Optimistically update local state
      setMessages((prev) =>
        prev.map((m) => (m._id === message._id ? { ...m, read: newStatus } : m))
      );

      setSuccess(
        newStatus ? "Message marked as read." : "Message marked as unread."
      );
    } catch (err: unknown) {
      setError((err as Error).message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  // Confirm Delete
  const handleDeleteConfirm = async () => {
    if (!deletingMessage) return;
    setIsDeleting(true);
    setError(null);

    try {
      const res = await fetch(
        `${apiUrl.replace(/\/$/, "")}/admin/messages/${deletingMessage._id}`,
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
        throw new Error("Failed to delete message");
      }

      setSuccess("Message deleted successfully.");
      setDeletingMessage(null);
      await fetchMessages();
    } catch (err: unknown) {
      setError((err as Error).message || "Failed to delete message");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <AdminShell title="Messages Inbox — Kohinoor Singh">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header & Metrics */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-ink/10 dark:border-white/10">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink dark:text-cream">
                Messages Inbox
              </h1>
              {unreadCount > 0 ? (
                <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded-full bg-coral/15 text-coral border border-coral/30">
                  {unreadCount} unread
                </span>
              ) : (
                <span className="px-2.5 py-0.5 text-xs font-mono font-semibold rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                  All caught up
                </span>
              )}
            </div>
            <p className="text-sm text-ink/60 dark:text-cream/60 mt-1">
              Inquiries and messages sent via the contact form. Stored securely in database.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchMessages()}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-white/5 border border-ink/10 dark:border-white/10 text-xs font-mono font-medium text-ink/80 dark:text-cream/80 hover:bg-ink/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              <svg
                className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
              Refresh
            </button>
          </div>
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

        {/* Filter Tabs */}
        <div className="flex items-center gap-2">
          {(["All", "Unread", "Read"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-medium transition-all cursor-pointer ${
                filter === tab
                  ? "bg-ink text-white dark:bg-cream dark:text-ink shadow-sm"
                  : "bg-white/80 dark:bg-white/5 text-ink/70 dark:text-cream/70 border border-ink/10 dark:border-white/10 hover:bg-ink/5 dark:hover:bg-white/10"
              }`}
            >
              {tab}{" "}
              {tab === "All" && `(${messages.length})`}
              {tab === "Unread" && `(${unreadCount})`}
              {tab === "Read" && `(${messages.length - unreadCount})`}
            </button>
          ))}
        </div>

        {/* Messages List */}
        {loading ? (
          <div className="p-12 text-center text-sm font-mono text-ink/50 dark:text-cream/50 bg-white/40 dark:bg-white/5 rounded-3xl border border-ink/5 dark:border-white/5">
            Loading messages...
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white/40 dark:bg-white/5 border border-dashed border-ink/15 dark:border-white/15">
            <p className="text-sm text-ink/60 dark:text-cream/60">
              No messages found under &quot;{filter}&quot;.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMessages.map((msg) => (
              <div
                key={msg._id}
                className={`p-5 sm:p-6 rounded-3xl border transition-all ${
                  msg.read
                    ? "bg-white/70 dark:bg-white/5 border-ink/10 dark:border-white/10 opacity-90"
                    : "bg-white dark:bg-white/[0.08] border-coral/30 dark:border-coral/40 shadow-sm"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-ink dark:text-cream text-base">
                        {msg.name}
                      </span>
                      {!msg.read && (
                        <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider rounded-full bg-coral text-white">
                          New
                        </span>
                      )}
                      <span className="text-xs font-mono text-ink/40 dark:text-cream/40">
                        {formatDate(msg.createdAt)}
                      </span>
                    </div>

                    <div>
                      <a
                        href={`mailto:${msg.email}`}
                        className="text-xs sm:text-sm font-mono text-royal dark:text-[#7888FF] hover:underline"
                      >
                        {msg.email}
                      </a>
                    </div>
                  </div>

                  {/* Actions: Mark read/unread + Delete */}
                  <div className="flex items-center gap-2 self-end sm:self-start shrink-0">
                    <button
                      onClick={() => handleToggleRead(msg)}
                      disabled={updatingId === msg._id}
                      className={`px-3 py-1.5 rounded-full text-xs font-mono font-medium border transition-all cursor-pointer ${
                        msg.read
                          ? "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200"
                          : "bg-coral/10 text-coral border-coral/30 hover:bg-coral/20"
                      }`}
                    >
                      {updatingId === msg._id
                        ? "Updating..."
                        : msg.read
                        ? "Mark Unread"
                        : "Mark Read"}
                    </button>

                    <button
                      onClick={() => setDeletingMessage(msg)}
                      className="p-1.5 rounded-xl bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/60 text-red-600 dark:text-red-300 transition-colors cursor-pointer"
                      title="Delete message"
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

                {/* Message body */}
                <div className="mt-4 p-4 rounded-2xl bg-ink/[0.02] dark:bg-black/20 border border-ink/5 dark:border-white/5">
                  <p className="text-sm text-ink/80 dark:text-cream/90 whitespace-pre-wrap leading-relaxed font-sans">
                    {msg.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {deletingMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="w-full max-w-md bg-cream dark:bg-[#131930] rounded-3xl p-6 sm:p-8 shadow-2xl border border-red-200 dark:border-red-900/40">
              <h2 className="text-xl font-bold text-ink dark:text-cream tracking-tight">
                Delete Message?
              </h2>
              <p className="text-sm text-ink/70 dark:text-cream/70 mt-2">
                Are you sure you want to permanently delete this message from{" "}
                <strong className="text-ink dark:text-cream">
                  {deletingMessage.name} ({deletingMessage.email})
                </strong>
                ? This action cannot be undone.
              </p>

              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setDeletingMessage(null)}
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
