import { ReactNode } from "react";

const variants = {
  error: "alert-error",
  success: "alert-success",
  info: "alert-info",
} as const;

export function Alert({
  variant = "error",
  children,
  className = "",
}: {
  variant?: keyof typeof variants;
  children: ReactNode;
  className?: string;
}) {
  return <div className={`${variants[variant]} ${className}`.trim()}>{children}</div>;
}
