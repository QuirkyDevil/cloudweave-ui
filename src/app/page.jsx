'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import MapComponent from '@/components/map-component';
import MapContextMenu from '@/components/map-context-menu';
import SelectedArea from '@/components/selected-area';
import TileLayerSelector from '@/components/tilelayer-selector';
import { TimelineMediaPlayer } from '@/components/timeline-media-player';

export default function Home() {
  const [boundingBox, setBoundingBox] = useState(null);
  const [isBoundingBoxMode, setIsBoundingBoxMode] = useState(false);
  const [currentTileLayer, setCurrentTileLayer] = useState({
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  });
  const [showCloudLayer, setShowCloudLayer] = useState(true);
  const [isTimelinePlaying, setIsTimelinePlaying] = useState(false);
  const [timelineValue, setTimelineValue] = useState(50);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });

  const handleAddBoundingBox = (bounds) => {
    setBoundingBox(bounds);
    setIsBoundingBoxMode(false);
  };

  const clearBoundingBox = () => {
    toast.success('Bounding box cleared');
    setBoundingBox(null);
  };

  const handleInterpolate = () => {
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 1000);
      }),
      {
        loading: 'Interpolating...',
        success: 'Interpolated successfully',
        error: 'Failed to interpolate',
      }
    );
  };

  const handleBoundingBox = () => {
    toast.info('Draw a bounding box on the map to select an area');
    setIsBoundingBoxMode(true);
  };

  const handleReload = () => {
    window.location.reload();
  };

  const toggleCloudLayer = () => {
    toast.success('Cloud layer toggled ' + (showCloudLayer ? 'off' : 'on'));
    setShowCloudLayer(!showCloudLayer);
  };

  const handlePlayPauseChange = (playing) => {
    setIsTimelinePlaying(playing);
    // Add any additional logic for when play/pause state changes
  };

  const handleDateRangeChange = (range) => {
    setDateRange(range);
    // Add any additional logic for when date range changes
  };

  const handleTimelineChange = (value) => {
    setTimelineValue(value);
    // Add any additional logic for when timeline value changes
  };

  return (
    <MapContextMenu
      onBoundingBox={handleBoundingBox}
      onReload={handleReload}
      onToggleCloudLayer={toggleCloudLayer}
      showCloudLayer={showCloudLayer}
      onCancelDrawing={() => setIsBoundingBoxMode(false)}
    >
      <div
        className="absolute inset-0 select-none"
        style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
      >
        <MapComponent
          currentTileLayer={currentTileLayer}
          showCloudLayer={showCloudLayer}
          boundingBox={boundingBox}
          isBoundingBoxMode={isBoundingBoxMode}
          onAddBoundingBox={handleAddBoundingBox}
        />

        <TileLayerSelector
          onTileLayerChange={(layer) => setCurrentTileLayer(layer)}
        />

        <SelectedArea
          boundingBox={boundingBox}
          handleInterpolate={handleInterpolate}
          clearBoundingBox={clearBoundingBox}
        />

        {/* Add TimelineMediaPlayer */}
        <TimelineMediaPlayer
          onPlayPauseChange={handlePlayPauseChange}
          onDateRangeChange={handleDateRangeChange}
          onTimelineChange={handleTimelineChange}
        />
      </div>
    </MapContextMenu>
  );
}
