/**
 * RENDERING STRATEGY: ISR (Incremental Static Regeneration)
 * Revalidate Interval: 3,600 seconds (1 hour)
 * Rationale: Winner profile pages change very rarely. Caching them for 1 hour 
 * reduces database load. Invalidation is linked to the "hall-of-fame-list" cache tag 
 * which gets cleared whenever a submission is submitted or updated.
 */

import * as React from "react"
import { notFound } from "next/navigation"
import { getCachedWinnerProfile } from "@/lib/supabase/queries"
import { WinnerCard } from "@/components/hall-of-fame/WinnerCard"
import { Badge } from "@/components/ui/Badge"
import { Calendar, Code2 as Github, Link as LinkIcon, Trophy } from "lucide-react"
import Link from "next/link"
import { Metadata } from "next"

interface PageProps {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params
  const winner = await getCachedWinnerProfile(username)
  
  if (!winner) {
    return {
      title: "Winner Not Found",
      description: "The requested winner profile could not be found."
    }
  }

  const name = winner.team_name || winner.full_name || "Contender"
  const project = winner.submissions?.[0]?.project_name || "their submission"
  
  return {
    title: `${name} — Arena Winner`,
    description: `Celebrate the achievement of ${name} at Frontend Arena with their winning project "${project}".`,
    openGraph: {
      title: `${name} — Arena Winner | Frontend Arena`,
      description: `Celebrate the achievement of ${name} at Frontend Arena with their winning project "${project}".`,
      type: "profile"
    }
  }
}

export default async function WinnerProfilePage({ params }: PageProps) {
  const { username } = await params
  const winner = await getCachedWinnerProfile(username)

  if (!winner) {
    notFound()
  }

  const name = winner.team_name || winner.full_name || "Contender"
  const primarySubmission = winner.submissions?.[0]

  // Person + Award JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": winner.full_name,
    "jobTitle": "Frontend Engineer",
    "award": [
      `Frontend Arena Winner - ${primarySubmission?.project_name || "Champion Project"}`
    ],
    "sameAs": primarySubmission?.github_url ? [primarySubmission.github_url] : []
  }

  return (
    <main className="relative min-h-screen bg-[#0A0A0A] pt-28 pb-16 overflow-hidden">
      {/* Background texture & lights */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.02] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-gradient-to-b from-[#CD7F32]/10 to-transparent blur-3xl pointer-events-none z-0" />

      {/* JSON-LD Script injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-12 flex flex-col md:flex-row gap-12 items-start pt-12">
        
        {/* Left Side: Winner Card Podium display */}
        <div className="w-full md:w-1/3 flex flex-col items-center">
          <WinnerCard name={name} rank="CHAMPION" isCenter={true} delay={0} />
          
          <div className="mt-8 text-center space-y-2">
            <span className="text-[#CD7F32] font-cinzel text-xs tracking-[0.2em] block">IMMORTALIZED ON</span>
            <span className="text-[#A09B8C] font-mono text-sm block">
              <Calendar className="inline-block w-4 h-4 mr-2 -mt-0.5 opacity-60" />
              {new Date(winner.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Right Side: Winner Achievements & Submission Info */}
        <div className="w-full md:w-2/3 space-y-8">
          <div>
            <span className="text-[#CD7F32] font-cinzel text-sm tracking-[0.2em] font-bold block mb-2">ARENA CHAMPION</span>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-text-primary uppercase tracking-tight">
              {name}
            </h1>
            <p className="text-text-secondary font-body mt-4 text-lg">
              Through unparalleled speed and exceptional component design, this contender successfully survived the Arena.
            </p>
          </div>

          <div className="border border-[#3E2723] bg-[#1A1A1A]/80 rounded-xl p-6 md:p-8 shadow-2xl relative">
            <div className="absolute -top-1 -left-1 w-3 h-3 border-t-[2px] border-l-[2px] border-[#CD7F32]/40" />
            <div className="absolute -top-1 -right-1 w-3 h-3 border-t-[2px] border-r-[2px] border-[#CD7F32]/40" />

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#CD7F32]/10 flex items-center justify-center text-[#CD7F32] border border-[#CD7F32]/20">
                <Trophy size={20} />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-text-primary">Winning Entry</h3>
                <p className="text-xs font-mono text-text-muted">PROJECT SUBMISSION DETAILS</p>
              </div>
            </div>

            {primarySubmission ? (
              <div className="space-y-6">
                <div>
                  <h4 className="text-2xl font-bold text-white mb-2">{primarySubmission.project_name}</h4>
                  <p className="text-accent-gold font-body text-sm font-medium italic">{primarySubmission.tagline}</p>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-mono text-text-muted uppercase tracking-wider block">Description</span>
                  <p className="text-text-secondary text-sm leading-relaxed font-body">
                    {primarySubmission.description || "No description provided."}
                  </p>
                </div>

                {primarySubmission.tech_stack && primarySubmission.tech_stack.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-mono text-text-muted uppercase tracking-wider block font-bold">Tech Stack Used</span>
                    <div className="flex flex-wrap gap-2">
                      {primarySubmission.tech_stack.map((tech: string) => (
                        <Badge key={tech} variant="default" className="bg-[#0A0A0A] border border-[#3E2723] text-text-secondary">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-4 pt-4 border-t border-[#3E2723]/50">
                  {primarySubmission.github_url && (
                    <a 
                      href={primarySubmission.github_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-text-secondary hover:text-white transition-colors"
                    >
                      <Github size={16} />
                      View Codebase
                    </a>
                  )}
                  {primarySubmission.demo_url && (
                    <a 
                      href={primarySubmission.demo_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-text-secondary hover:text-[#CD7F32] transition-colors"
                    >
                      <LinkIcon size={16} />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-text-muted italic text-sm">No submission details linked to this winner profile.</p>
            )}
          </div>

          <div className="pt-8">
            <Link 
              href="/hall-of-fame"
              className="text-[#CD7F32] font-cinzel text-sm tracking-widest hover:text-[#F4EBD0] transition-colors"
            >
              ← Return to Hall of Fame
            </Link>
          </div>
        </div>

      </div>
    </main>
  )
}
