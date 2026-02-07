"use client";

type EmptyChartProps = {
  message: string;
  icon: React.ReactElement;
};

const EmptyChart = ({ message, icon }: EmptyChartProps) => (
  <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
    {icon}
    <p className="text-sm mt-4 text-black dark:text-white">{message}</p>
  </div>
);
export default EmptyChart;
