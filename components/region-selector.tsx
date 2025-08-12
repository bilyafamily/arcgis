"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Square, Circle, Pentagon, Trash2, Eye, EyeOff } from "lucide-react"
import { predefinedRegions } from "@/lib/regions-data"
import type { Region, DrawingTool, RegionSelection } from "@/types/regions"

interface RegionSelectorProps {
  regionSelection: RegionSelection
  onRegionSelectionChange: (selection: RegionSelection) => void
  onDrawingModeChange: (tool: DrawingTool | null) => void
  selectedFacilitiesCount: number
  selectedPipelinesCount: number
}

export function RegionSelector({
  regionSelection,
  onRegionSelectionChange,
  onDrawingModeChange,
  selectedFacilitiesCount,
  selectedPipelinesCount,
}: RegionSelectorProps) {
  const [showPredefined, setShowPredefined] = useState(true)
  const [showCustom, setShowCustom] = useState(true)

  const handlePredefinedRegionToggle = (region: Region, checked: boolean) => {
    const newSelectedRegions = checked
      ? [...regionSelection.selectedRegions, region]
      : regionSelection.selectedRegions.filter((r) => r.id !== region.id)

    onRegionSelectionChange({
      ...regionSelection,
      selectedRegions: newSelectedRegions,
    })
  }

  const handleDrawingToolSelect = (type: DrawingTool["type"]) => {
    const newTool: DrawingTool = {
      type,
      isActive: true,
    }
    onDrawingModeChange(newTool)
    onRegionSelectionChange({
      ...regionSelection,
      drawingMode: newTool,
    })
  }

  const handleStopDrawing = () => {
    onDrawingModeChange(null)
    onRegionSelectionChange({
      ...regionSelection,
      drawingMode: null,
    })
  }

  const handleDeleteCustomRegion = (regionId: string) => {
    const newCustomRegions = regionSelection.customRegions.filter((r) => r.id !== regionId)
    const newSelectedRegions = regionSelection.selectedRegions.filter((r) => r.id !== regionId)

    onRegionSelectionChange({
      ...regionSelection,
      customRegions: newCustomRegions,
      selectedRegions: newSelectedRegions,
    })
  }

  const handleClearAllSelections = () => {
    onRegionSelectionChange({
      selectedRegions: [],
      drawingMode: null,
      customRegions: regionSelection.customRegions,
    })
    onDrawingModeChange(null)
  }

  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle className="font-heading text-lg flex items-center justify-between">
          Region Selection
          {regionSelection.selectedRegions.length > 0 && (
            <Button variant="ghost" size="sm" onClick={handleClearAllSelections}>
              Clear All
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Selection Summary */}
        {regionSelection.selectedRegions.length > 0 && (
          <div className="p-3 bg-accent/20 rounded-lg">
            <h4 className="font-medium text-sm mb-2">Selection Summary</h4>
            <div className="flex gap-2 text-xs">
              <Badge variant="secondary">{selectedFacilitiesCount} Facilities</Badge>
              <Badge variant="secondary">{selectedPipelinesCount} Pipelines</Badge>
            </div>
            <div className="mt-2">
              <p className="text-xs text-muted-foreground">
                {regionSelection.selectedRegions.length} region(s) selected
              </p>
            </div>
          </div>
        )}

        {/* Drawing Tools */}
        <div>
          <h4 className="font-medium text-sm mb-2">Drawing Tools</h4>
          <div className="flex gap-2">
            <Button
              variant={regionSelection.drawingMode?.type === "rectangle" ? "default" : "outline"}
              size="sm"
              onClick={() => handleDrawingToolSelect("rectangle")}
            >
              <Square className="h-4 w-4 mr-1" />
              Rectangle
            </Button>
            <Button
              variant={regionSelection.drawingMode?.type === "polygon" ? "default" : "outline"}
              size="sm"
              onClick={() => handleDrawingToolSelect("polygon")}
            >
              <Pentagon className="h-4 w-4 mr-1" />
              Polygon
            </Button>
            <Button
              variant={regionSelection.drawingMode?.type === "circle" ? "default" : "outline"}
              size="sm"
              onClick={() => handleDrawingToolSelect("circle")}
            >
              <Circle className="h-4 w-4 mr-1" />
              Circle
            </Button>
          </div>
          {regionSelection.drawingMode && (
            <div className="mt-2">
              <Button variant="ghost" size="sm" onClick={handleStopDrawing}>
                Stop Drawing
              </Button>
              <p className="text-xs text-muted-foreground mt-1">
                {regionSelection.drawingMode.type === "rectangle" && "Click and drag to draw a rectangle"}
                {regionSelection.drawingMode.type === "polygon" && "Click to add points, double-click to finish"}
                {regionSelection.drawingMode.type === "circle" && "Click center, then drag to set radius"}
              </p>
            </div>
          )}
        </div>

        <Separator />

        {/* Predefined Regions */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-sm">Predefined Regions</h4>
            <Button variant="ghost" size="sm" onClick={() => setShowPredefined(!showPredefined)}>
              {showPredefined ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          {showPredefined && (
            <div className="space-y-2">
              {predefinedRegions.map((region) => (
                <div key={region.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={region.id}
                    checked={regionSelection.selectedRegions.some((r) => r.id === region.id)}
                    onCheckedChange={(checked) => handlePredefinedRegionToggle(region, !!checked)}
                  />
                  <div className="flex items-center gap-2 flex-1">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: region.color }}></div>
                    <label htmlFor={region.id} className="text-sm font-medium leading-none cursor-pointer">
                      {region.name}
                    </label>
                    <Badge variant="outline" className="text-xs">
                      {region.type.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Custom Regions */}
        {regionSelection.customRegions.length > 0 && (
          <>
            <Separator />
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm">Custom Regions</h4>
                <Button variant="ghost" size="sm" onClick={() => setShowCustom(!showCustom)}>
                  {showCustom ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {showCustom && (
                <div className="space-y-2">
                  {regionSelection.customRegions.map((region) => (
                    <div key={region.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={region.id}
                        checked={regionSelection.selectedRegions.some((r) => r.id === region.id)}
                        onCheckedChange={(checked) => {
                          const newSelectedRegions = checked
                            ? [...regionSelection.selectedRegions, region]
                            : regionSelection.selectedRegions.filter((r) => r.id !== region.id)

                          onRegionSelectionChange({
                            ...regionSelection,
                            selectedRegions: newSelectedRegions,
                          })
                        }}
                      />
                      <div className="flex items-center gap-2 flex-1">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: region.color }}></div>
                        <label htmlFor={region.id} className="text-sm font-medium leading-none cursor-pointer">
                          {region.name}
                        </label>
                        <Badge variant="outline" className="text-xs">
                          custom
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCustomRegion(region.id)}
                        className="p-1 h-6 w-6"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Active Selections */}
        {regionSelection.selectedRegions.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="font-medium text-sm mb-2">Active Selections</h4>
              <div className="flex flex-wrap gap-1">
                {regionSelection.selectedRegions.map((region) => (
                  <Badge key={region.id} variant="secondary" className="text-xs">
                    {region.name}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
