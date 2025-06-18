'use client'

import React from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ShoppingCart, User, LogOut, Menu, Store } from 'lucide-react'

export function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <Store className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">FakeStore</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
            Products
          </Link>
          <Link href="/categories" className="text-sm font-medium transition-colors hover:text-primary">
            Categories
          </Link>
        </nav>

        {/* User Actions */}
        <div className="flex items-center space-x-3">
          {/* Cart */}
          <Button variant="outline" size="sm" className="relative">
            <ShoppingCart className="h-4 w-4" />
            <Badge className="absolute -top-2 -right-2 px-1 py-0 text-xs min-w-[20px] h-5 flex items-center justify-center">
              0
            </Badge>
          </Button>

          {user ? (
            <div className="flex items-center space-x-2">
              {/* User Avatar */}
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">
                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:inline text-sm font-medium">
                {user.firstName}
              </span>
              <Button variant="ghost" size="sm" onClick={logout} className="hover:bg-destructive/10">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/login">
                <Button variant="outline" size="sm" className="text-sm">
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="md:hidden">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle className="flex items-center space-x-2">
                  <Store className="h-5 w-5" />
                  <span>FakeStore</span>
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <Link href="/" className="block text-sm font-medium py-2 hover:text-primary">
                  Products
                </Link>
                <Link href="/categories" className="block text-sm font-medium py-2 hover:text-primary">
                  Categories
                </Link>
                {!user && (
                  <Link href="/login" className="block text-sm font-medium py-2 hover:text-primary">
                    Login
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
} 