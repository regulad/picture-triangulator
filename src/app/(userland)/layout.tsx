import React, { ReactNode } from "react";
import Topbar from "@/app/ui/components/topbar";
import { Kbd } from "flowbite-react";

export default function Layout({
  children,
}: Readonly<{ children?: ReactNode }>): ReactNode {
  return (
    <main>
      <Topbar />
      <div className={"m-2 container mx-auto px-2"}>
        <section>{children}</section>
        <footer>
          <p className={"mt-3"}>
            Made with{" "}
            <a
              className={"classic-link"}
              href={"https://github.com/regulad/picture-triangulator"}
            >
              Open-Source
            </a>{" "}
            <Kbd>{"<"}3</Kbd> by Parker Wahle (
            <a className={"classic-link"} href={"https://regulad.xyz"}>
              regulad
            </a>
            )
          </p>
        </footer>
      </div>
    </main>
  );
}
