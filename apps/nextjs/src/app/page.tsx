"use client";

import { useRouter } from "next/navigation";

import { Footer } from "./_components/footer";

export default function HomePage() {
  const router = useRouter();

  return (
    <>
      <main className="bg-page text-text container flex min-h-[calc(100vh-100px)] flex-col items-center justify-center py-16">
        <h1 className="mb-8 text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          <span className="text-accent">Sayang Smash</span>
        </h1>
        <p className="text-muted mb-12 max-w-md text-center text-xl">
          Create and log your workouts. Share with friends.
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => router.push("/create")}
            className="bg-accent rounded px-6 py-3 font-bold text-white hover:bg-orange-500"
          >
            Create Workout
          </button>
          <button
            onClick={() => router.push("/random")}
            className="rounded bg-green-500 px-6 py-3 font-bold text-white hover:bg-green-600"
          >
            Do Random Workout
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
}
