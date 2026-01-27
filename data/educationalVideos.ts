export interface EducationalVideo {
  slug: string;
  title: string;
  description: string;
  videoPath: string;
  thumbnailPath?: string;
  category?: string;
  tags?: string[];
  duration?: number;
  publishedAt: string;
}

// Add your educational videos here
// The slug will be used in the URL: /learn/{slug}
// Video files should be placed in /public/videos/education/
export const EDUCATIONAL_VIDEOS: EducationalVideo[] = [
  {
    slug: "skin-rashes",
    title: "Skin Rashes: When to Worry",
    description: "Dr. Rachel Martinez explains common skin rashes, what causes them, and when you should see a dermatologist.",
    videoPath: "/videos/education/Skin Rashes Advice.mp4",
    category: "Dermatology",
    tags: ["skin", "rashes", "dermatology", "skin health"],
    publishedAt: "2026-01-27",
  },
];

export function getVideoBySlug(slug: string): EducationalVideo | undefined {
  return EDUCATIONAL_VIDEOS.find((video) => video.slug === slug);
}

export function getAllVideoSlugs(): string[] {
  return EDUCATIONAL_VIDEOS.map((video) => video.slug);
}
