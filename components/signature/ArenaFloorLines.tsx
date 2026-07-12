"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export function ArenaFloorLines({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {/* Horizontal Lines */}
      <div className="absolute inset-0 flex flex-col justify-between opacity-20">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={`h-${i}`} className="h-px w-full bg-surface-border" />
        ))}
      </div>
      
      {/* Vertical Lines */}
      <div className="absolute inset-0 flex justify-between opacity-20">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={`v-${i}`} className="w-px h-full bg-surface-border" />
        ))}
      </div>

      {/* Center glowing spot */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-accent-violet-glow opacity-30 blur-[120px] rounded-full" />
    </div>
  )
}
