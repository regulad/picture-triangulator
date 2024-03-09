import CoordinatorSkeleton from "@/app/ui/skeletons/coordinatorSkeleton";
import {Dropdown, DropdownItem} from "flowbite-react";
import CoordinateHUD from "@/app/ui/components/coordinateHUD";
import VideoSkeleton from "@/app/ui/skeletons/videoSkeleton";
import {ViewOptions} from "@/app/ui/components/clientSideApp";

export default function ClientSideAppSkeleton() {
  return (
    <>
      <div className={"md:flex"}>
        <div className={"max-w-1/2"}>
          <CoordinatorSkeleton heading={"Picture 2"} inputId={"picture2"}/>
        </div>
        <div className={"w-2"}/>
        {/* spacer */}
        <div className={"max-w-1/2"}>
          <CoordinatorSkeleton heading={"Picture 2"} inputId={"picture2"}/>
        </div>
      </div>
      <div className={"flex justify-center align-center my-1"}>
        <div>
          <Dropdown label={"Loading..."}>
            <DropdownItem>Globe</DropdownItem>
            <DropdownItem>Map</DropdownItem>
          </Dropdown>
        </div>
        <div className={"w-2"}/> {/* spacer */}
        <span className={"my-auto"}>
          Triangulated Point:
        </span>
        <div className={"w-2"}/> {/* spacer */}
        <div>
          <CoordinateHUD/>
        </div>
      </div>
      <div className={"aspect-square w-1/2"}>
        <VideoSkeleton/>
      </div>
    </>
  );
}