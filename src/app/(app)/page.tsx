import { redirect } from "next/navigation";

// Redirect /dashboard to app dashboard
export default function DashboardRedirect() {
  redirect("/dashboard");
}
