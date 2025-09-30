"use client";

import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center text-center px-6 py-16">
      {/* Background image */}
      <div className="bg-purple-600">
        <Image
          src="/images/main-bg.png"
          alt="Main background"
          fill
          className="object-cover opacity-85"
          priority
        />
      </div>

      {/* White overlay with lower opacity */}
      <div className="absolute inset-0 bg-purple-500/30"></div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto">
        <h1 className="flex flex-col text-4xl text-text-primary md:text-7xl font-extrabold">
          Build And Grow <span className="text-slate-300">Together</span>
        </h1>
        <p className="mt-6 text-lg text-text-primary">
          Join the ultimate developer collaboration platform. Post projects,
          find skilled contributors, and get paid for your expertise. Build
          amazing things together.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link href="#">
            <button className="px-6 py-3 text-lg bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition">
              Start Building
            </button>
          </Link>
          <Link href="#">
            <button className="px-6 py-3 text-lg bg-gray-900 text-white rounded-lg shadow-md hover:bg-gray-950 transition">
              View Projects
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
