"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { RiftRing } from "@/components/signature/RiftRing"
import { DriftingAvatars } from "./DriftingAvatars"

export function CommunityCTA() {
  return (
    <section className="relative w-full py-32 md:py-48 px-6 overflow-hidden bg-[#060608] border-t border-surface-border flex items-center justify-center isolate">
      
      {/* Radar / Grid overlay for holographic feel */}
      <div 
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at center, transparent 0%, #060608 100%), repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(139, 92, 246, 0.1) 40px, rgba(139, 92, 246, 0.1) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(139, 92, 246, 0.1) 40px, rgba(139, 92, 246, 0.1) 41px)`
        }}
      />

      {/* Scaled Proportional Background Layer to prevent avatar and ring clipping */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1800px] h-[900px] pointer-events-none -z-10 origin-center scale-[0.35] sm:scale-[0.6] md:scale-[0.8] lg:scale-125">
        {/* 
          Avatars are scattered around the container.
          They handle their own CSS drifting.
        */}
        <DriftingAvatars />

        {/* Violet Rift Ring Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <RiftRing variant="violet" interactive={true} size={800} />
        </div>
      </div>

      {/* Center Layout Container */}
      <div className="relative z-10 flex flex-col items-center justify-center pointer-events-none">
        
        {/* Content Box (Glassmorphism Command Center) */}
        <motion.div 
          className="flex flex-col items-center text-center max-w-xl pointer-events-auto bg-[#060608]/40 backdrop-blur-2xl border border-surface-border rounded-3xl p-10 md:p-14 shadow-[0_0_50px_rgba(139,92,246,0.15)]"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Subtle inner top highlight */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-gradient-to-r from-transparent via-accent-violet to-transparent opacity-50" />

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold uppercase tracking-tight text-text-primary mb-6 drop-shadow-[0_0_20px_rgba(139,92,246,0.3)]">
            Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-violet to-[#25D366]">Arena</span>
          </h2>
          
          <p className="text-lg md:text-xl text-text-secondary font-body mb-10 text-balance">
            Connect with elite developers, get early access to tournament qualifiers, and debate the meta.
          </p>
          
          {/* Breathing CTA Button - WhatsApp Green */}
          <style>{`
            @keyframes breathing-whatsapp {
              0%, 100% { box-shadow: 0 0 15px rgba(37,211,102,0.4); transform: scale(1); }
              50% { box-shadow: 0 0 40px rgba(37,211,102,0.8); transform: scale(1.02); }
            }
            .btn-whatsapp {
              animation: breathing-whatsapp 3s ease-in-out infinite;
              background-color: #25D366;
              border-color: #25D366;
              color: white;
            }
            .btn-whatsapp:hover {
              animation: none;
              box-shadow: 0 0 40px rgba(37,211,102,1) !important;
              transform: scale(1.02) !important;
              background-color: #1EBE57;
            }
          `}</style>
          
          <Button size="lg" className="btn-whatsapp transition-all duration-200 gap-3 group px-8" asChild>
            <a href="https://chat.whatsapp.com/" target="_blank" rel="noopener noreferrer">
              <svg 
                className="w-6 h-6 fill-current transition-transform group-hover:scale-110" 
                role="img" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Join WhatsApp Community
            </a>
          </Button>
        </motion.div>
      </div>

    </section>
  )
}
