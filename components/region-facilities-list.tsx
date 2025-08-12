'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Eye, MapPin, Settings, Gauge } from 'lucide-react';
import { FacilityDetailsDialog } from './facility-details-dialog';
import type { Facility, Pipeline } from '@/types';
import type { RegionSelection } from '@/types/regions';

interface RegionFacilitiesListProps {
  facilities: Facility[];
  pipelines: Pipeline[];
  regionSelection: RegionSelection;
  isVisible: boolean;
}

export function RegionFacilitiesList({
  facilities,
  pipelines,
  regionSelection,
  isVisible,
}: RegionFacilitiesListProps) {
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(
    null
  );
  const [selectedPipeline, setSelectedPipeline] = useState<Pipeline | null>(
    null
  );
  const [detailsOpen, setDetailsOpen] = useState(false);

  if (!isVisible || regionSelection.selectedRegions.length === 0) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-500';
      case 'maintenance':
        return 'bg-amber-500';
      case 'inactive':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleViewDetails = (
    item: Facility | Pipeline,
    type: 'facility' | 'pipeline'
  ) => {
    if (type === 'facility') {
      setSelectedFacility(item as Facility);
      setSelectedPipeline(null);
    } else {
      setSelectedPipeline(item as Pipeline);
      setSelectedFacility(null);
    }
    setDetailsOpen(true);
  };

  return (
    <>
      <Card className='absolute top-4 left-80 ml-2 w-96 max-h-[calc(100vh-2rem)] z-10 bg-green-50 border-green-200 shadow-lg'>
        <CardHeader className='pb-3 border-b border-green-200'>
          <CardTitle className='text-sm flex items-center gap-2 text-green-800'>
            <MapPin className='h-4 w-4' />
            Assets in Selected Regions
          </CardTitle>
          <p className='text-xs text-green-600'>
            {regionSelection.selectedRegions.length} region(s) selected
          </p>
        </CardHeader>
        <CardContent className='p-0'>
          <ScrollArea className='h-[calc(100vh-10rem)]'>
            <div className='p-4 space-y-4'>
              {/* Facilities */}
              {facilities.length > 0 && (
                <div className='space-y-3'>
                  <h4 className='text-xs font-medium text-green-700 mb-2 flex items-center gap-1'>
                    <Settings className='h-3 w-3' />
                    Facilities ({facilities.length})
                  </h4>
                  <div className='grid gap-2'>
                    {facilities.map((facility) => (
                      <div
                        key={facility.id}
                        className='p-3 border border-green-200 rounded-lg bg-white hover:bg-green-50 transition-colors'
                      >
                        <div className='flex items-start justify-between gap-2'>
                          <div className='flex-1 min-w-0 space-y-1'>
                            <h5 className='text-sm font-medium text-green-900 truncate'>
                              {facility.name}
                            </h5>
                            <p className='text-xs text-green-600 truncate'>
                              {facility.operator}
                            </p>
                            <div className='flex items-center gap-2'>
                              <Badge
                                variant='outline'
                                className='text-xs px-2 py-0.5 h-5 border-green-200 bg-green-100 text-green-800'
                              >
                                <div
                                  className={`w-2 h-2 rounded-full mr-1.5 ${getStatusColor(
                                    facility.status
                                  )}`}
                                />
                                {facility.status.charAt(0).toUpperCase() +
                                  facility.status.slice(1)}
                              </Badge>
                              <span className='text-xs text-green-600'>
                                {facility.type.replace('_', ' ')}
                              </span>
                            </div>
                          </div>
                          <Button
                            size='sm'
                            variant='outline'
                            className='h-7 w-7 p-0 border-green-300 text-green-700 hover:bg-green-100'
                            onClick={() =>
                              handleViewDetails(facility, 'facility')
                            }
                          >
                            <Eye className='h-3.5 w-3.5' />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Separator if both facilities and pipelines exist */}
              {facilities.length > 0 && pipelines.length > 0 && (
                <Separator className='bg-green-200' />
              )}

              {/* Pipelines */}
              {pipelines.length > 0 && (
                <div className='space-y-3'>
                  <h4 className='text-xs font-medium text-green-700 mb-2 flex items-center gap-1'>
                    <Gauge className='h-3 w-3' />
                    Pipelines ({pipelines.length})
                  </h4>
                  <div className='grid gap-2'>
                    {pipelines.map((pipeline) => (
                      <div
                        key={pipeline.id}
                        className='p-3 border border-green-200 rounded-lg bg-white hover:bg-green-50 transition-colors'
                      >
                        <div className='flex items-start justify-between gap-2'>
                          <div className='flex-1 min-w-0 space-y-1'>
                            <h5 className='text-sm font-medium text-green-900 truncate'>
                              {pipeline.name}
                            </h5>
                            <p className='text-xs text-green-600 truncate'>
                              {pipeline.operator}
                            </p>
                            <div className='flex items-center gap-2'>
                              <Badge
                                variant='outline'
                                className='text-xs px-2 py-0.5 h-5 border-green-200 bg-green-100 text-green-800'
                              >
                                <div
                                  className={`w-2 h-2 rounded-full mr-1.5 ${getStatusColor(
                                    pipeline.status
                                  )}`}
                                />
                                {pipeline.status.charAt(0).toUpperCase() +
                                  pipeline.status.slice(1)}
                              </Badge>
                              <span className='text-xs text-green-600'>
                                {pipeline.length} mi • {pipeline.diameter}"
                              </span>
                            </div>
                          </div>
                          <Button
                            size='sm'
                            variant='outline'
                            className='h-7 w-7 p-0 border-green-300 text-green-700 hover:bg-green-100'
                            onClick={() =>
                              handleViewDetails(pipeline, 'pipeline')
                            }
                          >
                            <Eye className='h-3.5 w-3.5' />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {facilities.length === 0 && pipelines.length === 0 && (
                <div className='text-center py-6'>
                  <p className='text-sm text-green-600'>
                    No assets found in selected regions
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <FacilityDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        facility={selectedFacility}
        pipeline={selectedPipeline}
      />
    </>
  );
}
