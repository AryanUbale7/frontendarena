"use client"

import * as React from "react"
import { ProblemStatementCard } from "./ProblemStatementCard"
import { getPublishedProblemStatements } from "@/actions/problem-statements"
import { Loader2, RefreshCw, Layers } from "lucide-react"
import { useRouter } from "next/navigation"

interface Track {
  id: string
  name: string
  description?: string
}

interface ListProps {
  tracks: Track[]
  initialStatements: { [trackId: string]: any[] }
}

export function ProblemStatementList({ tracks, initialStatements }: ListProps) {
  const router = useRouter()
  const [statements, setStatements] = React.useState(initialStatements)
  const [refreshing, setRefreshing] = React.useState(false)

  const refetch = React.useCallback(async () => {
    setRefreshing(true)
    const updated: { [trackId: string]: any[] } = {}
    
    try {
      await Promise.all(
        tracks.map(async (track) => {
          const data = await getPublishedProblemStatements(track.id)
          updated[track.id] = data || []
        })
      )
      setStatements(updated)
    } catch (err) {
      console.error("Focus refetch failed:", err)
    } finally {
      setRefreshing(false)
    }
  }, [tracks])

  React.useEffect(() => {
    const handleFocus = () => {
      refetch()
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refetch()
      }
    }

    window.addEventListener("focus", handleFocus)
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      window.removeEventListener("focus", handleFocus)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [refetch])

  const [availableTracks, setAvailableTracks] = React.useState<any[]>([])
  const [registeringId, setRegisteringId] = React.useState<string | null>(null)
  const [selectedRegTrackId, setSelectedRegTrackId] = React.useState("")
  const [regError, setRegError] = React.useState("")

  React.useEffect(() => {
    if (tracks.length === 0) {
      const loadAllTracks = async () => {
        const { getTracks } = await import("@/actions/problem-statements")
        const allTracks = await getTracks()
        setAvailableTracks(allTracks)
        if (allTracks.length > 0) {
          setSelectedRegTrackId(allTracks[0].id)
        }
      }
      loadAllTracks()
    }
  }, [tracks])

  const handleRegister = async () => {
    if (!selectedRegTrackId) return
    setRegisteringId(selectedRegTrackId)
    setRegError("")
    
    const { registerForTrack } = await import("@/actions/problem-statements")
    const res = await registerForTrack(selectedRegTrackId)
    setRegisteringId(null)
    
    if (res.error) {
      setRegError(res.error)
    } else {
      router.refresh()
    }
  }

  if (tracks.length === 0) {
    return (
      <div className="py-12 px-6 text-center border border-surface-border rounded-xl bg-surface/30 max-w-md mx-auto space-y-6">
        <div className="space-y-2">
          <h4 className="text-base font-heading font-bold text-white">Join a Challenge Track</h4>
          <p className="text-xs text-text-secondary font-body">
            You are not registered for any tracks yet. Select a track below to register and access its challenge documentation.
          </p>
        </div>

        {availableTracks.length > 0 ? (
          <div className="space-y-4 text-left">
            <div className="space-y-1">
              <label className="block text-[10px] font-mono text-text-secondary uppercase">Available Tracks</label>
              <select
                value={selectedRegTrackId}
                onChange={(e) => setSelectedRegTrackId(e.target.value)}
                className="w-full bg-background border border-surface-border rounded-lg p-2.5 text-text-primary text-sm focus:border-accent-violet focus:outline-none transition-colors font-mono"
              >
                {availableTracks.map((track) => (
                  <option key={track.id} value={track.id}>
                    {track.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleRegister}
              disabled={registeringId !== null}
              className="w-full py-2.5 rounded-lg bg-accent-violet text-white font-medium hover:bg-accent-violet/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
            >
              {registeringId !== null ? <Loader2 size={16} className="animate-spin" /> : null}
              Register for Track
            </button>

            {regError && (
              <p className="text-red-400 text-xs font-mono mt-2 text-center">{regError}</p>
            )}
          </div>
        ) : (
          <p className="text-xs text-text-muted italic">No tracks have been configured yet by the organizers.</p>
        )}
      </div>
    )
  }

  // Count total statements across all tracks
  const totalStatements = Object.values(statements).reduce((acc, curr) => acc + curr.length, 0)

  if (totalStatements === 0) {
    return (
      <div className="py-16 text-center border border-dashed border-surface-border rounded-xl bg-surface/30 space-y-4">
        <div className="w-12 h-12 rounded-full bg-surface-hover flex items-center justify-center text-text-muted mx-auto">
          <Layers size={22} />
        </div>
        <p className="text-text-secondary font-body text-sm max-w-sm mx-auto">
          Problem statements for your track haven't been released yet. Check back soon.
        </p>
        {refreshing && (
          <div className="flex items-center justify-center gap-1.5 text-xs font-mono text-accent-gold">
            <Loader2 className="animate-spin" size={12} /> Syncing...
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-text-muted uppercase tracking-wider">
          ACTIVE CHALLENGES FOR YOUR TRACKS
        </span>
        {refreshing && (
          <div className="flex items-center gap-1 text-xs font-mono text-accent-gold">
            <Loader2 className="animate-spin" size={12} /> Updating...
          </div>
        )}
      </div>

      {tracks.map((track) => {
        const trackStatements = statements[track.id] || []
        if (trackStatements.length === 0) return null

        return (
          <div key={track.id} className="space-y-6">
            {/* Group Header */}
            <div className="border-b border-surface-border pb-3 flex items-baseline justify-between">
              <h3 className="text-lg font-heading font-bold text-accent-gold uppercase tracking-tight flex items-center gap-2">
                <Layers size={18} />
                {track.name}
              </h3>
              {track.description && (
                <span className="text-xs text-text-muted font-body hidden md:inline">
                  {track.description}
                </span>
              )}
            </div>

            {/* Grid display for statements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {trackStatements.map((statement) => (
                <ProblemStatementCard key={statement.id} statement={statement} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
