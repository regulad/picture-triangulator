"use client";

import "leaflet/dist/leaflet.css";
import markerPath from "leaflet/dist/images/marker-icon-2x.png";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import { GPSPointData } from "@/app/lib/metadata";
import React, { useEffect } from "react";
import { LatLngExpression, icon } from "leaflet";
import { pointAsString } from "@/app/ui/components/coordinateHUD";

function latLongExpresssionOfPoint(point: GPSPointData): LatLngExpression {
  return [point.lat, point.lng];
}

const markerIcon = icon({
  iconUrl: markerPath.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function MapView({
  className = undefined,
  point1,
  point2,
  triangulatedPoint,
}: Readonly<{
  className?: string;
  point1: GPSPointData | null;
  point2: GPSPointData | null;
  triangulatedPoint: GPSPointData | null;
}>) {
  // TODO: maybe this? https://react-leaflet.js.org/docs/example-external-state/

  let center: LatLngExpression = [0, 0];
  if (triangulatedPoint) {
    center = latLongExpresssionOfPoint(triangulatedPoint);
  } else if (point1) {
    center = latLongExpresssionOfPoint(point1);
  } else if (point2) {
    center = latLongExpresssionOfPoint(point2);
  }

  return (
    <div className={className}>
      <MapContainer
        center={center}
        zoom={triangulatedPoint ? 15 : 1}
        scrollWheelZoom={true}
        className={"h-full w-full z-0"}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {point1 && (
          <Marker icon={markerIcon} position={[point1.lat, point1.lng]}>
            <Popup>
              <p>Point 1</p>
              {point1.hasOwnProperty("imageBase64") && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={point1.imageBase64}
                  className={"w-36"}
                  alt={"Point 1"}
                />
              )}
              <p>{pointAsString(point1)}</p>
            </Popup>
          </Marker>
        )}
        {point2 && (
          <Marker icon={markerIcon} position={[point2.lat, point2.lng]}>
            <Popup>
              <p>Point 2</p>
              {point2.hasOwnProperty("imageBase64") && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={point2.imageBase64}
                  className={"w-36"}
                  alt={"Point 2"}
                />
              )}
              <p>{pointAsString(point2)}</p>
            </Popup>
          </Marker>
        )}
        {triangulatedPoint && (
          <Marker
            icon={markerIcon}
            position={[triangulatedPoint.lat, triangulatedPoint.lng]}
          >
            <Popup>
              <p>Triangulated Point</p>
              <p>{pointAsString(triangulatedPoint)}</p>
            </Popup>
          </Marker>
        )}
        {/* finally, we need to draw a line from our two points to the triangulated point */}
        {point1 && point2 && triangulatedPoint && (
          <Polyline
            positions={[
              latLongExpresssionOfPoint(point1),
              latLongExpresssionOfPoint(triangulatedPoint),
              latLongExpresssionOfPoint(point2),
            ]}
          />
        )}
      </MapContainer>
    </div>
  );
}
