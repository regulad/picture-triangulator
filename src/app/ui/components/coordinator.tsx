"use client";

import {FileInput, Label} from "flowbite-react";
import {ChangeEvent, useEffect, useState} from "react";
import {clsx} from "clsx";
import {convertJPEGFileToBase64, extractGPSData, GPSData} from "@/app/lib/metadata";
import Dropzone from "@/app/ui/flowbyte/dropzone";

export type OnChangeType = (gpsData: GPSData | null, imageUrl: string | null) => Promise<void> | void;

export default function Coordinator({ heading, inputId, onChange }: { heading: string, inputId: string, onChange: OnChangeType }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className={"my-2"}>
      <div>
        <Label htmlFor={inputId} value={heading}/>
      </div>
      <FileInput
        helperText={"JPEG Only"}
        onChange={async (e) => {
          const file = (e.target.files && e.target.files.length > 0 && e.target.files[0]) || null;

          if (!file) {
            setError(null);
            setImageUrl(null);
            await onChange(null, null);
            return;
          }

          let imageBase64: string;
          try {
            imageBase64 = await convertJPEGFileToBase64(file);
          } catch {
            setError("Could not parse image. Is it a JPEG?");
            await onChange(null, null);
            return;
          }
          setImageUrl(imageBase64);

          let gpsData: GPSData;
          try {
            gpsData = extractGPSData(imageBase64);
          } catch (e: any) {
            setError(e.message);
            await onChange(null, null);
            return;
          }

          if (!gpsData) {
            setError("Image does not contain GPS data. Was it removed?");
            return;
          }

          setError("Successfully added picture to globe.");
          await onChange(gpsData, imageBase64);
        }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <p className={clsx({
        "hidden": !error,
        "text-red-500": true,
      })}>
        {error}
      </p>
    </div>
  );
}