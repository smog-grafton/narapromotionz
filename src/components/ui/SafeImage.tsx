"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { imageUrl } from "@/lib/utils";

type Props = Omit<ImageProps, "src"> & {
  src?: string | null;
  fallbackSrc: string;
};

export function SafeImage({ src, fallbackSrc, alt, onError, ...props }: Props) {
  const [currentSrc, setCurrentSrc] = useState(imageUrl(src, fallbackSrc));

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt}
      onError={(event) => {
        if (currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
        }
        onError?.(event);
      }}
    />
  );
}
