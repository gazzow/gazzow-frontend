'use client'

import { useTheme } from "@/hook/useTheme";
import React from "react";
import { ToastContainer } from "react-toastify";

export default function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {

    const {theme} = useTheme()

  return (
    <>
      {children}
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        theme={theme === 'dark' ? 'dark': 'light'}
      />
    </>
  );
}
