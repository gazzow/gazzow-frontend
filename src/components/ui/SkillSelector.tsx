"use client";

import { CreateProjectInput } from "@/validators/project-create";
import { useState } from "react";
import { FieldErrors } from "react-hook-form";

interface SkillSelectorProps {
  requiredSkills: string[];
  setRequiredSkills: (skills: string[]) => void;
  errors?: FieldErrors<CreateProjectInput>;
}

const techOptions: string[] = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Express",
  "MongoDB",
  "PostgreSQL",
  "TailwindCSS",
];

export default function SkillSelector({
  requiredSkills,
  setRequiredSkills,
  errors,
}: SkillSelectorProps) {
  const [query, setQuery] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  const filteredOptions = techOptions.filter(
    (skill) =>
      skill.toLowerCase().includes(query.toLowerCase()) &&
      !requiredSkills.includes(skill)
  );

  const handleSelect = (skill: string) => {
    setRequiredSkills([...requiredSkills, skill]);
    setQuery("");
    setOpen(false);
  };

  const removeSkill = (skill: string) => {
    setRequiredSkills(requiredSkills.filter((s) => s !== skill));
  };

  return (
    <div className="w-full relative space-y-2">
      <label className="block text-sm text-gray-400">Required Skills</label>

      {/* Selected Tags */}
      <div className="flex flex-wrap gap-2">
        {requiredSkills.map((skill) => (
          <span
            key={skill}
            className="bg-purple-600 text-white px-3 py-1 rounded-full flex items-center gap-2 text-sm"
          >
            {skill}
            <button
              onClick={() => removeSkill(skill)}
              aria-label={`Remove ${skill}`}
              className="text-white hover:text-gray-200 text-xs"
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
        className="w-full px-3 py-2 rounded-md bg-gray-800 text-gray-300 border border-gray-700
        focus:outline-none focus:border-purple-500"
      />

      {/* Dropdown */}
      {open && filteredOptions.length > 0 && (
        <ul className="absolute z-20 w-full bg-gray-900 border border-gray-700 mt-1 rounded-md max-h-40 overflow-y-auto shadow-lg">
          {filteredOptions.map((skill) => (
            <li
              key={skill}
              onClick={() => handleSelect(skill)}
              className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-gray-200"
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
