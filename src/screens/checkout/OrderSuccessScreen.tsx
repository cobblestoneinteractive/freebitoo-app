import React, { useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { MotiView } from 'moti'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { colors, spacing, radius, typography } from '../../lib/theme'
import { Button } from '../../components/ui/Button'

export function OrderSuccessScreen({ route, navigation }: any) {
  const insets = useSafeAreaInsets()
  const { order } = route.params

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Animated checkmark */}
      <MotiView
        from={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 15, mass: 0.8 }}
        style={styles.checkCircle}
      >
        <Ionicons name="checkmark" size={60} color={colors.white} />
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateY: 30 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 500, delay: 300 }}
      >
        <Text style={styles.title}>Ordine inviato! 🎉</Text>
        <Text style={styles.subtitle}>
          Il ristorante sta ricevendo il tuo ordine...
        </Text>

        {order.order_number && (
          <View style={styles.orderNumberBox}>
            <Text style={styles.orderNumberLabel}>Numero ordine</Text>
            <Text style={styles.orderNumber}>{order.order_number}</Text>
          </View>
        )}

        <View style={styles.infoBox}>
          <Ionicons name="time-outline" size={18} color={colors.yellow} />
          <Text style={styles.infoText}>Tempo stimato di consegna: ~30 min</Text>
        </View>
      </MotiView>

      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: 'timing', duration: 400, delay: 600 }}
        style={styles.buttons}
      >
        <Button
          label="Traccia ordine 🛵"
          onPress={() => navigation.replace('OrderTracking', { orderId: order.id })}
          style={styles.btn}
        />
        <Button
          label="Torna alla home"
          variant="outline"
          onPress={() => navigation.navigate('Home')}
          style={styles.btn}
        />
      </MotiView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing['2xl'],
  },
  checkCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing['2xl'],
    shadowColor: colors.green,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  title: { ...typography.h1, color: colors.black, textAlign: 'center', marginBottom: spacing.sm },
  subtitle: { fontSize: 16, color: colors.gray500, textAlign: 'center', lineHeight: 24, marginBottom: spacing.xl },
  orderNumberBox: {
    backgroundColor: colors.gray100,
    borderRadius: radius.md,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  orderNumberLabel: { fontSize: 12, color: colors.gray400, marginBottom: 4 },
  orderNumber: { fontSize: 22, fontWeight: '700', color: colors.black },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.yellowLight,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing['2xl'],
  },
  infoText: { fontSize: 14, color: colors.yellow, fontWeight: '500' },
  buttons: { width: '100%', gap: spacing.md },
  btn: {},
})
