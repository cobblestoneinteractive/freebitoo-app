import React, { useCallback, useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
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

  const fetchOrders = async () => {
    if (!user) return
    const { data } = await supabase
      .from('orders')
      .select('*, shops(name, logo_url)')
      .eq('customer_id', user.id)
      .order('created_at', { ascending: false })
    setOrders(data ?? [])
    setLoading(false)
    setRefreshing(false)
  }

  useEffect(() => { fetchOrders() }, [user])

  const onRefresh = useCallback(() => { setRefreshing(true); fetchOrders() }, [])

  const active = orders.filter(o => ACTIVE_STATUSES.includes(o.status))
  const history = orders.filter(o => !ACTIVE_STATUSES.includes(o.status))
  const displayed = tab === 'active' ? active : history

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.pageTitle}>I miei ordini</Text>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, tab === 'active' && styles.tabActive]}
          onPress={() => setTab('active')}
        >
          <Text style={[styles.tabText, tab === 'active' && styles.tabTextActive]}>
            Attivi {active.length > 0 ? `(${active.length})` : ''}
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
            onPress={() => navigation.navigate('HomeTab', {
              screen: 'OrderTracking',
              params: { orderId: item.id },
            })}
            activeOpacity={0.8}
          >
            <View style={styles.orderHeader}>
              <Text style={styles.shopName}>
                {(item as any).shops?.name ?? 'Ristorante'}
              </Text>
              <View style={[styles.statusBadge, { backgroundColor: statusColor(item.status) + '20' }]}>
                <Text style={[styles.statusText, { color: statusColor(item.status) }]}>
                  {statusLabel(item.status)}
                </Text>
              </View>
            </View>
            <View style={styles.orderMeta}>
              <Text style={styles.metaText}>{formatDate(item.created_at)}</Text>
              <Text style={styles.metaTotal}>{formatPrice(item.total_cents)}</Text>
            </View>
            {item.order_number && (
              <Text style={styles.orderNum}>#{item.order_number}</Text>
            )}
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>{tab === 'active' ? '🎉' : '📋'}</Text>
            <Text style={styles.emptyText}>
              {tab === 'active' ? 'Nessun ordine attivo' : 'Nessun ordine nello storico'}
            </Text>
          </View>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  pageTitle: { ...typography.h2, color: colors.black, paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
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
  listContent: { padding: spacing.lg, gap: spacing.md },
  orderCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.gray200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  shopName: { fontSize: 16, fontWeight: '700', color: colors.black },
  statusBadge: { paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radius.full },
  statusText: { fontSize: 12, fontWeight: '600' },
  orderMeta: { flexDirection: 'row', justifyContent: 'space-between' },
  metaText: { fontSize: 13, color: colors.gray400 },
  metaTotal: { fontSize: 13, fontWeight: '600', color: colors.black },
  orderNum: { fontSize: 12, color: colors.gray400, marginTop: 4 },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyEmoji: { fontSize: 48, marginBottom: spacing.md },
  emptyText: { ...typography.body, color: colors.gray400 },
})
