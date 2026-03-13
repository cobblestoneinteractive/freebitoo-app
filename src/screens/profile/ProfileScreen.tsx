import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '../../context/AuthContext'
import { colors, spacing, radius, typography } from '../../lib/theme'
import { getInitials } from '../../lib/utils'

const APP_VERSION = '1.0.0'

export function ProfileScreen({ navigation }: any) {
  const insets = useSafeAreaInsets()
  const { user, profile, signOut } = useAuth()

  const handleSignOut = () => {
    Alert.alert('Esci', 'Sei sicuro di voler uscire?', [
      { text: 'Annulla', style: 'cancel' },
      { text: 'Esci', style: 'destructive', onPress: signOut },
    ])
  }

  const displayName = profile?.full_name ?? user?.email ?? 'Utente'
  const initials = getInitials(displayName)

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} contentContainerStyle={styles.content}>
      {/* Avatar */}
      <View style={styles.avatarSection}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarInitials}>{initials}</Text>
        </View>
        <Text style={styles.displayName}>{displayName}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        {profile?.phone && <Text style={styles.phone}>{profile.phone}</Text>}
      </View>

      {/* Account section */}
      <Text style={styles.sectionTitle}>Account</Text>
      <View style={styles.menuCard}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('OrdersTab')}
          activeOpacity={0.8}
        >
          <Ionicons name="receipt-outline" size={22} color={colors.primary} style={styles.menuIcon} />
          <Text style={styles.menuLabel}>I miei ordini</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.gray400} />
        </TouchableOpacity>

        <View style={styles.menuDivider} />

        <TouchableOpacity style={styles.menuItem} activeOpacity={0.8}>
          <Ionicons name="location-outline" size={22} color={colors.primary} style={styles.menuIcon} />
          <Text style={styles.menuLabel}>Indirizzi salvati</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.gray400} />
        </TouchableOpacity>

        <View style={styles.menuDivider} />

        <TouchableOpacity style={styles.menuItem} activeOpacity={0.8}>
          <Ionicons name="notifications-outline" size={22} color={colors.primary} style={styles.menuIcon} />
          <Text style={styles.menuLabel}>Notifiche</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.gray400} />
        </TouchableOpacity>
      </View>

      {/* Support section */}
      <Text style={styles.sectionTitle}>Supporto</Text>
      <View style={styles.menuCard}>
        <TouchableOpacity style={styles.menuItem} activeOpacity={0.8}>
          <Ionicons name="help-circle-outline" size={22} color={colors.gray500} style={styles.menuIcon} />
          <Text style={styles.menuLabel}>Centro assistenza</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.gray400} />
        </TouchableOpacity>

        <View style={styles.menuDivider} />

        <TouchableOpacity style={styles.menuItem} activeOpacity={0.8}>
          <Ionicons name="shield-outline" size={22} color={colors.gray500} style={styles.menuIcon} />
          <Text style={styles.menuLabel}>Privacy</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.gray400} />
        </TouchableOpacity>
      </View>

      {/* Sign out */}
      <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut} activeOpacity={0.8}>
        <Ionicons name="log-out-outline" size={20} color={colors.primary} />
        <Text style={styles.signOutText}>Esci</Text>
      </TouchableOpacity>

      <Text style={styles.version}>FreeBitoo v{APP_VERSION}</Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray50 },
  content: { paddingBottom: 40 },
  avatarSection: { alignItems: 'center', paddingVertical: spacing['2xl'], backgroundColor: colors.white },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatarInitials: { fontSize: 28, fontWeight: '700', color: colors.white },
  displayName: { ...typography.h3, color: colors.black, marginBottom: 4 },
  email: { fontSize: 14, color: colors.gray500, marginBottom: 2 },
  phone: { fontSize: 14, color: colors.gray400 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.gray400,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.lg,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    marginHorizontal: spacing.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  menuIcon: { marginRight: spacing.md },
  menuLabel: { flex: 1, fontSize: 15, color: colors.black },
  menuDivider: { height: 1, backgroundColor: colors.gray100, marginLeft: spacing.lg + 22 + spacing.md },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
    paddingVertical: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  signOutText: { fontSize: 16, fontWeight: '600', color: colors.primary },
  version: { textAlign: 'center', fontSize: 12, color: colors.gray400, marginTop: spacing.xl },
})
