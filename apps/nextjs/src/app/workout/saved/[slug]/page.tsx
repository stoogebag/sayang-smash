"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { QRCodeSVG } from "qrcode.react";

import { APP_DOMAIN } from "~/config";
import { useTRPC } from "~/trpc/react";

export default function WorkoutSavedPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const trpc = useTRPC();
  const [copied, setCopied] = useState(false);

  const { data: workout } = useQuery(
    trpc.workout.getBySlug.queryOptions({ slug }),
  );

  const workoutUrl = `${APP_DOMAIN}/workout/${slug}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(workoutUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  }

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: workout?.name ?? "Sayang Smash Workout",
          url: workoutUrl,
        });
      } catch {
        // user cancelled
      }
    } else {
      await handleCopy();
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#0f172a]">
      {/* Header */}
      <div className="border-b border-[#334155] bg-[#172033] px-5 pt-5 pb-3">
        <h1 className="font-display font-800 text-xl tracking-wide text-[#f8fafc] uppercase">
          Live!
        </h1>
        <p className="mt-1 font-sans text-xs text-[#94a3b8]">Share now</p>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col items-center justify-center px-5 py-6">
        {/* Link box - click to copy */}
        <button
          onClick={handleCopy}
          className="mb-6 w-full max-w-[280px] cursor-pointer border-2 border-orange-500 bg-[#1e293b] p-4 text-left transition-colors hover:bg-[#253347]"
        >
          <p className="mb-2 text-[10px] text-[#64748b] uppercase">
            {copied ? "Copied!" : "Tap to copy link"}
          </p>
          <p className="font-mono text-sm font-bold break-all text-orange-500">
            {workoutUrl}
          </p>
        </button>

        {/* QR Code */}
        <div className="border-2 border-[#334155] bg-[#1e293b] p-4">
          <QRCodeSVG
            value={workoutUrl}
            size={120}
            bgColor="#1e293b"
            fgColor="#f8fafc"
            level="M"
          />
        </div>
      </div>

      {/* Bottom buttons */}
      <div className="space-y-3 border-t border-[#334155] px-5 pb-5">
        <button
          onClick={handleShare}
          className="font-display font-600 w-full cursor-pointer border border-[#334155] bg-[#1e293b] py-3 text-sm tracking-wider text-[#e2e8f0] uppercase"
        >
          Share
        </button>
        <button
          onClick={() => router.push(`/workout/${slug}`)}
          className="font-display font-700 w-full cursor-pointer bg-orange-500 py-4 text-base tracking-wider text-white uppercase"
        >
          Start Workout
        </button>
      </div>
    </div>
  );
}
