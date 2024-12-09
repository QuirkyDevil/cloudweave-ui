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

  // Create a new cloud layer for a given frame
  const createCloudLayer = useCallback(
    (framePath) => {
      return L.tileLayer(`${host}${framePath}/256/{z}/{x}/{y}/0/0_0.png`, {
        opacity: 0, // Start with 0 opacity
        zIndex: 500,
        attribution: 'Cloud Cover',
        crossOrigin: true,
        tileSize: 256,
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
    let opacity = 0.1;
    const step = 0.1; // Adjust for smoother or faster transitions
    const interval = setInterval(() => {
      opacity += step;
      currentLayer.setOpacity(0.7 - opacity);
      nextLayer.setOpacity(opacity);

      if (opacity >= 0.7) {
        clearInterval(interval);
        map.removeLayer(currentLayer); // Remove the old layer after transition
      }
    }, 50); // Adjust interval time as needed

    currentIndexRef.current = nextIndex;
  }, [cloudLayers, map, frames.length]);

  // Initialize cloud layers and set the first frame visible
  useEffect(() => {
    if (!frames.length) return;

    const newLayers = frames.map(createCloudLayer);
    setCloudLayers(newLayers);

    const initialLayer = newLayers[0];
    initialLayer.setOpacity(0.7); // Make the first layer visible
    initialLayer.addTo(map);

    return () => {
      newLayers.forEach((layer) => {
        if (map.hasLayer(layer)) {
          map.removeLayer(layer);
        }
      });
    };
  }, [frames, map, createCloudLayer]);

  // Start frame switching
  useEffect(() => {
    if (frames.length <= 1) return;

    const transitionInterval = setInterval(switchFrame, 300); // Adjust timing for animation speed
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
