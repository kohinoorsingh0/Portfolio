import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminProjectEditPlaceholderPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <AdminShell>
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-royal dark:text-[#7888FF] mb-2 block select-none">
          PROJECT MANAGEMENT
        </span>
        <h1 className="text-3xl font-black tracking-tight text-ink dark:text-cream mb-4">
          Edit Project
        </h1>
        <div className="p-8 rounded-3xl bg-white dark:bg-[#121730] border border-black/10 dark:border-white/10 shadow-sm space-y-4">
          <p className="font-mono text-xs text-muted dark:text-[#A8A8B8]">
            Target Project ID: <code className="text-ink dark:text-cream">{id}</code>
          </p>
          <div className="inline-block p-4 rounded-2xl bg-lavender/40 dark:bg-royal/10 border border-royal/20 text-royal dark:text-[#7888FF] text-sm font-medium">
            Full project create/edit form is scheduled for Step 31.
          </div>
          <div className="pt-4">
            <Link
              href="/admin/projects"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-royal hover:bg-royal/90 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
            >
              ← Back to Projects List
            </Link>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
