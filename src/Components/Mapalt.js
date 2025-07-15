import React, { useRef, useEffect } from 'react';
// import mapboxgl from 'mapbox-gl/dist/mapbox-gl-csp';
import mapboxgl from 'mapbox-gl';
// import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker';
// import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker'

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
// mapboxgl.workerClass = require('worker-loader').default;
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;
export default function Mapalt(props) {
  console.log(props)
        const newlat = props.latitude + 0.00500
        const mapContainerRef = useRef(null);
        useEffect(() => {
          const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/dcartist/cjeu2tofp0wcs2rnbhooahyy5',
            center: [props.longitude, props.latitude],
            zoom: 17,
            pitch: 50,
          });


          // const popup = new mapboxgl.Popup({ offset: 25,
          //   closeOnClick: false }).setText(
          //   'Construction on the Washington Monument began in 1848.'
          //   )
            const popup = new mapboxgl.Popup({ closeOnClick: false, offset: 30,})
            .setLngLat([props.longitude, props.latitude])
            .setHTML(`<div className="marker-label"><p>${props.facility_name}</p> <p>${props.street_address}</p> </div>`)
            // .setText( ` ` )
            .addTo(map);

          
          const mapMarker =  new mapboxgl.Marker({
            color: "red",
            draggable: false
            }).setLngLat([props.longitude, props.latitude])
            // .setPopup(popup) 
            .addTo(map);
            popup.isOpen();
          return () => map.remove();
        }, []); 
  return <div className="mapalt-container" ref={mapContainerRef} />;
}
