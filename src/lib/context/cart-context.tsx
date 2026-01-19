'use client'

import { createContext, useContext, useReducer, ReactNode, useEffect, useState } from 'react'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  variant?: string
  size?: string
  sync_variant_id?: number
}

interface CartState {
  items: CartItem[]
  total: number
}

interface CartContextType {
  items: CartItem[]
  total: number
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getItemCount: (id: string) => number
  isHydrated: boolean
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'HYDRATE'; payload: CartState }

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'savepoint-cart'

function loadCartFromStorage(): CartState {
  if (typeof window === 'undefined') {
    return { items: [], total: 0 }
  }
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (parsed.items && Array.isArray(parsed.items)) {
        return {
          items: parsed.items,
          total: calculateTotal(parsed.items),
        }
      }
    }
  } catch (error) {
    console.error('Error loading cart from storage:', error)
  }
  return { items: [], total: 0 }
}

function saveCartToStorage(state: CartState): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state))
  } catch (error) {
    console.error('Error saving cart to storage:', error)
  }
}

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0)
}

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'HYDRATE': {
      return action.payload
    }

    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        item => item.id === action.payload.id &&
                 (item.variant || '') === (action.payload.variant || '') &&
                 (item.size || '') === (action.payload.size || '')
      )

      if (existingItemIndex > -1) {
        const updatedItems = [...state.items]
        updatedItems[existingItemIndex].quantity += action.payload.quantity
        return {
          ...state,
          items: updatedItems,
          total: calculateTotal(updatedItems),
        }
      }

      const newItems = [...state.items, action.payload]
      return {
        ...state,
        items: newItems,
        total: calculateTotal(newItems),
      }
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload)
      return {
        ...state,
        items: newItems,
        total: calculateTotal(newItems),
      }
    }

    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        const newItems = state.items.filter(item => item.id !== action.payload.id)
        return {
          ...state,
          items: newItems,
          total: calculateTotal(newItems),
        }
      }

      const newItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      )
      return {
        ...state,
        items: newItems,
        total: calculateTotal(newItems),
      }
    }

    case 'CLEAR_CART':
      return {
        items: [],
        total: 0,
      }

    default:
      return state
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 })
  const [isHydrated, setIsHydrated] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = loadCartFromStorage()
    if (savedCart.items.length > 0) {
      dispatch({ type: 'HYDRATE', payload: savedCart })
    }
    setIsHydrated(true)
  }, [])

  // Save cart to localStorage whenever it changes (after hydration)
  useEffect(() => {
    if (isHydrated) {
      saveCartToStorage(state)
    }
  }, [state, isHydrated])

  const addItem = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: { ...item, quantity: item.quantity || 1 },
    })
  }

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
  }

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const getTotalItems = (): number => {
    return state.items.reduce((total, item) => total + item.quantity, 0)
  }

  const getItemCount = (id: string): number => {
    const item = state.items.find(item => item.id === id)
    return item ? item.quantity : 0
  }

  const value: CartContextType = {
    items: state.items,
    total: state.total,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems,
    getItemCount,
    isHydrated,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}