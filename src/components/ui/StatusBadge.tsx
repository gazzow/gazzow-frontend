export function StatusBadge({ color, text }: { color: string; text: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full bg-${color}-500`} />
      <span
        className={`text-xs font-medium text-${color}-700 dark:text-${color}-300 bg-${color}-500/10 px-2 py-1 rounded-full`}
      >
        {text}
      </span>
    </div>
  );
}
