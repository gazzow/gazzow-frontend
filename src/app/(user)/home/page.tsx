"use client"

import { useAppSelector } from "@/store/store";

export default function Home() {
  const { name } = useAppSelector((state) => state.user);
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center text-white">
      <h1>Home page</h1>
      <h2>Welcome back, {name}!</h2>
    </div>
  );
}
