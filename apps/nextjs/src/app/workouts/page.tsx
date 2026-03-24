"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "~/trpc/react";

export default function WorkoutsPage() {
  const router = useRouter();
  const trpc = useTRPC();

  const { data: workouts = [], isLoading } = useQuery(
    trpc.workout.listRecent.queryOptions(),
  );

  function formatDate(date: Date) {
    const d = new Date(date);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yy = String(d.getFullYear()).slice(-2);
    return `${dd}/${mm}/${yy}`;
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#0f172a]">
      {/* Header */}
      <div className="border-b border-[#334155] bg-[#172033] px-5 pt-5 pb-3">
        <h1 className="font-display font-800 text-xl tracking-wide text-[#f8fafc] uppercase">
          Recent Workouts
        </h1>
        <p className="mt-1 font-sans text-xs text-[#94a3b8]">Last 5 created</p>
      </div>

      {/* Workout list */}
      <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
        {isLoading && (
          <p className="font-display py-16 text-center text-sm tracking-wider text-[#64748b] uppercase">
            Loading...
          </p>
        )}

        {!isLoading && workouts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="font-display text-sm tracking-wider text-[#475569] uppercase">
              No workouts yet
            </p>
            <button
              onClick={() => router.push("/create")}
              className="font-display font-700 mt-6 cursor-pointer bg-orange-500 px-8 py-4 text-base tracking-wider text-white uppercase"
            >
              Create One
            </button>
          </div>
        )}

        {workouts.map((workout) => (
          <button
            key={workout.id}
            onClick={() => router.push(`/workout/${workout.slug}`)}
            className="flex w-full cursor-pointer items-center overflow-hidden border border-[#334155] bg-[#1e293b] text-left transition-colors hover:bg-[#253347]"
          >
            <div className="w-1 self-stretch bg-gradient-to-b from-orange-500 to-orange-600" />
            <div className="flex flex-1 items-center justify-between p-4">
              <h3 className="font-display font-700 text-sm tracking-wide text-[#f8fafc] uppercase">
                {workout.name}
              </h3>
              <span className="font-sans text-xs text-[#64748b]">
                {formatDate(workout.createdAt)}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Bottom */}
      <div className="border-t border-[#334155] px-5 pb-5">
        <button
          onClick={() => router.push("/create")}
          className="font-display font-700 w-full cursor-pointer bg-orange-500 py-4 text-base tracking-wider text-white uppercase"
        >
          Create New
        </button>
      </div>
    </div>
  );
}
