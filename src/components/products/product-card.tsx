'use client'

import React from 'react'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Star, Plus, Minus, ShoppingCart } from 'lucide-react'
import { getCategoryInfoSmall } from '@/lib/categories'
import { useAuth } from '@/lib/auth-context'
import { useCart } from '@/lib/cart-context'

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

interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { user } = useAuth()
  const { items, removeItem, incrementQuantity, decrementQuantity } = useCart()
  const cartItem = items.find(item => item.product.id === product.id)
  const inCart = !!cartItem

  const promptLogin = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('openLoginModal'))
    }
  }

  const handleAdd = () => {
    if (!user) {
      promptLogin()
    } else {
      onAddToCart?.(product)
    }
  }

  const handleIncrement = () => {
    if (!user) {
      promptLogin()
    } else if (cartItem) {
      void incrementQuantity(product.id)
    } else {
      onAddToCart?.(product)
    }
  }

  const handleMinus = () => {
    if (!user) {
      promptLogin()
    } else if (cartItem) {
      if (cartItem.quantity > 1) {
        void decrementQuantity(product.id)
      } else {
        void removeItem(product.id)
      }
    }
  }

  const truncatedDescription = product.description.length > 100 
    ? product.description.substring(0, 100) + '...'
    : product.description

  const categoryInfo = getCategoryInfoSmall(product.category)

  return (
    <Card className={`relative h-full flex flex-col hover:shadow-lg transition-shadow duration-300 ${inCart ? 'border-2 border-blue-300' : ''}`}>
      <CardHeader className="pb-0 p-0 bg-white">
        {/* Product Image with Overlays */}
        <div className="aspect-square relative overflow-hidden rounded-t-md bg-white">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-contain p-6"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Rating Overlay - Upper Left */}
          <div className="absolute top-0 left-0 bg-black/70 text-white rounded-br-full px-3 py-2">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium">
                {product.rating.rate.toFixed(1)}
              </span>
              <span className="text-xs text-gray-300">
                ({product.rating.count})
              </span>
            </div>
          </div>
          
          {/* Category Overlay - Top Right */}
          <div className="absolute top-0 right-0 bg-white/90 rounded-bl-full px-3 py-2">
            <div className="flex items-center justify-center text-gray-700">
              {categoryInfo.icon}
            </div>
          </div>
        </div>
      </CardHeader>
      {inCart && (
        <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
          {cartItem.quantity}
        </div>
      )}
      
      <CardContent className="flex-1 flex flex-col p-0 bg-gray-50">
        {/* Product Title */}
        <div className="px-4 pt-4 pb-2">
          <div className="h-10 overflow-hidden">
            <CardTitle className="text-sm font-medium leading-5 line-clamp-2">
              {product.title}
            </CardTitle>
          </div>
        </div>
        
        {/* Product Description */}
        <div className="px-4 pb-3 flex-1">
          <CardDescription className="text-xs text-muted-foreground line-clamp-3">
            {truncatedDescription}
          </CardDescription>
        </div>
        
        {/* Price and Cart Actions */}
        <div className="flex items-center justify-between px-4 pb-3">
          <div className="w-10 flex items-center justify-center">
            {inCart && (
              <Button
                size="sm"
                onClick={handleMinus}
                className="gap-0 px-2 py-2 bg-gray-600 hover:bg-gray-700"
                title={cartItem.quantity > 1 ? "Decrease quantity" : "Remove from Cart"}
              >
                <Minus className="h-3 w-3" />
                <ShoppingCart className="h-3 w-3" />
              </Button>
            )}
          </div>
          <span className="text-lg font-bold">
            ${product.price.toFixed(2)}
          </span>
          <div>
            {inCart ? (
              <Button
                size="sm"
                onClick={handleIncrement}
                className="gap-0 px-2 py-2 bg-green-600 hover:bg-green-700"
                title="Increase quantity"
              >
                <Plus className="h-3 w-3" />
                <ShoppingCart className="h-3 w-3" />
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleAdd}
                className="gap-0 px-2 py-2 bg-green-600 hover:bg-green-700"
                title="Add to Cart"
              >
                <Plus className="h-3 w-3" />
                <ShoppingCart className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 