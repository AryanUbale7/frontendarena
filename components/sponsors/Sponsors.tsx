"use client"

import * as React from "react"
import { motion } from "framer-motion"

function LogoMark({ name }: { name: string }) {
  return (
    <div className="flex items-center justify-center p-6 grayscale transition-all duration-300 ease-in-out opacity-35 hover:opacity-70 hover:grayscale-0">
      <span className="text-xl md:text-2xl font-heading font-bold uppercase tracking-widest text-accent-gold">
        {name}
      </span>
    </div>
  )
}

interface SponsorsProps {
  sponsors?: string[]
}

export function Sponsors({ sponsors }: SponsorsProps) {
  const sponsorsList = sponsors && sponsors.length > 0 ? sponsors : ["UptoSkills", "InterviewBuddy"]

  return (
    <section className="w-full py-24 px-6 md:px-12 bg-background border-b border-surface-border">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        
        <motion.div 
          className="w-full flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h3 className="text-sm font-mono text-text-muted uppercase tracking-widest mb-12">
            Backed by Industry Leaders
          </h3>
          
          <div className="w-full flex flex-col md:flex-row items-center justify-center gap-12 md:gap-x-20">
            {sponsorsList.map((sponsor, index) => (
              <React.Fragment key={sponsor}>
                {index > 0 && <div className="w-px h-12 bg-surface-border hidden md:block" />}
                <LogoMark name={sponsor} />
              </React.Fragment>
            ))}
          </div>
        </motion.div>
        
      </div>
    </section>
  )
}
