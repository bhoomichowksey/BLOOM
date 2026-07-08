'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function AuthErrorPage() {
  const [message, setMessage] = useState(
    'That link is no longer valid. Please sign in, or create a new account if you haven\'t confirmed yet.'
  )

  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    const params = new URLSearchParams(hash)
    const errorCode = params.get('error_code')

    if (errorCode === 'otp_expired') {
      setMessage(
        'That confirmation link has expired. Please sign up again to get a fresh one, or sign in if you already confirmed.'
      )
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-pink-100">
          <span className="text-2xl">✿</span>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Welcome to Bloom</h1>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex flex-col gap-3">
          <Link
            href="/auth/login"
            className="w-full rounded-full bg-pink-600 text-white py-2.5 font-medium hover:bg-pink-700 transition"
          >
            Sign in
          </Link>
          <Link
            href="/auth/sign-up"
            className="w-full rounded-full border border-pink-600 text-pink-600 py-2.5 font-medium hover:bg-pink-50 transition"
          >
            Create a new account
          </Link>
        </div>
      </div>
    </div>
  )
}
