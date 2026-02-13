import { GithubIcon, Instagram, Mail } from "lucide-react";
import Link from "next/link";

const links = [
  {
    title: "Product",
    links: ["Features", "Projects", "Pricing", "API"],
  },
  { title: "Company", links: ["About", "Blog", "Careers"] },
  {
    title: "Support",
    links: ["Help Center", "Contact", "Community", "Status"],
  },
  {
    title: "Legal",
    links: ["Privacy Policy", "Terms", "Cookies", "GDPR"],
  },
];

const socialLinks = [
  { icon: <GithubIcon size={18}></GithubIcon>, label: "github", href: "" },
  { icon: <Instagram size={18}></Instagram>, label: "instagram", href: "" },
  { icon: <Mail size={18}></Mail>, label: "mail", href: "" },
];

export default function Footer() {
  return (
    <footer
      className="
  bg-white dark:bg-primary
  text-gray-900 dark:text-text-primary
  border-t border-gray-200 dark:border-secondary
  transition-colors duration-300
"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-12">
        {/* Top */}
        <div className="grid gap-10 md:gap-5 grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand */}
          <div className="sm:col-span-1 space-y-4">
            <Link
              href="/"
              className="text-2xl font-bold text-btn-primary hover:text-btn-primary-hover"
            >
              Gazzow
            </Link>

            <p className="text-gray-600 dark:text-text-muted text-sm leading-relaxed max-w-sm">
              Empowering developers worldwide to collaborate, build amazing
              projects, and earn from their skills.
            </p>

            {/* Social */}
            <div className="flex gap-3 pt-2 flex-wrap">
              {socialLinks.map(({ icon }, i) => (
                <div
                  key={i}
                  className="
              w-9 h-9 flex items-center justify-center
              rounded-lg
              bg-gray-100 dark:bg-secondary
              hover:bg-purple-100 dark:hover:bg-purple-500/10
              transition cursor-pointer
              "
                >
                  <span className="text-xs text-gray-500 dark:text-text-muted">
                    {icon}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          {links.map((section, idx) => (
            <div key={idx}>
              <h4 className="font-medium mb-3">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, i) => (
                  <li
                    key={i}
                    className="
                text-sm
                text-gray-600 dark:text-text-muted
                hover:text-purple-600 dark:hover:text-purple-400
                transition cursor-pointer
                "
                  >
                    {link}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div
          className="
    mt-10 pt-6 border-t
    border-gray-200 dark:border-secondary
    flex flex-col sm:flex-row
    justify-center sm:justify-between
    items-center gap-2 sm:gap-4
    text-sm
    text-gray-500 dark:text-text-muted
  "
        >
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} Gazzow. All rights reserved.
          </p>

          <p className="text-center sm:text-right">
            Built with ❤️ for developers, by a developer
          </p>
        </div>
      </div>
    </footer>
  );
}
