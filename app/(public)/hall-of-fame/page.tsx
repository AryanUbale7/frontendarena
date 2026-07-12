/**
 * RENDERING STRATEGY: ISR (Incremental Static Regeneration)
 * Revalidate Interval: 3600 seconds (1 hour)
 * Rationale: The Hall of Fame changes very rarely—only when an event is finalized 
 * and results are published by an admin. Using a 1-hour cache prevents unnecessary 
 * Supabase read operations, while tag invalidation ensures any newly published results 
 * are instantly visible.
 */

import { getHallOfFameData } from "@/lib/supabase/queries"
import { HallOfFameClient } from "./HallOfFameClient"
import { Metadata } from "next"

export const revalidate = 3600

export const metadata: Metadata = {
  title: "Hall of Fame",
  description: "Browse the legendary developers and teams who conquered the Frontend Arena. Their names are immortalized in code.",
}

export default async function HallOfFamePage() {
  const data = await getHallOfFameData()

  return <HallOfFameClient initialData={data} />
}
