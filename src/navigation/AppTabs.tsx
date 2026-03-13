import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import { HomeStack } from './HomeStack'
import { OrdersStack } from './OrdersStack'
import { ProfileScreen } from '../screens/profile/ProfileScreen'
import { colors } from '../lib/theme'

const Tab = createBottomTabNavigator()

export function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray400,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.gray200,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' as const },
        tabBarIcon: ({ focused, color }: { focused: boolean; color: string; size: number }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home'
          if (route.name === 'HomeTab') iconName = focused ? 'home' : 'home-outline'
          if (route.name === 'OrdersTab') iconName = focused ? 'receipt' : 'receipt-outline'
          if (route.name === 'ProfileTab') iconName = focused ? 'person' : 'person-outline'
          return <Ionicons name={iconName} size={22} color={color} />
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStack} options={{ title: 'Home' }} />
      <Tab.Screen
        name="OrdersTab"
        component={OrdersStack}
        options={{ title: 'Ordini' }}
      />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: 'Profilo' }} />
    </Tab.Navigator>
  )
}
