import type { Region } from '@/types/regions';

export const predefinedRegions: Region[] = [
  {
    id: 'niger-delta',
    name: 'Niger Delta Basin',
    type: 'oil_basin',
    color: '#10b981',
    coordinates: [
      { lat: 5.5, lng: 5.0 },
      { lat: 5.5, lng: 7.5 },
      { lat: 4.0, lng: 7.5 },
      { lat: 4.0, lng: 5.0 },
      { lat: 5.5, lng: 5.0 },
    ],
  },
  {
    id: 'bonny-offshore',
    name: 'Bonny Offshore',
    type: 'offshore_field',
    color: '#3b82f6',
    coordinates: [
      { lat: 4.2, lng: 6.8 },
      { lat: 4.2, lng: 7.5 },
      { lat: 3.8, lng: 7.5 },
      { lat: 3.8, lng: 6.8 },
      { lat: 4.2, lng: 6.8 },
    ],
  },
  {
    id: 'lagos-deep-offshore',
    name: 'Lagos Deep Offshore',
    type: 'offshore_field',
    color: '#f59e0b',
    coordinates: [
      { lat: 5.8, lng: 3.2 },
      { lat: 5.8, lng: 4.5 },
      { lat: 4.5, lng: 4.5 },
      { lat: 4.5, lng: 3.2 },
      { lat: 5.8, lng: 3.2 },
    ],
  },
  {
    id: 'warri-area',
    name: 'Warri Area',
    type: 'oil_region',
    color: '#8b5cf6',
    coordinates: [
      { lat: 5.8, lng: 5.3 },
      { lat: 5.8, lng: 6.2 },
      { lat: 5.2, lng: 6.2 },
      { lat: 5.2, lng: 5.3 },
      { lat: 5.8, lng: 5.3 },
    ],
  },
  {
    id: 'akwa-ibom-offshore',
    name: 'Akwa Ibom Offshore',
    type: 'offshore_field',
    color: '#ef4444',
    coordinates: [
      { lat: 4.0, lng: 7.8 },
      { lat: 4.0, lng: 8.5 },
      { lat: 3.5, lng: 8.5 },
      { lat: 3.5, lng: 7.8 },
      { lat: 4.0, lng: 7.8 },
    ],
  },
  // Niger Delta Regions
  {
    id: 'niger-delta-basin',
    name: 'Niger Delta Basin',
    type: 'oil_basin',
    color: '#10b981',
    coordinates: [
      { lat: 5.5, lng: 5.0 },
      { lat: 5.5, lng: 7.5 },
      { lat: 4.0, lng: 7.5 },
      { lat: 4.0, lng: 5.0 },
      { lat: 5.5, lng: 5.0 },
    ],
  },
  {
    id: 'bonny-terminal',
    name: 'Bonny Oil Terminal',
    type: 'export_terminal',
    color: '#3b82f6',
    coordinates: [
      { lat: 4.43, lng: 7.16 },
      { lat: 4.43, lng: 7.18 },
      { lat: 4.41, lng: 7.18 },
      { lat: 4.41, lng: 7.16 },
      { lat: 4.43, lng: 7.16 },
    ],
  },

  // Lagos Deep Offshore
  {
    id: 'egina-field',
    name: 'Egina Oil Field',
    type: 'deep_offshore',
    color: '#f59e0b',
    coordinates: [
      { lat: 5.8, lng: 3.2 },
      { lat: 5.8, lng: 3.8 },
      { lat: 5.2, lng: 3.8 },
      { lat: 5.2, lng: 3.2 },
      { lat: 5.8, lng: 3.2 },
    ],
  },

  // Northern Regions
  {
    id: 'chad-basin',
    name: 'Chad Basin',
    type: 'exploration_zone',
    color: '#8b5cf6',
    coordinates: [
      { lat: 13.5, lng: 13.0 },
      { lat: 13.5, lng: 14.5 },
      { lat: 12.0, lng: 14.5 },
      { lat: 12.0, lng: 13.0 },
      { lat: 13.5, lng: 13.0 },
    ],
  },
  {
    id: 'benue-trough',
    name: 'Benue Trough',
    type: 'inland_basin',
    color: '#ef4444',
    coordinates: [
      { lat: 8.0, lng: 7.5 },
      { lat: 8.0, lng: 10.5 },
      { lat: 6.5, lng: 10.5 },
      { lat: 6.5, lng: 7.5 },
      { lat: 8.0, lng: 7.5 },
    ],
  },

  // Eastern Regions
  {
    id: 'anambra-basin',
    name: 'Anambra Basin',
    type: 'gas_region',
    color: '#ec4899',
    coordinates: [
      { lat: 6.5, lng: 6.8 },
      { lat: 6.5, lng: 7.8 },
      { lat: 5.5, lng: 7.8 },
      { lat: 5.5, lng: 6.8 },
      { lat: 6.5, lng: 6.8 },
    ],
  },

  // Western Regions
  {
    id: 'dahomey-basin',
    name: 'Dahomey Basin',
    type: 'marginal_field',
    color: '#14b8a6',
    coordinates: [
      { lat: 6.8, lng: 2.8 },
      { lat: 6.8, lng: 4.5 },
      { lat: 5.8, lng: 4.5 },
      { lat: 5.8, lng: 2.8 },
      { lat: 6.8, lng: 2.8 },
    ],
  },

  // Major Facilities
  {
    id: 'escravos-terminal',
    name: 'Escravos Terminal',
    type: 'export_terminal',
    color: '#f97316',
    coordinates: [
      { lat: 5.56, lng: 5.0 },
      { lat: 5.56, lng: 5.03 },
      { lat: 5.53, lng: 5.03 },
      { lat: 5.53, lng: 5.0 },
      { lat: 5.56, lng: 5.0 },
    ],
  },
  {
    id: 'forcados-terminal',
    name: 'Forcados Terminal',
    type: 'export_terminal',
    color: '#84cc16',
    coordinates: [
      { lat: 5.33, lng: 5.23 },
      { lat: 5.33, lng: 5.26 },
      { lat: 5.3, lng: 5.26 },
      { lat: 5.3, lng: 5.23 },
      { lat: 5.33, lng: 5.23 },
    ],
  },

  // Renewable Energy Zones
  {
    id: 'sokoto-solar-zone',
    name: 'Sokoto Solar Zone',
    type: 'renewable_energy',
    color: '#06b6d4',
    coordinates: [
      { lat: 13.0, lng: 4.5 },
      { lat: 13.0, lng: 6.0 },
      { lat: 11.5, lng: 6.0 },
      { lat: 11.5, lng: 4.5 },
      { lat: 13.0, lng: 4.5 },
    ],
  },
  {
    id: 'kanji-hydro',
    name: 'Kainji Hydro Station',
    type: 'hydro_power',
    color: '#a855f7',
    coordinates: [
      { lat: 10.1, lng: 4.6 },
      { lat: 10.1, lng: 4.63 },
      { lat: 10.07, lng: 4.63 },
      { lat: 10.07, lng: 4.6 },
      { lat: 10.1, lng: 4.6 },
    ],
  },
];

export function isPointInPolygon(
  point: { lat: number; lng: number },
  polygon: Array<{ lat: number; lng: number }>
): boolean {
  const x = point.lng;
  const y = point.lat;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lng;
    const yi = polygon[i].lat;
    const xj = polygon[j].lng;
    const yj = polygon[j].lat;

    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }

  return inside;
}

export function isPointInCircle(
  point: { lat: number; lng: number },
  center: { lat: number; lng: number },
  radius: number
): boolean {
  const R = 6371; // Earth's radius in km
  const dLat = ((point.lat - center.lat) * Math.PI) / 180;
  const dLng = ((point.lng - center.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((center.lat * Math.PI) / 180) *
      Math.cos((point.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance <= radius;
}
