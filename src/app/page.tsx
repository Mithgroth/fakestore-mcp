'use client'

import React, { useState, useEffect, useRef } from 'react'
import { ProductGrid } from '@/components/products/product-grid'
import { DemoInfoDialog } from '@/components/layout/demo-info-dialog'
import { CategoryHeader } from '@/components/products/category-header'
import { useAuth } from '@/lib/auth-context'
import { useCart } from '@/lib/cart-context'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { getCategoryInfoLarge } from '@/lib/categories'
import { useScrollSpy } from '@/lib/scroll-spy-context'
import { SortOption } from '@/components/products/product-sort'
import { sortProducts } from '@/lib/product-utils'
import { mcpClient } from '@/lib/mcp-client'

interface Product {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating: {
    rate: number
    count: number
  }
}

interface CategoryGroup {
  name: string
  displayName: string
  icon: React.ReactNode
  products: Product[]
  originalProducts: Product[]
  sortOption: SortOption
}

export default function Home() {
  const { user } = useAuth()
  const { addItem } = useCart()
  const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { registerSection, unregisterSection } = useScrollSpy()
  const categoryHeaderRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const categoryContainerRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  // helper to prompt the login modal
  const promptLogin = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('openLoginModal'))
    }
  }

  useEffect(() => {
    const fetchProductsByCategories = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // First, get all categories using MCP client
        const categoriesResult = await mcpClient.getCategories()
        if (!categoriesResult.success || !categoriesResult.categories) {
          throw new Error('Failed to fetch categories')
        }
        const categories = categoriesResult.categories
        
        // Then fetch products for each category
        const categoryGroupsData: CategoryGroup[] = []
        
        for (const category of categories) {
          const productsResult = await mcpClient.getProducts(category)
          if (!productsResult.success || !productsResult.products) {
            throw new Error(`Failed to fetch products for category: ${category}`)
          }
          const products = productsResult.products as Product[]
          
          const categoryInfo = getCategoryInfoLarge(category)
          // Sort products by rating descending by default
          const sortedProducts = sortProducts(products, 'rating-desc')
          categoryGroupsData.push({
            name: category,
            displayName: categoryInfo.displayName,
            icon: categoryInfo.icon,
            products: sortedProducts,
            originalProducts: products,
            sortOption: 'rating-desc'
          })
        }
        
        setCategoryGroups(categoryGroupsData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products')
      } finally {
        setLoading(false)
      }
    }

    fetchProductsByCategories()
  }, [])

  // Register sections with ScrollSpy context
  useEffect(() => {
    categoryGroups.forEach(group => {
      const containerRef = categoryContainerRefs.current[group.name]
      if (containerRef) {
        registerSection(group.name, containerRef)
      }
    })

    return () => {
      categoryGroups.forEach(group => {
        unregisterSection(group.name)
      })
    }
  }, [categoryGroups, registerSection, unregisterSection])

  const handleSortChange = (categoryName: string, sortOption: SortOption) => {
    setCategoryGroups(prevGroups =>
      prevGroups.map(group => {
        if (group.name === categoryName) {
          const sortedProducts = sortProducts(group.originalProducts, sortOption)
          return {
            ...group,
            products: sortedProducts,
            sortOption
          }
        }
        return group
      })
    )
  }

  const handleAddToCart = (product: Product) => {
    if (!user) {
      promptLogin()
      return
    }
    addItem(product, 1)
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert className="max-w-md mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Loading State */}
      {loading && (
        <div className="space-y-8">
          {Array.from({ length: 4 }).map((_, categoryIndex) => (
            <div key={categoryIndex} className="space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-6 w-6" />
                <Skeleton className="h-6 w-32" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i} className="h-[400px]">
                    <CardContent className="p-4 space-y-3">
                      <Skeleton className="aspect-square w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-8 w-20" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Categories */}
      {!loading && categoryGroups.length > 0 && (
        <div className="space-y-12">
          {categoryGroups.map((categoryGroup) => (
            <div
              key={categoryGroup.name}
              className="scroll-mt-20 space-y-6"
              id={`category-${categoryGroup.name.replace(/\s+/g, '-').toLowerCase()}`}
              ref={el => { categoryContainerRefs.current[categoryGroup.name] = el; }}
            >
              <CategoryHeader
                ref={el => { categoryHeaderRefs.current[categoryGroup.name] = el; }}
                icon={categoryGroup.icon}
                displayName={categoryGroup.displayName}
                count={categoryGroup.products.length}
                sortValue={categoryGroup.sortOption}
                onSortChange={(sortOption) => handleSortChange(categoryGroup.name, sortOption)}
              />
              <ProductGrid products={categoryGroup.products} onAddToCart={handleAddToCart} />
            </div>
          ))}
        </div>
      )}
      
      {!loading && categoryGroups.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found.</p>
        </div>
      )}
      
      <DemoInfoDialog />      
      <Footer />
    </div>
  )
} 