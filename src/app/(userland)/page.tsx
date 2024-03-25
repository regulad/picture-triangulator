import React, { Suspense } from "react";
import ClientSideApp from "@/app/ui/components/clientSideApp";
import ClientSideAppSkeleton from "@/app/ui/skeletons/clientSideAppSkeleton";
import {
  Accordion,
  AccordionContent,
  AccordionPanel,
  AccordionTitle,
  Kbd,
} from "flowbite-react";
import Topbar from "@/app/ui/components/topbar";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <p>
        Get the coordinates of the subject of any two photos.{" "}
        <Link className={"classic-link"} href={"/about"}>
          Learn more
        </Link>
        .
      </p>
      <Suspense fallback={<ClientSideAppSkeleton />}>
        <ClientSideApp />
      </Suspense>
    </>
  );
}
