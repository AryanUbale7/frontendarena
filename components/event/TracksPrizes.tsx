"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/Badge"

interface TrackItem {
  name: string
  description?: string | null
}

export function TracksPrizes({ tracks }: { tracks?: TrackItem[] }) {
  const defaultTracks = [
    { name: "Performance", description: "Build for the 99th percentile. Pure speed and efficiency under heavy DOM loads." },
    { name: "Accessibility", description: "Flawless screen-reader navigation and keyboard support without sacrificing aesthetics." },
    { name: "Creativity", description: "Pushing the boundaries of web GL, shader art, and innovative CSS interactions." },
  ]

  const tracksList = tracks && tracks.length > 0 ? tracks : defaultTracks

  return (
    <section className="w-full py-24 px-6 md:px-12 lg:px-24 bg-background">
      <div className="max-w-[1400px] mx-auto space-y-32">
        
        {/* Tracks Section */}
        <div>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-bold uppercase tracking-tight text-text-primary">
              Competition <span className="text-accent-violet">Tracks</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tracksList.map((track, i) => (
              <motion.div
                key={i}
                className="bg-surface p-8 border border-surface-border rounded-lg hover:border-accent-violet/50 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <div className="w-12 h-12 rounded bg-surface-hover border border-surface-border mb-6 flex items-center justify-center font-mono text-accent-violet">
                  0{i + 1}
                </div>
                <h3 className="text-xl font-heading font-bold text-text-primary mb-3">{track.name}</h3>
                <p className="text-text-secondary font-body leading-relaxed">{track.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Removed Prizes Section */}

      </div>
    </section>
  )
}
