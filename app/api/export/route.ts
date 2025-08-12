import { type NextRequest, NextResponse } from "next/server"
import { mockFacilities, mockPipelines } from "@/lib/mock-data"
import { filterFacilities, filterPipelines, type FacilityFilters, type PipelineFilters } from "@/lib/api-utils"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const format = searchParams.get("format") || "json"

    const facilityFilters: FacilityFilters = {
      types: searchParams.get("facilityTypes")?.split(",") || [],
      statuses: searchParams.get("statuses")?.split(",") || [],
      regions: searchParams.get("regions")?.split(",") || [],
      operators: searchParams.get("operators")?.split(",") || [],
      search: searchParams.get("search") || "",
    }

    const pipelineFilters: PipelineFilters = {
      types: searchParams.get("pipelineTypes")?.split(",") || [],
      statuses: searchParams.get("statuses")?.split(",") || [],
      regions: searchParams.get("regions")?.split(",") || [],
      operators: searchParams.get("operators")?.split(",") || [],
      search: searchParams.get("search") || "",
    }

    // Filter data based on query parameters
    const filteredFacilities = filterFacilities(mockFacilities, facilityFilters)
    const filteredPipelines = filterPipelines(mockPipelines, pipelineFilters)

    const exportData = {
      facilities: filteredFacilities,
      pipelines: filteredPipelines,
      exportedAt: new Date().toISOString(),
      totalFacilities: filteredFacilities.length,
      totalPipelines: filteredPipelines.length,
    }

    if (format === "csv") {
      // Convert to CSV format
      const facilityHeaders = [
        "ID",
        "Name",
        "Type",
        "Status",
        "Latitude",
        "Longitude",
        "Operator",
        "Region",
        "Last Inspection",
      ]
      const pipelineHeaders = [
        "ID",
        "Name",
        "Type",
        "Status",
        "Length",
        "Diameter",
        "Pressure",
        "Operator",
        "Region",
        "Last Inspection",
      ]

      let csvContent = "FACILITIES\n"
      csvContent += facilityHeaders.join(",") + "\n"

      filteredFacilities.forEach((facility) => {
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
            facility.lastInspection,
          ].join(",") + "\n"
      })

      csvContent += "\nPIPELINES\n"
      csvContent += pipelineHeaders.join(",") + "\n"

      filteredPipelines.forEach((pipeline) => {
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

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="oil-facilities-export-${Date.now()}.csv"`,
        },
      })
    }

    // Default to JSON format
    return NextResponse.json(exportData, {
      headers: {
        "Content-Disposition": `attachment; filename="oil-facilities-export-${Date.now()}.json"`,
      },
    })
  } catch (error) {
    console.error("Error exporting data:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Export failed",
      },
      { status: 500 },
    )
  }
}
