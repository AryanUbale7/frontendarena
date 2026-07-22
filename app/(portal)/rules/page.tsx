"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { 
  BookOpen, 
  CheckCircle, 
  Code2, 
  ShieldCheck, 
  XCircle, 
  Bot, 
  UploadCloud, 
  Layers, 
  Scale, 
  AlertOctagon,
  Sparkles,
  Info
} from "lucide-react"

export default function RulesPage() {
  return (
    <div className="w-full h-full flex flex-col gap-8 pb-12 text-text-primary">
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface border border-surface-border rounded-2xl p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-accent-violet/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 rounded-full bg-accent-gold/10 border border-accent-gold/20 text-accent-gold text-xs font-mono font-semibold uppercase tracking-wider">
              Official Guidelines
            </span>
            <span className="text-xs font-mono text-text-muted uppercase">Page 1 & 2 of 2</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-white tracking-tight flex items-center gap-3">
            <BookOpen className="text-accent-gold flex-shrink-0" size={36} />
            FRONTEND WARS 2026 — RULES & ELIGIBILITY
          </h1>
          <p className="text-text-secondary font-body mt-2 max-w-3xl leading-relaxed">
            These rules are designed to ensure a fair, transparent, and competitive experience for everyone. Please read carefully before starting your project.
          </p>
        </div>
      </motion.div>

      {/* 01 ELIGIBILITY */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-surface border border-surface-border rounded-2xl p-8"
      >
        <div className="flex items-center gap-3 mb-6 border-b border-surface-border pb-4">
          <span className="font-mono text-sm font-bold text-accent-violet bg-accent-violet/10 px-3 py-1 rounded-md border border-accent-violet/20">
            01
          </span>
          <h2 className="text-xl font-heading font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <CheckCircle className="text-status-success" size={22} />
            Eligibility
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: "Open to all students and developers", icon: "🌐" },
            { label: "Individual participation only (No teams)", icon: "👤" },
            { label: "Participants from any college or org welcome", icon: "🎓" },
            { label: "Cross-college participation is allowed", icon: "🤝" },
            { label: "A valid GitHub account is mandatory", icon: "💻" },
            { label: "Submit all required deliverables before deadline", icon: "📋" }
          ].map((item, idx) => (
            <div key={idx} className="bg-background/60 border border-surface-border rounded-xl p-4 flex flex-col items-center text-center justify-between hover:border-accent-violet/50 transition-colors">
              <span className="text-2xl mb-2">{item.icon}</span>
              <p className="text-xs font-body text-text-secondary leading-snug">{item.label}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* 02 & 03 TECH & ALLOWED LIBRARIES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 02 TECHNOLOGY REQUIREMENTS */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-5 bg-surface border border-surface-border rounded-2xl p-8 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-3 mb-6 border-b border-surface-border pb-4">
              <span className="font-mono text-sm font-bold text-accent-violet bg-accent-violet/10 px-3 py-1 rounded-md border border-accent-violet/20">
                02
              </span>
              <h2 className="text-xl font-heading font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Code2 className="text-accent-violet" size={22} />
                Technology Requirements
              </h2>
            </div>

            <p className="text-sm text-text-secondary mb-6 font-body">
              Participants must build their project using the following core technologies:
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { name: "React", status: "MANDATORY", color: "from-blue-500/20 to-cyan-500/10 border-cyan-500/30 text-cyan-400" },
                { name: "TypeScript", status: "MANDATORY", color: "from-blue-600/20 to-indigo-500/10 border-blue-500/30 text-blue-400" },
                { name: "Vite", status: "MANDATORY", color: "from-purple-500/20 to-yellow-500/10 border-purple-500/30 text-purple-400" },
                { name: "Tailwind CSS", status: "MANDATORY", color: "from-teal-500/20 to-sky-500/10 border-teal-500/30 text-teal-400" }
              ].map((tech) => (
                <div key={tech.name} className={`bg-gradient-to-br ${tech.color} border rounded-xl p-4 flex flex-col items-center justify-center gap-2 text-center`}>
                  <span className="font-heading font-bold text-lg text-white">{tech.name}</span>
                  <span className="text-[10px] font-mono font-bold bg-background/80 px-2.5 py-0.5 rounded-full uppercase tracking-wider text-text-muted border border-surface-border">
                    {tech.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-background/80 border border-surface-border rounded-xl p-4 space-y-2 text-xs text-text-secondary font-body">
            <p className="font-bold text-accent-gold flex items-center gap-1.5 font-heading">
              <Info size={14} /> IMPORTANT:
            </p>
            <ul className="space-y-1 pl-4 list-disc text-text-muted font-mono text-[11px]">
              <li>Runs entirely in the browser</li>
              <li>Does NOT introduce backend functionality</li>
              <li>Does NOT rely on server-side rendering</li>
              <li>Does NOT use cloud services or databases</li>
              <li>Does NOT provide complete application templates</li>
            </ul>
          </div>
        </motion.section>

        {/* 03 ALLOWED FRONTEND LIBRARIES */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-7 bg-surface border border-surface-border rounded-2xl p-8 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-3 mb-6 border-b border-surface-border pb-4">
              <span className="font-mono text-sm font-bold text-accent-violet bg-accent-violet/10 px-3 py-1 rounded-md border border-accent-violet/20">
                03
              </span>
              <h2 className="text-xl font-heading font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="text-status-success" size={22} />
                Allowed Frontend Libraries
              </h2>
            </div>

            <p className="text-sm text-text-secondary mb-4 font-body">
              Participants are free to use any client-side frontend library that enhances their solution.
            </p>

            <div className="mb-6">
              <p className="text-xs font-mono text-text-muted uppercase mb-3 font-semibold">Examples include (but are not limited to):</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
                {[
                  "Three.js", "React Three Fiber", "GSAP", "Framer Motion", "Lenis", "Chart.js",
                  "Recharts", "D3.js", "React Icons", "Lucide React", "Zustand", "shadcn/ui & Radix UI"
                ].map((lib) => (
                  <div key={lib} className="bg-background/60 border border-surface-border rounded-lg p-2.5 flex items-center gap-2 text-text-primary">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-violet" />
                    <span>{lib}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-accent-violet/10 border border-accent-violet/20 rounded-xl p-4 flex items-start gap-3">
            <Sparkles className="text-accent-violet flex-shrink-0 mt-0.5" size={18} />
            <p className="text-xs text-text-secondary font-body">
              <strong className="text-white">This is NOT a whitelist.</strong> Any frontend library is allowed unless it violates the competition restrictions or provides full pre-built app templates.
            </p>
          </div>
        </motion.section>
      </div>

      {/* 04 NOT ALLOWED */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-surface border border-red-500/30 rounded-2xl p-8 relative overflow-hidden"
      >
        <div className="flex items-center gap-3 mb-6 border-b border-surface-border pb-4">
          <span className="font-mono text-sm font-bold text-red-400 bg-red-500/10 px-3 py-1 rounded-md border border-red-500/20">
            04
          </span>
          <h2 className="text-xl font-heading font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
            <XCircle size={22} />
            Not Allowed (Strict Disqualification Criteria)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-background/80 border border-surface-border rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-heading font-bold text-white uppercase tracking-wider border-b border-surface-border pb-2">
              🚫 Backend & Server Tech
            </h3>
            <ul className="space-y-2 text-xs font-mono text-text-secondary">
              <li className="flex items-center gap-2"><span className="text-red-400">✖</span> Backend servers</li>
              <li className="flex items-center gap-2"><span className="text-red-400">✖</span> Server-side rendering (SSR)</li>
              <li className="flex items-center gap-2"><span className="text-red-400">✖</span> Firebase / Supabase / Appwrite</li>
              <li className="flex items-center gap-2"><span className="text-red-400">✖</span> Databases (MongoDB, Postgres, MySQL)</li>
            </ul>
          </div>

          <div className="bg-background/80 border border-surface-border rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-heading font-bold text-white uppercase tracking-wider border-b border-surface-border pb-2">
              🌐 External Services
            </h3>
            <ul className="space-y-2 text-xs font-mono text-text-secondary">
              <li className="flex items-center gap-2"><span className="text-red-400">✖</span> External APIs for dynamic data</li>
              <li className="flex items-center gap-2"><span className="text-red-400">✖</span> Cloud databases</li>
              <li className="flex items-center gap-2"><span className="text-red-400">✖</span> Third-party Authentication services</li>
            </ul>
          </div>

          <div className="bg-background/80 border border-surface-border rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-heading font-bold text-white uppercase tracking-wider border-b border-surface-border pb-2">
              ⚠️ Unfair Advantages
            </h3>
            <ul className="space-y-2 text-xs font-mono text-text-secondary">
              <li className="flex items-center gap-2"><span className="text-red-400">✖</span> Pre-built application templates</li>
              <li className="flex items-center gap-2"><span className="text-red-400">✖</span> Complete AI-generated projects</li>
              <li className="flex items-center gap-2"><span className="text-red-400">✖</span> Previously completed projects</li>
            </ul>
          </div>
        </div>
      </motion.section>

      {/* 05 & 06 AI POLICY & SUBMISSION REQUIREMENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 05 AI TOOLS POLICY */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-surface border border-surface-border rounded-2xl p-8"
        >
          <div className="flex items-center gap-3 mb-6 border-b border-surface-border pb-4">
            <span className="font-mono text-sm font-bold text-accent-violet bg-accent-violet/10 px-3 py-1 rounded-md border border-accent-violet/20">
              05
            </span>
            <h2 className="text-xl font-heading font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Bot className="text-purple-400" size={22} />
              AI Tools Policy
            </h2>
          </div>

          <div className="space-y-4 text-xs font-body text-text-secondary">
            <div className="p-4 bg-background/60 border border-surface-border rounded-xl space-y-1">
              <p className="font-bold text-white text-sm">✅ AI-assisted coding is allowed</p>
              <p className="text-text-muted leading-relaxed">
                Tools like ChatGPT, Claude, Copilot, Antigravity, etc. may be used to write code, debug, and speed up your work as in a real job.
              </p>
            </div>

            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl space-y-1">
              <p className="font-bold text-red-400 text-sm">🚫 AI-generated complete submissions are NOT allowed</p>
              <p className="text-text-muted leading-relaxed">
                A project that is substantially AI-generated as a whole, rather than AI-assisted, will be disqualified.
              </p>
            </div>

            <div className="p-4 bg-background/60 border border-surface-border rounded-xl space-y-1">
              <p className="font-bold text-white text-sm">⚡ Bypassing rules using AI is not allowed</p>
              <p className="text-text-muted leading-relaxed">
                Using AI to bypass technology requirements (e.g. scaffolding a disallowed framework and disguising it) will lead to disqualification.
              </p>
            </div>
          </div>
        </motion.section>

        {/* 06 SUBMISSION REQUIREMENTS */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-surface border border-surface-border rounded-2xl p-8"
        >
          <div className="flex items-center gap-3 mb-6 border-b border-surface-border pb-4">
            <span className="font-mono text-sm font-bold text-accent-violet bg-accent-violet/10 px-3 py-1 rounded-md border border-accent-violet/20">
              06
            </span>
            <h2 className="text-xl font-heading font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <UploadCloud className="text-status-success" size={22} />
              Submission Requirements
            </h2>
          </div>

          <div className="space-y-4">
            {[
              { title: "GitHub Repository Link", desc: "Public GitHub repository containing the complete source code." },
              { title: "Live Deployment Link", desc: "Your project must be live and accessible to the judges (Vercel, Netlify, Github Pages)." },
              { title: "Short Project Description", desc: "A brief description of your project, features, and instructions on how to run it in README." },
              { title: "All deliverables must be submitted", desc: "Ensure all required links and documents are submitted before the deadline." }
            ].map((req, i) => (
              <div key={i} className="p-4 bg-background/60 border border-surface-border rounded-xl flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-status-success mt-1.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-white text-sm font-heading">{req.title}</h4>
                  <p className="text-xs text-text-muted mt-0.5 leading-relaxed">{req.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      </div>

      {/* 07 FRONTEND CAPABILITIES (ALLOWED) */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-surface border border-surface-border rounded-2xl p-8"
      >
        <div className="flex items-center gap-3 mb-6 border-b border-surface-border pb-4">
          <span className="font-mono text-sm font-bold text-accent-violet bg-accent-violet/10 px-3 py-1 rounded-md border border-accent-violet/20">
            07
          </span>
          <h2 className="text-xl font-heading font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Layers className="text-accent-violet" size={22} />
            Frontend Capabilities (Allowed Client-Side Features)
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {[
            "Local Storage", "Session Storage", "IndexedDB", "Browser APIs",
            "Mock JSON Data", "Client-side Routing", "Client-side State Management", "Static Assets & Resources"
          ].map((item) => (
            <div key={item} className="bg-background/60 border border-surface-border rounded-xl p-3.5 text-center font-mono text-xs text-text-primary">
              {item}
            </div>
          ))}
        </div>

        <p className="text-xs text-text-muted font-mono italic text-center">
          Important: All data must remain on the client side. No external databases, APIs, or backend services are allowed.
        </p>
      </motion.section>

      {/* 08 & 09 JUDGING PARAMETERS & DISQUALIFICATION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 08 JUDGING PARAMETERS */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="lg:col-span-7 bg-surface border border-surface-border rounded-2xl p-8"
        >
          <div className="flex items-center gap-3 mb-6 border-b border-surface-border pb-4">
            <span className="font-mono text-sm font-bold text-accent-gold bg-accent-gold/10 px-3 py-1 rounded-md border border-accent-gold/20">
              08
            </span>
            <h2 className="text-xl font-heading font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Scale className="text-accent-gold" size={22} />
              Judging Parameters
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { title: "Product Thinking", desc: "How well your solution addresses the problem and user needs." },
              { title: "User Experience", desc: "Ease of use, flow, and overall user satisfaction." },
              { title: "Visual Design", desc: "UI aesthetics, layout, typography, and color harmony." },
              { title: "Functionality", desc: "Features work as described and meet requirements." },
              { title: "Code Quality", desc: "Clean, readable, maintainable and well-structured code." },
              { title: "Creativity", desc: "Originality of idea and uniqueness in implementation." },
              { title: "Performance", desc: "Speed, responsiveness, and overall efficiency." },
              { title: "Data Visualization", desc: "Clarity, accuracy, and effectiveness of data representation." }
            ].map((param) => (
              <div key={param.title} className="bg-background/60 border border-surface-border rounded-xl p-3.5 space-y-1">
                <h4 className="font-bold text-accent-gold text-xs font-heading">{param.title}</h4>
                <p className="text-[11px] text-text-muted leading-tight">{param.desc}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* 09 DISQUALIFICATION GROUNDS */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-5 bg-surface border border-red-500/30 rounded-2xl p-8 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-3 mb-6 border-b border-surface-border pb-4">
              <span className="font-mono text-sm font-bold text-red-400 bg-red-500/10 px-3 py-1 rounded-md border border-red-500/20">
                09
              </span>
              <h2 className="text-xl font-heading font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
                <AlertOctagon size={22} />
                Disqualification Grounds
              </h2>
            </div>

            <ul className="space-y-3 text-xs font-body text-text-secondary">
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">🚫</span>
                <span>Use of a disallowed framework/technology.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">🚫</span>
                <span>Use of a pre-built template as the project's starting point.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">🚫</span>
                <span>Substantially AI-generated as a whole, rather than AI-assisted.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">🚫</span>
                <span>Inability to explain your own submitted code when asked by a judge.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">🚫</span>
                <span>Missing any required submission deliverable before deadline.</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-[11px] text-red-400 font-mono text-center">
            Note: The decision of the organizers and judges will be final and binding in all matters.
          </div>
        </motion.section>

      </div>

    </div>
  )
}
