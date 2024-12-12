'use client';

import 'leaflet/dist/leaflet.css';
import Hls from 'hls.js';
import { useState, useRef, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  Rectangle,
  VideoOverlay,
  SVGOverlay,
} from 'react-leaflet';
import CloudLayerManager from '@/components/cloudoverlay';
import BoundingBoxDrawer from '@/components/boundingBox-drawer';
import { toast } from 'sonner';
import Loader from './loader';

export default function MapComponent({
  currentTileLayer,
  showCloudLayer,
  boundingBox,
  isBoundingBoxMode,
  onAddBoundingBox,
  handleTimeUpdate,
  isLoading,
}) {
  const [videoRef, setVideoRef] = useState(null);

  const mapRef = useRef(null);

  const convertBounds = (bounds) => {
    if (!bounds) return null;
    return [
      [bounds._southWest.lat, bounds._southWest.lng],
      [bounds._northEast.lat, bounds._northEast.lng],
    ];
  };

  useEffect(() => {
    handleTimeUpdate();
  }, [videoRef]);

  const handleAddBoundingBox = (bounds) => {
    const convertedBounds = convertBounds(bounds);
    onAddBoundingBox(convertedBounds);
  };

  function halfBound(bounds) {
    const [[x1, y1], [x2, y2]] = bounds;

    const centerX = (x1 + x2) / 2;
    const centerY = (y1 + y2) / 2;

    const halfWidth = (x2 - x1) / 4;
    const halfHeight = (y2 - y1) / 4;

    const newX1 = centerX - halfWidth;
    const newY1 = centerY - halfHeight;
    const newX2 = centerX + halfWidth;
    const newY2 = centerY + halfHeight;

    return [
      [newX1, newY1],
      [newX2, newY2],
    ];
  }

  return (
    <MapContainer
      ref={mapRef}
      center={[20.5937, 78.9629]}
      zoom={5}
      minZoom={3}
      zoomAnimation={true}
      zoomControl={false}
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
        {isLoading && (
          <SVGOverlay
            bounds={halfBound(boundingBox)}
            key={boundingBox.toString() + "-loading"}
            opacity={0.9}
          >
            {<Loader />}
          </SVGOverlay>
        )}
        {boundingBox && (
          <>
            <Rectangle
              bounds={boundingBox}
              pathOptions={{
                color: 'black',
                weight: 1,
                fillColor: 'black',
                fillOpacity: 0.1,
              }}
            />

            <VideoOverlay
              bounds={boundingBox}
              url={""}
              key={JSON.stringify(boundingBox)}
              zIndex={1000}
              play={true}
              ref={setVideoRef}
            />
          </>
        )}
      </FeatureGroup>
    </MapContainer>
  );
}
