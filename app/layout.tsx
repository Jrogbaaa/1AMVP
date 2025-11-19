import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "1Another - Your Doctor's Follow-Up Portal",
  description: "Personalized patient communication and education from your doctor",
  keywords: ["healthcare", "patient portal", "doctor follow-up", "medical education"],
  authors: [{ name: "1Another" }],
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://1another.com",
    title: "1Another - Your Doctor's Follow-Up Portal",
    description: "Personalized patient communication and education from your doctor",
    siteName: "1Another",
  },
  twitter: {
    card: "summary_large_image",
    title: "1Another - Your Doctor's Follow-Up Portal",
    description: "Personalized patient communication and education from your doctor",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn(inter.variable)}>
      <body className="min-h-screen">
        <ConvexClientProvider>
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  );
}

