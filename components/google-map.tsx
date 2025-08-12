'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Card } from '@/components/ui/card';
import {
  googleMapsConfig,
  facilityIcons,
  getStatusColor,
} from '@/lib/google-maps';
import { predefinedRegions, isPointInPolygon } from '@/lib/regions-data';
import { FacilityFormDialog } from './facility-form-dialog';
import type { Facility, Pipeline } from '@/types';
import type { Region, DrawingTool, RegionSelection } from '@/types/regions';

interface GoogleMapProps {
  facilities: Facility[];
  pipelines: Pipeline[];
  selectedFacility?: Facility | null;
  selectedPipeline?: Pipeline | null;
  onFacilitySelect: (facility: Facility) => void;
  onPipelineSelect: (pipeline: Pipeline) => void;
  regionSelection: RegionSelection;
  onRegionSelectionChange: (selection: RegionSelection) => void;
  drawingMode: DrawingTool | null;
  onFacilityAdd: (facility: Facility) => void;
  onPipelineAdd: (pipeline: Pipeline) => void;
}

export function GoogleMap({
  facilities,
  pipelines,
  selectedFacility,
  selectedPipeline,
  onFacilitySelect,
  onPipelineSelect,
  regionSelection,
  onRegionSelectionChange,
  drawingMode,
  onFacilityAdd,
  onPipelineAdd,
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const markersRef = useRef<any[]>([]);
  const polylinesRef = useRef<any[]>([]);
  const regionPolygonsRef = useRef<any[]>([]);
  const drawingManagerRef = useRef<any | null>(null);

  const [formDialog, setFormDialog] = useState<{
    open: boolean;
    coordinates: { lat: number; lng: number };
    type: 'facility' | 'pipeline';
  }>({
    open: false,
    coordinates: { lat: 0, lng: 0 },
    type: 'facility',
  });

  useEffect(() => {
    const initMap = async () => {
      try {
        const loader = new Loader({
          apiKey: googleMapsConfig.apiKey,
          version: 'weekly',
          libraries: ['places', 'drawing'],
        });

        await loader.load();

        if (mapRef.current && (window as any).google) {
          const google = (window as any).google;

          const mapInstance = new google.maps.Map(mapRef.current, {
            center: googleMapsConfig.defaultCenter,
            zoom: googleMapsConfig.defaultZoom,
            styles: googleMapsConfig.mapStyles,
            mapTypeControl: true,
            streetViewControl: false,
            fullscreenControl: true,
            zoomControl: true,
            mapTypeControlOptions: {
              style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
              position: google.maps.ControlPosition.TOP_RIGHT,
            },
          });

          mapInstance.addListener('rightclick', (event: any) => {
            const latLng = event.latLng;
            if (latLng) {
              setFormDialog({
                open: true,
                coordinates: { lat: latLng.lat(), lng: latLng.lng() },
                type: 'facility',
              });
            }
          });

          const drawingManager = new google.maps.drawing.DrawingManager({
            drawingMode: null,
            drawingControl: false,
            rectangleOptions: {
              fillColor: '#10b981',
              fillOpacity: 0.2,
              strokeColor: '#10b981',
              strokeOpacity: 0.8,
              strokeWeight: 2,
              editable: true,
            },
            polygonOptions: {
              fillColor: '#10b981',
              fillOpacity: 0.2,
              strokeColor: '#10b981',
              strokeOpacity: 0.8,
              strokeWeight: 2,
              editable: true,
            },
            circleOptions: {
              fillColor: '#10b981',
              fillOpacity: 0.2,
              strokeColor: '#10b981',
              strokeOpacity: 0.8,
              strokeWeight: 2,
              editable: true,
            },
          });

          drawingManager.setMap(mapInstance);
          drawingManagerRef.current = drawingManager;

          drawingManager.addListener('overlaycomplete', (event: any) => {
            const overlay = event.overlay;
            const type = event.type;

            let coordinates: Array<{ lat: number; lng: number }> = [];
            let name = '';

            if (type === 'rectangle') {
              const bounds = overlay.getBounds();
              if (bounds) {
                const ne = bounds.getNorthEast();
                const sw = bounds.getSouthWest();
                coordinates = [
                  { lat: ne.lat(), lng: sw.lng() },
                  { lat: ne.lat(), lng: ne.lng() },
                  { lat: sw.lat(), lng: ne.lng() },
                  { lat: sw.lat(), lng: sw.lng() },
                  { lat: ne.lat(), lng: sw.lng() },
                ];
                name = `Custom Rectangle ${Date.now()}`;
              }
            } else if (type === 'polygon') {
              const path = overlay.getPath();
              coordinates = path.getArray().map((latLng: any) => ({
                lat: latLng.lat(),
                lng: latLng.lng(),
              }));
              name = `Custom Polygon ${Date.now()}`;
            } else if (type === 'circle') {
              const center = overlay.getCenter();
              const radius = overlay.getRadius() / 1000; // Convert to km
              if (center) {
                const points = 32;
                coordinates = [];
                for (let i = 0; i < points; i++) {
                  const angle = (i * 360) / points;
                  const lat =
                    center.lat() +
                    (radius / 111) * Math.cos((angle * Math.PI) / 180);
                  const lng =
                    center.lng() +
                    (radius /
                      (111 * Math.cos((center.lat() * Math.PI) / 180))) *
                      Math.sin((angle * Math.PI) / 180);
                  coordinates.push({ lat, lng });
                }
                coordinates.push(coordinates[0]); // Close the polygon
                name = `Custom Circle ${Date.now()}`;
              }
            }

            if (coordinates.length > 0) {
              const newRegion: Region = {
                id: `custom-${Date.now()}`,
                name,
                type: 'custom',
                coordinates,
                color: '#10b981',
              };

              onRegionSelectionChange({
                ...regionSelection,
                customRegions: [...regionSelection.customRegions, newRegion],
                selectedRegions: [
                  ...regionSelection.selectedRegions,
                  newRegion,
                ],
                drawingMode: null,
              });
            }

            drawingManager.setDrawingMode(null);
          });

          setMap(mapInstance);
          setIsLoaded(true);
        }
      } catch (err) {
        console.error('Error loading Google Maps:', err);
        setError('Failed to load Google Maps. Please check your API key.');
      }
    };

    initMap();
  }, []);

  useEffect(() => {
    if (!drawingManagerRef.current || !(window as any).google) return;

    const google = (window as any).google;

    if (drawingMode) {
      const drawingModeMap = {
        rectangle: google.maps.drawing.OverlayType.RECTANGLE,
        polygon: google.maps.drawing.OverlayType.POLYGON,
        circle: google.maps.drawing.OverlayType.CIRCLE,
      };
      drawingManagerRef.current.setDrawingMode(
        drawingModeMap[drawingMode.type]
      );
    } else {
      drawingManagerRef.current.setDrawingMode(null);
    }
  }, [drawingMode]);

  const clearMapElements = useCallback(() => {
    markersRef.current.forEach((marker) => marker.setMap(null));
    polylinesRef.current.forEach((polyline) => polyline.setMap(null));
    regionPolygonsRef.current.forEach((polygon) => polygon.setMap(null));
    markersRef.current = [];
    polylinesRef.current = [];
    regionPolygonsRef.current = [];
  }, []);

  const getFacilitiesInRegions = useCallback((): Facility[] => {
    if (regionSelection.selectedRegions.length === 0) return facilities;

    return facilities.filter((facility) => {
      return regionSelection.selectedRegions.some((region) => {
        return isPointInPolygon(facility.coordinates, region.coordinates);
      });
    });
  }, [facilities, regionSelection.selectedRegions]);

  const getPipelinesInRegions = useCallback((): Pipeline[] => {
    if (regionSelection.selectedRegions.length === 0) return pipelines;

    return pipelines.filter((pipeline) => {
      return pipeline.coordinates.some((coord) => {
        return regionSelection.selectedRegions.some((region) => {
          return isPointInPolygon(coord, region.coordinates);
        });
      });
    });
  }, [pipelines, regionSelection.selectedRegions]);

  const addRegionPolygons = useCallback(() => {
    if (!map || !(window as any).google) return;

    const google = (window as any).google;

    predefinedRegions.forEach((region) => {
      const isSelected = regionSelection.selectedRegions.some(
        (r) => r.id === region.id
      );

      const polygon = new google.maps.Polygon({
        paths: region.coordinates,
        strokeColor: region.color,
        strokeOpacity: isSelected ? 1.0 : 0.6,
        strokeWeight: isSelected ? 3 : 2,
        fillColor: region.color,
        fillOpacity: isSelected ? 0.3 : 0.1,
        map,
      });

      regionPolygonsRef.current.push(polygon);
    });

    regionSelection.customRegions.forEach((region) => {
      const isSelected = regionSelection.selectedRegions.some(
        (r) => r.id === region.id
      );

      const polygon = new google.maps.Polygon({
        paths: region.coordinates,
        strokeColor: region.color,
        strokeOpacity: isSelected ? 1.0 : 0.6,
        strokeWeight: isSelected ? 3 : 2,
        fillColor: region.color,
        fillOpacity: isSelected ? 0.3 : 0.1,
        map,
      });

      regionPolygonsRef.current.push(polygon);
    });
  }, [map, regionSelection]);

  const addFacilityMarkers = useCallback(() => {
    if (!map || !(window as any).google) return;

    const google = (window as any).google;
    const facilitiesToShow = getFacilitiesInRegions();

    facilitiesToShow.forEach((facility) => {
      const icon = facilityIcons[facility.type] || facilityIcons.refinery;
      const statusColor = getStatusColor(facility.status);
      const iconWithStatus = {
        ...icon,
        url: icon.url.replace('#047857', statusColor),
      };

      const marker = new google.maps.Marker({
        position: facility.coordinates,
        map,
        title: facility.name,
        icon: iconWithStatus,
        animation:
          selectedFacility?.id === facility.id
            ? google.maps.Animation.BOUNCE
            : undefined,
      });

      marker.addListener('click', () => {
        onFacilitySelect(facility);
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div class="p-2">
            <h3 class="font-semibold text-sm">${facility.name}</h3>
            <p class="text-xs text-gray-600">ID: ${facility.id}</p>
            <p class="text-xs">Type: ${facility.type
              .replace('_', ' ')
              .replace(/\b\w/g, (l) => l.toUpperCase())}</p>
            <p class="text-xs">Status: ${
              facility.status.charAt(0).toUpperCase() + facility.status.slice(1)
            }</p>
            <p class="text-xs">Operator: ${facility.operator}</p>
          </div>
        `,
      });

      marker.addListener('mouseover', () => {
        infoWindow.open(map, marker);
      });

      marker.addListener('mouseout', () => {
        infoWindow.close();
      });

      markersRef.current.push(marker);
    });
  }, [map, getFacilitiesInRegions, selectedFacility, onFacilitySelect]);

  const addPipelinePolylines = useCallback(() => {
    if (!map || !(window as any).google) return;

    const google = (window as any).google;
    const pipelinesToShow = getPipelinesInRegions();

    pipelinesToShow.forEach((pipeline) => {
      const polyline = new google.maps.Polyline({
        path: pipeline.coordinates,
        geodesic: true,
        strokeColor: getStatusColor(pipeline.status),
        strokeOpacity: selectedPipeline?.id === pipeline.id ? 1.0 : 0.8,
        strokeWeight: selectedPipeline?.id === pipeline.id ? 5 : 3,
        map,
      });

      polyline.addListener('click', (event: any) => {
        onPipelineSelect(pipeline);

        const infoWindow = new google.maps.InfoWindow({
          position: event.latLng,
          content: `
            <div class="p-2">
              <h3 class="font-semibold text-sm">${pipeline.name}</h3>
              <p class="text-xs text-gray-600">ID: ${pipeline.id}</p>
              <p class="text-xs">Type: ${pipeline.type
                .replace('_', ' ')
                .replace(/\b\w/g, (l) => l.toUpperCase())}</p>
              <p class="text-xs">Status: ${
                pipeline.status.charAt(0).toUpperCase() +
                pipeline.status.slice(1)
              }</p>
              <p class="text-xs">Length: ${pipeline.length} miles</p>
              <p class="text-xs">Operator: ${pipeline.operator}</p>
            </div>
          `,
        });

        infoWindow.open(map);
        setTimeout(() => {
          infoWindow.close();
        }, 3000);
      });

      polylinesRef.current.push(polyline);
    });
  }, [map, getPipelinesInRegions, selectedPipeline, onPipelineSelect]);

  useEffect(() => {
    if (!map || !isLoaded) return;

    clearMapElements();
    addRegionPolygons();
    addFacilityMarkers();
    addPipelinePolylines();
  }, [
    map,
    isLoaded,
    facilities,
    pipelines,
    selectedFacility,
    selectedPipeline,
    regionSelection,
    clearMapElements,
    addRegionPolygons,
    addFacilityMarkers,
    addPipelinePolylines,
  ]);

  useEffect(() => {
    if (!map || !(window as any).google) return;

    const google = (window as any).google;

    if (selectedFacility) {
      map.panTo(selectedFacility.coordinates);
      map.setZoom(12);
    } else if (selectedPipeline && selectedPipeline.coordinates.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      selectedPipeline.coordinates.forEach((coord) => bounds.extend(coord));
      map.fitBounds(bounds);
    }
  }, [map, selectedFacility, selectedPipeline]);

  const handleFormSubmit = (data: any) => {
    if (formDialog.type === 'facility') {
      onFacilityAdd(data as Facility);
    } else {
      onPipelineAdd(data as Pipeline);
    }
  };

  if (error) {
    return (
      <div className='flex-1 bg-slate-100 flex items-center justify-center'>
        <Card className='p-6 max-w-md'>
          <div className='text-center'>
            <h3 className='font-semibold text-red-600 mb-2'>
              Map Loading Error
            </h3>
            <p className='text-sm text-muted-foreground mb-4'>{error}</p>
            <p className='text-xs text-muted-foreground'>
              Please ensure you have a valid Google Maps API key configured in
              your environment variables.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  // if (!isLoaded) {
  //   return (
  //     <div className='flex-1 bg-slate-100 flex items-center justify-center'>
  //       <div className='text-center'>
  //         <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4'></div>
  //         <p className='text-muted-foreground font-sans'>
  //           Loading Google Maps...
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className='flex-1 relative'>
      <div ref={mapRef} className='w-full h-full' />

      <div className='absolute top-4 right-4 flex flex-col gap-2'>
        <Card className='p-2'>
          <button
            className='w-8 h-8 flex items-center justify-center text-sm font-bold hover:bg-accent rounded'
            onClick={() => map?.setZoom((map.getZoom() || 6) + 1)}
          >
            +
          </button>
        </Card>
        <Card className='p-2'>
          <button
            className='w-8 h-8 flex items-center justify-center text-sm font-bold hover:bg-accent rounded'
            onClick={() => map?.setZoom((map.getZoom() || 6) - 1)}
          >
            -
          </button>
        </Card>
        <Card className='p-2'>
          <button
            className='w-8 h-8 flex items-center justify-center text-xs font-bold hover:bg-accent rounded'
            onClick={() => {
              map?.panTo(googleMapsConfig.defaultCenter);
              map?.setZoom(googleMapsConfig.defaultZoom);
            }}
            title='Reset View'
          >
            ⌂
          </button>
        </Card>
      </div>

      <Card className='absolute bottom-4 left-4 p-4'>
        <h4 className='font-semibold mb-2 font-heading'>Legend</h4>
        <div className='space-y-2 text-sm'>
          <div className='flex items-center gap-2'>
            <div className='w-3 h-3 rounded-full bg-emerald-500'></div>
            <span>Active</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-3 h-3 rounded-full bg-amber-500'></div>
            <span>Maintenance</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-3 h-3 rounded-full bg-gray-500'></div>
            <span>Inactive</span>
          </div>
          <div className='mt-2 pt-2 border-t border-border'>
            <div className='flex items-center gap-2 mb-1'>
              <div className='w-4 h-4 bg-primary rounded-full flex items-center justify-center'>
                <div className='w-2 h-2 bg-white rounded-full'></div>
              </div>
              <span className='text-xs'>Facilities</span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='w-4 h-1 bg-emerald-500'></div>
              <span className='text-xs'>Pipelines</span>
            </div>
            {regionSelection.selectedRegions.length > 0 && (
              <div className='flex items-center gap-2 mt-1'>
                <div className='w-4 h-3 bg-emerald-500 opacity-30 border border-emerald-500'></div>
                <span className='text-xs'>Selected Regions</span>
              </div>
            )}
          </div>
        </div>
        <div className='mt-2 pt-2 border-t border-border'>
          <p className='text-xs text-muted-foreground'>
            Right-click on map to add facilities
          </p>
        </div>
      </Card>

      <FacilityFormDialog
        open={formDialog.open}
        onOpenChange={(open) => setFormDialog({ ...formDialog, open })}
        coordinates={formDialog.coordinates}
        type={formDialog.type}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}
