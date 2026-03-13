import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native'
import { MotiView } from '../../lib/moti-compat'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { colors, spacing, radius, typography } from '../../lib/theme'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'

export function OnboardingScreen() {
  const insets = useSafeAreaInsets()
  const { user, refreshProfile } = useAuth()
  const [step, setStep] = useState(0)
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const goNext = () => {
    setError('')
    if (step === 0) {
      if (!fullName.trim()) { setError('Inserisci il tuo nome'); return }
      setStep(1)
    }
  }

  const handleSendOtp = () => {
    if (!phone.trim()) { setError('Inserisci il numero di telefono'); return }
    setOtpSent(true)
    setError('')
  }

  const handleComplete = async () => {
    if (!otpSent) { setError('Invia prima il codice OTP'); return }
    if (otp !== '123456') { setError('Codice non valido. Usa 123456 (demo)'); return }
    setLoading(true)
    const fullPhone = `+39${phone.replace(/\s/g, '')}`
    const { error } = await supabase.from('profiles').upsert({
      user_id: user!.id,
      full_name: fullName,
      phone: fullPhone,
      is_customer: true,
    }, { onConflict: 'user_id' })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    await refreshProfile()
    setLoading(false)
  }

  const progressWidth = `${((step + 1) / 2) * 100}%`

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 32 }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Progress bar */}
        <View style={styles.progressBg}>
          <MotiView
            animate={{ width: progressWidth as any }}
            transition={{ type: 'timing', duration: 400 }}
            style={styles.progressFill}
          />
        </View>

        <Text style={styles.stepLabel}>Passo {step + 1} di 2</Text>

        {step === 0 && (
          <MotiView
            key="step0"
            from={{ opacity: 0, translateX: 40 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: 'timing', duration: 350 }}
          >
            <Text style={styles.title}>Come ti chiami? 👤</Text>
            <Text style={styles.subtitle}>Il tuo nome apparirà sugli ordini</Text>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Input
              label="Nome e Cognome"
              value={fullName}
              onChangeText={setFullName}
              placeholder="Es. Mario Rossi"
              autoCapitalize="words"
            />
            <Button label="Avanti →" onPress={goNext} style={styles.btn} />
          </MotiView>
        )}

        {step === 1 && (
          <MotiView
            key="step1"
            from={{ opacity: 0, translateX: 40 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: 'timing', duration: 350 }}
          >
            <Text style={styles.title}>Il tuo numero 📱</Text>
            <Text style={styles.subtitle}>Ti invieremo un codice di verifica</Text>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.phoneRow}>
              <View style={styles.flagBox}>
                <Text style={styles.flagEmoji}>🇮🇹</Text>
                <Text style={styles.flagCode}>+39</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Input
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="333 123 4567"
                  keyboardType="phone-pad"
                  style={styles.phoneInput}
                />
              </View>
            </View>

            {!otpSent ? (
              <Button label="Invia codice OTP" onPress={handleSendOtp} variant="outline" style={styles.btn} />
            ) : (
              <>
                <View style={styles.otpInfo}>
                  <Text style={styles.otpInfoText}>
                    Codice inviato a +39{phone} (demo: usa <Text style={{ fontWeight: '700' }}>123456</Text>)
                  </Text>
                </View>
                <Input
                  label="Codice OTP"
                  value={otp}
                  onChangeText={setOtp}
                  placeholder="123456"
                  keyboardType="number-pad"
                  maxLength={6}
                />
                <Button
                  label="Completa registrazione"
                  onPress={handleComplete}
                  loading={loading}
                  style={styles.btn}
                />
              </>
            )}

            <TouchableOpacity onPress={() => setStep(0)} style={styles.backLink}>
              <Text style={styles.backLinkText}>← Torna indietro</Text>
            </TouchableOpacity>
          </MotiView>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  content: { paddingHorizontal: spacing['2xl'] },
  progressBg: {
    height: 4,
    backgroundColor: colors.gray200,
    borderRadius: radius.full,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: 4,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
  },
  stepLabel: { fontSize: 12, color: colors.gray400, marginBottom: spacing['2xl'] },
  title: { ...typography.h2, color: colors.black, marginBottom: spacing.sm },
  subtitle: { ...typography.body, color: colors.gray500, marginBottom: spacing.xl },
  errorText: { color: colors.primary, fontSize: 13, marginBottom: spacing.md, textAlign: 'center' },
  btn: { marginTop: spacing.md },
  phoneRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  flagBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 52,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.gray200,
    backgroundColor: colors.gray50,
    marginBottom: 12,
  },
  flagEmoji: { fontSize: 18 },
  flagCode: { fontSize: 15, fontWeight: '600', color: colors.black },
  phoneInput: { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 },
  otpInfo: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.sm,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  otpInfoText: { fontSize: 13, color: colors.primaryDark },
  backLink: { marginTop: spacing.lg, alignItems: 'center' },
  backLinkText: { color: colors.gray500, fontSize: 14 },
})
