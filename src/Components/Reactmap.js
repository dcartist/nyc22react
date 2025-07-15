import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import data from "../data.json"
import '../App.css';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
const Reactmap = () => {
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

    const makers = data.map(item=>{
        new mapboxgl.Marker({
            color: "red",
            draggable: false
            }).setLngLat([item.longitude, item.latitude])
            .addTo(map);

    })
    const marker = new mapboxgl.Marker({
        color: "red",
        draggable: false
        }).setLngLat([-73.918421, 40.639604])
        .addTo(map);
    // add navigation control (the +/- zoom buttons)
    // map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

    // clean up on unmount
    return () => map.remove();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <div className="map-container" ref={mapContainerRef} />;
};

export default Reactmap;
