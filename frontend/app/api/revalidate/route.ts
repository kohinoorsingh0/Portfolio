import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

/**
 * POST /api/revalidate
 * Triggers instant on-demand cache revalidation for all public routes.
 * Called automatically by the Admin Panel upon saving any changes to SiteSettings,
 * Skills, Projects, or Journey entries.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const targetPath = body.path || "/";

    if (targetPath === "all" || targetPath === "/") {
      revalidatePath("/", "layout");
      revalidatePath("/");
      revalidatePath("/about");
      revalidatePath("/projects");
      revalidatePath("/projects/[slug]", "page");
      revalidatePath("/journey");
      revalidatePath("/contact");
    } else {
      revalidatePath(targetPath);
      if (targetPath.startsWith("/projects")) {
        revalidatePath("/projects", "page");
        revalidatePath("/projects/[slug]", "page");
      }
    }

    return NextResponse.json({
      revalidated: true,
      path: targetPath,
      timestamp: Date.now(),
    });
  } catch (error: unknown) {
    console.error("[revalidate] Error:", (error as Error).message);
    return NextResponse.json(
      { error: "Failed to revalidate cache" },
      { status: 500 }
    );
  }
}
