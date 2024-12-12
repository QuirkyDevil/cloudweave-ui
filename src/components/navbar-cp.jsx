'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Settings,
  Calendar,
  MapPin,
  Boxes,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function Navbar({ className, }) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [locationMode, setLocationMode] = useState('gps');

  return (
    <div
      className={cn(
        'fixed top-2 left-2 z-50 bg-[#0a0a0a] border rounded-2xl shadow-lg',
        className
      )}
    >
      <div className="flex items-center justify-between p-4">
        <Image alt='logo' src="/logo_long.png" width={320} height={960} className='h-8 w-auto' />
      </div>

      {isPopoverOpen && (
        <div className="space-y-4 p-4">
          <div>
            <Tabs
              value={locationMode}
              onValueChange={setLocationMode}
              className="w-full"
            >
              <TabsList className="flex w-full">
                <TabsTrigger value="gps" className="flex items-center gap-2 w-full">
                  <MapPin size={16} />
                </TabsTrigger>
              </TabsList>
              <TabsContent value="gps">
                <div className="mt-2 space-y-2">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Latitude"
                      className="w-1/2 border rounded-lg p-2 text-sm bg-[#262626]"
                    />
                    <input
                      type="text"
                      placeholder="Longitude"
                      className="w-1/2 border rounded-lg p-2 text-sm bg-[#262626]"
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="bbox">
                <div className="mt-2 space-y-2">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Min Lat"
                      className="w-1/2 border rounded p-2 text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Max Lat"
                      className="w-1/2 border rounded p-2 text-sm"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Min Lon"
                      className="w-1/2 border rounded p-2 text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Max Lon"
                      className="w-1/2 border rounded p-2 text-sm"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </div>
  );
}
