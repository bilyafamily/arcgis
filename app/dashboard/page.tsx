"use client"

import { useState, useMemo } from "react"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { FacilityChart } from "@/components/dashboard/facility-chart"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { ExportDialog } from "@/components/export-dialog"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, RefreshCw } from "lucide-react"
import { mockFacilities, mockPipelines } from "@/lib/mock-data"
import Link from "next/link"

export default function DashboardPage() {
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    // Simulate data refresh
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setRefreshing(false)
  }

  // Calculate key metrics
  const metrics = useMemo(() => {
    const totalCapacity = mockFacilities.filter((f) => f.capacity).reduce((sum, f) => sum + (f.capacity || 0), 0)

    const avgPipelinePressure = mockPipelines.reduce((sum, p) => sum + p.pressure, 0) / mockPipelines.length

    const facilitiesNeedingInspection = mockFacilities.filter((f) => {
      const daysSinceInspection = (Date.now() - new Date(f.lastInspection).getTime()) / (1000 * 60 * 60 * 24)
      return daysSinceInspection > 90 // More than 90 days
    }).length

    const pipelinesNeedingInspection = mockPipelines.filter((p) => {
      const daysSinceInspection = (Date.now() - new Date(p.lastInspection).getTime()) / (1000 * 60 * 60 * 24)
      return daysSinceInspection > 90 // More than 90 days
    }).length

    return {
      totalCapacity,
      avgPipelinePressure,
      facilitiesNeedingInspection,
      pipelinesNeedingInspection,
    }
  }, [])

  return (
    <ProtectedRoute requiredPermissions={["view_facilities"]}>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Map
                  </Button>
                </Link>
                <div>
                  <h1 className="font-heading font-bold text-2xl text-primary">Analytics Dashboard</h1>
                  <p className="text-muted-foreground">Oil facilities and pipeline management overview</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={refreshing}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
                <ExportDialog facilities={mockFacilities} pipelines={mockPipelines}>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                </ExportDialog>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6 space-y-6">
          {/* Key Metrics */}
          <StatsCards facilities={mockFacilities} pipelines={mockPipelines} />

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.totalCapacity.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">barrels/day</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg Pipeline Pressure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Math.round(metrics.avgPipelinePressure)}</div>
                <p className="text-xs text-muted-foreground">PSI</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Inspection Due</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metrics.facilitiesNeedingInspection + metrics.pipelinesNeedingInspection}
                </div>
                <div className="flex gap-1 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {metrics.facilitiesNeedingInspection} facilities
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {metrics.pipelinesNeedingInspection} pipelines
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">98.5%</div>
                <p className="text-xs text-muted-foreground">operational</p>
                <Badge variant="secondary" className="text-xs mt-1">
                  Excellent
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <FacilityChart facilities={mockFacilities} />

          {/* Recent Activity */}
          <RecentActivity facilities={mockFacilities} pipelines={mockPipelines} />
        </div>
      </div>
    </ProtectedRoute>
  )
}
