export interface Facility {
  id: string;
  name: string;
  type:
    | 'refinery'
    | 'drilling_rig'
    | 'storage_tank'
    | 'processing_plant'
    | 'pump_station';
  status: 'active' | 'maintenance' | 'inactive';
  coordinates: {
    lat: number;
    lng: number;
  };
  capacity?: number;
  lastInspection: string;
  operator: string;
  region: string;
  description?: string;
}

export interface Pipeline {
  id: string;
  name: string;
  type: 'crude_oil' | 'natural_gas' | 'refined_products';
  status: 'active' | 'maintenance' | 'inactive';
  coordinates: Array<{
    lat: number;
    lng: number;
  }>;
  diameter: number;
  length: number;
  pressure: number;
  material?: string;
  lastInspection: string;
  operator: string;
  region: string;
  description?: string;
}

export interface MapFilters {
  facilityTypes: string[];
  pipelineTypes: string[];
  statuses: string[];
  regions: string[];
  operators: string[];
}
