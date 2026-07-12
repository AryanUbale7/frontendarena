"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { StatBlock } from "./StatBlock"

interface CommunityStatsProps {
  stats?: {
    participants: string
    sponsors: string
    events: string
  }
}

export function CommunityStats({ stats }: CommunityStatsProps) {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12, // staggered 120ms
      }
    }
  }

  return (
    <section className="w-full py-24 px-6 md:px-12 lg:px-24 bg-background">
      <div className="max-w-[1400px] mx-auto">
        <motion.div 
          className="flex flex-col md:flex-row md:flex-wrap lg:flex-nowrap gap-16 md:gap-y-24 lg:gap-32 xl:gap-48 justify-start lg:justify-between items-start"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="w-full md:w-[calc(50%-2rem)] lg:w-auto">
            <StatBlock number={stats?.participants || "1000+"} label="Participants" />
          </div>
          
          <div className="w-full md:w-[calc(50%-2rem)] lg:w-auto">
            <StatBlock number={stats?.sponsors || "2+"} label="Sponsors" />
          </div>
          
          <div className="w-full md:w-full lg:w-auto mt-8 md:mt-0 lg:mt-0">
            <StatBlock number={stats?.events || "1"} label="Flagship Competition" />
          </div>
        </motion.div>

        {/* Mobile Inline Contenders Chip (guardrail variant) */}
        <div className="mt-16 block md:hidden w-full bg-surface border border-surface-border p-5 rounded-xl shadow-md">
          <div className="flex justify-between items-center font-mono text-xs">
            <span className="text-text-secondary uppercase tracking-wider">Active Contenders:</span>
            <div className="flex items-center gap-1.5 font-bold">
              <span className="text-text-primary">{stats?.participants || "1000+"}</span>
              <span className="text-green-400">↑</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
