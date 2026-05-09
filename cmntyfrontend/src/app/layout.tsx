import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const bricolage = Bricolage_Grotesque({ 
  subsets: ["latin"],
  variable: "--font-bricolage" 
});

export const metadata: Metadata = {
  title: "cmnty | Connect and Create",
  description: "Club and Event Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className={`${bricolage.variable} antialiased overflow-x-hidden selection:bg-primary-container selection:text-on-primary-fixed`} style={{ fontFamily: 'var(--font-bricolage)' }}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
