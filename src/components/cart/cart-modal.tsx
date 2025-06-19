'use client'

import React from 'react'
import { useCart } from '@/lib/cart-context'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Plus, Minus } from 'lucide-react'

interface CartModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CartModal({ open, onOpenChange }: CartModalProps) {
  const { user } = useAuth()
  const router = useRouter()
  const { items, totalItems, totalPrice, removeItem, updateQuantity, clearCart } = useCart()

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (open && !user) {
      onOpenChange(false)
      router.push('/login')
    }
  }, [open, user, onOpenChange, router])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Shopping Cart</DialogTitle>
        </DialogHeader>

        {items.length === 0 ? (
          <p className="py-8 text-center text-gray-500">Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {items.map(item => (
              <div key={item.product.id} className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 flex-shrink-0 flex items-center justify-center overflow-hidden bg-gray-100 rounded">
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="max-h-full max-w-full"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{item.product.title}</p>
                    <p className="text-xs text-gray-500">${item.product.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-sm">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(item.product.id)}
                    className="text-red-500 hover:bg-red-50"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}

            <div className="border-t mt-4 pt-4 space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Total ({totalItems} items):</span>
                <span className="font-medium">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={clearCart} size="sm">
                  Clear Cart
                </Button>
                <Button size="sm">
                  Checkout
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 