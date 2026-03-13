import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { HomeScreen } from '../screens/home/HomeScreen'
import { RestaurantDetailScreen } from '../screens/home/RestaurantDetailScreen'
import { CartScreen } from '../screens/cart/CartScreen'
import { CheckoutScreen } from '../screens/checkout/CheckoutScreen'
import { OrderSuccessScreen } from '../screens/checkout/OrderSuccessScreen'
import { OrderTrackingScreen } from '../screens/orders/OrderTrackingScreen'

const Stack = createNativeStackNavigator()

export function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
      <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
    </Stack.Navigator>
  )
}
