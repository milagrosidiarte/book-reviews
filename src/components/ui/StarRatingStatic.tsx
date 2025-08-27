export function StarRatingStatic({
  value = 0,
  size = 22,
}: { value?: number; size?: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map((n) => (
        <svg
          key={n}
          viewBox="0 0 24 24"
          width={size}
          height={size}
          className={n <= value ? "fill-yellow-400" : "fill-muted stroke-muted-foreground"}
        >
          <path d="M12 .6 15.7 8l8.2 1.2-5.9 5.8 1.4 8.2L12 18.9 4.7 23.2l1.4-8.2L.1 9.2 8.3 8 12 .6z" />
        </svg>
      ))}
    </div>
  );
}
