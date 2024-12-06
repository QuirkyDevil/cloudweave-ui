'use client';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer } from 'react-leaflet';
import { useEffect, useState } from 'react';
import Navbar from '@/components/navbar';
import SidePanel from '@/components/SidePanel';
import CloudLayerManager from '@/components/CloudlLayerManager';

export default function Map() {
  const [cloudFrames, setCloudFrames] = useState([]);
  const [cloudTimestamps, setCloudTimestamps] = useState([]);
  const [host, setHost] = useState('');
  const [isDynamic, setIsDynamic] = useState(false); // Toggle for static/dynamic map

  // Fetch the RainViewer Weather Maps API
  useEffect(() => {
    const fetchWeatherMaps = async () => {
      try {
        const response = await fetch(
          'https://api.rainviewer.com/public/weather-maps.json'
        );
        const data = await response.json();

        setHost(data.host);
        const frames = data.satellite.infrared.map((frame) => frame.path);
        const timestamps = data.satellite.infrared.map((frame) => frame.time);

        setCloudFrames(frames);
        setCloudTimestamps(timestamps);

        console.log('Retrieved Frames:', frames);
        console.log(
          'Retrieved Timestamps:',
          timestamps.map((ts) => new Date(ts * 1000).toLocaleString())
        );
      } catch (error) {
        console.error('Failed to fetch weather maps:', error);
      }
    };
    fetchWeatherMaps();
  }, []);

  // State to manage the selected item and side panel visibility
  const [selectedItem, setSelectedItem] = useState(null);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

  // Handler for selecting an item
  const handleItemSelect = (item) => {
    setSelectedItem(item);
    setIsSidePanelOpen(true);
  };

  // Handler for toggling between static and dynamic maps
  const toggleMapMode = () => setIsDynamic((prev) => !prev);

  return (
    <div className="relative h-screen flex">
      <div className="flex-grow">
        <MapContainer
          center={[20.5937, 78.9629]} // Coordinates for center of India
          zoom={5}
          className="h-full w-full"
          style={{ zIndex: 0 }}
          attributionControl={false}
        >
          {/* Base map layer */}
          <TileLayer url="https://maps.aerisapi.com/amwm4D5Qu8eYpCnMbDyQZ_txBqhl3kfvc55xgSU9NDJ52YTjyPMMwDvDqpCW6u/blue-marble,water-depth,radar,states,satellite-geocolor/{z}/{x}/{y}/current.png" />

          {/* Cloud Layers */}
          {isDynamic && cloudFrames.length > 0 && (
            <CloudLayerManager
              frames={cloudFrames}
              host={host}
              timestamps={cloudTimestamps}
            />
          )}
          {!isDynamic && cloudFrames.length > 0 && (
            <TileLayer
              url={`${host}${cloudFrames[0]}/256/{z}/{x}/{y}/0/0_0.png`}
              opacity={0.5}
            />
          )}
        </MapContainer>
      </div>
      <Navbar
        onItemSelect={handleItemSelect}
        toggleMapMode={toggleMapMode}
        isDynamic={isDynamic}
      />
      {/* Side Panel */}
      <SidePanel
        isOpen={isSidePanelOpen}
        title={selectedItem?.name}
        details={selectedItem?.details}
        specifications={selectedItem?.specifications}
      />
    </div>
  );
}
