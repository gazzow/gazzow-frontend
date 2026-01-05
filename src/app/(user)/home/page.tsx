"use client";

import api from "@/lib/axios/api";
import axios from "axios";
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

type UserDashboardStats = {
  projectsPosted: number;
  pendingJobs: number;
  completedJobs: number;
  totalEarnings: number;
};

export default function Dashboard() {
  const [stats, setStats] = useState<UserDashboardStats | null>(null);
  const [monthlyEarnings, setMonthlyEarnings] = useState<
    { name: string; value: number }[]
  >([]);
  const [workSplit, setWorkSplit] = useState<{ name: string; value: number }[]>(
    []
  );

  const fetchDashboardStats = useCallback(async () => {
    try {
      const res = await api.get("/dashboard");
      console.log("response data", res.data);

      const response = res.data;
      if (response.success) {
        setStats(response.data);
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

  useEffect(() => {
    setStats({
      projectsPosted: 12,
      pendingJobs: 6,
      completedJobs: 34,
      totalEarnings: 2340,
    });

    // Mock Monthly Earnings
    setMonthlyEarnings([
      { name: "Jan", value: 400 },
      { name: "Feb", value: 650 },
      { name: "Mar", value: 300 },
      { name: "Apr", value: 900 },
      { name: "May", value: 1200 },
      { name: "Jun", value: 780 },
    ]);

    // Mock Project Status DistributionF
    setWorkSplit([
      { name: "Active", value: 6 },
      { name: "In Review", value: 3 },
      { name: "Completed", value: 12 },
    ]);
  }, []);

  return (
    <div className="p-8 mt-16">
      {/* Header */}
      <div className="flex flex-col gap-4 p-4 border border-border-primary rounded-lg mb-6">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-text-muted text-sm">
          {`  Welcome back! Here's your freelance performance overview.`}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {stats && (
          <>
            <Stat title="Projects Posted" value={stats.projectsPosted} />
            <Stat title="Current Jobs" value={stats.pendingJobs} />
            <Stat title="Completed Jobs" value={stats.completedJobs} />
            <Stat title="Total Earnings" value={stats.totalEarnings} />
          </>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Monthly Earnings */}
        <div className="bg-secondary/20 p-5 rounded-xl">
          <h3 className="mb-4 font-semibold text-white">Monthly Earnings</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyEarnings}>
                <XAxis dataKey="name" stroke="#aaa" />
                <YAxis stroke="#aaa" />
                <Tooltip />
                <Bar dataKey="value" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Work Category */}
        <div className="bg-secondary/20 p-5 rounded-xl">
          <h3 className="mb-4 font-semibold text-white">
          Overall Jobs Overview
          </h3>
          <div className="h-54">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={workSplit}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={80}
                  label={({ name }) => `${name?.toUpperCase()}`}
                >
                  {workSplit.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-secondary/20 border border-border-primary p-5 rounded-xl">
      <p className="text-gray-400 text-sm">{title}</p>
      <h2 className="text-2xl font-bold text-white">{value}</h2>
    </div>
  );
}
