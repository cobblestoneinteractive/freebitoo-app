import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TextInput,
  TouchableOpacity,
  RefreshControl,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as Location from 'expo-location'
import { Ionicons } from '@expo/vector-icons'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { colors, spacing, radius, typography } from '../../lib/theme'
import { Shop } from '../../types'
import { RestaurantCard } from '../../components/features/RestaurantCard'
import { Skeleton } from '../../components/ui/Skeleton'

const CATEGORIES = ['Tutti', 'Pizza', 'Burger', 'Sushi', 'Vegano', 'Pasta', 'Dessert']

export function HomeScreen({ navigation }: any) {
  const insets = useSafeAreaInsets()
  const { profile } = useAuth()
  const [shops, setShops] = useState<Shop[]>([])
  const [filtered, setFiltered] = useState<Shop[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [location, setLocation] = useState<Location.LocationObject | null>(null)
  const [locationName, setLocationName] = useState('Rilevamento...')
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('Tutti')

  const fetchShops = async (loc?: Location.LocationObject | null) => {
    let data: Shop[] | null = null

    if (loc) {
      // Edge Function: ristoranti vicini ottimizzati lato server
      const { data: fnData, error } = await supabase.functions.invoke('get-nearby-shops', {
        body: {
          lat: loc.coords.latitude,
          lng: loc.coords.longitude,
          radius_km: 50,
        },
      })
      if (!error && fnData?.shops) data = fnData.shops
    }

    // Fallback: tutti i ristoranti attivi (se no location o edge fn fallisce)
    if (!data) {
      const res = await supabase
        .from('shops')
        .select('id, name, slug, description, address_line, city, logo_url, lat, lng, is_active')
        .eq('is_active', true)
        .limit(20)
      data = res.data as Shop[] | null
    }

    setShops(data ?? [])
    setFiltered(data ?? [])
    setLoading(false)
    setRefreshing(false)
  }

  const requestLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync()
    if (status === 'granted') {
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced })
      setLocation(loc)
      const geocode = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      })
      if (geocode[0]) {
        setLocationName(geocode[0].city || geocode[0].region || 'La tua posizione')
      }
      return loc
    }
    setLocationName('Posizione non disponibile')
    return null
  }

  useEffect(() => {
    requestLocation().then(loc => fetchShops(loc))
  }, [])

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await fetchShops(location)
  }, [location])

  useEffect(() => {
    let result = shops
    if (search) {
      result = result.filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
    }
    setFiltered(result)
  }, [search, shops])

  const firstName = profile?.full_name?.split(' ')[0] ?? 'amico'

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.locationRow}>
          <Ionicons name="location-sharp" size={18} color={colors.primary} />
          <Text style={styles.locationText} numberOfLines={1}>{locationName}</Text>
        </View>
        <Text style={styles.greeting}>Ciao {firstName}! 👋</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color={colors.gray400} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Cerca ristoranti..."
          placeholderTextColor={colors.gray400}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
        contentContainerStyle={styles.categoriesContent}
      >
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[styles.categoryPill, activeCategory === cat && styles.categoryPillActive]}
            onPress={() => setActiveCategory(cat)}
            activeOpacity={0.8}
          >
            <Text style={[styles.categoryText, activeCategory === cat && styles.categoryTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Shops list */}
      {loading ? (
        <View style={styles.skeletonContainer}>
          {[1, 2, 3].map(i => (
            <Skeleton key={i} style={styles.skeletonCard} />
          ))}
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <RestaurantCard
              shop={item}
              onPress={() => navigation.navigate('RestaurantDetail', { shop: item })}
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>🍽️</Text>
              <Text style={styles.emptyText}>Nessun ristorante trovato</Text>
            </View>
          }
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 2 },
  locationText: { fontSize: 13, color: colors.gray500, flex: 1 },
  greeting: { ...typography.h2, color: colors.black },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.gray100,
    borderRadius: radius.full,
    paddingHorizontal: spacing.lg,
    height: 44,
  },
  searchIcon: { marginRight: spacing.sm },
  searchInput: { flex: 1, fontSize: 15, color: colors.black },
  categoriesScroll: { maxHeight: 48 },
  categoriesContent: { paddingHorizontal: spacing.lg, gap: spacing.sm },
  categoryPill: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.gray100,
    borderWidth: 1.5,
    borderColor: colors.gray200,
  },
  categoryPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: { fontSize: 13, fontWeight: '600', color: colors.gray700 },
  categoryTextActive: { color: colors.white },
  listContent: { padding: spacing.lg, gap: spacing.lg },
  skeletonContainer: { padding: spacing.lg, gap: spacing.lg },
  skeletonCard: { height: 200, borderRadius: radius.lg },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyEmoji: { fontSize: 48, marginBottom: spacing.md },
  emptyText: { ...typography.body, color: colors.gray400 },
})
