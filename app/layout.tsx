import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Lora, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { Providers } from "@/components/Providers";

const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ["latin"], 
  variable: "--font-sans",
  display: "swap",
});

const lora = Lora({ 
  subsets: ["latin"], 
  variable: "--font-serif",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://1another.com"),
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
  maximumScale: 5, // Allow zooming up to 5x for accessibility (WCAG 2.1 AA)
  userScalable: true, // Enable zooming for users with visual impairments
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
    <html lang="en" className={cn(plusJakartaSans.variable, lora.variable, ibmPlexMono.variable)} suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        plusJakartaSans.variable,
        lora.variable,
        ibmPlexMono.variable
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

