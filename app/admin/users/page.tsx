import { supabase } from "@/lib/supabase"

export default async function UsersPage() {

  const { data: users } = await supabase
    .from("profiles")
    .select("*")

  return (
    <div>
      <h1>Users</h1>

      {users?.map(user => (
        <div key={user.id}>
          {user.email} | superadmin: {String(user.is_superadmin)}
        </div>
      ))}
    </div>
  )
}