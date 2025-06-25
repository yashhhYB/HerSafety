export const COLORS = {
  primary: '#2c3e50',
  accent: '#FF5252',
  amber: '#FFC107',
  success: '#28a745',
  warning: '#fd7e14',
} as const;

export const EMERGENCY_NUMBERS = [
  { number: '100', label: 'Police' },
  { number: '1091', label: 'Women Helpline' },
  { number: '108', label: 'Emergency' },
  { number: '181', label: 'Women Safety' },
] as const;

export const INCIDENT_TYPES = [
  'Harassment',
  'Stalking',
  'Assault',
  'Unsafe Area',
  'Other',
] as const;

export const SAFE_ZONE_TYPES = [
  { value: 'police', label: 'Police', icon: 'shield-alt' },
  { value: 'hospital', label: 'Hospitals', icon: 'plus' },
  { value: 'ngo', label: 'NGOs', icon: 'heart' },
] as const;

export const MOCK_USER_ID = 1;
