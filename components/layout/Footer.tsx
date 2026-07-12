"use client"

import * as React from "react"
import { motion } from "framer-motion"

// --- Components ---

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

function SocialIcon({ href, icon: Icon }: { href: string, icon: React.ElementType }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="text-text-muted hover:text-accent-gold transition-colors duration-300 p-3 min-w-[44px] min-h-[44px] flex items-center justify-center"
    >
      <Icon className="w-5 h-5" />
    </a>
  )
}

function FooterColumn({ title, links }: { title: string, links: { label: string, href: string }[] }) {
  return (
    <div className="flex flex-col gap-4">
      <h4 className="text-sm font-heading font-semibold text-text-primary uppercase tracking-widest">{title}</h4>
      <ul className="flex flex-col gap-3">
        {links.map((link, idx) => (
          <li key={idx}>
            <a 
              href={link.href}
              className="group relative inline-flex text-sm text-text-secondary font-body overflow-hidden"
            >
              <span className="relative z-10 transition-colors duration-300 group-hover:text-text-primary">
                {link.label}
              </span>
              {/* Gold underline draw (Monument pace) - Pure CSS */}
              <span className="absolute bottom-0 left-0 w-full h-px bg-accent-gold origin-left scale-x-0 transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

// --- Main Footer ---

export function Footer() {
  const columns = [
    {
      title: "Arena",
      links: [
        { label: "Tournaments", href: "#" },
        { label: "Leaderboard", href: "#" },
        { label: "Rules & Guidelines", href: "#" },
      ]
    },
    {
      title: "Community",
      links: [
        { label: "WhatsApp Community", href: "#" },
        { label: "Instagram", href: "https://www.instagram.com/frontend_arena/" },
        { label: "Code of Conduct", href: "#" },
      ]
    },
    {
      title: "Partners",
      links: [
        { label: "Sponsor the Arena", href: "#" },
        { label: "UptoSkills", href: "#" },
        { label: "InterviewBuddy", href: "#" },
      ]
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "/privacy-policy" },
        { label: "Terms of Service", href: "/terms-of-service" },
        { label: "Cookie Policy", href: "/cookie-policy" },
      ]
    }
  ]

  return (
    <motion.footer 
      className="w-full bg-surface border-t border-surface-border pt-16 pb-8 px-6 md:px-12 lg:px-24"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="max-w-[1400px] mx-auto">
        
        {/* Top: 4 Columns Row -> Stacked on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          
          {/* Brand/Logo Column (takes up 2 cols on lg) */}
          <div className="lg:col-span-2 flex flex-col gap-6 max-w-xs">
            <h2 className="text-2xl font-heading font-bold uppercase tracking-tight text-text-primary">
              Frontend <span className="text-accent-gold">Arena</span>
            </h2>
            <p className="text-sm text-text-secondary font-body leading-relaxed">
              The ultimate battleground for frontend developers. Code, survive, and conquer your way to the top of the global leaderboard.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <SocialIcon href="https://www.instagram.com/frontend_arena/" icon={InstagramIcon} />
              <SocialIcon href="#" icon={LinkedinIcon} />
            </div>
          </div>

          {/* Navigation Columns */}
          {columns.map((col, idx) => (
            <FooterColumn key={idx} title={col.title} links={col.links} />
          ))}

        </div>

        {/* Bottom: Copyright */}
        <div className="w-full flex flex-col md:flex-row items-center justify-between border-t border-surface-border pt-8 text-xs font-mono text-text-muted">
          <p>© {new Date().getFullYear()} Frontend Arena. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Designed for the elite.</p>
        </div>

      </div>
    </motion.footer>
  )
}
