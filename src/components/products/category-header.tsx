'use client'

import React from 'react'
import { ProductSort, SortOption } from './product-sort'

interface CategoryHeaderProps {
  icon: React.ReactNode
  displayName: string
  count: number
  sortValue: SortOption
  onSortChange: (value: SortOption) => void
}

export const CategoryHeader = React.forwardRef<
  HTMLDivElement,
  CategoryHeaderProps
>(({ icon, displayName, count, sortValue, onSortChange }, ref) => {
  return (
    <div className="flex items-center gap-3 border-b pb-3" ref={ref}>
      {icon}
      <h2 className="text-xl font-semibold tracking-tight">
        {displayName}
      </h2>
      <span className="text-muted-foreground mx-2">|</span>
      <ProductSort value={sortValue} onChange={onSortChange} />
      <span className="text-sm text-muted-foreground ml-auto">
        {count} {count === 1 ? 'item' : 'items'}
      </span>
    </div>
  )
})

CategoryHeader.displayName = 'CategoryHeader' 