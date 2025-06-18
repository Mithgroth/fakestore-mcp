'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
}

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
      // Call FakeStore API login endpoint
      const response = await fetch('https://fakestoreapi.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('fakestore-token', data.token)
        
        // Fetch all users to find the logged-in user details
        try {
          const usersResponse = await fetch('https://fakestoreapi.com/users')
          if (usersResponse.ok) {
            const users = await usersResponse.json()
            const loggedInUser = users.find((u: any) => u.username === username)
            
            if (loggedInUser) {
              const user: User = {
                id: loggedInUser.id,
                username: loggedInUser.username,
                email: loggedInUser.email,
                firstName: loggedInUser.name.firstname,
                lastName: loggedInUser.name.lastname
              }
              setUser(user)
              return true
            }
          }
        } catch (userError) {
          console.warn('Could not fetch user details, using fallback')
        }
        
        // Fallback to mock user data if user details fetch fails
        const mockUser: User = {
          id: 1,
          username,
          email: `${username}@example.com`,
          firstName: username.charAt(0).toUpperCase() + username.slice(1),
          lastName: 'User'
        }
        
        setUser(mockUser)
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