"use client";

import EmptyChart from "@/components/ui/EmptyChart";
import { useTheme } from "@/hook/useTheme";
import api from "@/lib/axios/api";
import axios from "axios";
import {
  ChartPie,
  ClipboardClock,
  FolderKanban,
  SquareCheckBig,
  Wallet,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#8b5cf6", "#22c55e", "#ec4899"];
const ALL_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

interface IMonthlyRevenue {
  month: number;
  year: number;
  revenue: number;
}
interface ITaskStatistics {
  name: string;
  value: number;
}

type UserDashboardStats = {
  projectsPosted: number;
  pendingJobs: number;
  completedJobs: number;
  totalEarnings: number;
};

export default function Dashboard() {
  const [stats, setStats] = useState<UserDashboardStats | null>(null);
  const { theme } = useTheme();
  const [monthlyEarnings, setMonthlyEarnings] = useState<
    { name: string; value: number }[]
  >([]);
  const [workSplit, setWorkSplit] = useState<{ name: string; value: number }[]>(
    [],
  );

  const fetchDashboardStats = useCallback(async () => {
    try {
      const res = await api.get("/dashboard");
      console.log("response data", res.data);

      const response = res.data;
      if (response.success) {
        const { monthlyEarnings, taskStatistics, ...restData } = response.data;

        // Set main stats
        setStats(restData);

        // 🟣 Map Monthly Revenue → Bar chart
        const mappedMonthly = monthlyEarnings.map((m: IMonthlyRevenue) => ({
          name: new Date(m.year, m.month - 1).toLocaleString("default", {
            month: "short",
          }), // Jan, Feb, Mar
          value: m.revenue,
        }));

        setMonthlyEarnings(mappedMonthly);

        // 🟣 Map Task Stats → Pie chart
        const mappedTasks = taskStatistics.map((t: ITaskStatistics) => ({
          name: t.name.toUpperCase(),
          value: t.value,
        }));

        setWorkSplit(mappedTasks);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
    }
  }, []);

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  const normalizedMonthlyEarnings = ALL_MONTHS.map((month) => {
    const found = monthlyEarnings.find((m) => m.name === month);
    return found || { name: month, value: 0 };
  });

  return (
    <div className="pt-20 px-6 w-full bg-white dark:bg-primary min-h-screen transition-colors">
      {/* Header */}
      <div className="flex flex-col gap-4 p-4 border border-border-primary rounded-lg mb-6 bg-white dark:bg-secondary/20 transition-colors">
        <h1 className="text-2xl font-bold text-black dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-text-muted text-sm">
          {`Welcome back! Here's your freelance performance overview.`}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {stats && (
          <>
            <Stat
              title="Total Earnings"
              value={stats.totalEarnings}
              icon={<Wallet />}
            />
            <Stat
              title="Projects Posted"
              value={stats.projectsPosted}
              icon={<FolderKanban />}
            />
            <Stat
              title="Pending Tasks"
              value={stats.pendingJobs}
              icon={<ClipboardClock />}
            />
            <Stat
              title="Completed Tasks"
              value={stats.completedJobs}
              icon={<SquareCheckBig />}
            />
          </>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Monthly Earnings */}
        <div className="bg-gray-100 dark:bg-secondary/20 p-5 rounded-xl transition-colors">
          <h3 className="mb-4 font-semibold text-black dark:text-white">
            Monthly Earnings
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={normalizedMonthlyEarnings}
                margin={{ top: 10, right: 10, left: -10, bottom: 5 }}
              >
                <XAxis
                  dataKey="name"
                  stroke="currentColor"
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  className="text-gray-500 dark:text-gray-400"
                />

                <YAxis
                  stroke="currentColor"
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  className="text-gray-500 dark:text-gray-400"
                />

                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
                    border: "none",
                    borderRadius: "8px",
                    color: theme === "dark" ? "#f9fafb" : "#111827",
                  }}
                  labelStyle={{
                    color: theme === "dark" ? "#e5e7eb" : "#374151",
                    fontSize: "12px",
                    fontWeight: 500,
                  }}
                  itemStyle={{
                    color: theme === "dark" ? "#c4b5fd" : "#7c3aed",
                    fontWeight: 600,
                  }}
                />

                <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={40}>
                  {normalizedMonthlyEarnings.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={entry.value === 0 ? "#e5e7eb33" : "#8b5cf6"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Overview */}
        <div className="bg-gray-100 dark:bg-secondary/20 p-4 rounded-xl transition-colors">
          <h3 className="mb-10 font-semibold text-black dark:text-white">
            Task Overview
          </h3>
          <div className="h-64 w-full">
            {workSplit.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={workSplit}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                    labelLine={false}
                    label={({ name, value }) =>
                      `${name?.toUpperCase()} ${(value * 100).toFixed(0)}%`
                    }
                  >
                    {workSplit.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart
                message="No tasks to visualize yet"
                icon={
                  <ChartPie
                    size={38}
                    color={theme === "dark" ? "white" : "black"}
                  />
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactElement;
}) {
  return (
    <div className="flex items-center justify-between bg-white dark:bg-secondary/20 border border-border-primary p-5 rounded-xl transition-colors">
      <div>
        <p className="text-gray-600 dark:text-gray-400 text-sm">{title}</p>
        <h2 className="text-2xl font-bold text-black dark:text-white">
          {value}
        </h2>
      </div>
      <div className="text-black dark:text-white">{icon}</div>
    </div>
  );
}
