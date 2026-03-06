"use client";

import { ArrowRight } from "lucide-react";

export default function Community() {
  const INSTAGRAM_LINK =
    "https://www.instagram.com/teamgazzow?igsh=cGYyb2RobzB2a2tn";

  const avatars = [
    "https://i.pravatar.cc/40?img=1",
    "https://i.pravatar.cc/40?img=2",
    "https://i.pravatar.cc/40?img=3",
    "https://i.pravatar.cc/40?img=4",
    "https://i.pravatar.cc/40?img=5",
  ];

  return (
    <section
      id="Community"
      className="py-24 px-6 bg-white dark:bg-primary transition-colors"
    >
      <div className="max-w-4xl mx-auto text-center">

        {/* Avatar Stack */}
        <div className="flex justify-center items-center mb-6">
          <div className="flex -space-x-3">
            {avatars.map((avatar, i) => (
              <img
                key={i}
                src={avatar}
                alt="developer"
                className="w-10 h-10 rounded-full border-2 border-primary object-cover"
              />
            ))}

            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white text-xs font-semibold border-2 border-primary">
              +5K
            </div>
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-4xl font-bold text-gray-900 dark:text-text-primary">
          Join a growing community
        </h2>

        {/* Subtitle */}
        <p className="mt-4 text-gray-600 dark:text-text-secondary max-w-2xl mx-auto">
          Thousands of developers are already collaborating on real projects,
          shipping code, and building their careers on Gazzow.
        </p>

        {/* CTA */}
        <div className="mt-8">
          <a
            href={INSTAGRAM_LINK}
            target="_blank"
            className="
              inline-flex
              items-center
              gap-2
              px-8
              py-3
              rounded-xl
              font-medium
              text-white
              bg-gradient-to-r from-blue-500 to-blue-600
              hover:from-blue-600 hover:to-blue-700
              transition
              shadow-lg hover:shadow-xl
            "
          >
            Join the Community
            <ArrowRight size={18} />
          </a>
        </div>

      </div>
    </section>
  );
}