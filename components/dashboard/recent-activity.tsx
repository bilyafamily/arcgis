"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Wrench, AlertCircle } from "lucide-react"
import type { Facility, Pipeline } from "@/types"

interface RecentActivityProps {
  facilities: Facility[]
  pipelines: Pipeline[]
}

export function RecentActivity({ facilities, pipelines }: RecentActivityProps) {
  // Generate mock recent activity based on inspection dates
  const allAssets = [
    ...facilities.map((f) => ({ ...f, type: "facility" as const })),
    ...pipelines.map((p) => ({ ...p, type: "pipeline" as const })),
  ]

  // Sort by last inspection date (most recent first)
  const recentActivity = allAssets
    .sort((a, b) => new Date(b.lastInspection).getTime() - new Date(a.lastInspection).getTime())
    .slice(0, 8)

  const getActivityIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Calendar className="h-4 w-4 text-green-500" />
      case "maintenance":
        return <Wrench className="h-4 w-4 text-yellow-500" />
      case "inactive":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <MapPin className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800"
      case "inactive":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading">Recent Inspections</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivity.map((asset) => (
            <div key={asset.id} className="flex items-center space-x-4 p-3 rounded-lg border">
              <div className="flex-shrink-0">{getActivityIcon(asset.status)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium truncate">{asset.name}</p>
                  <Badge variant="outline" className="text-xs">
                    {asset.type}
                  </Badge>
                  <Badge className={`text-xs ${getStatusColor(asset.status)}`} variant="secondary">
                    {asset.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>ID: {asset.id}</span>
                  <span>{asset.operator}</span>
                  <span>{asset.region}</span>
                </div>
              </div>
              <div className="flex-shrink-0 text-right">
                <p className="text-xs text-muted-foreground">Last Inspection</p>
                <p className="text-sm font-medium">{formatDate(asset.lastInspection)}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
