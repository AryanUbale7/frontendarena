/**
 * RENDERING STRATEGY: ISR (Incremental Static Regeneration)
 * Revalidate Interval: 300 seconds (5 minutes)
 * Rationale: The homepage contains stats (participant counts), Hall of Fame previews, 
 * and sponsors. These change occasionally. ISR avoids querying Supabase on every single 
 * page request while keeping data fresh. Tag invalidation is hooked into registration 
 * and submission server actions.
 */

import { Hero } from "@/components/hero/Hero"
import { CommunityStats } from "@/components/stats/CommunityStats"
import { HallOfFamePreview } from "@/components/hall-of-fame/HallOfFamePreview"
import { Sponsors } from "@/components/sponsors/Sponsors"
import { CommunityCTA } from "@/components/community/CommunityCTA"
import { getHomepageData } from "@/lib/supabase/queries"
import { Metadata } from "next"

export const revalidate = 0

export const metadata: Metadata = {
  title: "Home",
  description: "Join the most intense frontend engineering competition. Climb the ranks, conquer challenges, and immortalize your name in code.",
}

export default async function Home() {
  const data = await getHomepageData()

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <Hero />
      <CommunityStats stats={data.stats} />
      <HallOfFamePreview data={data.hallOfFame} />
      <Sponsors sponsors={data.sponsors} />
      <CommunityCTA />
    </main>
  )
}
