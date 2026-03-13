export type OrderStatus =
  | 'pending'
  | 'accepted'
  | 'preparing'
  | 'ready'
  | 'on_the_way'
  | 'delivered'
  | 'cancelled'

export interface Shop {
  id: string
  name: string
  slug: string
  description: string | null
  phone: string | null
  address_line: string | null
  city: string | null
  is_active: boolean
  logo_url: string | null
  lat: number | null
  lng: number | null
  distance_km?: number
  cuisine_type?: string
}

export interface ProductCategory {
  id: string
  shop_id: string
  name: string
  sort_order: number
}

export interface Product {
  id: string
  shop_id: string
  category_id: string
  name: string
  description: string | null
  price_cents: number
  is_available: boolean
  image_url: string | null
  sort_order: number
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Order {
  id: string
  shop_id: string
  customer_id: string
  status: OrderStatus
  total_cents: number
  delivery_address_line: string | null
  delivery_city: string | null
  delivery_notes: string | null
  customer_name: string | null
  customer_phone: string | null
  order_number: string | null
  order_type: 'delivery' | 'pickup'
  rider_name: string | null
  rider_phone: string | null
  on_the_way_at: string | null
  delivered_at: string | null
  created_at: string
  order_items?: OrderItem[]
  shops?: { name: string; logo_url: string | null }
}

export interface OrderItem {
  id: string
  product_name_snapshot: string
  unit_price_cents: number
  quantity: number
  line_total_cents: number
}

export interface Profile {
  id: string
  user_id: string
  full_name: string | null
  phone: string | null
  is_customer?: boolean
}
