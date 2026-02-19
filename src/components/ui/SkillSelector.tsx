"use client";

import { techOptions } from "@/utils/tech-stacks";
import { CreateProjectInput } from "@/validators/project-create";
import { useEffect, useRef, useState } from "react";
import { FieldErrors } from "react-hook-form";

interface SkillSelectorProps {
  requiredSkills: string[];
  setRequiredSkills: (skills: string[]) => void;
  errors?: FieldErrors<CreateProjectInput>;
}

export default function SkillSelector({
  requiredSkills,
  setRequiredSkills,
  errors,
}: SkillSelectorProps) {
  const [query, setQuery] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const dropdownRef = useRef<null | HTMLUListElement>(null);

  useEffect(() => {
    const handleMouseDownEvent = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as HTMLElement)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleMouseDownEvent);

    return () =>
      document.removeEventListener("mousedown", handleMouseDownEvent);
  }, []);

  const filteredOptions = techOptions.filter(
    (skill) =>
      skill.toLowerCase().includes(query.toLowerCase()) &&
      !requiredSkills.includes(skill),
  );

  const handleSelect = (skill: string) => {
    setRequiredSkills([...requiredSkills, skill]);
    setQuery("");
  };

  const removeSkill = (skill: string) => {
    setRequiredSkills(requiredSkills.filter((s) => s !== skill));
  };

  return (
    <div className="w-full relative space-y-2">
      <label className="block text-sm text-gray-600 dark:text-gray-400">
        Required Skills
      </label>

      {/* Selected Tags */}
      <div className="flex flex-wrap gap-2">
        {requiredSkills.map((skill) => (
          <span
            key={skill}
            className="bg-purple-600 text-white px-3 py-1 rounded-full flex items-center gap-2 text-xs sm:text-sm"
          >
            {skill}
            <button
              onClick={() => removeSkill(skill)}
              aria-label={`Remove ${skill}`}
              className="text-white/80 hover:text-white text-xs cursor-pointer"
            >
              ✕
            </button>
          </span>
        ))}
      </div>

      {/* Input */}
      <input
        type="text"
        value={query}
        placeholder="Search skill..."
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        className="w-full px-3 py-2 rounded-lg text-sm
    bg-gray-50 dark:bg-[#0f1624]
    text-gray-900 dark:text-gray-100
    placeholder:text-gray-400 dark:placeholder:text-gray-500
    border border-gray-300 dark:border-[#1f2937]
    focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
      />

      {/* Dropdown */}
      {open && filteredOptions.length > 0 && (
        <ul
          ref={dropdownRef}
          className="absolute z-20 w-full mt-1 rounded-lg max-h-40 overflow-y-auto custom-scroll
    bg-white dark:bg-[#0f1624]
    border border-gray-200 dark:border-[#1f2937]
    shadow-lg"
        >
          {filteredOptions.map((skill) => (
            <li
              key={skill}
              onClick={() => handleSelect(skill)}
              className="px-4 py-2 text-sm
          text-gray-700 dark:text-gray-200
          hover:bg-gray-100 dark:hover:bg-[#1a2235]
          cursor-pointer transition"
            >
              {skill}
            </li>
          ))}
        </ul>
      )}

      {/* Validation */}
      {errors?.requiredSkills && (
        <p className="text-red-500 text-xs">{errors.requiredSkills.message}</p>
      )}
    </div>
  );
}
