"use client"

import * as React from "react"
import { uploadProblemStatement } from "./actions"
import { Upload, Loader2, FileText, CheckCircle2, AlertCircle } from "lucide-react"

interface UploadFormProps {
  trackId: string
  onUploadSuccess: () => void
}

export function ProblemStatementUploadForm({ trackId, onUploadSuccess }: UploadFormProps) {
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [file, setFile] = React.useState<File | null>(null)
  
  const [submitting, setSubmitting] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const [error, setError] = React.useState("")

  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Client-side validations
    const maxBytes = 25 * 1024 * 1024
    if (selectedFile.size > maxBytes) {
      setError("File exceeds 25MB limit.")
      setFile(null)
      return
    }

    const ext = selectedFile.name.split('.').pop()?.toLowerCase() || ""
    if (!["pdf", "docx", "zip"].includes(ext)) {
      setError("Invalid file type. Only PDF, DOCX, and ZIP are allowed.")
      setFile(null)
      return
    }

    setError("")
    setFile(selectedFile)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!trackId) {
      setError("Please select a track first.")
      return
    }
    if (!title || !file) {
      setError("Title and file are required.")
      return
    }

    setSubmitting(true)
    setError("")
    setSuccess(false)

    const formData = new FormData()
    formData.append("trackId", trackId)
    formData.append("title", title)
    formData.append("description", description)
    formData.append("file", file)

    const res = await uploadProblemStatement(formData)

    setSubmitting(false)
    if (res.error) {
      setError(res.error)
    } else {
      setSuccess(true)
      setTitle("")
      setDescription("")
      setFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
      onUploadSuccess()
      setTimeout(() => setSuccess(false), 3000)
    }
  }

  return (
    <div className="bg-surface border border-surface-border rounded-xl p-6 shadow-xl relative overflow-hidden">
      <h3 className="text-lg font-heading font-bold text-white mb-4">Upload Problem Statement</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div className="space-y-1">
          <label className="block text-xs font-mono text-text-secondary uppercase">Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Performance Optimization Challenge"
            className="w-full bg-background border border-surface-border rounded-lg p-2.5 text-text-primary text-sm focus:border-accent-violet focus:outline-none transition-colors"
          />
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className="block text-xs font-mono text-text-secondary uppercase">Description (Optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Summary of the challenge scope..."
            rows={3}
            className="w-full bg-background border border-surface-border rounded-lg p-2.5 text-text-primary text-sm focus:border-accent-violet focus:outline-none transition-colors resize-none"
          />
        </div>

        {/* File Picker */}
        <div className="space-y-1">
          <label className="block text-xs font-mono text-text-secondary uppercase">Select File (PDF, DOCX, ZIP | Max 25MB)</label>
          
          {file ? (
            <div className="flex items-center justify-between p-3 bg-background border border-surface-border rounded-lg text-sm gap-3">
              <div className="flex items-center gap-2 text-text-primary min-w-0 flex-1">
                <FileText size={16} className="text-accent-violet flex-shrink-0" />
                <span className="truncate">{file.name}</span>
                <span className="text-xs text-text-muted flex-shrink-0">({(file.size / (1024 * 1024)).toFixed(2)} MB)</span>
              </div>
              <button 
                type="button" 
                onClick={() => setFile(null)}
                className="text-xs font-mono text-red-400 hover:text-red-300 px-2 py-1 flex-shrink-0"
              >
                Clear
              </button>
            </div>
          ) : (
            <label className="border border-dashed border-surface-border hover:border-accent-violet transition-colors rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer">
              <Upload className="text-text-muted mb-2" size={24} />
              <span className="text-xs font-mono text-text-secondary">Drag & drop or browse</span>
              <input 
                type="file" 
                ref={fileInputRef}
                accept=".pdf,.docx,.zip"
                onChange={handleFileChange}
                className="hidden" 
              />
            </label>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-2 flex items-center gap-4">
          <button
            type="submit"
            disabled={submitting || !file || !title}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-accent-violet text-white font-medium hover:bg-accent-violet/90 active:scale-[0.98] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload as Draft"
            )}
          </button>

          {success && (
            <span className="flex items-center gap-1.5 text-green-400 text-xs font-medium animate-pulse">
              <CheckCircle2 size={14} /> Uploaded Successfully!
            </span>
          )}
          {error && (
            <span className="flex items-center gap-1.5 text-red-400 text-xs font-medium">
              <AlertCircle size={14} /> {error}
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
