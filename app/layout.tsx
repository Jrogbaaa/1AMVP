import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { Providers } from "@/components/Providers";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: "swap", // Improve font loading performance
});

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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn(inter.variable)} suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        inter.variable
      )}>
        <Providers>
          <ConvexClientProvider>
            {children}
          </ConvexClientProvider>
        </Providers>
      </body>
    </html>
  );
}

