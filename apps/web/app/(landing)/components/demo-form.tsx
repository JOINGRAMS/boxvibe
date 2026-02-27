'use client'

import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface DemoFormProps {
  variant?: 'hero' | 'cta'
}

export default function DemoForm({ variant = 'hero' }: DemoFormProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address.')
      return
    }
    setLoading(true)
    setError('')
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 400)
  }

  if (submitted) {
    return (
      <div
        className={cn(
          'flex flex-col items-start gap-2',
          variant === 'cta' && 'items-center text-center',
        )}
      >
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-6 w-6 text-green-500" />
          <p className="font-medium text-slate-900">We&apos;ll be in touch — check your inbox.</p>
        </div>
        <p className="text-sm text-slate-500">
          In the meantime, feel free to email us at{' '}
          <a href="mailto:hello@boxvibe.com" className="text-indigo-600 hover:underline">
            hello@boxvibe.com
          </a>
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div
        className={cn(
          'flex w-full flex-col gap-3 sm:flex-row',
          variant === 'cta' && 'mx-auto max-w-md',
        )}
      >
        <Input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setEmail(e.target.value)
            setError('')
          }}
          className="h-11 flex-1 border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-indigo-500"
          required
        />
        <Button
          type="submit"
          disabled={loading}
          className="h-11 whitespace-nowrap bg-indigo-600 px-6 text-white hover:bg-indigo-700 disabled:opacity-70"
        >
          {loading ? 'Sending...' : 'Book a Demo'}
        </Button>
      </div>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </form>
  )
}
