'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { useScrollSpy } from '@/lib/scroll-spy-context'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ShoppingCart, User, LogOut, Menu, Store } from 'lucide-react'
import { getCategoryInfo } from '@/lib/utils'
import { LoginModal } from '@/components/auth/login-modal'
import { useCart } from '@/lib/cart-context'
import { CartModal } from '@/components/cart/cart-modal'
import { mcpClient } from '@/lib/mcp-client'

export function Header() {
  const { user, logout } = useAuth()
  const { activeSection, scrollToSection } = useScrollSpy()
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  useEffect(() => {
    const handler = () => setLoginModalOpen(true)
    window.addEventListener('openLoginModal', handler)
    return () => window.removeEventListener('openLoginModal', handler)
  }, [])
  const [cartModalOpen, setCartModalOpen] = useState(false)
  const { items } = useCart()

  // Fetch categories and icons
  const [categoryGroups, setCategoryGroups] = useState<any[]>([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await mcpClient.getCategories()
        if (result.success && result.categories) {
          setCategoryGroups(result.categories.map((name: string) => getCategoryInfo(name)))
        }
      } catch {}
    }
    fetchCategories()
  }, [])

  const handleCategoryClick = (name: string) => {
    scrollToSection(name)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <Store className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">FakeStore</span>
        </Link>

        {/* Category Buttons Bar - Centered */}
        <div className="flex-1 flex justify-center">
          {categoryGroups.length > 0 && (
            <div className="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent">
              {categoryGroups.map((category) => (
                <button
                  key={category.name}
                  onClick={() => handleCategoryClick(category.name)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-md border transition-colors whitespace-nowrap font-normal text-xs
                    ${activeSection === category.name ? 'bg-primary text-primary-foreground border-primary shadow' : 'bg-muted text-foreground border-muted-foreground/20 hover:bg-accent hover:text-accent-foreground'}`}
                  style={{ minWidth: 100 }}
                  type="button"
                >
                  {React.cloneElement(category.icon, { className: 'h-4 w-4' })}
                  <span>{category.displayName}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-3">
          {/* Cart */}
          <Button
            variant="outline"
            size="sm"
            className="relative"
            onClick={() => {
              if (user) setCartModalOpen(true)
              else setLoginModalOpen(true)
            }}
          >
            <ShoppingCart className="h-4 w-4" />
            <Badge className="absolute -top-2 -right-2 px-1 py-0 text-xs min-w-[20px] h-5 flex items-center justify-center">
              {items.length}
            </Badge>
          </Button>

          {user ? (
            <div className="flex items-center space-x-2">
              {/* User Avatar */}
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">
                  {user.name.firstname.charAt(0)}{user.name.lastname.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:inline text-sm font-medium">
                {user.name.firstname}
              </span>
              <Button variant="ghost" size="sm" onClick={logout} className="hover:bg-destructive/10">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-sm"
                onClick={() => setLoginModalOpen(true)}
              >
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Button>
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
                {/* No navigation links needed */}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      {/* Login Modal */}
      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
      {/* Cart Modal */}
      <CartModal open={cartModalOpen} onOpenChange={setCartModalOpen} />
    </header>
  )
} 