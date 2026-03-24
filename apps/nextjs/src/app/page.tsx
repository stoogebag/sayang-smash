"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center border border-[#334155] bg-[#0f172a] px-4 py-8 text-[#f8fafc]">
      <div className="flex w-full max-w-sm flex-1 flex-col items-center justify-center px-10 py-16">
        <div className="relative mb-2">
          <span className="font-display font-900 text-5xl leading-none tracking-tight text-[#f8fafc] uppercase">
            Sayang
          </span>
          <div className="absolute top-0 -right-2 h-full w-2 bg-orange-500"></div>
        </div>
        <span className="font-display font-900 -mt-1 text-5xl leading-none tracking-tight text-orange-500 uppercase">
          Smash
        </span>
        <p className="font-display mt-3 text-[11px] tracking-[0.3em] text-[#64748b] uppercase">
          Workout Logger
        </p>

        <div className="mt-14 w-full space-y-3">
          <button
            onClick={() => router.push("/create")}
            className="font-display font-700 w-full cursor-pointer bg-orange-500 py-4 text-base tracking-wider text-white uppercase"
          >
            Create Workout
          </button>
          <button
            onClick={() => router.push("/workouts")}
            className="font-display font-600 w-full cursor-pointer border-l-4 border-orange-500 bg-[#1e293b] py-4 text-base tracking-wider text-[#e2e8f0] uppercase"
          >
            Recent Workouts
          </button>
          <button
            onClick={() => router.push("/random")}
            className="font-display font-600 w-full cursor-pointer border-l-4 border-orange-500 bg-[#1e293b] py-4 text-base tracking-wider text-[#e2e8f0] uppercase"
          >
            Random Workout
          </button>
        </div>
      </div>
    </main>
  );
}
