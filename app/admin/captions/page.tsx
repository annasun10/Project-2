import { supabase } from "@/lib/supabase"

export default async function CaptionsPage() {

  const { data: captions } = await supabase
    .from("captions")
    .select("*")

  return (
    <div>
      <h1>Captions</h1>

      {captions?.map(c => (
        <div key={c.id}>
          {c.text}
        </div>
      ))}
    </div>
  )
}