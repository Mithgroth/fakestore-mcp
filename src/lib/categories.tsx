import React from 'react'
import { Mars, Venus, Gem, Smartphone, Shirt } from 'lucide-react'

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