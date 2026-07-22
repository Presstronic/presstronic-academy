import type { ButtonHTMLAttributes } from "react";
import { cn } from "../utils";

export type ButtonVariant = "primary" | "secondary" | "ghost";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantClassNames: Record<ButtonVariant, string> = {
  primary:
    "border-cyan-300 bg-cyan-300 text-graphite-950 hover:border-cyan-200 hover:bg-cyan-200",
  secondary:
    "border-graphite-600 bg-graphite-850 text-cyan-100 hover:border-cyan-400 hover:text-cyan-50",
  ghost:
    "border-transparent bg-transparent text-graphite-200 hover:border-graphite-600 hover:text-cyan-100",
};

export function Button({
  className,
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex min-h-10 items-center justify-center border px-4 py-2 font-mono text-xs font-semibold uppercase tracking-[0.16em] transition-colors duration-200 ease-academy",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 disabled:cursor-not-allowed disabled:opacity-50",
        variantClassNames[variant],
        className,
      )}
      type={type}
      {...props}
    />
  );
}
