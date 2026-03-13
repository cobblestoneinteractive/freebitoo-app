import React, { useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { supabase } from '../../lib/supabase'
import { colors, spacing, radius, typography } from '../../lib/theme'
import { ProductCategory, Product } from '../../types'
import { MenuItemCard } from '../../components/features/MenuItemCard'
import { CartBar } from '../../components/features/CartBar'
import { Skeleton } from '../../components/ui/Skeleton'

const { width } = Dimensions.get('window')
const HERO_HEIGHT = 260

export function RestaurantDetailScreen({ route, navigation }: any) {
  const { shop } = route.params
  const insets = useSafeAreaInsets()
  const [categories, setCategories] = useState<ProductCategory[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string>('')
  const scrollRef = useRef<ScrollView>(null)
  const sectionOffsets = useRef<Record<string, number>>({})

  useEffect(() => {
    const fetchData = async () => {
      const [catsRes, prodsRes] = await Promise.all([
        supabase.from('product_categories').select('*').eq('shop_id', shop.id).order('sort_order'),
        supabase
          .from('products')
          .select('*')
          .eq('shop_id', shop.id)
          .eq('is_available', true)
          .order('sort_order'),
      ])
      setCategories(catsRes.data ?? [])
      setProducts(prodsRes.data ?? [])
      if (catsRes.data?.[0]) setActiveCategory(catsRes.data[0].id)
      setLoading(false)
    }
    fetchData()
  }, [shop.id])

  const scrollToCategory = (catId: string) => {
    setActiveCategory(catId)
    const offset = sectionOffsets.current[catId]
    if (offset !== undefined) {
      scrollRef.current?.scrollTo({ y: offset + HERO_HEIGHT - 50, animated: true })
    }
  }

  return (
    <View style={styles.container}>
      {/* Scrollable content */}
      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false} stickyHeaderIndices={[1]}>
        {/* Hero */}
        <View style={styles.hero}>
          <View style={[styles.heroPlaceholder, { backgroundColor: colors.primary }]}>
            <Text style={styles.heroInitial}>{shop.name[0]}</Text>
          </View>
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.75)']}
            style={styles.heroGradient}
          />
          {/* Back button */}
          <TouchableOpacity
            style={[styles.backBtn, { top: insets.top + 12 }]}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={22} color={colors.black} />
          </TouchableOpacity>
          {/* Info overlay */}
          <View style={styles.heroInfo}>
            <Text style={styles.heroName}>{shop.name}</Text>
            <View style={styles.heroMeta}>
              <Text style={styles.heroMetaText}>⭐ 4.5</Text>
              <Text style={styles.heroMetaText}>•</Text>
              <Text style={styles.heroMetaText}>~25 min</Text>
              {shop.distance_km ? (
                <>
                  <Text style={styles.heroMetaText}>•</Text>
                  <Text style={styles.heroMetaText}>{shop.distance_km.toFixed(1)}km</Text>
                </>
              ) : null}
            </View>
          </View>
        </View>

        {/* Sticky categories tab */}
        <View style={styles.stickyCategories}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catContent}>
            {loading
              ? [1, 2, 3].map(i => <Skeleton key={i} style={{ width: 80, height: 32, borderRadius: radius.full, marginRight: 8 }} />)
              : categories.map(cat => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.catTab, activeCategory === cat.id && styles.catTabActive]}
                    onPress={() => scrollToCategory(cat.id)}
                  >
                    <Text style={[styles.catTabText, activeCategory === cat.id && styles.catTabTextActive]}>
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                ))}
          </ScrollView>
        </View>

        {/* Products by category */}
        {loading ? (
          <View style={{ padding: spacing.lg, gap: spacing.md }}>
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} style={{ height: 90, borderRadius: radius.md }} />
            ))}
          </View>
        ) : (
          categories.map(cat => {
            const catProducts = products.filter(p => p.category_id === cat.id)
            if (catProducts.length === 0) return null
            return (
              <View
                key={cat.id}
                onLayout={e => { sectionOffsets.current[cat.id] = e.nativeEvent.layout.y }}
              >
                <Text style={styles.categoryTitle}>{cat.name}</Text>
                {catProducts.map(product => (
                  <MenuItemCard key={product.id} product={product} shopId={shop.id} />
                ))}
              </View>
            )
          })
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Cart bar */}
      <CartBar onPress={() => navigation.navigate('Cart')} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  hero: { height: HERO_HEIGHT, position: 'relative', overflow: 'hidden' },
  heroPlaceholder: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  heroInitial: { fontSize: 80, fontWeight: '700', color: 'rgba(255,255,255,0.3)' },
  heroGradient: { ...StyleSheet.absoluteFillObject },
  backBtn: {
    position: 'absolute',
    left: spacing.lg,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  heroInfo: { position: 'absolute', bottom: spacing.lg, left: spacing.lg, right: spacing.lg },
  heroName: { fontSize: 24, fontWeight: '700', color: colors.white, marginBottom: 4 },
  heroMeta: { flexDirection: 'row', gap: spacing.sm },
  heroMetaText: { fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: '500' },
  stickyCategories: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  catContent: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, gap: spacing.sm },
  catTab: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: colors.gray100,
  },
  catTabActive: { backgroundColor: colors.primary },
  catTabText: { fontSize: 13, fontWeight: '600', color: colors.gray700 },
  catTabTextActive: { color: colors.white },
  categoryTitle: {
    ...typography.h3,
    color: colors.black,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.sm,
  },
})
