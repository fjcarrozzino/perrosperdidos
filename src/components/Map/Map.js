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

const Map = ({ center }) => {
  const [position, setPosition] = useState([51.505, -0.09])

  useEffect(() => {
    if(center.length) {
      setPosition(center)
    }

  },[center])

  return (
    <MapContainer
    style={{height: '400px', width: '700px'}}
    center={position}
    zoom={13}
    scrollWheelZoom={false}>
    <ChangeView center={position} />
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    {position && (
        <Marker position={position} icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}>
          <Popup>
            You selected this location.
          </Popup>
        </Marker>
      )}
      <ResetCenterView selectPosition={position} />
    {/* <LocationMarker /> */}
  </MapContainer>
  )
}

export default Map