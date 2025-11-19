import { Metadata } from "next";
import Link from "next/link";
import { HeartScore } from "@/components/HeartScore";
import { TrustBadge } from "@/components/TrustBadge";
import { SchemaMarkup } from "@/components/SchemaMarkup";
import { generateHowToSchema, generateBreadcrumbSchema } from "@/lib/schema";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Chest Health Tips | 1Another",
  description:
    "Learn essential chest health tips, warning signs, and preventive measures from medical professionals.",
  keywords: ["chest health", "heart health", "cardiology", "preventive care"],
};

const howToSteps = [
  "Monitor your blood pressure regularly",
  "Maintain a heart-healthy diet",
  "Exercise regularly (at least 30 minutes daily)",
  "Manage stress through relaxation techniques",
  "Get adequate sleep (7-9 hours per night)",
  "Avoid smoking and limit alcohol consumption",
];

const breadcrumbs = [
  { name: "Home", url: "https://1another.com" },
  { name: "Library", url: "https://1another.com/library" },
  { name: "Chest Health Tips", url: "https://1another.com/content/chest-health" },
];

export default function ChestHealthPage() {
  return (
    <>
      <SchemaMarkup schema={generateHowToSchema("How to Maintain Chest Health", howToSteps)} />
      <SchemaMarkup schema={generateBreadcrumbSchema(breadcrumbs)} />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="dashboard-container">
            <div className="flex items-center justify-between py-4">
              <Link href="/library" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Library</span>
              </Link>
              <HeartScore score={55} />
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="dashboard-container py-12">
          <article className="max-w-4xl mx-auto">
            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Essential Chest Health Tips
            </h1>

            {/* Meta info */}
            <div className="flex items-center gap-4 text-gray-500 text-sm mb-8">
              <span>Health Education</span>
              <span>•</span>
              <span>5 min read</span>
              <span>•</span>
              <span>Updated {new Date().toLocaleDateString()}</span>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                Understanding and maintaining chest health is crucial for overall well-being. This guide
                provides evidence-based tips and practices recommended by medical professionals.
              </p>

              <div className="bg-blue-50 border-l-4 border-primary-600 p-6 my-8">
                <p className="text-medical-trust font-semibold mb-2">Important Note:</p>
                <p className="text-gray-700">
                  If you experience chest pain, shortness of breath, or other concerning symptoms,
                  seek immediate medical attention. Call emergency services if symptoms are severe.
                </p>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">
                Key Steps to Maintain Chest Health
              </h2>

              <ol className="space-y-6">
                {howToSteps.map((step, index) => (
                  <li key={index} className="text-gray-700">
                    <strong className="text-gray-900">{step}</strong>
                    <p className="mt-2 text-gray-600">
                      {/* Add detailed descriptions for each step */}
                      Consistent practice of this step contributes significantly to maintaining optimal
                      cardiovascular health.
                    </p>
                  </li>
                ))}
              </ol>

              <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">
                Warning Signs to Watch For
              </h2>

              <ul className="space-y-3 text-gray-700">
                <li>Persistent chest pain or discomfort</li>
                <li>Shortness of breath during normal activities</li>
                <li>Irregular heartbeat or palpitations</li>
                <li>Unexplained fatigue or weakness</li>
                <li>Dizziness or lightheadedness</li>
              </ul>

              <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">
                When to Contact Your Doctor
              </h2>

              <p className="text-gray-700">
                Regular check-ups with your healthcare provider are essential for monitoring chest health.
                Schedule an appointment if you notice any persistent symptoms or have concerns about your
                cardiovascular health.
              </p>

              <div className="bg-primary-50 rounded-xl p-8 my-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Talk to Your Doctor
                </h3>
                <p className="text-gray-700 mb-6">
                  Your healthcare provider can create a personalized plan for maintaining optimal chest health
                  based on your individual needs and medical history.
                </p>
                <Link href="/account" className="btn-primary inline-block">
                  Schedule an Appointment
                </Link>
              </div>
            </div>

            {/* Trust badge */}
            <div className="mt-12 flex justify-center">
              <TrustBadge />
            </div>
          </article>
        </main>
      </div>
    </>
  );
}

