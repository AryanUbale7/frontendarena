"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Search, Plus, Edit2, Trash2, Loader2 } from "lucide-react"
import { getLeaderboardData } from "@/actions/public"
import { LeaderboardEntry } from "@/lib/types"

export default function LeaderboardAdminPage() {
  const [data, setData] = React.useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    getLeaderboardData().then((res) => {
      if (res.data) setData(res.data)
      setLoading(false)
    })
  }, [])
  return (
    <div className="w-full max-w-6xl mx-auto h-full flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">Leaderboard Management</h1>
          <p className="text-text-secondary font-body">Manage points, ranks, and tiers for participants.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input 
              type="text" 
              placeholder="Search User..." 
              className="w-full bg-surface border border-surface-border rounded-md pl-10 pr-4 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-violet transition-colors"
            />
          </div>
          <Button variant="primary" size="sm" className="h-9 gap-2">
            <Plus size={16} />
            Add Entry
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-surface border border-surface-border rounded-xl flex-1 overflow-hidden flex flex-col"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-border bg-surface-hover/50">
                <th className="p-4 text-xs font-mono text-text-muted uppercase tracking-wider w-16 text-center">Rank</th>
                <th className="p-4 text-xs font-mono text-text-muted uppercase tracking-wider">Participant</th>
                <th className="p-4 text-xs font-mono text-text-muted uppercase tracking-wider">Tier</th>
                <th className="p-4 text-xs font-mono text-text-muted uppercase tracking-wider text-right">Points</th>
                <th className="p-4 text-xs font-mono text-text-muted uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <Loader2 className="animate-spin text-accent-violet mx-auto" size={32} />
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-text-muted">
                    No leaderboard entries found.
                  </td>
                </tr>
              ) : data.map((entry, index) => (
                <tr key={index} className="hover:bg-surface-hover transition-colors">
                  <td className="p-4 font-mono font-bold text-center text-text-primary">
                    #{(entry.rank || index + 1)}
                  </td>
                  <td className="p-4 font-medium text-text-primary">{entry.team || entry.team_name || "Unknown Team"}</td>
                  <td className="p-4">
                    <Badge variant={(entry.rank || index + 1) === 1 ? "gold" : (entry.rank || index + 1) <= 3 ? "violet" : "default"}>
                      {(entry.rank || index + 1) === 1 ? "Champion" : (entry.rank || index + 1) <= 3 ? "Grandmaster" : "Master"}
                    </Badge>
                  </td>
                  <td className="p-4 font-mono text-accent-gold text-right">{entry.score}</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="secondary" size="sm" className="h-8 px-2 text-text-secondary hover:text-white">
                        <Edit2 size={16} />
                      </Button>
                      <Button variant="secondary" size="sm" className="h-8 px-2 text-red-400 hover:text-red-300 hover:bg-red-400/10">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
