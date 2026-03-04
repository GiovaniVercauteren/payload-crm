'use client'

import { useAuth } from '../_providers/auth/auth.provider'

export default function HomePage() {
  const auth = useAuth()

  return (
    <main>
      <h1>Welcome to the Payload CRM Frontend!</h1>
      <p>This is a placeholder page. You can customize it as needed.</p>
      <p>This page is public!</p>
      {auth.user ? <p>You are logged in as {auth.user.email}</p> : <p>You are not logged in.</p>}
    </main>
  )
}
