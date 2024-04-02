"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import StoryProvider from "@/lib/context/StoryContext";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StoryProvider>{children}</StoryProvider>
      </body>
    </html>
  );
}
