'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

// Wishlist Item
export interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  category: string;
  addedAt: number;
}

// Wishlist State
interface WishlistState {
  items: WishlistItem[];
  isLoaded: boolean;
}

// Wishlist Actions
type WishlistAction =
  | { type: 'ADD_ITEM'; payload: WishlistItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_WISHLIST' }
  | { type: 'LOAD_WISHLIST'; payload: WishlistItem[] };

// Initial State
const initialState: WishlistState = {
  items: [],
  isLoaded: false,
};

// Reducer
function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case 'ADD_ITEM': {
      // Check if already exists
      const exists = state.items.some(item => item.productId === action.payload.productId);
      if (exists) return state;
      return { ...state, items: [...state.items, action.payload] };
    }

    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter(item => item.productId !== action.payload),
      };
    }

    case 'CLEAR_WISHLIST':
      return { ...state, items: [] };

    case 'LOAD_WISHLIST':
      return { ...state, items: action.payload, isLoaded: true };

    default:
      return state;
  }
}

// Context Types
interface WishlistContextType {
  items: WishlistItem[];
  addItem: (item: Omit<WishlistItem, 'id' | 'addedAt'>) => void;
  removeItem: (productId: string) => void;
  toggleItem: (item: Omit<WishlistItem, 'id' | 'addedAt'>) => boolean;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  itemCount: number;
}

// Create Context
const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

// Storage Key
const WISHLIST_STORAGE_KEY = 'prakash-duo-wishlist';

// Provider Component
export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          dispatch({ type: 'LOAD_WISHLIST', payload: parsed });
        } else {
          dispatch({ type: 'LOAD_WISHLIST', payload: [] });
        }
      } else {
        dispatch({ type: 'LOAD_WISHLIST', payload: [] });
      }
    } catch {
      dispatch({ type: 'LOAD_WISHLIST', payload: [] });
    }
  }, []);

  // Save wishlist to localStorage whenever items change
  useEffect(() => {
    if (state.isLoaded) {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(state.items));
    }
  }, [state.items, state.isLoaded]);

  // Generate unique ID
  const generateId = useCallback(() => {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }, []);

  // Actions
  const addItem = useCallback((item: Omit<WishlistItem, 'id' | 'addedAt'>) => {
    const wishlistItem: WishlistItem = {
      ...item,
      id: generateId(),
      addedAt: Date.now(),
    };
    dispatch({ type: 'ADD_ITEM', payload: wishlistItem });
  }, [generateId]);

  const removeItem = useCallback((productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  }, []);

  const isInWishlist = useCallback((productId: string) => {
    return state.items.some(item => item.productId === productId);
  }, [state.items]);

  // Toggle and return whether item is now in wishlist
  const toggleItem = useCallback((item: Omit<WishlistItem, 'id' | 'addedAt'>) => {
    const exists = state.items.some(i => i.productId === item.productId);
    if (exists) {
      dispatch({ type: 'REMOVE_ITEM', payload: item.productId });
      return false;
    } else {
      const wishlistItem: WishlistItem = {
        ...item,
        id: generateId(),
        addedAt: Date.now(),
      };
      dispatch({ type: 'ADD_ITEM', payload: wishlistItem });
      return true;
    }
  }, [state.items, generateId]);

  const clearWishlist = useCallback(() => {
    dispatch({ type: 'CLEAR_WISHLIST' });
  }, []);

  const itemCount = state.items.length;

  const value: WishlistContextType = {
    items: state.items,
    addItem,
    removeItem,
    toggleItem,
    isInWishlist,
    clearWishlist,
    itemCount,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

// Custom Hook
export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
