export function CardSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="h-40 bg-dark-hover rounded-lg mb-4" />
      <div className="h-4 bg-dark-hover rounded w-3/4 mb-2" />
      <div className="h-3 bg-dark-hover rounded w-1/2 mb-4" />
      <div className="h-8 bg-dark-hover rounded" />
    </div>
  );
}

export function StorySkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="flex gap-4">
        <div className="flex flex-col items-center gap-1">
          <div className="w-8 h-8 bg-dark-hover rounded" />
          <div className="w-4 h-4 bg-dark-hover rounded" />
          <div className="w-8 h-8 bg-dark-hover rounded" />
        </div>
        <div className="flex-1">
          <div className="h-4 bg-dark-hover rounded w-3/4 mb-2" />
          <div className="h-3 bg-dark-hover rounded w-full mb-1" />
          <div className="h-3 bg-dark-hover rounded w-2/3 mb-4" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-dark-hover rounded-full" />
            <div className="h-3 bg-dark-hover rounded w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="py-4 px-4">
          <div className="h-4 bg-dark-hover rounded w-3/4" />
        </td>
      ))}
    </tr>
  );
}

export function ChartSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="h-4 bg-dark-hover rounded w-32 mb-4" />
      <div className="h-64 bg-dark-hover rounded-lg" />
    </div>
  );
}
