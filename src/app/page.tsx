'use client'

import React, { useState, useEffect, useRef } from 'react'
import { ProductGrid } from '@/components/products/product-grid'
import { DemoInfoDialog } from '@/components/layout/demo-info-dialog'
import { CategoryHeader } from '@/components/products/category-header'
import { useAuth } from '@/lib/auth-context'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { getCategoryInfoLarge } from '@/lib/categories'

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
}

export default function Home() {
  const { user } = useAuth()
  const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const categoryHeaderRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  useEffect(() => {
    const fetchProductsByCategories = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // First, get all categories
        const categoriesResponse = await fetch('https://fakestoreapi.com/products/categories')
        if (!categoriesResponse.ok) {
          throw new Error('Failed to fetch categories')
        }
        const categories = await categoriesResponse.json()
        
        // Then fetch products for each category
        const categoryGroupsData: CategoryGroup[] = []
        
        for (const category of categories) {
          const productsResponse = await fetch(`https://fakestoreapi.com/products/category/${category}`)
          if (!productsResponse.ok) {
            throw new Error(`Failed to fetch products for category: ${category}`)
          }
          const products = await productsResponse.json()
          
          const categoryInfo = getCategoryInfoLarge(category)
          categoryGroupsData.push({
            name: category,
            displayName: categoryInfo.displayName,
            icon: categoryInfo.icon,
            products
          })
        }
        
        setCategoryGroups(categoryGroupsData)
        // Set initial active category
        if (categoryGroupsData.length > 0) {
          setActiveCategory(categoryGroupsData[0].name)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products')
      } finally {
        setLoading(false)
      }
    }

    fetchProductsByCategories()
  }, [])

  // Scroll spy logic (use header refs)
  useEffect(() => {
    if (!categoryGroups.length) return
    const handleScroll = () => {
      let found = null
      for (const group of categoryGroups) {
        const headerRef = categoryHeaderRefs.current[group.name]
        if (headerRef) {
          const rect = headerRef.getBoundingClientRect()
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

  const handleAddToCart = (product: Product) => {
    // For now, just show an alert
    // Later we'll integrate with cart context
    alert(`Added "${product.title}" to cart!`)
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
            >
              <CategoryHeader
                ref={el => { categoryHeaderRefs.current[categoryGroup.name] = el; }}
                icon={categoryGroup.icon}
                displayName={categoryGroup.displayName}
                count={categoryGroup.products.length}
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