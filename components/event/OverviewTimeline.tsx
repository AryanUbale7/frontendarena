"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { DataRail } from "@/components/ui/DataRail"

export function OverviewTimeline() {
  const timelineNodes = [
    { date: "FEB 10", title: "Registrations Open", desc: "Global qualifier applications go live." },
    { date: "FEB 20", title: "Qualifiers End", desc: "Top 100 participants selected." },
    { date: "FEB 24", title: "Arena Kickoff", desc: "Live event begins. 72 hours of intense coding." },
    { date: "FEB 27", title: "Live Judging", desc: "Panel of industry experts review the finalists." },
  ]

  return (
    <section className="w-full py-24 px-6 md:px-12 lg:px-24 bg-surface border-y border-surface-border">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24">
        
        {/* Overview Left */}
        <div className="flex flex-col items-start max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-5xl font-heading font-bold uppercase tracking-tight text-text-primary mb-6">
              The <span className="text-accent-violet">Crucible</span>
            </h2>
            <p className="text-lg text-text-secondary font-body leading-relaxed mb-12">
              Frontend Wars is not a standard hackathon. It is a grueling, 72-hour survival challenge where architecture, accessibility, and pixel-perfect execution are tested under extreme constraints. No boilerplates. No AI generators. Pure skill.
            </p>
            
            <div className="w-full space-y-2">
              <DataRail label="DURATION" value="72 HOURS" />
              <DataRail label="FORMAT" value="SOLO / REMOTE" />
            </div>
          </motion.div>
        </div>

        {/* Timeline Right */}
        <div className="relative border-l border-surface-border/50 ml-4 lg:ml-0 pl-8 md:pl-12 py-4">
          {timelineNodes.map((node, i) => (
            <motion.div
              key={i}
              className="relative mb-16 last:mb-0"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
            >
              {/* Timeline dot */}
              <div className="absolute -left-[41px] md:-left-[57px] top-1 w-4 h-4 rounded-full bg-surface border-2 border-accent-gold shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
              
              <span className="text-sm font-mono text-accent-gold uppercase tracking-widest">{node.date}</span>
              <h3 className="text-xl md:text-2xl font-heading font-bold text-text-primary mt-2 mb-2">{node.title}</h3>
              <p className="text-text-secondary font-body">{node.desc}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
