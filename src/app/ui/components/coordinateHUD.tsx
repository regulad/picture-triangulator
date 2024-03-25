import { GPSPointData } from "@/app/lib/metadata";

export function pointAsString(data: GPSPointData) {
  return `${data.lat.toFixed(6)}, ${data.lng.toFixed(6)}${data.altitude ? `, ${data.altitude.toFixed(2)}m` : ""}${data.bearing ? `, ${data.bearing.toFixed(2)}°` : ""}`;
}

export default function CoordinateHUD({
  data,
  text = "No data provided.",
}: Readonly<{ data?: GPSPointData | null; text?: string }>) {
  // gray
  return (
    <div className={"bg-gray-200 p-2 w-full rounded"}>
      {data ? pointAsString(data) : text}
    </div>
  );
}
