import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import '../App.css';
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

export default function JobsMapped(props) {
    const mapContainerRef = useRef(null);
    useEffect(() => {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/dcartist/cjeu2tofp0wcs2rnbhooahyy5',
        center: [-73.935242, 40.680610],
        zoom: 10.8,
        pitch: 50,
      });
  
      map.scrollZoom.disable();
  
      const makers = props.data.map(item=>{
          new mapboxgl.Marker({
              color: "red",
              draggable: false
              }).setLngLat([item.longitude, item.latitude])
              .addTo(map);
  
      })
      return () => map.remove();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
    return <div className="map-container" ref={mapContainerRef} />;
}


