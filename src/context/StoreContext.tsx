import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { CartItem, MenuItem, Address, UserContact, Order, PaymentMethod, PaymentTiming, DeliveryMethod } from '../types';
import { useAuth } from './AuthContext';

interface StoreContextType {
  // Cart
  cart: CartItem[];
  currentRestaurantId: string | null;
  addToCart: (item: MenuItem, restaurantId: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;

  // Checkout Info
  deliveryInfo: {
    address: Address;
    contact: UserContact;
  };
  setDeliveryInfo: (info: { address: Address; contact: UserContact }) => void;
  placeOrder: (paymentTiming: PaymentTiming, paymentMethod: PaymentMethod, deliveryMethod: DeliveryMethod, finalDeliveryFee: number) => Promise<void>;
  lastOrder: Order | null;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile } = useAuth();

  const storeUser = useMemo(() => {
    if (!user) return null;
    return {
      id: user.id,
      email: user.email || '',
      name: user.user_metadata?.name || profile?.first_name || user.email || 'User',
      phone: profile?.phone
    };
  }, [user, profile]);

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentRestaurantId, setCurrentRestaurantId] = useState<string | null>(null);
  const [deliveryInfo, setDeliveryInfoState] = useState<{ address: Address; contact: UserContact }>({
    address: { street: '', city: '', zipCode: '' },
    contact: { name: '', phone: '' },
  });
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  // Load Cart from local storage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('freebite_cart');
      if (savedCart) setCart(JSON.parse(savedCart));
      const savedRest = localStorage.getItem('freebite_rest');
      if (savedRest) setCurrentRestaurantId(savedRest);
    } catch (e) {
      console.error("Failed to load local storage", e);
    }
  }, []);

  // Save Cart to local storage
  useEffect(() => {
    localStorage.setItem('freebite_cart', JSON.stringify(cart));
    localStorage.setItem('freebite_rest', currentRestaurantId || '');
  }, [cart, currentRestaurantId]);

  // Pre-fill contact info from profile
  useEffect(() => {
    if (profile) {
      setDeliveryInfoState(prev => ({
        ...prev,
        contact: {
          name: `${profile.first_name} ${profile.last_name}`,
          phone: profile.phone
        }
      }));
    }
  }, [profile]);

  // Cart Methods
  const addToCart = (item: MenuItem, restaurantId: string) => {
    if (currentRestaurantId && currentRestaurantId !== restaurantId) {
      const confirmSwitch = window.confirm("Start a new basket? Adding this item will clear your current basket from another restaurant.");
      if (confirmSwitch) {
        setCart([]);
        setCurrentRestaurantId(restaurantId);
      } else {
        return;
      }
    } else if (!currentRestaurantId) {
      setCurrentRestaurantId(restaurantId);
    }

    setCart((prev) => {
      const existing = prev.find((ci) => ci.menuItem.id === item.id);
      if (existing) {
        return prev.map((ci) =>
          ci.menuItem.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [...prev, { menuItem: item, quantity: 1, restaurantId }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((ci) => ci.menuItem.id !== itemId));
    if (cart.length === 1) setCurrentRestaurantId(null);
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart((prev) => {
      return prev.map((ci) => {
        if (ci.menuItem.id === itemId) {
          const newQty = ci.quantity + delta;
          return newQty > 0 ? { ...ci, quantity: newQty } : ci;
        }
        return ci;
      });
    });
  };

  const clearCart = () => {
    setCart([]);
    setCurrentRestaurantId(null);
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.menuItem.price * item.quantity, 0);
  }, [cart]);

  const cartCount = useMemo(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  const setDeliveryInfo = (info: { address: Address; contact: UserContact }) => {
    setDeliveryInfoState(info);
  };

  const placeOrder = async (
    paymentTiming: PaymentTiming,
    paymentMethod: PaymentMethod,
    deliveryMethod: DeliveryMethod,
    finalDeliveryFee: number
  ) => {
    // Simulate API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const order: Order = {
          restaurantId: currentRestaurantId!,
          items: [...cart],
          subtotal: cartTotal,
          deliveryFee: finalDeliveryFee,
          total: cartTotal + finalDeliveryFee,
          address: deliveryInfo.address,
          contact: deliveryInfo.contact,
          paymentTiming,
          paymentMethod,
          deliveryMethod,
          status: 'confirmed',
          createdAt: new Date().toISOString(),
          userId: user?.id
        };
        setLastOrder(order);
        clearCart();
        resolve();
      }, 1500);
    });
  };

  return (
    <StoreContext.Provider
      value={{
        cart,
        currentRestaurantId,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        deliveryInfo,
        setDeliveryInfo,
        placeOrder,
        lastOrder,
        user: storeUser,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
