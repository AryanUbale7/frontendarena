"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Search, Filter, ExternalLink, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"

import { getAllSubmissions } from "@/actions/admin"
import { Loader2 } from "lucide-react"
import { AdminSubmission } from "@/lib/types"

export default function SubmissionsPage() {
  const [data, setData] = React.useState<AdminSubmission[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    getAllSubmissions().then((res) => {
      if (res.data) setData(res.data)
      setLoading(false)
    })
  }, [])

  return (
    <div className="w-full max-w-6xl mx-auto h-full flex flex-col pt-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">Submissions</h1>
          <p className="text-text-secondary font-body">Review and score participant projects.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input 
              type="text" 
              placeholder="Search ID or User..." 
              className="w-full bg-surface border border-surface-border rounded-md pl-10 pr-4 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-violet transition-colors"
            />
          </div>
          <Button variant="secondary" size="sm" className="h-9 px-3">
            <Filter size={18} />
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-surface border border-surface-border rounded-xl flex-1 overflow-hidden flex flex-col"
      >
        <div className="overflow-x-auto min-h-[300px] hidden md:block">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-border bg-surface-hover/50">
                <th className="p-4 text-xs font-mono text-text-muted uppercase tracking-wider">ID</th>
                <th className="p-4 text-xs font-mono text-text-muted uppercase tracking-wider">Participant</th>
                <th className="p-4 text-xs font-mono text-text-muted uppercase tracking-wider">Track</th>
                <th className="p-4 text-xs font-mono text-text-muted uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-mono text-text-muted uppercase tracking-wider">Links</th>
                <th className="p-4 text-xs font-mono text-text-muted uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <Loader2 className="animate-spin text-accent-violet mx-auto" size={32} />
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-text-muted">
                    No submissions found.
                  </td>
                </tr>
              ) : data.map((sub, i) => (
                <tr key={sub.id} className="hover:bg-surface-hover transition-colors">
                  <td className="p-4 font-mono text-sm text-text-secondary">{sub.id.split('-')[0]}</td>
                  <td className="p-4 font-medium text-text-primary">
                    <Link href={`/admin/submissions/${sub.id}`} className="hover:text-accent-violet transition-colors underline underline-offset-4 decoration-surface-border hover:decoration-accent-violet">
                      {sub.user}
                    </Link>
                  </td>
                  <td className="p-4 text-sm text-text-secondary">{sub.track}</td>
                  <td className="p-4">
                    <Badge variant={sub.status === "Pending" ? "default" : sub.status === "Reviewed" ? "gold" : "violet"}>
                      {sub.status}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <a href={sub.repo.startsWith('http') ? sub.repo : `https://${sub.repo}`} target="_blank" rel="noreferrer" className="p-2 bg-background border border-surface-border rounded hover:text-accent-violet transition-colors" title="GitHub">
                        <CodeIcon size={16} />
                      </a>
                      <a href={sub.demo.startsWith('http') ? sub.demo : `https://${sub.demo}`} target="_blank" rel="noreferrer" className="p-2 bg-background border border-surface-border rounded hover:text-accent-violet transition-colors" title="Live Demo">
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="secondary" size="sm" className="h-8 px-2 text-green-400 hover:text-green-300 hover:bg-green-400/10" title="Mark Evaluated">
                        <CheckCircle size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile card layout */}
        <div className="block md:hidden divide-y divide-surface-border">
          {loading ? (
            <div className="p-12 text-center">
              <Loader2 className="animate-spin text-accent-violet mx-auto" size={32} />
            </div>
          ) : data.length === 0 ? (
            <div className="p-12 text-center text-text-muted">
              No submissions found.
            </div>
          ) : data.map((sub) => (
            <div key={sub.id} className="p-5 space-y-4 hover:bg-surface-hover transition-colors">
              <div className="flex justify-between items-center gap-2">
                <div>
                  <Link href={`/admin/submissions/${sub.id}`} className="font-semibold text-text-primary text-base truncate hover:text-accent-violet transition-colors underline underline-offset-4 decoration-surface-border hover:decoration-accent-violet">
                    {sub.user}
                  </Link>
                  <p className="text-xs font-mono text-text-muted mt-0.5">SUB-{sub.id.split('-')[0]}</p>
                </div>
                <Badge variant={sub.status === "Pending" ? "default" : sub.status === "Reviewed" ? "gold" : "violet"}>
                  {sub.status}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                <span className="text-text-muted">Track</span>
                <span className="text-text-secondary col-span-2">{sub.track}</span>
              </div>

              <div className="flex justify-between items-center pt-2">
                <div className="flex gap-2">
                  <a href={sub.repo.startsWith('http') ? sub.repo : `https://${sub.repo}`} target="_blank" rel="noreferrer" className="p-2.5 bg-background border border-surface-border rounded-lg text-text-secondary hover:text-accent-violet transition-colors flex items-center gap-1.5 text-xs font-mono" title="GitHub">
                    <CodeIcon size={14} /> GitHub
                  </a>
                  <a href={sub.demo.startsWith('http') ? sub.demo : `https://${sub.demo}`} target="_blank" rel="noreferrer" className="p-2.5 bg-background border border-surface-border rounded-lg text-text-secondary hover:text-accent-violet transition-colors flex items-center gap-1.5 text-xs font-mono" title="Live Demo">
                    <ExternalLink size={14} /> Live Demo
                  </a>
                </div>

                <Button variant="secondary" size="sm" className="h-9 px-3 text-green-400 hover:text-green-300 hover:bg-green-400/10 flex items-center gap-1" title="Mark Evaluated">
                  <CheckCircle size={16} /> Evaluate
                </Button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

function CodeIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  )
}
