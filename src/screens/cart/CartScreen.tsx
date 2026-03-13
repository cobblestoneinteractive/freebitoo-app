import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useCart } from '../../context/CartContext'
import { colors, spacing, radius, typography } from '../../lib/theme'
import { formatPrice } from '../../lib/utils'
import { Button } from '../../components/ui/Button'

export function CartScreen({ navigation }: any) {
  const insets = useSafeAreaInsets()
  const { items, total, count, updateQty, removeItem } = useCart()

  const DELIVERY_FEE = 200

  if (items.length === 0) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={colors.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Carrello</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🛒</Text>
          <Text style={styles.emptyTitle}>Il tuo carrello è vuoto</Text>
          <Text style={styles.emptySubtitle}>Aggiungi qualcosa di buono!</Text>
          <Button
            label="Sfoglia ristoranti"
            onPress={() => navigation.navigate('Home')}
            style={styles.browseBtn}
          />
        </View>
      </View>
    )
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Carrello ({count})</Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={item => item.product.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.product.name}</Text>
              <Text style={styles.itemPrice}>{formatPrice(item.product.price_cents * item.quantity)}</Text>
            </View>
            <View style={styles.qtyRow}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => updateQty(item.product.id, -1)}
              >
                <Ionicons
                  name={item.quantity === 1 ? 'trash-outline' : 'remove'}
                  size={16}
                  color={colors.primary}
                />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{item.quantity}</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => updateQty(item.product.id, 1)}
              >
                <Ionicons name="add" size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListFooterComponent={
          <View style={styles.footer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotale</Text>
              <Text style={styles.summaryValue}>{formatPrice(total)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Spese di consegna</Text>
              <Text style={styles.summaryValue}>{formatPrice(DELIVERY_FEE)}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Totale</Text>
              <Text style={styles.totalValue}>{formatPrice(total + DELIVERY_FEE)}</Text>
            </View>
          </View>
        }
      />

      <View style={[styles.checkoutBtnContainer, { paddingBottom: insets.bottom + spacing.lg }]}>
        <Button
          label={`Vai al checkout • ${formatPrice(total + DELIVERY_FEE)}`}
          onPress={() => navigation.navigate('Checkout')}
          style={styles.checkoutBtn}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
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
  listContent: { padding: spacing.lg },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 15, fontWeight: '500', color: colors.black, marginBottom: 2 },
  itemPrice: { fontSize: 14, color: colors.gray500 },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.gray100,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: { fontSize: 15, fontWeight: '700', color: colors.black, minWidth: 20, textAlign: 'center' },
  footer: {
    marginTop: spacing.xl,
    padding: spacing.lg,
    backgroundColor: colors.gray50,
    borderRadius: radius.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  summaryLabel: { fontSize: 14, color: colors.gray500 },
  summaryValue: { fontSize: 14, color: colors.black },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
    paddingTop: spacing.md,
    marginTop: spacing.sm,
  },
  totalLabel: { fontSize: 16, fontWeight: '700', color: colors.black },
  totalValue: { fontSize: 16, fontWeight: '700', color: colors.primary },
  checkoutBtnContainer: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  checkoutBtn: {},
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing['2xl'] },
  emptyEmoji: { fontSize: 64, marginBottom: spacing.lg },
  emptyTitle: { ...typography.h3, color: colors.black, marginBottom: spacing.sm },
  emptySubtitle: { ...typography.body, color: colors.gray400, marginBottom: spacing['2xl'] },
  browseBtn: {},
})
