import { FileInput, Label } from "flowbite-react";
import { ImageSkeleton } from "@/app/ui/skeletons/imageSkeleton";
import CoordinateHUD from "@/app/ui/components/coordinateHUD";

export default function CoordinatorSkeleton({
  heading,
  inputId,
}: {
  heading: string;
  inputId: string;
}) {
  return (
    <div className={"my-2"}>
      <div>
        <Label htmlFor={inputId} value={heading} />
      </div>
      <FileInput />
      <div className={"my-1"} />
      {/* Spacing */}
      <ImageSkeleton />
      <div className={"my-1"} />
      {/* Spacing */}
      <CoordinateHUD />
    </div>
  );
}
