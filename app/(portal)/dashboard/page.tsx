"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { ArrowRight, Trophy, Code2, Clock, FileCode, FileText, Download, Layers, Loader2 } from "lucide-react"
import Link from "next/link"
import { getDashboardData } from "@/actions/dashboard"
import { ProblemStatementList } from "@/components/dashboard/ProblemStatementList"
import { DashboardData, ParticipantTrack, ProblemStatementFile } from "@/lib/types"

export default function DashboardPage() {
  const [data, setData] = React.useState<DashboardData>({ 
    fullName: "Loading...", 
    teamName: "", 
    submissionStatus: "Loading...",
    event: {
      name: "Frontend Wars 2026",
      problem_statement: "",
      starter_kit_link: "",
      figma_link: "",
      end_date: "",
      problem_statement_url: "",
      problem_statement_filename: "",
      resource_file_url: "",
      resource_file_filename: ""
    }
  })
  
  const [timeLeft, setTimeLeft] = React.useState("Calculating...")

  // Track statements state
  const [participantTracks, setParticipantTracks] = React.useState<ParticipantTrack[]>([])
  const [initialStatements, setInitialStatements] = React.useState<{ [trackId: string]: ProblemStatementFile[] }>({})
  const [loadingStatements, setLoadingStatements] = React.useState(true)

  React.useEffect(() => {
    getDashboardData().then((res: any) => {
      if (!res.error) {
        setData({
          fullName: res.fullName as string,
          teamName: res.teamName as string || "",
          submissionStatus: res.submissionStatus as string,
          event: res.event
        })
      } else {
        console.error("Dashboard Load Error:", res.error)
        setData(prev => ({
          ...prev,
          fullName: `Error: ${res.error}`,
          submissionStatus: "Error"
        }))
      }
    })

    // Fetch registered tracks and initial problem statements
    const loadTracksAndStatements = async () => {
      const { getParticipantTracks, getPublishedProblemStatements } = await import("@/actions/problem-statements")
      const tracksList = await getParticipantTracks()
      setParticipantTracks(tracksList)
      
      const statementsMap: { [trackId: string]: ProblemStatementFile[] } = {}
      await Promise.all(
        tracksList.map(async (track) => {
          const files = await getPublishedProblemStatements(track.id)
          statementsMap[track.id] = files || []
        })
      )
      setInitialStatements(statementsMap)
      setLoadingStatements(false)
    }
    
    loadTracksAndStatements()
  }, [])

  React.useEffect(() => {
    if (!data.event?.end_date) return

    const calculateTime = () => {
      const difference = +new Date(data.event?.end_date) - +new Date()
      if (difference <= 0) {
        setTimeLeft("Event Ended")
        return
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((difference / 1000 / 60) % 60)

      setTimeLeft(`${days}d ${hours}h ${minutes}m`)
    }

    calculateTime()
    const timer = setInterval(calculateTime, 60000)
    return () => clearInterval(timer)
  }, [data.event?.end_date])

  return (
    <div className="w-full h-full flex flex-col gap-8 pb-12">
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">
          Welcome back, {data.teamName ? data.teamName : data.fullName}!
        </h1>
        <p className="text-text-secondary font-body">Ready to build something extraordinary?</p>
      </motion.div>

      {/* Welcome / Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-surface border border-surface-border rounded-xl p-8 shadow-xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-gold/5 blur-[80px] rounded-full pointer-events-none" />
        
        <div className="flex flex-col md:flex-row gap-8 relative z-10 w-full text-left">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-heading font-bold text-text-primary mb-6">Event Status</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-surface-border">
                <span className="text-text-secondary font-body">Event</span>
                <span className="font-medium text-white">{data.event?.name}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-surface-border">
                <span className="text-text-secondary font-body">Current Phase</span>
                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-xs font-semibold bg-accent-gold/10 text-accent-gold border-accent-gold/20 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                  Project Submission
                </span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-surface-border">
                <span className="text-text-secondary font-body">Time Remaining</span>
                <span className="font-mono text-accent-gold font-bold">{timeLeft}</span>
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-heading font-bold text-text-primary mb-6">Your Progress</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center pb-4 border-b border-surface-border">
                <span className="text-text-secondary font-body">Registration</span>
                <span className="text-green-400 font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400" /> Confirmed
                </span>
              </div>
              {participantTracks.length > 0 && (
                <div className="flex justify-between items-start pb-4 border-b border-surface-border">
                  <span className="text-text-secondary font-body">Registered Track</span>
                  <div className="text-right">
                    {participantTracks.map((t) => (
                      <span key={t.id} className="inline-block px-2 py-0.5 rounded text-xs bg-accent-gold/10 text-accent-gold border border-accent-gold/20 font-mono font-medium">
                        {t.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex justify-between items-center pb-4 border-b border-surface-border">
                <span className="text-text-secondary font-body">Submission</span>
                <span className="text-text-muted font-medium flex items-center gap-2 capitalize">
                  <span className="w-2 h-2 rounded-full bg-text-muted" /> {data.submissionStatus}
                </span>
              </div>
            </div>

            <Link 
              href="/submission" 
              className="w-full flex items-center justify-center gap-2 h-11 px-6 py-2 rounded-md font-heading font-medium bg-accent-violet text-white hover:bg-accent-violet/90 shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] border border-accent-violet-glow transition-all text-sm"
            >
              Continue Submission <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </motion.div>


      {/* Track-Specific Problem Statements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
        className="bg-surface border border-surface-border rounded-xl p-8 shadow-xl"
      >
        <div className="flex items-center gap-3 mb-6 border-b border-surface-border pb-4">
          <div className="w-10 h-10 rounded-lg bg-accent-violet/10 flex items-center justify-center text-accent-violet">
            <Layers size={22} />
          </div>
          <div>
            <h2 className="text-xl font-heading font-bold text-text-primary">Track Problem Statements</h2>
            <p className="text-xs font-mono text-text-muted uppercase">CHALLENGES RELEASED FOR YOUR TRACKS</p>
          </div>
        </div>

        {loadingStatements ? (
          <div className="py-12 flex items-center justify-center">
            <Loader2 className="animate-spin text-accent-violet" size={32} />
          </div>
        ) : (
          <ProblemStatementList 
            tracks={participantTracks} 
            initialStatements={initialStatements} 
          />
        )}
      </motion.div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/sponsor-benefits">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-surface border border-surface-border rounded-xl p-6 hover:border-accent-violet transition-colors group h-full"
          >
            <Trophy className="text-accent-gold mb-4 group-hover:scale-110 transition-transform" size={32} />
            <h3 className="font-heading font-bold text-lg text-white mb-2">Sponsor Benefits</h3>
            <p className="text-sm text-text-secondary">Claim your InterviewBuddy and UptoSkills perks.</p>
          </motion.div>
        </Link>

        <Link href="/rules">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-surface border border-surface-border rounded-xl p-6 hover:border-accent-violet transition-colors group h-full"
          >
            <Code2 className="text-accent-violet mb-4 group-hover:scale-110 transition-transform" size={32} />
            <h3 className="font-heading font-bold text-lg text-white mb-2">Rules & Criteria</h3>
            <p className="text-sm text-text-secondary">Review the judging rubric and submission guidelines.</p>
          </motion.div>
        </Link>
      </div>

    </div>
  )
}
