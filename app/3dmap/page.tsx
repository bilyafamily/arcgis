'use client';
import Map3D from '@/components/3DMap';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { CommandBar } from '@/components/command-bar';
import { ControlPanel } from '@/components/control-panel';
import { mockFacilities, mockPipelines } from '@/lib/mock-data';
import { Facility, Pipeline, MapFilters } from '@/types';
import { RegionSelection } from '@/types/regions';
import { useState } from 'react';

export default function HomePage() {
  const [facilities, setFacilities] = useState<Facility[]>(mockFacilities);
  const [pipelines, setPipelines] = useState<Pipeline[]>(mockPipelines);

  const [filters, setFilters] = useState<MapFilters>({
    facilityTypes: [],
    pipelineTypes: [],
    statuses: [],
    regions: [],
    operators: [],
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(
    null
  );
  const [selectedPipeline, setSelectedPipeline] = useState<Pipeline | null>(
    null
  );
  const [controlPanelCollapsed, setControlPanelCollapsed] = useState(false);
  const [showRegionSelector, setShowRegionSelector] = useState(false);
  const [showRegionFacilitiesList, setShowRegionFacilitiesList] =
    useState(false);

  const [regionSelection, setRegionSelection] = useState<RegionSelection>({
    selectedRegions: [],
    drawingMode: null,
    customRegions: [],
  });
  return (
    <ProtectedRoute requiredPermissions={['view_facilities']}>
      <div className='h-screen flex flex-col'>
        {/* <CommandBar
            facilityCount={facilitiesInRegions.length}
            pipelineCount={pipelinesInRegions.length}
            onResetView={handleResetView}
            onExport={handleExport}
            facilities={facilitiesInRegions}
            pipelines={pipelinesInRegions}
            regionSelection={regionSelection}
            onZoomToSelection={handleZoomToSelection}
            onToggleLayers={handleToggleLayers}
            onSaveView={handleSaveView}
            onShowSettings={handleShowSettings}
          /> */}

        <div className='flex-1 flex relative w-full'>
          {/* Control Panel (Menu) - will stay on the left */}
          <ControlPanel
            filters={filters}
            onFiltersChange={setFilters}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            isCollapsed={controlPanelCollapsed}
            onToggleCollapse={() =>
              setControlPanelCollapsed(!controlPanelCollapsed)
            }
          />

          {/* Main content area - will take remaining space */}
          <div className='flex-1 relative min-w-0'>
            <Map3D />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
