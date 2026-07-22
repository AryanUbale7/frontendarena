"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Search, Mail, Ban, Loader2, Download, Trash2, CheckCircle, ShieldAlert } from "lucide-react"
import { getAllParticipants, deleteParticipant, toggleBlockParticipant } from "@/actions/admin"
import { AdminParticipant } from "@/lib/types"

export default function ParticipantsPage() {
  const [data, setData] = React.useState<AdminParticipant[]>([])
  const [loading, setLoading] = React.useState(true)
  const [errorMsg, setErrorMsg] = React.useState("")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [actionLoadingId, setActionLoadingId] = React.useState<string | null>(null)

  const fetchParticipants = React.useCallback(async () => {
    setLoading(true)
    const res = await getAllParticipants()
    if (res.error) {
      console.error("Fetch error:", res.error)
      setErrorMsg(res.error)
    }
    if (res.data) setData(res.data)
    setLoading(false)
  }, [])

  React.useEffect(() => {
    fetchParticipants()
  }, [fetchParticipants])

  const handleDeleteUser = async (user: AdminParticipant) => {
    if (!window.confirm(`Are you sure you want to DELETE participant "${user.name}" (${user.email})? This action cannot be undone.`)) {
      return
    }

    setActionLoadingId(user.fullId)
    const res = await deleteParticipant(user.fullId, user.email)
    setActionLoadingId(null)

    if (res.error) {
      alert(`Error deleting user: ${res.error}`)
    } else {
      fetchParticipants()
    }
  }

  const handleToggleBlock = async (user: AdminParticipant) => {
    const isBlocking = user.status !== "Blocked"
    const confirmMessage = isBlocking
      ? `Are you sure you want to BLOCK participant "${user.name}" (${user.email})?`
      : `Unblock participant "${user.name}" (${user.email})?`

    if (!window.confirm(confirmMessage)) return

    setActionLoadingId(user.fullId)
    const res = await toggleBlockParticipant(user.fullId, user.status)
    setActionLoadingId(null)

    if (res.error) {
      alert(`Error: ${res.error}`)
    } else {
      fetchParticipants()
    }
  }

  const filteredData = data.filter(user => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return user.name.toLowerCase().includes(q) || user.email.toLowerCase().includes(q) || user.id.toLowerCase().includes(q)
  })

  const handleExportCSV = () => {
    if (filteredData.length === 0) return

    const headers = ["User ID", "Name", "Email", "Joined", "Status"]
    
    const rows = filteredData.map(user => [
      user.id,
      user.name,
      user.email,
      user.joined,
      user.status
    ])

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `participants_export_${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="w-full max-w-6xl mx-auto h-full flex flex-col space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">Participants Directory</h1>
          <p className="text-text-secondary font-body">Directory & access control of all registered developers.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input 
              type="text" 
              placeholder="Search Name or Email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface border border-surface-border rounded-lg pl-10 pr-4 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-violet transition-colors font-mono"
            />
          </div>

          <Button 
            variant="primary" 
            size="sm" 
            className="h-10 px-4 flex items-center gap-2"
            onClick={handleExportCSV}
            disabled={filteredData.length === 0 || loading}
          >
            <Download size={16} />
            <span className="hidden sm:inline">Export CSV</span>
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-surface border border-surface-border rounded-xl flex-1 overflow-hidden flex flex-col shadow-xl"
      >
        <div className="overflow-x-auto hidden md:block">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-border bg-surface-hover/50 font-mono text-xs uppercase tracking-wider text-text-muted">
                <th className="p-4 font-semibold">User ID</th>
                <th className="p-4 font-semibold">Name / Team</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">Joined</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border font-body text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <Loader2 className="animate-spin text-accent-violet mx-auto mb-2" size={32} />
                    <span className="text-text-muted font-mono text-xs">Loading participants list...</span>
                  </td>
                </tr>
              ) : errorMsg ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-red-400 font-mono">
                    Error: {errorMsg}
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-text-muted font-mono">
                    No participants found matching &quot;{searchQuery}&quot;.
                  </td>
                </tr>
              ) : filteredData.map((user) => (
                <tr key={user.fullId} className="hover:bg-surface-hover/50 transition-colors">
                  <td className="p-4 font-mono text-xs text-text-secondary">{user.id}</td>
                  <td className="p-4 font-medium text-text-primary">{user.name}</td>
                  <td className="p-4 font-mono text-xs text-text-secondary">{user.email}</td>
                  <td className="p-4 font-mono text-xs text-text-muted">{user.joined}</td>
                  <td className="p-4">
                    {user.status === "Admin" ? (
                      <Badge variant="violet" className="font-mono text-xs">Admin</Badge>
                    ) : user.status === "Blocked" ? (
                      <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/30 font-mono text-xs">
                        <ShieldAlert size={12} className="mr-1 inline" /> Blocked
                      </Badge>
                    ) : (
                      <Badge variant="gold" className="bg-green-500/10 text-green-400 border-green-500/30 font-mono text-xs">
                        <CheckCircle size={12} className="mr-1 inline" /> Active
                      </Badge>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <a 
                        href={`mailto:${user.email}`}
                        className="p-2 text-text-muted hover:text-white rounded-lg hover:bg-surface-hover transition-colors"
                        title="Send Email"
                      >
                        <Mail size={16} />
                      </a>

                      <button
                        onClick={() => handleToggleBlock(user)}
                        disabled={actionLoadingId === user.fullId || user.status === "Admin"}
                        className={`p-2 rounded-lg transition-colors disabled:opacity-30 ${
                          user.status === "Blocked" 
                            ? "text-green-400 hover:bg-green-400/10" 
                            : "text-amber-400 hover:bg-amber-400/10"
                        }`}
                        title={user.status === "Blocked" ? "Unblock Participant" : "Block Participant"}
                      >
                        <Ban size={16} />
                      </button>

                      <button
                        onClick={() => handleDeleteUser(user)}
                        disabled={actionLoadingId === user.fullId || user.status === "Admin"}
                        className="p-2 text-text-muted hover:text-red-400 rounded-lg hover:bg-red-400/10 transition-colors disabled:opacity-30"
                        title="Delete Participant"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View Card Grid */}
        <div className="block md:hidden divide-y divide-surface-border">
          {loading ? (
            <div className="p-12 text-center">
              <Loader2 className="animate-spin text-accent-violet mx-auto mb-2" size={32} />
              <span className="text-text-muted font-mono text-xs">Loading participants list...</span>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="p-12 text-center text-text-muted font-mono">
              No participants found.
            </div>
          ) : filteredData.map((user) => (
            <div key={user.fullId} className="p-5 space-y-4 hover:bg-surface-hover/40 transition-colors">
              <div className="flex justify-between items-center gap-2">
                <span className="font-semibold text-text-primary text-base truncate">{user.name}</span>
                {user.status === "Blocked" ? (
                  <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/30 font-mono text-xs">
                    Blocked
                  </Badge>
                ) : (
                  <Badge variant={user.status === "Admin" ? "violet" : "gold"} className="font-mono text-xs">
                    {user.status}
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                <span className="text-text-muted">User ID</span>
                <span className="text-text-secondary col-span-2 truncate">{user.id}</span>
                
                <span className="text-text-muted">Email</span>
                <span className="text-text-secondary col-span-2 truncate">{user.email}</span>
                
                <span className="text-text-muted">Joined</span>
                <span className="text-text-secondary col-span-2">{user.joined}</span>
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-surface-border/50">
                <a
                  href={`mailto:${user.email}`}
                  className="px-3 py-1.5 rounded-lg border border-surface-border text-xs font-mono flex items-center gap-1.5 text-text-secondary hover:text-white"
                >
                  <Mail size={14} />
                  <span>Email</span>
                </a>

                <button
                  onClick={() => handleToggleBlock(user)}
                  disabled={user.status === "Admin"}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition-colors ${
                    user.status === "Blocked"
                      ? "border-green-500/30 text-green-400 hover:bg-green-500/10"
                      : "border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                  }`}
                >
                  <Ban size={14} />
                  <span>{user.status === "Blocked" ? "Unblock" : "Block"}</span>
                </button>

                <button
                  onClick={() => handleDeleteUser(user)}
                  disabled={user.status === "Admin"}
                  className="px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-mono flex items-center gap-1.5"
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
