/**
 * RENDERING STRATEGY: ISR (Incremental Static Regeneration)
 * Revalidate Interval: 60 seconds
 * Rationale: The event page shell displays registration countdowns and event metadata 
 * that needs to react quickly to updates (such as deadline extensions or status changes). 
 * Caching it for 60 seconds balances database performance with real-time accuracy, 
 * while the global leaderboard sub-route itself is excluded from ISR to remain 100% realtime.
 */

import { EventHero } from "@/components/event/EventHero"
import { OverviewTimeline } from "@/components/event/OverviewTimeline"
import { TracksPrizes } from "@/components/event/TracksPrizes"
import { JudgesFAQ } from "@/components/event/JudgesFAQ"
import { Sponsors } from "@/components/sponsors/Sponsors"
import { StickyCTA } from "@/components/layout/StickyCTA"
import { getEventPageData } from "@/lib/supabase/queries"
import { Metadata } from "next"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Frontend Wars 2026",
  description: "The flagship frontend championship. Join three days of grueling challenges, live judging, and prove your engineering mastery.",
}

export default async function FrontendWars2026Page() {
  // Fetch active event details on the server side
  const event = await getEventPageData()

  // Event JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": event?.name || "Frontend Wars 2026",
    "description": event?.description || "The flagship event of Frontend Arena.",
    "startDate": event?.start_date || "2026-02-24T09:00:00Z",
    "endDate": event?.end_date || "2026-02-26T18:00:00Z",
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
    "location": {
      "@type": "VirtualLocation",
      "url": "https://frontendarena.com/frontend-wars-2026"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    }
  }

  return (
    <main className="relative min-h-screen bg-background">
      {/* Event JSON-LD Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <EventHero event={event} />
      <OverviewTimeline />
      <TracksPrizes tracks={event?.tracks} />
      <JudgesFAQ />
      
      {/* Reused Sponsors component from the homepage */}
      <Sponsors />
      
      {/* Sticky CTA that appears when scrolling down */}
      <StickyCTA />
    </main>
  )
}
