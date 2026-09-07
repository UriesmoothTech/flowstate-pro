import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FlowState Pro | UriesmoothTech",
  description:
    "FlowState Pro — intelligent workflow orchestration by UriesmoothTech."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
