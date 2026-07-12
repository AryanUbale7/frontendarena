"use client"

import * as React from "react"
import { ProblemStatementUploadForm } from "@/app/admin/problem-statements/ProblemStatementUploadForm"
import { 
  getTracks, 
  getProblemStatements, 
  publishProblemStatement, 
  unpublishProblemStatement, 
  deleteProblemStatement,
  createTrack
} from "@/app/admin/problem-statements/actions"
import { Loader2, Trash2, Eye, Send, RotateCcw, AlertTriangle, Layers, Calendar, HardDrive, Plus } from "lucide-react"

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export function ProblemStatementsScreen() {
  const [tracks, setTracks] = React.useState<any[]>([])
  const [selectedTrackId, setSelectedTrackId] = React.useState("")
  const [problemStatements, setProblemStatements] = React.useState<any[]>([])
  
  const [loadingTracks, setLoadingTracks] = React.useState(true)
  const [loadingStatements, setLoadingStatements] = React.useState(false)

  // Track creator states
  const [showCreateForm, setShowCreateForm] = React.useState(false)
  const [trackName, setTrackName] = React.useState("")
  const [trackDescription, setTrackDescription] = React.useState("")
  const [creatingTrack, setCreatingTrack] = React.useState(false)
  const [trackCreateError, setTrackCreateError] = React.useState("")

  // Dialog and action states
  const [confirmPublishId, setConfirmPublishId] = React.useState<string | null>(null)
  const [publishing, setPublishing] = React.useState(false)
  const [unpublishingId, setUnpublishingId] = React.useState<string | null>(null)
  const [deletingId, setDeletingId] = React.useState<string | null>(null)
  const [actionError, setActionError] = React.useState("")

  React.useEffect(() => {
    getTracks().then((res) => {
      setTracks(res)
      if (res.length > 0) {
        setSelectedTrackId(res[0].id)
      }
      setLoadingTracks(false)
    })
  }, [])

  const loadStatements = React.useCallback(async (trackId: string) => {
    if (!trackId) return
    setLoadingStatements(true)
    const res = await getProblemStatements(trackId)
    setProblemStatements(res)
    setLoadingStatements(false)
  }, [])

  React.useEffect(() => {
    if (selectedTrackId) {
      loadStatements(selectedTrackId)
    }
  }, [selectedTrackId, loadStatements])

  const handleCreateTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!trackName) return

    setCreatingTrack(true)
    setTrackCreateError("")

    const res = await createTrack({ name: trackName, description: trackDescription })
    setCreatingTrack(false)

    if (res.error) {
      setTrackCreateError(res.error)
    } else {
      setTrackName("")
      setTrackDescription("")
      setShowCreateForm(false)

      // Reload tracks list
      const freshTracks = await getTracks()
      setTracks(freshTracks)
      if (res.data) {
        setSelectedTrackId(res.data.id)
      } else if (freshTracks.length > 0) {
        setSelectedTrackId(freshTracks[0].id)
      }
    }
  }

  const handleConfirmPublish = async () => {
    if (!confirmPublishId) return
    setPublishing(true)
    setActionError("")

    const res = await publishProblemStatement(confirmPublishId)
    setPublishing(false)
    
    if (res.error) {
      setActionError(res.error)
    } else {
      setConfirmPublishId(null)
      loadStatements(selectedTrackId)
    }
  }

  const handleUnpublish = async (id: string) => {
    setUnpublishingId(id)
    setActionError("")

    const res = await unpublishProblemStatement(id)
    setUnpublishingId(null)

    if (res.error) {
      setActionError(res.error)
    } else {
      loadStatements(selectedTrackId)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this problem statement and its uploaded file?")) {
      return
    }

    setDeletingId(id)
    setActionError("")

    const res = await deleteProblemStatement(id)
    setDeletingId(null)

    if (res.error) {
      setActionError(res.error)
    } else {
      loadStatements(selectedTrackId)
    }
  }

  if (loadingTracks) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-accent-violet" size={48} />
      </div>
    )
  }

  return (
    <div className="w-full h-full space-y-10">
      
      {/* Dynamic Header & Track Selection */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-surface-border">
        <div>
          <h1 className="text-4xl font-heading font-bold text-text-primary mb-2 uppercase tracking-tight">
            Problem Statements
          </h1>
          <p className="text-text-secondary font-body">Manage specific challenge prompts and starter documentation per track.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            <Layers size={18} className="text-accent-violet flex-shrink-0" />
            <span className="font-mono text-xs text-text-muted uppercase">Selected Track:</span>
            {tracks.length > 0 ? (
              <select
                value={selectedTrackId}
                onChange={(e) => setSelectedTrackId(e.target.value)}
                className="bg-surface border border-surface-border rounded-lg px-4 py-2.5 text-text-primary text-sm font-mono focus:border-accent-violet focus:outline-none"
              >
                {tracks.map((track) => (
                  <option key={track.id} value={track.id}>
                    {track.name}
                  </option>
                ))}
              </select>
            ) : (
              <span className="text-xs text-text-muted italic mr-2">No tracks</span>
            )}
          </div>

          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2.5 rounded-lg bg-accent-violet hover:bg-accent-violet/90 active:scale-95 text-white font-medium text-sm transition-all flex items-center gap-2"
          >
            <Plus size={16} />
            New Track
          </button>
        </div>
      </div>

      {actionError && (
        <div className="p-4 bg-red-400/10 border border-red-400/20 rounded-lg text-sm text-red-400 font-body flex items-center gap-2">
          <AlertTriangle size={18} /> {actionError}
        </div>
      )}

      {tracks.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Upload Form */}
          <div className="lg:col-span-1">
            <ProblemStatementUploadForm 
              trackId={selectedTrackId} 
              onUploadSuccess={() => loadStatements(selectedTrackId)} 
            />
          </div>

          {/* Right Column: Statements List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-surface border border-surface-border rounded-xl p-6 shadow-xl">
              <h3 className="text-lg font-heading font-bold text-white mb-6">Uploaded Challenge Files</h3>
              
              {loadingStatements ? (
                <div className="py-12 flex items-center justify-center">
                  <Loader2 className="animate-spin text-accent-violet" size={32} />
                </div>
              ) : problemStatements.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-text-muted italic font-body text-sm">No problem statements uploaded for this track yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {problemStatements.map((ps) => {
                    const isDraft = ps.status === "draft"
                    return (
                      <div 
                        key={ps.id}
                        className="p-5 bg-background/50 border border-surface-border rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-2 min-w-0">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h4 className="font-heading font-bold text-white text-base truncate">{ps.title}</h4>
                            
                            {/* Muted Marble vs Muted Gold Pills */}
                            {isDraft ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider bg-surface border border-surface-border text-text-secondary uppercase">
                                Draft
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider bg-accent-gold/10 border border-accent-gold/20 text-accent-gold uppercase">
                                Published
                              </span>
                            )}
                          </div>

                          {ps.description && (
                            <p className="text-xs text-text-secondary font-body line-clamp-1">{ps.description}</p>
                          )}

                          <div className="flex items-center gap-4 text-xs font-mono text-text-muted flex-wrap w-full">
                            <span className="flex items-center gap-1 min-w-0 max-w-full">
                              <HardDrive size={12} className="flex-shrink-0" />
                              <span className="truncate">{ps.file_name}</span>
                              <span className="flex-shrink-0">({formatBytes(ps.file_size)})</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar size={12} />
                              {new Date(ps.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 self-end sm:self-center">
                          {isDraft ? (
                            <button
                              onClick={() => setConfirmPublishId(ps.id)}
                              className="px-3.5 py-1.5 rounded bg-accent-violet hover:bg-accent-violet/90 active:scale-95 text-white font-medium text-xs flex items-center gap-1.5 transition-colors"
                              title="Publish File"
                            >
                              <Send size={12} />
                              Send
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUnpublish(ps.id)}
                              disabled={unpublishingId === ps.id}
                              className="px-3.5 py-1.5 rounded bg-surface border border-surface-border hover:bg-surface-hover active:scale-95 text-text-secondary hover:text-white font-medium text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
                              title="Unpublish File"
                            >
                              {unpublishingId === ps.id ? <Loader2 size={12} className="animate-spin" /> : <RotateCcw size={12} />}
                              Unpublish
                            </button>
                          )}

                          <button
                            onClick={() => handleDelete(ps.id)}
                            disabled={deletingId === ps.id}
                            className="p-2 text-text-muted hover:text-red-400 border border-surface-border rounded hover:bg-red-400/10 active:scale-95 transition-all disabled:opacity-50"
                            title="Delete file"
                          >
                            {deletingId === ps.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

        </div>
      ) : (
        <div className="max-w-md mx-auto py-16 bg-surface border border-surface-border rounded-xl text-center p-8 space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-heading font-bold text-white">Create Your First Track</h3>
            <p className="text-sm text-text-secondary font-body">No tracks exist yet for the active event. Add a track to begin uploading challenge documents.</p>
          </div>
          
          <form onSubmit={handleCreateTrack} className="space-y-4 text-left">
            <div className="space-y-1">
              <label className="block text-xs font-mono text-text-secondary uppercase">Track Name</label>
              <input
                type="text"
                required
                value={trackName}
                onChange={(e) => setTrackName(e.target.value)}
                placeholder="e.g. Front-End Engineering"
                className="w-full bg-background border border-surface-border rounded-lg p-2.5 text-text-primary text-sm focus:border-accent-violet focus:outline-none transition-colors"
              />
            </div>
            
            <div className="space-y-1">
              <label className="block text-xs font-mono text-text-secondary uppercase">Description (Optional)</label>
              <textarea
                value={trackDescription}
                onChange={(e) => setTrackDescription(e.target.value)}
                placeholder="Details about the track focus..."
                rows={3}
                className="w-full bg-background border border-surface-border rounded-lg p-2.5 text-text-primary text-sm focus:border-accent-violet focus:outline-none transition-colors resize-none"
              />
            </div>
            
            <button
              type="submit"
              disabled={creatingTrack || !trackName}
              className="w-full py-2.5 rounded-lg bg-accent-violet text-white font-medium hover:bg-accent-violet/90 active:scale-[0.98] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
            >
              {creatingTrack ? <Loader2 size={16} className="animate-spin" /> : null}
              Create Track
            </button>
            
            {trackCreateError && (
              <p className="text-red-400 text-xs font-mono mt-2">{trackCreateError}</p>
            )}
          </form>
        </div>
      )}

      {/* Confirm Publish Dialog */}
      {confirmPublishId && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-surface-border rounded-xl p-6 max-w-md w-full shadow-2xl relative">
            <div className="absolute -top-1 -left-1 w-3 h-3 border-t-[2px] border-l-[2px] border-accent-gold/40" />
            <div className="absolute -top-1 -right-1 w-3 h-3 border-t-[2px] border-r-[2px] border-accent-gold/40" />

            <div className="flex items-center gap-3 text-accent-gold mb-4">
              <AlertTriangle size={24} />
              <h4 className="text-lg font-heading font-bold text-white">Publish problem statement</h4>
            </div>
            
            <p className="text-sm text-text-secondary font-body mb-6 leading-relaxed">
              This will immediately become visible to all registered participants in this track. Continue?
            </p>

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setConfirmPublishId(null)}
                className="px-4 py-2 rounded-lg bg-surface-hover border border-surface-border text-text-secondary hover:text-white transition-colors text-sm font-mono"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmPublish}
                disabled={publishing}
                className="px-4 py-2 rounded-lg bg-accent-gold text-[#0A0A0A] font-bold hover:bg-accent-gold/90 transition-colors text-sm font-mono flex items-center gap-2"
              >
                {publishing ? <Loader2 size={14} className="animate-spin" /> : null}
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Track Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-surface-border rounded-xl p-6 max-w-md w-full shadow-2xl relative">
            <h3 className="text-lg font-heading font-bold text-white mb-4">Create New Track</h3>
            
            <form onSubmit={handleCreateTrack} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-mono text-text-secondary uppercase">Track Name</label>
                <input
                  type="text"
                  required
                  value={trackName}
                  onChange={(e) => setTrackName(e.target.value)}
                  placeholder="e.g. Back-end Integrations"
                  className="w-full bg-background border border-surface-border rounded-lg p-2.5 text-text-primary text-sm focus:border-accent-violet focus:outline-none transition-colors"
                />
              </div>
              
              <div className="space-y-1">
                <label className="block text-xs font-mono text-text-secondary uppercase">Description (Optional)</label>
                <textarea
                  value={trackDescription}
                  onChange={(e) => setTrackDescription(e.target.value)}
                  placeholder="Details about the track focus..."
                  rows={3}
                  className="w-full bg-background border border-surface-border rounded-lg p-2.5 text-text-primary text-sm focus:border-accent-violet focus:outline-none transition-colors resize-none"
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 rounded-lg bg-surface-hover border border-surface-border text-text-secondary hover:text-white transition-colors text-sm font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingTrack || !trackName}
                  className="px-4 py-2 rounded-lg bg-accent-violet text-white font-bold hover:bg-accent-violet/90 transition-colors text-sm font-mono flex items-center gap-2"
                >
                  {creatingTrack ? <Loader2 size={14} className="animate-spin" /> : null}
                  Create
                </button>
              </div>
              
              {trackCreateError && (
                <p className="text-red-400 text-xs font-mono mt-2">{trackCreateError}</p>
              )}
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
