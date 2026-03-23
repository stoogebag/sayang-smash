"use client";

import { useEffect, useRef, useState } from "react";

import type { EmblaCarouselType } from "@acme/ui";
import { Progress } from "@acme/ui";

interface TimerProps {
  emblaApi?: EmblaCarouselType;
  isFirst?: boolean;
  isActive?: boolean;
  timeLimitMultiplier?: number;
  onTimeUp?: () => void;
  onAnswer?: (selectedOption: string) => void;
}

export function Timer({
  emblaApi,
  isFirst,
  isActive,
  timeLimitMultiplier = 1,
  onTimeUp,
  onAnswer,
}: TimerProps) {
  const timeLimit = 5 * timeLimitMultiplier;
  const initialSeconds = timeLimit + 1;
  const [seconds, setSeconds] = useState(initialSeconds);
  const [hasStarted, setHasStarted] = useState(isFirst ?? false);
  const startTimeRef = useRef<number | null>(null);
  const hasCalledRef = useRef(false);

  useEffect(() => {
    if (!isActive) return;

    // When this question becomes active, start the timer
    setSeconds(initialSeconds);
    setHasStarted(true);
    startTimeRef.current = Date.now();
    hasCalledRef.current = false;

    // Set up the countdown interval
    const interval = setInterval(() => {
      if (!startTimeRef.current) return;

      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const remaining = initialSeconds - elapsed;
      setSeconds(remaining);

      // Fire callback once when it reaches 0
      if (remaining <= 0 && !hasCalledRef.current) {
        console.log("Timer reached zero");
        hasCalledRef.current = true;
        onTimeUp?.();
        onAnswer?.("");
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isActive, initialSeconds, onTimeUp]);

  if (!hasStarted) {
    return <div className="w-full p-4"></div>;
  }

  // Clamp value between 0 and timeLimit
  const displayValue = Math.max(0, Math.min(timeLimit, seconds));

  // Calculate progress: 0-100 where 100 is full time and 0 is no time left
  const progress = (displayValue / timeLimit) * 100;

  return (
    <div className="w-full px-0 py-4">
      <Progress value={progress} />
    </div>
  );
}
