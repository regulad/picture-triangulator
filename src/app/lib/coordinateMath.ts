import {GPSPointData} from "@/app/lib/metadata";
import LatLon from "geodesy/latlon-spherical";

// radius of earth
const R = 6371e3;

export function gpsPointDataToLatLon(point: GPSPointData): LatLon {
  return new LatLon(point.lat, point.lng);
}

export function latLonToGPSPointData(latLon: LatLon, altitude: number | null = null, bearing: number | null = null): GPSPointData {
  return {
    lat: latLon.lat,
    lng: latLon.lon,
    altitude,
    bearing
  };
}

export function disanceBetweenPointsMeters(point1: GPSPointData, point2: GPSPointData): number {
  const p1 = gpsPointDataToLatLon(point1);
  const p2 = gpsPointDataToLatLon(point2);
  return p1.distanceTo(p2, R);
}

export function triangulatePointFromPointData(point1: GPSPointData, point2: GPSPointData): GPSPointData {
  if (!point1.bearing || !point2.bearing) {
    throw new Error("Cannot triangulate points without bearing data.");
  }

  const p1 = gpsPointDataToLatLon(point1);
  const p2 = gpsPointDataToLatLon(point2);
  const brng1 = point1.bearing;
  const brng2 = point2.bearing;

  const pInt = LatLon.intersection(p1, brng1, p2, brng2);

  if (!pInt) {
    throw new Error("Antipodal point");
  }

  let altitude3: number | null = null;
  if (point1.altitude && point2.altitude) {
    const altitude1 = point1.altitude;
    const altitude2 = point2.altitude;
    const distance1 = p1.distanceTo(pInt, R);
    const distance2 = p2.distanceTo(pInt, R);
    altitude3 = (altitude1 * distance2 + altitude2 * distance1) / (distance1 + distance2);
    // what is this formula? it's the weighted average of the altitudes based on the distance
  }

  let bearing3: number | null = null;
  if (point1.bearing && point2.bearing) {
    const bearing1 = point1.bearing;
    const bearing2 = point2.bearing;
    bearing3 = (bearing1 + bearing2) / 2;
    // what is this formula? it's the average of the bearings
  }

  return latLonToGPSPointData(pInt, altitude3, bearing3);
}
