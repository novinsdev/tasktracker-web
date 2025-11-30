import "./globals.css";
import type { Metadata } from "next";
import { PageShell } from "@/components/ui/page-shell";

export const metadata: Metadata = {
  title: "Task & Time Tracker",
  description: "Developer-friendly UI for Task & Time Tracker API",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <PageShell>{children}</PageShell>
      </body>
    </html>
  );
}
