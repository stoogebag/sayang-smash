"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "~/trpc/react";

export default function RandomWorkoutPage() {
  const router = useRouter();
  const trpc = useTRPC();

  const { data: workout, isLoading } = useQuery(
    trpc.workout.getRandom.queryOptions(),
  );

  useEffect(() => {
    if (workout) {
      router.replace(`/workout/${workout.slug}`);
    }
  }, [workout, router]);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-[#0f172a]">
        <p className="font-display text-sm tracking-wider text-[#64748b] uppercase">
          Finding a workout...
        </p>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-[#0f172a] px-5">
        <p className="font-display text-center text-sm tracking-wider text-[#94a3b8] uppercase">
          No workouts exist yet
        </p>
        <button
          onClick={() => router.push("/create")}
          className="font-display font-700 mt-6 cursor-pointer bg-orange-500 px-8 py-4 text-base tracking-wider text-white uppercase"
        >
          Create One
        </button>
      </div>
    );
  }

  return null;
}
