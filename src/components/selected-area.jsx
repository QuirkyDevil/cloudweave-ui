'use client';

import { Trash2, Layers, MoveDiagonal } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export default function SelectedArea({
  boundingBox,
  handleInterpolate,
  clearBoundingBox,
}) {
  // If boundingBox is an array, create an object with methods to mimic Leaflet's bounds interface
  const getBounds = () => {
    if (!boundingBox) return null;

    return {
      getNorthEast: () => ({
        lat: boundingBox[1][0],
        lng: boundingBox[1][1],
      }),
      getSouthWest: () => ({
        lat: boundingBox[0][0],
        lng: boundingBox[0][1],
      }),
    };
  };

  if (!boundingBox) return null;

  return (
    <div className="absolute top-4 right-4 z-[1000]">
      <Card className="w-[250px]">
        <CardHeader>
          <CardTitle className="flex items-center text-base">
            <Layers className="mr-2 w-4 h-4 text-blue-500" />
            Selected Area
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-2 rounded-lg border bg-blue-50 dark:bg-blue-900 border-blue-300 dark:border-blue-700 text-sm">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="w-full text-left">
                      NE: {getBounds().getNorthEast().lat.toFixed(4)},{' '}
                      {getBounds().getNorthEast().lng.toFixed(4)}
                    </TooltipTrigger>
                    <TooltipContent>Northeast Coordinates</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="w-full text-left">
                      SW: {getBounds().getSouthWest().lat.toFixed(4)},{' '}
                      {getBounds().getSouthWest().lng.toFixed(4)}
                    </TooltipTrigger>
                    <TooltipContent>Southwest Coordinates</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                onClick={handleInterpolate}
                className="w-full bg-gradient-to-r from-[#42BCFF] to-[#5C3FFD] text-white"
                variant="default"
              >
                <MoveDiagonal className="mr-2 w-4 h-4" />
                Interpolate
              </Button>
              <Button
                onClick={clearBoundingBox}
                className="w-full"
                variant="destructive"
              >
                <Trash2 className="mr-2 w-4 h-4" />
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
