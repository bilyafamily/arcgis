import { type NextRequest, NextResponse } from "next/server"
import { mockPipelines } from "@/lib/mock-data"
import type { ApiResponse } from "@/lib/api-utils"
import type { Pipeline } from "@/types"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const pipeline = mockPipelines.find((p) => p.id === params.id)

    if (!pipeline) {
      return NextResponse.json(
        {
          data: null,
          success: false,
          message: "Pipeline not found",
        } as ApiResponse<null>,
        { status: 404 },
      )
    }

    const response: ApiResponse<Pipeline> = {
      data: pipeline,
      success: true,
      message: "Pipeline retrieved successfully",
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching pipeline:", error)
    return NextResponse.json(
      {
        data: null,
        success: false,
        message: "Failed to fetch pipeline",
      } as ApiResponse<null>,
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const pipelineIndex = mockPipelines.findIndex((p) => p.id === params.id)

    if (pipelineIndex === -1) {
      return NextResponse.json(
        {
          data: null,
          success: false,
          message: "Pipeline not found",
        } as ApiResponse<null>,
        { status: 404 },
      )
    }

    // In a real app, this would update the database
    const updatedPipeline: Pipeline = {
      ...mockPipelines[pipelineIndex],
      ...body,
      id: params.id, // Ensure ID doesn't change
    }

    const response: ApiResponse<Pipeline> = {
      data: updatedPipeline,
      success: true,
      message: "Pipeline updated successfully",
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error updating pipeline:", error)
    return NextResponse.json(
      {
        data: null,
        success: false,
        message: "Failed to update pipeline",
      } as ApiResponse<null>,
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const pipelineIndex = mockPipelines.findIndex((p) => p.id === params.id)

    if (pipelineIndex === -1) {
      return NextResponse.json(
        {
          data: null,
          success: false,
          message: "Pipeline not found",
        } as ApiResponse<null>,
        { status: 404 },
      )
    }

    // In a real app, this would delete from database
    const response: ApiResponse<{ id: string }> = {
      data: { id: params.id },
      success: true,
      message: "Pipeline deleted successfully",
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error deleting pipeline:", error)
    return NextResponse.json(
      {
        data: null,
        success: false,
        message: "Failed to delete pipeline",
      } as ApiResponse<null>,
      { status: 500 },
    )
  }
}
