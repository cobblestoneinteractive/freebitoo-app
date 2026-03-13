import React from 'react'
import { StyleSheet, ViewStyle } from 'react-native'
import { MotiView } from 'moti'
import { colors } from '../../lib/theme'

export function Skeleton({ style }: { style?: ViewStyle }) {
  return (
    <MotiView
      from={{ opacity: 0.4 }}
      animate={{ opacity: 1 }}
      transition={{ type: 'timing', duration: 800, loop: true }}
      style={[styles.base, style]}
    />
  )
}

const styles = StyleSheet.create({
  base: { backgroundColor: colors.gray100, borderRadius: 8 },
})
