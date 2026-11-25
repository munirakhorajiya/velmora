import { useState, useEffect, type ReactNode } from 'react';
import { useAuth } from './auth-context';
import { toast } from 'sonner';
import type { UserProfile } from '../api/types';
import { CartContext, type CartItemState } from './cart-context';

function getStorageKey(u: UserProfile | null): string | null {
  if (!u) return null;
  return `velmora_cart_${u.id || u.email || 'user'}`;
}

function loadUserCart(u: UserProfile | null, isAuthenticated: boolean): CartItemState[] {
  if (!isAuthenticated || !u) return [];
  const key = getStorageKey(u);
  if (!key) return [];
  try {
    const saved = localStorage.getItem(key);
    return saved ? (JSON.parse(saved) as CartItemState[]) : [];
  } catch {
    return [];
  }
}

function CartProviderInner({
  children,
  user,
  isAuthenticated,
}: {
  children: ReactNode;
  user: UserProfile | null;
  isAuthenticated: boolean;
}) {
  const [cart, setCart] = useState<CartItemState[]>(() => loadUserCart(user, isAuthenticated));
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Clean up legacy global guest key on mount
  useEffect(() => {
    try {
      localStorage.removeItem('velmora_cart');
    } catch {
      // ignore
    }
  }, []);

  // Persist cart changes strictly to this user's storage
  useEffect(() => {
    if (isAuthenticated && user) {
      const key = getStorageKey(user);
      if (key) {
        try {
          localStorage.setItem(key, JSON.stringify(cart));
        } catch {
          // ignore
        }
      }
    }
  }, [cart, isAuthenticated, user]);

  const addToCart = (
    item: { id: string | number; name: string; price: number | string; image?: string; main_image?: string },
    quantity = 1,
    color = 'Black',
    size = 'One Size'
  ) => {
    if (!isAuthenticated || !user) {
      toast.error('Please sign in to your Velmora account to add pieces to your shopping bag.');
      setIsCartDrawerOpen(true);
      return;
    }

    const numPrice = typeof item.price === 'string' ? parseFloat(item.price) || 0 : item.price;
    const imgUrl = item.image || item.main_image || '/media/editorial/cat_shoulder.jpg';

    setCart((prev) => {
      const existing = prev.find((i) => String(i.id) === String(item.id) && i.color === color);
      if (existing) {
        return prev.map((i) =>
          String(i.id) === String(item.id) && i.color === color
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [
        ...prev,
        {
          id: item.id,
          name: item.name,
          price: numPrice,
          image: imgUrl,
          color,
          size,
          quantity,
        },
      ];
    });
    setIsCartDrawerOpen(true);
  };

  const removeFromCart = (id: string | number, color?: string) => {
    if (!isAuthenticated || !user) return;
    setCart((prev) =>
      prev.filter((item) => !(String(item.id) === String(id) && (!color || item.color === color)))
    );
  };

  const updateQuantity = (id: string | number, quantity: number, color?: string) => {
    if (!isAuthenticated || !user) return;
    if (quantity <= 0) {
      removeFromCart(id, color);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        String(item.id) === String(id) && (!color || item.color === color)
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    if (isAuthenticated && user) {
      const key = getStorageKey(user);
      if (key) {
        try {
          localStorage.removeItem(key);
        } catch {
          // ignore
        }
      }
    }
  };

  const openDrawer = () => setIsCartDrawerOpen(true);
  const closeDrawer = () => setIsCartDrawerOpen(false);

  const totalCount = isAuthenticated && user ? cart.reduce((sum, item) => sum + item.quantity, 0) : 0;
  const totalAmount = isAuthenticated && user ? cart.reduce((sum, item) => sum + item.price * item.quantity, 0) : 0;

  return (
    <CartContext.Provider
      value={{
        cart: isAuthenticated && user ? cart : [],
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalCount,
        totalAmount,
        isCartDrawerOpen,
        openDrawer,
        closeDrawer,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  const userKey = isAuthenticated && user ? String(user.id || user.email || 'user') : 'guest';

  return (
    <CartProviderInner key={userKey} user={user} isAuthenticated={isAuthenticated}>
      {children}
    </CartProviderInner>
  );
};
