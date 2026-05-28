import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-inter'});

const bricoGrot = Bricolage_Grotesque({
  variable: "--font-brico-grot",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Veda AI Assignment",
  description: "Generate Question Paper in Minutes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", bricoGrot.variable, "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
