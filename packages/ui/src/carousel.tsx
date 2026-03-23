"use client";

import type { EmblaCarouselType } from "embla-carousel-react";
import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";

import { cn } from "./index";

export type CarouselProps = {
  options?: Parameters<typeof useEmblaCarousel>[0];
  className?: string;
  children: React.ReactNode;
  setApi?: (api: EmblaCarouselType | undefined) => void;
};

export function Carousel({
  className,
  children,
  options,
  setApi,
}: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  React.useEffect(() => {
    if (setApi) {
      setApi(emblaApi);
    }
  }, [emblaApi, setApi]);

  return (
    <div ref={emblaRef} className={cn("overflow-hidden", className)}>
      {children}
    </div>
  );
}

export type CarouselContentProps = {
  className?: string;
  children: React.ReactNode;
};

export function CarouselContent({ className, children }: CarouselContentProps) {
  return <div className={cn("flex", className)}>{children}</div>;
}

export type CarouselItemProps = {
  className?: string;
  children: React.ReactNode;
};

export function CarouselItem({ className, children }: CarouselItemProps) {
  return (
    <div
      className={cn("flex h-full min-w-0 flex-[0_0_100%] flex-col", className)}
    >
      {children}
    </div>
  );
}

type CarouselButtonProps = {
  className?: string;
  emblaApi?: EmblaCarouselType;
};

export function CarouselNext({ className, emblaApi }: CarouselButtonProps) {
  return null;
}

export function CarouselPrevious({ className, emblaApi }: CarouselButtonProps) {
  return null;
}

export type { EmblaCarouselType };
