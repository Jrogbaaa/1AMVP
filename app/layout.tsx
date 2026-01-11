import type { Metadata, Viewport } from "next";
import { Manrope, IBM_Plex_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { Providers } from "@/components/Providers";

// AirbnbCereal for headings (local font)
const airbnbCereal = localFont({
  src: [
    {
      path: "../public/fonts/AirbnbCereal_W_Lt.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/AirbnbCereal_W_Bk.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/AirbnbCereal_W_Md.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/AirbnbCereal_W_Bd.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/AirbnbCereal_W_XBd.otf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../public/fonts/AirbnbCereal_W_Blk.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-heading",
  display: "swap",
});

// Manrope for body text (Google Fonts)
const manrope = Manrope({ 
  subsets: ["latin"], 
  variable: "--font-sans",
  display: "swap",
});

// IBM Plex Mono for code
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
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1D1D1D" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="en" 
      className={cn(
        airbnbCereal.variable, 
        manrope.variable, 
        ibmPlexMono.variable
      )} 
      suppressHydrationWarning
    >
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        manrope.className
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
