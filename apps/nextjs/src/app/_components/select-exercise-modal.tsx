"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useTRPC } from "~/trpc/react";

interface ExerciseParams {
  exercise_uid: string;
  exercise_name: string;
  exercise_type: "REPS" | "TIME";
  reps?: number;
  time?: number;
  weight?: number;
}

interface SelectExerciseModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (exercise: ExerciseParams) => void;
}

export function SelectExerciseModal({
  open,
  onClose,
  onAdd,
}: SelectExerciseModalProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<{
    uid: string;
    name: string;
    useWeight: boolean;
    type: "REPS" | "TIME";
  } | null>(null);

  // Params form state
  const [reps, setReps] = useState("");
  const [time, setTime] = useState("");
  const [weight, setWeight] = useState("");

  // Create exercise form state
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<"REPS" | "TIME">("REPS");
  const [newUseWeight, setNewUseWeight] = useState(false);

  const { data: exercises = [] } = useQuery(trpc.exercise.list.queryOptions());

  const createExercise = useMutation(
    trpc.exercise.create.mutationOptions({
      onSuccess: () => {
        void queryClient.invalidateQueries({
          queryKey: trpc.exercise.list.queryKey(),
        });
        setShowCreate(false);
        setNewName("");
        setNewType("REPS");
        setNewUseWeight(false);
      },
    }),
  );

  const filtered = exercises.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()),
  );

  function handleConfirmParams() {
    if (!selectedExercise) return;
    if (selectedExercise.type === "REPS" && !reps) return;
    if (selectedExercise.type === "TIME" && !time) return;
    const params: ExerciseParams = {
      exercise_uid: selectedExercise.uid,
      exercise_name: selectedExercise.name,
      exercise_type: selectedExercise.type,
    };
    if (selectedExercise.type === "REPS" && reps) {
      params.reps = parseInt(reps, 10);
    }
    if (selectedExercise.type === "TIME" && time) {
      params.time = parseInt(time, 10);
    }
    if (selectedExercise.useWeight && weight) {
      params.weight = parseFloat(weight);
    }
    onAdd(params);
    resetAndClose();
  }

  function resetAndClose() {
    setSelectedExercise(null);
    setSearch("");
    setReps("");
    setTime("");
    setWeight("");
    setShowCreate(false);
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60">
      <div className="flex max-h-[85vh] w-full max-w-[420px] flex-col border border-b-0 border-[#334155] bg-[#0f172a]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#334155] px-5 py-4">
          <h2 className="font-display font-800 text-base tracking-wide text-[#f8fafc] uppercase">
            {selectedExercise
              ? "Set Parameters"
              : showCreate
                ? "Create Exercise"
                : "Select Exercise"}
          </h2>
          <button
            onClick={resetAndClose}
            className="flex h-5 w-5 flex-shrink-0 cursor-pointer items-center justify-center text-[#64748b] hover:text-[#94a3b8]"
            aria-label="Close"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {selectedExercise ? (
            /* Parameter form */
            <div className="space-y-4">
              <p className="font-display font-700 text-sm tracking-wide text-[#f8fafc] uppercase">
                {selectedExercise.name}
              </p>

              {selectedExercise.type === "REPS" && (
                <div>
                  <label className="font-display mb-2 block text-[10px] tracking-[0.2em] text-[#64748b] uppercase">
                    Reps
                  </label>
                  <input
                    type="number"
                    value={reps}
                    onChange={(e) => setReps(e.target.value)}
                    placeholder="12"
                    className="w-full border border-[#334155] bg-[#1e293b] px-4 py-3 font-sans text-base text-[#f8fafc] focus:border-orange-500 focus:outline-none"
                  />
                </div>
              )}

              {selectedExercise.type === "TIME" && (
                <div>
                  <label className="font-display mb-2 block text-[10px] tracking-[0.2em] text-[#64748b] uppercase">
                    Duration (seconds)
                  </label>
                  <input
                    type="number"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="60"
                    className="w-full border border-[#334155] bg-[#1e293b] px-4 py-3 font-sans text-base text-[#f8fafc] focus:border-orange-500 focus:outline-none"
                  />
                </div>
              )}

              {selectedExercise.useWeight && (
                <div>
                  <label className="font-display mb-2 block text-[10px] tracking-[0.2em] text-[#64748b] uppercase">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="60"
                    className="w-full border border-[#334155] bg-[#1e293b] px-4 py-3 font-sans text-base text-[#f8fafc] focus:border-orange-500 focus:outline-none"
                  />
                </div>
              )}

              <button
                onClick={handleConfirmParams}
                className="font-display font-700 mt-4 w-full cursor-pointer bg-orange-500 py-4 text-base tracking-wider text-white uppercase"
              >
                Add to Workout
              </button>
            </div>
          ) : showCreate ? (
            /* Create exercise form */
            <div className="space-y-4">
              <div>
                <label className="font-display mb-2 block text-[10px] tracking-[0.2em] text-[#64748b] uppercase">
                  Exercise Name
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Bench Press"
                  className="w-full border border-[#334155] bg-[#1e293b] px-4 py-3 font-sans text-base text-[#f8fafc] focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-display mb-2 block text-[10px] tracking-[0.2em] text-[#64748b] uppercase">
                  Type
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setNewType("REPS")}
                    className={`font-display font-700 flex-1 cursor-pointer border py-3 text-sm tracking-wider uppercase ${
                      newType === "REPS"
                        ? "border-orange-500 bg-orange-500 text-white"
                        : "border-[#334155] bg-[#1e293b] text-[#94a3b8]"
                    }`}
                  >
                    Reps
                  </button>
                  <button
                    onClick={() => setNewType("TIME")}
                    className={`font-display font-700 flex-1 cursor-pointer border py-3 text-sm tracking-wider uppercase ${
                      newType === "TIME"
                        ? "border-orange-500 bg-orange-500 text-white"
                        : "border-[#334155] bg-[#1e293b] text-[#94a3b8]"
                    }`}
                  >
                    Time
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setNewUseWeight(!newUseWeight)}
                  className={`flex h-6 w-6 cursor-pointer items-center justify-center border-2 ${
                    newUseWeight
                      ? "border-orange-500 bg-orange-500"
                      : "border-[#334155] bg-[#1e293b]"
                  }`}
                >
                  {newUseWeight && (
                    <svg
                      className="h-4 w-4 text-white"
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
                <label className="font-display text-[10px] tracking-[0.2em] text-[#94a3b8] uppercase">
                  Uses Weight
                </label>
              </div>

              <button
                onClick={() => {
                  if (!newName.trim()) return;
                  createExercise.mutate({
                    name: newName.trim(),
                    type: newType,
                    useWeight: newUseWeight,
                  });
                }}
                disabled={createExercise.isPending || !newName.trim()}
                className="font-display font-700 w-full cursor-pointer bg-emerald-500 py-4 text-base tracking-wider text-white uppercase disabled:opacity-50"
              >
                {createExercise.isPending ? "Creating..." : "Create Exercise"}
              </button>
            </div>
          ) : (
            /* Exercise list */
            <>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search exercises..."
                className="mb-4 w-full border border-[#334155] bg-[#1e293b] px-4 py-3 font-sans text-base text-[#f8fafc] focus:border-orange-500 focus:outline-none"
              />

              <div className="space-y-2">
                {filtered.map((exercise) => (
                  <button
                    key={exercise.uid}
                    onClick={() =>
                      setSelectedExercise({
                        uid: exercise.uid,
                        name: exercise.name,
                        useWeight: exercise.useWeight,
                        type: exercise.type as "REPS" | "TIME",
                      })
                    }
                    className="flex w-full cursor-pointer items-center overflow-hidden border border-[#334155] bg-[#1e293b] text-left"
                  >
                    <div className="w-1 self-stretch bg-gradient-to-b from-orange-500 to-orange-600" />
                    <div className="flex-1 p-4">
                      <h3 className="font-display font-700 text-sm tracking-wide text-[#f8fafc] uppercase">
                        {exercise.name}
                      </h3>
                      <p className="mt-0.5 font-sans text-xs text-[#94a3b8]">
                        {exercise.type} {exercise.useWeight ? "· weight" : ""}
                      </p>
                    </div>
                  </button>
                ))}

                {filtered.length === 0 && (
                  <p className="py-8 text-center font-sans text-sm text-[#64748b]">
                    {exercises.length === 0 ? "No exercises yet" : "No matches"}
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer - create exercise button (only in list view) */}
        {!selectedExercise && !showCreate && (
          <div className="border-t border-[#334155] px-5 pb-5">
            <button
              onClick={() => setShowCreate(true)}
              className="font-display font-600 mt-3 w-full cursor-pointer border border-dashed border-[#475569] bg-[#1e293b] py-3 text-sm tracking-wider text-[#94a3b8] uppercase"
            >
              + Create New Exercise
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
