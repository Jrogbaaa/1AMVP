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
    slug: "understanding-dizziness",
    title: "Understanding Dizziness",
    description: "Dr. Rachel Martinez explains common causes of dizziness, when it's concerning, and what you can do about it.",
    videoPath: "/videos/education/Understanding Dizziness.mp4",
    category: "Neurology",
    tags: ["dizziness", "vertigo", "balance", "neurology"],
    publishedAt: "2026-01-27",
  },
  {
    slug: "blood-pressure-explained",
    title: "Blood Pressure Explained",
    description: "Dr. Rachel Martinez breaks down what blood pressure readings mean and how to keep yours in a healthy range.",
    videoPath: "/videos/education/Blood Pressure Explainerwith b roll.mp4",
    category: "Cardiology",
    tags: ["blood pressure", "heart health", "cardiology", "hypertension"],
    publishedAt: "2026-01-29",
  },
  {
    slug: "breathlessness-advice",
    title: "Breathlessness Advice",
    description: "Dr. Rachel Martinez discusses causes of breathlessness, when to be concerned, and what steps to take.",
    videoPath: "/videos/education/Breathlessness Advice.mp4",
    category: "Pulmonology",
    tags: ["breathlessness", "breathing", "lungs", "respiratory"],
    publishedAt: "2026-01-29",
  },
  {
    slug: "heartburn-explained",
    title: "Heartburn Explained",
    description: "Dr. Rachel Martinez explains what causes heartburn, how to manage it, and when to see a doctor.",
    videoPath: "/videos/education/Heartburn Explained.mp4",
    category: "Gastroenterology",
    tags: ["heartburn", "acid reflux", "digestion", "GERD"],
    publishedAt: "2026-01-29",
  },
  {
    slug: "understanding-allergies",
    title: "Understanding Allergies",
    description: "Dr. Rachel Martinez covers common allergies, their symptoms, and effective management strategies.",
    videoPath: "/videos/education/Understanding Allergies.mp4",
    category: "Immunology",
    tags: ["allergies", "immune system", "allergy symptoms", "antihistamines"],
    publishedAt: "2026-01-29",
  },
  {
    slug: "understanding-blood-sugar",
    title: "Understanding Blood Sugar Readings",
    description: "Dr. Rachel Martinez explains blood sugar levels, what they mean, and how to maintain healthy glucose levels.",
    videoPath: "/videos/education/Understanding Blood Sugar Readings.mp4",
    category: "Endocrinology",
    tags: ["blood sugar", "glucose", "diabetes", "metabolic health"],
    publishedAt: "2026-01-29",
  },
  {
    slug: "understanding-tummy-pain",
    title: "Understanding Tummy Pain",
    description: "Dr. Rachel Martinez discusses common causes of abdominal pain and when you should seek medical attention.",
    videoPath: "/videos/education/Understanding Tummy Pain.mp4",
    category: "Gastroenterology",
    tags: ["stomach pain", "abdominal pain", "digestion", "gut health"],
    publishedAt: "2026-01-29",
  },
];

export function getVideoBySlug(slug: string): EducationalVideo | undefined {
  return EDUCATIONAL_VIDEOS.find((video) => video.slug === slug);
}

export function getAllVideoSlugs(): string[] {
  return EDUCATIONAL_VIDEOS.map((video) => video.slug);
}
