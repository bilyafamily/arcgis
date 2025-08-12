"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import type { Facility, Pipeline } from "@/types"

interface MapContainerProps {
  facilities: Facility[]
  pipelines: Pipeline[]
  selectedFacility?: Facility | null
  selectedPipeline?: Pipeline | null
  onFacilitySelect: (facility: Facility) => void
  onPipelineSelect: (pipeline: Pipeline) => void
}

export function MapContainer({
  facilities,
  pipelines,
  selectedFacility,
  selectedPipeline,
  onFacilitySelect,
  onPipelineSelect,
}: MapContainerProps) {
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => setMapLoaded(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (!mapLoaded) {
    return (
      <div className="flex-1 bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground font-sans">Fetching geospatial data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-slate-100 relative">
      {/* Mock Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300">
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" className="text-slate-400">
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      {/* Mock Facilities */}
      <div className="absolute inset-0">
        {facilities.map((facility, index) => (
          <div
            key={facility.id}
            className={`absolute w-4 h-4 rounded-full cursor-pointer transition-all duration-200 ${
              facility.status === "active"
                ? "bg-primary"
                : facility.status === "maintenance"
                  ? "bg-yellow-500"
                  : "bg-gray-400"
            } ${selectedFacility?.id === facility.id ? "ring-4 ring-primary/30 scale-150" : "hover:scale-125"}`}
            style={{
              left: `${20 + index * 15}%`,
              top: `${30 + index * 10}%`,
            }}
            onClick={() => onFacilitySelect(facility)}
            title={`${facility.name} - ${facility.type}`}
          />
        ))}
      </div>

      {/* Mock Pipelines */}
      <div className="absolute inset-0">
        {pipelines.map((pipeline, index) => (
          <svg key={pipeline.id} className="absolute inset-0 w-full h-full pointer-events-none">
            <path
              d={`M ${15 + index * 20}% ${40 + index * 5}% Q ${50}% ${20 + index * 10}% ${80 - index * 10}% ${60 + index * 5}%`}
              stroke={
                pipeline.status === "active" ? "#10b981" : pipeline.status === "maintenance" ? "#f59e0b" : "#6b7280"
              }
              strokeWidth="3"
              fill="none"
              className="cursor-pointer hover:stroke-primary transition-colors duration-200"
              onClick={() => onPipelineSelect(pipeline)}
            />
          </svg>
        ))}
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <Card className="p-2">
          <button className="w-8 h-8 flex items-center justify-center text-sm font-bold hover:bg-accent rounded">
            +
          </button>
        </Card>
        <Card className="p-2">
          <button className="w-8 h-8 flex items-center justify-center text-sm font-bold hover:bg-accent rounded">
            -
          </button>
        </Card>
      </div>

      {/* Legend */}
      <Card className="absolute bottom-4 left-4 p-4">
        <h4 className="font-semibold mb-2 font-heading">Legend</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <span>Active Facility</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span>Maintenance</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-1 bg-accent"></div>
            <span>Active Pipeline</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
