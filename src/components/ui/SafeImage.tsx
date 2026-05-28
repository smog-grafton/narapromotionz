"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { imageUrl } from "@/lib/utils";

type Props = Omit<ImageProps, "src"> & {
  src?: string | null;
  fallbackSrc: string;
  allowFallbackOnError?: boolean;
};

export function SafeImage({ src, fallbackSrc, alt, onError, allowFallbackOnError = false, ...props }: Props) {
  const [currentSrc, setCurrentSrc] = useState(imageUrl(src, fallbackSrc));

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt}
      onError={(event) => {
        if (allowFallbackOnError && currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
        }
        onError?.(event);
      }}
    />
  );
}
