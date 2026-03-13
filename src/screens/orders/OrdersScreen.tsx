import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { colors, spacing, radius, typography } from '../../lib/theme'
import { Order } from '../../types'
import { formatDate, formatPrice, statusColor, statusLabel } from '../../lib/utils'

const ACTIVE_STATUSES = ['pending', 'accepted', 'preparing', 'ready', 'on_the_way']

export function OrdersScreen({ navigation }: any) {
  const insets = useSafeAreaInsets()
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [tab, setTab] = useState<'active' | 'history'>('active')
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)

  const fetchOrders = useCallback(async () => {
    if (!user) return
    const { data, error } = await supabase
      .from('orders')
      .select(`
        id, shop_id, customer_id, status, total_cents,
        delivery_address_line, delivery_city, customer_name,
        order_number, order_type, rider_name, rider_phone,
        on_the_way_at, delivered_at, created_at,
        shops ( name, logo_url )
      `)
      .eq('customer_id', user.id)
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) {
      console.warn('Orders fetch error:', error.message, error.code)
    }
    setOrders((data as any[]) ?? [])
    setLoading(false)
    setRefreshing(false)
  }, [user])

  // Realtime: aggiorna chirurgicamente invece di rifetchare tutto
  const subscribeRealtime = useCallback(() => {
    if (!user) return
    // Rimuovi canale precedente
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current)
    }

    channelRef.current = supabase
      .channel(`orders:user:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `customer_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            // Nuovo ordine → aggiungi in cima
            setOrders(prev => [payload.new as Order, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            // Aggiornamento (es. status cambiato dalla dashboard) → aggiorna chirurgicamente
            setOrders(prev =>
              prev.map(o => o.id === (payload.new as Order).id
                ? { ...o, ...(payload.new as Order) }
                : o
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setOrders(prev => prev.filter(o => o.id !== (payload.old as any).id))
          }
        }
      )
      .subscribe((status) => {
        console.log('Realtime orders status:', status)
      })
  }, [user])

  useEffect(() => {
    fetchOrders()
    subscribeRealtime()
    return () => {
      if (channelRef.current) supabase.removeChannel(channelRef.current)
    }
  }, [user])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    fetchOrders()
  }, [fetchOrders])

  const active = orders.filter(o => ACTIVE_STATUSES.includes(o.status))
  const history = orders.filter(o => !ACTIVE_STATUSES.includes(o.status))
  const displayed = tab === 'active' ? active : history

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top, alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.pageTitle}>I miei ordini</Text>
        {active.length > 0 && (
          <View style={styles.activeBadge}>
            <Text style={styles.activeBadgeText}>{active.length} attivi</Text>
          </View>
        )}
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, tab === 'active' && styles.tabActive]}
          onPress={() => setTab('active')}
        >
          <Text style={[styles.tabText, tab === 'active' && styles.tabTextActive]}>
            Attivi{active.length > 0 ? ` (${active.length})` : ''}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'history' && styles.tabActive]}
          onPress={() => setTab('history')}
        >
          <Text style={[styles.tabText, tab === 'history' && styles.tabTextActive]}>Storico</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={displayed}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.orderCard}
            onPress={() => navigation.navigate('OrderTracking', { orderId: item.id })}
            activeOpacity={0.8}
          >
            {/* Status indicator strip */}
            <View style={[styles.statusStrip, { backgroundColor: statusColor(item.status) }]} />

            <View style={styles.cardInner}>
              <View style={styles.orderHeader}>
                <Text style={styles.shopName}>
                  {(item as any).shops?.name ?? 'Ristorante'}
                </Text>
                <View style={[styles.statusBadge, { backgroundColor: statusColor(item.status) + '22' }]}>
                  <Text style={[styles.statusText, { color: statusColor(item.status) }]}>
                    {statusLabel(item.status)}
                  </Text>
                </View>
              </View>

              <View style={styles.orderMeta}>
                <Text style={styles.metaText}>{formatDate(item.created_at)}</Text>
                <Text style={styles.metaTotal}>{formatPrice(item.total_cents)}</Text>
              </View>

              <View style={styles.orderFooter}>
                {item.order_number
                  ? <Text style={styles.orderNum}>#{item.order_number}</Text>
                  : <View />
                }
                <View style={styles.trackRow}>
                  <Text style={styles.trackText}>Traccia</Text>
                  <Ionicons name="chevron-forward" size={14} color={colors.primary} />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>{tab === 'active' ? '🎉' : '📋'}</Text>
            <Text style={styles.emptyTitle}>
              {tab === 'active' ? 'Nessun ordine attivo' : 'Nessun ordine nello storico'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {tab === 'active'
                ? 'I tuoi ordini attivi appariranno qui'
                : 'Gli ordini completati appariranno qui'}
            </Text>
          </View>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray50 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  pageTitle: { ...typography.h2, color: colors.black },
  activeBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  activeBadgeText: { fontSize: 12, fontWeight: '700', color: colors.white },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    alignItems: 'center',
    backgroundColor: colors.gray100,
  },
  tabActive: { backgroundColor: colors.primary },
  tabText: { fontSize: 14, fontWeight: '600', color: colors.gray500 },
  tabTextActive: { color: colors.white },
  listContent: { padding: spacing.lg, gap: spacing.md, paddingBottom: 100 },
  orderCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    overflow: 'hidden',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  statusStrip: { width: 5 },
  cardInner: { flex: 1, padding: spacing.lg },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  shopName: { fontSize: 16, fontWeight: '700', color: colors.black, flex: 1 },
  statusBadge: { paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: radius.full, marginLeft: spacing.sm },
  statusText: { fontSize: 12, fontWeight: '700' },
  orderMeta: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  metaText: { fontSize: 13, color: colors.gray400 },
  metaTotal: { fontSize: 14, fontWeight: '700', color: colors.black },
  orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderNum: { fontSize: 12, color: colors.gray400 },
  trackRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  trackText: { fontSize: 13, fontWeight: '600', color: colors.primary },
  empty: { alignItems: 'center', paddingTop: 80, paddingHorizontal: spacing['2xl'] },
  emptyEmoji: { fontSize: 52, marginBottom: spacing.lg },
  emptyTitle: { ...typography.h3, color: colors.black, textAlign: 'center', marginBottom: spacing.sm },
  emptySubtitle: { ...typography.body, color: colors.gray400, textAlign: 'center' },
})
