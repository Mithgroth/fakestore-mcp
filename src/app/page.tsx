'use client'

import React from 'react'
import { ProductGrid } from '@/components/products/product-grid'
import { DemoInfoDialog } from '@/components/layout/demo-info-dialog'
import { useAuth } from '@/lib/auth-context'

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Simple Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Products
            </h1>
            <p className="text-muted-foreground mt-1">
              Discover amazing products from our collection
            </p>
          </div>
          
          {user && (
            <div className="text-sm text-muted-foreground">
              Welcome back, <span className="font-medium">{user.firstName}</span>
            </div>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <ProductGrid limit={20} />

      {/* Demo Info Dialog - Floating Button */}
      <DemoInfoDialog />
    </div>
  )
} 