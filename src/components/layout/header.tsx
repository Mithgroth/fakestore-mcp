'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ShoppingCart, User, LogOut, Menu, Store } from 'lucide-react'
import { getCategoryInfo } from '@/lib/categories'

export function Header() {
  const { user, logout } = useAuth()

  // Category scroll spy logic
  const [categoryGroups, setCategoryGroups] = useState<any[]>([])
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  // Fetch categories and icons
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesResponse = await fetch('https://fakestoreapi.com/products/categories')
        if (!categoriesResponse.ok) throw new Error('Failed to fetch categories')
        const categories = await categoriesResponse.json()
        setCategoryGroups(categories.map((name: string) => getCategoryInfo(name)))
        if (categories.length > 0) setActiveCategory(categories[0])
      } catch {}
    }
    fetchCategories()
  }, [])

  // Scroll spy logic
  useEffect(() => {
    if (!categoryGroups.length) return
    const handleScroll = () => {
      let found = null
      for (const group of categoryGroups) {
        const el = document.getElementById(`category-${group.name.replace(/\s+/g, '-').toLowerCase()}`)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 80 && rect.bottom > 80) {
            found = group.name
            break
          }
        }
      }
      if (found && found !== activeCategory) {
        setActiveCategory(found)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [categoryGroups, activeCategory])

  const handleCategoryClick = (name: string) => {
    const el = document.getElementById(`category-${name.replace(/\s+/g, '-').toLowerCase()}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveCategory(name)
    }
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
                    ${activeCategory === category.name ? 'bg-primary text-primary-foreground border-primary shadow' : 'bg-muted text-foreground border-muted-foreground/20 hover:bg-accent hover:text-accent-foreground'}`}
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
                {/* No navigation links needed */}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
} 