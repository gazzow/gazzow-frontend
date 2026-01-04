"use client";

import api from "@/lib/axios/api";
import { IDashboardStats } from "@/types/dashboard";
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

const revenueData = [
  { name: "Jan", value: 2400 },
  { name: "Feb", value: 3000 },
  { name: "Mar", value: 4200 },
  { name: "Apr", value: 3800 },
  { name: "May", value: 3200 },
  { name: "Jun", value: 4500 },
];

const plans = [
  { name: "Free", value: 3 },
  { name: "Premium", value: 2 },
  { name: "Diamond", value: 1 },
];

const COLORS = ["#8b5cf6", "#22c55e", "#ec4899"];

export default function Dashboard() {
  const [dashboardStats, setDashboardStats] = useState<IDashboardStats | null>(
    null
  );

  const fetchDashboardStats = useCallback(async () => {
    try {
      const res = await api.get("/admin/dashboard");
      console.log("response data", res.data);

      const response = res.data;
      if (response.success) {
        setDashboardStats(response.data);
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
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col gap-4  p-4 border border-border-primary rounded-lg mb-6">
        <div className="flex flex-col">
          <div className="flex justify-between">
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          </div>
          <p className="text-text-muted text-sm">
            {`Welcome back! Here's what's happening on your platform.`}
          </p>
        </div>
      </div>

      <div className="text-white rounded-xl space-y-6">
        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {dashboardStats && (
            <>
              {/* Total Users Stats */}
              <div className="bg-secondary/20 border border-border-primary p-5 rounded-xl">
                <p className="text-gray-400 text-sm">Total Users</p>
                <h2 className="text-2xl font-bold">
                  {dashboardStats.totalUsers}
                </h2>
              </div>

              {/* Total Active Projects */}
              <div className="bg-secondary/20 border border-border-primary p-5 rounded-xl">
                <p className="text-gray-400 text-sm">Active Projects</p>
                <h2 className="text-2xl font-bold">
                  {dashboardStats.activeProjects}
                </h2>
              </div>

              {/* Completed Tasks */}
              <div className="bg-secondary/20 border border-border-primary p-5 rounded-xl">
                <p className="text-gray-400 text-sm">Completed Tasks</p>
                <h2 className="text-2xl font-bold">
                  {dashboardStats.completedTasks}
                </h2>
              </div>

              {/* Revenue */}
              <div className="bg-secondary/20 border border-border-primary p-5 rounded-xl">
                <p className="text-gray-400 text-sm">Revenue</p>
                <h2 className="text-2xl font-bold">
                  {dashboardStats.totalRevenue}
                </h2>
              </div>
            </>
          )}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Monthly Revenue */}
          <div className="bg-secondary/20 p-5 rounded-xl">
            <h3 className="mb-4 font-semibold">Monthly Revenue</h3>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <XAxis dataKey="name" stroke="#aaa" />
                  <YAxis stroke="#aaa" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Subscription */}
          <div className="bg-secondary/20 p-5 rounded-xl">
            <h3 className="mb-4 font-semibold">Subscription Distribution</h3>
            <div className="h-52">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={plans}
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {plans.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-secondary/20 p-5 rounded-xl text-center">
          <div className="flex ">
            <h1>Quick Actions</h1>
          </div>

          <div className=" grid grid-cols-4">
            {["Users", "Projects", "Payments", "Subscriptions"].map((x) => (
              <button
                key={x}
                className="hover:bg-[#131a30] py-4 rounded-lg transition"
              >
                {x}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
