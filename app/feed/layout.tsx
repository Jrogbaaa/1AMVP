import type { Metadata } from "next";

/**
 * Feed Route Metadata
 * 
 * Using Next.js Metadata API for SEO optimization
 */
export const metadata: Metadata = {
  title: "Your Personalized Health Feed | 1Another",
  description: "Watch personalized health videos from your doctors. Get follow-up care, educational content, and health reminders tailored just for you.",
  keywords: [
    "health videos",
    "doctor follow-up",
    "personalized healthcare",
    "patient education",
    "medical videos",
    "health feed",
    "cardiology",
    "heart health",
  ],
  openGraph: {
    title: "Your Personalized Health Feed | 1Another",
    description: "Watch personalized health videos from your doctors. Get follow-up care, educational content, and health reminders tailored just for you.",
    type: "website",
    url: "https://1another.com/feed",
    siteName: "1Another",
    images: [
      {
        url: "/images/og-feed.png",
        width: 1200,
        height: 630,
        alt: "1Another Health Feed",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Your Personalized Health Feed | 1Another",
    description: "Watch personalized health videos from your doctors.",
  },
  alternates: {
    canonical: "https://1another.com/feed",
  },
};

export default function FeedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

