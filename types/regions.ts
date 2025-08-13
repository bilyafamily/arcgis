export interface Region {
  id: string;
  name: string;
  type:
    | 'oil_basin'
    | 'state'
    | 'custom'
    | 'offshore_field'
    | 'oil_region'
    | 'renewable_energy'
    | 'hydro_power'
    | 'export_terminal'
    | 'gas_region'
    | 'marginal_field'
    | 'exploration_zone'
    | 'inland_basin'
    | 'deep_offshore';
  coordinates: Array<{
    lat: number;
    lng: number;
  }>;
  color: string;
  facilities?: string[];
  pipelines?: string[];
}

export interface DrawingTool {
  type: 'rectangle' | 'polygon' | 'circle';
  isActive: boolean;
}

export interface RegionSelection {
  selectedRegions: Region[];
  drawingMode: DrawingTool | null;
  customRegions: Region[];
}
