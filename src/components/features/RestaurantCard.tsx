import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { MotiView } from 'moti'
import { colors, radius, spacing } from '../../lib/theme'
import { Shop } from '../../types'
import { formatDistance } from '../../lib/utils'

const { width } = Dimensions.get('window')
const CARD_HEIGHT = 200

interface Props {
  shop: Shop
  onPress: () => void
}

export function RestaurantCard({ shop, onPress }: Props) {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 350 }}
    >
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        activeOpacity={0.92}
      >
        {/* Hero image / placeholder */}
        <View style={[styles.image, { backgroundColor: colors.primary }]}>
          <Text style={styles.heroInitial}>{shop.name[0]}</Text>
        </View>

        {/* Gradient overlay */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.72)']}
          style={StyleSheet.absoluteFillObject}
        />

        {/* Cuisine chip */}
        {shop.cuisine_type && (
          <View style={styles.cuisineChip}>
            <Text style={styles.cuisineText}>{shop.cuisine_type}</Text>
          </View>
        )}

        {/* Bottom info */}
        <View style={styles.infoOverlay}>
          <Text style={styles.name} numberOfLines={1}>{shop.name}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.meta}>⭐ 4.5</Text>
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.meta}>~25 min</Text>
            {shop.distance_km !== undefined && (
              <>
                <Text style={styles.metaDot}>•</Text>
                <Text style={styles.meta}>{formatDistance(shop.distance_km)}</Text>
              </>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </MotiView>
  )
}

const styles = StyleSheet.create({
  card: {
    height: CARD_HEIGHT,
    borderRadius: radius.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroInitial: { fontSize: 72, fontWeight: '700', color: 'rgba(255,255,255,0.25)' },
  cuisineChip: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  cuisineText: { fontSize: 11, color: colors.white, fontWeight: '600' },
  infoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
  },
  name: { fontSize: 20, fontWeight: '700', color: colors.white, marginBottom: 4 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  meta: { fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: '500' },
  metaDot: { fontSize: 13, color: 'rgba(255,255,255,0.5)' },
})
