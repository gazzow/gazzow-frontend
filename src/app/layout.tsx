import { Metadata } from "next";
import { ThemeProvider } from "@/providers/ThemeProvider";
import "./globals.css";
import ToastProvider from "@/providers/ToastProvider";
import ReduxProvider from "@/providers/ReduxProvider";
import { SocketProvider } from "@/providers/SocketProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://gazzow.online"),

  title: {
    default: "Gazzow | Collaborate, Build & Deliver Projects Seamlessly",
    template: "%s | Gazzow",
  },

  description:
    "Gazzow is a collaborative freelance platform where developers, teams, and clients manage projects, tasks, meetings, payments, and communication in one unified workspace.",

  keywords: [
    "Gazzow",
    "freelance collaboration platform",
    "project management for developers",
    "team collaboration tool",
    "task management",
    "freelance workspace",
    "remote team collaboration",
    "developer marketplace",
  ],

  authors: [{ name: "Gazzow Team" }],
  creator: "Gazzow",
  publisher: "Gazzow",

  openGraph: {
    title: "Gazzow | Build Together Without Chaos",
    description:
      "Manage projects, collaborate with contributors, schedule meetings, communicate, and track payments — all in one unified workspace for project creators and contributors.",
    url: "https://gazzow.online",
    siteName: "Gazzow",
    images: [
      {
        url: "/images/main-bg.png", 
        width: 1200,
        height: 630,
        alt: "Gazzow Collaboration Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Gazzow | Project Collaboration Platform",
    description:
      "A unified platform for project creators and contributors to manage projects, meetings, tasks, and payments.",
    images: ["/images/main-bg.png"],
  },

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical: "https://gazzow.online",
  },

  icons: {
    icon: "/icons/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/icons/apple-touch-icon.png",
  },

  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-white dark:bg-primary font-sans transition ease-in-out">
        <ThemeProvider>
          <ReduxProvider>
            <SocketProvider>
              <ToastProvider>{children}</ToastProvider>
            </SocketProvider>
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
