export interface Region {
  id: string
  name: string
  type: "oil_basin" | "state" | "custom"
  coordinates: Array<{
    lat: number
    lng: number
  }>
  color: string
  facilities?: string[]
  pipelines?: string[]
}

export interface DrawingTool {
  type: "rectangle" | "polygon" | "circle"
  isActive: boolean
}

export interface RegionSelection {
  selectedRegions: Region[]
  drawingMode: DrawingTool | null
  customRegions: Region[]
}
