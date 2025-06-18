import { SortOption } from '@/components/products/product-sort'

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