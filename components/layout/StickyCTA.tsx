"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/Button"

export function StickyCTA() {
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    // Show sticky CTA only after scrolling past the 600px mark (approx bottom of hero)
    const handleScroll = () => {
      if (window.scrollY > 600 && !isVisible) {
        setIsVisible(true)
      } else if (window.scrollY <= 600 && isVisible) {
        setIsVisible(false)
      }
    }
    
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isVisible])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="fixed bottom-0 left-0 right-0 z-50 p-4 pointer-events-none"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
        >
          <div className="max-w-4xl mx-auto bg-surface/90 backdrop-blur-md border border-surface-border rounded-lg shadow-2xl p-4 flex items-center justify-between pointer-events-auto">
            
            <div className="hidden sm:flex flex-col">
              <span className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider">
                Frontend Wars <span className="text-accent-gold">2026</span>
              </span>
              <span className="text-xs text-text-secondary font-mono mt-1">
                Feb 24, 2026 • Global Online Arena
              </span>
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex flex-col sm:hidden">
                <span className="text-sm font-heading font-bold text-text-primary uppercase tracking-wider">FWAR 2026</span>
                <span className="text-xs text-red-400 font-mono">Registrations Closed</span>
              </div>
              <Button variant="secondary" size="lg" disabled className="opacity-60 cursor-not-allowed">
                Registration Closed
              </Button>
            </div>
            
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
