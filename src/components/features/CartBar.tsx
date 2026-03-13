import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { MotiView } from '../../lib/moti-compat'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useCart } from '../../context/CartContext'
import { colors, spacing, radius } from '../../lib/theme'
import { formatPrice } from '../../lib/utils'

interface Props {
  onPress: () => void
}

export function CartBar({ onPress }: Props) {
  const insets = useSafeAreaInsets()
  const { count, total } = useCart()

  if (count === 0) return null

  return (
    <MotiView
      from={{ translateY: 100, opacity: 0 }}
      animate={{ translateY: 0, opacity: 1 }}
      exit={{ translateY: 100, opacity: 0 }}
      transition={{ type: 'spring', damping: 18, mass: 0.8 }}
      style={[styles.container, { paddingBottom: insets.bottom + spacing.md }]}
    >
      <TouchableOpacity style={styles.bar} onPress={onPress} activeOpacity={0.9}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{count}</Text>
        </View>
        <Text style={styles.label}>Vedi carrello • {count} {count === 1 ? 'articolo' : 'articoli'}</Text>
        <Text style={styles.total}>{formatPrice(total)}</Text>
      </TouchableOpacity>
    </MotiView>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  bar: {
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  badge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  badgeText: { fontSize: 13, fontWeight: '700', color: colors.white },
  label: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.white },
  total: { fontSize: 15, fontWeight: '700', color: colors.white },
})
