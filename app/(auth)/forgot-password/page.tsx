"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { Mail, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react"
import { resetPassword } from "@/actions/auth"

export default function ForgotPasswordPage() {
  const [loading, setLoading] = React.useState(false)
  const [submitted, setSubmitted] = React.useState(false)
  const [errorMsg, setErrorMsg] = React.useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg("")
    
    const formData = new FormData(e.currentTarget)
    const result = await resetPassword(formData)
    
    setLoading(false)
    if (result?.error) {
      setErrorMsg(result.error)
    } else {
      setSubmitted(true)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface/80 backdrop-blur-md border border-surface-border rounded-2xl p-8 shadow-2xl relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-violet to-accent-gold" />
      
      {!submitted ? (
        <>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">Reset Password</h1>
            <p className="text-text-secondary font-body">Enter your email to receive a reset link.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/50 flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle size={16} />
                <span>{errorMsg}</span>
              </div>
            )}
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

            <Button 
              type="submit" 
              variant="primary" 
              className="w-full h-12 flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
              {!loading && <ArrowRight size={18} />}
            </Button>
          </form>
        </>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-6"
        >
          <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="text-2xl font-heading font-bold text-text-primary mb-2">Check your email</h2>
          <p className="text-text-secondary font-body mb-8">
            We've sent a password reset link to your email address.
          </p>
          <Button variant="secondary" className="w-full" onClick={() => setSubmitted(false)}>
            Try another email
          </Button>
        </motion.div>
      )}

      <div className="mt-8 text-center">
        <Link href="/login" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-accent-violet transition-colors">
          <ArrowLeft size={16} />
          Back to Login
        </Link>
      </div>
    </motion.div>
  )
}
