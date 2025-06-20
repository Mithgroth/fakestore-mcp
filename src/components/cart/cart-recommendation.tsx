'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useCart } from '@/lib/cart-context'
import { mcpClient } from '@/lib/mcp-client' 
import { Product } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Plus, Star } from 'lucide-react'

interface CartRecommendationProps {
  className?: string
}

export function CartRecommendation({ className }: CartRecommendationProps) {
  const { items, addItem } = useCart()
  const [recommendation, setRecommendation] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState(false)
  const previousProductIdsRef = useRef<Set<number>>(new Set())

  useEffect(() => {
    const currentProductIds = new Set(items.map(item => item.product.id))
    const previousProductIds = previousProductIdsRef.current
    
    // Check if a new product was added (not just quantity changes or removals)
    const hasNewProduct = Array.from(currentProductIds).some(id => !previousProductIds.has(id))
    
    // Update the ref for next comparison
    previousProductIdsRef.current = currentProductIds
    
    const fetchRecommendation = async () => {
      try {
        setLoading(true)
        
        // Get all products
        const result = await mcpClient.getProducts()
        if (!result.success || !result.products) {
          return
        }

        // Filter products not in cart
        const availableProducts = result.products.filter(
          product => !currentProductIds.has(product.id)
        )

        // Select a random product from available ones
        if (availableProducts.length > 0) {
          const randomIndex = Math.floor(Math.random() * availableProducts.length)
          setRecommendation(availableProducts[randomIndex])
        } else {
          setRecommendation(null)
        }
      } catch (error) {
        console.error('Failed to fetch recommendation:', error)
      } finally {
        setLoading(false)
      }
    }

    // Only fetch recommendations when:
    // 1. We have items in cart AND
    // 2. A new product was added (not just quantity changes or removals)
    if (items.length > 0 && (hasNewProduct || previousProductIds.size === 0)) {
      fetchRecommendation()
    } else if (items.length === 0) {
      // Clear recommendation when cart is empty
      setLoading(false)
      setRecommendation(null)
    }
  }, [items])

  const handleAddToCart = async () => {
    if (!recommendation) return
    
    try {
      setAddingToCart(true)
      await addItem(recommendation, 1)
    } catch (error) {
      console.error('Failed to add recommendation to cart:', error)
    } finally {
      setAddingToCart(false)
    }
  }

  // Don't show if cart is empty or no recommendation
  if (items.length === 0 || loading || !recommendation) {
    return null
  }

  return (
    <div className={`border rounded-lg p-3 bg-gradient-to-r from-blue-50 to-indigo-50 ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        <Star className="h-4 w-4 text-amber-500" fill="currentColor" />
        <span className="text-sm font-medium text-gray-700">You might also like</span>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 flex-shrink-0 flex items-center justify-center overflow-hidden bg-white rounded border">
          <img
            src={recommendation.image}
            alt={recommendation.title}
            className="max-h-full max-w-full"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-gray-900 leading-tight">
            {recommendation.title}
          </p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="text-sm font-semibold text-green-600 flex-shrink-0">
              ${recommendation.price.toFixed(2)}
            </span>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Star className="h-3 w-3 text-amber-400" fill="currentColor" />
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {recommendation.rating.rate} ({recommendation.rating.count})
              </span>
            </div>
          </div>
        </div>
        
        <Button
          size="sm"
          onClick={handleAddToCart}
          disabled={addingToCart}
          className="flex-shrink-0"
        >
          <Plus className="h-4 w-4 mr-1" />
          {addingToCart ? 'Adding...' : 'Add'}
        </Button>
      </div>
    </div>
  )
} 