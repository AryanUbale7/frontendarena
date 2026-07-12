"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Avatar } from "@/components/ui/Avatar"
import { cn } from "@/lib/utils"

export interface WinnerCardProps {
  name: string
  rank: "CHAMPION" | "GRANDMASTER" | "MASTER"
  isCenter?: boolean // Used for the podium center (Champion)
  delay?: number
}

export function WinnerCard({ name, rank, isCenter = false, delay = 0 }: WinnerCardProps) {
  
  // Ancient Tier styling map
  const tierConfig = {
    CHAMPION: {
      colorClass: "text-[#CD7F32]", // Aged Bronze/Gold
      bgClass: "bg-gradient-to-b from-[#3E2723] to-[#1A1A1A]",
      borderColor: "border-[#CD7F32]/50",
      glow: "drop-shadow-[0_0_15px_rgba(205,127,50,0.3)]",
      label: "CHAMPION",
    },
    GRANDMASTER: {
      colorClass: "text-[#B0BEC5]", // Tarnished Silver
      bgClass: "bg-gradient-to-b from-[#263238] to-[#1A1A1A]",
      borderColor: "border-[#B0BEC5]/40",
      glow: "drop-shadow-[0_0_10px_rgba(176,190,197,0.2)]",
      label: "GRANDMASTER",
    },
    MASTER: {
      colorClass: "text-[#78909C]", // Wrought Iron / Slate
      bgClass: "bg-gradient-to-b from-[#22282C] to-[#1A1A1A]",
      borderColor: "border-[#78909C]/30",
      glow: "",
      label: "MASTER",
    }
  }

  const config = tierConfig[rank]
  
  const [isDesktop, setIsDesktop] = React.useState(false)

  React.useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)")
    setIsDesktop(media.matches)
    const listener = () => setIsDesktop(media.matches)
    media.addEventListener("change", listener)
    return () => media.removeEventListener("change", listener)
  }, [])

  return (
    <motion.div
      className={cn(
        "relative flex flex-col items-center w-full max-w-[280px] mx-auto",
        isCenter ? "md:scale-110 md:z-10 scale-100 z-0" : "scale-100 opacity-90",
        config.glow
      )}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: (isCenter && isDesktop) ? -24 : 0 }}
      transition={{ 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1], // Monument easing
        delay 
      }}
    >
      
      {/* Ancient Tablet Frame */}
      <div className={cn(
        "relative p-1 rounded-sm",
        config.bgClass,
        config.borderColor,
        "border-[2px] shadow-[inset_0_0_20px_rgba(0,0,0,0.8),0_10px_30px_rgba(0,0,0,0.9)]"
      )}>
        {/* Decorative Corner Accents (Ancient look) */}
        <div className={`absolute -top-1 -left-1 w-3 h-3 border-t-[3px] border-l-[3px] ${config.borderColor}`} />
        <div className={`absolute -top-1 -right-1 w-3 h-3 border-t-[3px] border-r-[3px] ${config.borderColor}`} />
        <div className={`absolute -bottom-1 -left-1 w-3 h-3 border-b-[3px] border-l-[3px] ${config.borderColor}`} />
        <div className={`absolute -bottom-1 -right-1 w-3 h-3 border-b-[3px] border-r-[3px] ${config.borderColor}`} />

        <div className="bg-[#0A0A0A] p-4 flex flex-col items-center">
          {/* Portrait */}
          <div className="relative mb-6">
            <Avatar 
              fallback={name.substring(0,2).toUpperCase()} 
              size={isCenter ? "xl" : "lg"}
              className="border-2 border-surface-border grayscale sepia-[0.3]" 
            />
            {/* Laurel Wreath Mock Element (just a stylized accent line) */}
            <div className={`absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-[2px] ${config.bgClass} opacity-50`} />
          </div>

          {/* Typography */}
          <div className="flex flex-col items-center text-center gap-2 px-4 pb-2">
            <span className={cn(
              "font-cinzel font-bold tracking-widest text-lg sm:text-xl uppercase",
              config.colorClass
            )}>
              {name}
            </span>
            <span className={cn(
              "font-cinzel text-[10px] sm:text-xs tracking-[0.3em] uppercase opacity-80",
              config.colorClass
            )}>
              {config.label}
            </span>
          </div>
        </div>
      </div>

      {/* Stand/Pedestal for Podium feel */}
      {isCenter && (
        <div className="mt-4 w-3/4 h-2 bg-gradient-to-r from-transparent via-[#CD7F32]/20 to-transparent blur-sm" />
      )}
      
    </motion.div>
  )
}
