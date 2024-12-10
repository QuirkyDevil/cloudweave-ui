'use client';

import React from 'react';
import { RefreshCcw, XSquare, Box, Map, CloudOff, Cloud } from 'lucide-react';

export default function ContextMenu({
  contextMenu,
  onBoundingBox,
  onReload,
  onCancelDrawing,
  closeContextMenu,
  onToggleCloudLayer,
  showCloudLayer,
}) {
  if (!contextMenu.visible) return null;

  return (
    <div
      className="absolute z-[1001] bg-white shadow-lg rounded-lg border border-gray-200"
      style={{
        top: contextMenu.y,
        left: contextMenu.x,
        minWidth: '200px',
      }}
    >
      <div className="p-2">
        <div
          onClick={onBoundingBox}
          className="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded flex items-center text-sm text-gray-700"
        >
          <Box className="mr-2 w-4 h-4" />
          Select Bounding Box
        </div>
        <div
          onClick={onReload}
          className="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded flex items-center text-sm text-gray-700"
        >
          <RefreshCcw className="mr-2 w-4 h-4" />
          Reload
        </div>
        <div
          onClick={onToggleCloudLayer}
          className="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded flex items-center text-sm text-gray-700"
        >
          {showCloudLayer ? (
            <>
              <CloudOff className="mr-2 w-4 h-4" />
              Hide Cloud Layer
            </>
          ) : (
            <>
              <Cloud className="mr-2 w-4 h-4" />
              Show Cloud Layer
            </>
          )}
        </div>
        <div
          onClick={onCancelDrawing}
          className="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded flex items-center text-sm text-red-600"
        >
          <XSquare className="mr-2 w-4 h-4" />
          Cancel Drawing
        </div>
        <div className="border-t my-1 border-gray-200"></div>
        <div className="px-3 py-2 text-xs text-gray-500 flex items-center">
          <Map className="mr-2 w-4 h-4" />
          Map Actions
        </div>
      </div>
    </div>
  );
}
