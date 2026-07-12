"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Search, Filter, Mail, Ban, Loader2, Download } from "lucide-react"
import { getAllParticipants } from "@/actions/admin"

export default function ParticipantsPage() {
  const [data, setData] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [errorMsg, setErrorMsg] = React.useState("")

  React.useEffect(() => {
    getAllParticipants().then((res) => {
      if (res.error) {
        console.error("Fetch error:", res.error)
        setErrorMsg(res.error)
      }
      if (res.data) setData(res.data)
      setLoading(false)
    })
  }, [])

  const handleExportCSV = () => {
    if (data.length === 0) return

    // Extract headers
    const headers = ["User ID", "Name", "Email", "Joined", "Status"]
    
    // Map rows
    const rows = data.map(user => [
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

    // Create a blob and trigger download
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
    <div className="w-full max-w-6xl mx-auto h-full flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">Participants</h1>
          <p className="text-text-secondary font-body">Directory of all registered developers.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input 
              type="text" 
              placeholder="Search Name or Email..." 
              className="w-full bg-surface border border-surface-border rounded-md pl-10 pr-4 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-violet transition-colors"
            />
          </div>
          <Button variant="secondary" size="sm" className="h-9 px-3">
            <Filter size={18} />
          </Button>
          <Button 
            variant="primary" 
            size="sm" 
            className="h-9 px-4 flex items-center gap-2"
            onClick={handleExportCSV}
            disabled={data.length === 0 || loading}
          >
            <Download size={16} />
            <span className="hidden sm:inline">Export CSV</span>
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-surface border border-surface-border rounded-xl flex-1 overflow-hidden flex flex-col"
      >
        <div className="overflow-x-auto hidden md:block">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-border bg-surface-hover/50">
                <th className="p-4 text-xs font-mono text-text-muted uppercase tracking-wider">User ID</th>
                <th className="p-4 text-xs font-mono text-text-muted uppercase tracking-wider">Name</th>
                <th className="p-4 text-xs font-mono text-text-muted uppercase tracking-wider">Email</th>
                <th className="p-4 text-xs font-mono text-text-muted uppercase tracking-wider">Joined</th>
                <th className="p-4 text-xs font-mono text-text-muted uppercase tracking-wider">Status</th>
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
              ) : errorMsg ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-red-400">
                    Error: {errorMsg}
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-text-muted">
                    No participants found.
                  </td>
                </tr>
              ) : data.map((user) => (
                <tr key={user.id} className="hover:bg-surface-hover transition-colors">
                  <td className="p-4 font-mono text-sm text-text-secondary">{user.id}</td>
                  <td className="p-4 font-medium text-text-primary">{user.name}</td>
                  <td className="p-4 text-sm text-text-secondary">{user.email}</td>
                  <td className="p-4 text-sm text-text-muted">{user.joined}</td>
                  <td className="p-4">
                    <Badge variant={user.status === "Admin" ? "violet" : user.status === "Active" ? "gold" : "default"}>
                      {user.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="secondary" size="sm" className="h-8 px-2 text-text-secondary hover:text-white" title="Email User">
                        <Mail size={16} />
                      </Button>
                      <Button variant="secondary" size="sm" className="h-8 px-2 text-red-400 hover:text-red-300 hover:bg-red-400/10" title="Ban User">
                        <Ban size={16} />
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
          ) : errorMsg ? (
            <div className="p-12 text-center text-red-400">
              Error: {errorMsg}
            </div>
          ) : data.length === 0 ? (
            <div className="p-12 text-center text-text-muted">
              No participants found.
            </div>
          ) : data.map((user) => (
            <div key={user.id} className="p-5 space-y-4 hover:bg-surface-hover transition-colors">
              <div className="flex justify-between items-center gap-2">
                <span className="font-semibold text-text-primary text-base truncate">{user.name}</span>
                <Badge variant={user.status === "Admin" ? "violet" : user.status === "Active" ? "gold" : "default"}>
                  {user.status}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                <span className="text-text-muted">User ID</span>
                <span className="text-text-secondary col-span-2 truncate">{user.id}</span>
                
                <span className="text-text-muted">Email</span>
                <span className="text-text-secondary col-span-2 truncate">{user.email}</span>
                
                <span className="text-text-muted">Joined</span>
                <span className="text-text-secondary col-span-2">{user.joined}</span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="secondary" size="sm" className="h-9 px-3 flex items-center gap-1.5 text-text-secondary hover:text-white" title="Email User">
                  <Mail size={16} />
                  <span>Email</span>
                </Button>
                <Button variant="secondary" size="sm" className="h-9 px-3 flex items-center gap-1.5 text-red-400 hover:text-red-300 hover:bg-red-400/10" title="Ban User">
                  <Ban size={16} />
                  <span>Ban</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
