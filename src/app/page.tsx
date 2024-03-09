import Topbar from "@/app/ui/components/topbar";
import {Suspense} from "react";
import ClientSideApp from "@/app/ui/components/interactive";

export default function Home() {
  return (
    <main>
      <Topbar/>
      <section className={"m-2"}>
        <p className={"my-2"}>
          Locate any object by using two location data-embedded pictures of it.
        </p>
        <Suspense>
          <ClientSideApp />
        </Suspense>
      </section>
    </main>
  );
}
