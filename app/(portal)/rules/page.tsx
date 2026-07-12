"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { BookOpen, CheckCircle, Code, Shield, XCircle, Cpu, FileCheck, Target, AlertTriangle } from "lucide-react"

export default function RulesPage() {
  return (
    <div className="w-full h-full flex flex-col gap-8 pb-12">
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-heading font-bold text-text-primary mb-2 flex items-center gap-3">
          <BookOpen className="text-accent-gold" size={32} />
          FRONTEND WARS 2026 — RULES
        </h1>
        <p className="text-text-secondary font-body">Everything you need to know to compete in the arena.</p>
      </motion.div>

      <div className="grid grid-cols-1 gap-8">
        
        {/* Eligibility */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface border border-surface-border rounded-xl p-8"
        >
          <h2 className="text-xl font-heading font-bold text-white mb-6 border-b border-surface-border pb-4 flex items-center gap-2">
            <CheckCircle className="text-green-400" size={20} />
            Eligibility
          </h2>
          <ul className="space-y-4 text-text-secondary font-body list-disc pl-5">
            <li>Open to all students and developers.</li>
            <li>Individual participation only.</li>
            <li>Cross-college participation allowed.</li>
            <li>Participants must have a GitHub account.</li>
            <li>Participants must submit all deliverables before the deadline.</li>
          </ul>
        </motion.section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Technology Requirements */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-surface border border-surface-border rounded-xl p-8"
          >
            <h2 className="text-xl font-heading font-bold text-white mb-6 border-b border-surface-border pb-4 flex items-center gap-2">
              <Code className="text-accent-violet" size={20} />
              Technology Requirements
            </h2>
            <ul className="space-y-4 text-text-secondary font-body list-disc pl-5">
              <li>React 19</li>
              <li>TypeScript</li>
              <li>Vite</li>
              <li>Tailwind CSS</li>
            </ul>
          </motion.section>

          {/* Allowed Libraries */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-surface border border-surface-border rounded-xl p-8"
          >
            <h2 className="text-xl font-heading font-bold text-white mb-6 border-b border-surface-border pb-4 flex items-center gap-2">
              <Shield className="text-blue-400" size={20} />
              Allowed Libraries
            </h2>
            <ul className="space-y-4 text-text-secondary font-body list-disc pl-5">
              <li>Framer Motion</li>
              <li>Chart.js</li>
              <li>Recharts</li>
              <li>React Icons</li>
              <li>Lucide React</li>
              <li>Additional frontend libraries may be used, provided they do not offer complete pre-built application templates.</li>
            </ul>
          </motion.section>
        </div>

        {/* Not Allowed */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-surface border border-surface-border rounded-xl p-8"
        >
          <h2 className="text-xl font-heading font-bold text-white mb-6 border-b border-surface-border pb-4 flex items-center gap-2">
            <XCircle className="text-red-400" size={20} />
            Not Allowed
          </h2>
          <div className="flex flex-wrap gap-3">
            {['Next.js', 'Vue.js', 'Angular', 'Svelte', 'Backend Development', 'Firebase', 'Supabase', 'Databases', 'External APIs', 'Pre-built Templates', 'AI-generated complete project submissions'].map((item) => (
              <span key={item} className="px-3 py-1.5 rounded-full bg-red-400/10 text-red-400 border border-red-400/20 text-sm font-mono">
                {item}
              </span>
            ))}
          </div>
        </motion.section>

        {/* AI Tools Policy */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-surface border border-surface-border rounded-xl p-8"
        >
          <h2 className="text-xl font-heading font-bold text-white mb-6 border-b border-surface-border pb-4 flex items-center gap-2">
            <Cpu className="text-purple-400" size={20} />
            AI Tools Policy
          </h2>
          <ul className="space-y-4 text-text-secondary font-body list-disc pl-5">
            <li><strong className="text-white">AI-assisted coding is allowed</strong> (ChatGPT, Claude, Copilot, Antigravity, etc.) — use it to write code, debug, and speed up your work, same as in a real job.</li>
            <li><strong className="text-white">AI-generated complete submissions are not allowed</strong> — a project that is substantially AI-generated as a whole, rather than AI-assisted, will be disqualified.</li>
            <li>Using AI to bypass the Technology Requirements (e.g., scaffolding a disallowed framework and disguising it) is not allowed.</li>
            <li><strong className="text-white">You must be able to explain your own code to a judge.</strong> If you can't explain a part of your submission, it will be treated as if you didn't build it.</li>
          </ul>
        </motion.section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Submission Requirements */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-surface border border-surface-border rounded-xl p-8"
          >
            <h2 className="text-xl font-heading font-bold text-white mb-6 border-b border-surface-border pb-4 flex items-center gap-2">
              <FileCheck className="text-green-400" size={20} />
              Submission Requirements
            </h2>
            <ul className="space-y-4 text-text-secondary font-body list-disc pl-5">
              <li>GitHub Repository Link</li>
              <li>Live Deployment Link</li>
              <li>Short Project Description</li>
            </ul>
          </motion.section>

          {/* Judging Parameters */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-surface border border-surface-border rounded-xl p-8"
          >
            <h2 className="text-xl font-heading font-bold text-white mb-6 border-b border-surface-border pb-4 flex items-center gap-2">
              <Target className="text-accent-gold" size={20} />
              Judging Parameters
            </h2>
            <div className="flex flex-wrap gap-2">
              {['Product Thinking', 'User Experience', 'Visual Design', 'Functionality', 'Code Quality', 'Creativity', 'Performance', 'Data Visualization'].map((param) => (
                <span key={param} className="px-3 py-1.5 rounded bg-accent-gold/10 text-accent-gold border border-accent-gold/20 text-xs font-mono uppercase">
                  {param}
                </span>
              ))}
            </div>
          </motion.section>
        </div>

        {/* Disqualification Grounds */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-surface border border-surface-border rounded-xl p-8"
        >
          <h2 className="text-xl font-heading font-bold text-white mb-6 border-b border-surface-border pb-4 flex items-center gap-2">
            <AlertTriangle className="text-red-500" size={20} />
            Disqualification Grounds
          </h2>
          <ul className="space-y-4 text-text-secondary font-body list-disc pl-5">
            <li>Use of a disallowed framework/technology.</li>
            <li>Use of a pre-built template as the project's starting point.</li>
            <li>A submission that is substantially AI-generated as a whole, rather than AI-assisted.</li>
            <li>Inability to explain your own submitted code when asked by a judge.</li>
            <li>Missing any required submission deliverable before the deadline.</li>
          </ul>
        </motion.section>

      </div>
    </div>
  )
}
