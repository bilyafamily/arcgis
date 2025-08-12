'use client';

import { useState, useMemo } from 'react';
import { GoogleMap } from '@/components/google-map';
import { ControlPanel } from '@/components/control-panel';
import { RegionSelector } from '@/components/region-selector';
import { DataDrawer } from '@/components/data-drawer';
import { CommandBar } from '@/components/command-bar';
import { RegionFacilitiesList } from '@/components/region-facilities-list';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { mockFacilities, mockPipelines } from '@/lib/mock-data';
import { isPointInPolygon } from '@/lib/regions-data';
import type { Facility, Pipeline, MapFilters } from '@/types';
import type { RegionSelection, DrawingTool } from '@/types/regions';

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

  const [drawingMode, setDrawingMode] = useState<DrawingTool | null>(null);

  // Filter facilities and pipelines based on current filters and search
  const filteredFacilities = useMemo(() => {
    return facilities.filter((facility) => {
      // Apply type filters
      if (
        filters.facilityTypes.length > 0 &&
        !filters.facilityTypes.includes(facility.type)
      ) {
        return false;
      }

      // Apply status filters
      if (
        filters.statuses.length > 0 &&
        !filters.statuses.includes(facility.status)
      ) {
        return false;
      }

      // Apply search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          facility.name.toLowerCase().includes(query) ||
          facility.id.toLowerCase().includes(query) ||
          facility.operator.toLowerCase().includes(query) ||
          facility.region.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [facilities, filters, searchQuery]);

  const filteredPipelines = useMemo(() => {
    return pipelines.filter((pipeline) => {
      // Apply type filters
      if (
        filters.pipelineTypes.length > 0 &&
        !filters.pipelineTypes.includes(pipeline.type)
      ) {
        return false;
      }

      // Apply status filters
      if (
        filters.statuses.length > 0 &&
        !filters.statuses.includes(pipeline.status)
      ) {
        return false;
      }

      // Apply search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          pipeline.name.toLowerCase().includes(query) ||
          pipeline.id.toLowerCase().includes(query) ||
          pipeline.operator.toLowerCase().includes(query) ||
          pipeline.region.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [pipelines, filters, searchQuery]);

  // Get facilities within selected regions
  const facilitiesInRegions = useMemo(() => {
    if (regionSelection.selectedRegions.length === 0) return filteredFacilities;

    return filteredFacilities.filter((facility) => {
      return regionSelection.selectedRegions.some((region) => {
        return isPointInPolygon(facility.coordinates, region.coordinates);
      });
    });
  }, [filteredFacilities, regionSelection.selectedRegions]);

  // Get pipelines within selected regions
  const pipelinesInRegions = useMemo(() => {
    if (regionSelection.selectedRegions.length === 0) return filteredPipelines;

    return filteredPipelines.filter((pipeline) => {
      return pipeline.coordinates.some((coord) => {
        return regionSelection.selectedRegions.some((region) => {
          return isPointInPolygon(coord, region.coordinates);
        });
      });
    });
  }, [filteredPipelines, regionSelection.selectedRegions]);

  const handleFacilitySelect = (facility: Facility) => {
    setSelectedFacility(facility);
    setSelectedPipeline(null);
  };

  const handlePipelineSelect = (pipeline: Pipeline) => {
    setSelectedPipeline(pipeline);
    setSelectedFacility(null);
  };

  const handleCloseDrawer = () => {
    setSelectedFacility(null);
    setSelectedPipeline(null);
  };

  const handleFacilityAdd = (newFacility: Facility) => {
    setFacilities((prev) => [...prev, newFacility]);
  };

  const handlePipelineAdd = (newPipeline: Pipeline) => {
    setPipelines((prev) => [...prev, newPipeline]);
  };

  const handleResetView = () => {
    setFilters({
      facilityTypes: [],
      pipelineTypes: [],
      statuses: [],
      regions: [],
      operators: [],
    });
    setSearchQuery('');
    setSelectedFacility(null);
    setSelectedPipeline(null);
    setRegionSelection({
      selectedRegions: [],
      drawingMode: null,
      customRegions: regionSelection.customRegions,
    });
    setDrawingMode(null);
  };

  const handleExport = () => {
    // Mock export functionality
    console.log('Exporting data...', {
      facilitiesInRegions,
      pipelinesInRegions,
    });
  };

  const handleZoomToSelection = () => {
    console.log('Zooming to selection...');
    // This would be implemented in the map component
  };

  const handleToggleLayers = () => {
    setShowRegionFacilitiesList(!showRegionFacilitiesList);
  };

  const handleSaveView = () => {
    const viewState = {
      filters,
      searchQuery,
      regionSelection,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('oil-facilities-view', JSON.stringify(viewState));
    console.log('View saved to localStorage');
  };

  const handleShowSettings = () => {
    console.log('Opening settings...');
    // This would open a settings dialog
  };

  return (
    <ProtectedRoute requiredPermissions={['view_facilities']}>
      <div className='h-screen flex flex-col'>
        <CommandBar
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
        />

        <div className='flex-1 flex relative'>
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

          <GoogleMap
            facilities={filteredFacilities}
            pipelines={filteredPipelines}
            selectedFacility={selectedFacility}
            selectedPipeline={selectedPipeline}
            onFacilitySelect={handleFacilitySelect}
            onPipelineSelect={handlePipelineSelect}
            regionSelection={regionSelection}
            onRegionSelectionChange={setRegionSelection}
            drawingMode={drawingMode}
            onFacilityAdd={handleFacilityAdd}
            onPipelineAdd={handlePipelineAdd}
          />

          <RegionFacilitiesList
            facilities={facilitiesInRegions}
            pipelines={pipelinesInRegions}
            regionSelection={regionSelection}
            isVisible={showRegionFacilitiesList}
          />

          {/* Region Selector Panel */}
          {showRegionSelector && (
            <RegionSelector
              regionSelection={regionSelection}
              onRegionSelectionChange={setRegionSelection}
              onDrawingModeChange={setDrawingMode}
              selectedFacilitiesCount={facilitiesInRegions.length}
              selectedPipelinesCount={pipelinesInRegions.length}
            />
          )}

          {(selectedFacility || selectedPipeline) && (
            <DataDrawer
              selectedFacility={selectedFacility}
              selectedPipeline={selectedPipeline}
              onClose={handleCloseDrawer}
            />
          )}
        </div>

        {/* Region Selector Toggle */}
        <button
          className='fixed bottom-4 right-4 bg-primary text-primary-foreground p-3 rounded-full shadow-lg hover:bg-primary/90 transition-colors'
          onClick={() => setShowRegionSelector(!showRegionSelector)}
          title='Toggle Region Selection'
        >
          <svg
            width='20'
            height='20'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <polygon points='3,6 9,6 12,1 15,6 21,6 18,10 21,14 15,14 12,19 9,14 3,14 6,10' />
          </svg>
        </button>
      </div>
    </ProtectedRoute>
  );
}
