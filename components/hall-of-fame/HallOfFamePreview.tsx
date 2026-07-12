"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { WinnerCard } from "./WinnerCard"

interface HallOfFamePreviewProps {
  data?: Array<{
    winner: string
    project: string
    track: string
  }>
}

export function HallOfFamePreview({ data }: HallOfFamePreviewProps) {
  const hasWinners = data && data.length > 0

  return (
    <section className="w-full py-24 px-6 md:px-12 lg:px-24 bg-surface border-y border-surface-border overflow-hidden relative">
      
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-64 bg-accent-gold/5 blur-[100px] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto flex flex-col items-center relative z-10">
        
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-text-primary uppercase tracking-tight">
            Hall of <span className="text-accent-gold">Fame</span>
          </h2>
          <p className="text-text-secondary font-body max-w-xl mx-auto">
            The undisputed champions of the arena. Their code survived.
          </p>
        </div>

        {hasWinners ? (
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 items-center justify-center pt-8">
            
            {/* Master (Left - Position 3) */}
            {data[2] && (
              <WinnerCard 
                name={data[2].winner} 
                rank="MASTER" 
                delay={0.2}
              />
            )}
            
            {/* Champion (Center - Position 1) */}
            {data[0] && (
              <WinnerCard 
                name={data[0].winner} 
                rank="CHAMPION" 
                isCenter={true} 
                delay={0}
              />
            )}

            {/* Grandmaster (Right - Position 2) */}
            {data[1] && (
              <WinnerCard 
                name={data[1].winner} 
                rank="GRANDMASTER" 
                delay={0.4}
              />
            )}
          </div>
        ) : (
          /* Empty State / Awaiting Champions */
          <motion.div 
            className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center p-12 border border-surface-border bg-background/50 backdrop-blur-sm rounded-xl text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-16 h-16 mb-6 rounded-full border-2 border-surface-border flex items-center justify-center opacity-50">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h3 className="text-2xl font-cinzel text-text-primary tracking-widest mb-4">
              Awaiting 2026 Champions
            </h3>
            <p className="text-text-muted font-body max-w-md">
              The ancient tablets lie dormant. The first names will be carved in February 2026 after the inaugural Frontend Wars.
            </p>
          </motion.div>
        )}
        
      </div>
    </section>
  )
}
