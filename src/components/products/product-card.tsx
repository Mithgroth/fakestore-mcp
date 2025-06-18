'use client'

import React from 'react'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, ShoppingCart } from 'lucide-react'

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
  const truncatedDescription = product.description.length > 100 
    ? product.description.substring(0, 100) + '...'
    : product.description

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="aspect-square relative overflow-hidden rounded-md bg-gray-50">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-contain p-4"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-2">
          <CardTitle className="text-sm font-medium line-clamp-2 flex-1">
            {product.title}
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {product.category}
          </Badge>
        </div>latest nextjs version 
        
        <CardDescription className="text-xs text-muted-foreground mb-3 line-clamp-3 flex-1">
          {truncatedDescription}
        </CardDescription>
        
        <div className="space-y-3 mt-auto">
          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium ml-1">
                {product.rating.rate.toFixed(1)}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              ({product.rating.count} reviews)
            </span>
          </div>
          
          {/* Price and Actions */}
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold">
              ${product.price.toFixed(2)}
            </span>
            <Button 
              size="sm" 
              onClick={() => onAddToCart?.(product)}
              className="text-xs"
            >
              <ShoppingCart className="h-3 w-3 mr-1" />
              Add to Cart
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 