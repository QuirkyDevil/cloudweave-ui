'use client';

import { Trash2, Layers, MoveDiagonal } from 'lucide-react';

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
        lng: boundingBox[1][1]
      }),
      getSouthWest: () => ({
        lat: boundingBox[0][0],
        lng: boundingBox[0][1]
      })
    };
  };

  return (
    boundingBox && (
      <div className="absolute top-4 right-4 z-[1000] bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <h3 className="font-semibold text-base flex items-center mb-3">
          <Layers className="mr-2 w-4 h-4 text-blue-500" />
          Selected Area
        </h3>
        <div className="space-y-2">
          <div className="p-2 rounded-lg border bg-blue-100 border-blue-300 text-sm">
            <div className="text-xs text-gray-500">
              NE: {getBounds().getNorthEast().lat.toFixed(4)},{' '}
              {getBounds().getNorthEast().lng.toFixed(4)}
              <br />
              SW: {getBounds().getSouthWest().lat.toFixed(4)},{' '}
              {getBounds().getSouthWest().lng.toFixed(4)}
            </div>
          </div>
        </div>
        <div className="mt-3 space-y-2">
          <button
            onClick={handleInterpolate}
            className="w-full flex items-center justify-center bg-blue-500 text-white py-2 rounded-lg text-sm hover:bg-blue-600"
          >
            <MoveDiagonal className="mr-2 w-4 h-4" />
            Interpolate
          </button>
          <button
            onClick={clearBoundingBox}
            className="w-full flex items-center justify-center bg-red-500 text-white py-2 rounded-lg text-sm hover:bg-red-600"
          >
            <Trash2 className="mr-2 w-4 h-4" />
            Clear
          </button>
        </div>
      </div>
    )
  );
}
