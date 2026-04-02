"use client";

import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  className?: string;
};

export default function SiteImage({ src, alt, className }: Props) {
  return (
    <Image
      src={src}
      alt={alt}
      width={1600}
      height={900}
      className={className}
      style={{ width: "100%", height: "auto" }}
      onError={(e) => {
        (e.target as HTMLImageElement).style.display = "none";
      }}
    />
  );
}
