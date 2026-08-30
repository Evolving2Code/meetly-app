export function MeetlyLogo({
  className = "",
  light = false,
}: {
  className?: string;
  light?: boolean;
}) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-sm">
        <span className="text-sm font-black text-white">M</span>
      </div>
      <span className={`text-lg font-bold tracking-tight ${light ? "text-white" : "text-navy"}`}>
        Meetly
      </span>
    </div>
  );
}
