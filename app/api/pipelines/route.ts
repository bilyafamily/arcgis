import { type NextRequest, NextResponse } from "next/server"
import { mockPipelines } from "@/lib/mock-data"
import { filterPipelines, paginateResults, type ApiResponse, type PipelineFilters } from "@/lib/api-utils"
import type { Pipeline } from "@/types"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const filters: PipelineFilters = {
      types: searchParams.get("types")?.split(",") || [],
      statuses: searchParams.get("statuses")?.split(",") || [],
      regions: searchParams.get("regions")?.split(",") || [],
      operators: searchParams.get("operators")?.split(",") || [],
      search: searchParams.get("search") || "",
      page: Number.parseInt(searchParams.get("page") || "1"),
      limit: Number.parseInt(searchParams.get("limit") || "50"),
    }

    // Filter pipelines based on query parameters
    const filteredPipelines = filterPipelines(mockPipelines, filters)

    // Get total count before pagination
    const total = filteredPipelines.length

    // Apply pagination
    const paginatedPipelines = paginateResults(filteredPipelines, filters.page, filters.limit)

    const response: ApiResponse<Pipeline[]> = {
      data: paginatedPipelines,
      success: true,
      total,
      message: `Retrieved ${paginatedPipelines.length} of ${total} pipelines`,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching pipelines:", error)
    return NextResponse.json(
      {
        data: [],
        success: false,
        message: "Failed to fetch pipelines",
      } as ApiResponse<Pipeline[]>,
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // In a real app, this would save to database
    const newPipeline: Pipeline = {
      id: `PIP-${Date.now()}`,
      ...body,
    }

    const response: ApiResponse<Pipeline> = {
      data: newPipeline,
      success: true,
      message: "Pipeline created successfully",
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error("Error creating pipeline:", error)
    return NextResponse.json(
      {
        data: null,
        success: false,
        message: "Failed to create pipeline",
      } as ApiResponse<null>,
      { status: 500 },
    )
  }
}
