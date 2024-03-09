import Topbar from "@/app/ui/components/topbar";
import {Suspense} from "react";
import ClientSideApp from "@/app/ui/components/clientSideApp";
import ClientSideAppSkeleton from "@/app/ui/skeletons/clientSideAppSkeleton";
import {Kbd} from "flowbite-react";

export default function Home() {
  return (
    <main>
      <Topbar/>
      <section className={"m-2"}>
        <p className={"my-2"}>
          Upload any two pictures and triangulate the location of the subject using the embedded GPS data.
        </p>
        <p className={"my-2"}>
          Useful for figuring out what people are taking pictures of in the middle of nowhere, or whatever you want to
          use it for.
        </p>
        <p className={"my-2"}>
          Your pictures will not be uploaded to any server. All processing is done client-side.
        </p>
        <p className={"my-2"}>
          Some browsers may remove the GPS data from the pictures when you add them. If you&apos;re using a phone, you may need to request a desktop site.
        </p>
        <Suspense fallback={<ClientSideAppSkeleton/>}>
          <ClientSideApp/>
        </Suspense>
        <p className={"my-3"}>
          Made with <a className={"classic-link"} href={"https://github.com/regulad/picture-triangulator"}>Open-Source</a> <Kbd>{"<"}3</Kbd> by Parker Wahle (<a className={"classic-link"} href={"https://regulad.xyz"}>regulad</a>)
        </p>
      </section>
    </main>
  );
}
