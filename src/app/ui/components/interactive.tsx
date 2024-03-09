"use client";

import {Suspense, useState} from "react";
import Coordinator from "@/app/ui/components/coordinator";
import Globe from "react-globe.gl";
import {getDecimalCoordinateForExifCoordinate, getGPSPointData, GPSData} from "@/app/lib/metadata";
import CoordinatorSkeleton from "@/app/ui/skeletons/coordinatorSkeleton";
import {triangulatePointFromPointData} from "@/app/lib/coordinateMath";

export default function ClientSideApp() {
  const [gpsData1, setGpsData1] = useState<GPSData | null>(null);
  const [gpsData2, setGpsData2] = useState<GPSData | null>(null);

  const gpsPoint1 = gpsData1 && getGPSPointData(gpsData1);
  const gpsPoint2 = gpsData2 && getGPSPointData(gpsData2);
  const triangulatedPoint = gpsPoint1 && gpsPoint2 && triangulatePointFromPointData(gpsPoint1, gpsPoint2);

  const arcsData = [];
  if (triangulatedPoint) {
    arcsData.push({
      name: "Point 1 to Triangulated Point",
      startLat: gpsPoint1.lat,
      startLng: gpsPoint1.lng,
      endLat: triangulatedPoint.lat,
      endLng: triangulatedPoint.lng,
      color: "#FF0000",
    });
    arcsData.push({
      name: "Point 2 to Triangulated Point",
      startLat: gpsPoint1.lat,
      startLng: gpsPoint1.lng,
      endLat: triangulatedPoint.lat,
      endLng: triangulatedPoint.lng,
      color: "#00FF00",
    });
  }

  const pointsData = [];
  if (gpsPoint1) {
    pointsData.push({
      name: "Point 1",
      lat: gpsPoint1.lat,
      lng: gpsPoint1.lng,
      altitude: gpsPoint1.altitude,
      color: "#FF0000"
    });
  }
  if (gpsPoint2) {
    pointsData.push({
      name: "Point 2",
      lat: gpsPoint2.lat,
      lng: gpsPoint2.lng,
      color: "#00FF00"
    });
  }
  if (triangulatedPoint) {
    pointsData.push({
      name: "Triangulated Point",
      lat: triangulatedPoint.lat,
      lng: triangulatedPoint.lng,
      color: "#0000FF"
    });
  }

  return (
    <>
      <Suspense fallback={<CoordinatorSkeleton heading={"Picture 2"} inputId={"picture2"} />}>
        <Coordinator heading={"Picture 1"} inputId={"picture1"} onChange={async (gpsData) => setGpsData1(gpsData)}/>
      </Suspense>
      <Suspense fallback={<CoordinatorSkeleton heading={"Picture 2"} inputId={"picture2"} />} >
        <Coordinator heading={"Picture 2"} inputId={"picture2"} onChange={async (gpsData) => setGpsData2(gpsData)}/>
      </Suspense>
      <div className={"aspect-square w-1/2"}>
        <Suspense>
          <Globe
            width={400}
            height={400}

            pointsData={pointsData}
            pointColor={"color"} // uses "color" from each point object

            arcsData={arcsData}
            arcColor={"color"} // uses "color" from each arc object

            globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          />
        </Suspense>
      </div>
    </>
  );
}