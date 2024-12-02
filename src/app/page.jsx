'use client';

import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer } from 'react-leaflet';
import { useState } from 'react';
import Navbar from '@/components/navbar';
import SidePanel from '@/components/SidePanel';

export default function Map() {
  // State to manage the selected item and side panel visibility
  const [selectedItem, setSelectedItem] = useState(null);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

  // Handler for selecting an item
  const handleItemSelect = (item) => {
    setSelectedItem(item);
    setIsSidePanelOpen(true);
  };

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
          <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
        </MapContainer>
      </div>
      <Navbar onItemSelect={handleItemSelect} />

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


// `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic29oYW1ydXBheWUxMjMiLCJhIjoiY200N2tnem03MDZmYTJrczcwanV6cm84diJ9.vMcV3cC4Vi9WTH_PT18d-w`
