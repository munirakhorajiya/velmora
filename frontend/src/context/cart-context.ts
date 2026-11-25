import { createContext, useContext } from 'react';

export interface CartItemState {
  id: string | number;
  name: string;
  price: number;
  image: string;
  color?: string;
  size?: string;
  quantity: number;
}

export interface CartContextType {
  cart: CartItemState[];
  addToCart: (item: { id: string | number; name: string; price: number | string; image?: string; main_image?: string }, quantity?: number, color?: string, size?: string) => void;
  removeFromCart: (id: string | number, color?: string) => void;
  updateQuantity: (id: string | number, quantity: number, color?: string) => void;
  clearCart: () => void;
  totalCount: number;
  totalAmount: number;
  isCartDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
