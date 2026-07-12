"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className="border-b border-surface-border">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-6 text-left group focus:outline-none"
      >
        <span className="text-lg font-heading font-semibold text-text-primary group-hover:text-accent-violet transition-colors">
          {question}
        </span>
        <ChevronDown 
          className={cn(
            "w-5 h-5 text-text-muted transition-transform duration-300",
            isOpen ? "rotate-180" : ""
          )} 
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-text-secondary font-body whitespace-pre-wrap leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function JudgesFAQ() {
  const faqs = [
    {
      question: "Can I use AI tools (ChatGPT, Claude, Copilot, Antigravity, etc.) during the hackathon?",
      answer: `Yes — AI tools are allowed. Frontend Wars 2026 judges what you ship, not how you typed it. You can use AI coding assistants, chatbots, or any dev tool you'd normally use in a real job.

That said, two things matter more because AI tools exist:

• You must be able to explain your own code. If judges ask how a part of your submission works and you can't explain it, that counts against you — using AI doesn't excuse not understanding your own project.
• Core logic and UI must be your team's own implementation, assisted by AI, not copy-pasted from someone else's finished project (yours or a stranger's) and passed off as new work. AI-assisted is fine. AI-replaced-your-effort-entirely with a pre-built template is not.

If you're unsure whether a specific tool or workflow crosses the line, ask in the event Discord before the deadline — not after.`
    },
    {
      question: "Can I use any tech stack, or do I have to use what's mentioned in the problem statement?",
      answer: "Unless a specific track's problem statement explicitly requires a certain stack (some tracks may mandate React/Next.js for consistency in judging), you're free to use any frontend framework or library. If the problem statement is silent on stack, assume it's your choice."
    },
    {
      question: "Can I work solo, or do I need a team?",
      answer: "Both are allowed. Solo participants and teams (up to the max size listed on the registration page) can register for any track. You don't need to have a team before registering — team formation happens after registration, and we support finding teammates through the community."
    },
    {
      question: "What happens if I want to change my team after registering?",
      answer: "Team changes are allowed up until the submission window opens. Once submissions open, team composition is locked for that event — reach out to the organizing team via Contact if you have a genuine issue before that deadline."
    },
    {
      question: "Where do I find the problem statements?",
      answer: "Problem statements are released by the organizing team through your participant dashboard, per track, once your team's registration is confirmed. You'll see a notification on your dashboard the moment they're released — no separate email required, though we'll also post an announcement in the community Discord."
    },
    {
      question: "Can I start working before the problem statement is officially released?",
      answer: "You can prepare your environment, pick your stack, and get your team aligned — but the actual problem statement (and therefore your actual submission work) can only begin once it's released. Submitting work that clearly predates the release window may be flagged for review."
    },
    {
      question: "What do I submit, and in what format?",
      answer: "Each submission requires: a GitHub repository link, a live deployed link (Vercel, Netlify, or similar), a short demo video, and a written project summary. All four are required — an incomplete submission (e.g., no live link) may not be eligible for judging."
    },
    {
      question: "Can I update/edit my submission after submitting?",
      answer: "Yes, up until the submission deadline for your track. Once the deadline passes, submissions are locked and moved into judging — no edits accepted after that point, so submit early if you're unsure about your internet connection or last-minute changes."
    },
    {
      question: "How is judging decided?",
      answer: "Submissions are scored by assigned judges against a fixed rubric (covering criteria like UI/UX quality, code quality, innovation, and problem-fit — exact weighting is listed on the event page). Each submission gets multiple judges to reduce bias, and scores are aggregated to produce the final ranking. Judges score independently and can't see each other's scores before submitting their own."
    },
    {
      question: "When and how will results be announced?",
      answer: "Results go live on the public Leaderboard once judging closes for your track. Winners additionally get a permanent Hall of Fame profile on the Frontend Arena platform, so your win becomes a shareable, lasting record — not just a one-time announcement."
    },
    {
      question: "Is there a registration fee?",
      answer: "Check the specific track/event details on this page — this varies per event and will be clearly listed before you register. If a track is free, it will say so explicitly."
    },
    {
      question: "What if I face a technical issue during submission (site down, upload failing, etc.)?",
      answer: "Contact the organizing team immediately through the Contact page or the event Discord — don't wait until after the deadline to report a submission-blocking issue. Genuine platform-side issues reported before the deadline will be handled case by case; issues reported after the deadline has already passed generally won't be."
    },
    {
      question: "Can I participate if I'm not a student?",
      answer: "Yes — Frontend Arena is open to students, working professionals, freelancers, and self-taught developers alike. Some tracks may have specific eligibility notes (e.g., a student-only prize category); check the track details for any such restrictions."
    }
  ]

  return (
    <section className="w-full py-24 px-6 md:px-12 lg:px-24 bg-surface border-t border-surface-border">
      <div className="max-w-3xl mx-auto">
        
        {/* FAQ */}
        <div>
          <h2 className="text-3xl md:text-5xl font-heading font-bold uppercase tracking-tight text-text-primary mb-12 text-center">
            Participant F.A.Q.
          </h2>
          <div className="flex flex-col">
            {faqs.map((faq, i) => (
              <FAQItem key={i} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
