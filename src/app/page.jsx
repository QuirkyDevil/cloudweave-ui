'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import MapComponent from '@/components/map-component';
import ContextMenu from '@/components/context-menu';
import SelectedArea from '@/components/selected-area';
import TileLayerSelector from '@/components/tilelayer-selector';

export default function Home() {
  const [boundingBox, setBoundingBox] = useState(null);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
  });
  const [isBoundingBoxMode, setIsBoundingBoxMode] = useState(false);
  const [currentTileLayer, setCurrentTileLayer] = useState({
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  });
  const [showCloudLayer, setShowCloudLayer] = useState(true);

  const handleContextMenu = (e) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
    });
  };

  const closeContextMenu = () => {
    setContextMenu({ visible: false, x: 0, y: 0 });
  };

  const handleAddBoundingBox = (bounds) => {
    setBoundingBox(bounds);
    setIsBoundingBoxMode(false);
    console.log('Bounding box added:', bounds);
  };

  const clearBoundingBox = () => {
    toast.success('Bounding box cleared');
    setBoundingBox(null);
  };

  const handleInterpolate = () => {
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 1000);
      }),
      {
        loading: 'Interpolating...',
        success: 'Interpolated successfully',
        error: 'Failed to interpolate',
      }
    );
    closeContextMenu();
  };

  const handleBoundingBox = () => {
    toast.info('Draw a bounding box on the map to select an area');
    setIsBoundingBoxMode(true);
    closeContextMenu();
  };

  const handleReload = () => {
    window.location.reload();
  };

  const toggleCloudLayer = () => {
    toast.success('Cloud layer toggled ' + (showCloudLayer ? 'off' : 'on'));
    setShowCloudLayer(!showCloudLayer);
    closeContextMenu();
  };

  return (
    <div
      className="absolute inset-0 select-none"
      onContextMenu={handleContextMenu}
      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
    >
      <MapComponent
        currentTileLayer={currentTileLayer}
        showCloudLayer={showCloudLayer}
        boundingBox={boundingBox}
        isBoundingBoxMode={isBoundingBoxMode}
        onAddBoundingBox={handleAddBoundingBox}
      />

      <TileLayerSelector
        onTileLayerChange={(layer) => setCurrentTileLayer(layer)}
      />

      <SelectedArea
        boundingBox={boundingBox}
        handleInterpolate={handleInterpolate}
        clearBoundingBox={clearBoundingBox}
      />

      <ContextMenu
        contextMenu={contextMenu}
        onBoundingBox={handleBoundingBox}
        onReload={handleReload}
        onToggleCloudLayer={toggleCloudLayer}
        showCloudLayer={showCloudLayer}
        onCancelDrawing={() => {
          setIsBoundingBoxMode(false);
          closeContextMenu();
        }}
        closeContextMenu={closeContextMenu}
      />
    </div>
  );
}
