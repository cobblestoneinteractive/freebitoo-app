
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  tags?: string[];
  imageUrl?: string;
  categoryId: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Restaurant {
  id: string;
  slug: string;
  name: string;
  description: string;
  cuisineType: string;
  rating: number;
  deliveryTimeRange: string; // e.g., "20-30 min"
  deliveryFee: number;
  imageUrl: string;
  address: string;
  categories: Category[];
  menu: MenuItem[];
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  restaurantId: string;
}

export interface Address {
  street: string;
  city: string;
  zipCode: string;
  instructions?: string;
}

export interface UserContact {
  name: string;
  phone: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
}

export type PaymentTiming = 'online' | 'in_person';
export type PaymentMethod = 'card' | 'cash'; // 'card' can be online or POS
export type DeliveryMethod = 'delivery' | 'pickup';

export interface Order {
  restaurantId: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  address: Address;
  contact: UserContact;
  paymentTiming: PaymentTiming;
  paymentMethod: PaymentMethod;
  deliveryMethod: DeliveryMethod;
  status: 'pending' | 'confirmed' | 'delivered';
  createdAt: string;
  userId?: string;
}
