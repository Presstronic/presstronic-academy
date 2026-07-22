import { cn } from "../utils";

export type StatusBadgeTone = "signal" | "caution" | "success" | "danger";

interface StatusBadgeProps {
  children: string;
  tone?: StatusBadgeTone;
}

const toneClassNames: Record<StatusBadgeTone, string> = {
  signal: "border-cyan-400/70 bg-cyan-400/10 text-cyan-100",
  caution: "border-volt-300/70 bg-volt-300/10 text-volt-100",
  success: "border-green-400/70 bg-green-400/10 text-green-100",
  danger: "border-red-400/70 bg-red-400/10 text-red-100",
};

export function StatusBadge({ children, tone = "signal" }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex border px-2 py-1 font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.16em]",
        toneClassNames[tone],
      )}
    >
      {children}
    </span>
  );
}
