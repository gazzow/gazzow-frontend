"use client";
import { Eye, Trash } from "lucide-react";
import { useRef, useState } from "react";

interface IProjectFileUploadProp {
  label: string;
  onFilesChange: (files: File[]) => void;
}

export default function ProjectFileUpload({
  label,
  onFilesChange,
}: IProjectFileUploadProp) {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    const allFiles = [...files, ...selectedFiles];
    setFiles(allFiles);
    onFilesChange(allFiles);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemove = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFilesChange(newFiles);
  };

  const handleViewFile = (file: File) => {
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL, "_blank");
  };

  return (
    <div className="space-y-3 rounded-2xl">
      <p className="text-sm sm:text-md font-medium text-gray-800 dark:text-white">
        {label}
      </p>

      <label
        htmlFor="files"
        className="
    flex flex-col items-center justify-center w-full 
    border-2 border-dashed border-gray-300 dark:border-border-primary
    rounded-xl p-6 text-center transition
    bg-gray-50 dark:bg-primary/20
    hover:bg-gray-100 dark:hover:bg-primary/30
    cursor-pointer
    "
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
          id="files"
        />

        <span className="text-blue-500 dark:text-blue-400 text-sm">
          Click to upload or drag & drop files
        </span>

        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Supports multiple files
        </span>
      </label>

      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((file, i) => (
            <li
              key={i}
              className="
          flex flex-col sm:flex-row sm:items-center justify-between gap-2
          bg-white dark:bg-primary/30 
          border border-gray-200 dark:border-gray-700
          px-3 py-2 rounded-lg text-sm
          "
            >
              <span className="text-gray-700 dark:text-gray-300 truncate">
                {file.name}
              </span>

              <div className="flex gap-3">
                <button
                  onClick={() => handleViewFile(file)}
                  type="button"
                  className="flex items-center gap-1 bg-blue-100  px-2 py-1 rounded text-blue-500 dark:text-blue-800 hover:underline text-xs cursor-pointer"
                >
                  <Eye size={16} />
                  <span>View</span>
                </button>

                <button
                  onClick={() => handleRemove(i)}
                  type="button"
                  className="flex items-center gap-1 bg-red-100  px-2 py-1 rounded text-red-500 hover:text-red-600 text-xs cursor-pointer"
                >
                  <Trash size={16} />
                  <span>Remove</span>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
