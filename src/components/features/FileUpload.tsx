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
    console.log("handle file change trigger");
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    const allFiles = [...files, ...selectedFiles];
    setFiles(allFiles);
    onFilesChange(allFiles);
    console.log("all files: ", allFiles);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemove = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFilesChange(newFiles);
    console.log("new files: ", newFiles);
  };

  const handleViewFile = (file: File) => {
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL, "_blank");
  };

  return (
    <div className="space-y-3 rounded-2xl">
      <p className="text-md font-medium text-white mb-1">{label}</p>
      <label
        htmlFor="files"
        className="flex flex-col items-center justify-center w-full border-2 border-dashed border-border-primary rounded-xl p-6 text-center transition cursor-pointer"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
          id="files"
        />
        <span className="text-blue-400 hover:underline">
          Click to upload or drag and drop files
        </span>
      </label>

      {files.length > 0 && (
        <ul className="space-y-1">
          {files.map((file, i) => (
            <li
              key={i}
              className="flex items-center justify-between bg-primary/30 px-2 py-2 rounded-lg text-sm text-gray-300"
            >
              <span>{file.name}</span>
              <div className="flex gap-4">
                <button
                  onClick={() => handleViewFile(file)}
                  className="flex gap-2 hover:text-blue-300 text-xs cursor-pointer"
                >
                  <Eye size={18} />
                  <span>view</span>
                </button>
                <button
                  onClick={() => handleRemove(i)}
                  className="text-red-400 hover:text-red-500 text-xs cursor-pointer"
                >
                  <Trash size={18}/>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
