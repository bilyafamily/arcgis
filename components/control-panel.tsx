'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, ChevronDown, ChevronRight } from 'lucide-react';
import type { MapFilters } from '@/types';
import Link from 'next/link';

interface ControlPanelProps {
  filters: MapFilters;
  onFiltersChange: (filters: MapFilters) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function ControlPanel({
  filters,
  onFiltersChange,
  searchQuery,
  onSearchChange,
  isCollapsed,
  onToggleCollapse,
}: ControlPanelProps) {
  const [expandedSections, setExpandedSections] = useState({
    facilities: true,
    pipelines: true,
    status: true,
    regions: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const facilityTypes = [
    { id: 'refinery', label: 'Refineries' },
    { id: 'drilling_rig', label: 'Drilling Rigs' },
    { id: 'storage_tank', label: 'Storage Tanks' },
    { id: 'processing_plant', label: 'Processing Plants' },
    { id: 'pump_station', label: 'Pump Stations' },
  ];

  const pipelineTypes = [
    { id: 'crude_oil', label: 'Crude Oil' },
    { id: 'natural_gas', label: 'Natural Gas' },
    { id: 'refined_products', label: 'Refined Products' },
  ];

  const statuses = [
    { id: 'active', label: 'Active' },
    { id: 'maintenance', label: 'Maintenance' },
    { id: 'inactive', label: 'Inactive' },
  ];

  const regions = [
    { id: 'gulf_coast', label: 'Gulf Coast' },
    { id: 'south_texas', label: 'South Texas' },
    { id: 'oklahoma', label: 'Oklahoma' },
    { id: 'north_dakota', label: 'North Dakota' },
    { id: 'permian_basin', label: 'Permian Basin' },
  ];

  if (isCollapsed) {
    return (
      <div className='w-12 bg-gradient-to-b from-green-700 to-green-900 border-r flex flex-col items-center py-4 gap-4'>
        <Button
          variant='ghost'
          size='sm'
          onClick={onToggleCollapse}
          className='p-2 hover:bg-green-600'
        >
          <ChevronRight className='h-4 w-4 text-white' />
        </Button>
        <Button variant='ghost' size='sm' className='p-2 hover:bg-green-600'>
          <Search className='h-4 w-4 text-white' />
        </Button>
        <Button variant='ghost' size='sm' className='p-2 hover:bg-green-600'>
          <Filter className='h-4 w-4 text-white' />
        </Button>
      </div>
    );
  }

  return (
    <div className='w-80 bg-gradient-to-b from-green-700 to-green-900 border-r flex flex-col text-white'>
      {/* Header */}
      <div className='flex items-center justify-between px-2 py-3'>
        <Link href={'/'}>
          <div className='flex items-center space-x-2'>
            {/* <div className='w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center shadow-sm'>
              <Image src='logo.png' alt='nmdpra logo' height={20} width={20} />
            </div> */}
            <span className='text-lg font-bold text-white ml-2'>Home</span>
          </div>
        </Link>
      </div>
      <div className='p-4 border-b border-green-700 flex items-center justify-between'>
        <h2 className='font-heading font-bold text-lg'>Control Panel</h2>
        <Button
          variant='ghost'
          size='sm'
          onClick={onToggleCollapse}
          className='p-2 hover:bg-green-800'
        >
          <ChevronDown className='h-4 w-4 rotate-90 text-white' />
        </Button>
      </div>

      <div className='flex-1 overflow-y-auto'>
        {/* Search */}
        <div className='p-4 border-b border-green-700'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-200' />
            <Input
              placeholder='Search facilities, coordinates, or asset IDs...'
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className='pl-10 bg-green-800 border-green-700 placeholder-green-300 text-white focus-visible:ring-green-400'
            />
          </div>
        </div>

        {/* Filters */}
        <div className='p-4 space-y-4'>
          {/* Asset Type - Facilities */}
          <Card className='bg-green-800 border-green-800'>
            <CardHeader className='pb-2'>
              <CardTitle
                className='text-sm flex items-center justify-between cursor-pointer text-white'
                onClick={() => toggleSection('facilities')}
              >
                Facility Types
                {expandedSections.facilities ? (
                  <ChevronDown className='h-4 w-4 text-green-200' />
                ) : (
                  <ChevronRight className='h-4 w-4 text-green-200' />
                )}
              </CardTitle>
            </CardHeader>
            {expandedSections.facilities && (
              <CardContent className='pt-0 space-y-2'>
                {facilityTypes.map((type) => (
                  <div key={type.id} className='flex items-center space-x-2'>
                    <Checkbox
                      id={type.id}
                      checked={filters.facilityTypes.includes(type.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          onFiltersChange({
                            ...filters,
                            facilityTypes: [...filters.facilityTypes, type.id],
                          });
                        } else {
                          onFiltersChange({
                            ...filters,
                            facilityTypes: filters.facilityTypes.filter(
                              (t) => t !== type.id
                            ),
                          });
                        }
                      }}
                      className='border-green-400 data-[state=checked]:bg-green-500 data-[state=checked]:text-white'
                    />
                    <label
                      htmlFor={type.id}
                      className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white'
                    >
                      {type.label}
                    </label>
                  </div>
                ))}
              </CardContent>
            )}
          </Card>

          {/* Pipeline Types */}
          <Card className='bg-green-800 border-green-700'>
            <CardHeader className='pb-2'>
              <CardTitle
                className='text-sm flex items-center justify-between cursor-pointer text-white'
                onClick={() => toggleSection('pipelines')}
              >
                Pipeline Types
                {expandedSections.pipelines ? (
                  <ChevronDown className='h-4 w-4 text-green-200' />
                ) : (
                  <ChevronRight className='h-4 w-4 text-green-200' />
                )}
              </CardTitle>
            </CardHeader>
            {expandedSections.pipelines && (
              <CardContent className='pt-0 space-y-2'>
                {pipelineTypes.map((type) => (
                  <div key={type.id} className='flex items-center space-x-2'>
                    <Checkbox
                      id={`pipeline-${type.id}`}
                      checked={filters.pipelineTypes.includes(type.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          onFiltersChange({
                            ...filters,
                            pipelineTypes: [...filters.pipelineTypes, type.id],
                          });
                        } else {
                          onFiltersChange({
                            ...filters,
                            pipelineTypes: filters.pipelineTypes.filter(
                              (t) => t !== type.id
                            ),
                          });
                        }
                      }}
                      className='border-green-400 data-[state=checked]:bg-green-500 data-[state=checked]:text-white'
                    />
                    <label
                      htmlFor={`pipeline-${type.id}`}
                      className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white'
                    >
                      {type.label}
                    </label>
                  </div>
                ))}
              </CardContent>
            )}
          </Card>

          {/* Operational Status */}
          <Card className='bg-green-800 border-green-700'>
            <CardHeader className='pb-2'>
              <CardTitle
                className='text-sm flex items-center justify-between cursor-pointer text-white'
                onClick={() => toggleSection('status')}
              >
                Operational Status
                {expandedSections.status ? (
                  <ChevronDown className='h-4 w-4 text-green-200' />
                ) : (
                  <ChevronRight className='h-4 w-4 text-green-200' />
                )}
              </CardTitle>
            </CardHeader>
            {expandedSections.status && (
              <CardContent className='pt-0 space-y-2'>
                {statuses.map((status) => (
                  <div key={status.id} className='flex items-center space-x-2'>
                    <Checkbox
                      id={`status-${status.id}`}
                      checked={filters.statuses.includes(status.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          onFiltersChange({
                            ...filters,
                            statuses: [...filters.statuses, status.id],
                          });
                        } else {
                          onFiltersChange({
                            ...filters,
                            statuses: filters.statuses.filter(
                              (s) => s !== status.id
                            ),
                          });
                        }
                      }}
                      className='border-green-400 data-[state=checked]:bg-green-500 data-[state=checked]:text-white'
                    />
                    <label
                      htmlFor={`status-${status.id}`}
                      className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white'
                    >
                      {status.label}
                    </label>
                  </div>
                ))}
              </CardContent>
            )}
          </Card>
        </div>

        {/* Active Filters */}
        {(filters.facilityTypes.length > 0 ||
          filters.pipelineTypes.length > 0 ||
          filters.statuses.length > 0) && (
          <div className='p-4 border-t border-green-700'>
            <div className='flex items-center justify-between mb-2'>
              <span className='text-sm font-medium text-white'>
                Active Filters
              </span>
              <Button
                variant='ghost'
                size='sm'
                onClick={() =>
                  onFiltersChange({
                    facilityTypes: [],
                    pipelineTypes: [],
                    statuses: [],
                    regions: [],
                    operators: [],
                  })
                }
                className='text-xs text-white hover:bg-green-600'
              >
                Clear All
              </Button>
            </div>
            <div className='flex flex-wrap gap-1'>
              {filters.facilityTypes.map((type) => (
                <Badge
                  key={type}
                  variant='secondary'
                  className='text-xs bg-green-600 text-white'
                >
                  {facilityTypes.find((f) => f.id === type)?.label}
                </Badge>
              ))}
              {filters.pipelineTypes.map((type) => (
                <Badge
                  key={type}
                  variant='secondary'
                  className='text-xs bg-green-600 text-white'
                >
                  {pipelineTypes.find((p) => p.id === type)?.label}
                </Badge>
              ))}
              {filters.statuses.map((status) => (
                <Badge
                  key={status}
                  variant='secondary'
                  className='text-xs bg-green-600 text-white'
                >
                  {statuses.find((s) => s.id === status)?.label}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
