import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hook/useTheme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="
    p-2 rounded-xl cursor-pointer
    transition-all duration-200 ease-in-out
    active:scale-95

    bg-slate-100 hover:bg-slate-200
    dark:bg-slate-800 dark:hover:bg-slate-700

    text-slate-700 dark:text-slate-200
    shadow-sm hover:shadow-md
  "
    >
      {theme === "light" ? (
        <Sun size={22} className="text-amber-500" />
      ) : (
        <Moon size={22} className="text-slate-300" />
      )}
    </button>
  );
}
