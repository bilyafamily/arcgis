import { type NextRequest, NextResponse } from "next/server"
import { mockFacilities, mockPipelines } from "@/lib/mock-data"
import type { ApiResponse } from "@/lib/api-utils"

interface StatsData {
  facilities: {
    total: number
    byType: Record<string, number>
    byStatus: Record<string, number>
    byRegion: Record<string, number>
  }
  pipelines: {
    total: number
    byType: Record<string, number>
    byStatus: Record<string, number>
    byRegion: Record<string, number>
    totalLength: number
  }
}

export async function GET(request: NextRequest) {
  try {
    // Calculate facility statistics
    const facilityStats = {
      total: mockFacilities.length,
      byType: mockFacilities.reduce(
        (acc, facility) => {
          acc[facility.type] = (acc[facility.type] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      ),
      byStatus: mockFacilities.reduce(
        (acc, facility) => {
          acc[facility.status] = (acc[facility.status] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      ),
      byRegion: mockFacilities.reduce(
        (acc, facility) => {
          acc[facility.region] = (acc[facility.region] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      ),
    }

    // Calculate pipeline statistics
    const pipelineStats = {
      total: mockPipelines.length,
      byType: mockPipelines.reduce(
        (acc, pipeline) => {
          acc[pipeline.type] = (acc[pipeline.type] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      ),
      byStatus: mockPipelines.reduce(
        (acc, pipeline) => {
          acc[pipeline.status] = (acc[pipeline.status] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      ),
      byRegion: mockPipelines.reduce(
        (acc, pipeline) => {
          acc[pipeline.region] = (acc[pipeline.region] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      ),
      totalLength: mockPipelines.reduce((total, pipeline) => total + pipeline.length, 0),
    }

    const response: ApiResponse<StatsData> = {
      data: {
        facilities: facilityStats,
        pipelines: pipelineStats,
      },
      success: true,
      message: "Statistics retrieved successfully",
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching statistics:", error)
    return NextResponse.json(
      {
        data: null,
        success: false,
        message: "Failed to fetch statistics",
      } as ApiResponse<null>,
      { status: 500 },
    )
  }
}
