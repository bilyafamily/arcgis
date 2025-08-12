"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Download, FileText, Database } from "lucide-react"
import type { Facility, Pipeline } from "@/types"
import type { RegionSelection } from "@/types/regions"

interface ExportDialogProps {
  facilities: Facility[]
  pipelines: Pipeline[]
  regionSelection?: RegionSelection
  children: React.ReactNode
}

export function ExportDialog({ facilities, pipelines, regionSelection, children }: ExportDialogProps) {
  const [format, setFormat] = useState("json")
  const [includeData, setIncludeData] = useState({
    facilities: true,
    pipelines: true,
    regions: false,
    metadata: true,
  })
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)

    try {
      const exportData: any = {
        exportedAt: new Date().toISOString(),
        exportedBy: "Current User", // In real app, get from auth context
      }

      if (includeData.facilities) {
        exportData.facilities = facilities
      }

      if (includeData.pipelines) {
        exportData.pipelines = pipelines
      }

      if (includeData.regions && regionSelection) {
        exportData.regions = {
          selectedRegions: regionSelection.selectedRegions,
          customRegions: regionSelection.customRegions,
        }
      }

      if (includeData.metadata) {
        exportData.metadata = {
          totalFacilities: facilities.length,
          totalPipelines: pipelines.length,
          facilitiesByStatus: facilities.reduce(
            (acc, f) => {
              acc[f.status] = (acc[f.status] || 0) + 1
              return acc
            },
            {} as Record<string, number>,
          ),
          pipelinesByStatus: pipelines.reduce(
            (acc, p) => {
              acc[p.status] = (acc[p.status] || 0) + 1
              return acc
            },
            {} as Record<string, number>,
          ),
          totalPipelineLength: pipelines.reduce((sum, p) => sum + p.length, 0),
        }
      }

      // Create and download file
      let content: string
      let mimeType: string
      let filename: string

      if (format === "json") {
        content = JSON.stringify(exportData, null, 2)
        mimeType = "application/json"
        filename = `oil-facilities-export-${Date.now()}.json`
      } else if (format === "csv") {
        // Convert to CSV format
        let csvContent = ""

        if (includeData.facilities) {
          csvContent += "FACILITIES\n"
          csvContent += "ID,Name,Type,Status,Latitude,Longitude,Operator,Region,Capacity,Last Inspection\n"
          facilities.forEach((facility) => {
            csvContent +=
              [
                facility.id,
                `"${facility.name}"`,
                facility.type,
                facility.status,
                facility.coordinates.lat,
                facility.coordinates.lng,
                `"${facility.operator}"`,
                `"${facility.region}"`,
                facility.capacity || "",
                facility.lastInspection,
              ].join(",") + "\n"
          })
          csvContent += "\n"
        }

        if (includeData.pipelines) {
          csvContent += "PIPELINES\n"
          csvContent += "ID,Name,Type,Status,Length,Diameter,Pressure,Operator,Region,Last Inspection\n"
          pipelines.forEach((pipeline) => {
            csvContent +=
              [
                pipeline.id,
                `"${pipeline.name}"`,
                pipeline.type,
                pipeline.status,
                pipeline.length,
                pipeline.diameter,
                pipeline.pressure,
                `"${pipeline.operator}"`,
                `"${pipeline.region}"`,
                pipeline.lastInspection,
              ].join(",") + "\n"
          })
        }

        content = csvContent
        mimeType = "text/csv"
        filename = `oil-facilities-export-${Date.now()}.csv`
      } else {
        // XML format
        content = `<?xml version="1.0" encoding="UTF-8"?>
<export>
  <metadata>
    <exportedAt>${exportData.exportedAt}</exportedAt>
    <exportedBy>${exportData.exportedBy}</exportedBy>
  </metadata>
  ${
    includeData.facilities
      ? `<facilities>
    ${facilities
      .map(
        (f) => `<facility>
      <id>${f.id}</id>
      <name>${f.name}</name>
      <type>${f.type}</type>
      <status>${f.status}</status>
      <coordinates>
        <lat>${f.coordinates.lat}</lat>
        <lng>${f.coordinates.lng}</lng>
      </coordinates>
      <operator>${f.operator}</operator>
      <region>${f.region}</region>
      <lastInspection>${f.lastInspection}</lastInspection>
    </facility>`,
      )
      .join("\n    ")}
  </facilities>`
      : ""
  }
  ${
    includeData.pipelines
      ? `<pipelines>
    ${pipelines
      .map(
        (p) => `<pipeline>
      <id>${p.id}</id>
      <name>${p.name}</name>
      <type>${p.type}</type>
      <status>${p.status}</status>
      <length>${p.length}</length>
      <diameter>${p.diameter}</diameter>
      <pressure>${p.pressure}</pressure>
      <operator>${p.operator}</operator>
      <region>${p.region}</region>
      <lastInspection>${p.lastInspection}</lastInspection>
    </pipeline>`,
      )
      .join("\n    ")}
  </pipelines>`
      : ""
  }
</export>`
        mimeType = "application/xml"
        filename = `oil-facilities-export-${Date.now()}.xml`
      }

      // Create blob and download
      const blob = new Blob([content], { type: mimeType })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Export failed:", error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading">Export Data</DialogTitle>
          <DialogDescription>
            Choose the format and data to include in your export. Current selection includes {facilities.length}{" "}
            facilities and {pipelines.length} pipelines.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Format Selection */}
          <div>
            <Label className="text-sm font-medium">Export Format</Label>
            <RadioGroup value={format} onValueChange={setFormat} className="mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="json" id="json" />
                <Label htmlFor="json" className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  JSON (Structured data)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="csv" id="csv" />
                <Label htmlFor="csv" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  CSV (Spreadsheet compatible)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="xml" id="xml" />
                <Label htmlFor="xml" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  XML (Structured markup)
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {/* Data Selection */}
          <div>
            <Label className="text-sm font-medium">Include Data</Label>
            <div className="mt-2 space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="facilities"
                  checked={includeData.facilities}
                  onCheckedChange={(checked) => setIncludeData((prev) => ({ ...prev, facilities: !!checked }))}
                />
                <Label htmlFor="facilities" className="text-sm">
                  Facilities ({facilities.length} items)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="pipelines"
                  checked={includeData.pipelines}
                  onCheckedChange={(checked) => setIncludeData((prev) => ({ ...prev, pipelines: !!checked }))}
                />
                <Label htmlFor="pipelines" className="text-sm">
                  Pipelines ({pipelines.length} items)
                </Label>
              </div>
              {regionSelection && regionSelection.selectedRegions.length > 0 && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="regions"
                    checked={includeData.regions}
                    onCheckedChange={(checked) => setIncludeData((prev) => ({ ...prev, regions: !!checked }))}
                  />
                  <Label htmlFor="regions" className="text-sm">
                    Selected Regions ({regionSelection.selectedRegions.length} items)
                  </Label>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="metadata"
                  checked={includeData.metadata}
                  onCheckedChange={(checked) => setIncludeData((prev) => ({ ...prev, metadata: !!checked }))}
                />
                <Label htmlFor="metadata" className="text-sm">
                  Summary & Metadata
                </Label>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIncludeData({ facilities: true, pipelines: true, regions: false, metadata: true })}
            >
              Reset
            </Button>
            <Button onClick={handleExport} disabled={isExporting}>
              {isExporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
