'use client';

import { Trash2, Layers, MoveDiagonal } from 'lucide-react';

export default function SelectedAreas({
  rectangles,
  selectedRectangle,
  setSelectedRectangle,
  handleInterpolate,
  clearRectangles,
}) {
  return (
    rectangles.length > 0 && (
      <div className="absolute top-4 right-4 z-[1000] bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <h3 className="font-semibold text-base flex items-center mb-3">
          <Layers className="mr-2 w-4 h-4 text-blue-500" />
          Selected Areas
        </h3>
        <div className="space-y-2">
          {rectangles.map((rect) => (
            <div
              key={rect.id}
              className={`p-2 rounded-lg border text-sm ${
                selectedRectangle === rect
                  ? 'bg-blue-100 border-blue-300'
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              } cursor-pointer`}
              onClick={() => setSelectedRectangle(rect)}
            >
              <div className="text-xs text-gray-500">
                NE: {rect.bounds.getNorthEast().lat.toFixed(4)},{' '}
                {rect.bounds.getNorthEast().lng.toFixed(4)}
                <br />
                SW: {rect.bounds.getSouthWest().lat.toFixed(4)},{' '}
                {rect.bounds.getSouthWest().lng.toFixed(4)}
              </div>
            </div>
          ))}
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
            onClick={clearRectangles}
            className="w-full flex items-center justify-center bg-red-500 text-white py-2 rounded-lg text-sm hover:bg-red-600"
          >
            <Trash2 className="mr-2 w-4 h-4" />
            Clear All
          </button>
        </div>
      </div>
    )
  );
}
