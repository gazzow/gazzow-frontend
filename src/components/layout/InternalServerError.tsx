"use client";

import { USER_ROUTES } from "@/constants/routes/user-routes";
import { Home, RotateCcw } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function InternalServerError() {
  const router = useRouter();

  const handleGoHome = () => {
    router.replace(USER_ROUTES.HOME);
  };
  const handleRefresh = () => {
    router.back();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary px-4">
      <div className="max-w-4xl w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Robot Illustration */}
          <div className="order-2 md:order-1 animate-fade-in">
            <Image
              src={"/images/robot.png"}
              alt="Confused Robot Illustration"
              width={350}
              height={350}
              className="mx-auto drop-shadow-2xl animate-float"
              priority
            />
          </div>

          {/* Right: Content */}
          <div
            className="order-1 md:order-2 text-center md:text-left animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="inline-block px-4 py-2 bg-red-600/20 text-red-500 rounded-full text-sm font-semibold mb-4">
              ERROR 500
            </div>

            <h1 className="text-5xl md:text-6xl font-black text-white mb-4 leading-tight">
              Internal Server Error
            </h1>

            <p className="text-lg text-gray-400 mb-8 leading-relaxed">
              Something went wrong on our end. We’re working to fix it.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                className="px-3 py-1 bg-btn-primary hover:bg-btn-primary-hover transition rounded cursor-pointer text-white font-semibold shadow-xl flex items-center justify-center gap-2"
              >
                <RotateCcw size={18} />
                <span>Try Again</span>
              </button>

              {/* Home Button */}
              <button
                onClick={handleGoHome}
                className="px-3 py-1 border border-gray-500 hover:bg-gray-700 transition rounded cursor-pointer text-gray-300 font-semibold flex items-center justify-center gap-2"
              >
                <Home size={18} />
                <span>Go Home</span>
              </button>
            </div>

            <p className="text-sm text-gray-500 mt-6">
              If the problem continues, please contact support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
