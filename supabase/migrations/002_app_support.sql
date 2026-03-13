-- ============================================================
-- FreeBitoo App — Migration 002
-- Esegui questo nella SQL Editor del tuo progetto Supabase
-- ============================================================

-- 1. Aggiungi colonne mancanti a profiles (se non esistono già)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_customer boolean DEFAULT true;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
CREATE UNIQUE INDEX IF NOT EXISTS profiles_user_id_key ON profiles(user_id);

-- 2. RPC: ristoranti vicini con formula Haversine (no PostGIS)
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
    AND s.lat IS NOT NULL AND s.lng IS NOT NULL
    AND (6371 * acos(
      LEAST(1.0, cos(radians(p_lat)) * cos(radians(s.lat)) *
      cos(radians(s.lng) - radians(p_lng)) +
      sin(radians(p_lat)) * sin(radians(s.lat)))
    )) <= p_radius_km
  ORDER BY distance_km
$$;

-- 3. Abilita Realtime sulle tabelle (IMPORTANTE per aggiornamenti live)
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE order_items;

-- 4. RLS Policies per i clienti dell'app
-- shops: lettura pubblica
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'shops' AND policyname = 'shops_public_read'
  ) THEN
    CREATE POLICY "shops_public_read" ON shops FOR SELECT USING (is_active = true);
  END IF;
END $$;

-- products: lettura pubblica
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'products_public_read'
  ) THEN
    CREATE POLICY "products_public_read" ON products FOR SELECT USING (is_available = true);
  END IF;
END $$;

-- product_categories: lettura pubblica
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'product_categories' AND policyname = 'categories_public_read'
  ) THEN
    CREATE POLICY "categories_public_read" ON product_categories FOR SELECT USING (true);
  END IF;
END $$;

-- orders: cliente può inserire e leggere i propri ordini
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'orders' AND policyname = 'orders_customer_insert'
  ) THEN
    CREATE POLICY "orders_customer_insert" ON orders FOR INSERT WITH CHECK (auth.uid() = customer_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'orders' AND policyname = 'orders_customer_select'
  ) THEN
    CREATE POLICY "orders_customer_select" ON orders FOR SELECT USING (auth.uid() = customer_id);
  END IF;
END $$;

-- order_items: cliente può inserire e leggere i propri items
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'order_items' AND policyname = 'order_items_customer_insert'
  ) THEN
    CREATE POLICY "order_items_customer_insert" ON order_items
      FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM orders WHERE id = order_id AND customer_id = auth.uid())
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'order_items' AND policyname = 'order_items_customer_select'
  ) THEN
    CREATE POLICY "order_items_customer_select" ON order_items
      FOR SELECT USING (
        EXISTS (SELECT 1 FROM orders WHERE id = order_id AND customer_id = auth.uid())
      );
  END IF;
END $$;

-- profiles: ogni utente gestisce il proprio profilo
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'profiles_own'
  ) THEN
    CREATE POLICY "profiles_own" ON profiles FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;

-- 5. Assicurati che RLS sia abilitato sulle tabelle necessarie
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
