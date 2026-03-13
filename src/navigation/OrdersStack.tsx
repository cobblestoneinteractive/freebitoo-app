import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { OrdersScreen } from '../screens/orders/OrdersScreen'
import { OrderTrackingScreen } from '../screens/orders/OrderTrackingScreen'

const Stack = createNativeStackNavigator()

export function OrdersStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OrdersList" component={OrdersScreen} />
      <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
    </Stack.Navigator>
  )
}
