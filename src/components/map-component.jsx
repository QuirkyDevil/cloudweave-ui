'use client';

import 'leaflet/dist/leaflet.css';
import Hls from 'hls.js';
import { useState, useRef, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  Rectangle,
  VideoOverlay,
} from 'react-leaflet';
import CloudLayerManager from '@/components/cloudoverlay';
import BoundingBoxDrawer from '@/components/boundingBox-drawer';


export default function MapComponent({
  currentTileLayer,
  showCloudLayer,
  boundingBox,
  isBoundingBoxMode,
  onAddBoundingBox,
}) {
  const [videoUrl, setVideoUrl] = useState('');
  const [videoRef, setVideoRef] = useState(null);
  const [videoLoading, setVideoLoading] = useState(false);

  const mapRef = useRef(null);

  const convertBounds = (bounds) => {
    if (!bounds) return null;
    return [
      [bounds._southWest.lat, bounds._southWest.lng],
      [bounds._northEast.lat, bounds._northEast.lng],
    ];
  };

  const handleAddBoundingBox = (bounds) => {
    const convertedBounds = convertBounds(bounds);
    onAddBoundingBox(convertedBounds);

    const videoSrc = 'https://cdn.jwplayer.com/manifests/pZxWPRg4.m3u8';
    setVideoUrl(videoSrc);
  };

  useEffect(() => {
    setVideoLoading(true);
    let video = videoRef?.getElement();
    if (!video) return;

    let videoSrc = 'https://cdn.jwplayer.com/manifests/pZxWPRg4.m3u8';

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
        console.error('Error', event, data);
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = videoSrc;
    }
  }, [videoRef]);

  return (
    <MapContainer
      ref={mapRef}
      center={[20.5937, 78.9629]}
      zoom={5}
      className="h-full w-full"
      style={{
        zIndex: 0,
        height: '100%',
        width: '100%',
        position: 'absolute',
      }}
      attributionControl={false}
    >
      <TileLayer url={currentTileLayer.url} />

      {showCloudLayer && <CloudLayerManager />}

      <FeatureGroup>
        {isBoundingBoxMode && (
          <BoundingBoxDrawer onDrawComplete={handleAddBoundingBox} />
        )}
        {boundingBox && videoUrl && (
          <>
            <Rectangle
              bounds={boundingBox}
              pathOptions={{
                color: 'black',
                weight: 1,
                fillColor: 'black',
                fillOpacity: 0.1,
              }}
            />

            <VideoOverlay
              bounds={boundingBox}
              url={videoUrl}
              key={JSON.stringify(boundingBox)}
              zIndex={1000}
              play={true}
              ref={setVideoRef}
            />
          </>
        )}
      </FeatureGroup>
    </MapContainer>
  );
}
