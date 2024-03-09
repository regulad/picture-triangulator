"use client";

import Globe, {GlobeProps} from "react-globe.gl";
import {useEffect, useState} from "react";

export default function FillingGlobe({className = undefined, ...props}: Readonly<GlobeProps & { className?: string }>) {
  // This component is a wrapper around react-globe.gl that fills the entire element and resizes with the element

  // viewport width and height
  const [globeViewElement, setGlobeViewElement] = useState<HTMLDivElement | null>(null);
  const [globeWidth, setGlobeWidth] = useState<number>(0);
  const [globeHeight, setGlobeHeight] = useState<number>(0);

  useEffect(() => {
    function handleResize() {
      if (globeViewElement) {
        setGlobeWidth(globeViewElement.clientWidth);
        setGlobeHeight(globeViewElement.clientHeight);
      }
    }

    window.addEventListener("resize", handleResize); // is this a memory leak?
    handleResize();
  }, [globeViewElement]);

  const handleGlobeViewRef = (element: HTMLDivElement | null) => {
    setGlobeViewElement(element);
  }

  return (
    <div ref={handleGlobeViewRef} className={className}>
      <Globe
        height={globeHeight}
        width={globeWidth}
        {...props}
      />
    </div>
  )
}
