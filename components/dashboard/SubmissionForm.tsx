"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { AlertCircle, Loader2, AlertTriangle } from "lucide-react"
import { createSubmission } from "@/app/dashboard/submissions/actions"
import { Submission } from "@/lib/types"

interface SubmissionFormProps {
  teamId: string
  trackId: string
  onSuccess: (submission: Submission) => void
}

export function SubmissionForm({ teamId, trackId, onSuccess }: SubmissionFormProps) {
  const formRef = React.useRef<HTMLFormElement>(null)
  const [loading, setLoading] = React.useState(false)
  const [errorMsg, setErrorMsg] = React.useState("")
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false)

  const executeSubmit = async () => {
    if (!formRef.current) return
    setShowConfirmDialog(false)
    setLoading(true)
    setErrorMsg("")
    
    const formData = new FormData(formRef.current)
    const result = await createSubmission(teamId, trackId, formData)
    
    if (result.success) {
      onSuccess(result.submission as unknown as Submission)
    } else if (result.reason === "already_submitted") {
      onSuccess(result.existingSubmission as unknown as Submission)
    } else {
      setErrorMsg(result.error || "Failed to submit. Please try again.")
      setLoading(false)
    }
  }

  const handleTriggerSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formRef.current?.reportValidity()) {
      setShowConfirmDialog(true)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form ref={formRef} onSubmit={handleTriggerSubmit} className="space-y-8">
        
        {errorMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-red-500/10 border border-red-500/50 flex items-center gap-3 text-red-400"
          >
            <AlertCircle size={20} className="shrink-0" />
            <span>{errorMsg}</span>
          </motion.div>
        )}

        {/* Section 1: Basic Information */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface border border-surface-border rounded-xl p-6 md:p-8"
        >
          <h2 className="text-xl font-heading font-bold text-white mb-6 border-b border-surface-border pb-4">
            1. Basic Information
          </h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-mono text-text-muted uppercase tracking-wider block">
                Project Name <span className="text-red-400">*</span>
              </label>
              <input 
                type="text" 
                name="projectName" 
                required 
                placeholder="e.g. Nexus Dashboard" 
                className="w-full bg-background border border-surface-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent-violet transition-colors" 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-mono text-text-muted uppercase tracking-wider block">
                Project Tagline <span className="text-red-400">*</span>
              </label>
              <input 
                type="text" 
                name="tagline" 
                required 
                placeholder="A short, catchy description" 
                className="w-full bg-background border border-surface-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent-violet transition-colors" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-mono text-text-muted uppercase tracking-wider block">
                Project Description <span className="text-red-400">*</span>
              </label>
              <textarea 
                name="description" 
                required 
                rows={4} 
                placeholder="Explain what your project does and the problem it solves..." 
                className="w-full bg-background border border-surface-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent-violet transition-colors resize-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-mono text-text-muted uppercase tracking-wider block">
                Tech Stack <span className="text-red-400">*</span>
              </label>
              <input 
                type="text" 
                name="techStack" 
                required 
                placeholder="e.g. React 19, Vite, Tailwind CSS, Framer Motion" 
                className="w-full bg-background border border-surface-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent-violet transition-colors" 
              />
            </div>
          </div>
        </motion.section>

        {/* Section 2: Links */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface border border-surface-border rounded-xl p-6 md:p-8"
        >
          <h2 className="text-xl font-heading font-bold text-white mb-6 border-b border-surface-border pb-4">
            2. Project Links
          </h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-mono text-text-muted uppercase tracking-wider block">
                GitHub Repository URL <span className="text-red-400">*</span>
              </label>
              <input 
                type="url" 
                name="githubUrl" 
                required 
                placeholder="https://github.com/yourusername/project" 
                className="w-full bg-background border border-surface-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent-violet transition-colors" 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-mono text-text-muted uppercase tracking-wider block">
                Live Deployment URL <span className="text-red-400">*</span>
              </label>
              <input 
                type="url" 
                name="demoUrl" 
                required 
                placeholder="https://your-project.vercel.app" 
                className="w-full bg-background border border-surface-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent-violet transition-colors" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-mono text-text-muted uppercase tracking-wider block">
                Demo Video URL (YouTube/Drive) <span className="text-red-400">*</span>
              </label>
              <input 
                type="url" 
                name="videoUrl" 
                required 
                placeholder="https://youtube.com/watch?v=..." 
                className="w-full bg-background border border-surface-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent-violet transition-colors" 
              />
            </div>
          </div>
        </motion.section>

        {/* Section 3: Additional Information */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-surface border border-surface-border rounded-xl p-6 md:p-8"
        >
          <h2 className="text-xl font-heading font-bold text-white mb-6 border-b border-surface-border pb-4">
            3. Additional Information
          </h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-mono text-text-muted uppercase tracking-wider block">Challenges Faced</label>
              <textarea 
                name="challenges" 
                rows={3} 
                placeholder="What was the hardest part of building this?" 
                className="w-full bg-background border border-surface-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent-violet transition-colors resize-none" 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-mono text-text-muted uppercase tracking-wider block">Key Features</label>
              <textarea 
                name="keyFeatures" 
                rows={3} 
                placeholder="Highlight 3-4 main features..." 
                className="w-full bg-background border border-surface-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent-violet transition-colors resize-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-mono text-text-muted uppercase tracking-wider block">Future Improvements</label>
              <textarea 
                name="futureImprovements" 
                rows={3} 
                placeholder="What would you add next?" 
                className="w-full bg-background border border-surface-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent-violet transition-colors resize-none" 
              />
            </div>
          </div>
        </motion.section>

        {/* Section 4: Declaration */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-surface border border-surface-border rounded-xl p-6 md:p-8"
        >
          <h2 className="text-xl font-heading font-bold text-white mb-6 border-b border-surface-border pb-4">
            4. Declaration
          </h2>
          <div className="flex items-start gap-4">
            <input 
              type="checkbox" 
              name="declaration" 
              required 
              id="declaration" 
              className="mt-1 rounded border-surface-border bg-background text-accent-violet focus:ring-accent-violet" 
            />
            <label htmlFor="declaration" className="text-text-primary text-sm leading-relaxed">
              I confirm that this submission is our team's original work, created during the hackathon period, and we have adhered to all Rules & Guidelines.
            </label>
          </div>
        </motion.section>

        {/* Warning and Action Buttons */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col md:flex-row items-center justify-between gap-6 bg-accent-gold/5 border border-accent-gold/20 rounded-xl p-6"
        >
          {/* Note near form */}
          <p className="text-accent-gold text-sm font-body">
            ⚠️ <strong>Important Note:</strong> You can only submit once — double-check your links and write-up before submitting.
          </p>
          
          <Button 
            type="submit" 
            variant="primary" 
            disabled={loading}
            className="w-full md:w-auto px-8 py-3 bg-green-500 hover:bg-green-600 text-white border-green-500 shrink-0 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Submitting...
              </>
            ) : (
              "Final Submit"
            )}
          </Button>
        </motion.div>

      </form>

      {/* Confirmation Dialog Overlay */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-surface-border rounded-xl p-6 max-w-md w-full shadow-2xl relative" role="dialog" aria-modal="true">
            <div className="absolute -top-1 -left-1 w-3 h-3 border-t-[2px] border-l-[2px] border-accent-gold/40" />
            <div className="absolute -top-1 -right-1 w-3 h-3 border-t-[2px] border-r-[2px] border-accent-gold/40" />

            <div className="flex items-center gap-3 text-accent-gold mb-4">
              <AlertTriangle size={24} />
              <h4 className="text-lg font-heading font-bold text-white">Final Project Submission</h4>
            </div>
            
            <p className="text-sm text-text-secondary font-body mb-6 leading-relaxed">
              This is your final submission and cannot be edited or resubmitted afterward. Submit now?
            </p>

            <div className="flex justify-end gap-3">
              <button 
                type="button"
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 rounded-lg bg-surface-hover border border-surface-border text-text-secondary hover:text-white transition-colors text-sm font-mono"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={executeSubmit}
                className="px-4 py-2 rounded-lg bg-green-500 text-white font-bold hover:bg-green-600 transition-colors text-sm font-mono flex items-center gap-2"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
