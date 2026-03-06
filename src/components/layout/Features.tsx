import {
  FolderKanban,
  Users,
  ListTodo,
  Star,
  MessageSquare,
  Wallet,
} from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: FolderKanban,
      title: "Project Posting",
      desc: "Create detailed projects with descriptions, deadlines, and budget breakdowns.",
    },
    {
      icon: ListTodo,
      title: "Task Collaboration",
      desc: "Break projects into granular tasks and let contributors pick what they’re best at.",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      desc: "Work with multiple contributors on a single project in real time.",
    },
    {
      icon: MessageSquare,
      title: "Built-in Communication",
      desc: "Discuss tasks, share updates, and resolve blockers without leaving the platform.",
    },
    {
      icon: Star,
      title: "Contributor Reputation",
      desc: "Build your profile with ratings, reviews, and a verified contribution history.",
    },
    {
      icon: Wallet,
      title: "Secure Payments",
      desc: "Escrow-based payments ensure contributors get paid for approved work.",
    },
  ];

  return (
    <section
      id="feature"
      className="py-24 px-6 bg-white dark:bg-primary"
    >
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="text-sm font-semibold tracking-wider text-blue-500 uppercase">
            Features
          </span>

          <h2 className="mt-3 text-4xl font-bold text-gray-900 dark:text-text-primary">
            Everything you need to collaborate
          </h2>

          <p className="mt-4 text-gray-600 dark:text-text-secondary">
            Tools designed for developers who want to build, contribute, and
            grow together.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => {
            const Icon = feature.icon;

            return (
              <div
                key={i}
                className="
                group
                p-7
                rounded-2xl
                border border-border-primary
                bg-white dark:bg-secondary/20
                transition
                hover:-translate-y-1
                hover:shadow-xl
                "
              >
                {/* Icon */}
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-btn-primary/10 text-btn-primary mb-5">
                  <Icon size={22} />
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-text-secondary">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}