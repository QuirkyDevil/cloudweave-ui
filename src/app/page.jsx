"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import MapComponent from "@/components/map-component";
import MapContextMenu from "@/components/map-context-menu";
import SelectedArea from "@/components/selected-area";
import TileLayerSelector from "@/components/tilelayer-selector";
import { TimelineMediaPlayer } from "@/components/timeline-media-player";
import Hls from "hls.js";

export default function Home() {
  const [currentTileLayer, setCurrentTileLayer] = useState({
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  });
  const [showCloudLayer, setShowCloudLayer] = useState(true);

  const [boundingBox, setBoundingBox] = useState(null);
  const [isBoundingBoxMode, setIsBoundingBoxMode] = useState(false);

  const [isTimelinePlaying, setIsTimelinePlaying] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [timelineValue, setTimelineValue] = useState(0);
  const [isInterpolating, setIsInterpolating] = useState(false);

  const [dateRangeSelected, setDateRangeSelected] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });

  const handleAddBoundingBox = (bounds) => {
    setBoundingBox(bounds);
    setIsBoundingBoxMode(false);
  };

  const handleVideoLoaded = (loaded) => {
    setIsVideoLoaded(loaded);
  };

  const clearBoundingBox = () => {
    toast.success("Bounding box cleared");
    setBoundingBox(null);
  };

  const handleInterpolate = async () => {
    const video = window.document.querySelector("video");
    if (!video) return;

    const request = {
      // start_time: dateRange.startDate,
      // end_time: dateRange.endDate,
      bbox: `${boundingBox[0][1]},${boundingBox[0][0]},${boundingBox[1][1]},${boundingBox[1][0]}`,
      width: video.offsetWidth,
      height: video.offsetHeight,
      start_time: "2019-05-14T00:15:00.000Z",
      end_time: "2019-05-14T04:15:00.000Z",
      time_step: 30,
    };

    console.log(request);

    setIsInterpolating(true);

    const res = await fetch("http://10.10.9.25:8000/interpolate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    })

    const data = await res.json();

    console.log(data);

    const playlist_href = data.hls_playlist;
    let videoSrc = "http://10.10.9.25:8000" + playlist_href;
    
    if (Hls.isSupported()) {
      let hls = new Hls();
      hls.loadSource(videoSrc);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        setVideoLoading(false);
        video.play();
      });
      hls.on(Hls.Events.ERROR, function (event, data) {
        setVideoLoading(false);
        toast.error("Failed to load video");
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = videoSrc;
    }
    setIsInterpolating(false);
  };

  const handleBoundingBox = () => {
    toast.info("Draw a bounding box on the map to select an area");
    setIsBoundingBoxMode(true);
  };

  const handleReload = () => {
    window.location.reload();
  };

  const toggleCloudLayer = () => {
    toast.success("Cloud layer toggled " + (showCloudLayer ? "off" : "on"));
    setShowCloudLayer(!showCloudLayer);
  };

  const handlePlayPauseChange = (playing) => {
    setIsTimelinePlaying(playing);
    // Add any additional logic for when play/pause state changes
    const video = window.document.querySelector("video");
    if (!video) return;

    video.paused ? video.play() : video.pause();
  };

  const handleDateRangeChange = (range) => {
    setDateRange(range);
    setDateRangeSelected(true);
  };

  const handleTimelineChange = (value) => {
    setTimelineValue(value);

    const video = window.document.querySelector("video");
    if (!video) return;
    const duration = video.duration;
    const currentTime = (value / 100) * duration;
    video.currentTime = currentTime;
  };

  function handleTimeUpdate() {
    const video = window.document.querySelector("video");
    if (!video) return;

    video.addEventListener("timeupdate", () => {
      const duration = video.duration;
      const currentTime = video.currentTime;
      const percentage = (currentTime / duration) * 100;
      setTimelineValue(percentage);
    });
  }

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
        style={{ userSelect: "none", WebkitUserSelect: "none" }}
      >
        <MapComponent
          currentTileLayer={currentTileLayer}
          showCloudLayer={showCloudLayer}
          boundingBox={boundingBox}
          isBoundingBoxMode={isBoundingBoxMode}
          onAddBoundingBox={handleAddBoundingBox}
          onVideoLoaded={handleVideoLoaded}
          handleTimeUpdate={handleTimeUpdate}
          isLoading={isInterpolating}
        />

        <TileLayerSelector
          onTileLayerChange={(layer) => setCurrentTileLayer(layer)}
        />

        <SelectedArea
          boundingBox={boundingBox}
          handleInterpolate={handleInterpolate}
          clearBoundingBox={clearBoundingBox}
          dateRangeSelected={dateRangeSelected}
        />

        {/* Add TimelineMediaPlayer */}
        <TimelineMediaPlayer
          onPlayPauseChange={handlePlayPauseChange}
          onDateRangeChange={handleDateRangeChange}
          onTimelineChange={handleTimelineChange}
          timelineValue={timelineValue}
        />
      </div>
    </MapContextMenu>
  );
}
