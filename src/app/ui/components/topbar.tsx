import {HomeIcon} from "@heroicons/react/24/solid";
import Link from "next/link";
import RandomGlobe from "@/app/ui/components/randomGlobe";

export default function Topbar() {
  return (
    <header className={"min-w-full flex justify-between items-center p-4 sticky top-0"}>
      <div className={"flex"}>
        <RandomGlobe className={"h-8 w-8"} />
        <h1 className={"text-2xl font-bold"}>Triangulator</h1>
      </div>
      <Link href={"/"}>
        <HomeIcon className={"h-8 w-8"}/>
      </Link>
    </header>
  )
}