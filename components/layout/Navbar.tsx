"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { label: "Tournaments", href: "/tournaments" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "Hall of Fame", href: "/hall-of-fame" },
  { label: "Sponsors", href: "/sponsors" },
]

import Link from "next/link"

function NavLink({ label, href, active = false }: { label: string, href: string, active?: boolean }) {
  return (
    <Link 
      href={href}
      className={cn(
        "group relative inline-flex items-center text-sm font-body font-medium transition-colors duration-300",
        active ? "text-text-primary" : "text-text-secondary hover:text-text-primary"
      )}
    >
      <span className="relative z-10 py-2">{label}</span>
      {/* Gold underline draw (Monument pace) - Pure CSS */}
      <span 
        className={cn(
          "absolute bottom-0 left-0 w-full h-[2px] bg-accent-gold origin-left transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
        )} 
      />
    </Link>
  )
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  React.useEffect(() => {
    // Passive scroll listener for the 80px threshold
    const handleScroll = () => {
      if (window.scrollY >= 80 && !isScrolled) {
        setIsScrolled(true)
      } else if (window.scrollY < 80 && isScrolled) {
        setIsScrolled(false)
      }
    }

    // Initial check
    handleScroll()

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isScrolled])

  // Prevent scroll when mobile menu is open
  React.useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [mobileMenuOpen])

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 h-[var(--header-height)] flex items-center transition-all duration-300 ease-in-out border-b",
          isScrolled 
            // Obsidian glass-blur at 80% opacity
            ? "bg-[#060608]/80 backdrop-blur-md border-surface-border shadow-lg" 
            // Transparent over Hero
            : "bg-transparent border-transparent"
        )}
      >
        <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 flex items-center justify-between">
          
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2 z-50">
            <span className="text-xl font-heading font-bold uppercase tracking-tight text-text-primary">
              Frontend <span className="text-accent-gold">Arena</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.label} label={link.label} href={link.href} />
            ))}
          </nav>

          {/* Desktop Nav Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <Button variant="secondary" size="sm" className="text-text-primary hover:text-accent-violet" asChild>
              <Link href="/admin">
                Admin
              </Link>
            </Button>
            <Button variant="secondary" size="sm" className="text-text-primary hover:text-accent-gold" asChild>
              <Link href="/login">
                Login
              </Link>
            </Button>
            <Button variant="primary" size="sm" asChild>
              <Link href="/frontend-wars-2026">
                Enter Arena
              </Link>
            </Button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button 
            className="lg:hidden flex items-center justify-center text-text-primary z-50 p-3 min-w-[44px] min-h-[44px]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Slide-in Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            // Live easing for direct-manipulation UI: snappier spring
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-surface lg:hidden flex flex-col pt-[var(--header-height)]"
          >
            <nav className="flex flex-col px-6 py-8 gap-6 border-b border-surface-border">
              {NAV_LINKS.map((link) => (
                <div key={link.label} onClick={() => setMobileMenuOpen(false)}>
                  <NavLink label={link.label} href={link.href} />
                </div>
              ))}
            </nav>
            <div className="p-6 flex flex-col gap-4">
              <Button variant="primary" className="w-full" asChild>
                <Link href="/frontend-wars-2026" onClick={() => setMobileMenuOpen(false)}>
                  Enter Arena
                </Link>
              </Button>
              <Button variant="secondary" className="w-full" asChild>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  Login to Portal
                </Link>
              </Button>
              <Button variant="ghost" className="w-full text-text-muted" asChild>
                <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                  Admin Panel
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
