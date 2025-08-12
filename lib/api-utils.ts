import type { Facility, Pipeline } from "@/types"

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  total?: number
}

export interface PaginationParams {
  page?: number
  limit?: number
}

export interface FacilityFilters extends PaginationParams {
  types?: string[]
  statuses?: string[]
  regions?: string[]
  operators?: string[]
  search?: string
}

export interface PipelineFilters extends PaginationParams {
  types?: string[]
  statuses?: string[]
  regions?: string[]
  operators?: string[]
  search?: string
}

export function filterFacilities(facilities: Facility[], filters: FacilityFilters): Facility[] {
  let filtered = [...facilities]

  // Apply type filters
  if (filters.types && filters.types.length > 0) {
    filtered = filtered.filter((facility) => filters.types!.includes(facility.type))
  }

  // Apply status filters
  if (filters.statuses && filters.statuses.length > 0) {
    filtered = filtered.filter((facility) => filters.statuses!.includes(facility.status))
  }

  // Apply region filters
  if (filters.regions && filters.regions.length > 0) {
    filtered = filtered.filter((facility) =>
      filters.regions!.some((region) => facility.region.toLowerCase().includes(region.toLowerCase())),
    )
  }

  // Apply operator filters
  if (filters.operators && filters.operators.length > 0) {
    filtered = filtered.filter((facility) =>
      filters.operators!.some((operator) => facility.operator.toLowerCase().includes(operator.toLowerCase())),
    )
  }

  // Apply search query
  if (filters.search) {
    const query = filters.search.toLowerCase()
    filtered = filtered.filter(
      (facility) =>
        facility.name.toLowerCase().includes(query) ||
        facility.id.toLowerCase().includes(query) ||
        facility.operator.toLowerCase().includes(query) ||
        facility.region.toLowerCase().includes(query),
    )
  }

  return filtered
}

export function filterPipelines(pipelines: Pipeline[], filters: PipelineFilters): Pipeline[] {
  let filtered = [...pipelines]

  // Apply type filters
  if (filters.types && filters.types.length > 0) {
    filtered = filtered.filter((pipeline) => filters.types!.includes(pipeline.type))
  }

  // Apply status filters
  if (filters.statuses && filters.statuses.length > 0) {
    filtered = filtered.filter((pipeline) => filters.statuses!.includes(pipeline.status))
  }

  // Apply region filters
  if (filters.regions && filters.regions.length > 0) {
    filtered = filtered.filter((pipeline) =>
      filters.regions!.some((region) => pipeline.region.toLowerCase().includes(region.toLowerCase())),
    )
  }

  // Apply operator filters
  if (filters.operators && filters.operators.length > 0) {
    filtered = filtered.filter((pipeline) =>
      filters.operators!.some((operator) => pipeline.operator.toLowerCase().includes(operator.toLowerCase())),
    )
  }

  // Apply search query
  if (filters.search) {
    const query = filters.search.toLowerCase()
    filtered = filtered.filter(
      (pipeline) =>
        pipeline.name.toLowerCase().includes(query) ||
        pipeline.id.toLowerCase().includes(query) ||
        pipeline.operator.toLowerCase().includes(query) ||
        pipeline.region.toLowerCase().includes(query),
    )
  }

  return filtered
}

export function paginateResults<T>(items: T[], page = 1, limit = 50): T[] {
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  return items.slice(startIndex, endIndex)
}
