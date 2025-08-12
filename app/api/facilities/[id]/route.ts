import { type NextRequest, NextResponse } from "next/server"
import { mockFacilities } from "@/lib/mock-data"
import type { ApiResponse } from "@/lib/api-utils"
import type { Facility } from "@/types"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const facility = mockFacilities.find((f) => f.id === params.id)

    if (!facility) {
      return NextResponse.json(
        {
          data: null,
          success: false,
          message: "Facility not found",
        } as ApiResponse<null>,
        { status: 404 },
      )
    }

    const response: ApiResponse<Facility> = {
      data: facility,
      success: true,
      message: "Facility retrieved successfully",
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching facility:", error)
    return NextResponse.json(
      {
        data: null,
        success: false,
        message: "Failed to fetch facility",
      } as ApiResponse<null>,
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const facilityIndex = mockFacilities.findIndex((f) => f.id === params.id)

    if (facilityIndex === -1) {
      return NextResponse.json(
        {
          data: null,
          success: false,
          message: "Facility not found",
        } as ApiResponse<null>,
        { status: 404 },
      )
    }

    // In a real app, this would update the database
    const updatedFacility: Facility = {
      ...mockFacilities[facilityIndex],
      ...body,
      id: params.id, // Ensure ID doesn't change
    }

    const response: ApiResponse<Facility> = {
      data: updatedFacility,
      success: true,
      message: "Facility updated successfully",
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error updating facility:", error)
    return NextResponse.json(
      {
        data: null,
        success: false,
        message: "Failed to update facility",
      } as ApiResponse<null>,
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const facilityIndex = mockFacilities.findIndex((f) => f.id === params.id)

    if (facilityIndex === -1) {
      return NextResponse.json(
        {
          data: null,
          success: false,
          message: "Facility not found",
        } as ApiResponse<null>,
        { status: 404 },
      )
    }

    // In a real app, this would delete from database
    const response: ApiResponse<{ id: string }> = {
      data: { id: params.id },
      success: true,
      message: "Facility deleted successfully",
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error deleting facility:", error)
    return NextResponse.json(
      {
        data: null,
        success: false,
        message: "Failed to delete facility",
      } as ApiResponse<null>,
      { status: 500 },
    )
  }
}
