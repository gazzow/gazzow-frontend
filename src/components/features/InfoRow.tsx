interface InfoRowProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}

export function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="font-medium">{label}</h2>
      </div>
      <span className="text-gray-600 dark:text-gray-400">{value}</span>
    </div>
  );
}
