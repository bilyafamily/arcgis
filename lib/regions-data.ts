import type { Region } from "@/types/regions"

export const predefinedRegions: Region[] = [
  {
    id: "permian-basin",
    name: "Permian Basin",
    type: "oil_basin",
    color: "#10b981",
    coordinates: [
      { lat: 33.5, lng: -104.5 },
      { lat: 33.5, lng: -101.0 },
      { lat: 31.0, lng: -101.0 },
      { lat: 31.0, lng: -104.5 },
      { lat: 33.5, lng: -104.5 },
    ],
  },
  {
    id: "eagle-ford",
    name: "Eagle Ford Shale",
    type: "oil_basin",
    color: "#3b82f6",
    coordinates: [
      { lat: 29.5, lng: -99.5 },
      { lat: 29.5, lng: -96.5 },
      { lat: 28.0, lng: -96.5 },
      { lat: 28.0, lng: -99.5 },
      { lat: 29.5, lng: -99.5 },
    ],
  },
  {
    id: "bakken",
    name: "Bakken Formation",
    type: "oil_basin",
    color: "#f59e0b",
    coordinates: [
      { lat: 48.5, lng: -104.0 },
      { lat: 48.5, lng: -100.0 },
      { lat: 46.5, lng: -100.0 },
      { lat: 46.5, lng: -104.0 },
      { lat: 48.5, lng: -104.0 },
    ],
  },
  {
    id: "texas",
    name: "Texas",
    type: "state",
    color: "#8b5cf6",
    coordinates: [
      { lat: 36.5, lng: -106.65 },
      { lat: 36.5, lng: -93.5 },
      { lat: 25.8, lng: -93.5 },
      { lat: 25.8, lng: -97.4 },
      { lat: 29.7, lng: -103.0 },
      { lat: 31.8, lng: -106.65 },
      { lat: 36.5, lng: -106.65 },
    ],
  },
  {
    id: "oklahoma",
    name: "Oklahoma",
    type: "state",
    color: "#ef4444",
    coordinates: [
      { lat: 37.0, lng: -103.0 },
      { lat: 37.0, lng: -94.4 },
      { lat: 33.6, lng: -94.4 },
      { lat: 33.6, lng: -103.0 },
      { lat: 37.0, lng: -103.0 },
    ],
  },
]

export function isPointInPolygon(
  point: { lat: number; lng: number },
  polygon: Array<{ lat: number; lng: number }>,
): boolean {
  const x = point.lng
  const y = point.lat
  let inside = false

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lng
    const yi = polygon[i].lat
    const xj = polygon[j].lng
    const yj = polygon[j].lat

    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside
    }
  }

  return inside
}

export function isPointInCircle(
  point: { lat: number; lng: number },
  center: { lat: number; lng: number },
  radius: number,
): boolean {
  const R = 6371 // Earth's radius in km
  const dLat = ((point.lat - center.lat) * Math.PI) / 180
  const dLng = ((point.lng - center.lng) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((center.lat * Math.PI) / 180) *
      Math.cos((point.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c

  return distance <= radius
}
