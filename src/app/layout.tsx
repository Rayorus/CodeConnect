import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CodeConnect — Social Network for LeetCoders",
  description:
    "Connect with fellow LeetCode users, track progress, share doubts, and grow together.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-lc-bg text-lc-text antialiased">
        {children}
      </body>
    </html>
  );
}
