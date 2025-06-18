'use client'

import React, { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, User, Copy, CheckCircle2, Eye, EyeOff } from 'lucide-react'

// Demo users from FakeStore API for easy testing
const DEMO_USERS = [
  { username: 'johnd', password: 'm38rmF$', name: 'John Doe', email: 'john@gmail.com' },
  { username: 'mor_2314', password: '83r5^_', name: 'David Morrison', email: 'morrison@gmail.com' },
  { username: 'kevinryan', password: 'kev02937@', name: 'Kevin Ryan', email: 'kevin@gmail.com' },
  { username: 'donero', password: 'ewedon', name: 'Don Romer', email: 'don@gmail.com' },
]

interface LoginModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [copiedUser, setCopiedUser] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const success = await login(username, password)
      if (success) {
        onOpenChange(false)
        // Reset form
        setUsername('')
        setPassword('')
        setError('')
      } else {
        setError('Invalid username or password')
      }
    } catch (err) {
      setError('Login failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDemoLogin = async (demoUsername: string, demoPassword: string) => {
    setUsername(demoUsername)
    setPassword(demoPassword)
    setError('')
    setIsSubmitting(true)

    try {
      const success = await login(demoUsername, demoPassword)
      if (success) {
        onOpenChange(false)
        // Reset form
        setUsername('')
        setPassword('')
        setError('')
      } else {
        setError('Demo login failed')
      }
    } catch (err) {
      setError('Demo login failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyCredentials = (user: typeof DEMO_USERS[0]) => {
    setUsername(user.username)
    setPassword(user.password)
    setCopiedUser(user.username)
    setTimeout(() => setCopiedUser(null), 1500)
  }

  const resetForm = () => {
    setUsername('')
    setPassword('')
    setError('')
    setCopiedUser(null)
  }

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      onOpenChange(newOpen)
      if (!newOpen) resetForm()
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Sign in to FakeStore
          </DialogTitle>
          <DialogDescription>
            Welcome back! Please sign in to your account to continue shopping.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isSubmitting}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-md">
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </Button>
        </form>

        {/* Demo Users Section */}
        <div className="mt-6">
          <div className="flex items-center justify-center mb-2">
            <div className="flex-1 border-t border-gray-200" />
            <span className="px-3 text-sm text-gray-500 bg-white">Demo Users (For Testing)</span>
            <div className="flex-1 border-t border-gray-200" />
          </div>

          <div className="text-xs text-center text-gray-500 mb-4">
            💡 These are real test users from the FakeStore API for demonstration purposes
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {DEMO_USERS.map((user) => (
              <Card
                key={user.username}
                className="cursor-pointer hover:bg-gray-50 transition-colors border border-gray-200"
              >
                <CardContent className="p-3">
                  {/* Three-row layout: name, credentials, actions */}
                  <div className="space-y-2">
                    {/* Row 1: Name */}
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-sm text-gray-900">{user.name}</div>
                      {copiedUser === user.username && (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                    {/* Row 2: Username / Password */}
                    <div className="text-xs text-gray-500 font-mono">
                      {user.username} / {user.password}
                    </div>
                    {/* Row 3: Actions aligned right */}
                    <div className="flex justify-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => copyCredentials(user)}
                        disabled={isSubmitting}
                        className="h-8 px-2 text-xs"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Fill
                      </Button>
                      <Button
                        type="button"
                        variant="default"
                        size="sm"
                        onClick={() => handleDemoLogin(user.username, user.password)}
                        disabled={isSubmitting}
                        className="h-8 px-2 text-xs"
                      >
                        Login
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 