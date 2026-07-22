"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Mail, Briefcase, Calendar, Star, MessageSquare, Loader2, Download } from "lucide-react"
import { getAllSponsorInquiries } from "@/actions/admin"
import { SponsorInquiry } from "@/lib/types"

export default function AdminSponsorsPage() {
  const [data, setData] = React.useState<SponsorInquiry[]>([])
  const [loading, setLoading] = React.useState(true)
  const [errorMsg, setErrorMsg] = React.useState("")

  React.useEffect(() => {
    getAllSponsorInquiries().then((res) => {
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

    const headers = ["ID", "Name", "Email", "Company", "Tier Interest", "Message", "Requested At"]
    
    const rows = data.map(inquiry => [
      inquiry.id || "",
      `${inquiry.first_name || inquiry.contact_name || ""} ${inquiry.last_name || ""}`.trim() || "Unknown",
      inquiry.email || inquiry.contact_email || "",
      inquiry.company || inquiry.company_name || "N/A",
      (inquiry.tier || "General").toUpperCase(),
      inquiry.message || "",
      inquiry.created_at ? new Date(inquiry.created_at).toLocaleString() : ""
    ])

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `sponsor_inquiries_${new Date().toISOString().split("T")[0]}.csv`)
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
          <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">Sponsorship Inquiries</h1>
          <p className="text-text-secondary font-body">Manage prospective sponsors and prospectus requests.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
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
                <th className="p-4 text-xs font-mono text-text-muted uppercase tracking-wider">Company</th>
                <th className="p-4 text-xs font-mono text-text-muted uppercase tracking-wider">Contact</th>
                <th className="p-4 text-xs font-mono text-text-muted uppercase tracking-wider">Email</th>
                <th className="p-4 text-xs font-mono text-text-muted uppercase tracking-wider">Tier Interest</th>
                <th className="p-4 text-xs font-mono text-text-muted uppercase tracking-wider">Message</th>
                <th className="p-4 text-xs font-mono text-text-muted uppercase tracking-wider">Date</th>
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
                    No inquiries found.
                  </td>
                </tr>
              ) : data.map((inquiry, idx) => (
                <tr key={inquiry.id || idx} className="hover:bg-surface-hover transition-colors">
                  <td className="p-4 font-semibold text-text-primary">
                    <div className="flex items-center gap-2">
                      <Briefcase size={16} className="text-text-muted" />
                      {inquiry.company || inquiry.company_name || "N/A"}
                    </div>
                  </td>
                  <td className="p-4 font-medium text-text-primary">
                    {`${inquiry.first_name || inquiry.contact_name || ""} ${inquiry.last_name || ""}`.trim() || "Unknown"}
                  </td>
                  <td className="p-4 text-sm text-text-secondary">
                    <a href={`mailto:${inquiry.email || inquiry.contact_email}`} className="flex items-center gap-2 hover:text-accent-violet transition-colors">
                      <Mail size={14} />
                      {inquiry.email || inquiry.contact_email || "N/A"}
                    </a>
                  </td>
                  <td className="p-4">
                    <Badge variant={
                      inquiry.tier === "champion" ? "gold" 
                      : inquiry.tier === "grandmaster" ? "violet" 
                      : inquiry.tier === "master" ? "outline" 
                      : "default"
                    }>
                      {(inquiry.tier || "General").toUpperCase()}
                    </Badge>
                  </td>
                  <td className="p-4 text-sm text-text-secondary max-w-xs truncate" title={inquiry.message}>
                    {inquiry.message || <span className="text-text-muted italic">No message</span>}
                  </td>
                  <td className="p-4 text-sm text-text-muted">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      {inquiry.created_at ? new Date(inquiry.created_at).toLocaleDateString() : "N/A"}
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
              No inquiries found.
            </div>
          ) : data.map((inquiry, idx) => (
            <div key={inquiry.id || idx} className="p-5 space-y-4 hover:bg-surface-hover transition-colors">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <h4 className="font-semibold text-text-primary text-base flex items-center gap-1.5">
                    <Briefcase size={16} className="text-text-muted flex-shrink-0" />
                    {inquiry.company || inquiry.company_name || "N/A"}
                  </h4>
                  <p className="text-sm text-text-secondary mt-1">{`${inquiry.first_name || inquiry.contact_name || ""} ${inquiry.last_name || ""}`.trim() || "Unknown"}</p>
                </div>
                <Badge variant={
                  inquiry.tier === "champion" ? "gold" 
                  : inquiry.tier === "grandmaster" ? "violet" 
                  : inquiry.tier === "master" ? "outline" 
                  : "default"
                }>
                  {(inquiry.tier || "General").toUpperCase()}
                </Badge>
              </div>

              {inquiry.message && (
                <div className="p-3 bg-background border border-surface-border rounded-lg text-sm text-text-secondary leading-relaxed">
                  {inquiry.message}
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs border-t border-surface-border/50 text-text-muted">
                <a href={`mailto:${inquiry.email || inquiry.contact_email}`} className="flex items-center gap-1.5 text-accent-violet hover:underline">
                  <Mail size={14} />
                  {inquiry.email || inquiry.contact_email || "N/A"}
                </a>
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  {inquiry.created_at ? new Date(inquiry.created_at).toLocaleDateString() : "N/A"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
