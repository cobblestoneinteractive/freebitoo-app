-- Ensure profiles table has correct structure for app
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_customer boolean DEFAULT true;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create unique index on user_id if not exists
CREATE UNIQUE INDEX IF NOT EXISTS profiles_user_id_key ON profiles(user_id);

-- RPC: get nearby shops using Haversine formula (no PostGIS needed)
CREATE OR REPLACE FUNCTION get_nearby_shops(
  p_lat float8,
  p_lng float8,
  p_radius_km float8 DEFAULT 50
)
RETURNS TABLE(
  id uuid, name text, slug text, description text,
  phone text, address_line text, city text,
  is_active boolean, logo_url text,
  lat float8, lng float8, distance_km float8
)
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT
    s.id, s.name, s.slug, s.description,
    s.phone, s.address_line, s.city,
    s.is_active, s.logo_url, s.lat, s.lng,
    (6371 * acos(
      LEAST(1.0, cos(radians(p_lat)) * cos(radians(s.lat)) *
      cos(radians(s.lng) - radians(p_lng)) +
      sin(radians(p_lat)) * sin(radians(s.lat)))
    )) AS distance_km
  FROM shops s
  WHERE s.is_active = true
    AND s.lat IS NOT NULL
    AND s.lng IS NOT NULL
    AND (6371 * acos(
      LEAST(1.0, cos(radians(p_lat)) * cos(radians(s.lat)) *
      cos(radians(s.lng) - radians(p_lng)) +
      sin(radians(p_lat)) * sin(radians(s.lat)))
    )) <= p_radius_km
  ORDER BY distance_km
$$;

-- Allow customers to read shops and products
CREATE POLICY IF NOT EXISTS "shops_public_read" ON shops FOR SELECT USING (is_active = true);
CREATE POLICY IF NOT EXISTS "products_public_read" ON products FOR SELECT USING (is_available = true);
CREATE POLICY IF NOT EXISTS "categories_public_read" ON product_categories FOR SELECT USING (true);

-- Allow users to read/write their own orders
CREATE POLICY IF NOT EXISTS "orders_customer_insert" ON orders FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY IF NOT EXISTS "orders_customer_select" ON orders FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY IF NOT EXISTS "order_items_customer_insert" ON order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM orders WHERE id = order_id AND customer_id = auth.uid())
);
CREATE POLICY IF NOT EXISTS "order_items_customer_select" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE id = order_id AND customer_id = auth.uid())
);

-- Allow users to read/write their own profile
CREATE POLICY IF NOT EXISTS "profiles_own" ON profiles FOR ALL USING (auth.uid() = user_id);
