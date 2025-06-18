'use client'

import React, { useState, useEffect } from 'react'
import { ProductCard } from '@/components/products/product-card'
import { DemoInfoDialog } from '@/components/layout/demo-info-dialog'
import { useAuth } from '@/lib/auth-context'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Shirt, Gem, Smartphone, Mars, Venus } from 'lucide-react'

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

// Function to get category icon and display name
const getCategoryInfo = (category: string) => {
  switch (category.toLowerCase()) {
    case "men's clothing":
      return {
        displayName: "Men's Clothing",
        icon: (
          <div className="flex items-center gap-2">
            <Mars className="h-5 w-5" style={{ color: '#0066CC' }} />
            <Shirt className="h-5 w-5" />
          </div>
        )
      }
    case "women's clothing":
      return {
        displayName: "Women's Clothing",
        icon: (
          <div className="flex items-center gap-2">
            <Venus className="h-5 w-5" style={{ color: '#FF69B4' }} />
            <Shirt className="h-5 w-5" />
          </div>
        )
      }
    case "jewelery":
      return {
        displayName: "Jewelry",
        icon: <Gem className="h-5 w-5" />
      }
    case "electronics":
      return {
        displayName: "Electronics",
        icon: <Smartphone className="h-5 w-5" />
      }
    default:
      return {
        displayName: category,
        icon: <Shirt className="h-5 w-5" />
      }
  }
}

export default function Home() {
  const { user } = useAuth()
  const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
          
          const categoryInfo = getCategoryInfo(category)
          categoryGroupsData.push({
            name: category,
            displayName: categoryInfo.displayName,
            icon: categoryInfo.icon,
            products
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

      {/* Categories with Products */}
      {!loading && categoryGroups.length > 0 && (
        <div className="space-y-12">
          {categoryGroups.map((categoryGroup) => (
            <div key={categoryGroup.name} className="space-y-6">
              {/* Category Header */}
              <div className="flex items-center gap-3 border-b pb-3">
                {categoryGroup.icon}
                <h2 className="text-xl font-semibold tracking-tight">
                  {categoryGroup.displayName}
                </h2>
                <span className="text-sm text-muted-foreground ml-auto">
                  {categoryGroup.products.length} {categoryGroup.products.length === 1 ? 'item' : 'items'}
                </span>
              </div>
              
              {/* Products Grid for this Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {categoryGroup.products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && categoryGroups.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found.</p>
        </div>
      )}

      {/* Demo Info Dialog - Floating Button */}
      <DemoInfoDialog />
      
      {/* Footer - provides offset for scroll spy */}
      <Footer />
    </div>
  )
} 