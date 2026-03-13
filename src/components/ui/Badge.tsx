import React from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import { colors, radius } from '../../lib/theme'

interface BadgeProps {
  label: string
  color?: string
  bg?: string
  style?: ViewStyle
}

export function Badge({ label, color = colors.white, bg = colors.primary, style }: BadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: bg }, style]}>
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  text: { fontSize: 11, fontWeight: '600' },
})
