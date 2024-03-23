import { GlobeAmericasIcon, HomeIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function Topbar() {
  return (
    <header className="min-w-full flex justify-between items-center p-4 sticky top-0 bg-white z-50 drop-shadow">
      <div className={"flex"}>
        <GlobeAmericasIcon className={"h-8 w-8"} />
        <h1 className={"text-2xl font-bold"}>Picture Triangulator</h1>
      </div>
      <nav>
        <Link href={"/"}>
          <HomeIcon className={"h-8 w-8"} />
        </Link>
      </nav>
    </header>
  );
}
