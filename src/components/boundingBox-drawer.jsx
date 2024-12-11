'use client';

import { useState } from 'react';
import { Rectangle, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

export default function BoundingBoxDrawer({ onDrawComplete }) {
  const map = useMap();
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);

  // Disable dragging when drawing
  map.dragging.disable();

  useMapEvents({
    mousedown: (e) => {
      setStartPoint(e.latlng);
      setEndPoint(null);
    },
    mousemove: (e) => {
      if (startPoint && !endPoint) {
        setEndPoint(e.latlng);
      }
    },
    mouseup: (e) => {
      if (startPoint) {
        const bounds = L.latLngBounds(startPoint, e.latlng);
        onDrawComplete(bounds);
        setStartPoint(null);
        setEndPoint(null);
        map.dragging.enable();
      }
    },
  });

  // Draw temporary rectangle while drawing
  const currentBounds =
    startPoint && endPoint ? L.latLngBounds(startPoint, endPoint) : null;

  return currentBounds ? (
    <Rectangle
      bounds={currentBounds}
      pathOptions={{
        color: 'blue',
        fillColor: 'blue',
        fillOpacity: 0.3,
      }}
    />
  ) : null;
}
