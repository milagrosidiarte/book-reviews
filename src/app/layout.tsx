import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { ToasterProvider } from "@/components/ui/ToasterProvider";
import SiteHeader from "@/components/site-header";

export const metadata: Metadata = {
  title: "Book Reviews",
  description: "Buscá libros y mirá detalles",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        <header className="border-b">
        </header>
        <main className="max-w-5xl mx-auto p-4">{children}</main>
        <ToasterProvider />
      </body>
    </html>
  );
}
