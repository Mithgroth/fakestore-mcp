import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import React from 'react'
import { Mars, Venus, Gem, Smartphone, Shirt } from 'lucide-react'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Product sorting utilities
export type SortOption = 'none' | 'price-asc' | 'price-desc' | 'rating-asc' | 'rating-desc' | 'reviews-asc' | 'reviews-desc'

import { Product } from '@/lib/types'

export function sortProducts(products: Product[], sortOption: SortOption): Product[] {
  const sorted = [...products]
  
  switch (sortOption) {
    case 'rating-desc':
      return sorted.sort((a, b) => b.rating.rate - a.rating.rate)
    case 'rating-asc':
      return sorted.sort((a, b) => a.rating.rate - b.rating.rate)
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price)
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price)
    case 'reviews-desc':
      return sorted.sort((a, b) => b.rating.count - a.rating.count)
    case 'reviews-asc':
      return sorted.sort((a, b) => a.rating.count - b.rating.count)
    case 'none':
      return sorted
    default:
      return sorted
  }
}

// Category utilities
export interface CategoryInfo {
  name: string
  displayName: string
  icon: React.ReactNode
}

export const getCategoryInfo = (category: string): CategoryInfo => {
  switch (category.toLowerCase()) {
    case "men's clothing":
      return {
        name: category,
        displayName: "Men's Clothing",
        icon: <Mars className="h-4 w-4" style={{ color: '#0066CC' }} />
      }
    case "women's clothing":
      return {
        name: category,
        displayName: "Women's Clothing",
        icon: <Venus className="h-4 w-4" style={{ color: '#FF69B4' }} />
      }
    case "jewelery":
      return {
        name: category,
        displayName: "Jewelry",
        icon: <Gem className="h-4 w-4" />
      }
    case "electronics":
      return {
        name: category,
        displayName: "Electronics",
        icon: <Smartphone className="h-4 w-4" />
      }
    default:
      return {
        name: category,
        displayName: category,
        icon: <Shirt className="h-4 w-4" />
      }
  }
}

// For larger icons (used in main page category headers)
export const getCategoryInfoLarge = (category: string): CategoryInfo => {
  switch (category.toLowerCase()) {
    case "men's clothing":
      return {
        name: category,
        displayName: "Men's Clothing",
        icon: <Mars className="h-5 w-5" style={{ color: '#0066CC' }} />
      }
    case "women's clothing":
      return {
        name: category,
        displayName: "Women's Clothing",
        icon: <Venus className="h-5 w-5" style={{ color: '#FF69B4' }} />
      }
    case "jewelery":
      return {
        name: category,
        displayName: "Jewelry",
        icon: <Gem className="h-5 w-5" />
      }
    case "electronics":
      return {
        name: category,
        displayName: "Electronics",
        icon: <Smartphone className="h-5 w-5" />
      }
    default:
      return {
        name: category,
        displayName: category,
        icon: <Shirt className="h-5 w-5" />
      }
  }
}

// For small icons (used in product cards)
export const getCategoryInfoSmall = (category: string): CategoryInfo => {
  switch (category.toLowerCase()) {
    case "men's clothing":
      return {
        name: category,
        displayName: "Men's Clothing",
        icon: <Mars className="h-3 w-3" style={{ color: '#0066CC' }} />
      }
    case "women's clothing":
      return {
        name: category,
        displayName: "Women's Clothing",
        icon: <Venus className="h-3 w-3" style={{ color: '#FF69B4' }} />
      }
    case "jewelery":
      return {
        name: category,
        displayName: "Jewelry",
        icon: <Gem className="h-3 w-3" />
      }
    case "electronics":
      return {
        name: category,
        displayName: "Electronics",
        icon: <Smartphone className="h-3 w-3" />
      }
    default:
      return {
        name: category,
        displayName: category,
        icon: <Shirt className="h-3 w-3" />
      }
  }
} 