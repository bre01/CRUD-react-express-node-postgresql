import { useMapEvents ,Marker,Popup,MapContainer,TileLayer} from "react-leaflet"
import React, { useState, useEffect } from "react";
export default function LocationMarker(props) {
    const {position,setPosition}=props;
    const map = useMapEvents({
      click(e) {
        //map.locate()
        setPosition(e.latlng)
        map.flyTo(e.latlng, map.getZoom())
      },
      locationfound(e) {
        setPosition(e.latlng)
        map.flyTo(e.latlng, map.getZoom())
      },
    })
  
    return !position ? null : (
      <Marker position={position}>
        <Popup>You are here</Popup>
      </Marker>
    )
}