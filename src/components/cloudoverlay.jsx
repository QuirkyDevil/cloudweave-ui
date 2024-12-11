import React, { useEffect, useState } from 'react';
import { TileLayer } from 'react-leaflet';
import { toast } from 'sonner';

const CloudLayerManager = ({ initialOpacity = 0.5 }) => {
  const [cloudFrame, setCloudFrame] = useState('');
  const [host, setHost] = useState('');

  useEffect(() => {
    const fetchWeatherMaps = async () => {
      try {
        const response = await fetch(
          'https://api.rainviewer.com/public/weather-maps.json'
        );
        const data = await response.json();
        const firstFrame = data.satellite.infrared[0]?.path;

        setHost(data.host);
        setCloudFrame(firstFrame);
      } catch (error) {
        toast.error('Failed to fetch weather maps');
      }
    };


    fetchWeatherMaps();
  }, []);
  if (!cloudFrame) return null;

  return (
    <TileLayer
      url={`${host}${cloudFrame}/256/{z}/{x}/{y}/0/0_0.png`}
      opacity={initialOpacity}
      zIndex={1000}
    />
  );
};

export default CloudLayerManager;
