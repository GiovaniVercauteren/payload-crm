'use client'

import { Admin, User } from '@/payload-types'
import { createContext, use, useCallback, useEffect, useState } from 'react'
import { initializeAuthAction, loginAction, logoutAction } from './actions'
import { APIError, SanitizedPermissions } from 'payload'

import { AuthContext, ResetPassword, ForgotPassword, Create, Login } from './types'

const Context = createContext({} as AuthContext)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Admin | User | undefined | null>(undefined)
  const [permissions, setPermissions] = useState<SanitizedPermissions | null>(null)

  const login = useCallback<Login>(async ({ email, password }) => {
    try {
      const { user, permissions } = await loginAction({ email, password })
      setUser(user)
      setPermissions(permissions)
      return user
    } catch {
      throw new APIError('Login failed')
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await logoutAction()
      setUser(undefined)
      setPermissions(null)
    } catch {
      throw new APIError('Logout failed')
    }
  }, [])

  useEffect(() => {
    const initializeAuth = async () => {
      const { user, permissions } = await initializeAuthAction()
      setUser(user)
      setPermissions(permissions)
    }
    void initializeAuth()
  }, [])

  const create = useCallback<Create>(async ({ email, firstName, lastName, password }) => {
    throw new Error('Not implemented')
  }, [])

  const forgotPassword = useCallback<ForgotPassword>(async ({ email }) => {
    throw new Error('Not implemented')
  }, [])

  const resetPassword = useCallback<ResetPassword>(async ({ password, passwordConfirm, token }) => {
    throw new Error('Not implemented')
  }, [])

  return (
    <Context.Provider
      value={{
        user,
        permissions,
        login,
        logout,
        create,
        forgotPassword,
        resetPassword,
        setUser,
        setPermissions,
      }}
    >
      {children}
    </Context.Provider>
  )
}

type UseAuth<T = User | Admin> = () => AuthContext

export const useAuth: UseAuth = () => use(Context)
