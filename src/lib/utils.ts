export function formatPrice(cents: number): string {
  return `€${(cents / 100).toFixed(2).replace('.', ',')}`
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)}m`
  return `${km.toFixed(1)}km`
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('it-IT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function statusLabel(status: string): string {
  const map: Record<string, string> = {
    pending: 'In attesa',
    accepted: 'Accettato',
    preparing: 'In preparazione',
    ready: 'Pronto',
    on_the_way: 'In consegna',
    delivered: 'Consegnato',
    cancelled: 'Annullato',
  }
  return map[status] ?? status
}

export function statusColor(status: string): string {
  const map: Record<string, string> = {
    pending: '#D97706',
    accepted: '#2563EB',
    preparing: '#7C3AED',
    ready: '#16A34A',
    on_the_way: '#0891B2',
    delivered: '#16A34A',
    cancelled: '#DC2626',
  }
  return map[status] ?? '#6B7280'
}
