"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { 
  Users, 
  Upload, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  FileSpreadsheet, 
  RefreshCw, 
  Trash2, 
  AlertCircle,
  Check,
  UserCheck,
  UserX
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { 
  getApprovedParticipantStats, 
  getApprovedParticipantsList, 
  uploadApprovedParticipants,
  deleteApprovedParticipant 
} from "@/actions/admin"
import { ApprovedParticipant } from "@/lib/types"
import * as XLSX from "xlsx"

export default function ApprovedParticipantsPage() {
  const [stats, setStats] = React.useState({ totalApproved: 0, totalRegistered: 0, remaining: 0 })
  const [participants, setParticipants] = React.useState<ApprovedParticipant[]>([])
  const [totalCount, setTotalCount] = React.useState(0)
  const [page, setPage] = React.useState(1)
  const [search, setSearch] = React.useState("")

  const [loading, setLoading] = React.useState(true)
  const [uploading, setUploading] = React.useState(false)
  const [uploadMode, setUploadMode] = React.useState<'update' | 'replace'>('update')

  const [uploadSuccess, setUploadSuccess] = React.useState("")
  const [uploadError, setUploadError] = React.useState("")

  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const loadData = React.useCallback(async () => {
    setLoading(true)
    const [statsRes, listRes] = await Promise.all([
      getApprovedParticipantStats(),
      getApprovedParticipantsList(page, 50, search)
    ])

    setStats(statsRes)
    setParticipants(listRes.data as ApprovedParticipant[])
    setTotalCount(listRes.count)
    setLoading(false)
  }, [page, search])

  React.useEffect(() => {
    loadData()
  }, [loadData])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setUploadError("")
    setUploadSuccess("")

    try {
      const buffer = await file.arrayBuffer()
      const workbook = XLSX.read(buffer, { type: 'array' })
      const firstSheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[firstSheetName]

      // Extract all text rows from sheet
      const json: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
      
      const extractedEmails: string[] = []
      
      json.forEach((row) => {
        if (Array.isArray(row)) {
          row.forEach((cell) => {
            const str = String(cell || "").trim()
            if (str && str.includes("@") && str.includes(".")) {
              extractedEmails.push(str)
            }
          })
        }
      })

      if (extractedEmails.length === 0) {
        setUploadError("No valid email addresses found in the selected file.")
        setUploading(false)
        return
      }

      const res = await uploadApprovedParticipants(extractedEmails, uploadMode)
      if (res.error) {
        setUploadError(res.error)
      } else {
        setUploadSuccess(`Successfully processed ${res.count} approved participant emails!`)
        loadData()
      }
    } catch (err: any) {
      console.error("Error reading file:", err)
      setUploadError("Failed to parse file. Please ensure it is a valid CSV or Excel file.")
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const handleDelete = async (id: string, email: string) => {
    if (!window.confirm(`Remove ${email} from approved whitelist?`)) return
    const res = await deleteApprovedParticipant(id)
    if (res.error) {
      alert(res.error)
    } else {
      loadData()
    }
  }

  const totalPages = Math.ceil(totalCount / 50) || 1

  return (
    <div className="w-full h-full space-y-8">
      
      {/* Header & File Upload trigger */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-surface-border">
        <div>
          <h1 className="text-3xl font-heading font-bold text-text-primary mb-2 uppercase tracking-tight">
            Approved Participants (Unstop Whitelist)
          </h1>
          <p className="text-text-secondary font-body text-sm">
            Only participants whose email exists in this authorized whitelist can register for Frontend Wars 2026.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input 
            type="file" 
            ref={fileInputRef}
            accept=".csv, .xlsx, .xls"
            onChange={handleFileUpload}
            className="hidden"
          />

          <div className="flex items-center bg-surface border border-surface-border rounded-lg p-1">
            <button
              onClick={() => setUploadMode('update')}
              className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
                uploadMode === 'update' ? 'bg-accent-violet text-white font-bold' : 'text-text-muted hover:text-white'
              }`}
              title="Add new emails without clearing existing list"
            >
              Update / Add
            </button>
            <button
              onClick={() => setUploadMode('replace')}
              className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
                uploadMode === 'replace' ? 'bg-red-500 text-white font-bold' : 'text-text-muted hover:text-white'
              }`}
              title="Replace non-registered emails with new list"
            >
              Replace
            </button>
          </div>

          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            variant="primary"
            className="flex items-center gap-2 h-11 px-5"
          >
            {uploading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <FileSpreadsheet size={18} />
                <span>Upload CSV / Excel</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Upload Feedback Banners */}
      {uploadSuccess && (
        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm font-body flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} />
            <span>{uploadSuccess}</span>
          </div>
          <button onClick={() => setUploadSuccess("")} className="text-xs hover:underline">Dismiss</button>
        </div>
      )}

      {uploadError && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm font-body flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle size={18} />
            <span>{uploadError}</span>
          </div>
          <button onClick={() => setUploadError("")} className="text-xs hover:underline">Dismiss</button>
        </div>
      )}

      {/* Stats Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-surface border border-surface-border p-6 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-text-secondary font-mono text-xs uppercase tracking-wider mb-1">Total Approved Whitelist</p>
            <h3 className="text-3xl font-heading font-bold text-text-primary">{stats.totalApproved}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-accent-violet/10 flex items-center justify-center text-accent-violet">
            <Users size={24} />
          </div>
        </div>

        <div className="bg-surface border border-surface-border p-6 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-text-secondary font-mono text-xs uppercase tracking-wider mb-1">Completed Registrations</p>
            <h3 className="text-3xl font-heading font-bold text-green-400">{stats.totalRegistered}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-400">
            <UserCheck size={24} />
          </div>
        </div>

        <div className="bg-surface border border-surface-border p-6 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-text-secondary font-mono text-xs uppercase tracking-wider mb-1">Pending Registrations</p>
            <h3 className="text-3xl font-heading font-bold text-accent-gold">{stats.remaining}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-accent-gold/10 flex items-center justify-center text-accent-gold">
            <UserX size={24} />
          </div>
        </div>
      </div>

      {/* Search & Whitelist Data Table */}
      <div className="bg-surface border border-surface-border rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-surface-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search by email..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full bg-background border border-surface-border rounded-lg pl-9 pr-4 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-violet transition-colors font-mono"
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-text-muted">
            <button onClick={loadData} className="p-2 hover:text-white transition-colors flex items-center gap-1">
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
            </button>
            <span>Showing {participants.length} of {totalCount}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-border bg-surface-hover/50 text-text-muted font-mono text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Authorized Email Address</th>
                <th className="p-4 font-semibold">Registration Date</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/50 text-sm font-body">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-text-muted">
                    <Loader2 className="animate-spin mx-auto mb-2 text-accent-violet" size={28} />
                    <span>Loading whitelist records...</span>
                  </td>
                </tr>
              ) : participants.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-text-muted font-mono">
                    No approved participant emails found. Upload a CSV or Excel file to whitelist participants.
                  </td>
                </tr>
              ) : (
                participants.map((p) => (
                  <tr key={p.id} className="hover:bg-surface-hover/40 transition-colors">
                    <td className="p-4">
                      {p.registered ? (
                        <Badge variant="gold" className="bg-green-500/10 text-green-400 border-green-500/30 font-mono text-xs">
                          <Check size={12} className="mr-1 inline" /> Registered
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-text-muted border-surface-border font-mono text-xs">
                          Pending
                        </Badge>
                      )}
                    </td>
                    <td className="p-4 font-mono font-medium text-text-primary">
                      {p.email}
                    </td>
                    <td className="p-4 font-mono text-xs text-text-muted">
                      {p.registered_at ? new Date(p.registered_at).toLocaleString() : "Not registered yet"}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(p.id, p.email)}
                        title="Remove email from approved list"
                        className="p-2 text-text-muted hover:text-red-400 transition-colors rounded-lg hover:bg-red-400/10"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-surface-border flex items-center justify-between text-xs font-mono text-text-muted">
            <button
              disabled={page <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-lg border border-surface-border hover:text-white disabled:opacity-40 transition-colors"
            >
              Previous
            </button>

            <span>Page {page} of {totalPages}</span>

            <button
              disabled={page >= totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 rounded-lg border border-surface-border hover:text-white disabled:opacity-40 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>

    </div>
  )
}
