import React, { useState } from 'react';
import { Globe, Satellite, Map, ChevronRight } from 'lucide-react';

const TILE_LAYERS = [
  {
    name: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    icon: Satellite,
  },
  {
    name: 'OpenStreetMap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    icon: Globe,
  },
  {
    name: 'Dark',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    icon: Map,
  },
];

const TileLayerSelector = ({ onTileLayerChange }) => {
  const [selectedLayer, setSelectedLayer] = useState(TILE_LAYERS[0]);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleLayerChange = (layer) => {
    setSelectedLayer(layer);
    onTileLayerChange(layer);
    setIsExpanded(false);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="absolute bottom-4 right-4 z-[1000] flex items-end">
      {/* Stacked cards */}
      <div
        className={`
          transition-all duration-300 ease-in-out
          ${
            isExpanded
              ? 'translate-x-0 opacity-100'
              : 'translate-x-full opacity-0'
          }
          absolute bottom-0 right-full mb-0 mr-2
          flex space-x-2
        `}
      >
        {TILE_LAYERS.filter((layer) => layer !== selectedLayer).map((layer) => (
          <button
            key={layer.name}
            onClick={() => handleLayerChange(layer)}
            className="
              bg-white shadow-md rounded-lg
              p-2 flex items-center
              hover:bg-gray-100
              transition-colors
              min-w-[120px]
            "
          >
            <layer.icon className="mr-2 w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-800">{layer.name}</span>
          </button>
        ))}
      </div>

      {/* Main selected layer button */}
      <button
        onClick={toggleExpand}
        className="
          bg-white shadow-md rounded-lg
          p-2 flex items-center
          hover:bg-gray-100
          transition-colors
          min-w-[120px]
        "
      >
        <selectedLayer.icon className="mr-2 w-4 h-4 text-gray-600" />
        <span className="text-sm text-gray-800 mr-2">{selectedLayer.name}</span>
        <ChevronRight
          className={`
            w-4 h-4 text-gray-500
            transition-transform duration-300
            ${isExpanded ? 'rotate-90' : ''}
          `}
        />
      </button>
    </div>
  );
};

export default TileLayerSelector;
