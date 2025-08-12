"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MapPin, Calendar, User, Gauge, Ruler, X } from "lucide-react"
import type { Facility, Pipeline } from "@/types"

interface DataDrawerProps {
  selectedFacility?: Facility | null
  selectedPipeline?: Pipeline | null
  onClose: () => void
}

export function DataDrawer({ selectedFacility, selectedPipeline, onClose }: DataDrawerProps) {
  if (!selectedFacility && !selectedPipeline) {
    return null
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="w-96 bg-card border-l flex flex-col">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="font-heading font-bold text-lg">Asset Details</h2>
        <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {selectedFacility && (
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="font-heading">{selectedFacility.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">ID: {selectedFacility.id}</p>
                </div>
                <Badge className={getStatusColor(selectedFacility.status)}>
                  {selectedFacility.status.charAt(0).toUpperCase() + selectedFacility.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Type</label>
                  <p className="text-sm font-medium mt-1">
                    {selectedFacility.type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Region</label>
                  <p className="text-sm font-medium mt-1">{selectedFacility.region}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {selectedFacility.coordinates.lat.toFixed(4)}, {selectedFacility.coordinates.lng.toFixed(4)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{selectedFacility.operator}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Last Inspection: {formatDate(selectedFacility.lastInspection)}</span>
                </div>

                {selectedFacility.capacity && (
                  <div className="flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Capacity: {selectedFacility.capacity.toLocaleString()} bbl/day</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {selectedPipeline && (
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="font-heading">{selectedPipeline.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">ID: {selectedPipeline.id}</p>
                </div>
                <Badge className={getStatusColor(selectedPipeline.status)}>
                  {selectedPipeline.status.charAt(0).toUpperCase() + selectedPipeline.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Type</label>
                  <p className="text-sm font-medium mt-1">
                    {selectedPipeline.type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Region</label>
                  <p className="text-sm font-medium mt-1">{selectedPipeline.region}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{selectedPipeline.operator}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Last Inspection: {formatDate(selectedPipeline.lastInspection)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Ruler className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Length: {selectedPipeline.length} miles</span>
                </div>

                <div className="flex items-center gap-2">
                  <Gauge className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Diameter: {selectedPipeline.diameter}" | Pressure: {selectedPipeline.pressure} PSI
                  </span>
                </div>
              </div>

              <Separator />

              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
                  Route Coordinates
                </label>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {selectedPipeline.coordinates.map((coord, index) => (
                    <div key={index} className="text-xs font-mono bg-muted p-2 rounded">
                      Point {index + 1}: {coord.lat.toFixed(4)}, {coord.lng.toFixed(4)}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
