'use client';

import 'leaflet/dist/leaflet.css';
import { useState, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  Rectangle,
} from 'react-leaflet';
import BoundingBoxDrawer from '@/components/Boundingbox-drawer';
import ContextMenu from '@/components/context-menu';
import SelectedArea from '@/components/selected-area';
import TileLayerSelector from '@/components/tilelayer-selector';
import CloudLayerManager from '@/components/cloudoverlay';

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
  const mapRef = useRef(null);

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
  };

  const clearBoundingBox = () => {
    setBoundingBox(null);
  };

  const handleInterpolate = () => {
    alert('Interpolate action triggered!');
    closeContextMenu();
  };

  const handleBoundingBox = () => {
    setIsBoundingBoxMode(true);
    closeContextMenu();
  };

  const handleReload = () => {
    window.location.reload();
  };

  const toggleCloudLayer = () => {
    setShowCloudLayer(!showCloudLayer);
    closeContextMenu();
  };

  return (
    <div
      className="absolute inset-0 select-none"
      onContextMenu={handleContextMenu}
      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
    >
      <MapContainer
        ref={mapRef}
        center={[20.5937, 78.9629]}
        zoom={5}
        className="h-full w-full"
        style={{
          zIndex: 0,
          height: '100%',
          width: '100%',
          position: 'absolute',
        }}
        attributionControl={false}
      >
        <TileLayer url={currentTileLayer.url} />

        {showCloudLayer && <CloudLayerManager />}

        <FeatureGroup>
          {isBoundingBoxMode && (
            <BoundingBoxDrawer onDrawComplete={handleAddBoundingBox} />
          )}
          {boundingBox && (
            <Rectangle
              bounds={boundingBox}
              pathOptions={{
                color: 'red',
                fillColor: 'red',
                fillOpacity: 0.3,
              }}
            />
          )}
        </FeatureGroup>
      </MapContainer>

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
          mapRef.current?.dragging.enable();
          closeContextMenu();
        }}
        closeContextMenu={closeContextMenu}
      />
    </div>
  );
}
