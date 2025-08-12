'use client';

import type React from 'react';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Facility, Pipeline } from '@/types';

interface FacilityFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coordinates: { lat: number; lng: number };
  type: 'facility' | 'pipeline';
  onSubmit: (data: Partial<Facility> | Partial<Pipeline>) => void;
}

export function FacilityFormDialog({
  open,
  onOpenChange,
  coordinates,
  type,
  onSubmit,
}: FacilityFormDialogProps) {
  const [formData, setFormData] = useState<any>({
    name: '',
    operator: '',
    region: '',
    type: type === 'facility' ? 'refinery' : 'crude_oil',
    status: 'active',
    description: '',
    // Pipeline specific
    diameter: '',
    length: '',
    pressure: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const baseData = {
      id: `${type}-${Date.now()}`,
      name: formData.name,
      operator: formData.operator,
      region: formData.region,
      status: formData.status,
      description: formData.description,
      coordinates: type === 'facility' ? coordinates : [coordinates],
    };

    if (type === 'facility') {
      onSubmit({
        ...baseData,
        type: formData.type,
        capacity: formData.capacity || 0,
        lastInspection: new Date().toISOString().split('T')[0],
      } as Partial<Facility>);
    } else {
      onSubmit({
        ...baseData,
        type: formData.type,
        diameter: Number.parseFloat(formData.diameter) || 0,
        length: Number.parseFloat(formData.length) || 0,
        pressure: Number.parseFloat(formData.pressure) || 0,
        material: formData.material || 'steel',
      } as Partial<Pipeline>);
    }

    // Reset form
    setFormData({
      name: '',
      operator: '',
      region: '',
      type: type === 'facility' ? 'refinery' : 'crude_oil',
      status: 'active',
      description: '',
      diameter: '',
      length: '',
      pressure: '',
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>
            Add New {type === 'facility' ? 'Facility' : 'Pipeline'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <Label htmlFor='name'>Name *</Label>
              <Input
                id='name'
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor='operator'>Operator *</Label>
              <Input
                id='operator'
                value={formData.operator}
                onChange={(e) =>
                  setFormData({ ...formData, operator: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <Label htmlFor='region'>Region</Label>
              <Input
                id='region'
                value={formData.region}
                onChange={(e) =>
                  setFormData({ ...formData, region: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor='status'>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='active'>Active</SelectItem>
                  <SelectItem value='maintenance'>Maintenance</SelectItem>
                  <SelectItem value='inactive'>Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor='type'>Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) =>
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {type === 'facility' ? (
                  <>
                    <SelectItem value='refinery'>Refinery</SelectItem>
                    <SelectItem value='drilling_rig'>Drilling Rig</SelectItem>
                    <SelectItem value='storage_tank'>Storage Tank</SelectItem>
                    <SelectItem value='pump_station'>Pump Station</SelectItem>
                    <SelectItem value='processing_plant'>
                      Processing Plant
                    </SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value='crude_oil'>Crude Oil</SelectItem>
                    <SelectItem value='natural_gas'>Natural Gas</SelectItem>
                    <SelectItem value='refined_products'>
                      Refined Products
                    </SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          {type === 'pipeline' && (
            <div className='grid grid-cols-3 gap-4'>
              <div>
                <Label htmlFor='diameter'>Diameter (inches)</Label>
                <Input
                  id='diameter'
                  type='number'
                  step='0.1'
                  value={formData.diameter}
                  onChange={(e) =>
                    setFormData({ ...formData, diameter: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor='length'>Length (miles)</Label>
                <Input
                  id='length'
                  type='number'
                  step='0.1'
                  value={formData.length}
                  onChange={(e) =>
                    setFormData({ ...formData, length: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor='pressure'>Pressure (PSI)</Label>
                <Input
                  id='pressure'
                  type='number'
                  value={formData.pressure}
                  onChange={(e) =>
                    setFormData({ ...formData, pressure: e.target.value })
                  }
                />
              </div>
            </div>
          )}

          <div>
            <Label htmlFor='description'>Description</Label>
            <Textarea
              id='description'
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
            />
          </div>

          <div className='flex justify-end gap-2'>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type='submit'>
              Add {type === 'facility' ? 'Facility' : 'Pipeline'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
