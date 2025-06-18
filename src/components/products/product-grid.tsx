'use client'

import React, { useState, useEffect } from 'react'
import { ProductCard } from './product-card'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

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

interface ProductGridProps {
  limit?: number
  category?: string
  products?: Product[]
  onAddToCart?: (product: Product) => void
}

export function ProductGrid({ limit = 20, category, products: propProducts, onAddToCart }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>(propProducts || [])
  const [loading, setLoading] = useState<boolean>(propProducts ? false : true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (propProducts) {
      setProducts(propProducts)
      setLoading(false)
      setError(null)
      return
    }
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        
        let url = 'https://fakestoreapi.com/products'
        if (category) {
          url += `/category/${category}`
        }
        if (limit && !category) {
          url += `?limit=${limit}`
        }

        const response = await fetch(url)
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        
        const data = await response.json()
        setProducts(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [limit, category, propProducts])

  const handleAddToCartInternal = (product: Product) => {
    if (onAddToCart) {
      onAddToCart(product)
    } else {
    alert(`Added "${product.title}" to cart!`)
    }
  }

  if (error) {
    return (
      <Alert className="max-w-md mx-auto">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error}. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
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
      )}

      {/* Products Grid */}
      {!loading && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCartInternal}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found.</p>
        </div>
      )}
    </div>
  )
} 