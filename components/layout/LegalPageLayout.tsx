"use client"

import * as React from "react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import { Shield } from "lucide-react"

export type LegalSection = {
  id: string
  title: string
  content: React.ReactNode
}

interface LegalPageLayoutProps {
  title: string
  lastUpdated: string
  sections: LegalSection[]
}

export function LegalPageLayout({ title, lastUpdated, sections }: LegalPageLayoutProps) {
  const [activeSection, setActiveSection] = React.useState<string>(sections[0]?.id || "")

  React.useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(() => {
          const sectionElements = sections.map(s => document.getElementById(s.id))
          const scrollPosition = window.scrollY + 200

          for (let i = sectionElements.length - 1; i >= 0; i--) {
            const section = sectionElements[i]
            if (section && section.offsetTop <= scrollPosition) {
              setActiveSection(sections[i].id)
              break
            }
          }
          ticking = false
        })
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [sections])

  return (
    <div className="min-h-screen bg-background text-text-primary selection:bg-accent-violet/30">
      <Navbar />
      
      <main className="pt-[var(--header-height)] pb-24">
        {/* Hero Section */}
        <section className="relative pt-20 pb-16 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-violet/10 blur-[120px] rounded-full pointer-events-none" />
          <div className="container mx-auto px-6 relative z-10 max-w-5xl text-center">
            <div className="w-16 h-16 bg-accent-violet/10 text-accent-violet rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield size={32} />
            </div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold uppercase tracking-tight text-white mb-6"
            >
              {title}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-text-secondary font-mono text-sm tracking-widest uppercase"
            >
              Last Updated: {lastUpdated}
            </motion.p>
          </div>
        </section>

        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 relative">
            
            {/* Table of Contents (Sidebar) */}
            <aside className="w-full lg:w-64 flex-shrink-0">
              <div className="sticky top-32">
                <h3 className="font-heading font-bold text-white mb-6 uppercase tracking-wider text-sm border-b border-surface-border pb-4">Table of Contents</h3>
                <nav className="flex flex-col gap-3">
                  {sections.map((section) => (
                    <a 
                      key={section.id}
                      href={`#${section.id}`}
                      className={`text-sm font-body transition-colors hover:text-accent-violet ${
                        activeSection === section.id ? "text-accent-violet font-medium" : "text-text-secondary"
                      }`}
                    >
                      {section.title}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Content Area */}
            <div className="flex-1 max-w-3xl">
              <div className="prose prose-invert prose-violet max-w-none prose-h2:font-heading prose-h2:uppercase prose-h2:tracking-tight prose-h2:text-white prose-h2:border-b prose-h2:border-surface-border prose-h2:pb-4 prose-h2:mt-12 prose-h2:mb-6 prose-p:text-text-secondary prose-p:leading-relaxed prose-li:text-text-secondary prose-a:text-accent-violet prose-a:no-underline hover:prose-a:underline">
                {sections.map((section) => (
                  <div key={section.id} id={section.id} className="scroll-mt-32">
                    <h2>{section.title}</h2>
                    <div className="mb-12">
                      {section.content}
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact CTA */}
              <div className="mt-16 pt-12 border-t border-surface-border">
                <h3 className="text-2xl font-heading font-bold text-white mb-4">Questions about this policy?</h3>
                <p className="text-text-secondary mb-8">
                  Our legal team is available to help answer any questions you might have.
                </p>
                <Button variant="secondary" asChild>
                  <a href="mailto:legal@frontendarena.online">Contact Legal Team</a>
                </Button>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
