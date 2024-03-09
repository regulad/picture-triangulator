import {GlobeAmericasIcon, GlobeAsiaAustraliaIcon} from "@heroicons/react/24/solid";

const globeClasses = [GlobeAmericasIcon, GlobeAsiaAustraliaIcon];

export default function RandomGlobe({className = undefined}: Readonly<{ className?: string | undefined }>) {
  const GlobeClass = globeClasses[Math.floor(Math.random() * globeClasses.length)];

  return (
    <GlobeClass className={className}/>
  )
}