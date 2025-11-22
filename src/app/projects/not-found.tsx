"use client";

import { Home } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary relative overflow-hidden">
      {/* Neon Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(30, 58, 138, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(30, 58, 138, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Neon Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/30 rounded-full blur-[100px] animate-pulse" />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/30 rounded-full blur-[100px] animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        <h1 className="text-[8rem] md:text-[12rem] font-black text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)] leading-none mb-6">
          404
        </h1>

        <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4 tracking-wide">
          ERROR: PAGE NOT FOUND
        </h2>

        <p className="text-lg text-gray-400 mb-8 max-w-md mx-auto font-mono">
          {">"} The requested URL does not exist in our system.
        </p>

        <button
          onClick={() => router.push("/")}
          className="font-mono flex items-center gap-2 mx-auto px-3 py-1 cursor-pointer border border-blue-400 text-white rounded-md uppercase tracking-wider hover:bg-blue-500/20 transition shadow-[0_0_10px_rgba(59,130,246,0.3)]"
        >
          <Home size={18} />
          <span>Go Home</span>
        </button>
      </div>
    </div>
  );
}
