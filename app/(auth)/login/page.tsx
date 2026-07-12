"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { useRouter } from "next/navigation"
import { Users, Lock, ArrowRight, AlertCircle } from "lucide-react"
import { login } from "@/actions/auth"

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)
  const [errorMsg, setErrorMsg] = React.useState("")

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg("")
    
    const formData = new FormData(e.currentTarget)
    const result = await login(formData)
    
    if (result?.error) {
      setErrorMsg(result.error)
      setLoading(false)
    }
    // If successful, the server action handles the redirect
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface/80 backdrop-blur-md border border-surface-border rounded-2xl p-8 shadow-2xl relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-violet to-accent-gold" />
      
      <div className="text-center mb-8">
        <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">Welcome Back</h1>
        <p className="text-text-secondary font-body">Enter the arena and claim your spot.</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        {errorMsg && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/50 flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}
        <div className="space-y-2">
          <label className="text-sm font-mono text-text-muted uppercase tracking-wider">Team Name (Email Login)</label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input 
              type="text" 
              name="email"
              required
              placeholder="team@example.com"
              className="w-full bg-background border border-surface-border rounded-lg pl-10 pr-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-violet transition-colors"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-mono text-text-muted uppercase tracking-wider">Password</label>
            <Link href="/forgot-password" className="text-xs font-mono text-accent-gold hover:underline">
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input 
              type="password" 
              name="password"
              required
              placeholder="••••••••"
              className="w-full bg-background border border-surface-border rounded-lg pl-10 pr-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-violet transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" id="remember" className="rounded border-surface-border bg-background text-accent-violet focus:ring-accent-violet" />
          <label htmlFor="remember" className="text-sm text-text-secondary">Remember me for 30 days</label>
        </div>

        <Button 
          type="submit" 
          variant="primary" 
          className="w-full h-12 flex items-center justify-center gap-2"
          disabled={loading}
        >
          {loading ? "Authenticating..." : "Enter Arena"}
          {!loading && <ArrowRight size={18} />}
        </Button>
      </form>

      <div className="mt-8 text-center text-sm text-text-secondary">
        Don't have an account?{" "}
        <Link href="/signup" className="text-accent-violet hover:underline font-medium">
          Register now
        </Link>
      </div>
    </motion.div>
  )
}
