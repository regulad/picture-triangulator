import {FileInput, Label} from "flowbite-react";
import {convertJPEGFileToBase64, extractGPSData, GPSData} from "@/app/lib/metadata";
import {clsx} from "clsx";

export default function CoordinatorSkeleton({ heading, inputId }: { heading: string, inputId: string }) {
  return (
    <div className={"my-2"}>
      <div>
        <Label htmlFor={inputId} value={heading}/>
      </div>
      <FileInput
        helperText={"JPEG Only"}
      />
    </div>
  );
}