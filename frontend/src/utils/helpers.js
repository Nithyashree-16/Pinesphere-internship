export const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'
export const truncate   = (s, n=80) => s?.length > n ? s.slice(0, n) + '...' : s
export const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : ''
export const getInitials = (name='') => name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2)

export const priorityColor = {
  low: '#00e5a0', medium: '#ffb347', high: '#ff4d6d', critical: '#ff0055'
}

export const statusBadgeClass = {
  'open': 'badge-open',
  'in-progress': 'badge-progress',
  'closed': 'badge-closed',
  'critical': 'badge-critical'
}
