'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MapPin, Calendar, User, Settings, Gauge } from 'lucide-react';
import type { Facility, Pipeline } from '@/types';

interface FacilityDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  facility?: Facility | null;
  pipeline?: Pipeline | null;
}

export function FacilityDetailsDialog({
  open,
  onOpenChange,
  facility,
  pipeline,
}: FacilityDetailsDialogProps) {
  const item = facility || pipeline;
  if (!item) return null;

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-lg'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            {facility ? (
              <Settings className='h-5 w-5' />
            ) : (
              <Gauge className='h-5 w-5' />
            )}
            {item.name}
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-4'>
          {/* Status and Type */}
          <div className='flex items-center gap-4'>
            <Badge variant='outline' className='flex items-center gap-1'>
              <div
                className={`w-2 h-2 rounded-full ${getStatusColor(
                  item.status
                )}`}
              ></div>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Badge>
            <Badge variant='secondary'>
              {item.type
                .replace('_', ' ')
                .replace(/\b\w/g, (l) => l.toUpperCase())}
            </Badge>
          </div>

          <Separator />

          {/* Basic Information */}
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <div className='flex items-center gap-2 text-sm'>
                <User className='h-4 w-4 text-muted-foreground' />
                <span className='font-medium'>Operator:</span>
              </div>
              <p className='text-sm text-muted-foreground ml-6'>
                {item.operator}
              </p>
            </div>

            <div className='space-y-2'>
              <div className='flex items-center gap-2 text-sm'>
                <MapPin className='h-4 w-4 text-muted-foreground' />
                <span className='font-medium'>Region:</span>
              </div>
              <p className='text-sm text-muted-foreground ml-6'>
                {item.region || 'Not specified'}
              </p>
            </div>
          </div>

          {/* Coordinates */}
          <div className='space-y-2'>
            <div className='flex items-center gap-2 text-sm'>
              <MapPin className='h-4 w-4 text-muted-foreground' />
              <span className='font-medium'>Coordinates:</span>
            </div>
            <p className='text-sm text-muted-foreground ml-6'>
              {facility
                ? `${facility.coordinates.lat.toFixed(
                    6
                  )}, ${facility.coordinates.lng.toFixed(6)}`
                : `${pipeline?.coordinates.length} coordinate points`}
            </p>
          </div>

          {/* Facility-specific information */}
          {facility && (
            <>
              <Separator />
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <div className='flex items-center gap-2 text-sm'>
                    <Calendar className='h-4 w-4 text-muted-foreground' />
                    <span className='font-medium'>Last Inspection:</span>
                  </div>
                  <p className='text-sm text-muted-foreground ml-6'>
                    {new Date(facility.lastInspection).toLocaleDateString()}
                  </p>
                </div>

                <div className='space-y-2'>
                  <div className='flex items-center gap-2 text-sm'>
                    <Gauge className='h-4 w-4 text-muted-foreground' />
                    <span className='font-medium'>Capacity:</span>
                  </div>
                  <p className='text-sm text-muted-foreground ml-6'>
                    {facility?.capacity?.toLocaleString()} barrels/day
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Pipeline-specific information */}
          {pipeline && (
            <>
              <Separator />
              <div className='grid grid-cols-3 gap-4'>
                <div className='space-y-2'>
                  <div className='flex items-center gap-2 text-sm'>
                    <Gauge className='h-4 w-4 text-muted-foreground' />
                    <span className='font-medium'>Diameter:</span>
                  </div>
                  <p className='text-sm text-muted-foreground ml-6'>
                    {pipeline.diameter}" inches
                  </p>
                </div>

                <div className='space-y-2'>
                  <div className='flex items-center gap-2 text-sm'>
                    <MapPin className='h-4 w-4 text-muted-foreground' />
                    <span className='font-medium'>Length:</span>
                  </div>
                  <p className='text-sm text-muted-foreground ml-6'>
                    {pipeline.length} miles
                  </p>
                </div>

                <div className='space-y-2'>
                  <div className='flex items-center gap-2 text-sm'>
                    <Gauge className='h-4 w-4 text-muted-foreground' />
                    <span className='font-medium'>Pressure:</span>
                  </div>
                  <p className='text-sm text-muted-foreground ml-6'>
                    {pipeline.pressure} PSI
                  </p>
                </div>
              </div>

              <div className='space-y-2'>
                <div className='flex items-center gap-2 text-sm'>
                  <Settings className='h-4 w-4 text-muted-foreground' />
                  <span className='font-medium'>Material:</span>
                </div>
                <p className='text-sm text-muted-foreground ml-6'>
                  {pipeline.material
                    ? pipeline.material.charAt(0).toUpperCase() +
                      pipeline.material.slice(1)
                    : 'Steel'}
                </p>
              </div>
            </>
          )}

          {/* Description */}
          {item.description && (
            <>
              <Separator />
              <div className='space-y-2'>
                <span className='font-medium text-sm'>Description:</span>
                <p className='text-sm text-muted-foreground'>
                  {item.description}
                </p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
