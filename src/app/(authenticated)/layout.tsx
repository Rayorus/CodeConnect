import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ensureUserProfile } from "@/lib/supabase/ensure-profile";
import Sidebar from "@/components/Sidebar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  // Ensure user profile exists (in case trigger didn't fire)
  try {
    await ensureUserProfile(user.id, user.email || "", {
      username: user.user_metadata?.username,
      display_name: user.user_metadata?.display_name,
    });
  } catch (err) {
    console.error("Failed to ensure profile:", err);
    // Continue anyway - profile might still exist
  }

  const { data: profile } = await supabase
    .from("users")
    .select("username")
    .eq("id", user.id)
    .single();

  // Mobile sidebar state
  // @ts-ignore
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden w-full relative">
      {/* Hamburger for mobile */}
      <button
        className="absolute top-4 left-4 z-40 md:hidden p-2 rounded-lg bg-lc-surface border border-lc-border"
        aria-label="Open sidebar"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="block w-6 h-0.5 bg-lc-text mb-1" />
        <span className="block w-6 h-0.5 bg-lc-text mb-1" />
        <span className="block w-6 h-0.5 bg-lc-text" />
      </button>

      {/* Sidebar: hidden on mobile, drawer when open */}
      <Sidebar
        username={profile?.username || user.email?.split("@")[0] || "user"}
        mobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <main className="flex-1 w-full md:ml-56 overflow-y-auto bg-lc-bg px-4">
        {children}
      </main>
    </div>
  );
}
