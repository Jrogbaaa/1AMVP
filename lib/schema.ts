import type { Video, Doctor } from "./types";

export const generateVideoSchema = (video: Video) => {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    description: video.description,
    thumbnailUrl: video.thumbnailUrl,
    uploadDate: video.createdAt,
    duration: video.duration ? `PT${video.duration}S` : undefined,
    contentUrl: video.videoUrl,
  };
};

export const generateDoctorSchema = (doctor: Doctor) => {
  return {
    "@context": "https://schema.org",
    "@type": "Physician",
    name: `Dr. ${doctor.name}`,
    medicalSpecialty: doctor.specialty,
    image: doctor.avatarUrl,
    telephone: doctor.phone,
    email: doctor.email,
    worksFor: doctor.clinicName
      ? {
          "@type": "MedicalOrganization",
          name: doctor.clinicName,
          address: doctor.clinicAddress
            ? {
                "@type": "PostalAddress",
                streetAddress: doctor.clinicAddress,
              }
            : undefined,
        }
      : undefined,
  };
};

export const generateOrganizationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalOrganization",
    name: "1Another",
    description:
      "Personalized patient communication and education platform connecting patients with their doctors",
    url: "https://1another.com",
    logo: "https://1another.com/logo.png",
    sameAs: [
      // Add social media links when available
    ],
  };
};

export const generateHealthConditionSchema = (condition: string) => {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalCondition",
    name: condition,
  };
};

export const generateHowToSchema = (title: string, steps: string[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: title,
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      text: step,
    })),
  };
};

export const generateFAQSchema = (faqs: Array<{ question: string; answer: string }>) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
};

export const generateBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
};

