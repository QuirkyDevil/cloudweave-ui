import React, { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Settings,
  Calendar as CalendarIcon,
  MapPin,
  Boxes,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  getModelPublisher,
  getModelYear,
  getModelArchitecture,
  getModelTechnique,
} from '@/lib/data';

export default function Navbar({
  className,
  onItemSelect,
  toggleMapMode,
  isDynamic,
}) {
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState(null);
  const [selectedMapMode, setSelectedMapMode] = useState('Static Map');
  const [selectedMapType, setSelectedMapType] = useState('Tile');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [locationMode, setLocationMode] = useState('gps');

  const models = ['DAIN', 'FILM', 'RIFE', 'RAFT'];
  const mapModes = ['Static Map', 'Dynamic Map'];
  const mapTypes = ['Tile', 'Satellite'];

  const handleModelSelect = (model) => {
    const modelDetails = {
      name: model,
      details: {
        'Published By': getModelPublisher(model),
        'Year Published': getModelYear(model),
      },
      specifications: {
        Architecture: getModelArchitecture(model),
        'Primary Technique': getModelTechnique(model),
      },
    };
    setSelectedModel(modelDetails);
    onItemSelect(modelDetails);
  };

  const handleMapModeChange = (mode) => {
    setSelectedMapMode(mode);
    if (
      (mode === 'Static Map' && isDynamic) ||
      (mode === 'Dynamic Map' && !isDynamic)
    ) {
      toggleMapMode(!isDynamic);
    }
  };

  return (
    <div
      className={cn(
        'fixed top-2 left-2 z-50 bg-white border rounded-2xl shadow-lg w-72',
        className
      )}
    >
      <div className="flex items-center justify-between p-4">
        <span className="font-bold text-xl">CloudWeave</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsPopoverOpen(!isPopoverOpen)}
        >
          <Settings size={24} />
        </Button>
      </div>

      {isPopoverOpen && (
        <div className="space-y-4 p-4">
          {/* Model Select */}
          <div>
            <p className="text-sm font-medium mb-2">Model</p>
            <Select onValueChange={handleModelSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                {models.map((model) => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Picker */}
          <div>
            <p className="text-sm font-medium mb-2">Date</p>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !selectedDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? (
                    selectedDate.toLocaleDateString()
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Map Mode Select */}
          <div>
            <p className="text-sm font-medium mb-2">Map Mode</p>
            <Select value={selectedMapMode} onValueChange={handleMapModeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select map mode" />
              </SelectTrigger>
              <SelectContent>
                {mapModes.map((mode) => (
                  <SelectItem key={mode} value={mode}>
                    {mode}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Map Type Select */}
          <div>
            <p className="text-sm font-medium mb-2">Map Type</p>
            <Select value={selectedMapType} onValueChange={setSelectedMapType}>
              <SelectTrigger>
                <SelectValue placeholder="Select map type" />
              </SelectTrigger>
              <SelectContent>
                {mapTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location Selection Tabs */}
          <div>
            <p className="text-sm font-medium mb-2">Location Selection</p>
            <Tabs
              value={locationMode}
              onValueChange={setLocationMode}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="gps" className="flex items-center gap-2">
                  <MapPin size={16} />
                  GPS
                </TabsTrigger>
                <TabsTrigger value="bbox" className="flex items-center gap-2">
                  <Boxes size={16} />
                  Bbox
                </TabsTrigger>
              </TabsList>
              <TabsContent value="gps">
                <div className="mt-2 space-y-2">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Latitude"
                      className="w-1/2 border rounded p-2 text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Longitude"
                      className="w-1/2 border rounded p-2 text-sm"
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="bbox">
                <div className="mt-2 space-y-2">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Min Lat"
                      className="w-1/2 border rounded p-2 text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Max Lat"
                      className="w-1/2 border rounded p-2 text-sm"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Min Lon"
                      className="w-1/2 border rounded p-2 text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Max Lon"
                      className="w-1/2 border rounded p-2 text-sm"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </div>
  );
}
