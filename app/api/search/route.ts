import { type NextRequest, NextResponse } from "next/server"
import { mockFacilities, mockPipelines } from "@/lib/mock-data"
import type { ApiResponse } from "@/lib/api-utils"
import type { Facility, Pipeline } from "@/types"

interface SearchResult {
  facilities: Facility[]
  pipelines: Pipeline[]
  totalResults: number
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || ""
    const limit = Number.parseInt(searchParams.get("limit") || "20")

    if (!query) {
      return NextResponse.json(
        {
          data: { facilities: [], pipelines: [], totalResults: 0 },
          success: false,
          message: "Search query is required",
        } as ApiResponse<SearchResult>,
        { status: 400 },
      )
    }

    const searchQuery = query.toLowerCase()

    // Search facilities
    const matchingFacilities = mockFacilities
      .filter(
        (facility) =>
          facility.name.toLowerCase().includes(searchQuery) ||
          facility.id.toLowerCase().includes(searchQuery) ||
          facility.operator.toLowerCase().includes(searchQuery) ||
          facility.region.toLowerCase().includes(searchQuery) ||
          facility.type.toLowerCase().includes(searchQuery),
      )
      .slice(0, Math.floor(limit / 2))

    // Search pipelines
    const matchingPipelines = mockPipelines
      .filter(
        (pipeline) =>
          pipeline.name.toLowerCase().includes(searchQuery) ||
          pipeline.id.toLowerCase().includes(searchQuery) ||
          pipeline.operator.toLowerCase().includes(searchQuery) ||
          pipeline.region.toLowerCase().includes(searchQuery) ||
          pipeline.type.toLowerCase().includes(searchQuery),
      )
      .slice(0, Math.floor(limit / 2))

    const totalResults = matchingFacilities.length + matchingPipelines.length

    const response: ApiResponse<SearchResult> = {
      data: {
        facilities: matchingFacilities,
        pipelines: matchingPipelines,
        totalResults,
      },
      success: true,
      message: `Found ${totalResults} results for "${query}"`,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error performing search:", error)
    return NextResponse.json(
      {
        data: { facilities: [], pipelines: [], totalResults: 0 },
        success: false,
        message: "Search failed",
      } as ApiResponse<SearchResult>,
      { status: 500 },
    )
  }
}
