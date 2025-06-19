'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { mcpClient } from './mcp-client'
import { User } from '@/lib/types'

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing token on mount
    const token = localStorage.getItem('fakestore-token')
    if (token) {
      // In a real app, we'd validate the token
      // For now, we'll just assume it's valid and get user info
      // This is a simplified approach for the demo
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Use MCP client for login
      const result = await mcpClient.login(username, password)
      
      if (result.success && result.token) {
        localStorage.setItem('fakestore-token', result.token)
        const authUser = mcpClient.getCurrentUser()
        if (authUser) {
          setUser(authUser)
        }
        return true
      }
      
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('fakestore-token')
    mcpClient.clearAuth()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 