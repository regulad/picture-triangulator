import {bytesToBase64} from "byte-base64";
// @ts-ignore
import piexif from "piexifjs";

export async function convertJPEGFileToBase64(image: File) {
  // step 1. validate that this is a jpeg
  if (!(image.name.toUpperCase().endsWith(".JPEG") || image.name.toUpperCase().endsWith(".JPEG"))) {
    throw Error("File must be a JPEG. Other formats are not supported.");
  }

  // step 2. convert into base64
  const arrayBuffer = await image.arrayBuffer();
  const uint8array = new Uint8Array(arrayBuffer);
  return "data:image/jpeg;base64," + bytesToBase64(uint8array);
}

export type GPSData = {[p: string]: any};

export function extractGPSData(imageBase64: string): GPSData {
  // step 3. digest with piexifjs
  let piexifDump: {[p: string]: any};
  try {
    piexifDump = piexif.load(imageBase64);
  } catch {
    throw new Error("Could not extract metadata from image!");
  }
  const gpsData = piexifDump.GPS;

  // step 4. extractGPSdata
  return Object.fromEntries(Object.entries<number>(piexif.GPSIFD).flatMap(([tag, nonce]) => {
    if (gpsData.hasOwnProperty(nonce)) {
      return [[tag, gpsData[String(nonce)]]];
    } else {
      return [];
    }
  })) satisfies GPSData;
}

export type CoordinateReference = "N" | "S" | "E" | "W";

export function getDecimalCoordinateForExifCoordinate(direction: CoordinateReference, exifCoordinate: Array<Array<number>>): number {
  const degrees = exifCoordinate[0][0] / exifCoordinate[0][1];
  const minutes = exifCoordinate[1][0] / exifCoordinate[1][1];
  const seconds = exifCoordinate[2][0] / exifCoordinate[2][1];

  let multiplicationFactor: number;
  switch (direction) {
    case "S":
    case "W":
      multiplicationFactor = -1;
      break;
    default:
      multiplicationFactor = 1;
      break;
  }

  return (degrees + minutes / 60 + seconds / 3600) * multiplicationFactor;
}

// T: True North
// M: Magnetic North
export type BearingReference = "T" | "M";

export function getTrueNorthBearingForExifBearing(reference: BearingReference, exifBearing: Array<number>): number {
  const bearing = exifBearing[0] / exifBearing[1];

  if (reference === "T") {
    return bearing;
  } else {
    return bearing + 17; // magnetic declination is around 17 degrees
  }
}

export type GPSPointData = {
  lat: number,
  lng: number,
  altitude: number | null,
  bearing: number | null
};

export function getGPSPointData(gpsData: GPSData): GPSPointData {
  const lat = getDecimalCoordinateForExifCoordinate(
    gpsData["GPSLatitudeRef"],
    gpsData["GPSLatitude"]
  );

  const long = getDecimalCoordinateForExifCoordinate(
    gpsData["GPSLongitudeRef"],
    gpsData["GPSLongitude"]
  );

  const altitude = (gpsData.hasOwnProperty("GPSAltitude") && (gpsData["GPSAltitude"][0] / gpsData["GPSAltitude"][1])) || null;

  const bearing = (gpsData.hasOwnProperty("GPSImgDirectionRef") &&  gpsData.hasOwnProperty("GPSImgDirection") && getTrueNorthBearingForExifBearing(
    gpsData["GPSImgDirectionRef"],
    gpsData["GPSImgDirection"]
  )) || null;

  return {
    lat,
    lng: long,
    altitude,
    bearing
  };
}
