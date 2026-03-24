"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import { useTRPC } from "~/trpc/react";
import { SelectExerciseModal } from "../_components/select-exercise-modal";

interface WorkoutExercise {
  exercise_uid: string;
  exercise_name: string;
  exercise_type: "REPS" | "TIME";
  reps?: number;
  time?: number;
  weight?: number;
}

function getDefaultName() {
  const now = new Date();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const day = days[now.getDay()]!;
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yy = String(now.getFullYear()).slice(-2);
  return `${day} ${dd}/${mm}/${yy}`;
}

export default function CreateWorkoutPage() {
  const router = useRouter();
  const trpc = useTRPC();
  const [name, setName] = useState(getDefaultName());
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const saveWorkout = useMutation(
    trpc.workout.create.mutationOptions({
      onSuccess: (data) => {
        router.push(`/workout/saved/${data.slug}`);
      },
    }),
  );

  function removeExercise(index: number) {
    setExercises((prev) => prev.filter((_, i) => i !== index));
  }

  function formatParams(ex: WorkoutExercise) {
    const parts: string[] = [];
    if (ex.exercise_type === "REPS" && ex.reps) parts.push(`${ex.reps} reps`);
    if (ex.exercise_type === "TIME" && ex.time)
      parts.push(`${ex.time} seconds`);
    if (ex.weight) parts.push(`${ex.weight} kg`);
    return parts.join(" · ");
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#0f172a]">
      {/* Workout name header */}
      <div className="border-b border-[#334155] bg-[#172033] px-5 pt-5 pb-3">
        <label className="font-display text-[10px] tracking-[0.2em] text-[#64748b] uppercase">
          Workout Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="font-display font-800 mt-1 block w-full border-b-2 border-[#334155] bg-transparent pb-2 text-xl tracking-wide text-[#f8fafc] uppercase focus:border-orange-500 focus:outline-none"
        />
      </div>

      {/* Exercise list */}
      <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
        {exercises.map((ex, i) => (
          <div
            key={i}
            className="flex overflow-hidden border border-[#334155] bg-[#1e293b]"
          >
            <div className="w-1 self-stretch bg-gradient-to-b from-orange-500 to-orange-600" />
            <div className="flex flex-1 items-center justify-between p-4">
              <div>
                <h3 className="font-display font-700 text-sm tracking-wide text-[#f8fafc] uppercase">
                  {ex.exercise_name}
                </h3>
                <p className="mt-0.5 font-sans text-xs text-[#94a3b8]">
                  {formatParams(ex)}
                </p>
              </div>
              <button
                onClick={() => removeExercise(i)}
                className="cursor-pointer"
              >
                <svg
                  className="h-4 w-4 text-[#475569]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}

        {exercises.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="font-display text-sm tracking-wider text-[#475569] uppercase">
              No exercises added yet
            </p>
          </div>
        )}
      </div>

      {/* Bottom buttons */}
      <div className="space-y-3 border-t border-[#334155] px-5 pb-5">
        <button
          onClick={() => setModalOpen(true)}
          className="font-display font-600 w-full cursor-pointer border border-dashed border-[#475569] bg-[#1e293b] py-3 text-sm tracking-wider text-[#94a3b8] uppercase"
        >
          + Add Exercise
        </button>
        <button
          onClick={() => {
            if (exercises.length === 0) return;
            saveWorkout.mutate({ name, exercises });
          }}
          disabled={exercises.length === 0 || saveWorkout.isPending}
          className="font-display font-700 w-full cursor-pointer bg-emerald-500 py-4 text-base tracking-wider text-white uppercase disabled:opacity-50"
        >
          {saveWorkout.isPending ? "Saving..." : "Save Workout"}
        </button>
      </div>

      <SelectExerciseModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={(exercise) => {
          setExercises((prev) => [...prev, exercise]);
        }}
      />
    </div>
  );
}
