'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react'
import { CartItem, Product } from '@/lib/types'
import { useAuth } from '@/lib/auth-context'
import { mcpClient } from './mcp-client'

interface CartContextType {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  addItem: (product: Product, quantity?: number) => Promise<void>
  removeItem: (productId: number) => Promise<void>
  updateQuantity: (productId: number, quantity: number) => Promise<void>
  incrementQuantity: (productId: number) => Promise<void>
  decrementQuantity: (productId: number) => Promise<void>
  clearCart: () => Promise<void>
}

interface PendingUpdate {
  productId: number
  quantity: number
  timestamp: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const { user } = useAuth()
  
  // Debouncing state
  const pendingUpdatesRef = useRef<Map<number, PendingUpdate>>(new Map())
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const DEBOUNCE_DELAY = 800 // 800ms delay before syncing to server

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

  // Debounced server sync function
  const syncPendingUpdates = async () => {
    if (!user || pendingUpdatesRef.current.size === 0) return

    const updates = Array.from(pendingUpdatesRef.current.values())
    pendingUpdatesRef.current.clear()

    try {
      // Process all pending updates
      for (const update of updates) {
        if (update.quantity === 0) {
          await mcpClient.removeFromCart(update.productId)
        } else {
          // Remove existing entry first
          await mcpClient.removeFromCart(update.productId)
          // Add with new quantity
          await mcpClient.addToCart(update.productId, update.quantity)
        }
      }

      // Fetch latest state to ensure consistency
      const result = await mcpClient.getCart()
      if (result.success && result.cart) {
        const serverItems: CartItem[] = result.cart.items.map(item => ({ 
          product: item.product, 
          quantity: item.quantity 
        }))
        
        // Only update state if server data is different from current state
        // to prevent unnecessary re-renders and recommendation re-generations
        setItems(current => {
          if (current.length !== serverItems.length) {
            return serverItems
          }
          
          // Check if any items are different
          const isDifferent = current.some(currentItem => {
            const serverItem = serverItems.find(si => si.product.id === currentItem.product.id)
            return !serverItem || serverItem.quantity !== currentItem.quantity
          })
          
          return isDifferent ? serverItems : current
        })
      }
    } catch (err) {
      console.error('Failed to sync cart updates to server:', err)
      // Could implement retry logic or show user notification here
    }
  }

  // Schedule debounced sync
  const scheduleSync = () => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }
    debounceTimeoutRef.current = setTimeout(syncPendingUpdates, DEBOUNCE_DELAY)
  }

  const addItem = async (product: Product, quantity = 1) => {
    // Optimistic update - update UI immediately
    setItems(prev => {
      const index = prev.findIndex(item => item.product.id === product.id)
      if (index !== -1) {
        const updated = [...prev]
        updated[index].quantity += quantity
        return updated
      }
      return [...prev, { product, quantity }]
    })

    // Immediate server sync if user is logged in (no debounce)
    if (user) {
      try {
        const currentQuantity = items.find(item => item.product.id === product.id)?.quantity ?? 0
        const newQuantity = currentQuantity + quantity
        await mcpClient.addToCart(product.id, newQuantity)
      } catch (error) {
        console.error('Failed to sync cart to server:', error)
      }
    }
  }

  const removeItem = async (productId: number) => {
    // Optimistic update - update UI immediately
    setItems(prev => prev.filter(item => item.product.id !== productId))

    // Immediate server sync if user is logged in (no debounce)
    if (user) {
      try {
        await mcpClient.removeFromCart(productId)
      } catch (error) {
        console.error('Failed to remove item from server:', error)
      }
    }
  }

  const updateQuantity = async (productId: number, quantity: number) => {
    // Optimistic update - update UI immediately using functional update
    setItems(prev => {
      const updated = prev
        .map(item =>
          item.product.id === productId ? { ...item, quantity } : item
        )
        .filter(item => item.quantity > 0)
      return updated
    })

    // Immediate server sync if user is logged in (no debounce)
    if (user) {
      try {
        if (quantity === 0) {
          await mcpClient.removeFromCart(productId)
        } else {
          await mcpClient.addToCart(productId, quantity)
        }
      } catch (error) {
        console.error('Failed to sync cart to server:', error)
      }
    }
  }

  const incrementQuantity = async (productId: number) => {
    let newQuantity = 1
    
    // Optimistic update - update UI immediately using functional update
    setItems(prev => {
      const updated = prev.map(item => {
        if (item.product.id === productId) {
          newQuantity = item.quantity + 1
          return { ...item, quantity: newQuantity }
        }
        return item
      })
      return updated
    })

    // Schedule server sync if user is logged in
    if (user) {
      pendingUpdatesRef.current.set(productId, {
        productId,
        quantity: newQuantity,
        timestamp: Date.now()
      })
      scheduleSync()
    }
  }

  const decrementQuantity = async (productId: number) => {
    let newQuantity = 0
    
    // Optimistic update - update UI immediately using functional update
    setItems(prev => {
      const updated = prev
        .map(item => {
          if (item.product.id === productId) {
            newQuantity = item.quantity - 1
            return { ...item, quantity: newQuantity }
          }
          return item
        })
        .filter(item => item.quantity > 0)
      return updated
    })

    // Schedule server sync if user is logged in
    if (user) {
      pendingUpdatesRef.current.set(productId, {
        productId,
        quantity: newQuantity,
        timestamp: Date.now()
      })
      scheduleSync()
    }
  }

  const clearCart = async () => {
    // Optimistic update - clear UI immediately
    setItems([])

    // Clear pending updates since we're clearing everything
    pendingUpdatesRef.current.clear()
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }

    // Clear server cart if user is logged in
    if (user) {
      try {
        await mcpClient.clearCart()
      } catch (err) {
        console.error('Failed to clear server cart:', err)
      }
    }
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{ items, totalItems, totalPrice, addItem, removeItem, updateQuantity, incrementQuantity, decrementQuantity, clearCart }}
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