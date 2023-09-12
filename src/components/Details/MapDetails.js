import React, { useEffect, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import {Icon} from 'leaflet'
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import L from "leaflet";

function ChangeView({ center }) {
  const map = useMap();
  map.setView(center);
  return null;
}

function ResetCenterView({ center }) {
  // const { selectPosition } = props;
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(
        L.latLng(center),
        map.getZoom(),
        {
          animate: true
        }
      )
    }
  }, [center, map]);

  return null;
}

const MapDetails = ({ position }) => {
  const center = [0,0] 
  return (
    <MapContainer
    style={{height: '400px', width: '100%', zIndex: 0}}
    center={position ? position : center}
    zoom={13}
    scrollWheelZoom={false}>
    <ChangeView center={position ? position : center} />
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    {position && (
        <Marker position={position ? position : center} icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}>
          <Popup>
            You selected this location.
          </Popup>
        </Marker>
      )}
      <ResetCenterView selectPosition={position ? position : center} />
    {/* <LocationMarker /> */}
  </MapContainer>
  )
}

export default MapDetails