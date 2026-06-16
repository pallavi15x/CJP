import { createContext, useContext, ReactNode, useCallback } from 'react';
import { useLocalStorage, generateId } from '../hooks';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  stock: number;
  rating: number;
  reviews: number;
}

interface CartItem extends Product {
  quantity: number;
  addedAt: string;
}

interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  createdAt: string;
  address: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  couponCode?: string;
  discount: number;
}

interface CartContextType {
  items: CartItem[];
  orders: Order[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  placeOrder: (address: Order['address'], couponCode?: string) => Order;
  getSavedItems: () => CartItem[];
  saveForLater: (productId: string) => void;
  moveToCart: (productId: string) => void;
  savedItems: CartItem[];
  applyCoupon: (code: string) => { success: boolean; discount: number; message: string };
  discount: number;
}

const coupons: Record<string, number> = {
  'CJP10': 10,
  'COCKROACH20': 20,
  'YOUTH2026': 15,
  'REBEL25': 25,
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export type { Product, CartItem, Order };

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useLocalStorage<CartItem[]>('cjp_cart', []);
  const [savedItems, setSavedItems] = useLocalStorage<CartItem[]>('cjp_saved_items', []);
  const [orders, setOrders] = useLocalStorage<Order[]>('cjp_orders', []);
  const [appliedCoupon, setAppliedCoupon] = useLocalStorage<string | null>('cjp_coupon', null);

  const addToCart = useCallback((product: Product) => {
    setItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: Math.min(item.quantity + 1, product.stock || 10) } : item
        );
      }
      return [...prev, { ...product, quantity: 1, addedAt: new Date().toISOString() }];
    });
  }, [setItems]);

  const removeFromCart = useCallback((productId: string) => {
    setItems(prev => prev.filter(item => item.id !== productId));
  }, [setItems]);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity: Math.min(quantity, item.stock || 10) } : item
      )
    );
  }, [setItems, removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
    setAppliedCoupon(null);
  }, [setItems, setAppliedCoupon]);

  const saveForLater = useCallback((productId: string) => {
    const item = items.find(i => i.id === productId);
    if (item) {
      setSavedItems(prev => [...prev, item]);
      removeFromCart(productId);
    }
  }, [items, setSavedItems, removeFromCart]);

  const moveToCart = useCallback((productId: string) => {
    const item = savedItems.find(i => i.id === productId);
    if (item) {
      setItems(prev => {
        const existing = prev.find(i => i.id === productId);
        if (existing) {
          return prev.map(i => i.id === productId ? { ...i, quantity: i.quantity + 1 } : i);
        }
        return [...prev, item];
      });
      setSavedItems(prev => prev.filter(i => i.id !== productId));
    }
  }, [savedItems, setSavedItems, setItems]);

  const placeOrder = useCallback((address: Order['address'], couponCode?: string): Order => {
    const discount = couponCode && coupons[couponCode] ? coupons[couponCode] : 0;
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discountAmount = Math.round((subtotal * discount) / 100);

    const order: Order = {
      id: generateId(),
      items: [...items],
      total: subtotal - discountAmount,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      address,
      couponCode,
      discount: discountAmount,
    };

    setOrders(prev => [order, ...prev]);
    clearCart();
    return order;
  }, [items, setOrders, clearCart]);

  const applyCoupon = useCallback((code: string): { success: boolean; discount: number; message: string } => {
    const discount = coupons[code.toUpperCase()];
    if (discount) {
      setAppliedCoupon(code.toUpperCase());
      return { success: true, discount, message: `Coupon applied! ${discount}% off` };
    }
    return { success: false, discount: 0, message: 'Invalid coupon code' };
  }, [setAppliedCoupon]);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = appliedCoupon && coupons[appliedCoupon] ? Math.round((subtotal * coupons[appliedCoupon]) / 100) : 0;

  return (
    <CartContext.Provider value={{
      items,
      orders,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      total: subtotal - discount,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      placeOrder,
      getSavedItems: () => savedItems,
      saveForLater,
      moveToCart,
      savedItems,
      applyCoupon,
      discount,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
