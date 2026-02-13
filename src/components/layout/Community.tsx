"use client";

export default function Community() {
  return (
    <section
      className="
    relative
    py-16 sm:py-20 lg:py-24
    bg-gray-50 dark:bg-primary
    transition-colors duration-300
  "
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Heading */}
        <h2
          className="
        text-xl sm:text-2xl md:text-3xl lg:text-4xl
        font-semibold
        text-gray-900 dark:text-text-primary
        leading-tight
      "
        >
          Ready to be part of the{" "}
          <span className="text-purple-600 dark:text-purple-400">future?</span>
        </h2>

        {/* Subtext */}
        <p
          className="
        mt-3 sm:mt-4
        text-sm sm:text-base
        text-gray-600 dark:text-text-muted
        max-w-md sm:max-w-xl md:max-w-2xl
        mx-auto leading-relaxed
      "
        >
          Join thousands of developers who are already building amazing projects
          and earning from their skills on Gazzow.
        </p>

        {/* CTA */}
        <div className="mt-6 sm:mt-8 flex justify-center">
          <button
            className="
          w-full sm:w-auto
          px-6 sm:px-8
          py-2.5 sm:py-3
          rounded-lg sm:rounded-xl
          text-white
          text-sm sm:text-base
          font-medium
          bg-gradient-to-r from-purple-600 to-indigo-600
          hover:from-purple-700 hover:to-indigo-700
          shadow-md hover:shadow-lg
          transition-all duration-300
        "
          >
            Join Our Community
          </button>
        </div>
      </div>
    </section>
  );
}
