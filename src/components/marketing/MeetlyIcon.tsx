export function MeetlyIcon({
  className = "h-9 w-9",
  title = "Meetly",
}: {
  className?: string;
  title?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.png"
      alt={title}
      className={`shrink-0 ${className}`}
    />
  );
}
