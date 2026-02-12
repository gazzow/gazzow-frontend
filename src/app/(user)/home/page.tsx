"use client";

import EmptyChart from "@/components/ui/EmptyChart";
import { useTheme } from "@/hook/useTheme";
import api from "@/lib/axios/api";
import axios from "axios";
import {
  ChartColumnBig,
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

  return (
    <div className="p-8 mt-16 bg-white dark:bg-primary min-h-screen transition-colors">
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
          <div className="h-52">
            {monthlyEarnings.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyEarnings}>
                  <XAxis
                    dataKey="name"
                    stroke="currentColor"
                    className="text-gray-500 dark:text-gray-400"
                  />
                  <YAxis
                    stroke="currentColor"
                    className="text-gray-500 dark:text-gray-400"
                  />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart
                message="No earnings recorded yet"
                icon={
                  <ChartColumnBig
                    size={38}
                    color={`${theme === "dark" ? "white" : "black"}`}
                  />
                }
              />
            )}
          </div>
        </div>

        {/* Task Overview */}
        <div className="bg-gray-100 dark:bg-secondary/20 p-5 rounded-xl transition-colors">
          <h3 className="mb-4 font-semibold text-black dark:text-white">
            Task Overview
          </h3>
          <div className="h-54">
            {workSplit.length > 0 ? (
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={workSplit}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={80}
                    label={({ name, value }) =>
                      `${name?.toUpperCase()}: ${value} `
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
                    color={`${theme === "dark" ? "white" : "black"}`}
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
