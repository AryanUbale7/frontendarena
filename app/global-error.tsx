'use client'

import * as React from 'react'

export default function GlobalError({
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
    <html lang="en">
      <body style={{
        backgroundColor: '#060608',
        color: '#ffffff',
        fontFamily: 'sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        margin: 0,
        padding: '24px',
        textAlign: 'center'
      }}>
        <h1 style={{ color: '#ef4444', fontSize: '32px', marginBottom: '16px' }}>SYSTEM HALTED</h1>
        <p style={{ color: '#a09b8c', maxWidth: '400px', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>
          A critical system exception occurred in the root layout context.
        </p>
        <button 
          onClick={reset}
          style={{
            backgroundColor: '#ef4444',
            color: '#ffffff',
            border: 'none',
            padding: '12px 24px',
            fontSize: '14px',
            fontWeight: 'bold',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Recover System
        </button>
      </body>
    </html>
  )
}
