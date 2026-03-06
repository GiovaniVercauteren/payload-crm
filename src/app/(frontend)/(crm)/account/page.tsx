'use client'

import { useAuth } from '../../_providers/auth/auth.provider'

export default function AccountPage() {
  const { user, permissions } = useAuth()

  return (
    <main>
      <h1>Account</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <h1>Permissions</h1>
      <pre>{JSON.stringify(permissions, null, 2)}</pre>
    </main>
  )
}
