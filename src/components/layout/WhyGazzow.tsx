import { Zap, Globe, GitBranch } from "lucide-react";

export default function WhyGazzow() {
  const points = [
    {
      icon: GitBranch,
      title: "Collaborative Freelancing",
      desc: "Unlike traditional freelance platforms, Gazzow lets multiple developers contribute to the same project — each tackling tasks they excel at.",
    },
    {
      icon: Globe,
      title: "Task-Based Development",
      desc: "Projects are broken into focused tasks, making it easier to scope work, track progress, and deliver results incrementally.",
    },
    {
      icon: Zap,
      title: "Faster Delivery",
      desc: "With multiple skilled contributors working in parallel, projects ship faster without sacrificing quality.",
    },
  ];

  return (
    <section className="py-24 px-6 bg-white dark:bg-primary">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="text-sm font-semibold tracking-wider text-btn-primary uppercase">
            Why Gazzow
          </span>

          <h2 className="mt-3 text-4xl font-bold text-gray-900 dark:text-text-primary">
            Built different, by design
          </h2>

          <p className="mt-4 text-gray-600 dark:text-text-secondary">
            We rethought freelancing from the ground up for how developers
            actually work.
          </p>
        </div>

        {/* Cards */}
        <div className="space-y-8">
          {points.map((point, i) => {
            const Icon = point.icon;

            return (
              <div
                key={i}
                className="
                flex gap-6
                items-start
                p-8
                rounded-2xl
                border border-border-primary
                bg-white dark:bg-secondary/20
                transition
                hover:shadow-lg
                hover:-translate-y-0.5
                "
              >
                {/* Icon */}
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-btn-primary/10 text-btn-primary">
                  <Icon size={22} />
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary">
                    {point.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-text-secondary">
                    {point.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}