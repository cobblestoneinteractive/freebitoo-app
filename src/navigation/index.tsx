import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useAuth } from '../context/AuthContext'
import { AuthStack } from './AuthStack'
import { AppTabs } from './AppTabs'
import { OnboardingScreen } from '../screens/onboarding/OnboardingScreen'
import { View, ActivityIndicator } from 'react-native'
import { colors } from '../lib/theme'

const Root = createNativeStackNavigator()

export function RootNavigator() {
  const { user, loading, needsOnboarding } = useAuth()

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.white }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  return (
    <NavigationContainer>
      <Root.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Root.Screen name="Auth" component={AuthStack} />
        ) : needsOnboarding ? (
          <Root.Screen name="Onboarding" component={OnboardingScreen} />
        ) : (
          <Root.Screen name="App" component={AppTabs} />
        )}
      </Root.Navigator>
    </NavigationContainer>
  )
}
