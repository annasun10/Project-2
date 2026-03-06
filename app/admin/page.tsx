import { supabase } from "@/lib/supabase"

export default async function AdminDashboard() {

  const { count: imageCount } = await supabase
    .from("images")
    .select("*", { count: "exact", head: true })

  const { count: captionCount } = await supabase
    .from("captions")
    .select("*", { count: "exact", head: true })

  const { count: userCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <p>Total Users: {userCount}</p>
      <p>Total Images: {imageCount}</p>
      <p>Total Captions: {captionCount}</p>

    </div>
  )
}