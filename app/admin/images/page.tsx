import { supabase } from "@/lib/supabase"

export default async function ImagesPage() {

  const { data: images } = await supabase
    .from("images")
    .select("*")

  return (
    <div>
      <h1>Images</h1>

      {images?.map(img => (
        <div key={img.id}>
          {img.url}
        </div>
      ))}
    </div>
  )
}