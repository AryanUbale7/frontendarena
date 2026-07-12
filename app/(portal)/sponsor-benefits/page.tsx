"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { ExternalLink } from "lucide-react"

export default function SponsorBenefitsPage() {
  return (
    <div className="w-full h-full flex flex-col gap-8 pb-12">
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">Sponsor Benefits</h1>
        <p className="text-text-secondary font-body">Claim your exclusive perks from our event partners.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* InterviewBuddy Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface border border-surface-border rounded-xl p-8 shadow-xl relative overflow-hidden flex flex-col"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gold/5 blur-[40px] rounded-full pointer-events-none" />
          
          <h2 className="text-2xl font-heading font-bold text-accent-gold mb-6 relative z-10">InterviewBuddy</h2>
          
          <div className="space-y-4 flex-1 relative z-10">
            <div className="p-4 bg-background border border-surface-border rounded-lg">
              <h3 className="font-bold text-white mb-1 flex items-center justify-between">
                High-value credits
                <span className="text-xs font-mono text-accent-gold px-2 py-1 bg-accent-gold/10 rounded">Winner Only</span>
              </h3>
              <p className="text-sm text-text-secondary">To level up your interview game.</p>
            </div>
            
            <div className="p-4 bg-background border border-surface-border rounded-lg">
              <h3 className="font-bold text-white mb-1 flex items-center justify-between">
                Moderate credits
                <span className="text-xs font-mono text-accent-violet px-2 py-1 bg-accent-violet/10 rounded">Runner Up</span>
              </h3>
              <p className="text-sm text-text-secondary">To practice and improve.</p>
            </div>

            <div className="p-4 bg-background border border-accent-violet/30 rounded-lg">
              <h3 className="font-bold text-white mb-1 flex items-center justify-between">
                Discount coupons
                <span className="text-xs font-mono text-green-400 px-2 py-1 bg-green-400/10 rounded">Available Now</span>
              </h3>
              <p className="text-sm text-text-secondary">To get started.</p>
            </div>
          </div>

          <Button variant="secondary" className="w-full mt-6 flex items-center justify-center gap-2 relative z-10" asChild>
            <a href="#" target="_blank">Redeem at InterviewBuddy <ExternalLink size={16} /></a>
          </Button>
        </motion.div>

        {/* UptoSkills Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-surface border border-surface-border rounded-xl p-8 shadow-xl relative overflow-hidden flex flex-col"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-violet/5 blur-[40px] rounded-full pointer-events-none" />
          
          <h2 className="text-2xl font-heading font-bold text-accent-violet mb-6 relative z-10">UptoSkills</h2>
          
          <div className="space-y-4 flex-1 relative z-10">
            <div className="p-4 bg-background border border-surface-border rounded-lg">
              <h3 className="font-bold text-white mb-1 flex items-center justify-between">
                Goodies & Rewards
                <span className="text-xs font-mono text-accent-gold px-2 py-1 bg-accent-gold/10 rounded">Winner Team</span>
              </h3>
              <p className="text-sm text-text-secondary">Exclusive goodies or rewards support provided only for the winning team.</p>
            </div>
            
            <div className="p-4 bg-background border border-surface-border rounded-lg">
              <h3 className="font-bold text-white mb-1 flex items-center justify-between">
                Internship Opportunities
                <span className="text-xs font-mono text-green-400 px-2 py-1 bg-green-400/10 rounded">Available Now</span>
              </h3>
              <p className="text-sm text-text-secondary">All registered participants get access to internship opportunities.</p>
            </div>

            <div className="p-4 bg-background border border-accent-violet/30 rounded-lg">
              <h3 className="font-bold text-white mb-1 flex items-center justify-between">
                Leagues (Learn & Earn)
                <span className="text-xs font-mono text-green-400 px-2 py-1 bg-green-400/10 rounded">Available Now</span>
              </h3>
              <p className="text-sm text-text-secondary">Access the program for just ₹1 (regular ₹199).</p>
            </div>

          </div>

          <Button variant="secondary" className="w-full mt-6 flex items-center justify-center gap-2 relative z-10" asChild>
            <a href="#" target="_blank">Redeem at UptoSkills <ExternalLink size={16} /></a>
          </Button>
        </motion.div>

      </div>
    </div>
  )
}
