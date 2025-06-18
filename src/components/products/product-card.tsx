'use client'

import React from 'react'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, ShoppingCart, Plus, Shirt, Gem, Smartphone, Mars, Venus } from 'lucide-react'

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

// Function to get category icon
const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case "men's clothing":
      return (
        <div className="flex items-center gap-1">
          <Mars className="h-3 w-3" style={{ color: '#0066CC' }} />
          <Shirt className="h-3 w-3" />
        </div>
      )
    case "women's clothing":
      return (
        <div className="flex items-center gap-1">
          <Venus className="h-3 w-3" style={{ color: '#FF69B4' }} />
          <Shirt className="h-3 w-3" />
        </div>
      )
    case "jewelery":
      return <Gem className="h-4 w-4" />
    case "electronics":
      return <Smartphone className="h-4 w-4" />
    default:
      return <Shirt className="h-4 w-4" />
  }
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const truncatedDescription = product.description.length > 100 
    ? product.description.substring(0, 100) + '...'
    : product.description

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
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
              {getCategoryIcon(product.category)}
            </div>
          </div>
        </div>
      </CardHeader>
      
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
          {/* Reserve space for remove button */}
          <div className="w-10">
            {/* Remove button will go here when item is in cart */}
          </div>
          
          {/* Centered Price */}
          <span className="text-lg font-bold flex-1 text-center">
            ${product.price.toFixed(2)}
          </span>
          
          {/* Add to Cart Button */}
          <Button 
            size="sm" 
            onClick={() => onAddToCart?.(product)}
            className="px-2 py-2 bg-green-600 hover:bg-green-700 gap-0"
            title="Add to Cart"
          >
            <Plus className="h-3 w-3" />
            <ShoppingCart className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 