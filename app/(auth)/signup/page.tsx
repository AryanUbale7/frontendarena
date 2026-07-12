"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { useRouter } from "next/navigation"
import { Mail, Lock, User, ArrowRight, ShieldCheck, Users, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { signup } from "@/actions/auth"

export default function SignupPage() {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)
  const [password, setPassword] = React.useState("")
  const [errorMsg, setErrorMsg] = React.useState("")
  
  const getPasswordStrength = () => {
    if (password.length === 0) return 0
    if (password.length < 6) return 1
    if (password.length < 10) return 2
    return 3
  }
  
  const strength = getPasswordStrength()

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg("")
    
    const formData = new FormData(e.currentTarget)
    const pass = formData.get("password") as string
    const confirmPass = formData.get("confirmPassword") as string
    
    if (pass !== confirmPass) {
      setErrorMsg("Passwords do not match")
      setLoading(false)
      return
    }

    const result = await signup(formData)
    
    if (result?.error) {
      setErrorMsg(result.error)
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface/80 backdrop-blur-md border border-surface-border rounded-2xl p-8 shadow-2xl relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-violet to-accent-gold" />
      
      <div className="text-center mb-8">
        <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">Join the Arena</h1>
        <p className="text-text-secondary font-body">Create your developer profile to compete.</p>
      </div>

      <form onSubmit={handleSignup} className="space-y-5">
        
        {errorMsg && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/50 flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-mono text-text-muted uppercase tracking-wider">Team Name</label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input 
              type="text" 
              name="teamName"
              required
              placeholder="e.g. Code Wizards"
              className="w-full bg-background border border-surface-border rounded-lg pl-10 pr-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-violet transition-colors"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-mono text-text-muted uppercase tracking-wider">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input 
              type="text" 
              name="fullName"
              required
              placeholder="John Doe"
              className="w-full bg-background border border-surface-border rounded-lg pl-10 pr-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-violet transition-colors"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-mono text-text-muted uppercase tracking-wider">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input 
              type="email" 
              name="email"
              required
              placeholder="developer@example.com"
              className="w-full bg-background border border-surface-border rounded-lg pl-10 pr-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-violet transition-colors"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-mono text-text-muted uppercase tracking-wider">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input 
              type="password" 
              name="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-background border border-surface-border rounded-lg pl-10 pr-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-violet transition-colors"
            />
          </div>
          {/* Password Strength Indicator */}
          {password.length > 0 && (
            <div className="flex gap-1 mt-2">
              {[1, 2, 3].map((level) => (
                <div 
                  key={level} 
                  className={cn(
                    "h-1 w-full rounded-full transition-colors",
                    strength >= level 
                      ? strength === 1 ? "bg-red-500" : strength === 2 ? "bg-accent-gold" : "bg-green-500"
                      : "bg-surface-border"
                  )} 
                />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-mono text-text-muted uppercase tracking-wider">Confirm Password</label>
          <div className="relative">
            <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input 
              type="password" 
              name="confirmPassword"
              required
              placeholder="••••••••"
              className="w-full bg-background border border-surface-border rounded-lg pl-10 pr-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-violet transition-colors"
            />
          </div>
        </div>

        <Button 
          type="submit" 
          variant="primary" 
          className="w-full h-12 flex items-center justify-center gap-2 mt-2"
          disabled={loading}
        >
          {loading ? "Registering..." : "Create Account"}
          {!loading && <ArrowRight size={18} />}
        </Button>
      </form>

      <div className="mt-8 text-center text-sm text-text-secondary">
        Already have an account?{" "}
        <Link href="/login" className="text-accent-violet hover:underline font-medium">
          Log in
        </Link>
      </div>
    </motion.div>
  )
}
