import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { MotiView } from '../../lib/moti-compat'
import { Ionicons } from '@expo/vector-icons'
import { supabase } from '../../lib/supabase'
import { colors, spacing, radius, typography } from '../../lib/theme'
import { Order, OrderStatus } from '../../types'
import { formatDate, formatPrice } from '../../lib/utils'
import { OrderStatusTracker } from '../../components/features/OrderStatusTracker'

export function OrderTrackingScreen({ route, navigation }: any) {
  const insets = useSafeAreaInsets()
  const { orderId } = route.params
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchOrder = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', orderId)
      .single()
    setOrder(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchOrder()

    // Realtime subscription
    const channel = supabase
      .channel(`order:${orderId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${orderId}` },
        payload => {
          setOrder(prev => (prev ? { ...prev, ...(payload.new as any) } : null))
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [orderId])

  if (loading || !order) {
    return (
      <View style={[styles.container, { paddingTop: insets.top, alignItems: 'center', justifyContent: 'center' }]}>
        <MotiView
          from={{ opacity: 0.4 }}
          animate={{ opacity: 1 }}
          transition={{ type: 'timing', duration: 800, loop: true }}
        >
          <Ionicons name="bicycle-outline" size={48} color={colors.primary} />
        </MotiView>
        <Text style={{ color: colors.gray400, marginTop: spacing.md }}>Caricamento ordine...</Text>
      </View>
    )
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.black} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Il tuo ordine</Text>
          {order.order_number && (
            <Text style={styles.headerSub}>#{order.order_number}</Text>
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Status tracker */}
        <View style={styles.card}>
          <OrderStatusTracker currentStatus={order.status} />
        </View>

        {/* Rider info (when on_the_way) */}
        {order.status === 'on_the_way' && (order.rider_name || order.rider_phone) && (
          <View style={[styles.card, styles.riderCard]}>
            <View style={styles.riderIcon}>
              <Text style={{ fontSize: 28 }}>🛵</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.riderName}>{order.rider_name ?? 'Rider'}</Text>
              <Text style={styles.riderSub}>Il tuo rider è in arrivo!</Text>
            </View>
            {order.rider_phone && (
              <TouchableOpacity
                style={styles.callBtn}
                onPress={() => Linking.openURL(`tel:${order.rider_phone}`)}
              >
                <Ionicons name="call" size={18} color={colors.white} />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Delivery address */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>📍 Indirizzo di consegna</Text>
          <Text style={styles.addressText}>
            {order.delivery_address_line}{order.delivery_city ? `, ${order.delivery_city}` : ''}
          </Text>
          {order.delivery_notes && (
            <Text style={styles.notesText}>Note: {order.delivery_notes}</Text>
          )}
        </View>

        {/* Order items */}
        {order.order_items && order.order_items.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>🧾 Riepilogo</Text>
            {order.order_items.map(item => (
              <View key={item.id} style={styles.orderItem}>
                <Text style={styles.itemName}>{item.quantity}x {item.product_name_snapshot}</Text>
                <Text style={styles.itemPrice}>{formatPrice(item.line_total_cents)}</Text>
              </View>
            ))}
            <View style={styles.divider} />
            <View style={styles.orderItem}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: colors.black }}>Totale</Text>
              <Text style={{ fontSize: 15, fontWeight: '700', color: colors.primary }}>
                {formatPrice(order.total_cents)}
              </Text>
            </View>
          </View>
        )}

        <Text style={styles.dateText}>Ordinato il {formatDate(order.created_at)}</Text>
        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray50 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
    gap: spacing.md,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { ...typography.h3, color: colors.black },
  headerSub: { fontSize: 12, color: colors.gray400 },
  content: { padding: spacing.lg, gap: spacing.md },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  riderCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  riderIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  riderName: { fontSize: 16, fontWeight: '700', color: colors.black },
  riderSub: { fontSize: 13, color: colors.gray500 },
  callBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: { ...typography.h3, color: colors.black, marginBottom: spacing.sm },
  addressText: { fontSize: 15, color: colors.gray700 },
  notesText: { fontSize: 13, color: colors.gray400, marginTop: 4 },
  orderItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  itemName: { fontSize: 14, color: colors.gray700, flex: 1 },
  itemPrice: { fontSize: 14, color: colors.black, fontWeight: '500' },
  divider: { height: 1, backgroundColor: colors.gray200, marginVertical: spacing.sm },
  dateText: { fontSize: 12, color: colors.gray400, textAlign: 'center', marginTop: spacing.md },
})
