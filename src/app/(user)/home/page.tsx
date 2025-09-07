"use client"

import { useAppSelector } from "@/store/store";

export default function Home() {
  const { name, experience } = useAppSelector((state) => state.user);
  return (
    <div className="w-full bg-white dark:bg-primary min-h-screen flex flex-col items-center justify-center text-black dark:text-white">
      <h1>Home page</h1>
      <h2>Welcome back, {name}!, you are a {experience} developer</h2>
    </div>
  );
}
