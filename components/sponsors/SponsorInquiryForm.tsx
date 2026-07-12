"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Select } from "@/components/ui/Select"
import { Label } from "@/components/ui/Label"
import { Button } from "@/components/ui/Button"
import { submitSponsorInquiry } from "@/actions/public"
import { CheckCircle2, AlertCircle } from "lucide-react"

export function SponsorInquiryForm() {
  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    tier: "champion",
    message: ""
  })
  const [loading, setLoading] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const [errorMsg, setErrorMsg] = React.useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg("")

    try {
      const result = await submitSponsorInquiry(formData)
      if (result.error) {
        setErrorMsg(result.error)
      } else {
        setSuccess(true)
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          company: "",
          tier: "champion",
          message: ""
        })
      }
    } catch (err: any) {
      setErrorMsg("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div 
      className="max-w-2xl mx-auto bg-surface border border-surface-border rounded-xl p-8 md:p-12 shadow-2xl relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8 }}
    >
      {/* Subtle glow inside the form container */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-accent-gold/50 to-transparent" />

      <AnimatePresence mode="wait">
        {!success ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-heading font-bold text-text-primary mb-2">Partner with us</h2>
            <p className="text-text-secondary font-body mb-8">
              Fill out the form below to receive our 2026 sponsorship prospectus.
            </p>

            {errorMsg && (
              <motion.div 
                className="p-4 mb-6 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-400"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="text-sm font-body">
                  <p className="font-semibold">Submission failed</p>
                  <p className="opacity-90">{errorMsg}</p>
                </div>
              </motion.div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    placeholder="Jane" 
                    required 
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    placeholder="Doe" 
                    required 
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Work Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="jane@company.com" 
                  required 
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input 
                  id="company" 
                  placeholder="Acme Corp" 
                  required 
                  value={formData.company}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tier">Sponsorship Tier Interest</Label>
                <Select 
                  id="tier"
                  value={formData.tier}
                  onChange={handleChange}
                >
                  <option value="champion">Champion Tier ($25k+)</option>
                  <option value="grandmaster">Grandmaster Tier ($10k+)</option>
                  <option value="master">Master Tier ($5k+)</option>
                  <option value="other">Undecided / Custom</option>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message (Optional)</Label>
                <Textarea 
                  id="message" 
                  placeholder="How would you like to get involved?" 
                  value={formData.message}
                  onChange={handleChange}
                />
              </div>

              <Button 
                type="submit" 
                variant="primary" 
                className="w-full" 
                size="lg"
                disabled={loading}
              >
                {loading ? "Requesting..." : "Request Prospectus"}
              </Button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            className="text-center py-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
          >
            <div className="w-16 h-16 rounded-full bg-accent-gold/10 flex items-center justify-center mx-auto mb-6 text-accent-gold border border-accent-gold/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-heading font-bold text-text-primary mb-3">Prospectus Requested!</h3>
            <p className="text-text-secondary font-body max-w-md mx-auto mb-8">
              Thank you for your interest. We've received your request and our partnership team will reach out to you within 24 hours.
            </p>
            <Button 
              variant="secondary" 
              onClick={() => setSuccess(false)}
              className="mx-auto"
            >
              Request Another
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
