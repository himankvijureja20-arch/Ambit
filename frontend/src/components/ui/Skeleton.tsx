interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-shimmer rounded-md bg-line/40 bg-[length:400px_100%] bg-gradient-to-r from-line/30 via-line/60 to-line/30 ${className}`}
    />
  );
}

export function CircleCardSkeleton() {
  return (
    <div className="rounded-card border border-line bg-surface shadow-card p-5 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-4 w-4/5" />
      <div className="flex gap-4">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}

export function RequestCardSkeleton() {
  return (
    <div className="rounded-card border border-line bg-surface shadow-card p-5 flex gap-4">
      <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/5" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/5" />
      </div>
    </div>
  );
}
