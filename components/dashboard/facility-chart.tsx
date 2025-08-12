'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Facility } from '@/types';

interface FacilityChartProps {
  facilities: Facility[];
}

export function FacilityChart({ facilities }: FacilityChartProps) {
  // Prepare data for facility type distribution
  const typeData = facilities.reduce((acc, facility) => {
    const type = facility.type
      .replace('_', ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const typeEntries = Object.entries(typeData);
  const maxTypeCount = Math.max(...Object.values(typeData));

  // Prepare data for status distribution
  const statusData = facilities.reduce((acc, facility) => {
    const status =
      facility.status.charAt(0).toUpperCase() + facility.status.slice(1);
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusEntries = Object.entries(statusData);
  const maxStatusCount = Math.max(...Object.values(statusData));

  // Prepare data for regional distribution
  const regionData = facilities.reduce((acc, facility) => {
    acc[facility.region] = (acc[facility.region] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const regionEntries = Object.entries(regionData);
  const maxRegionCount = Math.max(...Object.values(regionData));

  const colors = [
    'bg-emerald-500',
    'bg-blue-500',
    'bg-amber-500',
    'bg-red-500',
    'bg-purple-500',
  ];

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
      <Card>
        <CardHeader>
          <CardTitle className='font-heading'>Facility Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {typeEntries.map(([name, value], index) => {
              const percentage = (value / facilities.length) * 100;
              return (
                <div key={name} className='space-y-2'>
                  <div className='flex justify-between text-sm'>
                    <span className='font-medium'>{name}</span>
                    <span className='text-muted-foreground'>
                      {value} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className='w-full bg-muted rounded-full h-2'>
                    <div
                      className={`h-2 rounded-full ${
                        colors[index % colors.length]
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className='font-heading'>Operational Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {statusEntries.map(([name, value], index) => {
              const percentage = (value / maxStatusCount) * 100;
              return (
                <div key={name} className='space-y-2'>
                  <div className='flex justify-between text-sm'>
                    <span className='font-medium'>{name}</span>
                    <span className='text-muted-foreground'>{value}</span>
                  </div>
                  <div className='w-full bg-muted rounded-full h-3'>
                    <div
                      className='h-3 rounded-full bg-emerald-500'
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className='lg:col-span-2'>
        <CardHeader>
          <CardTitle className='font-heading'>Regional Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {regionEntries.map(([name, value], index) => {
              const percentage = (value / maxRegionCount) * 100;
              return (
                <div key={name} className='space-y-2'>
                  <div className='flex justify-between text-sm'>
                    <span className='font-medium'>{name}</span>
                    <span className='text-muted-foreground'>{value}</span>
                  </div>
                  <div className='w-full bg-muted rounded-full h-3'>
                    <div
                      className='h-3 rounded-full bg-blue-500'
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
