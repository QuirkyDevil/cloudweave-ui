
'use client';
import { useMap } from 'react-leaflet';
import { useEffect, useState, useCallback, useRef } from 'react';
import L from 'leaflet';

const CloudLayerManager = ({ frames, host, timestamps }) => {
  const map = useMap();
  const [cloudLayers, setCloudLayers] = useState([]);
  const currentIndexRef = useRef(0);

  // Tile cache (in-memory for simplicity)
  const tileCache = useRef(new Map());

  // Custom tile URL function with caching
  const getCachedTileUrl = async (url) => {
    if (tileCache.current.has(url)) {
      return tileCache.current.get(url); // Return cached tile
    }

    // Fetch tile and cache it
    const response = await fetch(url, { mode: 'cors' });
    const blob = await response.blob();
    const cachedUrl = URL.createObjectURL(blob);
    tileCache.current.set(url, cachedUrl);
    return cachedUrl;
  };

  // Custom tile layer with caching
  const createCloudLayer = useCallback(
    (framePath) => {
      return L.tileLayer(`${host}${framePath}/256/{z}/{x}/{y}/0/0_0.png`, {
        opacity: 0, // Start with 0 opacity
        zIndex: 500,
        attribution: 'Cloud Cover',
        crossOrigin: true,
        updateWhenIdle: true,
        updateWhenZooming: false,
        keepBuffer: 2,
        tileSize: 256,
        // Intercept tile creation to use caching
        tileLoadFunction: async (tile, src) => {
          const cachedSrc = await getCachedTileUrl(src);
          tile.src = cachedSrc;
        },
      });
    },
    [host]
  );

  // Smooth frame switching function
  const switchFrame = useCallback(() => {
    if (!cloudLayers.length) return;

    const currentIndex = currentIndexRef.current;
    const nextIndex = (currentIndex + 1) % frames.length;

    const currentLayer = cloudLayers[currentIndex];
    const nextLayer = cloudLayers[nextIndex];

    if (!map.hasLayer(nextLayer)) {
      nextLayer.addTo(map);
    }

    // Transition effect
    let opacity = 0;
    const step = 0.1; // Adjust for smoother or faster transitions
    const interval = setInterval(() => {
      opacity += step;
      currentLayer.setOpacity(0.5 - opacity);
      nextLayer.setOpacity(opacity);

      if (opacity >= 0.5) {
        clearInterval(interval);
        map.removeLayer(currentLayer); // Remove the old layer after transition
      }
    }, 50); // Adjust interval time as needed

    currentIndexRef.current = nextIndex;
  }, [cloudLayers, frames.length, map]);

  // Layer initialization and management
  useEffect(() => {
    if (frames.length === 0) return;

    const newLayers = frames.map(createCloudLayer);
    setCloudLayers(newLayers);

    const initialLayer = newLayers[0];
    initialLayer.setOpacity(1); // Ensure initial layer is visible
    initialLayer.addTo(map);

    return () => {
      newLayers.forEach((layer) => {
        if (map.hasLayer(layer)) {
          map.removeLayer(layer);
        }
      });
    };
  }, [frames, map, createCloudLayer]);

  // Frame transition loop
  useEffect(() => {
    if (frames.length <= 1) return;

    const transitionInterval = setInterval(switchFrame, 100); // Adjust duration as needed
    return () => clearInterval(transitionInterval);
  }, [frames, switchFrame]);

  useEffect(() => {
    console.log('Cloud Frames:', frames);
    console.log(
      'Timestamps:',
      timestamps.map((ts) => new Date(ts * 1000).toLocaleString())
    );
  }, [frames, timestamps]);

  return null;
};

export default CloudLayerManager;
