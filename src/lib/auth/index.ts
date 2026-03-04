import { cookies, headers as getHeaders } from 'next/headers'
import jwt from 'jsonwebtoken'
import { JwtContents } from './types'
import {
  login as payloadLogin,
  logout as payloadLogout,
  refresh as payloadRefresh,
} from '@payloadcms/next/auth'
import config from '@payload-config'
import Logger from '../logger'
import { APIError, getPayload } from 'payload'

export const getDecodedToken = async () => {
  const token = await getTokenFromCookie()
  if (!token) return null

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtContents
    return decoded
  } catch (error) {
    console.error('Failed to decode token:', error)
    return null
  }
}

export const getTokenFromCookie = async () => {
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value

  return token || null
}

export const isAuthenticated = async () => {
  const decodedToken = await getDecodedToken()
  return !!decodedToken
}

export const isAdmin = async () => {
  const decodedToken = await getDecodedToken()
  if (!decodedToken) return false

  // Assuming the token contains a 'collection' field that indicates the user's collection
  return decodedToken.collection === 'admins'
}

export const getPermissions = async () => {
  try {
    const headers = await getHeaders()
    const payload = await getPayload({ config })
    const { permissions } = await payload.auth({ headers })

    return permissions || null
  } catch (error) {
    Logger.error({
      type: 'error',
      message: 'Failed to fetch permissions',
      stack: error instanceof Error ? error.stack : undefined,
    })
    return null
  }
}

export const login = async (email: string, password: string) => {
  try {
    const result = await payloadLogin({
      collection: 'users',
      config,
      email,
      password,
    })
    if (!result.user) {
      throw new APIError('Login failed')
    }
    return result.user
  } catch (error) {
    Logger.error({
      type: 'error',
      message: 'Login failed',
      stack: error instanceof Error ? error.stack : undefined,
    })
    throw new APIError('Login failed')
  }
}

export const logout = async (allSessions: boolean = false) => {
  try {
    return await payloadLogout({ config, allSessions })
  } catch (error) {
    Logger.error({
      type: 'error',
      message: 'Logout failed',
      stack: error instanceof Error ? error.stack : undefined,
    })
    throw new APIError('Logout failed')
  }
}

export const refresh = async () => {
  try {
    const result = await payloadRefresh({ config })
    return result
  } catch (error) {
    Logger.error({
      type: 'error',
      message: 'Token refresh failed',
      stack: error instanceof Error ? error.stack : undefined,
    })
    throw new APIError('Token refresh failed')
  }
}
