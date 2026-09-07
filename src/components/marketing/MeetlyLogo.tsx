import { MeetlyIcon } from "@/components/marketing/MeetlyIcon";

export function MeetlyLogo({
  className = "",
  light = false,
  iconClassName,
}: {
  className?: string;
  light?: boolean;
  iconClassName?: string;
}) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <MeetlyIcon className={iconClassName ?? "h-9 w-9 shadow-sm"} />
      <span
        className={`text-[1.40625rem] font-bold tracking-tight ${light ? "text-white" : "text-foreground"}`}
      >
        Meetly
      </span>
    </div>
  );
}
