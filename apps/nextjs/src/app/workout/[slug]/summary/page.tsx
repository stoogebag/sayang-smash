"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "~/trpc/react";

export default function SummaryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const trpc = useTRPC();

  const { data: workout } = useQuery(
    trpc.workout.getBySlug.queryOptions({ slug }),
  );

  if (!workout) {
    return (
      <div className="flex flex-1 items-center justify-center bg-[#0f172a]">
        <p className="font-display text-sm tracking-wider text-[#64748b] uppercase">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#0f172a]">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-[#334155] bg-[#172033] px-5 pt-5 pb-3">
        <div className="h-6 w-1 bg-emerald-500" />
        <h1 className="font-display font-800 text-xl tracking-wide text-[#f8fafc] uppercase">
          Done!
        </h1>
      </div>

      {/* Exercise list */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <div className="border border-[#334155] bg-[#1e293b]">
          {workout.exercises.map((ex, i) => (
            <div
              key={i}
              className={`p-4 ${i < workout.exercises.length - 1 ? "border-b border-[#334155]" : ""}`}
            >
              <h3 className="font-display font-700 text-sm text-[#f8fafc] uppercase">
                {ex.exercise_name}
              </h3>
              <p className="mt-1 text-[0.85rem] text-[#94a3b8]">
                {ex.exercise_type === "REPS"
                  ? `${ex.reps} REPS`
                  : `${ex.time} SEC`}
                {ex.weight ? `, ${ex.weight}kg` : ""}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="px-5 pb-5">
        <button
          onClick={() => router.push("/")}
          className="font-display font-700 w-full cursor-pointer border border-[#334155] bg-[#1e293b] py-4 text-base tracking-wider text-[#e2e8f0] uppercase"
        >
          New
        </button>
      </div>
    </div>
  );
}
