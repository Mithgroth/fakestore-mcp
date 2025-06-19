'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Product, CartItem } from '@/lib/types'
import { useAuth } from '@/lib/auth-context'
import { mcpClient } from './mcp-client'

interface CartContextType {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const { user } = useAuth()

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('cart')
      if (stored) {
        setItems(JSON.parse(stored))
      }
    } catch {}
  }, [])

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(items))
    } catch {}
  }, [items])

  // Sync with server cart on login/logout
  useEffect(() => {
    // If no user, clear local cart
    if (!user) {
      setItems([])
      return
    }
    // Fetch latest cart for logged-in user using MCP client
    const fetchCart = async () => {
      try {
        const result = await mcpClient.getCart()
        if (result.success && result.cart) {
          // Convert MCP cart items to local cart items
          const serverItems: CartItem[] = result.cart.items.map((item: CartItem) => ({
            product: item.product,
            quantity: item.quantity
          }))
          setItems(serverItems)
        }
      } catch (err) {
        console.error('Failed to load server cart:', err)
      }
    }
    fetchCart()
  }, [user])

  const addItem = (product: Product, quantity = 1) => {
    setItems(prev => {
      const index = prev.findIndex(item => item.product.id === product.id)
      if (index !== -1) {
        const updated = [...prev]
        updated[index].quantity += quantity
        return updated
      }
      return [...prev, { product, quantity }]
    })
  }

  const removeItem = (productId: number) => {
    setItems(prev => prev.filter(item => item.product.id !== productId))
  }

  const updateQuantity = (productId: number, quantity: number) => {
    setItems(prev =>
      prev
        .map(item =>
          item.product.id === productId ? { ...item, quantity } : item
        )
        .filter(item => item.quantity > 0)
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{ items, totalItems, totalPrice, addItem, removeItem, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
} 