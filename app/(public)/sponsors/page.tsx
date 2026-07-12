/**
 * RENDERING STRATEGY: ISR (Incremental Static Regeneration)
 * Revalidate Interval: 3600 seconds (1 hour)
 * Rationale: The sponsors page shows the list of active sponsors supporting FWAR. 
 * This changes very rarely. Statically rendering the page shell and caching it for 
 * 1 hour avoids repeated database calls for a slow-changing directory.
 */

import * as React from "react"
import { Sponsors as SponsorsList } from "@/components/sponsors/Sponsors"
import { RiftRing } from "@/components/signature/RiftRing"
import { getSponsorsPageData } from "@/lib/supabase/queries"
import { SponsorInquiryForm } from "@/components/sponsors/SponsorInquiryForm"
import { Metadata } from "next"

export const revalidate = 3600

export const metadata: Metadata = {
  title: "Sponsors",
  description: "Learn more about the industry leaders backing Frontend Arena, or request a partnership prospectus to support the next competition.",
}

export default async function SponsorsPage() {
  const rawSponsors = await getSponsorsPageData()
  
  // Extract unique sponsor names for the logo display
  const uniqueSponsorNames = Array.from(
    new Set(rawSponsors.map(item => item.sponsor_name))
  )

  return (
    <main className="relative min-h-screen bg-background pt-24 pb-16">
      
      {/* Background Ring */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 mix-blend-screen pointer-events-none scale-[1.5]">
        <RiftRing variant="gold" size={600} interactive={false} />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
        
        {/* Page Header */}
        <div className="text-center mb-16 pt-16">
          <h1 className="text-4xl md:text-6xl font-heading font-bold uppercase tracking-tight text-text-primary mb-6">
            Back The <span className="text-accent-gold">Arena</span>
          </h1>
          <p className="text-lg md:text-xl text-text-secondary font-body max-w-2xl mx-auto">
            Join industry leaders in supporting the world's most intense frontend engineering competition.
          </p>
        </div>

        {/* Existing Sponsors Showcase */}
        <div className="mb-32">
          <SponsorsList sponsors={uniqueSponsorNames} />
        </div>

        {/* Become a Sponsor Lead Form (Client Component wrapper) */}
        <SponsorInquiryForm />

      </div>
    </main>
  )
}
