"use client";

import dynamic from "next/dynamic";
import {Suspense, useState} from "react";
import Coordinator from "@/app/ui/components/coordinator";
import {GPSPointData} from "@/app/lib/metadata";
import CoordinatorSkeleton from "@/app/ui/skeletons/coordinatorSkeleton";
import {triangulatePointFromPointData} from "@/app/lib/coordinateMath";
import VideoSkeleton from "@/app/ui/skeletons/videoSkeleton";
import {Dropdown} from "flowbite-react";
import CoordinateHUD from "@/app/ui/components/coordinateHUD";

// both of these are super fancy and use the window object, so they need to be loaded client-side exclusively
const FillingGlobe = dynamic(() => import("@/app/ui/components/fillingGlobe"), {
  loading: () => <VideoSkeleton/>,
  ssr: false
});
const MapView = dynamic(() => import("@/app/ui/components/mapView"), {
  loading: () => <VideoSkeleton/>,
  ssr: false
});

export enum ViewOptions {
  Globe,
  Map
}

export default function ClientSideApp() {
  const [gpsPoint1, setGpsPoint1] = useState<GPSPointData | null>(null);
  const [gpsPoint2, setGpsPoint2] = useState<GPSPointData | null>(null);
  const [viewOption, setViewOption] = useState<ViewOptions>(ViewOptions.Map);
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
      <div className={"md:flex flex-auto"}>
        <div className={"md:basis-1/2"}>
          <Suspense fallback={<CoordinatorSkeleton heading={"Picture 2"} inputId={"picture2"}/>}>
            <Coordinator heading={"Picture 1"} inputId={"picture1"} onChange={setGpsPoint1}/>
          </Suspense>
        </div>
        <div className={"w-2"}/>
        {/* spacer */}
        <div className={"md:basis-1/2"}>
          <Suspense fallback={<CoordinatorSkeleton heading={"Picture 2"} inputId={"picture2"}/>}>
            <Coordinator heading={"Picture 2"} inputId={"picture2"} onChange={setGpsPoint2}/>
          </Suspense>
        </div>
      </div>
      <div className={"flex justify-center align-center my-1"}>
        <Dropdown label={ViewOptions[viewOption]}>
          <Dropdown.Item onClick={() => setViewOption(ViewOptions.Globe)}>Globe</Dropdown.Item>
          <Dropdown.Item onClick={() => setViewOption(ViewOptions.Map)}>Map</Dropdown.Item>
        </Dropdown>
        <div className={"w-2"}/>
        {/* spacer */}
        <span className={"my-auto"}>
          Triangulated Point:
        </span>
        <div className={"w-2"}/>
        {/* spacer */}
        <div>
          <CoordinateHUD data={triangulatedPoint}/>
        </div>
      </div>
      <div>
        {viewOption === ViewOptions.Globe ?
          <FillingGlobe
            className={"max-w-full h-96"}

            pointsData={pointsData}
            pointColor={"color"} // uses "color" from each point object

            arcsData={arcsData}
            arcColor={"color"} // uses "color" from each arc object

            globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          />
          :
          <MapView
            className={"max-w-full h-96"}

            point1={gpsPoint1}
            point2={gpsPoint2}
            triangulatedPoint={triangulatedPoint}
          />
        }
      </div>
    </>
  );
}