"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { WinnerCard } from "@/components/hall-of-fame/WinnerCard"
import { HallOfFameWinner } from "@/lib/types"

interface HallOfFameClientProps {
  initialData: HallOfFameWinner[]
}

export function HallOfFameClient({ initialData }: HallOfFameClientProps) {
  const years = ["2026"]
  const [activeYear, setActiveYear] = React.useState("2026")

  return (
    <main className="relative min-h-screen bg-[#0A0A0A] pt-24 pb-16 overflow-hidden">
      {/* Ancient Stone/Parchment Texture Overlay (CSS Noise Simulation) */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />
      
      {/* Temple Lighting Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[600px] bg-gradient-to-b from-[#CD7F32]/10 via-[#CD7F32]/5 to-transparent blur-3xl pointer-events-none z-0" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
        
        {/* Header */}
        <div className="text-center mb-16 pt-16">
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-8xl font-cinzel font-bold tracking-widest text-[#F4EBD0] mb-6 drop-shadow-[0_0_20px_rgba(244,235,208,0.1)]"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
          >
            Hall of <span className="text-[#CD7F32]">Fame</span>
          </motion.h1>
          <motion.div 
            className="w-24 h-1 bg-gradient-to-r from-transparent via-[#CD7F32] to-transparent mx-auto mb-6"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          />
          <motion.p 
            className="text-lg md:text-xl text-[#A09B8C] font-cinzel tracking-wider max-w-2xl mx-auto uppercase"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            The undisputed champions of the arena. Immortalized in code.
          </motion.p>
        </div>

        {/* Year Filter (Stone Tablets) */}
        <motion.div 
          className="flex justify-center mb-24"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="inline-flex bg-[#1A1A1A] border border-[#3E2723] rounded-sm p-1 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => setActiveYear(year)}
                className={`px-8 py-2 rounded-sm text-sm font-cinzel font-bold tracking-[0.2em] transition-all duration-300 ${
                  activeYear === year 
                    ? "bg-gradient-to-b from-[#3E2723] to-[#1A1A1A] text-[#CD7F32] border border-[#CD7F32]/30 shadow-md" 
                    : "text-[#78909C] hover:text-[#B0BEC5]"
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Winners Podium */}
        <div className="mb-32 relative">
          {/* Ziggurat background steps */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 max-w-3xl h-16 border-t border-[#CD7F32]/20 bg-gradient-to-t from-[#0A0A0A] to-transparent -z-10" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 max-w-xl h-32 border-t border-[#CD7F32]/30 bg-gradient-to-t from-[#0A0A0A] to-transparent -z-10" />

          {initialData.length === 0 ? (
            <motion.div 
              className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center p-16 border border-[#3E2723] bg-[#1A1A1A]/80 backdrop-blur-sm shadow-[inset_0_0_30px_rgba(0,0,0,0.8)] text-center relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {/* Corner accents */}
              <div className="absolute -top-1 -left-1 w-4 h-4 border-t-[3px] border-l-[3px] border-[#CD7F32]/50" />
              <div className="absolute -top-1 -right-1 w-4 h-4 border-t-[3px] border-r-[3px] border-[#CD7F32]/50" />
              <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-[3px] border-l-[3px] border-[#CD7F32]/50" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-[3px] border-r-[3px] border-[#CD7F32]/50" />

              <div className="w-20 h-20 mb-8 rounded-full border-2 border-[#78909C]/50 flex items-center justify-center opacity-70 bg-[#0A0A0A]">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#CD7F32]">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              
              <h3 className="text-3xl md:text-4xl font-cinzel font-bold text-[#F4EBD0] tracking-[0.2em] mb-6 uppercase">
                The Pedestals Await
              </h3>
              
              <p className="text-[#A09B8C] font-cinzel text-lg max-w-xl leading-relaxed tracking-wider">
                No one has claimed the throne. The ancient tablets lie dormant until the conclusion of the inaugural Frontend Wars.
              </p>
            </motion.div>
          ) : (
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 mt-24">
              {/* Grandmaster (2nd) */}
              {initialData.length > 1 && (
                <div className="order-2 md:order-1 mt-16 md:mt-24">
                  <WinnerCard name={initialData[1].winner || initialData[1].name || "Unknown Winner"} rank="GRANDMASTER" delay={0.4} />
                </div>
              )}
              
              {/* Champion (1st) */}
              {initialData.length > 0 && (
                <div className="order-1 md:order-2">
                  <WinnerCard name={initialData[0].winner || initialData[0].name || "Unknown Winner"} rank="CHAMPION" isCenter delay={0.2} />
                </div>
              )}
              
              {/* Master (3rd) */}
              {initialData.length > 2 && (
                <div className="order-3 mt-16 md:mt-24">
                  <WinnerCard name={initialData[2].winner || initialData[2].name || "Unknown Winner"} rank="MASTER" delay={0.6} />
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </main>
  )
}
