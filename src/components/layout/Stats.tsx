"use client";

export default function Stats() {
  return (
    <section
      className="
    py-16 sm:py-20
    bg-gray-50 dark:bg-primary
    transition-colors duration-200
  "
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
        {/* Heading */}
        <h2
          className="
        text-xl sm:text-2xl md:text-3xl lg:text-4xl
        font-semibold
        text-gray-900 dark:text-text-primary
      "
        >
          Our{" "}
          <span className="text-purple-600 dark:text-purple-400">Story</span>
        </h2>

        {/* Description */}
        <p
          className="
        mt-3 sm:mt-4
        text-sm sm:text-base
        text-gray-600 dark:text-text-muted
        max-w-md sm:max-w-xl md:max-w-2xl
        mx-auto leading-relaxed
      "
        >
          We believe that great software is built by great teams. Gazzow was
          created to break down barriers and connect talented developers with
          meaningful projects worldwide.
        </p>

        {/* Stats */}
        <div
          className="
        mt-10 sm:mt-14
        grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4
        gap-y-8 sm:gap-y-10
        gap-x-6 sm:gap-x-10
      "
        >
          {[
            { value: "50,000+", label: "Active Developers" },
            { value: "10,000+", label: "Projects Completed" },
            { value: "$2M+", label: "Total Payments" },
            { value: "100+", label: "Countries" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <h3
                className="
              text-xl sm:text-2xl md:text-3xl
              font-bold
              text-purple-600 dark:text-purple-400
            "
              >
                {stat.value}
              </h3>

              <p
                className="
              mt-1 sm:mt-2
              text-xs sm:text-sm
              text-gray-500 dark:text-text-muted
            "
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
