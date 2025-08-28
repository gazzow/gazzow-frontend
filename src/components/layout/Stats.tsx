"use client";

import { Users, DollarSign, Clock } from "lucide-react";

const stats = [
  { icon: <Users size={28} />, label: "Active Developers", value: "500+" },
  { icon: <DollarSign size={28} />, label: "Total Paid Out", value: "$2M+" },
  { icon: <Clock size={28} />, label: "Avg. Response Time", value: "24h" },
];

export default function Stats() {
  return (
    <section className="relative bg-white dark:bg-primary py-12">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center px-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div className="text-purple-400 mb-2">{stat.icon}</div>
            <h3 className="text-2xl font-bold">{stat.value}</h3>
            <p className="text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
