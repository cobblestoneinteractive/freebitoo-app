import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react'
import { CartItem, Product } from '../types'

interface CartContextType {
  items: CartItem[]
  shopId: string | null
  total: number
  count: number
  addItem: (product: Product, shopId: string) => void
  removeItem: (productId: string) => void
  updateQty: (productId: string, delta: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType>({} as CartContextType)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [shopId, setShopId] = useState<string | null>(null)

  const addItem = useCallback(
    (product: Product, sid: string) => {
      if (shopId && shopId !== sid) {
        setItems([{ product, quantity: 1 }])
        setShopId(sid)
        return
      }
      setShopId(sid)
      setItems(prev => {
        const existing = prev.find(i => i.product.id === product.id)
        if (existing)
          return prev.map(i =>
            i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
          )
        return [...prev, { product, quantity: 1 }]
      })
    },
    [shopId]
  )

  const removeItem = useCallback((productId: string) => {
    setItems(prev => {
      const next = prev.filter(i => i.product.id !== productId)
      if (next.length === 0) setShopId(null)
      return next
    })
  }, [])

  const updateQty = useCallback((productId: string, delta: number) => {
    setItems(prev => {
      const next = prev
        .map(i =>
          i.product.id === productId
            ? { ...i, quantity: Math.max(0, i.quantity + delta) }
            : i
        )
        .filter(i => i.quantity > 0)
      if (next.length === 0) setShopId(null)
      return next
    })
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
    setShopId(null)
  }, [])

  const total = items.reduce((sum, i) => sum + i.product.price_cents * i.quantity, 0)
  const count = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider
      value={{ items, shopId, total, count, addItem, removeItem, updateQty, clearCart }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
