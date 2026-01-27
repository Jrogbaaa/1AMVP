import { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import {
  getVideoBySlug,
  getAllVideoSlugs,
} from "@/data/educationalVideos";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllVideoSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const video = getVideoBySlug(slug);

  if (!video) {
    return {
      title: "Video Not Found | 1Another",
    };
  }

  return {
    title: `${video.title} | 1Another`,
    description: video.description,
    openGraph: {
      title: video.title,
      description: video.description,
      type: "video.other",
      images: video.thumbnailPath ? [video.thumbnailPath] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: video.title,
      description: video.description,
    },
  };
}

export default async function LearnVideoPage({ params }: PageProps) {
  const { slug } = await params;
  const video = getVideoBySlug(slug);

  if (!video) {
    notFound();
  }

  // Redirect to the feed - the video is included in the feed
  redirect("/feed");
}
