'use client'

import React from 'react'

interface CategoryHeaderProps {
  icon: React.ReactNode
  displayName: string
  count: number
}

export const CategoryHeader = React.forwardRef<
  HTMLDivElement,
  CategoryHeaderProps
>(({ icon, displayName, count }, ref) => {
  return (
    <div
      className="flex items-center gap-3 border-b pb-3"
      ref={ref}
    >
      {icon}
      <h2 className="text-xl font-semibold tracking-tight">
        {displayName}
      </h2>
      <span className="text-sm text-muted-foreground ml-auto">
        {count} {count === 1 ? 'item' : 'items'}
      </span>
    </div>
  )
})

CategoryHeader.displayName = 'CategoryHeader' 