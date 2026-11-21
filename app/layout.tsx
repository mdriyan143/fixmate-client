import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { Inter, Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "FixMate | Device & Home Appliance Repair",
  description: "Book verified technicians, track your repair and pay after the job is done.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem("theme")==="dark")document.documentElement.classList.add("dark")}catch(e){}`,
          }}
        />
      </head>
      <body className={inter.className}>
        {children}
        <Toaster position="top-right" richColors duration={2500} />
      </body>
    </html>
  );
}