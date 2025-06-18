'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Star, DollarSign, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react'

export type SortOption = 'rating-desc' | 'rating-asc' | 'price-desc' | 'price-asc' | 'reviews-desc' | 'reviews-asc' | 'none'

interface ProductSortProps {
  value: SortOption
  onChange: (value: SortOption) => void
}

type SortType = 'rating' | 'price' | 'reviews'
type SortDirection = 'desc' | 'asc' | 'none'

function getSortState(value: SortOption, type: SortType): SortDirection {
  if (value === 'none') return 'none'
  if (value.startsWith(type)) {
    return value.endsWith('desc') ? 'desc' : 'asc'
  }
  return 'none'
}

function getNextSortOption(currentValue: SortOption, type: SortType): SortOption {
  const currentState = getSortState(currentValue, type)
  
  switch (currentState) {
    case 'none':
      return `${type}-desc` as SortOption
    case 'desc':
      return `${type}-asc` as SortOption
    case 'asc':
      return 'none'
    default:
      return 'none'
  }
}

function SortButton({ 
  type, 
  icon: Icon, 
  label, 
  currentValue, 
  onChange 
}: { 
  type: SortType
  icon: React.ComponentType<{ className?: string }>
  label: string
  currentValue: SortOption
  onChange: (value: SortOption) => void
}) {
  const state = getSortState(currentValue, type)
  const isActive = state !== 'none'
  
  const handleClick = () => {
    const nextOption = getNextSortOption(currentValue, type)
    onChange(nextOption)
  }

  const getDirectionIcon = () => {
    if (state === 'desc') return <ChevronDown className="h-3 w-3" />
    if (state === 'asc') return <ChevronUp className="h-3 w-3" />
    return null
  }

  return (
    <Button
      variant={isActive ? "default" : "ghost"}
      size="sm"
      onClick={handleClick}
      className="h-7 px-2 text-xs gap-1"
    >
      <Icon className="h-3 w-3" />
      <span>{label}</span>
      {getDirectionIcon()}
    </Button>
  )
}

export function ProductSort({ value, onChange }: ProductSortProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground font-medium">Sort by:</span>
      <div className="flex items-center gap-1">
        <SortButton
          type="rating"
          icon={Star}
          label="Rating"
          currentValue={value}
          onChange={onChange}
        />
        <SortButton
          type="price"
          icon={DollarSign}
          label="Price"
          currentValue={value}
          onChange={onChange}
        />
        <SortButton
          type="reviews"
          icon={MessageSquare}
          label="Reviews"
          currentValue={value}
          onChange={onChange}
        />
      </div>
    </div>
  )
} 