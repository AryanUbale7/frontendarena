"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Users, Code, Trophy, Activity, Loader2, Upload, FileText, Trash2, Eye } from "lucide-react"
import { getAdminStats, getActiveEventContent, updateEventContent, uploadEventFile, deleteEventFile } from "@/actions/admin"
import { AdminStats } from "@/lib/types"

function StatCard({ title, value, icon: Icon, trend }: { title: string, value: string, icon: any, trend?: string }) {
  return (
    <div className="bg-surface border border-surface-border p-6 rounded-xl flex items-center justify-between">
      <div>
        <p className="text-text-secondary font-mono text-sm uppercase tracking-wider mb-2">{title}</p>
        <h3 className="text-3xl font-heading font-bold text-text-primary">{value}</h3>
        {trend && <p className="text-accent-gold text-sm mt-2 font-mono">{trend}</p>}
      </div>
      <div className="w-12 h-12 rounded-full bg-surface-hover flex items-center justify-center text-accent-violet">
        <Icon size={24} />
      </div>
    </div>
  )
}

type ActivityItem = {
  users?: { full_name?: string } | Array<{ full_name?: string }> | null;
  project_name?: string;
  updated_at: string;
}

export default function AdminDashboard() {
  const [data, setData] = React.useState<AdminStats | null>(null)
  const [loading, setLoading] = React.useState(true)

  // Content state variables
  const [problemStatement, setProblemStatement] = React.useState("")
  const [starterKitLink, setStarterKitLink] = React.useState("")
  const [figmaLink, setFigmaLink] = React.useState("")
  
  // File upload state variables
  const [problemStatementUrl, setProblemStatementUrl] = React.useState("")
  const [problemStatementFilename, setProblemStatementFilename] = React.useState("")
  const [resourceFileUrl, setResourceFileUrl] = React.useState("")
  const [resourceFileFilename, setResourceFileFilename] = React.useState("")

  const [savingContent, setSavingContent] = React.useState(false)
  const [uploadingProblem, setUploadingProblem] = React.useState(false)
  const [uploadingResource, setUploadingResource] = React.useState(false)
  const [deletingProblem, setDeletingProblem] = React.useState(false)
  const [deletingResource, setDeletingResource] = React.useState(false)
  const [submissionsOpen, setSubmissionsOpen] = React.useState(true)

  const [saveSuccess, setSaveSuccess] = React.useState(false)
  const [saveError, setSaveError] = React.useState("")

  React.useEffect(() => {
    Promise.all([
      getAdminStats(),
      getActiveEventContent()
    ]).then(([statsRes, contentRes]) => {
      const res = statsRes as unknown as AdminStats
      if (!res.error) {
        setData(res)
      }
      if (contentRes && !contentRes.error && contentRes.data) {
        setProblemStatement(contentRes.data.problem_statement || "")
        setStarterKitLink(contentRes.data.starter_kit_link || "")
        setFigmaLink(contentRes.data.figma_link || "")
        setProblemStatementUrl(contentRes.data.problem_statement_url || "")
        setProblemStatementFilename(contentRes.data.problem_statement_filename || "")
        setResourceFileUrl(contentRes.data.resource_file_url || "")
        setResourceFileFilename(contentRes.data.resource_file_filename || "")
        setSubmissionsOpen(contentRes.data.submissions_open ?? true)
      }
      setLoading(false)
    }).catch(err => {
      console.error(err)
      setLoading(false)
    })
  }, [])

  const handleSaveTextContent = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingContent(true)
    setSaveSuccess(false)
    setSaveError("")

    const res = await updateEventContent({
      problemStatement,
      starterKitLink,
      figmaLink,
      submissionsOpen
    })

    setSavingContent(false)
    if (res.error) {
      setSaveError(res.error)
    } else {
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "problem" | "resource") => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)
    formData.append("type", type)

    if (type === "problem") {
      setUploadingProblem(true)
    } else {
      setUploadingResource(true)
    }

    setSaveError("")
    const res = await uploadEventFile(formData)

    if (type === "problem") {
      setUploadingProblem(false)
    } else {
      setUploadingResource(false)
    }

    if (res.error) {
      setSaveError(res.error)
    } else {
      if (type === "problem") {
        setProblemStatementUrl(res.fileUrl || "")
        setProblemStatementFilename(res.filename || "")
      } else {
        setResourceFileUrl(res.fileUrl || "")
        setResourceFileFilename(res.filename || "")
      }
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    }
  }

  const handleFileDelete = async (type: "problem" | "resource") => {
    if (type === "problem") {
      setDeletingProblem(true)
    } else {
      setDeletingResource(true)
    }

    setSaveError("")
    const res = await deleteEventFile(type)

    if (type === "problem") {
      setDeletingProblem(false)
    } else {
      setDeletingResource(false)
    }

    if (res.error) {
      setSaveError(res.error)
    } else {
      if (type === "problem") {
        setProblemStatementUrl("")
        setProblemStatementFilename("")
      } else {
        setResourceFileUrl("")
        setResourceFileFilename("")
      }
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    }
  }

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="animate-spin text-accent-violet" size={48} />
      </div>
    )
  }

  const stats = [
    { title: "Total Participants", value: data?.participantsCount?.toString() || "0", icon: Users },
    { title: "Total Submissions", value: data?.submissionsCount?.toString() || "0", icon: Code },
    { title: "Leaderboard Eligible", value: "Pending Eval", icon: Trophy },
    { title: "System Status", value: "Live", icon: Activity },
  ]

  return (
    <div className="w-full h-full max-w-6xl mx-auto pb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-4xl font-heading font-bold text-text-primary mb-2">Command Center</h1>
        <p className="text-text-secondary font-body">Overview of your hackathon metrics and recent activity.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-12">
        {/* Recent Submissions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-surface border border-surface-border rounded-xl p-8"
        >
          <h2 className="text-xl font-heading font-bold text-text-primary mb-6">Recent Submissions</h2>
          <div className="space-y-6">
            {data?.recentSubmissions?.length === 0 ? (
              <p className="text-text-muted">No recent activity found.</p>
            ) : (
              data?.recentSubmissions?.map((activity: ActivityItem, i: number) => {
                const userObj = Array.isArray(activity.users) ? activity.users[0] : activity.users
                const userFullName = userObj?.full_name || "Unknown"
                return (
                  <div key={i} className="flex items-start gap-4 pb-6 border-b border-surface-border last:border-0 last:pb-0">
                    <div className="w-2 h-2 rounded-full bg-accent-violet mt-2" />
                    <div>
                      <p className="text-text-primary font-body">
                        <span className="font-semibold text-white">{userFullName}</span> updated submission for <span className="font-mono text-accent-gold">{activity.project_name || "Draft Project"}</span>
                      </p>
                      <p className="text-sm text-text-muted mt-1 font-mono">{new Date(activity.updated_at).toLocaleString()}</p>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </motion.div>

        {/* Document Uploader Manager */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-surface border border-surface-border rounded-xl p-8"
        >
          <h2 className="text-xl font-heading font-bold text-text-primary mb-2">Hackathon Document Uploader</h2>
          <p className="text-sm text-text-secondary mb-8">Upload PDF, Word, or PPT documents to share challenge requirements and resource bundles directly to participants.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* 1. Problem Statement File Upload */}
            <div className="border border-surface-border rounded-lg p-6 bg-background/50 flex flex-col justify-between">
              <div>
                <h3 className="font-heading font-bold text-white mb-2 flex items-center gap-2">
                  <FileText className="text-accent-gold" size={20} />
                  Problem Statement Document
                </h3>
                <p className="text-xs text-text-secondary font-body mb-6">PDF, PPTX, DOCX, or keynotes explaining the hackathon challenge prompt.</p>
              </div>

              {problemStatementFilename ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-surface border border-surface-border rounded font-mono text-sm">
                    <span className="truncate max-w-[160px] text-text-primary">{problemStatementFilename}</span>
                    <div className="flex items-center gap-2">
                      <a href={problemStatementUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-text-muted hover:text-white transition-colors" title="View Document">
                        <Eye size={16} />
                      </a>
                      <button 
                        onClick={() => handleFileDelete("problem")}
                        disabled={deletingProblem}
                        className="p-2 text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                        title="Delete Document"
                      >
                        {deletingProblem ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <label className="border border-dashed border-surface-border/80 hover:border-accent-violet transition-colors rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer">
                  {uploadingProblem ? (
                    <Loader2 className="animate-spin text-accent-violet mb-2" size={28} />
                  ) : (
                    <Upload className="text-text-muted mb-2 group-hover:text-text-primary" size={28} />
                  )}
                  <span className="text-sm font-mono text-text-secondary">{uploadingProblem ? "Uploading..." : "Upload PDF / PPT / Word"}</span>
                  <input 
                    type="file" 
                    accept=".pdf,.ppt,.pptx,.doc,.docx"
                    onChange={(e) => handleFileUpload(e, "problem")}
                    disabled={uploadingProblem}
                    className="hidden" 
                  />
                </label>
              )}
            </div>

            {/* 2. Resources File Upload */}
            <div className="border border-surface-border rounded-lg p-6 bg-background/50 flex flex-col justify-between">
              <div>
                <h3 className="font-heading font-bold text-white mb-2 flex items-center gap-2">
                  <Code className="text-blue-400" size={20} />
                  Starter Kit / Resource Bundle
                </h3>
                <p className="text-xs text-text-secondary font-body mb-6">ZIP files, assets, or document packages for developer templates.</p>
              </div>

              {resourceFileFilename ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-surface border border-surface-border rounded font-mono text-sm">
                    <span className="truncate max-w-[160px] text-text-primary">{resourceFileFilename}</span>
                    <div className="flex items-center gap-2">
                      <a href={resourceFileUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-text-muted hover:text-white transition-colors" title="View Document">
                        <Eye size={16} />
                      </a>
                      <button 
                        onClick={() => handleFileDelete("resource")}
                        disabled={deletingResource}
                        className="p-2 text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                        title="Delete Document"
                      >
                        {deletingResource ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <label className="border border-dashed border-surface-border/80 hover:border-accent-violet transition-colors rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer">
                  {uploadingResource ? (
                    <Loader2 className="animate-spin text-accent-violet mb-2" size={28} />
                  ) : (
                    <Upload className="text-text-muted mb-2" size={28} />
                  )}
                  <span className="text-sm font-mono text-text-secondary">{uploadingResource ? "Uploading..." : "Upload ZIP / PDF / Docs"}</span>
                  <input 
                    type="file" 
                    onChange={(e) => handleFileUpload(e, "resource")}
                    disabled={uploadingResource}
                    className="hidden" 
                  />
                </label>
              )}
            </div>

          </div>
        </motion.div>

        {/* Event Link Manager */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-surface border border-surface-border rounded-xl p-8"
        >
          <h2 className="text-xl font-heading font-bold text-text-primary mb-2">Event Links and Text Editor</h2>
          <p className="text-sm text-text-secondary mb-6">Manage external links and text-based problem descriptions displayed in the participant portal.</p>
          
          <form onSubmit={handleSaveTextContent} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-mono text-text-secondary uppercase">Problem Description / Text</label>
              <textarea
                value={problemStatement}
                onChange={(e) => setProblemStatement(e.target.value)}
                placeholder="Alternative text-based instructions..."
                rows={4}
                className="w-full bg-background border border-surface-border rounded-lg p-4 text-text-primary font-body focus:border-accent-violet focus:outline-none transition-colors resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-mono text-text-secondary uppercase">Starter Kit Download Link</label>
                <input
                  type="url"
                  value={starterKitLink}
                  onChange={(e) => setStarterKitLink(e.target.value)}
                  placeholder="https://github.com/your-org/starter-kit"
                  className="w-full bg-background border border-surface-border rounded-lg p-3 text-text-primary font-mono focus:border-accent-violet focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-mono text-text-secondary uppercase">Figma UI Kit Link</label>
                <input
                  type="url"
                  value={figmaLink}
                  onChange={(e) => setFigmaLink(e.target.value)}
                  placeholder="https://figma.com/file/..."
                  className="w-full bg-background border border-surface-border rounded-lg p-3 text-text-primary font-mono focus:border-accent-violet focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="p-4 bg-background border border-surface-border rounded-lg flex items-center justify-between">
              <div>
                <h3 className="text-sm font-heading font-bold text-white">Project Submissions Window</h3>
                <p className="text-xs text-text-secondary mt-1">Enable or disable participants from submitting their projects.</p>
              </div>
              
              <button
                type="button"
                onClick={() => setSubmissionsOpen(prev => !prev)}
                className={`px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-wider transition-colors duration-300 border ${
                  submissionsOpen 
                    ? "bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20" 
                    : "bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20"
                }`}
              >
                {submissionsOpen ? "🟢 Open & Active" : "🔴 Closed & Locked"}
              </button>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <button
                type="submit"
                disabled={savingContent}
                className="px-6 py-3 rounded-lg bg-accent-violet text-white font-medium hover:bg-accent-violet/90 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {savingContent ? "Saving..." : "Save Links"}
              </button>
              
              {saveSuccess && (
                <span className="text-green-400 font-medium text-sm">Successfully published to all participant portals!</span>
              )}
              {saveError && (
                <span className="text-red-400 font-medium text-sm">{saveError}</span>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
