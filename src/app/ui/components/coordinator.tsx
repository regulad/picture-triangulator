"use client";

import { FileInput, Label } from "flowbite-react";
import { Suspense, useState } from "react";
import { clsx } from "clsx";
import {
  convertImageFileToBase64,
  extractGPSData,
  getGPSPointData,
  GPSData,
  GPSPointData,
} from "@/app/lib/metadata";
import { ImageSkeleton } from "@/app/ui/skeletons/imageSkeleton";
import { maybePromise } from "@/app/lib/util";
import CoordinateHUD from "@/app/ui/components/coordinateHUD";

export type OnChangeType = (
  gpsData: GPSPointData | null,
) => Promise<void> | void;

export default function Coordinator({
  heading,
  inputId,
  onChange,
}: {
  heading: string;
  inputId: string;
  onChange: OnChangeType;
}) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [gpsPointData, setGpsPointDataRaw] = useState<GPSPointData | null>(
    null,
  );

  async function setGpsPointData(gpsData: GPSPointData | null) {
    setGpsPointDataRaw(gpsData);
    await maybePromise(onChange(gpsData ? gpsData : null));
  }

  return (
    <div className={"my-2"}>
      <div>
        <Label htmlFor={inputId} value={heading} />
      </div>
      <FileInput
        onChange={async (e) => {
          const file =
            (e.target.files &&
              e.target.files.length > 0 &&
              e.target.files[0]) ||
            null;

          if (!file) {
            setError(null);
            setImageUrl(null);
            await setGpsPointData(null);
            return;
          }

          let imageBase64: string;
          try {
            imageBase64 = await convertImageFileToBase64(file);
          } catch (e: any) {
            setError(e.message);
            setImageUrl(null);
            await setGpsPointData(null);
            return;
          }
          setImageUrl(imageBase64);

          let gpsData: GPSData;
          try {
            gpsData = extractGPSData(imageBase64);
          } catch (e: any) {
            setError(e.message);
            await setGpsPointData(null);
            return;
          }

          if (!gpsData) {
            setError("Image does not contain GPS data. Was it removed?");
            return;
          }

          const gpsPointData = getGPSPointData(gpsData);
          gpsPointData.imageBase64 = imageBase64;

          if (!gpsPointData.bearing) {
            setError(
              "Image has GPS data, but no bearing. Triangulation will not be possible.",
            );
          } else {
            setError("Successfully added picture to globe.");
          }
          await setGpsPointData(gpsPointData);
        }}
      />
      <div className={"my-1"} />
      {/* spacing */}
      {(imageUrl && (
        <>
          <Suspense fallback={<ImageSkeleton />}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={"Image Preview"}
              className={"max-w-full max-h-[30em]"}
            />
          </Suspense>
        </>
      )) || <ImageSkeleton pulse={false} />}
      <p
        className={clsx({
          hidden: !error,
          "text-red-500": true,
        })}
      >
        {error}
      </p>
      <div className={"my-1"} />
      {/* spacing */}
      <CoordinateHUD
        data={gpsPointData}
        text={
          !!imageUrl
            ? "Image does not contain coordinate data."
            : "No picture uploaded."
        }
      />
    </div>
  );
}
