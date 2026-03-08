'use server'

import { getPermissions, login, logout } from '@/lib/auth'
import { APIError, getPayload } from 'payload'
import config from '@payload-config'
import { headers as getHeaders } from 'next/headers'

export async function loginAction({ email, password }: { email: string; password: string }) {
  try {
    const user = await login(email, password)
    const permissions = await getPermissions()
    return { user, permissions }
  } catch {
    throw new APIError('Login failed')
  }
}

export async function logoutAction() {
  try {
    return await logout()
  } catch {
    throw new APIError('Logout failed')
  }
}

export async function initializeAuthAction() {
  try {
    const headers = await getHeaders()
    const payload = await getPayload({ config })
    const { user, permissions } = await payload.auth({ headers })
    return { user, permissions }
  } catch {
    return { user: null, permissions: null }
  }
}

export async function updateAccountAction(data: any) {
  const headers = await getHeaders()
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers })

  if (!user) {
    throw new Error('Unauthorized')
  }

  try {
    const updatedUser = await payload.update({
      collection: 'users',
      id: user.id,
      data,
      overrideAccess: false,
      user,
    })
    return updatedUser
  } catch (error) {
    console.error('Failed to update account:', error)
    throw new Error('Failed to update account')
  }
}

export async function uploadMediaAction(formData: FormData) {
  const headers = await getHeaders()
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers })

  if (!user) {
    throw new Error('Unauthorized')
  }

  const file = formData.get('file') as File
  if (!file) {
    throw new Error('No file provided')
  }

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  try {
    const media = await payload.create({
      collection: 'media',
      data: {
        alt: file.name,
      },
      file: {
        data: buffer,
        name: file.name,
        mimetype: file.type,
        size: file.size,
      },
      overrideAccess: false,
      user,
    })
    return media
  } catch (error) {
    console.error('Failed to upload media:', error)
    throw new Error('Failed to upload media')
  }
}
