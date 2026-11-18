'use client';
import Image from 'next/image';
import { useState } from 'react';
export function ProductImage({
  url,
  title,
  large,
  fallback,
}: {
  url: string;
  title: string;
  large: boolean;
  fallback: React.ReactNode;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) return fallback;
  return (
    <Image
      unoptimized
      src={url}
      alt={title}
      width={480}
      height={360}
      loading={large ? 'eager' : 'lazy'}
      onError={() => setFailed(true)}
    />
  );
}
