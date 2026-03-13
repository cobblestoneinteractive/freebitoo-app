import React, { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from 'react-native'
import { MotiView } from 'moti'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { supabase } from '../../lib/supabase'
import { colors, spacing, radius, typography } from '../../lib/theme'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'

export function RegisterScreen({ navigation }: any) {
  const insets = useSafeAreaInsets()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleRegister = async () => {
    setError('')
    if (!email || !password || !confirmPassword) {
      setError('Compila tutti i campi')
      return
    }
    if (password !== confirmPassword) {
      setError('Le password non coincidono')
      return
    }
    if (password.length < 6) {
      setError('La password deve essere almeno 6 caratteri')
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
    }
    setLoading(false)
  }

  if (success) {
    return (
      <View style={[styles.successContainer, { paddingTop: insets.top }]}>
        <MotiView
          from={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring' }}
          style={styles.successIcon}
        >
          <Ionicons name="mail-outline" size={48} color={colors.primary} />
        </MotiView>
        <Text style={styles.successTitle}>Controlla la tua email!</Text>
        <Text style={styles.successSubtitle}>
          Ti abbiamo inviato un link di conferma a{'\n'}
          <Text style={{ fontWeight: '600', color: colors.black }}>{email}</Text>
        </Text>
        <Button
          label="Torna al login"
          onPress={() => navigation.navigate('Login')}
          style={{ marginTop: spacing['2xl'], width: '80%' }}
        />
      </View>
    )
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 32 },
        ]}
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
          </View>

          <Text style={styles.title}>Crea un account</Text>
          <Text style={styles.subtitle}>Unisciti a FreeBitoo per ordinare</Text>

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
            placeholder="Almeno 6 caratteri"
            secureTextEntry
          />
          <Input
            label="Conferma Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Ripeti la password"
            secureTextEntry
          />

          <Button
            label="Registrati"
            onPress={handleRegister}
            loading={loading}
            style={styles.registerBtn}
          />

          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.linkRow}>
            <Text style={styles.linkText}>
              Hai già un account? <Text style={styles.link}>Accedi</Text>
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
  },
  logoLetter: { fontSize: 36, fontWeight: '700', color: colors.white },
  title: { ...typography.h1, color: colors.black, marginBottom: spacing.sm },
  subtitle: { ...typography.body, color: colors.gray500, marginBottom: spacing['2xl'] },
  errorText: {
    color: colors.primary,
    fontSize: 13,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  registerBtn: { marginTop: spacing.md },
  linkRow: { marginTop: spacing.lg, alignItems: 'center' },
  linkText: { fontSize: 14, color: colors.gray500 },
  link: { color: colors.primary, fontWeight: '600' },
  successContainer: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing['2xl'],
  },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing['2xl'],
  },
  successTitle: { ...typography.h2, color: colors.black, marginBottom: spacing.md, textAlign: 'center' },
  successSubtitle: { fontSize: 15, color: colors.gray500, textAlign: 'center', lineHeight: 22 },
})
