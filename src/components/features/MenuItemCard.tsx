import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { MotiView } from '../../lib/moti-compat'
import { Ionicons } from '@expo/vector-icons'
import { useCart } from '../../context/CartContext'
import { colors, spacing, radius } from '../../lib/theme'
import { Product } from '../../types'
import { formatPrice } from '../../lib/utils'

interface Props {
  product: Product
  shopId: string
}

export function MenuItemCard({ product, shopId }: Props) {
  const { items, addItem, updateQty } = useCart()
  const cartItem = items.find(i => i.product.id === product.id)
  const qty = cartItem?.quantity ?? 0

  return (
    <View style={styles.card}>
      {/* Text content */}
      <View style={styles.textContent}>
        <Text style={styles.name}>{product.name}</Text>
        {product.description && (
          <Text style={styles.description} numberOfLines={2}>
            {product.description}
          </Text>
        )}
        <Text style={styles.price}>{formatPrice(product.price_cents)}</Text>
      </View>

      {/* Image placeholder / counter */}
      <View style={styles.right}>
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>🍽️</Text>
        </View>

        <MotiView
          key={qty}
          from={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 12 }}
          style={styles.counterContainer}
        >
          {qty === 0 ? (
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => addItem(product, shopId)}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={22} color={colors.white} />
            </TouchableOpacity>
          ) : (
            <View style={styles.counter}>
              <TouchableOpacity
                style={styles.counterBtn}
                onPress={() => updateQty(product.id, -1)}
              >
                <Ionicons name="remove" size={18} color={colors.primary} />
              </TouchableOpacity>
              <Text style={styles.counterQty}>{qty}</Text>
              <TouchableOpacity
                style={styles.counterBtn}
                onPress={() => addItem(product, shopId)}
              >
                <Ionicons name="add" size={18} color={colors.primary} />
              </TouchableOpacity>
            </View>
          )}
        </MotiView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  textContent: { flex: 1 },
  name: { fontSize: 15, fontWeight: '600', color: colors.black, marginBottom: 4 },
  description: { fontSize: 13, color: colors.gray500, lineHeight: 18, marginBottom: 6 },
  price: { fontSize: 15, fontWeight: '700', color: colors.black },
  right: { alignItems: 'center', gap: spacing.sm },
  imagePlaceholder: {
    width: 72,
    height: 72,
    borderRadius: radius.md,
    backgroundColor: colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderText: { fontSize: 28 },
  counterContainer: { alignItems: 'center' },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.full,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  counterBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterQty: { fontSize: 15, fontWeight: '700', color: colors.primary, minWidth: 20, textAlign: 'center' },
})
