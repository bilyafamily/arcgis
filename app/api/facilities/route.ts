import { type NextRequest, NextResponse } from "next/server"
import { mockFacilities } from "@/lib/mock-data"
import { filterFacilities, paginateResults, type ApiResponse, type FacilityFilters } from "@/lib/api-utils"
import type { Facility } from "@/types"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const filters: FacilityFilters = {
      types: searchParams.get("types")?.split(",") || [],
      statuses: searchParams.get("statuses")?.split(",") || [],
      regions: searchParams.get("regions")?.split(",") || [],
      operators: searchParams.get("operators")?.split(",") || [],
      search: searchParams.get("search") || "",
      page: Number.parseInt(searchParams.get("page") || "1"),
      limit: Number.parseInt(searchParams.get("limit") || "50"),
    }

    // Filter facilities based on query parameters
    const filteredFacilities = filterFacilities(mockFacilities, filters)

    // Get total count before pagination
    const total = filteredFacilities.length

    // Apply pagination
    const paginatedFacilities = paginateResults(filteredFacilities, filters.page, filters.limit)

    const response: ApiResponse<Facility[]> = {
      data: paginatedFacilities,
      success: true,
      total,
      message: `Retrieved ${paginatedFacilities.length} of ${total} facilities`,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching facilities:", error)
    return NextResponse.json(
      {
        data: [],
        success: false,
        message: "Failed to fetch facilities",
      } as ApiResponse<Facility[]>,
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // In a real app, this would save to database
    const newFacility: Facility = {
      id: `FAC-${Date.now()}`,
      ...body,
    }

    const response: ApiResponse<Facility> = {
      data: newFacility,
      success: true,
      message: "Facility created successfully",
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error("Error creating facility:", error)
    return NextResponse.json(
      {
        data: null,
        success: false,
        message: "Failed to create facility",
      } as ApiResponse<null>,
      { status: 500 },
    )
  }
}
