import 'mapbox-gl/dist/mapbox-gl.css';

import React, { useEffect, useRef } from 'react';

import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

export function NYMap({ newLocation }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);

  // Initialize map only once
  useEffect(() => {
    if (!map.current && mapContainer.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/dcartist/cjeu2ku2m04rl2rtastkgmyfe://styles/mapbox/streets-v11',
        // style: 'mapbox://styles/mapbox/streets-v11',
        center: [-74.006, 40.7128], // Default to NYC
        zoom: 12,
      });
    }
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update map center and marker when newLocation changes
  useEffect(() => {
    if (!newLocation || !map.current) return;

    const address = `${newLocation}, New York, NY`;

    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        address
      )}.json?access_token=${mapboxgl.accessToken}`
    )
      .then(res => res.json())
      .then(data => {
        const coords =
          data.features && data.features.length > 0
            ? data.features[0].center
            : [-74.006, 40.7128]; // Default to NYC

        map.current.setCenter(coords);
        map.current.setZoom(16); // Zoom in closer to the location

        // Remove previous marker if exists
        if (marker.current) marker.current.remove();

        // Add new marker at the location
        marker.current = new mapboxgl.Marker({ color: 'red' })
          .setLngLat(coords)
          .addTo(map.current);
      });
  }, [newLocation]);

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '700px',
        margin: '0 auto',
        position: 'relative',
      }}
    >
      <div
        ref={mapContainer}
        className="mapDiv"
        style={{
          width: '100%',
          height: '400px',
          borderRadius: '12px',
          boxShadow: '0 2px 12px #0002',
          position: 'relative',
        }}
      />
    </div>
  );
}