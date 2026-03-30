import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-shimmer rounded-[20px] bg-[linear-gradient(110deg,#f8fafc,45%,#eef2ff,55%,#f8fafc)] bg-[length:200%_100%]",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
