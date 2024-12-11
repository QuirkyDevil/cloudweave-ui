import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Globe,
  Satellite,
  Map,
  Waves,
  CheckIcon,
  LayersIcon, // Added fallback icon
} from 'lucide-react';
import { toast } from 'sonner';

const TILE_LAYERS = [
  {
    name: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    icon: Satellite,
  },
  {
    name: 'Light Mode',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    icon: Waves,
  },
  {
    name: 'Dark Mode',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    icon: Map,
  },
  {
    name: 'OpenStreetMap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    icon: Globe,
  },
  {
    name: 'Wikimedia',
    url: 'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png',
    icon: Globe,
  },
];

export default function TileLayerSelector({ onTileLayerChange }) {
  const { resolvedTheme } = useTheme();

  // Determine default layer based on system theme
  const getDefaultLayer = () => {
    return resolvedTheme === 'dark'
      ? TILE_LAYERS.find((layer) => layer.name === 'Dark Mode')
      : TILE_LAYERS[0];
  };

  const [selectedLayer, setSelectedLayer] = useState(
    () => getDefaultLayer() || TILE_LAYERS[0]
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const defaultLayer = getDefaultLayer() || TILE_LAYERS[0];
    setSelectedLayer(defaultLayer);
    onTileLayerChange(defaultLayer);
  }, [resolvedTheme]);

  const handleLayerChange = (layer) => {
    setSelectedLayer(layer);
    onTileLayerChange(layer);
    setOpen(false);
    toast.info(`Map TileMap has been updated to ${layer.name}`);
  };

  // Fallback icon component
  const LayerIcon = selectedLayer.icon || LayersIcon;

  return (
    <div className="absolute top-4 right-4 z-[1000]">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            className="
              bg-white dark:bg-gray-800
              shadow-md rounded-lg
              p-2 flex items-center
              hover:bg-gray-100 dark:hover:bg-gray-700
              transition-colors
              min-w-[150px]
            "
          >
            <LayerIcon className="mr-2 w-4 h-4 text-gray-600 dark:text-gray-300" />
            <span className="text-sm text-gray-800 dark:text-gray-200 mr-2">
              {selectedLayer.name}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-0">
          <Command>
            <CommandInput placeholder="Search map type..." />
            <CommandList>
              <CommandEmpty>No map type found.</CommandEmpty>
              <CommandGroup heading="Map Types">
                {TILE_LAYERS.map((layer) => {
                  const Icon = layer.icon || LayersIcon;
                  return (
                    <CommandItem
                      key={layer.name}
                      value={layer.name}
                      onSelect={() => handleLayerChange(layer)}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center">
                        <Icon className="mr-2 w-4 h-4 text-gray-600 dark:text-gray-300" />
                        <span className="dark:text-gray-200">{layer.name}</span>
                      </div>
                      {selectedLayer.name === layer.name && (
                        <CheckIcon className="w-4 h-4 text-green-600" />
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
