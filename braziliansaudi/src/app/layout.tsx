import type { Metadata } from "next";
import "./globals.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export const metadata: Metadata = {
  title: "Saudi Clubs — Foreign News Monitor",
  description:
    "Curated foreign media about Saudi clubs. Read, assess, and help separate signal from noise.",
  keywords: ["Saudi Pro League", "Saudi clubs", "foreign news", "football"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}