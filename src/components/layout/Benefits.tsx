import { Zap, DollarSign, Award, Globe } from "lucide-react";

export default function Benefits() {
  const benefits = [
    {
      icon: Zap,
      title: "Build Projects Faster",
      desc: "Leverage a network of contributors to accelerate development and hit your deadlines.",
    },
    {
      icon: DollarSign,
      title: "Earn by Contributing",
      desc: "Pick tasks that match your skills, complete them, and get paid — on your own schedule.",
    },
    {
      icon: Award,
      title: "Build Your Reputation",
      desc: "Every completed task earns ratings and reviews that strengthen your developer profile.",
    },
    {
      icon: Globe,
      title: "Collaborate Globally",
      desc: "Work with developers around the world, across time zones, on projects that matter.",
    },
  ];

  return (
    <section className="py-24 px-6 bg-white dark:bg-primary">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="text-sm font-semibold tracking-wider text-btn-primary uppercase">
            Benefits
          </span>

          <h2 className="mt-3 text-4xl font-bold text-gray-900 dark:text-text-primary">
            Outcomes that matter
          </h2>

          <p className="mt-4 text-gray-600 dark:text-text-secondary">
            {`
            Whether you're posting projects or contributing tasks, Gazzow
            delivers real results.`}
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-8 md:grid-cols-2">
          {benefits.map((benefit, i) => {
            const Icon = benefit.icon;

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
                hover:-translate-y-1
                hover:shadow-xl
                "
              >
                {/* Icon */}
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-green-500/10 text-green-400">
                  <Icon size={22} />
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary">
                    {benefit.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-text-secondary">
                    {benefit.desc}
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
