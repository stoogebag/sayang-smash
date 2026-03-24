"use client";

import { use, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "~/trpc/react";

interface ExerciseProgress {
  exercise_uid: string;
  exercise_name: string;
  exercise_type: "REPS" | "TIME";
  reps?: number;
  time?: number;
  weight?: number;
  // local state
  currentReps: number;
  timeRemaining: number;
  completed: boolean;
  timerRunning: boolean;
}

export default function DoWorkoutPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const trpc = useTRPC();
  const [showCompleted, setShowCompleted] = useState(false);
  const [progress, setProgress] = useState<ExerciseProgress[]>([]);

  const { data: workout } = useQuery(
    trpc.workout.getBySlug.queryOptions({ slug }),
  );

  // Initialize progress from workout data
  useEffect(() => {
    if (workout?.exercises && progress.length === 0) {
      setProgress(
        workout.exercises.map((ex) => ({
          ...ex,
          currentReps: 0,
          timeRemaining: ex.time ?? 0,
          completed: false,
          timerRunning: false,
        })),
      );
    }
  }, [workout, progress.length]);

  // Timer tick
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) =>
        prev.map((ex) => {
          if (!ex.timerRunning || ex.completed) return ex;
          const newTime = ex.timeRemaining - 1;
          if (newTime <= 0) {
            return {
              ...ex,
              timeRemaining: 0,
              completed: true,
              timerRunning: false,
            };
          }
          return { ...ex, timeRemaining: newTime };
        }),
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const updateExercise = useCallback(
    (index: number, updater: (ex: ExerciseProgress) => ExerciseProgress) => {
      setProgress((prev) =>
        prev.map((ex, i) => (i === index ? updater(ex) : ex)),
      );
    },
    [],
  );

  function addReps(index: number, amount: number) {
    updateExercise(index, (ex) => {
      const newReps = Math.max(0, ex.currentReps + amount);
      const target = ex.reps ?? 0;
      const completed = target > 0 && newReps >= target;
      return { ...ex, currentReps: newReps, completed };
    });
  }

  function toggleTimer(index: number) {
    updateExercise(index, (ex) => ({
      ...ex,
      timerRunning: !ex.timerRunning,
    }));
  }

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }

  const remaining = progress.filter((e) => !e.completed).length;
  const visible = showCompleted
    ? progress
    : progress.filter((e) => !e.completed);

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
      <div className="border-b border-[#334155] bg-[#172033] px-5 pt-5 pb-3">
        <h1 className="font-display font-800 text-xl tracking-wide text-[#f8fafc] uppercase">
          {workout.name}
        </h1>
        <div className="mt-1 flex items-center justify-between">
          <p className="font-sans text-xs text-[#94a3b8]">
            {remaining} remaining
          </p>
          <label className="flex cursor-pointer items-center gap-2">
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              className={`flex h-4 w-4 items-center justify-center border-2 ${
                showCompleted
                  ? "border-orange-500 bg-orange-500"
                  : "border-[#475569] bg-[#1e293b]"
              }`}
            >
              {showCompleted && (
                <svg
                  className="h-3 w-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>
            <span className="font-display text-[9px] tracking-wider text-[#64748b] uppercase">
              Show finished
            </span>
          </label>
        </div>
      </div>

      {/* Exercise list */}
      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
        {visible.map((ex, i) => {
          const realIndex = progress.indexOf(ex);
          return (
            <div
              key={i}
              className={`border border-[#334155] bg-[#1e293b] ${ex.completed ? "opacity-40" : ""}`}
            >
              {ex.exercise_type === "REPS" ? (
                /* Reps exercise */
                <>
                  <div className="flex items-center justify-between p-4">
                    <div>
                      <h3 className="font-display font-700 text-sm tracking-wide text-[#f8fafc] uppercase">
                        {ex.exercise_name}
                      </h3>
                      {ex.weight && (
                        <p className="font-sans text-[10px] text-[#64748b]">
                          {ex.weight} kg
                        </p>
                      )}
                    </div>
                    <div>
                      <span className="font-display font-900 text-3xl text-orange-400">
                        {ex.currentReps}
                      </span>
                      <span className="font-display text-sm text-[#64748b]">
                        {" "}
                        / {ex.reps}
                      </span>
                    </div>
                  </div>
                  {!ex.completed && (
                    <div className="flex border-t border-[#334155]">
                      <button
                        onClick={() => addReps(realIndex, 10)}
                        className="font-display font-700 flex-1 cursor-pointer border-r border-[#334155] py-3 text-sm text-[#e2e8f0] transition-colors hover:bg-[#334155]"
                      >
                        +10
                      </button>
                      <button
                        onClick={() => addReps(realIndex, 5)}
                        className="font-display font-700 flex-1 cursor-pointer border-r border-[#334155] py-3 text-sm text-[#e2e8f0] transition-colors hover:bg-[#334155]"
                      >
                        +5
                      </button>
                      <button
                        onClick={() => addReps(realIndex, -1)}
                        className="font-display font-700 flex-1 cursor-pointer py-3 text-sm text-red-400 transition-colors hover:bg-[#334155]"
                      >
                        -1
                      </button>
                    </div>
                  )}
                </>
              ) : (
                /* Timer exercise */
                <>
                  <div className="flex items-center justify-between p-4">
                    <h3 className="font-display font-700 text-sm tracking-wide text-[#f8fafc] uppercase">
                      {ex.exercise_name}
                    </h3>
                    <span className="font-display font-900 text-3xl text-[#f8fafc] tabular-nums">
                      {formatTime(ex.timeRemaining)}
                    </span>
                  </div>
                  {!ex.completed && (
                    <button
                      onClick={() => toggleTimer(realIndex)}
                      className={`font-display font-700 w-full cursor-pointer border-t border-[#334155] py-3 text-sm tracking-wider uppercase ${
                        ex.timerRunning
                          ? "bg-red-500 text-white"
                          : "bg-emerald-500 text-white"
                      }`}
                    >
                      {ex.timerRunning ? "Pause" : "Start"}
                    </button>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom */}
      <div className="border-t border-[#334155] px-5 pb-5">
        <button
          onClick={() => router.push(`/workout/${slug}/summary`)}
          className="font-display font-800 w-full cursor-pointer bg-emerald-500 py-4 text-base tracking-wider text-white uppercase"
        >
          Me Done
        </button>
      </div>
    </div>
  );
}
