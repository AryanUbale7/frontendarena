import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function test() {
  const { count, error } = await supabase
    .from("users")
    .select("*", { count: 'exact', head: true })

  console.log("Participants count:", count)
  if (error) console.error("Error:", error)
}
test()
