"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Avatar } from "@/components/ui/Avatar"
import { Badge } from "@/components/ui/Badge"
import { getLeaderboardData } from "@/actions/public"
import { Loader2 } from "lucide-react"
import { LeaderboardEntry } from "@/lib/types"

export default function LeaderboardPage() {
  React.useEffect(() => { document.title = 'Leaderboard | Frontend Arena' }, [])
  const [data, setData] = React.useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    getLeaderboardData().then((res) => {
      if (res.data) setData(res.data)
      setLoading(false)
    })
  }, [])

  return (
    <main className="relative min-h-screen bg-background pt-24 pb-16">
      
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        
        {/* Header */}
        <div className="text-center mb-16 pt-16">
          <motion.h1 
            className="text-4xl md:text-6xl font-heading font-bold uppercase tracking-tight text-text-primary mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Global <span className="text-text-muted">Leaderboard</span>
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl text-text-secondary font-body max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            The top ranking frontend developers based on accumulated Arena points from all official tournaments.
          </motion.p>
        </div>

        {/* Leaderboard Table/List */}
        <motion.div 
          className="bg-surface border border-surface-border rounded-xl overflow-hidden shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {/* Table Header (Desktop) */}
          <div className="hidden md:grid grid-cols-12 gap-4 p-6 border-b border-surface-border bg-surface-hover/30 text-xs font-mono text-text-muted uppercase tracking-widest">
            <div className="col-span-1 text-center">Rank</div>
            <div className="col-span-5">Developer</div>
            <div className="col-span-3">Tier</div>
            <div className="col-span-3 text-right">Arena Points</div>
          </div>

          {/* Table Rows */}
          <div className="flex flex-col min-h-[300px]">
            {loading ? (
              <div className="flex-1 flex items-center justify-center p-12">
                <Loader2 className="animate-spin text-accent-violet" size={32} />
              </div>
            ) : data.length === 0 ? (
              <div className="flex-1 flex items-center justify-center p-12 text-text-muted">
                No submissions found.
              </div>
            ) : (
              data.map((user, i) => (
                <div 
                  key={user.project}
                className={`grid grid-cols-1 md:grid-cols-12 gap-4 p-6 items-center border-b border-surface-border last:border-0 hover:bg-surface-hover transition-colors ${
                  i < 3 ? 'bg-surface-hover/10' : ''
                }`}
              >
                {/* Rank */}
                <div className="col-span-1 flex items-center justify-start md:justify-center">
                  <span className={`text-xl font-heading font-bold ${
                    i === 0 ? 'text-accent-gold' : i === 1 ? 'text-text-primary' : i === 2 ? 'text-accent-violet' : 'text-text-muted'
                  }`}>
                    #{user.rank}
                  </span>
                </div>

                {/* Developer */}
                <div className="col-span-5 flex items-center gap-4">
                  <Avatar fallback={(user.team || user.team_name || "TM").substring(0,2).toUpperCase()} size="sm" className="bg-background border border-surface-border" />
                  <div className="flex flex-col">
                    <span className="text-text-primary font-heading font-semibold">{user.team || user.team_name || "Unknown Team"}</span>
                    <span className="text-text-muted font-mono text-xs">{user.project || "Project"}</span>
                  </div>
                </div>

                {/* Tier */}
                <div className="col-span-3 mt-4 md:mt-0">
                  <Badge variant={i === 0 ? 'gold' : i === 1 ? 'violet' : 'default'}>
                    {i === 0 ? 'GRANDMASTER' : i < 3 ? 'CHAMPION' : 'MASTER'}
                  </Badge>
                </div>

                {/* Points */}
                <div className="col-span-3 mt-4 md:mt-0 md:text-right font-mono text-text-primary font-medium">
                  {(user.score || 0).toLocaleString()} PTS
                </div>
              </div>
            ))
          )}
          </div>
        </motion.div>

      </div>
    </main>
  )
}
