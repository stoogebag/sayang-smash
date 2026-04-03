"use client";

export function Spinner({
  size = "sm",
  label,
}: {
  size?: "sm" | "md" | "lg";
  label?: string;
}) {
  const sizeMap = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className={`${sizeMap[size]} animate-spin rounded-full border-2 border-solid border-transparent border-t-orange-500`}
      />
      {label && (
        <span className="font-display text-xs text-[#94a3b8] uppercase">
          {label}
        </span>
      )}
    </div>
  );
}
