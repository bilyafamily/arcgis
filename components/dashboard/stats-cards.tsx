"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Activity, AlertTriangle } from "lucide-react"
import type { Facility, Pipeline } from "@/types"

interface StatsCardsProps {
  facilities: Facility[]
  pipelines: Pipeline[]
}

export function StatsCards({ facilities, pipelines }: StatsCardsProps) {
  const facilityStats = {
    total: facilities.length,
    active: facilities.filter((f) => f.status === "active").length,
    maintenance: facilities.filter((f) => f.status === "maintenance").length,
    inactive: facilities.filter((f) => f.status === "inactive").length,
  }

  const pipelineStats = {
    total: pipelines.length,
    active: pipelines.filter((p) => p.status === "active").length,
    maintenance: pipelines.filter((p) => p.status === "maintenance").length,
    inactive: pipelines.filter((p) => p.status === "inactive").length,
    totalLength: pipelines.reduce((sum, p) => sum + p.length, 0),
  }

  const activePercentage = Math.round((facilityStats.active / facilityStats.total) * 100)
  const pipelineActivePercentage = Math.round((pipelineStats.active / pipelineStats.total) * 100)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Facilities</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{facilityStats.total}</div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="text-xs">
              {facilityStats.active} Active
            </Badge>
            {facilityStats.maintenance > 0 && (
              <Badge variant="outline" className="text-xs text-yellow-600">
                {facilityStats.maintenance} Maintenance
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {activePercentage}% operational
            {activePercentage >= 90 ? (
              <TrendingUp className="inline h-3 w-3 ml-1 text-green-500" />
            ) : (
              <TrendingDown className="inline h-3 w-3 ml-1 text-red-500" />
            )}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pipeline Network</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pipelineStats.total}</div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="text-xs">
              {pipelineStats.active} Active
            </Badge>
            {pipelineStats.maintenance > 0 && (
              <Badge variant="outline" className="text-xs text-yellow-600">
                {pipelineStats.maintenance} Maintenance
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {pipelineActivePercentage}% operational
            {pipelineActivePercentage >= 90 ? (
              <TrendingUp className="inline h-3 w-3 ml-1 text-green-500" />
            ) : (
              <TrendingDown className="inline h-3 w-3 ml-1 text-red-500" />
            )}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Pipeline Length</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pipelineStats.totalLength.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">miles</p>
          <div className="mt-2">
            <Badge variant="outline" className="text-xs">
              Avg: {Math.round(pipelineStats.totalLength / pipelineStats.total)} mi/pipeline
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Maintenance Required</CardTitle>
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{facilityStats.maintenance + pipelineStats.maintenance}</div>
          <div className="flex flex-col gap-1 mt-2">
            <div className="text-xs text-muted-foreground">{facilityStats.maintenance} facilities</div>
            <div className="text-xs text-muted-foreground">{pipelineStats.maintenance} pipelines</div>
          </div>
          {facilityStats.maintenance + pipelineStats.maintenance > 0 && (
            <Badge variant="outline" className="text-xs text-yellow-600 mt-1">
              Attention Required
            </Badge>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
