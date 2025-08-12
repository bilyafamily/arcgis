export interface GoogleMapsConfig {
  apiKey: string;
  defaultCenter: {
    lat: number;
    lng: number;
  };
  defaultZoom: number;
  mapStyles: any[]; // Using any instead of google.maps.MapTypeStyle[]
}

export const googleMapsConfig: GoogleMapsConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
    'AIzaSyCDDFLh-vBiMJG0e4KXSsVZPx6H5lhd8UU',
  defaultCenter: {
    lat: 32.7767, // Center of Texas (oil industry hub)
    lng: -96.797,
  },
  defaultZoom: 6,
  mapStyles: [
    {
      featureType: 'all',
      elementType: 'geometry.fill',
      stylers: [{ color: '#f5f5f5' }],
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#c9c9c9' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: '#ffffff' }],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [{ color: '#dadada' }],
    },
    {
      featureType: 'landscape',
      elementType: 'geometry',
      stylers: [{ color: '#fafafa' }],
    },
    {
      featureType: 'poi',
      elementType: 'geometry',
      stylers: [{ color: '#eeeeee' }],
    },
    {
      featureType: 'administrative',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#737373' }],
    },
  ],
};

export const facilityIcons = {
  refinery: {
    url:
      'data:image/svg+xml;charset=UTF-8,' +
      encodeURIComponent(`
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="#047857" stroke="#ffffff" stroke-width="2"/>
        <path d="M8 12h8M12 8v8" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `),
    scaledSize: { width: 24, height: 24 },
    anchor: { x: 12, y: 12 },
  },
  drilling_rig: {
    url:
      'data:image/svg+xml;charset=UTF-8,' +
      encodeURIComponent(`
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon points="12,2 22,20 2,20" fill="#047857" stroke="#ffffff" stroke-width="2"/>
        <circle cx="12" cy="16" r="2" fill="#ffffff"/>
      </svg>
    `),
    scaledSize: { width: 24, height: 24 },
    anchor: { x: 12, y: 20 },
  },
  storage_tank: {
    url:
      'data:image/svg+xml;charset=UTF-8,' +
      encodeURIComponent(`
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="6" width="16" height="12" rx="2" fill="#047857" stroke="#ffffff" stroke-width="2"/>
        <circle cx="12" cy="12" r="3" fill="#ffffff"/>
      </svg>
    `),
    scaledSize: { width: 24, height: 24 },
    anchor: { x: 12, y: 18 },
  },
  processing_plant: {
    url:
      'data:image/svg+xml;charset=UTF-8,' +
      encodeURIComponent(`
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="8" width="18" height="10" rx="1" fill="#047857" stroke="#ffffff" stroke-width="2"/>
        <rect x="6" y="4" width="3" height="6" fill="#047857"/>
        <rect x="10" y="6" width="3" height="4" fill="#047857"/>
        <rect x="14" y="5" width="3" height="5" fill="#047857"/>
      </svg>
    `),
    scaledSize: { width: 24, height: 24 },
    anchor: { x: 12, y: 18 },
  },
  pump_station: {
    url:
      'data:image/svg+xml;charset=UTF-8,' +
      encodeURIComponent(`
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="8" fill="#047857" stroke="#ffffff" stroke-width="2"/>
        <path d="M8 12l4 4 4-4" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `),
    scaledSize: { width: 24, height: 24 },
    anchor: { x: 12, y: 12 },
  },
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'active':
      return '#10b981'; // emerald-500
    case 'maintenance':
      return '#f59e0b'; // amber-500
    case 'inactive':
      return '#6b7280'; // gray-500
    default:
      return '#6b7280';
  }
};
