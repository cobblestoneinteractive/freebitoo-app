import React, { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  KeyboardAvoidingView,
} from 'react-native'
import { MotiView } from 'moti'
import * as WebBrowser from 'expo-web-browser'
import { makeRedirectUri } from 'expo-auth-session'
import * as AppleAuthentication from 'expo-apple-authentication'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { supabase } from '../../lib/supabase'
import { colors, spacing, radius, typography } from '../../lib/theme'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'

WebBrowser.maybeCompleteAuthSession()

export function LoginScreen({ navigation }: any) {
  const insets = useSafeAreaInsets()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleEmailLogin = async () => {
    if (!email || !password) {
      setError('Inserisci email e password')
      return
    }
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    setLoading(false)
  }

  const handleGoogleLogin = async () => {
    const redirectTo = makeRedirectUri({ scheme: 'freebitoo' })
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo, skipBrowserRedirect: true },
    })
    if (error) { Alert.alert('Errore', error.message); return }
    if (data.url) {
      const res = await WebBrowser.openAuthSessionAsync(data.url, redirectTo)
      if (res.type === 'success' && res.url) {
        const params = new URLSearchParams(res.url.split('#')[1])
        const access_token = params.get('access_token')
        const refresh_token = params.get('refresh_token')
        if (access_token) {
          await supabase.auth.setSession({ access_token, refresh_token: refresh_token || '' })
        }
      }
    }
  }

  const handleAppleLogin = async () => {
    try {
      const cred = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      })
      const { error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: cred.identityToken!,
      })
      if (error) Alert.alert('Errore', error.message)
    } catch (e: any) {
      if (e.code !== 'ERR_REQUEST_CANCELED') {
        Alert.alert('Errore', e.message)
      }
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 32 }]}
        keyboardShouldPersistTaps="handled"
      >
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500 }}
        >
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoLetter}>F</Text>
            </View>
            <Text style={styles.logoText}>FreeBitoo</Text>
          </View>

          <Text style={styles.title}>Bentornato 👋</Text>
          <Text style={styles.subtitle}>Accedi per ordinare il tuo cibo preferito</Text>

          {/* Social buttons */}
          <TouchableOpacity style={styles.socialBtn} onPress={handleGoogleLogin} activeOpacity={0.8}>
            <Ionicons name="logo-google" size={20} color={colors.black} />
            <Text style={styles.socialBtnText}>Accedi con Google</Text>
          </TouchableOpacity>

          {Platform.OS === 'ios' && (
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
              buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
              cornerRadius={radius.md}
              style={styles.appleBtn}
              onPress={handleAppleLogin}
            />
          )}

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>oppure</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Form */}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="tu@esempio.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="La tua password"
            secureTextEntry
          />

          <Button
            label="Accedi"
            onPress={handleEmailLogin}
            loading={loading}
            style={styles.loginBtn}
          />

          <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.linkRow}>
            <Text style={styles.linkText}>
              Non hai un account?{' '}
              <Text style={styles.link}>Registrati</Text>
            </Text>
          </TouchableOpacity>
        </MotiView>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  content: { paddingHorizontal: spacing['2xl'] },
  logoContainer: { alignItems: 'center', marginBottom: spacing['2xl'] },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  logoLetter: { fontSize: 36, fontWeight: '700', color: colors.white },
  logoText: { fontSize: 24, fontWeight: '700', color: colors.black },
  title: { ...typography.h1, color: colors.black, marginBottom: spacing.sm },
  subtitle: { ...typography.body, color: colors.gray500, marginBottom: spacing['2xl'] },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: 52,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.gray200,
    backgroundColor: colors.white,
    marginBottom: spacing.md,
  },
  socialBtnText: { fontSize: 15, fontWeight: '600', color: colors.black },
  appleBtn: { width: '100%', height: 52, marginBottom: spacing.md },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: spacing.lg },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.gray200 },
  dividerText: { marginHorizontal: spacing.md, color: colors.gray400, fontSize: 13 },
  errorText: {
    color: colors.primary,
    fontSize: 13,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  loginBtn: { marginTop: spacing.md },
  linkRow: { marginTop: spacing.lg, alignItems: 'center' },
  linkText: { fontSize: 14, color: colors.gray500 },
  link: { color: colors.primary, fontWeight: '600' },
})
