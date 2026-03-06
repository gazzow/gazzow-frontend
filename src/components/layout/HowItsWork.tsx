import { FolderPlus, ListTodo, DollarSign } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: FolderPlus,
      title: "Post a Project",
      description:
        "Create a project and break it down into tasks that contributors can pick and work on.",
    },
    {
      icon: ListTodo,
      title: "Developers Contribute",
      description:
        "Developers join the project, pick tasks, collaborate with the team, and submit their work.",
    },
    {
      icon: DollarSign,
      title: "Approve & Get Paid",
      description:
        "Once the task is completed and approved by the creator, contributors receive payment.",
    },
  ];

  return (
    <section  id="How It Works" className="py-16 px-6 bg-white dark:bg-primary">
      <div className="max-w-6xl mx-auto">

        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-text-primary">
            How Gazzow Works
          </h2>
          <p className="mt-3 text-gray-600 dark:text-text-secondary max-w-xl mx-auto">
            Gazzow makes it easy for developers to collaborate on projects,
            contribute to tasks, and get paid for their work.
          </p>
        </div>

        {/* Steps */}
        <div className="grid gap-8 md:grid-cols-3">

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={index}
                className="p-6 rounded-xl border border-border-primary bg-gray-50 dark:bg-secondary/20 transition hover:shadow-lg"
              >
                {/* Icon */}
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-btn-primary text-white mb-4">
                  <Icon size={22} />
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="mt-2 text-sm text-gray-600 dark:text-text-secondary leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
}