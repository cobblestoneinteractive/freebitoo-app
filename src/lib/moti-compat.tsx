/**
 * moti-compat — drop-in MotiView replacement using React Native Animated API.
 * Replaces moti until reanimated 4.x / React 19 support lands in moti.
 */
import React, { useEffect, useRef } from 'react'
import { Animated, StyleProp, ViewStyle } from 'react-native'

// Accept any props moti passes — we only use the ones we support
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyProps = Record<string, any>

interface MotiViewProps {
  from?: AnyProps
  animate?: AnyProps
  transition?: AnyProps
  style?: StyleProp<ViewStyle>
  children?: React.ReactNode
  [key: string]: unknown
}

export function MotiView({ from, animate, transition, style, children }: MotiViewProps) {
  const opacity = useRef(new Animated.Value(
    typeof from?.opacity === 'number' ? from.opacity : 1
  )).current

  const translateY = useRef(new Animated.Value(
    typeof from?.translateY === 'number' ? from.translateY : 0
  )).current

  const scale = useRef(new Animated.Value(
    typeof from?.scale === 'number' ? from.scale : 1
  )).current

  useEffect(() => {
    const duration = typeof transition?.duration === 'number' ? transition.duration : 300
    const delay   = typeof transition?.delay   === 'number' ? transition.delay   : 0
    const loop    = transition?.loop === true

    const toOpacity   = typeof animate?.opacity   === 'number' ? animate.opacity   : 1
    const toTranslateY = typeof animate?.translateY === 'number' ? animate.translateY : 0
    const toScale     = typeof animate?.scale     === 'number' ? animate.scale     : 1

    const fwd = Animated.parallel([
      Animated.timing(opacity,   { toValue: toOpacity,    duration, delay, useNativeDriver: true }),
      Animated.timing(translateY,{ toValue: toTranslateY, duration, delay, useNativeDriver: true }),
      Animated.timing(scale,     { toValue: toScale,      duration, delay, useNativeDriver: true }),
    ])

    if (loop) {
      const bwd = Animated.parallel([
        Animated.timing(opacity, { toValue: typeof from?.opacity === 'number' ? from.opacity : 1, duration, useNativeDriver: true }),
      ])
      Animated.loop(Animated.sequence([fwd, bwd])).start()
    } else {
      fwd.start()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(animate)])

  return (
    <Animated.View style={[style, { opacity, transform: [{ translateY }, { scale }] }]}>
      {children}
    </Animated.View>
  )
}
