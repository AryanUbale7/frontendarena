"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { ShieldAlert, KeyRound, Loader2, AlertCircle } from "lucide-react"
import { adminLogin } from "@/actions/auth"

export default function AdminLoginPage() {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-violet/5 blur-[120px] rounded-full pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-surface border border-surface-border rounded-2xl shadow-2xl p-8 relative z-10"
      >
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-accent-violet/10 rounded-2xl flex items-center justify-center mb-6 border border-accent-violet/20">
            <ShieldAlert size={32} className="text-accent-violet" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-text-primary uppercase tracking-wide">
            Admin <span className="text-accent-violet">Portal</span>
          </h1>
          <p className="text-text-secondary font-body mt-2">
            Restricted access. Please authenticate.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-3">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form action={async (formData) => {
          setLoading(true)
          setError("")
          const res = await adminLogin(formData)
          if (res?.error) {
            setError(res.error)
            setLoading(false)
          }
        }} className="space-y-6">
          
          <div className="space-y-2">
            <Label htmlFor="email">Admin Username</Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input 
                id="email"
                name="email" 
                type="text" 
                required 
                placeholder="Admin ID" 
                className="w-full bg-background border border-surface-border rounded-lg pl-10 pr-4 py-3 text-text-primary focus:outline-none focus:border-accent-violet transition-colors" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Passkey</Label>
            </div>
            <div className="relative">
              <input 
                id="password"
                name="password" 
                type="password" 
                required 
                placeholder="••••••••" 
                className="w-full bg-background border border-surface-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent-violet transition-colors font-mono tracking-widest" 
              />
            </div>
          </div>

          <Button type="submit" variant="primary" className="w-full h-12 bg-accent-violet hover:bg-accent-violet-hover border-transparent" disabled={loading}>
            {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : "Authenticate"}
          </Button>
        </form>
      </motion.div>
    </div>
  )
}
