import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { MotiView } from 'moti'
import { Ionicons } from '@expo/vector-icons'
import { colors, spacing, radius } from '../../lib/theme'
import { OrderStatus } from '../../types'

interface Step {
  status: OrderStatus[]
  emoji: string
  label: string
  description: string
}

const STEPS: Step[] = [
  { status: ['pending', 'accepted'], emoji: '🕐', label: 'Ordine ricevuto', description: 'Il ristorante ha ricevuto il tuo ordine' },
  { status: ['preparing'], emoji: '👨‍🍳', label: 'In preparazione', description: 'Il tuo cibo è in preparazione' },
  { status: ['ready'], emoji: '✅', label: 'Pronto', description: "Il tuo ordine è pronto per la consegna" },
  { status: ['on_the_way'], emoji: '🛵', label: 'In consegna', description: 'Il rider sta portando il tuo ordine' },
  { status: ['delivered'], emoji: '🏠', label: 'Consegnato', description: 'Buon appetito!' },
]

function getStepIndex(status: OrderStatus): number {
  for (let i = 0; i < STEPS.length; i++) {
    if (STEPS[i].status.includes(status)) return i
  }
  return 0
}

interface Props {
  currentStatus: OrderStatus
}

export function OrderStatusTracker({ currentStatus }: Props) {
  const activeIndex = getStepIndex(currentStatus)
  const isCancelled = currentStatus === 'cancelled'

  if (isCancelled) {
    return (
      <View style={styles.cancelledContainer}>
        <Text style={styles.cancelledEmoji}>❌</Text>
        <Text style={styles.cancelledText}>Ordine annullato</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {STEPS.map((step, index) => {
        const isCompleted = index < activeIndex
        const isActive = index === activeIndex
        const isFuture = index > activeIndex

        return (
          <View key={index} style={styles.stepRow}>
            {/* Left: circle + line */}
            <View style={styles.leftCol}>
              {/* Circle */}
              {isActive ? (
                <MotiView
                  from={{ scale: 1 }}
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ type: 'timing', duration: 1200, loop: true }}
                  style={[styles.circle, styles.circleActive]}
                >
                  <Text style={styles.circleEmoji}>{step.emoji}</Text>
                </MotiView>
              ) : isCompleted ? (
                <View style={[styles.circle, styles.circleCompleted]}>
                  <Ionicons name="checkmark" size={16} color={colors.white} />
                </View>
              ) : (
                <View style={[styles.circle, styles.circleFuture]}>
                  <Text style={styles.circleEmojiGray}>{step.emoji}</Text>
                </View>
              )}

              {/* Vertical line (not for last step) */}
              {index < STEPS.length - 1 && (
                <View style={[styles.line, isCompleted && styles.lineCompleted]} />
              )}
            </View>

            {/* Right: text */}
            <View style={styles.textCol}>
              <Text style={[
                styles.stepLabel,
                isActive && styles.stepLabelActive,
                isFuture && styles.stepLabelFuture,
              ]}>
                {step.label}
              </Text>
              {(isActive || isCompleted) && (
                <Text style={styles.stepDesc}>{step.description}</Text>
              )}
              <View style={{ height: index < STEPS.length - 1 ? 24 : 0 }} />
            </View>
          </View>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { paddingVertical: spacing.sm },
  stepRow: { flexDirection: 'row', gap: spacing.md },
  leftCol: { alignItems: 'center', width: 40 },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleActive: { backgroundColor: colors.primary },
  circleCompleted: { backgroundColor: colors.green },
  circleFuture: { backgroundColor: colors.gray100, borderWidth: 2, borderColor: colors.gray200 },
  circleEmoji: { fontSize: 18 },
  circleEmojiGray: { fontSize: 16, opacity: 0.4 },
  line: { flex: 1, width: 2, backgroundColor: colors.gray200, marginVertical: 2 },
  lineCompleted: { backgroundColor: colors.green },
  textCol: { flex: 1, paddingTop: 8 },
  stepLabel: { fontSize: 15, fontWeight: '700', color: colors.black },
  stepLabelActive: { color: colors.primary },
  stepLabelFuture: { color: colors.gray400 },
  stepDesc: { fontSize: 13, color: colors.gray500, marginTop: 2 },
  cancelledContainer: { alignItems: 'center', paddingVertical: spacing.xl },
  cancelledEmoji: { fontSize: 40, marginBottom: spacing.sm },
  cancelledText: { fontSize: 16, fontWeight: '600', color: colors.primary },
})
