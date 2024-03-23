import { bytesToBase64 } from "byte-base64";
// @ts-ignore
import piexif from "piexifjs";

const VALID_HEIC_CC_CODES = [
  "heic",
  "heix",
  "hevc",
  "hevx",
  "heis",
  "heim",
  "hevm",
  "hevs",
];

// export async function convertHEICFileToJPEGBase64(image: File) {
//   // step 1. validate that this is a heic
//   if (image.type !== "image/heic") {
//     throw new Error("Only HEIC images are supported!");
//   }
//
//   // step 2. convert into base64
//   const arrayBuffer = await image.arrayBuffer();
//   const uint8array = new Uint8Array(arrayBuffer);
//
//   // check for heic magic number
//   // heic magic number is 8 bytes long
//   // https://github.com/strukturag/libheif/issues/83#issuecomment-421427091
//   // starting at byte index 4
//   // load into consts
//   const ftyp = uint8array.slice(4, 8);
//   const ccCode = uint8array.slice(8, 12);
//
//   // convert to text
//   const decoder = new TextDecoder();
//   const ftypString = decoder.decode(ftyp);
//   const ccCodeString = decoder.decode(ccCode);
//
//   if (ftypString !== "ftyp") {
//     throw new Error("Invalid HEIC image!");
//   }
//   if (!VALID_HEIC_CC_CODES.includes(ccCodeString)) {
//     throw new Error("Unsupported HEIC image!");
//   }
//
//   // step 3. convert into jpeg
//   let outputBuffer: ArrayBuffer | null = null;
//   try {
//     outputBuffer = await convert({
//       format: "JPEG",
//       buffer: arrayBuffer,
//       quality: 1
//     });
//   } catch {
//     throw new Error("Could not convert HEIC image to JPEG!");
//   }
//   if (!outputBuffer) {
//     throw new Error("Could not convert HEIC image to JPEG!");
//   }
//   const outputUint8Array = new Uint8Array(outputBuffer);
//
//   return "data:image/jpeg;base64," + bytesToBase64(outputUint8Array);
// }

export async function convertJPEGFileToBase64(image: File) {
  // step 1. validate that this is a jpeg
  if (image.type !== "image/jpeg") {
    throw new Error("Only JPEG images are supported!");
  }

  // step 2. convert into base64
  const arrayBuffer = await image.arrayBuffer();
  const uint8array = new Uint8Array(arrayBuffer);

  // check for jpeg magic number
  if (uint8array[0] !== 0xff || uint8array[1] !== 0xd8) {
    throw new Error("Invalid JPEG image!");
  }

  return "data:image/jpeg;base64," + bytesToBase64(uint8array);
}

export async function convertImageFileToBase64(image: File) {
  switch (image.type) {
    case "image/jpeg":
      return await convertJPEGFileToBase64(image);
    case "image/heic":
      // return await convertHEICFileToJPEGBase64(image);
      throw new Error(
        "HEIC images are not yet supported. Please configure your phone to take JPEGs.",
      );
    case "image/png":
      throw new Error("PNG images do not contain metadata!");
    default:
      throw new Error("Unsupported image format!");
  }
}

export type GPSData = { [p: string]: any };

export function extractGPSData(imageBase64: string): GPSData {
  // step 3. digest with piexifjs
  let piexifDump: { [p: string]: any };
  try {
    piexifDump = piexif.load(imageBase64);
  } catch {
    throw new Error("Could not extract metadata from image!");
  }
  const gpsData = piexifDump.GPS;

  // step 4. extractGPSdata
  return Object.fromEntries(
    Object.entries<number>(piexif.GPSIFD).flatMap(([tag, nonce]) => {
      if (gpsData.hasOwnProperty(nonce)) {
        return [[tag, gpsData[String(nonce)]]];
      } else {
        return [];
      }
    }),
  ) satisfies GPSData;
}

export type CoordinateReference = "N" | "S" | "E" | "W";

export function getDecimalCoordinateForExifCoordinate(
  direction: CoordinateReference,
  exifCoordinate: Array<Array<number>>,
): number {
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

export function getTrueNorthBearingForExifBearing(
  reference: BearingReference,
  exifBearing: Array<number>,
): number {
  const bearing = exifBearing[0] / exifBearing[1];

  if (reference === "T") {
    return bearing;
  } else {
    return bearing + 17; // magnetic declination is around 17 degrees
  }
}

export type GPSPointData = {
  lat: number;
  lng: number;
  altitude: number | null;
  bearing: number | null;
  imageBase64?: string;
};

export function getGPSPointData(gpsData: GPSData): GPSPointData {
  const lat = getDecimalCoordinateForExifCoordinate(
    gpsData["GPSLatitudeRef"],
    gpsData["GPSLatitude"],
  );

  const long = getDecimalCoordinateForExifCoordinate(
    gpsData["GPSLongitudeRef"],
    gpsData["GPSLongitude"],
  );

  const altitude =
    (gpsData.hasOwnProperty("GPSAltitude") &&
      gpsData["GPSAltitude"][0] / gpsData["GPSAltitude"][1]) ||
    null;

  const bearing =
    (gpsData.hasOwnProperty("GPSImgDirectionRef") &&
      gpsData.hasOwnProperty("GPSImgDirection") &&
      getTrueNorthBearingForExifBearing(
        gpsData["GPSImgDirectionRef"],
        gpsData["GPSImgDirection"],
      )) ||
    null;

  return {
    lat,
    lng: long,
    altitude,
    bearing,
  };
}
