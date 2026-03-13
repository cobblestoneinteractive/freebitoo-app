import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { colors, spacing, radius, typography } from '../../lib/theme'
import { formatPrice } from '../../lib/utils'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'

type PaymentMethod = 'cash' | 'card'

export function CheckoutScreen({ navigation }: any) {
  const insets = useSafeAreaInsets()
  const { user, profile } = useAuth()
  const { items, total, shopId, clearCart } = useCart()
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [notes, setNotes] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash')
  const [loading, setLoading] = useState(false)

  const DELIVERY_FEE = 200

  const handleOrder = async () => {
    if (!address.trim() || !city.trim()) {
      Alert.alert('Attenzione', 'Inserisci indirizzo e città di consegna')
      return
    }
    if (!shopId || !user) return
    setLoading(true)
    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          shop_id: shopId,
          customer_id: user.id,
          status: 'pending',
          total_cents: total + DELIVERY_FEE,
          delivery_address_line: address,
          delivery_city: city,
          delivery_notes: notes || null,
          customer_name: profile?.full_name,
          customer_phone: profile?.phone,
          order_type: 'delivery',
        })
        .select()
        .single()

      if (orderError) throw orderError

      const { error: itemsError } = await supabase.from('order_items').insert(
        items.map(i => ({
          order_id: order.id,
          product_id: i.product.id,
          product_name_snapshot: i.product.name,
          unit_price_cents: i.product.price_cents,
          quantity: i.quantity,
          line_total_cents: i.product.price_cents * i.quantity,
        }))
      )
      if (itemsError) throw itemsError

      clearCart()
      navigation.replace('OrderSuccess', { order })
    } catch (err: any) {
      Alert.alert('Errore', err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={colors.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Checkout</Text>
        </View>

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {/* Delivery address */}
          <Text style={styles.sectionTitle}>📍 Indirizzo di consegna</Text>
          <View style={styles.card}>
            <Input
              label="Via e numero civico"
              value={address}
              onChangeText={setAddress}
              placeholder="Es. Via Roma 10"
              autoCapitalize="words"
            />
            <Input
              label="Città"
              value={city}
              onChangeText={setCity}
              placeholder="Es. Milano"
              autoCapitalize="words"
            />
            <Input
              label="Note per il rider (opzionale)"
              value={notes}
              onChangeText={setNotes}
              placeholder="Es. Citofono 3, piano 2"
              multiline
              numberOfLines={2}
              style={{ height: 70 }}
            />
          </View>

          {/* Payment */}
          <Text style={styles.sectionTitle}>💳 Pagamento alla consegna</Text>
          <View style={styles.card}>
            <TouchableOpacity
              style={[styles.paymentOption, paymentMethod === 'cash' && styles.paymentOptionActive]}
              onPress={() => setPaymentMethod('cash')}
            >
              <Text style={styles.paymentEmoji}>💵</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.paymentLabel}>Contanti</Text>
                <Text style={styles.paymentSub}>Paga in contanti alla consegna</Text>
              </View>
              <View style={[styles.radio, paymentMethod === 'cash' && styles.radioActive]}>
                {paymentMethod === 'cash' && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.paymentOption, paymentMethod === 'card' && styles.paymentOptionActive]}
              onPress={() => setPaymentMethod('card')}
            >
              <Text style={styles.paymentEmoji}>💳</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.paymentLabel}>Carta (POS rider)</Text>
                <Text style={styles.paymentSub}>Paga con carta al rider</Text>
              </View>
              <View style={[styles.radio, paymentMethod === 'card' && styles.radioActive]}>
                {paymentMethod === 'card' && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>
          </View>

          {/* Order summary */}
          <Text style={styles.sectionTitle}>🧾 Riepilogo ordine</Text>
          <View style={styles.card}>
            {items.map(i => (
              <View key={i.product.id} style={styles.orderItem}>
                <Text style={styles.orderItemName}>{i.quantity}x {i.product.name}</Text>
                <Text style={styles.orderItemPrice}>{formatPrice(i.product.price_cents * i.quantity)}</Text>
              </View>
            ))}
            <View style={styles.divider} />
            <View style={styles.orderItem}>
              <Text style={styles.orderItemName}>Spese di consegna</Text>
              <Text style={styles.orderItemPrice}>{formatPrice(DELIVERY_FEE)}</Text>
            </View>
            <View style={[styles.orderItem, styles.totalItem]}>
              <Text style={styles.totalLabel}>Totale</Text>
              <Text style={styles.totalValue}>{formatPrice(total + DELIVERY_FEE)}</Text>
            </View>
          </View>

          <View style={{ height: 32 }} />
        </ScrollView>

        <View style={[styles.btnContainer, { paddingBottom: insets.bottom + spacing.lg }]}>
          <Button
            label={`Conferma ordine • ${formatPrice(total + DELIVERY_FEE)}`}
            onPress={handleOrder}
            loading={loading}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
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
  content: { padding: spacing.lg },
  sectionTitle: { ...typography.h3, color: colors.black, marginBottom: spacing.sm, marginTop: spacing.lg },
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
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.gray200,
    marginBottom: spacing.sm,
  },
  paymentOptionActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  paymentEmoji: { fontSize: 24 },
  paymentLabel: { fontSize: 15, fontWeight: '600', color: colors.black },
  paymentSub: { fontSize: 12, color: colors.gray500, marginTop: 2 },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.gray400,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: { borderColor: colors.primary },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  orderItemName: { fontSize: 14, color: colors.gray700 },
  orderItemPrice: { fontSize: 14, color: colors.black, fontWeight: '500' },
  divider: { height: 1, backgroundColor: colors.gray200, marginVertical: spacing.sm },
  totalItem: { marginTop: spacing.sm },
  totalLabel: { fontSize: 16, fontWeight: '700', color: colors.black },
  totalValue: { fontSize: 16, fontWeight: '700', color: colors.primary },
  btnContainer: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, backgroundColor: colors.white },
})
