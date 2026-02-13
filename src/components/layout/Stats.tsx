"use client";

import { Users, DollarSign, Clock } from "lucide-react";

const stats = [
  { icon: <Users size={28} />, label: "Active Developers", value: "500+" },
  { icon: <DollarSign size={28} />, label: "Total Paid Out", value: "$2M+" },
  { icon: <Clock size={28} />, label: "Avg. Response Time", value: "24h" },
];

export default function Stats() {
  return (
    <section
      className="relative py-16 bg-gradient-to-b 
  from-white via-purple-50/40 to-white 
  dark:from-primary dark:via-[#140f2a] dark:to-primary"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="group relative rounded-2xl border 
          border-purple-100 dark:border-white/10
          bg-white/60 dark:bg-white/5
          backdrop-blur-lg
          p-8
          transition-all duration-300
          hover:scale-[1.03]
          hover:shadow-[0_0_40px_rgba(168,85,247,0.15)]
        "
            >
              {/* Glow layer */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 
            group-hover:opacity-100 
            transition duration-300 
            bg-gradient-to-br 
            from-purple-500/10 via-transparent to-indigo-500/10"
              ></div>

              {/* Content */}
              <div className="relative flex flex-col items-center text-center space-y-3">
                <div
                  className="text-purple-500 dark:text-purple-400 
              text-3xl 
              p-3 
              rounded-xl 
              bg-purple-100 dark:bg-purple-500/10
              shadow-sm
              group-hover:shadow-purple-500/20
              transition"
                >
                  {stat.icon}
                </div>

                <h3
                  className="text-3xl font-semibold tracking-tight 
              text-gray-900 dark:text-white"
                >
                  {stat.value}
                </h3>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
