"use client";

import { useEffect, useState } from "react";

/**
 * Reports whether an image actually loaded, so a component can lay itself out
 * differently when the artwork has not been supplied yet — rather than leaving
 * a broken frame or standing in with drawn ornament.
 */
export function useAsset(src: string) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let live = true;
    const img = new Image();
    img.onload = () => live && setReady(true);
    img.src = src;
    return () => {
      live = false;
    };
  }, [src]);

  return ready;
}

/** An optional decorative image. Renders nothing until the file exists. */
export function Ornament({
  src,
  className = "",
  alt = "",
}: {
  src: string;
  className?: string;
  alt?: string;
}) {
  const ready = useAsset(src);
  if (!ready) return null;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} aria-hidden={alt === ""} className={className} />;
}
