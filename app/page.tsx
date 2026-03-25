import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const { data: profileRaw } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .single();
    const profile = profileRaw as { username: string | null } | null;
    redirect(profile?.username ? "/dashboard" : "/onboarding");
  }

  redirect("/login");
}
