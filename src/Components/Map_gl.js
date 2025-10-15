import * as React from 'react';
import Map, { Marker, NavigationControl } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

export default function Mapgl({ newLocation }) {
  const mapboxAccessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

  const mapRef = React.useRef(null);
  const [viewState, setViewState] = React.useState({
    longitude: -74.006,
    latitude: 40.7128,
    zoom: 12
  });
  const [marker, setMarker] = React.useState(null);

  React.useEffect(() => {
    if (!newLocation || !mapboxAccessToken) return;

    const controller = new AbortController();
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      newLocation
    )}.json?limit=1&access_token=${mapboxAccessToken}`;

    fetch(url, { signal: controller.signal })
      .then(r => r.json())
      .then(json => {
        const feat = json?.features?.[0];
        if (!feat?.center) return;
        const [lng, lat] = feat.center;

        setMarker({ longitude: lng, latitude: lat });

        const map = mapRef.current?.getMap?.();
        if (map) {
          map.flyTo({ center: [lng, lat], zoom: 16, essential: true });
        } else {
          setViewState(v => ({ ...v, longitude: lng, latitude: lat, zoom: 16 }));
        }
      })
      .catch(() => { /* ignore */ });

    return () => controller.abort();
  }, [newLocation, mapboxAccessToken]);

  return (
    <Map
      ref={mapRef}
      mapLib={import('mapbox-gl')}
      mapboxAccessToken={mapboxAccessToken}
      initialViewState={viewState}
      onMove={evt => setViewState(evt.viewState)}
      style={{ width: '100%', height: 400 }}
    //   mapStyle="mapbox://styles/mapbox/streets-v12"
      mapStyle="mapbox://styles/mapbox/streets-v12"
    >
      <NavigationControl position="top-right" />
      {marker && (
        <Marker longitude={marker.longitude} latitude={marker.latitude} anchor="bottom">
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: '50%',
              background: '#e00',
              border: '2px solid #fff',
              boxShadow: '0 0 0 2px rgba(224,0,0,0.35)'
            }}
            title={newLocation}
          />
        </Marker>
      )}
    </Map>
  );
}