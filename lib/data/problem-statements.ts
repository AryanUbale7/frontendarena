import { unstable_cache } from "next/cache"
import { createPublicClient } from "@/lib/supabase/public"

/**
 * Fetch published problem statements for a specific track
 */
export async function getProblemStatementsForTrack(trackId: string) {
  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from("problem_statements")
    .select("*")
    .eq("track_id", trackId)
    .eq("status", "published")
    .order("published_at", { ascending: false })

  if (error) {
    console.error("Error fetching problem statements:", error.message)
    return []
  }
  return data || []
}

/**
 * Cached version of problem statements for a specific track
 */
export const getCachedProblemStatements = (trackId: string) => {
  return unstable_cache(
    async () => getProblemStatementsForTrack(trackId),
    ["problem-statements", trackId],
    {
      revalidate: 3600,
      tags: [`problem-statements-${trackId}`]
    }
  )()
}
