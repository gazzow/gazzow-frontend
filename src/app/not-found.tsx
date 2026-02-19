"use client";

import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { NavigationProvider } from "@/providers/NavigationProvider";

export default function NotFound() {
  return (
    <div className="flex h-screen overflow-hidden">
      <NavigationProvider>
        <Navbar />
        <div className="flex flex-1 overflow-hidden h-full">
          <Sidebar />
          <main className="flex-1 w-full overflow-y-auto custom-scroll text-black dark:text-white transition-colors">
            <div
              className="min-h-[90vh] w-full pt-20 px-6 flex justify-center
                transition-colors"
            >
              <div className="w-full items-center justify-center flex dark:bg-primary relative overflow-hidden transition ease-in-out">
                {/* Neon Grid Background */}
                <div className="absolute inset-0 opacity-10 dark:opacity-20">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `
          linear-gradient(rgba(30, 58, 138, 0.25) 1px, transparent 1px),
          linear-gradient(90deg, rgba(30, 58, 138, 0.25) 1px, transparent 1px)
        `,
                      backgroundSize: "50px 50px",
                    }}
                  />
                </div>

                {/* Neon Glow Effects */}
                <div className="absolute top-1/4 left-1/4 w-52 sm:w-64 h-52 sm:h-64 bg-blue-500/20 dark:bg-blue-500/30 rounded-full blur-[100px] animate-pulse" />

                <div
                  className="absolute bottom-1/4 right-1/4 w-64 sm:w-80 h-64 sm:h-80 bg-purple-500/20 dark:bg-purple-500/30 rounded-full blur-[100px] animate-pulse"
                  style={{ animationDelay: "1s" }}
                />

                {/* Content */}
                <div className="relative z-10 text-center px-4">
                  <h1
                    className="text-[5rem] sm:text-[7rem] md:text-[10rem] font-black 
      text-blue-600 dark:text-blue-400
      drop-shadow-[0_0_6px_rgba(59,130,246,0.6)] 
      dark:drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]
      leading-none mb-6"
                  >
                    404
                  </h1>

                  <h2
                    className="text-xl sm:text-2xl md:text-4xl font-semibold 
      text-gray-800 dark:text-white 
      mb-4 tracking-wide"
                  >
                    ERROR: PAGE NOT FOUND
                  </h2>

                  <p
                    className="text-sm sm:text-base md:text-lg 
      text-gray-600 dark:text-gray-400 
      mb-8 max-w-md mx-auto font-mono"
                  >
                    {">"} The requested URL does not exist in our system.
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </NavigationProvider>
    </div>
  );
}
