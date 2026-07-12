"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { RiftRing } from "@/components/signature/RiftRing"
import { getTournamentsData } from "@/actions/public"
import { Loader2 } from "lucide-react"
import Link from "next/link"

export default function TournamentsPage() {
  const [data, setData] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    getTournamentsData().then((res) => {
      if (res.data) setData(res.data)
      setLoading(false)
    })
  }, [])

  return (
    <main className="relative min-h-screen bg-background pt-24 pb-16">
      
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
        
        {/* Header */}
        <div className="mb-16 pt-16">
          <motion.h1 
            className="text-4xl md:text-6xl font-heading font-bold uppercase tracking-tight text-text-primary mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            The <span className="text-accent-violet">Arena</span> Calendar
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl text-text-secondary font-body max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Find upcoming qualifiers, flagship tournaments, and review the archives of past battles.
          </motion.p>
        </div>

        {/* Flagship Event Banner */}
        <Link href="/frontend-wars-2026" className="block mb-24">
          <motion.div 
            className="relative bg-surface border border-surface-border rounded-xl overflow-hidden shadow-2xl group cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
          {/* Subtle Background Ring */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 opacity-30 pointer-events-none group-hover:scale-105 transition-transform duration-1000">
            <RiftRing variant="gold" size={400} interactive={false} />
          </div>
          
          <div className="relative z-10 p-8 md:p-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="max-w-xl">
              <Badge variant="gold" className="mb-4">Upcoming Flagship</Badge>
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-text-primary uppercase tracking-tight mb-4">
                Frontend Wars 2026
              </h2>
              <p className="text-text-secondary font-body text-lg mb-8">
                The ultimate 72-hour survival challenge. Over $50,000 in prizes. Do you have what it takes?
              </p>
              <Button variant="primary">Enter Arena Details</Button>
            </div>
            <div className="hidden lg:flex flex-col items-end text-right">
              <span className="text-sm font-mono text-text-muted uppercase tracking-widest">Date</span>
              <span className="text-2xl font-heading font-bold text-text-primary">Feb 24, 2026</span>
            </div>
          </div>
        </motion.div>
        </Link>

        {/* Past Tournaments */}
        <div>
          <h2 className="text-2xl font-heading font-bold text-text-primary mb-8 border-b border-surface-border pb-4">
            Archives
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {loading ? (
              <div className="col-span-1 md:col-span-2 flex justify-center py-12">
                <Loader2 className="animate-spin text-accent-violet" size={32} />
              </div>
            ) : data.length === 0 ? (
              <p className="text-text-muted">No past events found.</p>
            ) : (
              data.map((event, i) => (
                <motion.div 
                  key={event.id}
                  className="bg-surface p-6 border border-surface-border rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-sm font-mono text-text-muted">
                      {new Date(event.start_date).getFullYear()}
                    </span>
                    <Badge variant={event.status === 'completed' ? "default" : "gold"}>
                      {event.status}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-heading font-bold text-text-primary mb-2">{event.name}</h3>
                  <p className="text-text-secondary font-body text-sm line-clamp-2">
                    {event.description}
                  </p>
                </motion.div>
              ))
            )}
          </div>
        </div>

      </div>
    </main>
  )
}
