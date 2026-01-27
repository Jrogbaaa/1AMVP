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
  {
    slug: "understanding-dizziness",
    title: "Understanding Dizziness",
    description: "Dr. Rachel Martinez explains common causes of dizziness, when it's concerning, and what you can do about it.",
    videoPath: "/videos/education/Understanding Dizziness.mp4",
    category: "Neurology",
    tags: ["dizziness", "vertigo", "balance", "neurology"],
    publishedAt: "2026-01-27",
  },
  {
    slug: "understanding-fatigue",
    title: "Understanding Fatigue",
    description: "Dr. Rachel Martinez discusses the common causes of fatigue and when you should talk to your doctor about it.",
    videoPath: "/videos/education/Understanding Fatigue.mp4",
    category: "General Health",
    tags: ["fatigue", "energy", "tiredness", "wellness"],
    publishedAt: "2026-01-27",
  },
  {
    slug: "chest-pain-advice",
    title: "Chest Pain Advice",
    description: "Dr. Rachel Martinez explains different types of chest pain, when to seek emergency care, and what to expect.",
    videoPath: "/videos/education/Chest Pain Advice.mp4",
    category: "Cardiology",
    tags: ["chest pain", "heart", "symptoms", "cardiology"],
    publishedAt: "2026-01-27",
  },
  {
    slug: "managing-constipation",
    title: "Managing Constipation",
    description: "Dr. Rachel Martinez shares tips for managing constipation and when digestive issues need medical attention.",
    videoPath: "/videos/education/Managing Constipation.mp4",
    category: "Gastroenterology",
    tags: ["constipation", "digestion", "gut health", "gastroenterology"],
    publishedAt: "2026-01-27",
  },
];

export function getVideoBySlug(slug: string): EducationalVideo | undefined {
  return EDUCATIONAL_VIDEOS.find((video) => video.slug === slug);
}

export function getAllVideoSlugs(): string[] {
  return EDUCATIONAL_VIDEOS.map((video) => video.slug);
}
