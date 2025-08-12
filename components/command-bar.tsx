'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ExportDialog } from '@/components/export-dialog';
import {
  Save,
  Download,
  RotateCcw,
  ZoomIn,
  Layers,
  Settings,
  BarChart3,
} from 'lucide-react';
import { UserMenu } from '@/components/auth/user-menu';
import Link from 'next/link';
import type { Facility, Pipeline } from '@/types';
import type { RegionSelection } from '@/types/regions';
import Image from 'next/image';

interface CommandBarProps {
  facilityCount: number;
  pipelineCount: number;
  onResetView: () => void;
  onExport: () => void;
  facilities?: Facility[];
  pipelines?: Pipeline[];
  regionSelection?: RegionSelection;
  onZoomToSelection: () => void;
  onToggleLayers: () => void;
  onSaveView: () => void;
  onShowSettings: () => void;
}

export function CommandBar({
  facilityCount,
  pipelineCount,
  onResetView,
  onExport,
  facilities = [],
  pipelines = [],
  regionSelection,
  onZoomToSelection,
  onToggleLayers,
  onSaveView,
  onShowSettings,
}: CommandBarProps) {
  return (
    <div className='h-14 bg-gradient-to-r from-green-700 to-green-900 border-b border-green-700 flex items-center justify-between px-4 text-white'>
      {/* Left Section - Logo and Title */}
      <div className='flex items-center gap-4'>
        <div className='flex items-center'>
          <div className='w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center shadow-sm'>
            <Image src='logo.png' alt='nmdpra logo' height={20} width={20} />
          </div>
          <span className='text-3xl font-bold text-white ml-2'>NMDPRA GIS</span>
        </div>

        <Separator orientation='vertical' className='h-6 bg-green-600' />

        {/* Stats */}
        <div className='flex items-center gap-3'>
          <Badge
            variant='secondary'
            className='text-xs bg-green-600 text-white'
          >
            {facilityCount} Facilities
          </Badge>
          <Badge
            variant='secondary'
            className='text-xs bg-green-600 text-white'
          >
            {pipelineCount} Pipelines
          </Badge>
        </div>
      </div>

      {/* Right Section - Actions */}
      <div className='flex items-center gap-2'>
        <Link href='/dashboard'>
          <Button
            variant='ghost'
            size='sm'
            className='text-white hover:bg-green-600'
          >
            <BarChart3 className='h-4 w-4 mr-2' />
            Dashboard
          </Button>
        </Link>

        <Button
          variant='ghost'
          size='sm'
          onClick={onResetView}
          className='text-white hover:bg-green-600'
        >
          <RotateCcw className='h-4 w-4 mr-2' />
          Reset View
        </Button>

        <Button
          variant='ghost'
          size='sm'
          onClick={onZoomToSelection}
          className='text-white hover:bg-green-600'
        >
          <ZoomIn className='h-4 w-4 mr-2' />
          Zoom to Selection
        </Button>

        <Button
          variant='ghost'
          size='sm'
          onClick={onToggleLayers}
          className='text-white hover:bg-green-600'
        >
          <Layers className='h-4 w-4 mr-2' />
          Layers
        </Button>

        <Separator orientation='vertical' className='h-6 bg-green-600' />

        <Button
          variant='ghost'
          size='sm'
          onClick={onSaveView}
          className='text-white hover:bg-green-600'
        >
          <Save className='h-4 w-4 mr-2' />
          Save View
        </Button>

        <ExportDialog
          facilities={facilities}
          pipelines={pipelines}
          regionSelection={regionSelection}
        >
          <Button
            variant='outline'
            size='sm'
            className='bg-green-600 text-white border-green-500 hover:bg-green-700 hover:text-white'
          >
            <Download className='h-4 w-4 mr-2' />
            Export
          </Button>
        </ExportDialog>

        <Button
          variant='ghost'
          size='sm'
          onClick={onShowSettings}
          className='text-white hover:bg-green-600'
        >
          <Settings className='h-4 w-4' />
        </Button>

        <Separator orientation='vertical' className='h-6 bg-green-600' />

        <UserMenu />
      </div>
    </div>
  );
}
