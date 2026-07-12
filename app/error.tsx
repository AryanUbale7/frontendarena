'use client'

import * as React from 'react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  React.useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#060608] text-text-primary p-6 text-center">
      <div className="max-w-md space-y-6">
        <h1 className="text-3xl font-heading font-bold uppercase tracking-tight text-red-500">
          AN ERROR OCCURRED
        </h1>
        <p className="text-text-secondary font-body text-sm">
          A glitch was detected in the Arena. The execution was halted to prevent further exceptions.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Button variant="primary" onClick={reset}>
            Try again
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/">
              Return Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
